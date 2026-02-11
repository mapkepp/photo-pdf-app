import { createPdfDocument, savePdfDocument } from './pdf-utils.js';
import { loadFont } from './fonts.js';

export async function generatePdf(photos, downloadLink) {
    console.group('🚀 generatePdf: Начало выполнения функции');

    try {
        // Детальная диагностика входных параметров
        console.log('🔎 Диагностика входных параметров:');
        console.log('  - photos:', photos);
        console.log('  - downloadLink:', downloadLink);
        console.log('  - Тип downloadLink:', typeof downloadLink);
        console.log('  - Является ли downloadLink undefined/null:', downloadLink == null);

        // Критическая проверка downloadLink перед использованием
        if (downloadLink == null) {
            const errorMsg = '❌ generatePdf: параметр downloadLink не передан (undefined/null)';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        if (!(downloadLink instanceof Element)) {
            const errorMsg = `❌ generatePdf: downloadLink должен быть DOM‑элементом, но получен: ${typeof downloadLink}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        console.log('✓ downloadLink проверен и является DOM‑элементом');
        console.log('  - Тег:', downloadLink.tagName);
        console.log('  - ID:', downloadLink.id);

        // Загрузка шрифта
        console.log('⏱️ Начинаем загрузку шрифта...');
        await loadFont();
        console.log('✓ Шрифт успешно загружен');

        // Создание документа
        console.log('🛠️ Создаём документ PDF...');
        const doc = createPdfDocument();

        if (!doc) {
            const errorMsg = '❌ Не удалось создать документ PDF';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        console.log('✓ Документ PDF создан');

        // Конвертация файлов в Data URLs
        console.log('🔄 Конвертируем файлы в Data URLs...');
        const photoDataUrls = await Promise.all(
            photos.map(file => convertFileToDataUrl(file))
        );
        console.log('✓ Все фото конвертированы в Data URLs');

        // Добавление фото
        if (photoDataUrls && photoDataUrls.length > 0) {
            console.log(`📷 Добавляем ${photoDataUrls.length} фото в PDF...`);
            for (let i = 0; i < photoDataUrls.length; i++) {
                const imgData = photoDataUrls[i];
                if (imgData) {
                    doc.addImage(imgData, 'JPEG', 10, 10 + i * 200, 190, 0);
                    console.log(`✓ Фото ${i + 1} добавлено в PDF`);
                } else {
                    console.warn(`⚠️ Фото ${i + 1} не удалось конвертировать в Data URL`);
                }
            }
        } else {
            console.warn('⚠️ Нет фото для добавления в PDF. Будет создан PDF только с текстом.');
        }

        // Добавление текста
        doc.setFontSize(12);
        doc.text('Тестовый текст на кириллице: Привет, мир!', 10, 30);
        console.log('✓ Текстовый контент добавлен в PDF');

        // Сохранение PDF
        console.log('💾 Сохраняем PDF...');
        const saveSuccess = savePdfDocument(doc, downloadLink);

        if (saveSuccess) {
            console.log('🎉 PDF успешно создан и сохранён!');
        } else {
            throw new Error('Ошибка при сохранении PDF');
        }
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА при генерации PDF:', error.message);
        alert('Ошибка при создании PDF: ' + error.message + '\nПроверьте консоль (F12) для деталей.');
        throw error;
    } finally {
        console.groupEnd();
    }
}

// Функция конвертации File в Data URL
async function convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}
