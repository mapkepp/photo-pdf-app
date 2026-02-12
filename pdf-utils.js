/**
 * Утилиты для работы с PDF
 * @file pdf-utils.js
 */

/**
 * Создаёт PDF-документ с фотографиями и комментариями
 * @param {string[]} imageDataUrls — массив Data URL изображений
 * @param {string} title — заголовок документа
 * @param {string} subtitle — подзаголовок документа
 * @param {string[]} comments — массив комментариев к фотографиям
 * @returns {Promise<Blob>} — Blob PDF-документа
 */
export async function createPhotoPDF(imageDataUrls, title, subtitle, comments = []) {
  console.group('🖨️ createPhotoPDF: Создание PDF-документа');
  console.log('  - Количество изображений:', imageDataUrls.length);
  console.log('  - Заголовок:', title);
  console.log('  - Подзаголовок:', subtitle);

  try {
    // Импортируем pdfmake (предполагается, что библиотека подключена)
    const pdfMake = window.pdfMake;

    if (!pdfMake) {
      throw new Error('Библиотека pdfMake не загружена');
    }

    // Подготавливаем содержимое документа
    const documentDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 50, 40, 40],
      content: [],
      styles: {
        title: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        subtitle: {
          fontSize: 14,
          italics: true,
          margin: [0, 0, 0, 20],
          alignment: 'center',
          color: '#666'
        },
        imageCaption: {
          fontSize: 10,
          margin: [0, 5, 0, 15],
          alignment: 'center',
          color: '#444'
        }
      }
    };

    // Добавляем заголовок
    if (title) {
      documentDefinition.content.push({
        text: title,
        style: 'title'
      });
    }

    // Добавляем подзаголовок
    if (subtitle) {
      documentDefinition.content.push({
        text: subtitle,
        style: 'subtitle'
      });
    }

    // Добавляем разделитель после заголовка
    documentDefinition.content.push({
      canvas: [{
        type: 'line',
        x1: 0, y1: 0,
        x2: 515, y2: 0, // Ширина A4 с учётом полей
        lineWidth: 1,
        lineColor: '#ddd'
      }],
      margin: [0, 15, 0, 30]
    });

    // Обрабатываем каждое изображение
    for (let i = 0; i < imageDataUrls.length; i++) {
      console.group(`🖼️ Обработка изображения ${i + 1}`);

      // Добавляем изображение
      documentDefinition.content.push({
        image: imageDataUrls[i],
        fit: [500, 600], // Максимальный размер изображения
        alignment: 'center'
      });

      // Добавляем комментарий, если есть
      if (comments && comments[i]) {
        documentDefinition.content.push({
          text: comments[i],
          style: 'imageCaption'
        });
      } else {
        // Пустой комментарий для отступа
        documentDefinition.content.push({
          text: '',
          margin: [0, 10, 0, 0]
        });
      }

      console.log('✓ Изображение добавлено в документ');
      console.groupEnd();
    }

    console.log('🔄 Генерируем PDF...');

    // Создаём PDF
    const pdfDoc = pdfMake.createPdf(documentDefinition);

    // Возвращаем Blob
    const blob = await new Promise((resolve, reject) => {
      pdfDoc.getBlob((blob) => resolve(blob), (error) => reject(error));
    });

    console.log('✅ PDF успешно создан, размер:', formatFileSize(blob.size));
    console.groupEnd();

    return blob;
  } catch (error) {
    console.error('❌ Ошибка при создании PDF:', error);
    throw error;
  }
}

/**
 * Скачивает PDF-файл
 * @param {Blob} pdfBlob — Blob PDF-документа
 * @param {string} filename — имя файла для скачивания
 */
export function downloadPDF(pdfBlob, filename = 'photo-report.pdf') {
  console.group('⬇️ downloadPDF: Скачивание PDF-файла');
  console.log('  - Имя файла:', filename);
  console.log('  - Размер файла:', formatFileSize(pdfBlob.size));

  try {
    // Создаём URL для Blob
    const url = URL.createObjectURL(pdfBlob);

    // Создаём временную ссылку для скачивания
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = filename;
    tempLink.style.display = 'none';

    // Добавляем в DOM, кликаем и удаляем
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);

    // Освобождаем память
    URL.revokeObjectURL(url);

    console.log('✅ Файл успешно скачан:', filename);
    console.groupEnd();
  } catch (error) {
    console.error('❌ Ошибка при скачивании PDF:', error);
    throw error;
  }
}

/**
 * Открывает PDF в новой вкладке
 * @param {Blob} pdfBlob — Blob PDF-документа
 */
export function openPDFInNewTab(pdfBlob) {
  console.group('🔎 openPDFInNewTab: Открытие PDF в новой вкладке');

  try {
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
    console.log('✅ PDF открыт в новой вкладке');
    console.groupEnd();

    // Автоматически освобождаем память через 30 секунд
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  } catch (error) {
    console.error('❌ Ошибка при открытии PDF:', error);
    throw error;
  }
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
 * Валидирует данные для создания PDF
 * @param {string[]} images — массив Data URL изображений
 * @param {string} title — заголовок документа
 * @returns {boolean} — результат валидации
 */
export function validatePDFData(images, title) {
  console.group('🔍 validatePDFData: Валидация данных для PDF');

  let isValid = true;

  // Проверяем наличие изображений
  if (!images || images.length === 0) {
    console.warn('⚠️ Нет изображений для создания PDF');
    isValid = false;
  }

  // Проверяем заголовок
  if (!title || title.trim().length === 0) {
    console.warn('⚠️ Заголовок документа не указан');
    // Не делаем обязательным, но предупреждаем
  }

  console.log('✅ Валидация завершена, результат:', isValid);
  console.groupEnd();

  return isValid;
}

/**
 * Очищает временные URL объектов
 * @param {string[]} urls — массив URL для освобождения
 */
export function cleanupObjectURLs(urls) {
  console.group('🗑️ cleanupObjectURLs: Очистка временных URL');

  urls.forEach(url => {
    try {
      URL.revokeObjectURL(url);
      console.log('✓ Освобождён URL:', url);
    } catch (error) {
      console.error('❌ Ошибка при освобождении URL', url, ':', error);
    }
  });

  console.log(`✅ Очищено ${urls.length} временных URL`);
  console.groupEnd();
}

/**
 * Создаёт миниатюру изображения для предпросмотра в PDF
 * @param {string} imageDataUrl — Data URL исходного изображения
 * @param {number} maxWidth — максимальная ширина миниатюры
 * @param {number} maxHeight — максимальная высота миниатюры
 * @returns {Promise<string>} — Data URL миниатюры
 */
export async function createThumbnail(imageDataUrl, maxWidth = 150, maxHeight = 150) {
  console.group('🖼️ createThumbnail: Создание миниатюры изображения');
  console.log('  - Максимальный размер:', maxWidth, 'x', maxHeight);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // Определяем новые размеры с сохранением пропорций
      let newWidth = img.width;
      let newHeight = img.height;

      if (img.width > maxWidth || img.height > maxHeight) {
        const widthRatio = maxWidth / img.width;
        const heightRatio = maxHeight / img.height;
        const ratio = Math.min(widthRatio, heightRatio);

        newWidth = img.width * ratio;
        newHeight = img.height * ratio;
      }

      console.log('  - Размеры миниатюры:', newWidth, 'x', newHeight);

      // Создаём canvas для ресайза
      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');

      // Устанавливаем высокое качество рендеринга
      ctx.imageSmoothingQuality = 'high';
      ctx.imageSmoothingEnabled = true;

      // Рисуем изображение на canvas с новыми размерами
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Конвертируем в Data URL
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      console.log('✅ Миниатюра создана успешно');
      console.groupEnd();
      resolve(thumbnailDataUrl);
    };

    img.onerror = (error) => {
      console.error('❌ Ошибка загрузки изображения для миниатюры:', error);
      reject(error);
    };

    img.src = imageDataUrl;
  });
}

/**
 * Получает метаданные PDF-документа
 * @param {Blob} pdfBlob — Blob PDF-документа
 * @returns {Promise<{size: number, pageCount: number, created: string}>} — метаданные документа
 */
export async function getPDFMetadata(pdfBlob) {
  console.group('📊 getPDFMetadata: Получение метаданных PDF');

  // В реальном приложении здесь мог бы быть код для анализа PDF
  // Например, с использованием pdf.js или других библиотек
  const metadata = {
    size: pdfBlob.size,
    pageCount: 'N/A', // В реальном приложении нужно извлечь из PDF
    created: new Date().toISOString(),
    formatSize: formatFileSize(pdfBlob.size)
  };

  console.log('✅ Метаданные получены:', metadata);
  console.groupEnd();

  return metadata;
}

/**
 * Проверяет, поддерживает ли браузер генерацию PDF
 * @returns {boolean} — поддержка PDF-генерации
 */
export function isPDFSupported() {
  console.group('🔎 isPDFSupported: Проверка поддержки PDF');

  const supported = !!window.pdfMake && !!window.URL && !!window.Blob;

  if (supported) {
    console.log('✅ Браузер поддерживает генерацию PDF');
  } else {
    console.warn('⚠️ Браузер не поддерживает необходимые функции для генерации PDF');
  }

  console.groupEnd();
  return supported;
}

/**
 * Форматирует дату для использования в PDF
 * @param {Date|string} date — дата для форматирования
 * @returns {string} — отформатированная дата
 */
export function formatPDFDate(date = new Date()) {
  const d = new Date(date);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('ru-RU', options);
}

/**
 * Генерирует имя файла для PDF на основе заголовка и даты
 * @param {string} title — заголовок документа
 * @returns {string} — имя файла
 */
export function generatePDFFilename(title) {
  const cleanTitle = title
    .replace(/[^a-zA-Za-яА-Я0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

  return `${cleanTitle || 'photo-report'}_${formattedDate}.pdf`;
}
