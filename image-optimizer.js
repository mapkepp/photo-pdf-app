/**
 * Библиотека оптимизации изображений
 * @class ImageOptimizer
 */
export class ImageOptimizer {
    constructor() {
        console.group('🛠️ ImageOptimizer: Инициализация оптимизатора изображений');
        this.maxWidth = 1200; // Максимальная ширина в пикселях
        this.quality = 0.8; // Качество JPEG (0–1)
        console.log('✓ Настройки оптимизатора:');
        console.log('  - Максимальная ширина:', this.maxWidth, 'px');
        console.log('  - Качество:', this.quality);
        console.groupEnd();
    }

    /**
     * Оптимизация изображения
     * @param {File} file — исходный файл изображения
     * @returns {Promise<string>} — Data URL оптимизированного изображения
     */
    async optimizeImage(file) {
        console.group('🖼️ optimizeImage: Оптимизация изображения', file.name);
        console.log('  - Исходный размер:', formatFileSize(file.size));
        console.log('  - Тип файла:', file.type);

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                console.log('  - Файл успешно прочитан, начинаем загрузку изображения');
                const img = new Image();

                img.onload = () => {
                    console.log('  - Изображение загружено, размеры:', img.width, 'x', img.height, 'px');

            // Определяем новые размеры
            let newWidth, newHeight;
            if (img.width > this.maxWidth) {
                newWidth = this.maxWidth;
                newHeight = (img.height * this.maxWidth) / img.width;
            } else {
                newWidth = img.width;
                newHeight = img.height;
            }

            console.log('  - Новые размеры:', newWidth, 'x', newHeight, 'px');

            // Создаём canvas для ресайза
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');

            // Устанавливаем высокое качество рендеринга
            ctx.imageSmoothingQuality = 'high';
            ctx.imageSmoothingEnabled = true;

            console.log('  - Canvas создан:', canvas.width, 'x', canvas.height);

            // Рисуем изображение на canvas с новыми размерами
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            console.log('  - Изображение нарисовано на canvas');

            // Конвертируем в Data URL с заданным качеством
            const mimeType = file.type || 'image/jpeg';
            const dataUrl = canvas.toDataURL(mimeType, this.quality);

            console.log('  - Data URL создан (длина:', dataUrl.length, 'символов)');

            // Получаем размер оптимизированного изображения
            const optimizedSize = dataUrl.length;
            console.log('  - Размер оптимизированного изображения:', formatFileSize(optimizedSize));
            console.log('  - Коэффициент сжатия:', (file.size / optimizedSize).toFixed(2), 'x');

            resolve(dataUrl);
        };

        img.onerror = (error) => {
            console.error('❌ Ошибка загрузки изображения для оптимизации:', file.name, error);
            reject(new Error('Ошибка загрузки изображения'));
        };

        img.src = e.target.result;
    };

    reader.onerror = (error) => {
        console.error('❌ Ошибка чтения файла:', file.name, error);
        reject(new Error('Ошибка чтения файла'));
    };

    // Читаем файл как Data URL
    console.log('🔄 Начинаем чтение файла для оптимизации:', file.name);
    reader.readAsDataURL(file);
});

console.groupEnd();
}

/**
 * Пакетная оптимизация изображений
 * @param {File[]} files — массив файлов изображений
 * @returns {Promise<string[]>} — массив Data URL оптимизированных изображений
 */
async optimizeImagesBatch(files) {
    console.group('📦 optimizeImagesBatch: Пакетная оптимизация', files.length, 'изображений');

    const results = [];
    for (let i = 0; i < files.length; i++) {
        try {
            console.log(`🔄 Оптимизация изображения ${i + 1}/${files.length}:`, files[i].name);
            const optimizedImage = await this.optimizeImage(files[i]);
            results.push(optimizedImage);
            console.log(`✅ Изображение ${i + 1} оптимизировано успешно`);
        } catch (error) {
            console.error(`❌ Ошибка оптимизации изображения ${i + 1}:`, files[i].name, error);
            // Пропускаем проблемные файлы, но продолжаем обработку остальных
            results.push(null);
        }
    }

    console.log('✓ Все изображения обработаны (успешно или с ошибками)');
    console.groupEnd();
    return results;
}
}

// Вспомогательная функция для форматирования размера файла
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
