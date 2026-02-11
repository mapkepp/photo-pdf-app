export function updatePhotoOrders() {
    if (!window.photos) {
        console.error('Массив window.photos не инициализирован');
        return;
    }

    window.photos.forEach((photo, index) => {
        photo.order = index;
    });
}
