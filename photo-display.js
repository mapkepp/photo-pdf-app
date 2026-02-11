import { updatePhotoOrders } from './photo-utils.js';

if (!window.photos) window.photos = [];

window.movePhoto = function(id, direction) {
    const index = window.photos.findIndex(p => p.id === id);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < window.photos.length) {
        [window.photos[index], window.photos[newIndex]] = [window.photos[newIndex], window.photos[index]];
        renderPhotos();
    }
};

export function renderPhotos() {
    const photoContainer = document.getElementById('photo-container');
    if (!photoContainer) {
        console.error('Элемент #photo-container не найден');
        return;
    }

    photoContainer.innerHTML = '';

    window.photos
        .sort((a, b) => a.order - b.order)
        .forEach((photo, index) => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';
            photoDiv.innerHTML = `
                <img src="${photo.src}" alt="Фото">
                <textarea placeholder="Комментарий к фото" data-id="${photo.id}">${photo.comment}</textarea>
                <div class="controls">
                    <button onclick="movePhoto(${photo.id}, -1)">←</button>
            <span>Позиция: ${index + 1}</span>
            <button onclick="movePhoto(${photo.id}, 1)">→</button>
            <button onclick="removePhoto(${photo.id})">Удалить</button>
        </div>
    `;
            photoContainer.appendChild(photoDiv);

            const textarea = photoDiv.querySelector('textarea');
            if (textarea) {
                textarea.addEventListener('input', function() {
                    const photoId = this.getAttribute('data-id');
            const comment = this.value;
            const photo = window.photos.find(p => p.id == photoId);
            if (photo) photo.comment = comment;
        });
    }
});

    updatePhotoOrders();
}
