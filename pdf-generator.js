import { loadFont } from './fonts.js';
import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { renderSinglePhoto } from './pdf-photo-renderer.js';

export async function generatePdf(elements) {
    try {
        // Шаг 1: Загружаем шрифт (обязательно для кириллицы)
        await loadFont();

        // Шаг 2: Создаём документ (только если шрифт доступен)
        const doc = createPdfDocument();

        // Шаг 3: Заголовок
        const title = elements.titleInput.value || 'Мои фотографии';
        doc.setFontSize(20);
        doc.text(title, 105, 20, { align: 'center' });

        let yPosition = 40;
        const photosPerPage = 5;

        // Шаг 4: Обработка фото
        for (let i = 0; i < window.photos.length; i++) {
            // Новая страница каждые 5 фото
            if (i % photosPerPage === 0 && i !== 0) {
                doc.addPage();
                yPosition = 20;
            }

            const photo = window.photos[i];
            yPosition = renderSinglePhoto(doc, photo, yPosition);
        }

        // Шаг 5: Сохранение PDF
        savePdfDocument(doc, elements.downloadLink);

    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        alert('Невозможно создать PDF: ' + error.message + '\nУбедитесь, что шрифт DejaVuSans.ttf находится в той же папке, что и index.html');
    }
}
