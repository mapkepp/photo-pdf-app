export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // ОБЯЗАТЕЛЬНАЯ проверка доступности DejaVuSans перед использованием
    const availableFonts = doc.getFontList();
    const hasDejaVu = availableFonts['dejavusans'] ||
                       availableFonts['DejaVuSans'] ||
               availableFonts['dejavusans,normal'] ||
               availableFonts['DejaVuSans,normal'];

    if (!hasDejaVu) {
        throw new Error('Шрифт DejaVuSans не зарегистрирован. Невозможно создать PDF с кириллицей');
    }

    doc.setFont('DejaVuSans');
    console.log('✓ Используется шрифт DejaVuSans (кириллица гарантирована)');

    return doc;
}

export function savePdfDocument(doc, downloadLink) {
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);

    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
}
