# Archived

We are archiving this repo as the s3 key lister will be taking over from cloudhound https://github.com/bbc/iplayer-catalogue/tree/main/libs/s3-key-lister.

# Cloudhound

![npm](https://img.shields.io/npm/v/cloudhound.svg)
[![Build Status](https://travis-ci.org/nspragg/cloudhound.svg)](https://travis-ci.org/nspragg/cloudhound) [![Coverage Status](https://coveralls.io/repos/github/nspragg/cloudhound/badge.svg?branch=master)](https://coveralls.io/github/nspragg/cloudhound?branch=master)
 ![license](https://img.shields.io/badge/license-MIT-blue.svg) 
![github-issues](https://img.shields.io/github/issues/nspragg/cloudhound.svg)

> Flexible and fluent interface finding files in the cloud

## Installation

```
npm install --save cloudhound
```

## Usage
```ts
import {S3Hound} from 'cloudhound';

const objects = await S3Hound.newQuery({ bucket: 'myBucket' })
  .prefix('csv')
  .limit(50)
  .find();

console.log(objects);
```
## Documentation
For more examples and API details, see [API documentation](https://nspragg.github.io/cloudhound/)

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```
## Contributing

See [contributing guide](./CONTRIBUTING.md)

## Releasing

1. Bump the version number in package.json `npm version patch|minor|major`.
2. Commit and push to main.
3. Run `npm run no-npm`.