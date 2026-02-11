import { updatePhotoOrders } from './photo-utils.js';

// Инициализация глобального массива фото
if (!window.photos) window.photos = [];

// Объявление глобальных функций в начале файла
window.movePhoto = function(id, direction) {
    // Проверка существования массива
    if (!window.photos) {
        window.photos = [];
        return;
    }

    const index = window.photos.findIndex(p => p.id === id);
    if (index === -1) return; // Фото не найдено

    const newIndex = index + direction;

    if (newIndex >= 0 && newIndex < window.photos.length) {
        // Меняем местами элементы в массиве
        [window.photos[index], window.photos[newIndex]] = [window.photos[newIndex], window.photos[index]];
        renderPhotos();
    }
};

window.removePhoto = function(id) {
    // Проверка существования массива
    if (!window.photos) {
        window.photos = [];
        return;
    }

    window.photos = window.photos.filter(p => p.id !== id);
    renderPhotos();
};

export function renderPhotos() {
    const photoContainer = document.getElementById('photo-container');

    // Проверка существования контейнера
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
            photoDiv.innerHTML = `
                <img src="${photo.src}" alt="Фото">
                <textarea placeholder="Комментарий к фото" data-id="${photo.id}">${photo.comment || ''}</textarea>
                <div class="controls">
                    <button onclick="movePhoto(${photo.id}, -1)">←</button>
                    <span>Позиция: ${index + 1}</span>
                    <button onclick="movePhoto(${photo.id}, 1)">→</button>
                    <button onclick="removePhoto(${photo.id})">Удалить</button>
                </div>
            `;
            photoContainer.appendChild(photoDiv);

            // Обновляем комментарии при вводе
            const textarea = photoDiv.querySelector('textarea');
            if (textarea) {
                textarea.addEventListener('input', function() {
                    const photoId = this.getAttribute('data-id');
            const comment = this.value;
            const photo = window.photos.find(p => p.id == photoId);
            if (photo) {
                photo.comment = comment;
                // Сохраняем в localStorage
                localStorage.setItem('photos', JSON.stringify(window.photos));
            }
        });
    }
});

    updatePhotoOrders(); // Обновляем порядковые номера
}
