import { NextResponse } from 'next/server';
import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../update-image/route';

export async function GET() {
	try {
		const command = new ListObjectsCommand({
			Bucket: process.env.BUCKET_NAME,
			Delimiter: '/',
		});
		const data = await s3Client.send(command);

		const folders = data.CommonPrefixes.map(prefix => prefix.Prefix.slice(0, -1));
		return NextResponse.json(folders);
	} catch (error) {
		console.error('Ошибка при получении списка папок:', error);
		return NextResponse.error({ status: 500, body: 'Не удалось получить папки из бакета.' });
	}
}