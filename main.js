import { initEventListeners } from './event-listeners.js';
import { renderPhotos } from './photo-display.js';

import { generatePdf } from './pdf-generator.js';


// Глобальные переменные
window.photos = [];
const photoContainer = document.getElementById('photo-container');
const titleInput = document.getElementById('title');
const uploadInput = document.getElementById('photo-upload');
const generatePdfBtn = document.getElementById('generate-pdf');
const downloadLink = document.getElementById('download-link');

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initEventListeners({
        photoContainer,
        titleInput,
        uploadInput,
        generatePdfBtn,
        downloadLink
    });
});
