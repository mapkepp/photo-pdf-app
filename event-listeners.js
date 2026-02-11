import { generatePdf } from './pdf-generator.js';
import { renderPhotos } from './photo-display.js';

// Инициализация массива фото
if (!window.photos) {
    window.photos = JSON.parse(localStorage.getItem('photos')) || [];
    renderPhotos();
}

// Обработчик загрузки фото
document.getElementById('photo-upload').addEventListener('change', function(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const photo = {
                id: Date.now() + Math.random(),
                src: event.target.result,
                comment: '',
                order: window.photos.length
            };
            window.photos.push(photo);
            localStorage.setItem('photos', JSON.stringify(window.photos));
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
});

// Обработчик генерации PDF
document.getElementById('generate-pdf').addEventListener('click', function() {
    const elements = {
        titleInput: document.getElementById('title'),
        downloadLink: document.getElementById('download-link')
    };
    generatePdf(elements);
});
