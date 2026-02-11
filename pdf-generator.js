import { loadFont } from './fonts.js';
import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { renderSinglePhoto } from './pdf-photo-renderer.js';

export async function generatePdf(elements) {
    try {
        // Сначала ждём загрузки jsPDF
        await waitForJsPDFReady();

        await loadFont();

        // Проверяем, что jsPDF доступен
        if (!window.jspdf) {
            throw new Error('Библиотека jsPDF не загружена');
        }

        // Создаём документ
        const doc = createPdfDocument();

        // Заголовок
        const title = elements.titleInput.value || 'Мои фотографии';
        doc.setFontSize(20);
        doc.text(title, 105, 20, { align: 'center' });

        let yPosition = 40;
        const photosPerPage = 5;

        // Обработка фото
        for (let i = 0; i < window.photos.length; i++) {
            // Новая страница каждые 5 фото
            if (i % photosPerPage === 0 && i !== 0) {
                doc.addPage();
                yPosition = 20;
            }

            const photo = window.photos[i];
            yPosition = renderSinglePhoto(doc, photo, yPosition);
        }

        // Сохранение PDF
        savePdfDocument(doc, elements.downloadLink);

    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        alert('Произошла ошибка при создании PDF. Проверьте консоль для деталей.');
    }
}

// Дополнительная функция ожидания jsPDF
async function waitForJsPDFReady() {
    return new Promise((resolve) => {
        if (window.jspdf) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 100;

        const checkInterval = setInterval(() => {
            if (window.jspdf) {
                clearInterval(checkInterval);
                resolve();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                throw new Error('jsPDF не загрузился в течение 10 секунд');
            }
        }, 100);
    });
}
