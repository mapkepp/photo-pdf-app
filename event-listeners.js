import { setupPhotoPreview } from './photo-preview.js';
import { ImageOptimizer } from './image-optimizer.js';

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
                if (document.getElementById('pdf-status')) {
                    showStatus(document.getElementById('pdf-status'), 'Нет фотографий для создания PDF', 'error');
                }
                console.groupEnd();
                return;
            }

            try {
                // Оптимизируем изображения перед генерацией PDF
                console.log('🔄 Начинаем оптимизацию изображений для PDF...');
                const optimizedImages = await imageOptimizer.optimizeImagesBatch(window.photos);
                console.log('✓ Изображения оптимизированы:', optimizedImages.length);

                // Генерируем PDF
                await generatePDF(
                    optimizedImages,
            document.getElementById('document-title').value,
            document.getElementById('subtitle').value,
            window.photoComments
        );

        console.log('✅ PDF успешно сгенерирован');
    } catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        if (document.getElementById('pdf-status')) {
            showStatus(
                document.getElementById('pdf-status'),
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

console.log('🎉 Все обработчики событий успешно инициализированы');
console.groupEnd();
}

// Экспортируем только необходимые функции
export { showStatus, clearStatus };
