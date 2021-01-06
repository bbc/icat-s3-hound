# cloudhound

[![Build Status](https://travis-ci.org/nspragg/cloudhound.svg)](https://travis-ci.org/nspragg/cloudhound) [![Coverage Status](https://coveralls.io/repos/github/nspragg/cloudhound/badge.svg?branch=master)](https://coveralls.io/github/nspragg/cloudhound?branch=master)

> Flexible and fluent interface for searching cloud storage

## Common examples

#### List all with pagination

The example below fetch list all objects from a given bucket:

```js
const CloudHound = require('cloudhound');

const objects = CloudHound.newQuery({ bucket: 'myBucket' }).find();
objects.then(console.log);
```
