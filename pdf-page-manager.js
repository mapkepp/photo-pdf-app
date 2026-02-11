export function checkAndAddNewPage(doc, currentY) {
    if (currentY > 280) {
        doc.addPage();
        return 20; // новая позиция Y на новой странице
    }
    return currentY;
}
