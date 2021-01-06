import {Response} from './types';

export interface CloudHound {
  find(): Promise<Response>;
}
