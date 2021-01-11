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

AWS.config.update({region: 'eu-west-1'});

describe('S3Hound', async () => {
  let getClient;
  let cloudHound;

  beforeEach(() => {
    cloudHound = S3Hound.newQuery({bucket: 'myBucket'});

    getClient = sandbox.stub(SimpleS3Factory, 'getClient').resolves({
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
            promise: async () => {
              return pageStack.pop();
            }
          };
        }
      });
      const response = await cloudHound.find();

      assert.equal(response.contents.length, 9);
    });
  });
});
