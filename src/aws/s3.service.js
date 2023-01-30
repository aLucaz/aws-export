import AWS from 'aws-sdk'

export class S3Service {

  constructor(key, secret) {
    this._key = key;
    this._secret = secret;
    this._s3_client = new AWS.S3({
      accessKeyId: this._key,
      secretAccessKey: this._secret,
    })
  }

  _upload(stream, params, options) {
    try {
      return this._s3_client.upload(params, options).promise();
    } catch (error) {
      console.log('upload ERROR', error);
      throw error;
    }
  }

  uploadBigExcelInChunks(stream, name) {
    let params = {
      // ACL: 'public-read',
      Bucket: 'genericpoctesting',
      Key: name,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      Body: stream
    };
    // Uploading a stream with concurrency of 1 and partSize of 10mb
    let options = {
      partSize: 10 * 1024 * 1024,
      queueSize: 1
    };
    return this._upload(stream, params, options);
  }

  _getPresignedUrl(params) {
    try {
      return this._s3_client.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.log('signed ERROR', error);
      throw error;
    }
  }

  getExcelPreSignedUrl(key) {
    let params = {
      // ACL: 'public-read',
      Bucket: 'genericpoctesting',
      Key: key,
      // ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return this._getPresignedUrl(params);
  }

}