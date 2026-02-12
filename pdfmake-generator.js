export async function generatePdf(photos, downloadLink) {
    if (!window.pdfMake) {
        throw new Error('Библиотека pdfmake не загружена');
    }

    const title = document.getElementById('title').value || 'Мои фотографии';

    // Преобразуем файлы в base64 для pdfmake
    const imageElements = await Promise.all(
        photos.map(async (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        })
    );

    // Создаём структуру PDF
    const docDefinition = {
        content: [
            { text: title, style: 'header' },
            { text: `Создано: ${new Date().toLocaleDateString()}`, style: 'subheader' }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 12,
                italics: true,
                margin: [0, 0, 0, 20]
            }
        }
    };

    // Добавляем изображения в документ
    imageElements.forEach((imageData, index) => {
        docDefinition.content.push({
            image: imageData,
            width: 400,
            margin: [0, 10, 0, 10],
            alignment: 'center'
        });

        // Добавляем подпись под каждым фото
        docDefinition.content.push({
            text: `Фото ${index + 1}: ${photos[index].name}`,
            fontSize: 10,
            italics: true,
            alignment: 'center',
            margin: [0, 0, 0, 20]
        });
    });

    // Генерируем PDF
    try {
        const pdfDoc = window.pdfMake.createPdf(docDefinition);

        // Для скачивания через ссылку
        pdfDoc.getBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadLink.href = url;
            downloadLink.classList.remove('hidden');
        });
    } catch (error) {
        throw new Error(`Ошибка генерации PDF: ${error.message}`);
    }
}
