import { updatePhotoOrders } from './photo-utils.js';

if (!window.photos) window.photos = [];

window.movePhoto = function(id, direction) {
    if (!window.photos) {
        window.photos = [];
        return;
    }

    const index = window.photos.findIndex(p => p.id === id);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < window.photos.length) {
        [window.photos[index], window.photos[newIndex]] = [window.photos[newIndex], window.photos[index]];
        renderPhotos();
    }
};

window.removePhoto = function(id) {
    if (!window.photos) {
        window.photos = [];
        return;
    }
    window.photos = window.photos.filter(p => p.id !== id);
    renderPhotos();
};

export function renderPhotos() {
    const photoContainer = document.getElementById('photo-container');
    if (!photoContainer) {
        console.error('Элемент #photo-container не найден в DOM');
        return;
    }

    photoContainer.innerHTML = '';

    window.photos
        .sort((a, b) => a.order - b.order)
        .forEach((photo, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';

            // Создаём img с обработкой ошибок
            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = 'Фото';
            img.onerror = () => {
                img.style.display = 'none';
                console.error(`Ошибка загрузки изображения: ${photo.src}`);
            };

            const textarea = document.createElement('textarea');
            textarea.placeholder = 'Комментарий к фото';
            textarea.dataset.id = photo.id;
            textarea.value = photo.comment || '';
            textarea.addEventListener('input', function() {
                const photoId = this.dataset.id;
                const comment = this.value;
                const targetPhoto = window.photos.find(p => p.id == photoId);
                if (targetPhoto) {
                    targetPhoto.comment = comment;
                    localStorage.setItem('photos', JSON.stringify(window.photos));
                }
            });

            const controls = document.createElement('div');
            controls.className = 'controls';
            controls.innerHTML = `
                <button onclick="movePhoto(${photo.id}, -1)">←</button>
                <span>Позиция: ${index + 1}</span>
                <button onclick="movePhoto(${photo.id}, 1)">→</button>
                <button onclick="removePhoto(${photo.id})">Удалить</button>
            `;

            photoDiv.appendChild(img);
            photoDiv.appendChild(textarea);
            photoDiv.appendChild(controls);
            photoContainer.appendChild(photoDiv);
        });

    updatePhotoOrders();
}
