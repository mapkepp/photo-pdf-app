import { setupPhotoPreview } from './photo-preview.js';
import { ImageOptimizer } from './image-optimizer.js';

/**
 * Отображает статус в интерфейсе
 * @param {HTMLElement} statusElement — элемент для отображения статуса
 * @param {string} message — текст сообщения
 * @param {string} type — тип статуса ('success', 'error', 'info')
 */
function showStatus(statusElement, message, type) {
    console.group('📝 showStatus: Обновление статуса');
    console.log('  - Сообщение:', message);
    console.log('  - Тип:', type);

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

/**
 * Очищает статус в интерфейсе
 * @param {HTMLElement} statusElement — элемент статуса для очистки
 */
function clearStatus(statusElement) {
    console.group('🗑️ clearStatus: Очистка статуса');

    if (!statusElement) {
        console.warn('⚠️ Элемент статуса (#pdf-status) не найден — пропуск очистки');
        console.groupEnd();
        return;
    }

    statusElement.textContent = '';
    statusElement.className = 'status-message';
    statusElement.style.removeProperty('background');
    statusElement.style.removeProperty('color');
    console.log('✓ Статус успешно очищен');
    console.groupEnd();
}

/**
 * Генерирует PDF из изображений и комментариев
 * @param {string[]} images — массив Data URL изображений
 * @param {string} title — заголовок документа
 * @param {string} subtitle — подзаголовок документа
 * @param {string[]} comments — массив комментариев к изображениям
 * @returns {Promise<void>}
 */
async function generatePDF(images, title, subtitle, comments) {
    // Заглушка для реальной реализации генерации PDF
    console.group('🖨️ generatePDF: Генерация PDF документа');
    console.log('  - Количество изображений:', images.length);
    console.log('  - Заголовок:', title);
    console.log('  - Подзаголовок:', subtitle);
    console.log('  - Количество комментариев:', comments.length);

    // Здесь должна быть реальная логика генерации PDF (например, с использованием jsPDF)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация асинхронной операции

    console.log('✅ PDF успешно сгенерирован (имитация)');
    console.groupEnd();
}

/**
 * Инициализирует все обработчики событий приложения
 */
export function setupEventListeners() {
    console.group('🎯 setupEventListeners: Инициализация обработчиков событий');

    // Инициализируем модуль предпросмотра
    const previewInitialized = setupPhotoPreview();
    console.log('✓ Модуль предпросмотра инициализирован:', previewInitialized);

    // Инициализируем оптимизатор изображений
    const imageOptimizer = new ImageOptimizer();
    console.log('✓ Оптимизатор изображений инициализирован:', imageOptimizer);

    // Обработчик генерации PDF
    const generateButton = document.getElementById('generate-pdf');
    const downloadLink = document.getElementById('download-link');

    if (generateButton) {
        generateButton.addEventListener('click', async function() {
            console.group('🖨️ Обработчик click: Генерация PDF');

            if (!window.photos || window.photos.length === 0) {
                console.warn('⚠️ Нет фотографий для генерации PDF');
                const statusElement = document.getElementById('pdf-status');
                if (statusElement) {
                    showStatus(statusElement, 'Нет фотографий для создания PDF', 'error');
                }
                console.groupEnd();
                return;
            }

            const statusElement = document.getElementById('pdf-status');
            try {
                // Показываем статус обработки
                if (statusElement) {
                    showStatus(statusElement, 'Оптимизация изображений...', 'info');
                }

                // Оптимизируем изображения перед генерацией PDF
                console.log('🔄 Начинаем оптимизацию изображений для PDF...');
                const optimizedImages = await imageOptimizer.optimizeImagesBatch(window.photos);
                console.log('✓ Изображения оптимизированы:', optimizedImages.length);

                // Получаем данные из формы
                const documentTitle = document.getElementById('document-title')?.value || 'Фотоотчёт';
                const subtitle = document.getElementById('subtitle')?.value || '';

                // Генерируем PDF
                await generatePDF(
                    optimizedImages,
            documentTitle,
            subtitle,
            window.photoComments
        );

        // Показываем успех
        if (statusElement) {
            showStatus(statusElement, 'PDF успешно создан! Нажмите на ссылку для скачивания.', 'success');
        }

        console.log('✅ PDF успешно сгенерирован');
    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            showStatus(
                statusElement,
                'Ошибка при создании PDF: ' + error.message,
                'error'
            );
        }
    }
    console.groupEnd();
});
} else {
    console.warn('⚠️ Кнопка #generate-pdf не найдена в DOM');
}

// Обработчик очистки предпросмотра
const clearButton = document.getElementById('clear-preview');
if (clearButton) {
    clearButton.addEventListener('click', function() {
        console.group('🗑️ Обработчик click: Очистка предпросмотра');

        window.photos = [];
        window.photoComments = [];

        const previewContainer = document.getElementById('photo-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }

        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            clearStatus(statusElement);
        }

        console.log('✓ Предпросмотр очищен');
        console.groupEnd();
    });
} else {
    console.warn('⚠️ Кнопка #clear-preview не найдена в DOM');
}

console.log('🎉 Все обработчики событий успешно инициализированы');
console.groupEnd();
}

// Экспортируем только необходимые функции
export { showStatus, clearStatus, setupEventListeners };
