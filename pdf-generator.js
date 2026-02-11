import { loadFont } from './fonts.js';

export async function generatePdf(elements) {
    const { jsPDF } = window.jspdf;

    try {
        await loadFont();
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        doc.setFont('DejaVuSans');

        const title = elements.titleInput.value || 'Мои фотографии';
        doc.setFontSize(20);
        doc.text(title, 105, 20, { align: 'center' });

        let yPosition = 40;
        const photosPerPage = 5;

        for (let i = 0; i < window.photos.length; i++) {
            if (i % photosPerPage === 0 && i !== 0) {
                doc.addPage();
                yPosition = 20;
            }

            const photo = window.photos[i];
            doc.addImage(photo.src, 'JPEG', 10, yPosition, 190, 120);
            yPosition += 130;

            if (photo.comment) {
                doc.setFontSize(12);
                const splitComment = doc.splitTextToSize(photo.comment, 180);
                splitComment.forEach(line => {
                    if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 15, yPosition);
            yPosition += 8;
        });
        yPosition += 5;
    }

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        elements.downloadLink.href = url;
        elements.downloadLink.classList.remove('hidden');
    } catch (error) {
        console.error('Ошибка при генерации PDF:', error);
        alert('Произошла ошибка при создании PDF. Проверьте консоль для деталей.');
    }
}
