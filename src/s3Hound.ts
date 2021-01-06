import {S3} from 'aws-sdk';
import {EventEmitter} from 'events';
import {bind} from './bind';
import * as DefaultFactory from './simpleS3Factory';
import {CloudHound, Nullable, Response, S3Factory, S3HoundParams} from './types';

const CONT_TOKEN = 'ContinuationToken';

export class S3Hound extends EventEmitter implements CloudHound {
  private readonly s3Factory: S3Factory;
  private s3Client: S3;
  private readonly bucket: string;
  private readonly filters: any;
  private readonly maxRequests: number;
  private readonly maxKeys: number;
  private readonly prefix: Nullable<string>;
  private readonly limit: number;

  constructor(params: S3HoundParams) {
    super();
    this.filters = [];
    this.maxKeys = 1000;
    this.s3Factory = params.s3Factory || DefaultFactory;
    this.bucket = params.bucket;
    this.maxRequests = params.maxRequests || Infinity;
    this.prefix = params.prefix;
    this.limit = params.limit || Infinity;
    bind(this);
  }

  public static newQuery(params: S3HoundParams): CloudHound {
    return new S3Hound(params);
  }

  async find(): Promise<Response> {
    const compose = this.composeFilters;
    const params = this.getListObjectParams();
    this.s3Client = await this.s3Factory.getClient();

    let reply;
    const res = {
      maxRequests: this.maxRequests,
      maxKeys: this.maxKeys,
      contents: []
    };
    let keysFetched = 0;
    let keysEmitted = 0;
    do {
      reply = await this.s3Client
        .listObjectsV2(params)
        .promise();

      const keys = reply.Contents.filter(compose());
      keysFetched += keys.length;
      res.contents = res.contents.concat(keys);
      if (keysFetched <= this.limit) {
        this.emit('batch', keys);
        keysEmitted += keys.length;
      } else {
        const diff = this.limit - keysEmitted;
        const toEmit = keys.slice(0, diff);
        this.emit('batch', toEmit);
        keysEmitted += toEmit.length;
      }

      params[CONT_TOKEN] = reply.NextContinuationToken;
    } while (keysFetched < this.limit && reply.IsTruncated);

    res.contents = res.contents.slice(0, this.limit);

    return res;
  }

  private getListObjectParams(): S3.Types.ListObjectsV2Request {
    const params: S3.Types.ListObjectsV2Request = {
      Bucket: this.bucket,
      MaxKeys: this.maxKeys
    };

    if (this.prefix) {
      params.Prefix = this.prefix;
    }

    return params;
  }

  private composeFilters(): any {
    const filters = this.filters;

    return (entry) => {
      let match = true;
      for (const filter of filters) {
        match = match && filter(entry);
      }
      return match;
    };
  }
}
