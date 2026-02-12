import { ImageOptimizer } from './image-optimizer.js';

// Инициализируем оптимизатор
const imageOptimizer = new ImageOptimizer();

export function setupEventListeners() {
    console.group('🎛️ event-listeners: Инициализация обработчиков событий');

    const generateButton = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');
    const uploadInput = document.getElementById('photo-upload');
    const statusElement = document.getElementById('pdf-status');

    console.log('🔎 Поиск элементов в DOM:');
    console.log('  - Кнопка #generate-pdf:', generateButton);
    console.log('  - Ссылка #download-link:', downloadLink);
    console.log('  - Поле загрузки #photo-upload:', uploadInput);
    console.log('  - Элемент статуса #pdf-status:', statusElement);

    if (!generateButton) {
        console.error('❌ Элемент #generate-pdf не найден в DOM');
        console.groupEnd();
        return false;
    }

    if (!downloadLink) {
        console.error('❌ Элемент #download-link не найден в DOM');
        console.groupEnd();
        return false;
    }

    if (!uploadInput) {
        console.error('❌ Элемент #photo-upload не найден в DOM');
        console.groupEnd();
        return false;
    }

    if (!statusElement) {
        console.warn('⚠️ Элемент #pdf-status не найден в DOM — статус не будет обновляться');
    }

    console.log('✓ Все необходимые элементы найдены в DOM');
    console.log('  - Кнопка ID:', generateButton.id);
    console.log('  - Кнопка тег:', generateButton.tagName);
    console.log('  - Кнопка класс:', generateButton.className);
    console.log('  - Ссылка ID:', downloadLink.id);
    console.log('  - Ссылка тег:', downloadLink.tagName);
    console.log('  - Ссылка класс:', downloadLink.className);

    // Проверка свойств downloadLink
    console.log('🔎 Проверка свойств downloadLink:');
    console.log('  - Свойство href доступно:', 'href' in downloadLink);
    console.log('  - Свойство download доступно:', 'download' in downloadLink);
    console.log('  - Текущее значение href:', downloadLink.href);
    console.log('  - Текущее значение download:', downloadLink.download);

    if (downloadLink.tagName !== 'A') {
        console.error('❌ Элемент #download-link не является ссылкой <a>');
        console.groupEnd();
        return false;
    }

    console.log('✓ downloadLink является элементом <a>, подходит для скачивания');

    // Обработчик клика на кнопку генерации PDF
    generateButton.addEventListener('click', function() {
        console.group('🖱️ Обработчик клика: Нажатие на кнопку #generate-pdf');

        // Проверка состояния перед вызовом generatePdf
        console.log('🔎 Состояние перед вызовом generatePdf:');
        console.log('  - photos (window.photos):', window.photos);
        console.log('  - downloadLink (передаётся в функцию):', downloadLink);
        console.log('  - Тип downloadLink:', typeof downloadLink);
        console.log('  - Является ли DOM‑элементом:', downloadLink instanceof Element);

        generatePdf();
        console.groupEnd();
    });

    console.log('🎉 Обработчики событий успешно назначены');
    console.groupEnd();

    return true;
}

/**
 * Функция генерации PDF с оптимизацией изображений
 */
async function generatePdf() {
    console.group('📄 generatePdf: Начало генерации PDF');

    const title = document.getElementById('document-title').value || 'Мои фотографии';
    const downloadLink = document.getElementById('download-link');

    console.log('📝 Заголовок документа:', title);
    console.log('📷 Количество фото для добавления:', window.photos?.length || 0);

    if (!window.photos || window.photos.length === 0) {
        if (statusElement) {
            showStatus(statusElement, 'Нет фотографий для создания PDF', 'error');
        }
        console.warn('❌ Нет фотографий для создания PDF');
        console.groupEnd();
        return;
    }

    try {
        // Оптимизируем изображения перед добавлением в PDF
        console.log('🛠️ Начинаем оптимизацию изображений...');
        const optimizedImages = await imageOptimizer.optimizeImagesBatch(window.photos);
        console.log('✅ Изображения оптимизированы, количество:', optimizedImages.length);

        // Создаём структуру PDF
        const docDefinition = {
            content: [
                { text: title, style: 'header' },
                ...optimizedImages.map((dataUrl, index) => {
                    const comment = window.photoComments?.[index] || '';
            return [
                { image: dataUrl, width: 500 },
                comment ? { text: comment, style: 'comment' } : null
            ].filter(Boolean);
        })
    ],
    styles: {
        header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        comment: {
            fontSize: 10,
            italics: true,
            margin: [0, 5, 0, 15]
        }
    }
};

        // Генерируем PDF
        const pdfDoc = pdfMake.createPdf(docDefinition);

        pdfDoc.getBlob(blob => {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.click();
            if (statusElement) {
                showStatus(statusElement, `PDF создан и готов к скачиванию (${window.photos.length} фото)`, 'success');
            }
            console.log('🎉 PDF успешно создан и подготовлен к скачиванию');
        });
    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        if (statusElement) {
            showStatus(statusElement, 'Ошибка при создании PDF: ' + error.message, 'error');
        }
    }

    console.groupEnd();
}

/**
 * Функция для отображения статуса — принимает statusElement как параметр
 */
function showStatus(statusElement, message, type) {
    console.group('📝 showStatus: Обновление статуса');
    console.log('  - Сообщение: ' + message);
    console.log('  - Тип: ' + type);

    if (!statusElement) {
        console.warn('⚠️ Элемент статуса (#pdf-status) не найден');
        console.groupEnd();
        return;
    }

    statusElement.textContent = message;
    statusElement.className = 'status-message';

    switch (type) {
        case 'success':
            statusElement.classList.remove('status-error');
            statusElement.classList.add('status-success');
            console.log('✓ Установлен класс статуса: status-success');
            break;
        case 'error':
            statusElement.classList.remove('status-success');
            statusElement.classList.add('status-error');
            console.log('✓ Установлен класс статуса: status-error');
            break;
        default:
            statusElement.classList.remove('status-success', 'status-error');
            statusElement.style.background = '#fff3cd';
            statusElement.style.color = '#856404';
            console.log('✓ Установлены стили для информационного статуса');
            break;
    }
    console.log('✓ Статус успешно обновлён');
    console.groupEnd();
}
