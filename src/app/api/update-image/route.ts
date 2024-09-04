import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3Client';

async function getFigmaFileData() {
	const response = await fetch(`https://api.figma.com/v1/files/${process.env.FILE_KEY}`, {
		headers: {
			'X-Figma-Token': process.env.FIGMA_TOKEN || '',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch Figma data');
	}

	return response.json();
}

export async function POST(req: Request) {
	try {
		const { folder } = await req.json();
		const fileData = await getFigmaFileData();
		const pages = fileData.document.children;

		for (const page of pages) {
			// Проверка на emoji в названии страницы
			const hasEmoji = /(\p{Emoji}|[\u203C-\u3299\u200D])/u.test(page.name);

			if (hasEmoji) {
				console.log(`Пропущена страница "${page.name}" из-за наличия emoji`);
				continue;
			}

			if (folder && page.name !== folder) {
				continue; // Пропуск страниц, не соответствующих выбранной папке
			}

			const frames = page.children;
			await downloadAndSaveFrameImages(frames, page.name);
		}

		return NextResponse.json({ message: `Изображения успешно загружены для папки: ${folder || 'Все страницы'}!` });
	} catch (error) {
		console.error('Ошибка при обновлении изображений:', error);
		return new NextResponse('Произошла ошибка при обновлении изображений.', { status: 500 });
	}
}

async function downloadAndSaveFrameImages(frames: any[], pageName: string) {
	const frameIds = frames.map((frame) => frame.id).join(',');
	const url = new URL(`https://api.figma.com/v1/images/${process.env.FILE_KEY}`);
	url.search = new URLSearchParams({ ids: frameIds, scale: '1' }).toString();

	const headers = new Headers({
		'X-Figma-Token': process.env.FIGMA_TOKEN || '',
	});

	const imagesResponse = await fetch(url.toString(), { headers });
	const imagesData = await imagesResponse.json();

	if (!imagesData.images) {
		console.error("Ключ 'images' отсутствует в данных изображения");
		return;
	}

	for (const frame of frames) {
		const frameName = frame.name.replace(/\//g, '-');
		const imageUrl = imagesData.images[frame.id];

		if (!imageUrl) {
			console.warn(`Не удалось найти URL для фрейма ${frameName}`);
			continue;
		}

		try {
			const imageResponse = await fetch(imageUrl);
			const imageBuffer = await imageResponse.arrayBuffer();

			const s3Params = {
				Bucket: process.env.BUCKET_NAME,
				Key: `${pageName}/${frameName}.png`,
				Body: Buffer.from(imageBuffer),
				ContentType: 'image/png',
			};

			const command = new PutObjectCommand(s3Params);
			await s3Client.send(command);

			console.log(`Изображение ${frameName}.png успешно загружено в папку ${pageName}`);
		} catch (error) {
			console.error(`Ошибка при загрузке изображения ${frameName}:`, error);
		}
	}
}