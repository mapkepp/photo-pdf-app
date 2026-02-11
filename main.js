import { initEventListeners } from './event-listeners.js';
import { renderPhotos } from './photo-display.js';

document.addEventListener('DOMContentLoaded', function() {
    initEventListeners();
    // Инициализируем глобальный массив фото
    window.photos = [];
});
