'use client';
import block from 'bem-cn-lite';
import { useState, useEffect } from 'react';
import { Button, Select, Icon, Card, Loader, useToaster } from '@gravity-ui/uikit';
import { ArrowRotateRight, Copy } from '@gravity-ui/icons';
import Image from 'next/image';

import './Filters.scss';
const b = block('filters');

type ImagesByFolder = {
	[folder: string]: string[];
};

export const Filters: React.FC = () => {
	const [folders, setFolders] = useState<string[]>([]);
	const [images, setImages] = useState<ImagesByFolder>({});
	const [selectedFolder, setSelectedFolder] = useState<string>('');
	const [updating, setUpdating] = useState<boolean>(false);

	const { add } = useToaster(); // Используем хук useToaster

	// Загрузка списка папок при первой загрузке
	useEffect(() => {
		fetch('/api/folders')
			.then((response) => response.json())
			.then((data) => setFolders(data))
			.catch(console.error);
	}, []);

	// Загрузка изображений на основе выбранной папки
	const loadImages = () => {
		fetch(`/api/images?folder=${encodeURIComponent(selectedFolder)}`)
			.then((response) => response.json())
			.then(setImages)
			.catch(console.error);
	};

	// Перезагрузка изображений при изменении выбранной папки
	useEffect(() => {
		loadImages();
	}, [selectedFolder]);

	const handleUpdate = () => {
		setUpdating(true);
		fetch('/api/update-image', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ folder: selectedFolder }),
		})
			.then((response) => response.json())
			.then((data) => {
				add({
					name: 'update-success',
					title: data.message,
					type: 'success',
				});
				// Повторная загрузка изображений после успешного обновления
				loadImages();
				setUpdating(false);
			})
			.catch((error) => {
				add({
					name: 'update-error',
					title: 'Ошибка обновления изображений',
					type: 'error',
				});
				console.error('Ошибка обновления изображений: ', error);
				setUpdating(false);
			});
	};

	const copyToClipboard = (url: string) => {
		navigator.clipboard.writeText(url).then(
			() => {
				add({
					name: 'copy-success',
					title: 'Ссылка скопирована',
					type: 'success',
				});
			},
			(err) => {
				add({
					name: 'copy-error',
					title: 'Ошибка копирования ссылки.',
					type: 'error',
				});
				console.error('Ошибка копирования: ', err);
			}
		);
	};

	return (
		<div className={b()}>
			<div className={b('block')}>
				<div className={b('filter')}>
					<Select
						className={b('select')}
						size="l"
						placeholder="All components"
						filterable={true}
						options={[
							{ value: '', content: 'All components' },
							...folders.map((folder) => ({ value: folder, content: folder })),
						]}
						value={selectedFolder ? [selectedFolder] : []}
						onUpdate={(value) => setSelectedFolder(value[0] || '')}
					/>
					<div className={b('button-wrapper')}>
						<Button size="l" view="outlined" onClick={handleUpdate}>
							<Icon data={ArrowRotateRight} />
							Обновить изображения
						</Button>
						{updating && <Loader size="s" />}
					</div>
				</div>

				<div id="image-groups">
					{Object.keys(images)
						.filter((group) => !selectedFolder || group === selectedFolder)
						.map((group) => (
							<div className={b('card')} key={group}>
								<Card className={b('cards')} view="filled" type="container" size="l">
									<div className={b('title')}>{group}</div>
									<div className={b('image-group')}>
										{images[group].map((url) => (
											<div className={b('image-item')} key={url}>
												<Image
													className={b('image')}
													priority={false}
													src={url}
													width={200}
													height={200}
													alt={`Image from ${group}`}
												/>
												<Button
													className={b('copy-button')}
													size="m"
													view="outlined"
													onClick={() => copyToClipboard(url)}
												>
													<Icon data={Copy} />
												</Button>
											</div>
										))}
									</div>
								</Card>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};