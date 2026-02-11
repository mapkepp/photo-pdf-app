export function updatePhotoOrders() {
    if (!window.photos) {
        console.warn('Массив window.photos не инициализирован');
        return;
    }
    window.photos.forEach((photo, index) => {
        photo.order = index;
    });
}

export function clearPhotos() {
    window.photos = [];
}
