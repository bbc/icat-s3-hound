/// <reference types="node" />
import { EventEmitter } from 'events';
import { CloudHound, Response, S3HoundParams } from './types';
export declare class S3Hound extends EventEmitter implements CloudHound {
    private readonly s3Factory;
    private s3Client;
    private readonly bucket;
    private readonly filters;
    private readonly maxRequests;
    private readonly maxKeys;
    private _prefix;
    private _limit;
    constructor(params: S3HoundParams);
    static newQuery(params: S3HoundParams): CloudHound;
    prefix(prefix: string): CloudHound;
    limit(n: number): CloudHound;
    find(): Promise<Response>;
    private getListObjectParams;
    private composeFilters;
}
