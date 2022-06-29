# Cloudhound

![npm](https://img.shields.io/npm/v/cloudhound.svg)
[![Build Status](https://travis-ci.org/nspragg/cloudhound.svg)](https://travis-ci.org/nspragg/cloudhound) [![Coverage Status](https://coveralls.io/repos/github/nspragg/cloudhound/badge.svg?branch=master)](https://coveralls.io/github/nspragg/cloudhound?branch=master)
 ![license](https://img.shields.io/badge/license-MIT-blue.svg) 
![github-issues](https://img.shields.io/github/issues/nspragg/cloudhound.svg)

> Flexible and fluent interface finding files in the cloud

⚠️ 🔥  This is an early release 🔥 ⚠️

## Installation

```
npm install --save cloudhound
```
## Setup
To build the project, run the following command:

```shell
npm install aws-sdk@2.823.0 --no-save
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

1. Bump the version number in package.json.
2. Run `npm install` to make sure the package-lock.json is updated as well.
3. Commit and push to main.
4. Run `npm run no-npm`.