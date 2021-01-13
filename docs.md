# cloudhound

[![Build Status](https://travis-ci.org/nspragg/cloudhound.svg)](https://travis-ci.org/nspragg/cloudhound) [![Coverage Status](https://coveralls.io/repos/github/nspragg/cloudhound/badge.svg?branch=master)](https://coveralls.io/github/nspragg/cloudhound?branch=master)

> Flexible and fluent interface for searching cloud storage

## Common examples

#### List all with pagination

List all objects from a given bucket:

```js
const CloudHound = require('cloudhound');

const objects = CloudHound.newQuery({ bucket: 'myBucket' }).find();
console.log(objects);
```

List objects given a prefix:

```js
const CloudHound = require('cloudhound');

const objects = await CloudHound.newQuery({ bucket: 'myBucket' })
  .prefix('csv')
  .find();

console.log(objects);
```

Limit the number of objects:

```js
const CloudHound = require('cloudhound');

const objects = await CloudHound.newQuery({ bucket: 'myBucket' })
  .limit(10)
  .find();

console.log(objects);
```
