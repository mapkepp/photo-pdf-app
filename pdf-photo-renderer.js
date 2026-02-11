import { checkAndAddNewPage } from './pdf-page-manager.js';

export function renderSinglePhoto(doc, photo, currentY) {
    // Проверка на новую страницу
    let yPosition = checkAndAddNewPage(doc, currentY);

    // Отрисовка фото
    doc.addImage(photo.src, 'JPEG', 10, yPosition, 190, 120);
    yPosition += 130;

    // Отрисовка комментария, если есть
    if (photo.comment) {
        doc.setFontSize(12);
        const splitComment = doc.splitTextToSize(photo.comment, 180);

        splitComment.forEach(line => {
