export function renderPhotoWithComment(doc, photo, currentY) {
    // Отрисовка фото
    doc.addImage(photo.src, 'JPEG', 10, currentY, 190, 120);
    let newY = currentY + 130;

    // Отрисовка комментария, если есть
    if (photo.comment) {
        doc.setFontSize(12);
        const splitComment = doc.splitTextToSize(photo.comment, 180);

        splitComment.forEach(line => {
            doc.text(line, 15, newY);
            newY += 8;
        });
        newY += 5; // Отступ после комментария
    }

    return newY;
}
