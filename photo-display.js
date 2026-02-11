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
        .forEach(photo => {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-item';

            const img = document.createElement('img');
            img.src = photo.src;
            img.alt = 'Загруженное фото';

            const commentTextarea = document.createElement('textarea');
            commentTextarea.placeholder = 'Комментарий к фото';
            commentTextarea.value = photo.comment || '';
            commentTextarea.addEventListener('input', () => {
                photo.comment = commentTextarea.value;
                localStorage.setItem('photos', JSON.stringify(window.photos));
            });

            const controls = document.createElement('div');
            controls.className = 'controls';

            const moveUpBtn = document.createElement('button');
            moveUpBtn.textContent = '↑';
            moveUpBtn.addEventListener('click', () => window.movePhoto(photo.id, -1));

            const moveDownBtn = document.createElement('button');
            moveDownBtn.textContent = '↓';
            moveDownBtn.addEventListener('click', () => window.movePhoto(photo.id, 1));

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Удалить';
            removeBtn.addEventListener('click', () => window.removePhoto(photo.id));

            controls.append(moveUpBtn, moveDownBtn, removeBtn);

            photoDiv.append(img, commentTextarea, controls);
            photoContainer.appendChild(photoDiv);
        });
}
