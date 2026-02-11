export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Устанавливаем стандартный шрифт (чтобы избежать ошибок)
    try {
        doc.setFont('DejaVuSans');
    } catch (e) {
        // Если DejaVuSans недоступен, используем стандартный
        console.warn('Шрифт DejaVuSans недоступен, используется стандартный');
    }

    return doc;
}

export function savePdfDocument(doc, downloadLink) {
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);

    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
}
