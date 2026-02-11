import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { loadFont } from './fonts.js';

export async function generatePdf(photos, downloadLink) {
    try {
        console.log('⏱️ Начинаем генерацию PDF...');

        // Гарантированно ждём загрузки шрифта
        await loadFont();

        // Создаём документ только после успешной загрузки
        const doc = createPdfDocument();

        // Добавляем фото
        if (photos && photos.length > 0) {
            const imgData = photos[0];
            doc.addImage(imgData, 'JPEG', 10, 10, 190, 0);
        }

        // Добавляем тестовый текст с кириллицей
        doc.setFontSize(12);
        doc.text('Тестовый текст на кириллице: Привет, мир!', 10, 30);

        // Сохраняем PDF
        savePdfDocument(doc, downloadLink);
        console.log('✓ PDF успешно создан и сохранён');
    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error.message);
        alert('Ошибка при создании PDF: ' + error.message + '\nПроверьте консоль (F12) для деталей.');
        throw error;
    }
}
