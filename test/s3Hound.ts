import * as AWS from 'aws-sdk';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { S3Hound } from '../src/s3Hound';
import * as SimpleS3Factory from '../src/simpleS3Factory';

const sandbox = sinon.sandbox.create();
const results = require('./fixtures/basic');
const page1 = require('./fixtures/page1');
const page2 = require('./fixtures/page2');
const page3 = require('./fixtures/page3');

AWS.config.update({ region: 'eu-west-1' });

describe('S3Hound', async () => {
  let getClient;
  let cloudHound;
  let s3Client;
  let listStub;
  beforeEach(() => {
    cloudHound = S3Hound.newQuery({ bucket: 'myBucket' });
    listStub = sandbox.stub().resolves(results);
    s3Client = {
      listObjectsV2: sinon.stub().returns({ promise: listStub })
    };
    getClient = sandbox.stub(SimpleS3Factory, 'getClient').resolves(s3Client);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('All objects', () => {
    it('returns the contents for a given bucket', async () => {
      const response = await cloudHound.find();
      assert.equal(response.contents.length, 3);
    });

    it('returns the contents for a given bucket using constructor', async () => {
      const response = await cloudHound.find();
      assert.equal(response.contents.length, 3);
    });

    it('requests multiple pages', async () => {
      const pageStack = [page3, page2, page1];
      getClient.resolves({
        listObjectsV2: () => {
          return {
            promise: async (): Promise<any> => {
              return pageStack.pop();
            }
          };
        }
      });
      const response = await cloudHound.find();

      assert.equal(response.contents.length, 9);
    });
  });

  describe('.prefix', () => {
    it('returns the contents for a given bucket', async () => {
      await cloudHound
        .prefix('json')
        .find();

      sinon.assert.calledWith(s3Client.listObjectsV2, sinon.match({ Prefix: 'json' }));
    });

    it('throws for an empty prefix', async () => {
      assert.throw(() => {
        cloudHound.prefix('');
      });
    });
  });

  describe('.limit', () => {
    it('returns the contents for a given bucket', async () => {
      const res = await cloudHound
        .limit(1)
        .find();

      assert.equal(res.contents.length, 1);
    });

    it('throws when limit is zero', async () => {
      assert.throws(() => {
        cloudHound.limit(0);
      });
    });
  });
});
