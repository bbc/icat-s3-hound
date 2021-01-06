import * as AWS from 'aws-sdk';
import {assert} from 'chai';
import * as sinon from 'sinon';
import {S3Hound} from '../src/s3Hound';
import * as SimpleS3Factory from '../src/simpleS3Factory';

const sandbox = sinon.sandbox.create();
const results = require('./fixtures/basic');
const page1 = require('./fixtures/page1');
const page2 = require('./fixtures/page2');
const page3 = require('./fixtures/page3');

AWS.config.update({ region: 'eu-west-1' });

describe('S3Hound', async () => {
  let getClient;
  beforeEach(() => {
    getClient = sandbox.stub(SimpleS3Factory, 'getClient').returns({
      listObjectsV2: () => {
        return {
          promise: async () => {
            return results;
          }
        };
      }
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns the contents for a given bucket', async () => {
    const cloudHound = new S3Hound({
      s3Factory: SimpleS3Factory,
      bucket: 'myBucket'
    });
    const response = await cloudHound.find();

    assert.equal(response.contents.length, 3);
  });

  it('requests multiple pages', async () => {
    const pageStack = [page3, page2, page1];
    getClient.returns({
      listObjectsV2: () => {
        return {
          promise: async () => {
            return pageStack.pop();
          }
        };
      }
    });

    const cloudhound = new S3Hound({
      s3Factory: SimpleS3Factory,
      bucket: 'myBucket'
    });
    const response = await cloudhound.find();

    assert.equal(response.contents.length, 9);
  });

  // describe('.ext', () => {
  //   it('returns entries matching a given file extension', async () => {
  //     const cloudhound = S3Hound.create(sdk);
  //
  //     const results: Results = await cloudhound
  //       .buckets('myBucket')
  //       .ext('jpg')
  //       .find();
  //
  //     for (const entry of results.entries) {
  //       assert.match(entry.key, /\.jpg$/);
  //     }
  //   });
  // });
  //
  // describe('.maxRequests', () => {
  //   it('limits the number of requests', async () => {
  //     const requests = 1;
  //     const results: Results = await S3Hound.create(sdk)
  //       .buckets('myBucket')
  //       .maxRequests(requests)
  //       .find();
  //
  //     assert.equal(results.entries.length, 3);
  //     sinon.assert.callCount(sdk.listObjectsV2, 1);
  //   });
  // });
  //
  // describe('.maxKeys', () => {
  //   it('sets the max number of keys per response', async () => {
  //     const cloudhound = S3Hound.create(sdk);
  //     const maxKeys = 3;
  //     const results: Results = await cloudhound
  //       .buckets('myBucket')
  //       .maxKeys(maxKeys)
  //       .find();
  //
  //     sinon.assert.calledWith(sdk.listObjectsV2, sinon.match({
  //       MaxKeys: maxKeys
  //     }));
  //   });
  // });
});
