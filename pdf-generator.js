import { loadFont } from './fonts.js';
import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { renderSinglePhoto } from './pdf-photo-renderer.js';

export async function generatePdf(elements) {
    try {
        // Явная проверка готовности jsPDF
        if (!window.jspdf) {
            alert('Библиотека jsPDF ещё не загрузилась. Подождите несколько секунд и попробуйте снова.');
            console.error('jsPDF не загружен при попытке генерации PDF');
            return;
        }

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
        alert('Произошла ошибка при создании PDF. Проверьте консоль для деталей.');
    }
}
