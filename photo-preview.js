export function setupPhotoPreview() {
    console.group('🖼️ setupPhotoPreview: Инициализация модуля предпросмотра');

    const uploadInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview');
    const statusElement = document.getElementById('pdf-status');
    const clearButton = document.getElementById('clear-preview');
    const titleInput = document.getElementById('document-title');
    const subtitleInput = document.getElementById('subtitle');

    console.log('🔎 Проверка элементов DOM:');
    console.log('  - Поле загрузки (#photo-upload):', uploadInput);
    console.log('  - Контейнер предпросмотра (#photo-preview):', previewContainer);
    console.log('  - Элемент статуса (#pdf-status):', statusElement);
    console.log('  - Кнопка очистки (#clear-preview):', clearButton);
    console.log('  - Поле заголовка (#document-title):', titleInput);
    console.log('  - Поле подзаголовка (#subtitle):', subtitleInput);

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

    // Инициализируем глобальные массивы
    window.photos = window.photos || [];
    window.photoComments = window.photoComments || {};
    console.log('✓ Глобальные массивы инициализированы:', window.photos.length, 'фото');

    // Обработчик добавления фотографий
    uploadInput.addEventListener('change', function(event) {
        console.group('📤 Обработчик change: Добавление новых фотографий');

        const files = event.target.files;
        console.log(`📷 Найдено новых файлов: ${files ? files.length : 0}`);

        if (!files || files.length === 0) {
            if (statusElement) {
                showStatus(statusElement, 'Нет выбранных файлов для добавления', 'info');
            }
            console.log('🔎 Нет выбранных файлов для добавления');
            console.groupEnd();
            return;
        }

        // Добавляем новые файлы к существующим
        const newFiles = Array.from(files);
        window.photos = [...window.photos, ...newFiles];
        console.log('✓ Файлы добавлены к существующим:', window.photos.length, 'всего фото');

        // Обновляем предпросмотр
        updatePreview();
        console.groupEnd();
    });

    // Обработчик очистки по кнопке
    clearButton.addEventListener('click', function() {
        console.group('🗑️ Обработчик click: Очистка предпросмотра по кнопке');

        // Очищаем глобальные массивы
        window.photos = [];
        window.photoComments = {};
        console.log('✓ Глобальные массивы очищены');

        // Очищаем контейнер предпросмотра
        previewContainer.innerHTML = '';
        console.log('✓ Контейнер предпросмотра очищен');

                // Деактивируем кнопку генерации PDF
        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.classList.add('disabled');
            console.log('✓ Кнопка "Создать PDF" деактивирована');
        }

        // Обновляем статус
        if (statusElement) {
            showStatus(statusElement, 'Предпросмотр очищен. Загрузите фотографии для продолжения.', 'info');
            console.log('✓ Статус обновлён');
        } else {
            console.warn('⚠️ Элемент #pdf-status не найден — статус не будет обновлён');
        }
        console.groupEnd();
    });

    // Функция обновления предпросмотра
    function updatePreview() {
        console.group('🔄 updatePreview: Обновление предпросмотра');

        previewContainer.innerHTML = '';
        console.log('✓ Контейнер предпросмотра очищен перед обновлением');

        if (window.photos.length === 0) {
            if (statusElement) {
                showStatus(statusElement, 'Нет фотографий для предпросмотра', 'info');
            }
            console.log('🔎 Нет фотографий для отображения');
            console.groupEnd();
            return;
        }

        console.log(`📷 Отображаем ${window.photos.length} фото(ов) в предпросмотре`);

        window.photos.forEach((file, index) => {
            console.group(`🖼️ Создание элемента предпросмотра для фото ${index + 1}: ${file.name}`);

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

                // Создаём элемент контейнера для фото
                const photoContainer = document.createElement('div');
                photoContainer.className = 'photo-preview-item';
                photoContainer.dataset.index = index;
                photoContainer.draggable = true; // Включаем перетаскивание

                console.log('  - Создан контейнер для фото:', photoContainer);

                // Обработчики для перетаскивания
                setupDragAndDrop(photoContainer, index);

                // Создаём изображение
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Preview ${file.name}`;
                img.className = 'preview-image';
                console.log('  - Создано изображение:', img);

                // Добавляем подпись с именем файла и размером
                const caption = document.createElement('div');
                caption.className = 'preview-caption';
                caption.textContent = `${file.name} (${formatFileSize(file.size)})`;
                console.log('  - Создана подпись:', caption);

                // Добавляем поле для комментария
                const commentField = document.createElement('textarea');
                commentField.className = 'comment-field';
                commentField.placeholder = 'Введите комментарий к фотографии...';
                commentField.rows = 3;
                commentField.dataset.photoIndex = index;

                // Восстанавливаем существующий комментарий, если есть
                if (window.photoComments[index]) {
                    commentField.value = window.photoComments[index];
                }

                commentField.addEventListener('input', function() {
                    window.photoComments[index] = this.value;
            console.log(`📝 Комментарий для фото ${index}: "${this.value}"`);
        });
                console.log('  - Создано поле для комментария:', commentField);

                // Собираем всё вместе
                photoContainer.appendChild(img);
                photoContainer.appendChild(caption);
                photoContainer.appendChild(commentField);
                previewContainer.appendChild(photoContainer);
                console.log(`✓ Предпросмотр для ${file.name} добавлен в DOM`);

                // Дополнительная проверка отображения изображения
                img.onload = () => {
                    console.log(`🖼️ Изображение ${file.name} успешно загрузилось и отображается`);
        };
        img.onerror = (error) => {
            console.error(`❌ Ошибка загрузки изображения ${file.name} в DOM:`, error);
            // Заменяем изображение заглушкой при ошибке
            photoContainer.innerHTML = `
                <div class="error-icon">❌</div>
                <div class="preview-caption">Ошибка отображения: ${file.name}</div>
            `;
            photoContainer.classList.add('error');
            if (statusElement) {
                showStatus(statusElement, `Ошибка отображения изображения: ${file.name}`, 'error');
            }
        };
                console.groupEnd();
            };

            reader.onerror = function(error) {
                console.error(`❌ Ошибка при чтении файла: ${file.name}, ошибка:`, error);
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
        if (generateButton && window.photos.length > 0) {
            generateButton.disabled = false;
            generateButton.classList.remove('disabled');
            console.log('✓ Кнопка "Создать PDF" активирована');
        }

        // Обновляем статус, если элемент существует
        if (statusElement && window.photos.length > 0) {
            showStatus(statusElement, `Загружено ${window.photos.length} фото(ов). Готов к созданию PDF.`, 'success');
            console.log('✓ Статус обновлён: готов к созданию PDF');
        }
        console.groupEnd();
    }

    // Настройка перетаскивания и перемещения элементов
    function setupDragAndDrop(element, index) {
        console.group(`🤹 setupDragAndDrop: Настройка перетаскивания для элемента ${index}`);

        element.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', index);
            element.classList.add('dragging');
            console.log(`🎯 Drag start: элемент ${index} начал перетаскиваться`);
        });

        element.addEventListener('dragend', function() {
            element.classList.remove('dragging');
            console.log(`🛑 Drag end: элемент ${index} завершён перетаскивание`);
        });

        // Обработчик для области над которой перетаскивают
        element.addEventListener('dragover', function(e) {
            e.preventDefault();
            element.classList.add('drag-over');
            console.log(`↕ Drag over: элемент ${index} над областью`);
        });

        element.addEventListener('dragleave', function() {
            element.classList.remove('drag-over');
            console.log(`← Drag leave: элемент ${index} покинул область`);
        });

        element.addEventListener('drop', function(e) {
            e.preventDefault();
            element.classList.remove('drag-over');

            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            if (draggedIndex !== index) {
                                // Меняем местами элементы в массиве
                [window.photos[draggedIndex], window.photos[index]] = [window.photos[index], window.photos[draggedIndex]];
                // Меняем местами комментарии
                [window.photoComments[draggedIndex], window.photoComments[index]] = [window.photoComments[index], window.photoComments[draggedIndex]];


                console.log(`🔁 Drop: элементы ${draggedIndex} и ${index} поменялись местами`);
                console.log('✓ Массивы photos и photoComments обновлены');

                // Обновляем предпросмотр
                updatePreview();
            }
        });
        console.groupEnd();
    }

    // Функция для добавления фотографий (может вызываться извне)
    window.addPhotos = function(files) {
        console.group('📤 addPhotos: Добавление фотографий извне');

        if (!files || files.length === 0) {
            console.warn('⚠️ Нет файлов для добавления');
            console.groupEnd();
            return;
        }

        const newFiles = Array.from(files);
        window.photos = [...window.photos, ...newFiles];
        console.log('✓ Файлы добавлены к существующим:', window.photos.length, 'всего фото');

        updatePreview();
        console.groupEnd();
    };

    console.log('🎉 Модуль предпросмотра успешно инициализирован');
    console.groupEnd();

    return true;
}

// Вспомогательная функция для форматирования размера файла
function formatFileSize(bytes) {
    console.group('📏 formatFileSize: Форматирование размера файла');
    console.log('  - Входные байты:', bytes);

    if (bytes === 0) {
        console.log('  - Результат: 0 Bytes');
        console.groupEnd();
        return '0 Bytes';
    }

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Дополнительная проверка на корректность индекса
    if (i >= sizes.length) {
        console.warn('⚠️ Размер файла превышает поддерживаемый диапазон (GB)');
        const maxIndex = sizes.length - 1;
        const formattedSize = parseFloat((bytes / Math.pow(k, maxIndex)).toFixed(2)) + ' ' + sizes[maxIndex];
        console.log('  - Отформатированный размер (ограниченный):', formattedSize);
        console.groupEnd();
        return formattedSize;
    }

    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

    console.log('  - Рассчитанный индекс размера:', i);
    console.log('  - Единица измерения:', sizes[i]);
    console.log('  - Отформатированный размер:', formattedSize);
    console.groupEnd();
    return formattedSize;
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
