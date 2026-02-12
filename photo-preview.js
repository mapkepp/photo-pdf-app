export function setupPhotoPreview() {
    console.group('🖼️ setupPhotoPreview: Инициализация модуля предпросмотра');

    const uploadInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview');
    const statusElement = document.getElementById('pdf-status');

    console.log('🔎 Проверка элементов DOM:');
    console.log('  - Поле загрузки (#photo-upload):', uploadInput);
    console.log('  -Контейнер предпросмотра (#photo-preview):', previewContainer);
    console.log('  -Элемент статуса (#pdf-status):', statusElement);

    if (!uploadInput) {
        console.error('❌ Элемент #photo-upload не найден в DOM');
        console.groupEnd();
        return false;
    }

    if (!previewContainer) {
        console.error('❌ Элемент #photo-preview не найден в DOM');
        console.groupEnd();
        return false;
    }

    console.log('✓ Все основные элементы найдены в DOM');

    uploadInput.addEventListener('change', function(event) {
        console.group('📤 Обработчик change: Загрузка файлов');

        const files = event.target.files;
        console.log(`📷 Найдено файлов: ${files ? files.length : 0}`);

        // Очищаем контейнер предпросмотра
        previewContainer.innerHTML = '';
        console.log('✓ Контейнер предпросмотра очищен');

        // Безопасный вызов clearStatus — передаём statusElement
        if (statusElement) {
            clearStatus(statusElement);
            console.log('✓ Статус очищен');
        } else {
            console.warn('⚠️ Элемент #pdf-status не найден — статус не будет обновлён');
        }

        if (!files || files.length === 0) {
            if (statusElement) {
                showStatus(statusElement, 'Нет выбранных файлов для предпросмотра', 'info');
            }
            console.log('🔎 Нет выбранных файлов для предпросмотра');
            console.groupEnd();
            return;
        }

        console.log(`📷 Загружено ${files.length} фото(ов) для предпросмотра`);

        // Сохраняем файлы глобально для использования в генерации PDF
        window.photos = Array.from(files);
        console.log('✓ Файлы сохранены в window.photos:', window.photos);

        // Обрабатываем каждый файл для создания превью
        Array.from(files).forEach((file, index) => {
            console.group(`🖼️ Обработка файла ${index + 1}: ${file.name}`);
            console.log('  -Размер: ' + formatFileSize(file.size));
            console.log('  -Тип: ' + file.type);
            console.log('  -Файл объект:', file);

            if (!file.type.match('image.*')) {
                console.warn(`⚠️ Файл ${file.name} не является изображением, пропускаем`);
                if (statusElement) {
                    showStatus(statusElement, `Файл ${file.name} не является изображением`, 'error');
                }
                console.groupEnd();
                return;
            }

            const reader = new FileReader();

            reader.onload = function(e) {
                console.log(`✅ Файл ${file.name} успешно прочитан (Data URL создан)`);
                console.log('  -Data URL:', e.target.result.substring(0, 50) + '...');

                // Создаём элемент контейнера для фото
                const photoContainer = document.createElement('div');
                photoContainer.className = 'photo-preview-item';
                console.log('  -Создан контейнер для фото:', photoContainer);

                // Создаём изображение
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Preview ${file.name}`;
                img.className = 'preview-image';
                console.log('  -Создано изображение:', img);

                // Добавляем подпись с именем файла и размером
                const caption = document.createElement('div');
                caption.className = 'preview-caption';
                caption.textContent = `${file.name} (${formatFileSize(file.size)})`;
                console.log('  -Создана подпись:', caption);

                // Собираем всё вместе
                photoContainer.appendChild(img);
                photoContainer.appendChild(caption);
                previewContainer.appendChild(photoContainer);
                console.log(`✓ Предпросмотр для ${file.name} добавлен в DOM`);
                console.groupEnd();
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
                if (statusElement) {
                    showStatus(statusElement, `Ошибка при загрузке файла: ${file.name}`, 'error');
                }
                console.groupEnd();
            };

            // Читаем файл как Data URL для отображения
            console.log(`🔄 Начинаем чтение файла: ${file.name}`);
            reader.readAsDataURL(file);
        });

        // Активируем кнопку генерации PDF, если есть фото
        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = false;
            generateButton.classList.remove('disabled');
            console.log('✓ Кнопка "Создать PDF" активирована');
        } else {
            console.warn('⚠️ Кнопка #generate-pdf не найдена в DOM');
        }

        // Обновляем статус, если элемент существует
        if (statusElement) {
            showStatus(statusElement, `Загружено ${files.length} фото(ов). Готов к созданию PDF.`, 'success');
            console.log('✓ Статус обновлён: готов к созданию PDF');
        }
        console.groupEnd();
    });

    // Добавляем обработчик для очистки предпросмотра при повторном выборе файлов
    uploadInput.addEventListener('click', function() {
        console.group('🗑️ Обработчик click: Очистка предпросмотра');

        // При клике на загрузку очищаем старый предпросмотр
        previewContainer.innerHTML = '';
        console.log('✓ Старый предпросмотр очищен');

        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.classList.add('disabled');
            console.log('✓ Кнопка "Создать PDF" деактивирована');
        }

        // Безопасный вызов clearStatus при клике — передаём statusElement
        if (statusElement) {
            clearStatus(statusElement);
            console.log('✓ Статус очищен при клике');
        }
        console.groupEnd();
    });

    console.log('🎉 Модуль предпросмотра успешно инициализирован');
    console.groupEnd();

    return true;
}

// Вспомогательная функция для форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Функция для отображения статуса — принимает statusElement как параметр
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

// Функция для очистки статуса — принимает statusElement как параметр
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
