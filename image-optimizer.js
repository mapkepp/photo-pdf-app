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
     * Пакетная оптимизация изображений
     * @param {File[]} files — массив файлов изображений
     * @returns {Promise<string[]>} — массив Data URL оптимизированных изображений
     */
    async optimizeImagesBatch(files) {
        console.group('🔄 optimizeImagesBatch: Пакетная оптимизация изображений');
        console.log('  - Количество файлов для оптимизации:', files.length);

        const optimizedImages = [];

        for (let i = 0; i < files.length; i++) {
            console.group(`🖼️ Оптимизация изображения ${i + 1}: ${files[i].name}`);
            try {
                const optimizedImage = await this.optimizeImage(files[i]);
                optimizedImages.push(optimizedImage);
                console.log('✓ Изображение оптимизировано успешно');
            } catch (error) {
                console.error(`❌ Ошибка при оптимизации ${files[i].name}:`, error);
                // В случае ошибки добавляем оригинальное изображение
                const reader = new FileReader();
                await new Promise((resolve, reject) => {
                    reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(files[i]);
        });
        optimizedImages.push(reader.result);
        console.log('⚠️ Использовано оригинальное изображение из‑за ошибки оптимизации');
    }
            console.groupEnd();
        }

        console.log('✅ Все изображения оптимизированы:', optimizedImages.length);
        console.groupEnd();
        return optimizedImages;
    }

    /**
     * Оптимизация одного изображения
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
                    console.log('  - Изображение загружено, размеры:', img.width, 'x', img.height);

                        // Определяем новые размеры
            let newWidth = img.width;
            let newHeight = img.height;

            if (img.width > this.maxWidth) {
                newWidth = this.maxWidth;
                newHeight = (img.height * this.maxWidth) / img.width;
                console.log('  - Размеры изменены:', newWidth, 'x', newHeight);
            }

            // Создаём canvas для ресайза
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');

            console.log('  - Canvas создан:', newWidth, 'x', newHeight);

            // Устанавливаем высокое качество рендеринга
            ctx.imageSmoothingQuality = 'high';
            ctx.imageSmoothingEnabled = true;

            // Рисуем изображение на canvas с новыми размерами
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            console.log('  - Изображение нарисовано на canvas');

            // Конвертируем в Data URL с оптимизацией качества
            const mimeType = file.type || 'image/jpeg';
            const dataUrl = canvas.toDataURL(mimeType, this.quality);
            console.log('  - Data URL создан, MIME-тип:', mimeType, 'качество:', this.quality);

            // Проверяем размер оптимизированного изображения
            const blob = dataURLToBlob(dataUrl);
            console.log('  - Оптимизированный размер:', formatFileSize(blob.size));
            console.log('  - Исходный размер:', formatFileSize(file.size));

            const compressionRatio = ((file.size - blob.size) / file.size) * 100;
            console.log(`  - Степень сжатия: ${compressionRatio.toFixed(1)}%`);

            resolve(dataUrl);
        };

        img.onerror = (error) => {
            console.error('❌ Ошибка загрузки изображения для оптимизации:', error);
            reject(error);
        };

        img.src = e.target.result;
    };

    reader.onerror = (error) => {
        console.error('❌ Ошибка чтения файла:', error);
        reject(error);
    };

    console.log('🔄 Начинаем чтение файла:', file.name);
    reader.readAsDataURL(file);
});
}

/**
 * Конвертирует Data URL в Blob
 * @param {string} dataUrl — Data URL изображения
 * @returns {Blob} — Blob объекта изображения
 */
function dataURLToBlob(dataUrl) {
    console.group('💾 dataURLToBlob: Конвертация Data URL в Blob');
    console.log('  - Длина Data URL:', dataUrl.length);

    // Извлекаем тип MIME и данные
    const parts = dataUrl.split(',');
    const contentType = parts[0].match(/:(.*?);/)[1];
    const byteString = atob(parts[1]);

    // Создаём массив байтов
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: contentType });
    console.log('✓ Blob создан, тип:', contentType, 'размер:', formatFileSize(blob.size));
    console.groupEnd();
    return blob;
}

/**
 * Получает информацию об изображении
 * @param {File} file — файл изображения
 * @returns {Promise<{width: number, height: number, size: number}>} — информация об изображении
 */
async getImageInfo(file) {
    console.group('📊 getImageInfo: Получение информации об изображении', file.name);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                const info = {
                    width: img.width,
            height: img.height,
            size: file.size,
            type: file.type
        };
        console.log('✓ Информация получена:', info);
        console.groupEnd();
        resolve(info);
    };

    img.onerror = reject;
    img.src = e.target.result;
};

reader.onerror = reject;
reader.readAsDataURL(file);
});
}
}
