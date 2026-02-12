import { setupPhotoPreview, updatePhotoPreview } from './photo-preview.js';
import { ImageOptimizer } from './image-optimizer.js';
import { generatePDF } from './pdfmake-generator.js';

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
 * Обрабатывает загрузку фотографий
 * @param {Event} event — событие изменения файла
 */
async function handlePhotoUpload(event) {
    console.group('🖼️ handlePhotoUpload: Обработка загрузки фотографий');

    const files = event.target.files;
    if (!files || files.length === 0) {
        console.warn('⚠️ Файлы не выбраны');
        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            showStatus(statusElement, 'Файлы не выбраны', 'error');
        }
        console.groupEnd();
        return;
    }

    try {
        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            showStatus(statusElement, `Загружается ${files.length} фото...`, 'info');
        }

        // Инициализируем массивы, если они не существуют
        window.photos = window.photos || [];
        window.photoComments = window.photoComments || [];

        // Оптимизируем изображения
        const imageOptimizer = new ImageOptimizer();
        const optimizedImages = await imageOptimizer.optimizeImagesBatch(Array.from(files));

        // Добавляем оптимизированные изображения и пустые комментарии
        window.photos.push(...optimizedImages);
        window.photoComments.push(...Array(files.length).fill(''));

        console.log(`✓ Загружено и оптимизировано ${optimizedImages.length} изображений`);

        // Обновляем предпросмотр
        updatePhotoPreview(window.photos, window.photoComments);

        if (statusElement) {
            showStatus(statusElement, `Успешно загружено ${files.length} фото`, 'success');
        }
    } catch (error) {
        console.error('❌ Ошибка при загрузке фотографий:', error);
        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            showStatus(
                statusElement,
                'Ошибка при загрузке фотографий: ' + error.message,
                'error'
            );
        }
    }
    console.groupEnd();
}

/**
 * Реализует перемещение фотографий с комментариями
 * @param {number} fromIndex — индекс исходного фото
 * @param {number} toIndex — индекс целевого фото
 */
function movePhoto(fromIndex, toIndex) {
    console.group('🔄 movePhoto: Перемещение фотографии');
    console.log('  - Из позиции:', fromIndex);
    console.log('  - В позицию:', toIndex);

    // Проверяем корректность индексов
    if (fromIndex < 0 || toIndex < 0 ||
        fromIndex >= window.photos.length ||
        toIndex >= window.photos.length) {
        console.warn('⚠️ Некорректные индексы для перемещения');
        console.groupEnd();
        return false;
    }

    // Меняем местами изображения
    [window.photos[fromIndex], window.photos[toIndex]] = [window.photos[toIndex], window.photos[fromIndex]];
    // Меняем местами комментарии
    [window.photoComments[fromIndex], window.photoComments[toIndex]] =
        [window.photoComments[toIndex], window.photoComments[fromIndex]];

    console.log('✓ Фото и комментарий успешно перемещены');
    console.groupEnd();
    return true;
}

/**
 * Настраивает обработчики перемещения фотографий (drag-and-drop)
 */
function setupPhotoReordering() {
    console.group('🔄 setupPhotoReordering: Настройка перемещения фотографий');

    const previewContainer = document.getElementById('photo-preview');
    if (!previewContainer) {
        console.warn('⚠️ Контейнер предпросмотра (#photo-preview) не найден');
        console.groupEnd();
        return false;
    }

    let draggedItem = null;

    previewContainer.addEventListener('dragstart', function(e) {
        if (e.target.classList.contains('photo-item')) {
            draggedItem = e.target;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.innerHTML);
            console.log('✓ Начато перетаскивание фото:', e.target.dataset.index);
        }
    });

    previewContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (e.target.classList.contains('photo-item') && e.target !== draggedItem) {
            e.target.style.border = '2px dashed #007bff';
        }
    });

    previewContainer.addEventListener('dragleave', function(e) {
        if (e.target.classList.contains('photo-item')) {
            e.target.style.border = '';
        }
    });

    previewContainer.addEventListener('drop', function(e) {
        e.preventDefault();

        if (draggedItem && e.target.classList.contains('photo-item') && e.target !== draggedItem) {
            const fromIndex = parseInt(draggedItem.dataset.index, 10);
            const toIndex = parseInt(e.target.dataset.index, 10);

            // Перемещаем фото и комментарии
            if (movePhoto(fromIndex, toIndex)) {
                // Обновляем предпросмотр после перемещения
                updatePhotoPreview(window.photos, window.photoComments);
                console.log('✓ Предпросмотр обновлён после перемещения');
            }

            e.target.style.border = '';
            draggedItem = null;
        }
    });

    console.log('✅ Обработчики перемещения фотографий настроены');
    console.groupEnd();
    return true;
}

/**
 * Инициализирует все обработчики событий приложения
 */
export function setupEventListeners() {
    console.group('🎯 setupEventListeners: Инициализация обработчиков событий');

        // Инициализируем модуль предпросмотра
    const previewInitialized = setupPhotoPreview();
    console.log('✓ Модуль предпросмотра инициализирован:', previewInitialized);

    // Настраиваем перемещение фотографий
    const reorderingSetup = setupPhotoReordering();
    console.log('✓ Настройка перемещения фото завершена:', reorderingSetup);

    // Инициализируем оптимизатор изображений
    const imageOptimizer = new ImageOptimizer();
    console.log('✓ Оптимизатор изображений инициализирован:', imageOptimizer);

    // Обработчик загрузки фотографий
    const uploadInput = document.getElementById('photo-upload');
    if (uploadInput) {
        uploadInput.addEventListener('change', handlePhotoUpload);
        console.log('✓ Обработчик загрузки фото (#photo-upload) установлен');
    } else {
        console.warn('⚠️ Элемент #photo-upload не найден в DOM');
    }

    // Обработчик добавления дополнительных фото
    const addPhotosButton = document.getElementById('add-photos');
    if (addPhotosButton) {
        addPhotosButton.addEventListener('click', function() {
            console.group('🖼️ Обработчик click: Добавление дополнительных фото');
            // Имитируем клик по полю загрузки файлов
            const uploadInput = document.getElementById('photo-upload');
            if (uploadInput) {
                uploadInput.click();
            } else {
                console.warn('⚠️ Элемент #photo-upload не найден для добавления фото');
            }
            console.groupEnd();
        });
        console.log('✓ Обработчик добавления дополнительных фото (#add-photos) установлен');
    } else {
        console.warn('⚠️ Кнопка #add-photos не найдена в DOM');
    }

    // Обработчик генерации PDF
    const generateButton = document.getElementById('generate-pdf');
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

        // Проверяем существование массивов перед очисткой
        if (window.photos && window.photos.length > 0) {
            console.log('✓ Найдено фотографий для очистки:', window.photos.length);
            window.photos = [];
        } else {
            console.log('⚠️ Массив window.photos пуст или не существует');
        }

        if (window.photoComments && window.photoComments.length > 0) {
            console.log('✓ Найдено комментариев для очистки:', window.photoComments.length);
            window.photoComments = [];
        } else {
            console.log('⚠️ Массив window.photoComments пуст или не существует');
        }

        // Очищаем контейнер предпросмотра
        const previewContainer = document.getElementById('photo-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
            console.log('✓ Контейнер предпросмотра (#photo-preview) очищен');
        } else {
            console.warn('⚠️ Элемент #photo-preview не найден в DOM');
        }

        // Очищаем поля ввода
        const documentTitleInput = document.getElementById('document-title');
        const subtitleTextarea = document.getElementById('subtitle');

        if (documentTitleInput) {
            documentTitleInput.value = '';
            console.log('✓ Поле ввода заголовка очищено');
        }

        if (subtitleTextarea) {
            subtitleTextarea.value = '';
            console.log('✓ Текстовое поле подзаголовка очищено');
        }

        // Сбрасываем поле загрузки файлов
        const uploadInput = document.getElementById('photo-upload');
        if (uploadInput) {
            uploadInput.value = '';
            console.log('✓ Поле загрузки файлов (#photo-upload) сброшено');
        }

        // Очищаем статус
        const statusElement = document.getElementById('pdf-status');
        if (statusElement) {
            clearStatus(statusElement);
        }

        console.log('🎉 Предпросмотр успешно очищен полностью');
        console.groupEnd();
    });
    console.log('✓ Обработчик очистки предпросмотра (#clear-preview) установлен');
} else {
    console.warn('⚠️ Кнопка #clear-preview не найдена в DOM');
}

console.log('🎉 Все обработчики событий успешно инициализированы');
console.groupEnd();
}

// Экспортируем только необходимые функции
export { showStatus, clearStatus, setupEventListeners };
