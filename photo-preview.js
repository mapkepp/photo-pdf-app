export function setupPhotoPreview() {
    console.group('🖼️ setupPhotoPreview: Инициализация модуля предпросмотра');


    const uploadInput = document.getElementById('photo-upload');
    const previewContainer = document.getElementById('photo-preview');
    const statusElement = document.getElementById('pdf-status');
    const clearButton = document.getElementById('clear-preview');

    // Инициализируем глобальные переменные
    window.photos = window.photos || [];
    window.photoComments = window.photoComments || [];

    console.log('🔎 Проверка элементов DOM:');
    console.log('  - Поле загрузки (#photo-upload):', uploadInput);
    console.log('  - Контейнер предпросмотра (#photo-preview):', previewContainer);
    console.log('  - Элемент статуса (#pdf-status):', statusElement);
    console.log('  - Кнопка очистки (#clear-preview):', clearButton);

    if (!uploadInput || !previewContainer || !statusElement || !clearButton) {
        console.error('❌ Критическая ошибка: не найдены обязательные элементы DOM');
        if (statusElement) {
            showStatus(statusElement, 'Ошибка инициализации: не найдены элементы интерфейса', 'error');
        }
        console.groupEnd();
        return false;
    }

    console.log('✓ Все элементы DOM найдены и готовы к работе');

    // Обработчик загрузки файлов
    uploadInput.addEventListener('change', function(e) {
        console.group('📤 Обработчик change: Загрузка фотографий');

        const files = Array.from(e.target.files);
        console.log('  - Загружено файлов:', files.length);

        if (files.length === 0) {
            console.warn('⚠️ Нет файлов для загрузки');
            console.groupEnd();
            return;
        }

        // Добавляем новые файлы к существующим
        window.photos.push(...files);
        // Инициализируем комментарии для новых фотографий
        for (let i = window.photoComments.length; i < window.photos.length; i++) {
            window.photoComments[i] = '';
        }

        console.log(`✓ Добавлено ${files.length} новых фотографий, всего фото: ${window.photos.length}`);

        updatePreview();
        console.groupEnd();
    });

    // Обработчик очистки предпросмотра
    clearButton.addEventListener('click', function() {
        console.group('🗑️ Обработчик click: Очистка предпросмотра');

        window.photos = [];
        window.photoComments = [];

        previewContainer.innerHTML = '';
        console.log('✓ Предпросмотр очищен, массивы фотографий и комментариев сброшены');

        // Обновляем статус
        if (statusElement) {
            showStatus(statusElement, 'Предпросмотр очищен. Загрузите фотографии для продолжения.', 'info');
        }

        // Деактивируем кнопку генерации PDF
        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = true;
            generateButton.classList.add('disabled');
            console.log('✓ Кнопка "Создать PDF" деактивирована');
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

                // Добавляем поле для комментария (многострочное)
                const commentField = document.createElement('textarea');
                commentField.className = 'comment-field';
                commentField.placeholder = 'Введите комментарий к фотографии...';
                commentField.rows = 4; // Увеличиваем для длинных текстов
                commentField.dataset.photoIndex = index;

                // Восстанавливаем существующий комментарий, если есть
                if (window.photoComments[index]) {
                    commentField.value = window.photoComments[index];
                }

                commentField.addEventListener('input', function() {
                    window.photoComments[index] = this.value;
            console.log(`📝 Комментарий для фото ${index}: "${this.value.substring(0, 50)}${this.value.length > 50 ? '...' : ''}"`);
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

        // Активируем кнопку генерации PDF, если есть фотографии
        const generateButton = document.getElementById('generate-pdf');
        if (generateButton) {
            generateButton.disabled = window.photos.length === 0;
            if (window.photos.length > 0) {
                generateButton.classList.remove('disabled');
                console.log('✓ Кнопка "Создать PDF" активирована');
            } else {
                generateButton.classList.add('disabled');
                console.log('⚠️ Кнопка "Создать PDF" деактивирована (нет фотографий)');
            }
        }

        // Обновляем статус
        if (statusElement) {
            if (window.photos.length > 0) {
                showStatus(
                    statusElement,
            `Загружено ${window.photos.length} фото(ов). Добавьте комментарии при необходимости.`,
            'success'
        );
            } else {
                showStatus(statusElement, 'Загрузите фотографии для начала работы', 'info');
            }
        }

        console.log(`✅ Предпросмотр успешно обновлён. Всего фото: ${window.photos.length}`);
        console.groupEnd();
    }

    // Функция настройки перетаскивания и перемещения
    function setupDragAndDrop(element, index) {
        console.group(`🔗 setupDragAndDrop: Настройка перетаскивания для элемента ${index}`);

        let draggedElement = null;
        let draggedIndex = -1;

        element.addEventListener('dragstart', function(e) {
            console.group('🖱️ dragstart: Начало перетаскивания');
            draggedElement = this;
            draggedIndex = parseInt(this.dataset.index, 10);
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            console.log(`✓ Элемент ${draggedIndex} начал перетаскиваться`);
            console.groupEnd();
        });

        element.addEventListener('dragend', function() {
            console.group('🖱️ dragend: Завершение перетаскивания');
            this.classList.remove('dragging');
            draggedElement = null;
            draggedIndex = -1;
            console.log('✓ Перетаскивание завершено');
            console.groupEnd();
        });

        // Обработчики для контейнеров, куда можно бросить элемент
        element.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });

        element.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });

        element.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');

            const targetIndex = parseInt(this.dataset.index, 10);

            if (draggedIndex !== targetIndex && draggedIndex >= 0) {
                console.group('🔁 drop: Перемещение элемента');
                console.log(`  - Перемещаем элемент ${draggedIndex} на позицию ${targetIndex}`);

                // Меняем местами элементы в массиве фотографий
                [window.photos[draggedIndex], window.photos[targetIndex]] =
                    [window.photos[targetIndex], window.photos[draggedIndex]];

                // Меняем местами комментарии вместе с фотографиями
                [window.photoComments[draggedIndex], window.photoComments[targetIndex]] =
            [window.photoComments[targetIndex], window.photoComments[draggedIndex]];

                console.log('✓ Массивы photos и photoComments обновлены');

                // Обновляем все data-атрибуты индексов
                updateIndices();

                // Перестраиваем предпросмотр
                updatePreview();
                console.log('✅ Элемент успешно перемещён');
                console.groupEnd();
            }
        });
        console.log('✓ Обработчики перетаскивания настроены для элемента');
        console.groupEnd();
    }

    // Функция обновления индексов после перемещения
    function updateIndices() {
        console.group('🔢 updateIndices: Обновление индексов элементов');
        const items = previewContainer.querySelectorAll('.photo-preview-item');
        items.forEach((item, index) => {
            item.dataset.index = index;
            // Обновляем data-атрибут в поле комментария
            const commentField = item.querySelector('.comment-field');
            if (commentField) {
                commentField.dataset.photoIndex = index;
            }
            console.log(`  - Элемент ${index} получил индекс ${index}`);
        });
        console.log('✓ Все индексы обновлены');
        console.groupEnd();
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

    console.log('🎉 Модуль предпросмотра успешно инициализирован');
    console.groupEnd();

    return true;
}

// Экспортируем вспомогательные функции, если они нужны в других модулях
export { formatFileSize };
