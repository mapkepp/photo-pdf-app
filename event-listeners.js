import { renderPhotos } from './photo-display.js';
import { generatePdf } from './pdf-generator.js';

export function initEventListeners() {
    const photoContainer = document.getElementById('photo-container');
    const titleInput = document.getElementById('title');
    const uploadInput = document.getElementById('photo-upload');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');

    // Восстановление состояния из localStorage при загрузке
    const savedPhotos = localStorage.getItem('photos');
    if (savedPhotos) {
        window.photos = JSON.parse(savedPhotos);
        renderPhotos();
    }

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
    // Очистка перед загрузкой новых фото
    window.photos = [];

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
            renderPhotos(); // Теперь функция доступна
            localStorage.setItem('photos', JSON.stringify(window.photos));
        };
        reader.readAsDataURL(file);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initEventListeners);
