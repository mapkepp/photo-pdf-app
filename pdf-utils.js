export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Диагностический вывод всех доступных шрифтов
    const availableFonts = doc.getFontList();
    console.log('Доступные шрифты:', Object.keys(availableFonts));

    const hasDejaVu = Object.keys(availableFonts).some(fontName =>
        fontName.toLowerCase().includes('dejavusans')
    );

    if (!hasDejaVu) {
        console.warn('⚠️ Предупреждение: шрифт DejaVuSans не найден среди доступных шрифтов');
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
