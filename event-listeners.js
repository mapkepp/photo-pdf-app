import { generatePdf } from './pdfmake-generator.js';
import { setupPhotoPreview } from './photo-preview.js';

document.addEventListener('DOMContentLoaded', () => {
    console.group('🎛️ event-listeners: Инициализация обработчиков событий');

    const generatePdfButton = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');
    const uploadInput = document.getElementById('photo-upload');

    // Детальная диагностика элементов DOM
    console.log('🔎 Поиск элементов в DOM:');
    console.log('  - Кнопка #generate-pdf:', generatePdfButton);
    console.log('  - Ссылка #download-link:', downloadLink);
    console.log('  - Поле загрузки #photo-upload:', uploadInput);

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

    if (!uploadInput) {
        console.warn('⚠️ event-listeners: Поле загрузки #photo-upload не найдено в DOM');
        console.warn('  - Функционал предпросмотра фото будет недоступен');
    } else {
        // Инициализируем предпросмотр фото
        setupPhotoPreview();
        console.log('✓ Модуль предпросмотра фото инициализирован');
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

            if (photos.length === 0) {
                console.warn('⚠️ Нет фотографий для добавления в PDF');
                showStatus('Выберите фотографии для создания PDF', 'error');
                return;
            }

            console.log(`📷 Количество фото для добавления: ${photos.length}`);

            showStatus('Создание PDF...', 'info');

            await generatePdf(photos, downloadLink);

            console.log('✅ Вызов generatePdf выполнен успешно');
            showStatus('PDF успешно создан! Нажмите "Скачать PDF"', 'success');
        } catch (error) {
            console.error('❌ Ошибка в обработчике клика:', error.message);
            showStatus(`Ошибка при создании PDF: ${error.message}`, 'error');
        } finally {
            console.groupEnd();
        }
    });

    // Функция для отображения статуса (если ещё не определена)
    function showStatus(message, type) {
        const statusElement = document.getElementById('pdf-status');
        if (!statusElement) return;

        statusElement.textContent = message;
        statusElement.className = 'status-message';

        switch (type) {
            case 'success':
                statusElement.classList.add('status-success');
                break;
            case 'error':
                statusElement.classList.add('status-error');
                break;
            case 'info':
                statusElement.style.background = '#fff3cd';
                statusElement.style.color = '#856404';
                break;
        }
    }

    console.log('🎉 Обработчики событий успешно назначены');
    console.groupEnd();
});
