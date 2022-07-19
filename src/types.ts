import { S3 } from 'aws-sdk';

export type Nullable<T> = T | undefined | null;

export interface S3HoundParams {
  bucket: string;
  prefix?: string;
  maxRequests?: number;
  limit?: number;
  s3Factory?: S3Factory;
}

export interface CloudHound {
  // eslint-disable-next-line no-unused-vars
  limit(n: number): CloudHound;
  // eslint-disable-next-line no-unused-vars
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
