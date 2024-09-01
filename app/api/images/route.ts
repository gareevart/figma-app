import { NextResponse } from 'next/server';
import { ListObjectsCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../update-image/route';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const folder = searchParams.get('folder') || '';

	try {
		const command = new ListObjectsCommand({
			Bucket: process.env.BUCKET_NAME,
			Prefix: folder ? `${folder}/` : '',
		});
		const data = await s3Client.send(command);

		const groupedImages = data.Contents.reduce((acc, item) => {
			const folder = item.Key.split('/')[0];
			const imageUrl = `${process.env.ENDPOINT_URL}/${process.env.BUCKET_NAME}/${item.Key}`;

			if (!acc[folder]) {
				acc[folder] = [];
			}
			acc[folder].push(imageUrl);

			return acc;
		}, {});

		return NextResponse.json(groupedImages);
	} catch (error) {
		console.error('Ошибка при получении изображений:', error);
		return NextResponse.error({ status: 500, body: 'Не удалось получить изображения из бакета.' });
	}
}