/**
 * Библиотека для генерации PDF документов с изображениями и метаданными
 * @file generate-pdf.js
 */

import { jsPDF } from 'jspdf';

/**
 * Генерирует PDF документ из массива изображений с заголовками и комментариями
 * @param {string[]} images — массив Data URL изображений
 * @param {string} title — заголовок документа
 * @param {string} subtitle — подзаголовок документа
 * @param {string[]} comments — массив комментариев к изображениям (по одному на изображение)
 * @returns {Promise<Blob>} — Blob объекта PDF документа
 */
async function generatePDF(images, title = 'Фотоотчёт', subtitle = '', comments = []) {
    console.group('🖨️ generatePDF: Генерация PDF документа');
    console.log('  - Количество изображений:', images.length);
    console.log('  - Заголовок:', title);
    console.log('  - Подзаголовок:', subtitle);
    console.log('  - Количество комментариев:', comments.length);

    return new Promise((resolve, reject) => {
        try {
            // Создаём экземпляр jsPDF в портретной ориентации, формат A4
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const maxImageWidth = pageWidth - 2 * margin;
            const maxImageHeight = pageHeight - 2 * margin - 40; // Учитываем место для заголовков

            // Добавляем титульную страницу
            addTitlePage(doc, title, subtitle, pageWidth, pageHeight, margin);

            // Обрабатываем изображения
            images.forEach((imageDataUrl, index) => {
                // Если это не первая страница, добавляем новую страницу
                if (index > 0) {
                    doc.addPage();
        }

                // Получаем комментарий для текущего изображения (если есть)
                const comment = comments[index] || '';

                // Добавляем изображение и комментарий на страницу
                addImageToPDF(doc, imageDataUrl, comment, pageWidth, pageHeight, margin, maxImageWidth, maxImageHeight);
            });

            // Сохраняем PDF и преобразуем в Blob
            const pdfBytes = doc.output('arraybuffer');
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            console.log('✅ PDF успешно сгенерирован, размер:', formatFileSize(blob.size));
            console.groupEnd();
            resolve(blob);
        } catch (error) {
            console.error('❌ Ошибка при генерации PDF:', error);
            console.groupEnd();
            reject(error);
        }
    });
}

/**
 * Добавляет титульную страницу с заголовком и подзаголовком
 * @param {jsPDF} doc — экземпляр jsPDF
 * @param {string} title — заголовок документа
 * @param {string} subtitle — подзаголовок документа
 * @param {number} pageWidth — ширина страницы в мм
 * @param {number} pageHeight — высота страницы в мм
 * @param {number} margin — отступ в мм
 */
function addTitlePage(doc, title, subtitle, pageWidth, pageHeight, margin) {
    // Устанавливаем жирный шрифт для заголовка
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);

    // Центрируем заголовок
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, 80);

    // Добавляем подзаголовок (если есть)
    if (subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        const subtitleWidth = doc.getTextWidth(subtitle);
        const subtitleX = (pageWidth - subtitleWidth) / 2;
        doc.text(subtitle, subtitleX, 100);
    }

    // Добавляем дату создания
    doc.setFontSize(12);
    const date = new Date().toLocaleDateString('ru-RU');
    doc.text(`Дата создания: ${date}`, margin, pageHeight - margin);
}

/**
 * Добавляет изображение и комментарий на страницу PDF
 * @param {jsPDF} doc — экземпляр jsPDF
 * @param {string} imageDataUrl — Data URL изображения
 * @param {string} comment — комментарий к изображению
 * @param {number} pageWidth — ширина страницы в мм
 * @param {number} pageHeight — высота страницы в мм
 * @param {number} margin — отступ в мм
 * @param {number} maxImageWidth — максимальная ширина изображения в мм
 * @param {number} maxImageHeight — максимальная высота изображения в мм
 */
function addImageToPDF(doc, imageDataUrl, comment, pageWidth, pageHeight, margin, maxImageWidth, maxImageHeight) {
    const img = new Image();

    img.onload = function() {
        // Рассчитываем размеры изображения с сохранением пропорций
        const ratio = Math.min(
            maxImageWidth / img.width,
            maxImageHeight / img.height
        );

        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;

        // Центрируем изображение по горизонтали
        const x = (pageWidth - imgWidth) / 2;
        const y = margin + 20; // Отступ сверху + место для заголовка

        // Добавляем изображение
        doc.addImage(imageDataUrl, 'JPEG', x, y, imgWidth, imgHeight);

        // Если есть комментарий, добавляем его под изображением
        if (comment) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(64, 64, 64);

            // Разбиваем длинный комментарий на несколько строк
            const lines = doc.splitTextToSize(comment, maxImageWidth);
            const commentY = y + imgHeight + 10;

            doc.text(lines, margin, commentY);
        }
    };

    img.onerror = function() {
        console.warn('⚠️ Не удалось загрузить изображение для PDF');
        // В случае ошибки добавляем сообщение об ошибке
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 0, 0);
        doc.text('Изображение недоступно', margin, margin + 30);
    };

    img.src = imageDataUrl;
}

/**
 * Форматирует размер файла в читаемый вид
 * @param {number} bytes — размер в байтах
 * @returns {string} — отформатированный размер
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    if (i >= sizes.length) {
        const maxIndex = sizes.length - 1;
        return parseFloat((bytes / Math.pow(k, maxIndex)).toFixed(2)) + ' ' + sizes[maxIndex];
    }

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Скачивает PDF документ
 * @param {Blob} pdfBlob — Blob объекта PDF
 * @param {string} filename — имя файла для скачивания (без расширения)
 */
function downloadPDF(pdfBlob, filename = 'photo-report') {
    console.group('📥 downloadPDF: Скачивание PDF документа');

    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ PDF успешно скачан:', link.download);
    console.groupEnd();
}

// Экспортируем основные функции
export { generatePDF, downloadPDF };

/**
 * Пример использования:
 *
 * import { generatePDF, downloadPDF } from './generate-pdf.js';
 * // После оптимизации изображений
 * const optimizedImages = await imageOptimizer.optimizeImagesBatch(files);
 * const pdfBlob = await generatePDF(
 *   optimizedImages,
 *   'Мой фотоотчёт',
 *   'Путешествие по Европе 2024',
 *   ['Фото 1: Эйфелева башня', 'Фото 2: Колизей', 'Фото 3: Акрополь']
 * );
 * downloadPDF(pdfBlob, 'europe-trip-2024');
 */

/**
 * Расширенная функция генерации PDF с дополнительными опциями
 * @param {Object} options — настройки генерации PDF
 * @param {string[]} options.images — массив Data URL изображений
 * @param {string} options.title — заголовок документа
 * @param {string} [options.subtitle=''] — подзаголовок документа
 * @param {string[]} [options.comments=[]] — массив комментариев к изображениям
 * @param {boolean} [options.addPageNumbers=true] — добавлять номера страниц
 * @param {string} [options.author=''] — автор документа
 * @param {string} [options.keywords=''] — ключевые слова документа
 * @returns {Promise<Blob>} — Blob объекта PDF документа
 */
async function generatePDFAdvanced(options) {
    console.group('🖨️ generatePDFAdvanced: Расширенная генерация PDF документа');
    console.log('  - Настройки генерации:', options);

    return new Promise((resolve, reject) => {
        try {
            const {
                images,
                title,
                subtitle = '',
                comments = [],
                addPageNumbers = true,
                author = '',
                keywords = ''
            } = options;

            // Создаём экземпляр jsPDF
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Устанавливаем метаданные PDF
            doc.setProperties({
                title: title,
                subject: subtitle,
                author: author,
                keywords: keywords,
                creationDate: new Date()
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            const maxImageWidth = pageWidth - 2 * margin;
            const maxImageHeight = pageHeight - 2 * margin - 40;

            // Добавляем титульную страницу
            addTitlePage(doc, title, subtitle, pageWidth, pageHeight, margin);

            // Обрабатываем изображения
            images.forEach((imageDataUrl, index) => {
                // Если это не первая страница, добавляем новую страницу
                if (index > 0) {
                    doc.addPage();
                }

                const comment = comments[index] || '';

                // Добавляем изображение и комментарий
                addImageToPDF(doc, imageDataUrl, comment, pageWidth, pageHeight, margin, maxImageWidth, maxImageHeight);

                // Добавляем номер страницы, если требуется
                if (addPageNumbers) {
                    const pageNumber = index + 2; // +2, потому что титульная страница — первая
                    addPageNumber(doc, pageNumber, pageWidth, pageHeight, margin);
                }
            });

            // Сохраняем PDF и преобразуем в Blob
            const pdfBytes = doc.output('arraybuffer');
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            console.log('✅ Расширенный PDF успешно сгенерирован, размер:', formatFileSize(blob.size));
            console.groupEnd();
            resolve(blob);
        } catch (error) {
            console.error('❌ Ошибка при расширенной генерации PDF:', error);
            console.groupEnd();
            reject(error);
        }
    });
}

/**
 * Добавляет номер страницы в нижний колонтитул
 * @param {jsPDF} doc — экземпляр jsPDF
 * @param {number} pageNumber — номер страницы
 * @param {number} pageWidth — ширина страницы в мм
 * @param {number} pageHeight — высота страницы в мм
 * @param {number} margin — отступ в мм
 */
function addPageNumber(doc, pageNumber, pageWidth, pageHeight, margin) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);

    const pageNumText = `Страница ${pageNumber}`;
    const textWidth = doc.getTextWidth(pageNumText);
    const x = (pageWidth - textWidth) / 2;
    const y = pageHeight - margin + 5;

    doc.text(pageNumText, x, y);
}

/**
 * Функция предварительной проверки данных перед генерацией PDF
 * @param {string[]} images — массив Data URL изображений
 * @param {string} title — заголовок документа
 * @returns {Object} — объект с результатами проверки
 */
function validatePDFData(images, title) {
    const errors = [];

    if (!images || images.length === 0) {
        errors.push('Отсутствуют изображения для генерации PDF');
    }

    if (!title || title.trim().length === 0) {
        errors.push('Заголовок документа не может быть пустым');
    }

    // Проверяем размер каждого изображения (рекомендуемый лимит — 5 MB)
    images.forEach((img, index) => {
        // Простая проверка — если Data URL слишком длинный, возможно, изображение большое
        if (img.length > 5000000) { // ~5 MB в кодировке base64
            errors.push(`Изображение ${index + 1} может быть слишком большим`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Экспортируем все функции библиотеки
export {
    generatePDF,
    generatePDFAdvanced,
    downloadPDF,
    validatePDFData
};

/**
 * Пример расширенного использования:
 *
 * import { generatePDFAdvanced, downloadPDF, validatePDFData } from './generate-pdf.js';
 *
 * const validation = validatePDFData(optimizedImages, 'Мой фотоотчёт');
 * if (validation.isValid) {
 *   const pdfBlob = await generatePDFAdvanced({
 *     images: optimizedImages,
 *     title: 'Мой фотоотчёт',
 *     subtitle: 'Путешествие по Европе 2024',
 *     comments: ['Фото 1: Эйфелева башня', 'Фото 2: Колизей'],
 *     addPageNumbers: true,
 *     author: 'Иван Иванов',
 *     keywords: 'фото, путешествие, Европа'
 *   });
 *   downloadPDF(pdfBlob, 'europe-trip-2024-advanced');
 * } else {
 *   console.error('Ошибки валидации:', validation.errors);
 * }
 */
