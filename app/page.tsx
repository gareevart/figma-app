"use client"
import { useState, useEffect } from 'react';

type ImagesByFolder = {
  [folder: string]: string[];
};

export default function Home() {
  const [folders, setFolders] = useState<string[]>([]);
  const [images, setImages] = useState<ImagesByFolder>({});
  const [selectedFolder, setSelectedFolder] = useState<string>('');

  useEffect(() => {
    fetch('/api/folders')
      .then(response => response.json())
      .then(setFolders)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch(`/api/images?folder=${encodeURIComponent(selectedFolder)}`)
      .then(response => response.json())
      .then(setImages)
      .catch(console.error);
  }, [selectedFolder]);

  const handleUpdate = () => {
    fetch('/api/update-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder: selectedFolder }),
    })
      .then(response => response.json())
      .then(data => alert(data.message))
      .catch(console.error);
  };

  return (
    <div>
      <h1>Figma to Yandex.Cloud</h1>
      <label htmlFor="folder-select">Выберите папку:</label>
      <select id="folder-select" value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)}>
        <option value="">Все папки</option>
        {folders.map(folder => (
          <option key={folder} value={folder}>
            {folder}
          </option>
        ))}
      </select>
      <button onClick={handleUpdate}>Обновить изображения</button>
      <div id="image-groups">
        {Object.keys(images).map(group => (
          <div key={group}>
            <h2>{group}</h2>
            {images[group].map(url => (
              <img key={url} src={url} style={{ maxWidth: '200px', margin: '10px' }} alt="Figma frame" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}