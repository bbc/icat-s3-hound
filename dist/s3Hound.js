"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Hound = void 0;
const events_1 = require("events");
const bind_1 = require("./bind");
const DefaultFactory = require("./simpleS3Factory");
const CONT_TOKEN = 'ContinuationToken';
const MAX_KEYS = 1000;
class S3Hound extends events_1.EventEmitter {
    constructor(params) {
        super();
        this.filters = [];
        this.maxKeys = MAX_KEYS;
        this.s3Factory = params.s3Factory || DefaultFactory;
        this.bucket = params.bucket;
        this.maxRequests = params.maxRequests || Infinity;
        this._prefix = params.prefix;
        this._limit = params.limit || Infinity;
        (0, bind_1.bind)(this);
    }
    static newQuery(params) {
        return new S3Hound(params);
    }
    prefix(prefix) {
        if (!prefix) {
            throw new Error('Prefix should not be absent.');
        }
        this._prefix = prefix;
        return this;
    }
    limit(n) {
        if (n < 1) {
            throw new Error('limit must be >= 1');
        }
        this._limit = n;
        return this;
    }
    async find() {
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
            if (keysFetched <= this._limit) {
                this.emit('batch', keys);
                keysEmitted += keys.length;
            }
            else {
                const diff = this._limit - keysEmitted;
                const toEmit = keys.slice(0, diff);
                this.emit('batch', toEmit);
                keysEmitted += toEmit.length;
            }
            params[CONT_TOKEN] = reply.NextContinuationToken;
        } while (keysFetched < this._limit && reply.IsTruncated);
        res.contents = res.contents.slice(0, this._limit);
        return res;
    }
    getListObjectParams() {
        const params = {
            Bucket: this.bucket,
            MaxKeys: this.maxKeys
        };
        if (this._prefix) {
            params.Prefix = this._prefix;
        }
        return params;
    }
    composeFilters() {
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
exports.S3Hound = S3Hound;
