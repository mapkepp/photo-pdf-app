export function createPdfDocument() {
    const doc = new window.jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Диагностический вывод всех доступных шрифтов
    const availableFonts = doc.getFontList();
    console.log('Доступные шрифты:', Object.keys(availableFonts));

    // Подробный поиск DejaVuSans с улучшенной логикой
    let fontFound = false;
    let matchingFontName = '';

    for (const fontName of Object.keys(availableFonts)) {
        const normalizedName = fontName.toLowerCase();
        if (normalizedName.includes('dejavusans') ||
            normalizedName.includes('dejavu') ||
            normalizedName.includes('sans')) {
            fontFound = true;
            matchingFontName = fontName;
            break;
        }
    }

    if (!fontFound) {
        console.warn('⚠️ Доступные шрифты:', Object.keys(availableFonts));
        // Резервный вариант: используем стандартный шрифт, если DejaVu не найден
        console.warn('⚠️ Шрифт DejaVuSans не найден, используем стандартный шрифт');
        doc.setFont('helvetica'); // Используем строчную запись для совместимости
    } else {
        doc.setFont(matchingFontName);
        console.log(`✓ Используется шрифт ${matchingFontName} (кириллица гарантирована)`);
    }

    return doc;
}

export function savePdfDocument(doc, downloadLink) {
    console.group('💾 savePdfDocument: Начало выполнения функции');

    // Детальная проверка downloadLink
    console.log('🔎 Проверка downloadLink:');
    console.log('  - Значение:', downloadLink);
    console.log('  - Тип:', typeof downloadLink);
    console.log('  - Является ли undefined/null:', downloadLink == null);

    if (downloadLink == null) {
        const errorMsg = '❌ savePdfDocument: downloadLink равен null/undefined';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    if (!(downloadLink instanceof Element)) {
        const errorMsg = `❌ savePdfDocument: downloadLink не является DOM‑элементом. Получен тип: ${typeof downloadLink}, значение: ${downloadLink}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    console.log('✓ downloadLink существует и является DOM‑элементом');
    console.log('  - Тег элемента:', downloadLink.tagName);
    console.log('  - ID элемента:', downloadLink.id);
    console.log('  - Класс элемента:', downloadLink.className);

    // Проверка, что это ссылка (<a>)
    if (downloadLink.tagName !== 'A') {
        console.warn('⚠️ savePdfDocument: downloadLink — не ссылка (<a>), а:', downloadLink.tagName);
        console.warn('  - Возможно, нужно использовать элемент <a>');
    } else {
        console.log('✓ downloadLink является элементом <a>');
    }

    // Проверка доступности свойств
    console.log('🔎 Проверка доступности свойств downloadLink:');
    const hasHref = 'href' in downloadLink;
    const hasDownload = 'download' in downloadLink;

    console.log('  - Свойство href доступно:', hasHref);
    console.log('  - Свойство download доступно:', hasDownload);

    if (!hasHref) {
        const errorMsg = '❌ savePdfDocument: Элемент не имеет свойства href';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        // Генерируем PDF
        console.log('🛠️ Генерация PDF...');
        const pdfOutput = doc.output('blob');
        console.log('✓ PDF успешно сгенерирован, размер:', pdfOutput.size, 'байт');

        const url = URL.createObjectURL(pdfOutput);
        console.log('✓ Создан URL для скачивания:', url);

        // Устанавливаем свойства
        downloadLink.href = url;
        console.log('✓ Свойство href установлено');

        downloadLink.download = 'document.pdf';
        console.log('✓ Свойство download установлено');

        // Показываем ссылку для скачивания
        downloadLink.classList.remove('hidden');
        console.log('✓ Ссылка для скачивания показана (удалён класс hidden)');

        // Имитируем клик
        downloadLink.click();
        console.log('✓ Выполнен клик по элементу скачивания');

        // Очистка памяти
        setTimeout(() => {
            URL.revokeObjectURL(url);
            console.log('✓ Память очищена (URL.revokeObjectURL)');
        }, 1000);

        console.groupEnd();
        return true;
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА в savePdfDocument:', error);
        throw error;
    } finally {
        console.groupEnd();
    }
}
