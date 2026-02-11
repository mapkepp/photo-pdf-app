export function setupPhotoPreview() {
    const uploadInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview');
    const maxPreviewSize = 150; // Максимальный размер превью в пикселях

    if (!uploadInput || !previewContainer) {
        console.error('❌ Элементы для загрузки/предпросмотра фото не найдены в DOM');
        return;
    }

    uploadInput.addEventListener('change', function(event) {
        const files = event.target.files;

        // Очищаем контейнер предпросмотра
        previewContainer.innerHTML = '';

        if (files.length === 0) {
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
