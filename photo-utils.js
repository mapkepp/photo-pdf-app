// photo-utils.js
export function updatePhotoOrders() {
    if (!window.photos) {
        console.warn('Массив window.photos не инициализирован, пропускаем обновление порядков');
        return;
    }

    window.photos.forEach((photo, index) => {
        photo.order = index;
    });
}
