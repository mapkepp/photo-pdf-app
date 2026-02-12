import { setupPhotoPreview } from './photo-preview.js';
import { ImageOptimizer } from './image-optimizer.js';

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

                // Генерируем PDF (реализацию добавим позже)
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
                    showStatus(document.getElementById('pdf-status'), 'Ошибка при создании PDF: ' + error.message, 'error');
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

// Заглушка для функции генерации PDF (будет реализована позже)
async function generatePDF(images, title, subtitle, comments) {
    console.group('🖨️ generatePDF: Генерация PDF файла');
    console.log('  - Количество изображений:', images.length);
    console.log('  - Заголовок:', title);
    console.log('  - Подзаголовок:', subtitle);
    console.log('  - Комментарии:', comments);

    try {
        console.log('🔄 Начинаем создание PDF документа...');

        // Создаём документ с заголовком и подзаголовком
        const docDefinition = {
            pageSize: 'A4',
            pageMargins: [40, 50, 40, 60],
            content: [],
            styles: {
                header: {
                    fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10]
        },
        subheader: {
            fontSize: 14,
            italics: true,
            margin: [0, 0, 0, 20],
            color: '#666'
        },
        imageCaption: {
            fontSize: 12,
            margin: [0, 5, 0, 15],
            color: '#333'
        },
        comment: {
            fontSize: 11,
            margin: [0, 0, 0, 20],
            color: '#555',
            lineHeight: 1.4
        }
    }
};

        // Добавляем заголовок
        if (title) {
            docDefinition.content.push({
                text: title,
                style: 'header',
                alignment: 'center'
            });
            console.log('✓ Заголовок добавлен в PDF');
        }

        // Добавляем подзаголовок
        if (subtitle) {
            docDefinition.content.push({
                text: subtitle,
                style: 'subheader',
                alignment: 'center'
            });
            console.log('✓ Подзаголовок добавлен в PDF');
        }

        // Добавляем разделитель после заголовка
        docDefinition.content.push({ text: '', margin: [0, 20, 0, 20] });

        // Обрабатываем изображения и комментарии
        for (let i = 0; i < images.length; i++) {
            console.group(`📷 Обработка изображения ${i + 1}/${images.length}`);

            const imageData = images[i];
            const comment = comments[i] || '';

            // Добавляем изображение
            docDefinition.content.push({
                image: imageData,
                width: 450,
                alignment: 'center'
            });
            console.log('✓ Изображение добавлено в PDF');

            // Если есть комментарий, добавляем его
            if (comment) {
                docDefinition.content.push({
                    text: comment,
                    style: 'comment'
                });
                console.log(`📝 Комментарий добавлен: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`);
            }

            // Добавляем отступ между элементами
            docDefinition.content.push({ text: '', margin: [0, 30, 0, 30] });
            console.groupEnd();
        }

        console.log('✅ Структура PDF документа успешно создана');

        // Генерируем PDF
        console.log('🔄 Начинаем генерацию PDF...');
        const pdfDoc = pdfMake.createPdf(docDefinition);

        // Сохраняем PDF как blob
        pdfDoc.getBlob(function(blob) {
            console.log('💾 PDF успешно сгенерирован как blob');
            console.log('  - Размер PDF:', formatFileSize(blob.size));

            // Создаём ссылку для скачивания
            const downloadLink = document.getElementById('download-link');
            if (downloadLink) {
                const url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = `${title || 'photos'}.pdf`;
                downloadLink.classList.remove('hidden');
                console.log('✓ Ссылка для скачивания создана');

                // Обновляем статус
                if (document.getElementById('pdf-status')) {
                    showStatus(
                document.getElementById('pdf-status'),
                `PDF готов! Размер: ${formatFileSize(blob.size)}. Нажмите "Скачать PDF".`,
                'success'
            );
        } else {
            console.warn('⚠️ Элемент #download-link не найден');
        }
    });

    console.log('🎉 PDF успешно сгенерирован и готов к скачиванию');
    console.groupEnd();
} catch (error) {
        console.error('❌ Ошибка при генерации PDF:', error);
        if (document.getElementById('pdf-status')) {
            showStatus(
            document.getElementById('pdf-status'),
            'Ошибка при создании PDF: ' + error.message,
            'error'
        );
    }
    console.groupEnd();
}
}
