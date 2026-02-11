import { generatePdf } from './pdf-generator.js';
import { renderPhotos } from './photo-display.js';

// Инициализация массива фото
if (!window.photos) {
    window.photos = JSON.parse(localStorage.getItem('photos')) || [];
    renderPhotos();
}

// Функция для проверки готовности jsPDF
function checkJsPDFReady() {
    return !!window.jspdf;
}

// Обновляем состояние кнопки генерации PDF
function updateGeneratePdfButton() {
    const generateBtn = document.getElementById('generate-pdf');
    const status = document.getElementById('pdf-status');

    if (checkJsPDFReady()) {
        generateBtn.disabled = false;
        status.textContent = 'Готов к созданию PDF';
        status.style.color = 'green';
    } else {
        generateBtn.disabled = true;
        status.textContent = 'Ожидание загрузки библиотек...';
        status.style.color = 'orange';
    }
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
    if (!checkJsPDFReady()) {
        alert('Библиотека jsPDF ещё загружается. Подождите несколько секунд.');
        return;
    }

    const elements = {
        titleInput: document.getElementById('title'),
        downloadLink: document.getElementById('download-link')
    };
    generatePdf(elements);
});

// Периодическая проверка готовности jsPDF (каждые 200 мс)
setInterval(updateGeneratePdfButton, 200);

// Первоначальный вызов
updateGeneratePdfButton();
