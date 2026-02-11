import { generatePdf } from './pdf-generator.js';

document.addEventListener('DOMContentLoaded', () => {
    console.group('🎛️ event-listeners: Инициализация обработчиков событий');

    const generatePdfButton = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');

    // Детальная диагностика элементов DOM
    console.log('🔎 Поиск элементов в DOM:');
    console.log('  - Кнопка #generate-pdf:', generatePdfButton);
    console.log('  - Ссылка #download-link:', downloadLink);

    // Критические проверки существования элементов
    if (!generatePdfButton) {
        const errorMsg = '❌ event-listeners: Кнопка #generate-pdf не найдена в DOM';
        console.error(errorMsg);
        console.groupEnd();
        return;
    }

    if (!downloadLink) {
        const errorMsg = '❌ event-listeners: Ссылка #download-link не найдена в DOM';
        console.error(errorMsg);
        console.groupEnd();
        return;
    }

    console.log('✓ Все необходимые элементы найдены в DOM');
    console.log('  - Кнопка ID:', generatePdfButton.id);
    console.log('  - Кнопка тег:', generatePdfButton.tagName);
    console.log('  - Кнопка класс:', generatePdfButton.className);
    console.log('  - Ссылка ID:', downloadLink.id);
    console.log('  - Ссылка тег:', downloadLink.tagName);
    console.log('  - Ссылка класс:', downloadLink.className);

    // Дополнительная проверка доступности свойств элемента ссылки
    console.log('🔎 Проверка свойств downloadLink:');
    console.log('  - Свойство href доступно:', 'href' in downloadLink);
    console.log('  - Свойство download доступно:', 'download' in downloadLink);
    console.log('  - Текущее значение href:', downloadLink.href);
    console.log('  - Текущее значение download:', downloadLink.download);

    // Проверка, что ссылка действительно может использоваться для скачивания
    if (downloadLink.tagName !== 'A') {
        console.warn('⚠️ event-listeners: downloadLink — не ссылка (<a>), а:', downloadLink.tagName);
        console.warn('  - Рекомендуется использовать элемент <a> для скачивания файлов');
    } else {
        console.log('✓ downloadLink является элементом <a>, подходит для скачивания');
    }

    // Назначение обработчика клика
    generatePdfButton.addEventListener('click', async () => {
        console.group('🖱️ Обработчик клика: Нажатие на кнопку #generate-pdf');

        try {
            // Логирование состояния перед вызовом generatePdf
            console.log('🔎 Состояние перед вызовом generatePdf:');
            console.log('  - photos (window.photos):', window.photos);
            console.log('  - downloadLink (передаётся в функцию):', downloadLink);
            console.log('  - Тип downloadLink:', typeof downloadLink);
            console.log('  - Является ли DOM‑элементом:', downloadLink instanceof Element);

            const photos = window.photos || [];

            // Дополнительная проверка photos
            if (!Array.isArray(photos)) {
                console.warn('⚠️ window.photos не является массивом. Преобразуем в массив.');
                photos = photos ? [photos] : [];
            }
            console.log(`📷 Количество фото для добавления: ${photos.length}`);

            await generatePdf(photos, downloadLink);
            console.log('✅ Вызов generatePdf выполнен успешно');
        } catch (error) {
            console.error('❌ Ошибка в обработчике клика:', error.message);
        } finally {
            console.groupEnd();
        }
    });

    console.log('🎉 Обработчики событий успешно назначены');
    console.groupEnd();
});
