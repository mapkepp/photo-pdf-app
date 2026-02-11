import { dejaVuFontBase64 } from './fonts.js';

export async function generatePdf(elements) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    try {
        // Добавляем шрифт в формате Base64
        doc.addFont(dejaVuFontBase64, 'DejaVuSans', 'normal');
        doc.setFont('DejaVuSans');
    } catch (error) {
        console.error('Ошибка загрузки шрифта:', error);
        doc.setFont('helvetica');
    }

    const title = elements.titleInput.value || 'Мои фотографии';
    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });

    let yPosition = 40;

    window.photos
        .sort((a, b) => a.order - b.order)
        .forEach(photo => {
            // Проверяем, нужно ли добавить новую страницу
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }

            // Добавляем изображение
            doc.addImage(photo.src, 'JPEG', 10, yPosition, 190, 120);
            yPosition += 130; // Позиция после фото (высота фото + отступ)

            // Добавляем комментарий ПОД фото
            if (photo.comment && photo.comment.trim() !== '') {
                doc.setFontSize(12);
                const splitComment = doc.splitTextToSize(photo.comment, 180);

                splitComment.forEach(line => {
                    // Проверяем, не выходит ли текст за пределы страницы
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 15, yPosition);
            yPosition += 8;
        });
        yPosition += 5; // Дополнительный отступ после комментария
    }
});

// Создаём ссылку для скачивания
const pdfBlob = doc.output('blob');
const url = URL.createObjectURL(pdfBlob);
elements.downloadLink.href = url;
elements.downloadLink.classList.remove('hidden');

// Освобождаем память после скачивания
elements.downloadLink.onclick = function() {
    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 100);
};

console.log('PDF успешно создан! Количество фото:', window.photos.length);
console.log('Заголовок:', title);

// Предупреждение, если нет фото
if (window.photos.length === 0) {
    alert('Предупреждение: в PDF не добавлены фотографии. Добавьте хотя бы одно фото.');
}
}
