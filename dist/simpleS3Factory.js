"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClient = void 0;
const AWS = require("aws-sdk");
async function getClient() {
    return new AWS.S3({ apiVersion: '2006-03-01' });
}
exports.getClient = getClient;
