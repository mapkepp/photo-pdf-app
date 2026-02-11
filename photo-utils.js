export function updatePhotoOrders() {
    window.photos.forEach((photo, index) => {
        photo.order = index;
    });
}
