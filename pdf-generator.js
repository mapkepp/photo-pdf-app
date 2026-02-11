import { loadFont } from './fonts.js';
import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { renderSinglePhoto } from './pdf-photo-renderer.js';

export async function generatePdf(elements) {
    try {
        // Сначала ждём загрузки jsPDF и шрифта
        await loadFont();

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
        alert('Произошла ошибка при создании PDF:\n' + error.message + '\nПроверьте консоль для деталей.');
    }
}
