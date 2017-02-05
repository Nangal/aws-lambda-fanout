/* 
 * AWS Lambda Fan-Out Utility
 * 
 * Copyright 2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 *  http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 * 
 */

/* 
 * This Node.js script tests the features from the transformation.js script
 */
"use strict";

var transform = require('../lib/transformation.js');

var assert = require('assert');

describe('transformation', () => {
  describe('#DynamoDB.convert()', () => {
    it('should support DynamoDB Objects', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" } }, "NewImage": { "hash": { "S": "myhash" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": "myhash"});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should ignore on invalid object DynamoDB Key', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "Z": "myhash" } }, "NewImage": { "hash": { "S": "myhash" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should ignore on invalid object DynamoDB Objects', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" } }, "NewImage": { "hash": { "Z": "myhash" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support DynamoDB Objects with Composite Keys', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" }, "id": { N: 10 } }, "NewImage": { "hash": { "S": "myhash" }, "id": { N: 10 } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash|10");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": "myhash", "id": 10});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support DynamoDB Objects with Composite Keys containing a buffer', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" }, "id": { B: "YjY0VmFs" } }, "NewImage": { "hash": { "S": "myhash" }, "id": { B: "YjY0VmFs" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash|YjY0VmFs");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": "myhash", "id": "YjY0VmFs"});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support DynamoDB Objects without images', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support multiple DynamoDB Objects', (done) => {
      var source = [
        { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "hash1" } }, "NewImage": { "hash": { "S": "hash1" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" },
        { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "hash2" }, "id": { N: 10 } }, "NewImage": { "hash": { "S": "hash2" }, "id": { N: 10 } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" }
      ];
      var target = { convertDDB: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "hash1");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": "hash1"});
        assert.strictEqual(result.success[1].key, "hash2|10");
        assert.deepStrictEqual(JSON.parse(result.success[1].data.toString()), {"hash": "hash2", "id": 10});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });
  describe('#DynamoDB.no-convert()', () => {
    it('should support DynamoDB Objects', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" } }, "NewImage": { "hash": { "S": "myhash" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": { "S": "myhash" }});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support DynamoDB Objects with Composite Keys', (done) => {
      var source = [ { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "myhash" }, "id": { N: 10 } }, "NewImage": { "hash": { "S": "myhash" }, "id": { N: 10 } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" } ];
      var target = { convertDDB: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "myhash|10");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": { "S": "myhash" }, "id": { N: 10 }});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support multiple DynamoDB Objects', (done) => {
      var source = [
        { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "hash1" } }, "NewImage": { "hash": { "S": "hash1" } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" },
        { "awsRegion": "r1", "dynamodb": { "Keys": { "hash": { "S": "hash2" }, "id": { N: 10 } }, "NewImage": { "hash": { "S": "hash2" }, "id": { N: 10 } }, "SequenceNumber": "1" }, "eventID": "1", "eventName": "INSERT", "eventSource": "aws:dynamodb", "eventSourceARN": "arn:aws:dynamodb:us-east-1:0123456789ab:table/test/stream/2016-01-16T16:10:56.235", "eventVersion": "1.0" }
      ];
      var target = { convertDDB: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "hash1");
        assert.deepStrictEqual(JSON.parse(result.success[0].data.toString()), {"hash": { "S": "hash1" }});
        assert.strictEqual(result.success[1].key, "hash2|10");
        assert.deepStrictEqual(JSON.parse(result.success[1].data.toString()), {"hash": { "S": "hash2" }, "id": { N: 10 }});
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });
  describe('#Kinesis.no-deagg()', () => {
    it('should support Kinesis Objects', (done) => {
      var source = [ { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyB0ZXN0IGRhdGE=", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } ];
      var target = { deaggregate: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "shardId-00000000005");
        assert.deepStrictEqual(result.success[0].data.toString(), "This is test data");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support multiple Kinesis Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyB0ZXN0IGRhdGE=", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } },
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyBhbm90aGVyIHRlc3QgZGF0YQ==", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "2" } }
      ];
      var target = { deaggregate: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "shardId-00000000005");
        assert.deepStrictEqual(result.success[0].data.toString(), "This is test data");
        assert.strictEqual(result.success[1].key, "shardId-00000000005");
        assert.deepStrictEqual(result.success[1].data.toString(), "This is another test data");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should ignore invalid Kinesis Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": null }
      ];
      var target = { deaggregate: false };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });
  describe('#Kinesis.deagg-no-kpl()', () => {
    it('should support Kinesis Objects', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyB0ZXN0IGRhdGE=", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } 
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "shardId-00000000005");
        assert.strictEqual(result.success[0].data.toString(), "This is test data");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should support multiple Kinesis Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyB0ZXN0IGRhdGE=", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } },
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyBhbm90aGVyIHRlc3QgZGF0YQ==", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "2" } }
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "shardId-00000000005");
        assert.strictEqual(result.success[0].data.toString(), "This is test data");
        assert.strictEqual(result.success[1].key, "shardId-00000000005");
        assert.strictEqual(result.success[1].data.toString(), "This is another test data");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
    it('should ignore invalid Kinesis Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": null }
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });

  describe('#Kinesis.deagg-kpl()', () => {
    it('should support 0 KPL records', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawtQdjNmPALIE6YAJmOz4Qn4", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } 
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 0);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support 1 KPL records', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAaJQgAGiFUZXN0aW5nIEtQTCBBZ2dyZWdhdGVkIFJlY29yZCAxLTBlW2Hfd6iL1WkMbznr8jc2", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } 
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "key-0");
        assert.strictEqual(result.success[0].data.toString(), "Testing KPL Aggregated Record 1-0");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support 2 KPL records', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAKBWtleS0xGiUIABohVGVzdGluZyBLUEwgQWdncmVnYXRlZCBSZWNvcmQgMi0wGiUIARohVGVzdGluZyBLUEwgQWdncmVnYXRlZCBSZWNvcmQgMi0xHSUjhhzfXunP+g/ETnSEIQ==", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } 
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "key-0");
        assert.strictEqual(result.success[0].data.toString(), "Testing KPL Aggregated Record 2-0");
        assert.strictEqual(result.success[1].key, "key-1");
        assert.strictEqual(result.success[1].data.toString(), "Testing KPL Aggregated Record 2-1");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support multiple KPL Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAaJQgAGiFUZXN0aW5nIEtQTCBBZ2dyZWdhdGVkIFJlY29yZCAxLTBlW2Hfd6iL1WkMbznr8jc2", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } },
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAKBWtleS0xGiUIABohVGVzdGluZyBLUEwgQWdncmVnYXRlZCBSZWNvcmQgMi0wGiUIARohVGVzdGluZyBLUEwgQWdncmVnYXRlZCBSZWNvcmQgMi0xHSUjhhzfXunP+g/ETnSEIQ==", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } } 
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 3);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "key-0");
        assert.strictEqual(result.success[0].data.toString(), "Testing KPL Aggregated Record 1-0");
        assert.strictEqual(result.success[1].key, "key-0");
        assert.strictEqual(result.success[1].data.toString(), "Testing KPL Aggregated Record 2-0");
        assert.strictEqual(result.success[2].key, "key-1");
        assert.strictEqual(result.success[2].data.toString(), "Testing KPL Aggregated Record 2-1");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support mixed Kinesis and KPL Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAaJQgAGiFUZXN0aW5nIEtQTCBBZ2dyZWdhdGVkIFJlY29yZCAxLTBlW2Hfd6iL1WkMbznr8jc2", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } },
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "VGhpcyBpcyB0ZXN0IGRhdGE=", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "2" } }
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 2);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "key-0");
        assert.strictEqual(result.success[0].data.toString(), "Testing KPL Aggregated Record 1-0");
        assert.strictEqual(result.success[1].key, "shardId-00000000005");
        assert.strictEqual(result.success[1].data.toString(), "This is test data");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should ignore invalid KPL Objects', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": { "data": "84mawgoFa2V5LTAaJQgAGiFUZXN0aW5nIEtQTCBBZ2dyZWdhdGVkIFJlY29yZCAxLTBlW2Hfd6iL1WkMbznr8jc2AZERTY", "kinesisSchemaVersion": "1.0", "partitionKey": "shardId-00000000005", "sequenceNumber": "1" } }
      ];
      var target = { deaggregate: true };
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });

  describe('#SNS()', () => {
    it('should support SNS records', (done) => {
      var source = [
        { "EventVersion": "1.0", "EventSubscriptionArn": "arn:aws:sns:EXAMPLE", "EventSource": "aws:sns", "Sns": { "SignatureVersion": "1", "Timestamp": "1970-01-01T00:00:00.000Z", "Signature": "EXAMPLE", "SigningCertUrl": "EXAMPLE", "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e", "Message": "Hello from SNS!", "MessageAttributes": { "Test": { "Type": "String", "Value": "TestString" }, "TestBinary": { "Type": "Binary", "Value": "TestBinary" } }, "Type": "Notification", "UnsubscribeUrl": "EXAMPLE", "TopicArn": "arn:aws:sns:EXAMPLE", "Subject": "TestInvoke" } }
      ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.success[0].key, "95df01b4-ee98-5cb9-9903-4c221d41eb5e");
        assert.strictEqual(result.success[0].data.toString(), "Hello from SNS!");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should ignore invalid SNS records', (done) => {
      var source = [
        { "EventVersion": "1.0", "EventSource": "aws:sns", "Sns": { "SignatureVersion": "1", "Timestamp": "1970-01-01T00:00:00.000Z", "Signature": "EXAMPLE", "SigningCertUrl": "EXAMPLE", "MessageId": "95df01b4-ee98-5cb9-9903-4c221d41eb5e", "Message": "Hello from SNS!", "MessageAttributes": { "Test": { "Type": "String", "Value": "TestString" }, "TestBinary": { "Type": "Binary", "Value": "TestBinary" } }, "Type": "Notification", "UnsubscribeUrl": "EXAMPLE", "TopicArn": "arn:aws:sns:EXAMPLE", "Subject": "TestInvoke" } }
      ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });

  describe('#Firehose()', () => {
    it('should support Firehose records', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventSource": "aws:firehose", "eventSourceARN": "arn:aws:kinesis:EXAMPLE", "invocationId": "invocationIdExample", "firehose": { "recordId": "49546986683135544286507457936321625675700192471156785154", "data": "SGVsbG8sIHRoaXMgaXMgYSB0ZXN0IDEyMy4=", "approximateArrivalTimestamp": "2012-04-23T18:25:43.511Z" } }
      ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 1);
        assert.strictEqual(result.errors.length, 0);
        assert.strictEqual(result.success[0].key, "invocationIdExample");
        assert.strictEqual(result.success[0].sequenceNumber, "49546986683135544286507457936321625675700192471156785154");
        assert.strictEqual(result.success[0].data.toString(), "Hello, this is a test 123.");
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should ignore invalid Firehose records', (done) => {
      var source = [
        { "awsRegion": "us-east-1", "eventSource": "aws:firehose", "eventSourceARN": "arn:aws:kinesis:EXAMPLE", "invocationId": "invocationIdExample"  }
      ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });
  });

  describe('#invalid()', () => {
    it('should ignore for Kinesis Objects without a target defined', (done) => {
      var source = [ 
        { "awsRegion": "us-east-1", "eventID": "1", "eventName": "aws:kinesis:record", "eventSource": "aws:kinesis", "eventSourceARN": "arn:aws:kinesis:us-east-1:0123456789ab:stream/input", "eventVersion": "1.0", "invokeIdentityArn": "arn:aws:iam::0123456789ab:role/lambda_exec_role", "kinesis": null }
      ];
      var target = null;
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        assert.strictEqual(result.errors.length, 1);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support unknown event source', (done) => {
      var source = [
        { "eventSource": "unknown" }
      ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support invalid event', (done) => {
      var source = [ 10 ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should support null event', (done) => {
      var source = [ null ];
      var target = {};
      transform(source, target).then((result) => {
        assert.strictEqual(result.success.length, 0);
        done();
      }).catch((err) => { console.error("Error happened: ", err); done(err); });
    });

    it('should throw on invalid event list', (done) => {
      var source = 10;
      var target = {};
      transform(source, target).then((err) => {
        done(Error("An error should have been raised"));
      }).catch((err) => {
        if((err instanceof Error) && (err.message == "Invalid attribute, expecting records array")) {
          done();
        } else {
          done(Error("Unexpected error: " + err));
        }
      });
    });

    it('should throw on null event list', (done) => {
      var source = null;
      var target = {};
      transform(source, target).then((result) => {
        done(Error("An error should have been raised"));
      }).catch((err) => {
        if((err instanceof Error) && (err.message == "Invalid attribute, expecting records array")) {
          done();
        } else {
          done(Error("Unexpected error: " + err));
        }
      });
    });
  });
});
