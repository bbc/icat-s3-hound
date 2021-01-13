import {S3} from 'aws-sdk';

export type Nullable<T> = T | undefined | null;

export interface S3HoundParams {
  bucket: string;
  prefix?: string;
  maxRequests?: number;
  limit?: number;
  s3Factory?: S3Factory;
}

export interface CloudHound {
  limit(n: number): CloudHound;
  prefix(prefix: string): CloudHound;
  find(): Promise<Response>;
}

export interface S3Factory {
  getClient(): Promise<S3>;
}

export interface Response {
  maxRequests: number;
  maxKeys: number;
  contents: any[];
}
