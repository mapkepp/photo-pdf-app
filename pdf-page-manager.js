export function addNewPageIfNeeded(doc, currentY) {
    if (currentY > 280) {
        doc.addPage();
        return doc;
    }
    return doc;
}

export function initializePage() {
    return 20; // Начальная позиция Y на новой странице
}
