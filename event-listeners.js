export function initEventListeners(elements) {
    const { uploadInput, generatePdfBtn } = elements;

    // Обработчик загрузки фото
    uploadInput.addEventListener('change', handlePhotoUpload);

    // Обработчик генерации PDF
    generatePdfBtn.addEventListener('click', async () => {
        await generatePdf(elements);
    });
}

function handlePhotoUpload(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photo = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                comment: '',
                order: window.photos.length
            };
            window.photos.push(photo);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
}
