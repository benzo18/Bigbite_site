// render site/backend/config/s3.js
import { S3Client } from '@aws-sdk/client-s3';
import 'dotenv/config'

const s3Client = new S3Client({
    region: process.env.AWS_REGION, // Ensure correct variable name
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY, // Ensure correct variable name
        secretAccessKey: process.env.AWS_SECRET_KEY, // Ensure correct variable name
    },
});

export default s3Client;