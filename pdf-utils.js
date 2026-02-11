export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Безопасная установка шрифта — проверяем доступность
    try {
        const availableFonts = doc.getFontList();
        if (availableFonts['dejavusans'] || availableFonts['DejaVuSans']) {
            doc.setFont('DejaVuSans');
            console.log('✓ Используется шрифт DejaVuSans');
        } else {
            console.warn('⚠ Шрифт DejaVuSans недоступен, используется стандартный');
        }
    } catch (e) {
        console.warn('Ошибка при установке шрифта:', e.message);
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
