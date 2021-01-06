import {Response} from './types';

export interface CloudHound {
  find(): Promise<Response>;
  // ext(ext: string): CloudHound;
  // maxRequests(n: number): CloudHound;
  // maxKeys(n: number): CloudHound;
  // filter(fn: (obj: object) => {}): CloudHound;
  // paths(path: string[], delimiter: string): CloudHound;
  // buckets(...buckets: string[]): CloudHound;
  // match(pattern: RegExp): CloudHound;
  // modified(date: Date): CloudHound;
  // size(bytes: number): CloudHound;
}
