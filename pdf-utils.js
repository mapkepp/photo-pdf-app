export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Диагностический вывод всех доступных шрифтов
    const availableFonts = doc.getFontList();
    console.log('Доступные шрифты:', Object.keys(availableFonts));

    // Подробный поиск DejaVuSans
    let fontFound = false;
    let matchingFontName = '';

    for (const fontName of Object.keys(availableFonts)) {
        if (fontName.toLowerCase().includes('dejavusans')) {
            fontFound = true;
            matchingFontName = fontName;
            break;
        }
    }

    if (!fontFound) {
        console.warn('⚠️ Доступные шрифты:', Object.keys(availableFonts));
        throw new Error('Шрифт DejaVuSans не зарегистрирован. Невозможно создать PDF с кириллицей');
    }

    doc.setFont(matchingFontName);
    console.log(`✓ Используется шрифт ${matchingFontName} (кириллица гарантирована)`);

    return doc;
}

export function savePdfDocument(doc, downloadLink) {
    const pdfOutput = doc.output('blob');
    const url = URL.createObjectURL(pdfOutput);

    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
}
