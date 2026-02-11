export function initEventListeners() {
    const photoContainer = document.getElementById('photo-container');
    const titleInput = document.getElementById('title');
    const uploadInput = document.getElementById('photo-upload');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');

    // Обработчик загрузки фото
    uploadInput.addEventListener('change', handlePhotoUpload);

    // Обработчик генерации PDF
    generatePdfBtn.addEventListener('click', async () => {
        await generatePdf({
            photoContainer,
            titleInput,
            downloadLink
        });
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
