import { loadFont } from './fonts.js';
import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { addNewPageIfNeeded, initializePage } from './pdf-page-manager.js';
import { renderPhotoWithComment } from './pdf-photo-renderer.js';

export async function generatePdf(elements) {
    try {
        await loadFont();
        let doc = createPdfDocument();

        const title = elements.titleInput.value || 'Мои фотографии';
        doc.setFontSize(20);
        doc.text(title, 105, 20, { align: 'center' });

        let yPosition = 40;
        const photosPerPage = 5;

        for (let i = 0; i < window.photos.length; i++) {
            // Управление страницами
            if (i % photosPerPage === 0 && i !== 0) {
                doc = addNewPageIfNeeded(doc, yPosition);
                yPosition = initializePage();
            }

            const photo = window.photos[i];
            // Отрисовка фото и комментария
            yPosition = renderPhotoWithComment(doc, photo, yPosition);
        }

        // Сохранение PDF
        savePdfDocument(doc, elements);
    } catch (error) {
        console.error('Ошибка при генерации PDF:', error);
        alert('Произошла ошибка при создании PDF. Проверьте консоль для деталей.');
    }
}
