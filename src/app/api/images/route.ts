import {NextResponse} from 'next/server';
import {ListObjectsCommand, ListObjectsCommandOutput} from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3Client';

export async function GET() {
    try {
        const command = new ListObjectsCommand({
            Bucket: process.env.BUCKET_NAME,
        });

        const data: ListObjectsCommandOutput = await s3Client.send(command);

        // Проверка на наличие data.Contents и его использование как массива по умолчанию
        const groupedImages: Record<string, string[]> = (data.Contents || []).reduce(
            (acc, item) => {
                // Проверка на undefined у item.Key
                if (item.Key) {
                    const folder = item.Key.split('/')[0];
                    const imageUrl = `${process.env.ENDPOINT_URL}/${process.env.BUCKET_NAME}/${item.Key}`;

                    if (!acc[folder]) {
                        acc[folder] = [];
                    }

                    acc[folder].push(imageUrl);
                }
                return acc;
            },
            {} as Record<string, string[]>,
        ); // Инициализируем как пустой объект

        // Добавляем заголовки для отключения кэширования
        return new Response(JSON.stringify(groupedImages), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
            },
        });
    } catch (error) {
        console.error('Ошибка при получении изображений:', error);
        return new NextResponse('Не удалось получить изображения из бакета.', {status: 500});
    }
}
