const AWS = require('aws-sdk');
const config = require('../../config');

// AWS S3 Bucket
const bucket = config.aws.bucket.imageProfile;
const s3 = new AWS.S3();

class Upload {
  static async putObject(params) {
    return new Promise((resolve, reject) => {
      const base64data = Buffer.from(params.buffer, 'base64');
      const key = `${params.filename}`;
      const data = {
        Bucket: bucket,
        Key: key,
        Body: base64data,
        ContentType: params.mime,
      };
      s3.upload(data, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  }
}

module.exports = Upload;
