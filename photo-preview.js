export function setupPhotoPreview() {
    const uploadInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview');
    const statusElement = document.getElementById('pdf-status');

    if (!uploadInput || !previewContainer) {
        console.error('❌ Элементы для загрузки/предпросмотра фото не найдены в DOM');
        return;
    }

    uploadInput.addEventListener('change', function(event) {
        const files = event.target.files;

        // Очищаем контейнер предпросмотра и статус
        previewContainer.innerHTML = '';
        clearStatus();

        if (files.length === 0) {
            showStatus('Нет выбранных файлов для предпросмотра', 'info');
            console.log('🔎 Нет выбранных файлов для предпросмотра');
            return;
        }

        console.log(`📷 Загружено ${files.length} фото(ов) для предпросмотра`);

        // Сохраняем файлы глобально для использования в генерации PDF
        window.photos = Array.from(files);

        // Обрабатываем каждый файл для создания превью
        Array.from(files).forEach((file, index) => {
            if (!file.type.match('image.*')) {
                console.warn(`⚠️ Файл ${file.name} не является изображением, пропускаем`);
                showStatus(`Файл ${file.name} не является изображением`, 'error');
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                // Создаём элемент контейнера для фото
                const photoContainer = document.createElement('div');
                photoContainer.className = 'photo-preview-item';

                // Создаём изображение
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Preview ${file.name}`;
                img.className = 'preview-image';

                // Добавляем подпись с именем файла и размером
                const caption = document.createElement('div');
                caption.className = 'preview-caption';
                caption.textContent = `${file.name} (${formatFileSize(file.size)})`;

                // Собираем всё вместе
                photoContainer.appendChild(img);
                photoContainer.appendChild(caption);
                previewContainer.appendChild(photoContainer);

                console.log(`✓ Создан предпросмотр для: ${file.name}`);
            };

            reader.onerror = function() {
                console.error(`❌ Ошибка при чтении файла: ${file.name}`);
                // Создаём заглушку для проблемных файлов
                const errorContainer = document.createElement('div');
                errorContainer.className = 'photo-preview-item error';
                errorContainer.innerHTML = `
                    <div class="error-icon">❌</div>
            <div class="preview-caption">Ошибка загрузки: ${file.name}</div>
                `;
                previewContainer.appendChild(errorContainer);
                showStatus(`Ошибка при загрузке файла: ${file.name}`, 'error');
            };

            // Читаем файл как Data URL для отображения
            reader.readAsDataURL(file);
        });

        // Активируем кнопку генерации PDF, если есть фото
        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.classList.remove('disabled');
            console.log('✓ Кнопка "Создать PDF" активирована');
        }

        // Обновляем статус
        showStatus(`Загружено ${files.length} фото(ов). Готов к созданию PDF.`, 'success');
    });

    // Добавляем обработчик для очистки предпросмотра при повторном выборе файлов
    uploadInput.addEventListener('click', function() {
        // При клике на загрузку очищаем старый предпросмотр
        previewContainer.innerHTML = '';

        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.classList.add('disabled');
        }
    });
}

// Вспомогательная функция для форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Функция для отображения статуса
function showStatus(message, type) {
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
        default:
            statusElement.style.background = '#fff3cd';
            statusElement.style.color = '#856404';
    }
}

// Функция для очистки статуса
function clearStatus() {
    if (!statusElement) return;
    statusElement.textContent = '';
    statusElement.className = 'status-message';
}
