import { renderPhotos } from './photo-display.js';
import { generatePdf } from './pdf-generator.js';

export function initEventListeners() {
    const photoContainer = document.getElementById('photo-container');
    const titleInput = document.getElementById('title');
    const uploadInput = document.getElementById('photo-upload');
    const generatePdfBtn = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');

    // Восстановление состояния
    const savedPhotos = localStorage.getItem('photos');
    if (savedPhotos) {
        try {
            window.photos = JSON.parse(savedPhotos);
            renderPhotos();
        } catch (e) {
            console.error('Ошибка восстановления данных:', e);
            window.photos = [];
        }
    }

    uploadInput.addEventListener('change', handlePhotoUpload);
    generatePdfBtn.addEventListener('click', async () => {
        await generatePdf({ photoContainer, titleInput, downloadLink });
    });
}

function handlePhotoUpload(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Очистка перед загрузкой
    window.photos = [];

    Array.from(files).forEach(file => {
        // Валидация формата
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(`Файл ${file.name} не поддерживается. Используйте JPG, PNG или WebP.`);
            return;
        }

        // Проверка размера (< 10 МБ)
        if (file.size > 10 * 1024 * 1024) {
            alert(`Файл ${file.name} слишком большой (>${10} МБ).`);
            return;
        }

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
            localStorage.setItem('photos', JSON.stringify(window.photos));
        };
        reader.onerror = () => console.error('Ошибка чтения файла:', file.name);
        reader.readAsDataURL(file);
    });
}

document.addEventListener('DOMContentLoaded', initEventListeners);
