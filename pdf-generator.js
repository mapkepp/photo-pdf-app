import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { loadFont } from './fonts.js';

export async function generatePdf(photos, downloadLink) {
    try {
        console.log('⏱️ Начинаем генерацию PDF...');

        // Сначала загружаем шрифт (если ещё не загружен)
        await loadFont();
        console.log('✅ Шрифт загружен, продолжаем создание PDF');

        // Создаём документ только после успешной загрузки шрифта
        const doc = createPdfDocument();

        // Добавляем фото (пример для одного фото)
        if (photos && photos.length > 0) {
            const imgData = photos[0]; // замените на логику обработки всех фото
            doc.addImage(imgData, 'JPEG', 10, 10, 190, 0); // автовысота
        }

        // Добавляем тестовый текст с кириллицей
        doc.setFontSize(12);
        doc.text('Тестовый текст на кириллице: Привет, мир!', 10, 30);

        // Сохраняем PDF
        savePdfDocument(doc, downloadLink);
        console.log('✓ PDF успешно создан и сохранён');
    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error.message);
        throw error;
    }
}
