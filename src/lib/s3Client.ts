import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

// Убедитесь, что переменные окружения определены и имеют правильные значения
const endpoint = process.env.ENDPOINT_URL || '';
const accessKeyId = process.env.ACCESS_KEY || '';
const secretAccessKey = process.env.SECRET_KEY || '';
const region = 'ru-central1'; // Укажите правильный регион, если он отличается

// Создаем объект конфигурации
const s3ClientConfig: S3ClientConfig = {
	endpoint,
	credentials: {
		accessKeyId,
		secretAccessKey,
	},
	forcePathStyle: true,
	region,
};

// Создаем экземпляр S3Client с указанной конфигурацией
const s3Client = new S3Client(s3ClientConfig);

export default s3Client;