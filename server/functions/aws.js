const { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const s3 = new S3Client({
    region: process.env.MY_AWS_REGION,
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    },
});

const uploadToS3 = async (file) => {
    const key = `${uuidv4()}${file.name}`;
    const base64Data = file.url.split(",")[1];
    const fileBuffer = Buffer.from(base64Data, "base64");
    const params = {
        Bucket: process.env.MY_S3_BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(params));

    const url = `https://${process.env.MY_S3_BUCKET}.s3.${process.env.MY_AWS_REGION}.amazonaws.com/${key}`;
    return { key, url };
};

const deleteFromS3 = async (key) => {
    const params = {
        Bucket: process.env.MY_S3_BUCKET,
        Key: key,
    };

    await s3.send(new DeleteObjectCommand(params));
};

const getFromS3 = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.MY_S3_BUCKET,
        Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 36000 });
    return url;
};

module.exports = { getFromS3, uploadToS3, deleteFromS3 };