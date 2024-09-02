import { NextResponse } from 'next/server';
import { ListObjectsCommand } from '@aws-sdk/client-s3';
import s3Client from '../../lib/s3Client';

export async function GET() {
	try {
		const command = new ListObjectsCommand({
			Bucket: process.env.BUCKET_NAME,
			Delimiter: '/',
		});
		const data = await s3Client.send(command);

		// Проверка на undefined и использование пустого массива по умолчанию
		const folders = data.CommonPrefixes?.map(prefix => prefix.Prefix?.slice(0, -1) || '') || [];
		console.log('Received CommonPrefixes:', data.CommonPrefixes);

		return NextResponse.json(folders);
	} catch (error) {
		console.error('Ошибка при получении списка папок:', error);
		return new NextResponse('Не удалось получить папки из бакета.', { status: 500 });
	}
}