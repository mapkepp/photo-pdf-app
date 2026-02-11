const photoContainer = document.getElementById('photo-container');
const titleInput = document.getElementById('title');
const uploadInput = document.getElementById('photo-upload');
const generatePdfBtn = document.getElementById('generate-pdf');
const downloadLink = document.getElementById('download-link');

let photos = [];

uploadInput.addEventListener('change', function(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photo = {
                id: Date.now() + Math.random(),
                src: e.target.result,
                comment: '',
                order: photos.length
            };
            photos.push(photo);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
});

function renderPhotos() {
    photoContainer.innerHTML = '';
    photos.sort((a, b) => a.order - b.order).forEach((photo, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'photo-item';
        photoDiv.innerHTML = `
            <img src="${photo.src}" alt="Фото">
            <textarea placeholder="Комментарий к фото" data-id="${photo.id}">${photo.comment}</textarea>
            <div class="controls">
                <button onclick="movePhoto(${photo.id}, -1)">←</button>
                <span>Позиция: ${index + 1}</span>
                <button onclick="movePhoto(${photo.id}, 1)">→</button>
                <button onclick="removePhoto(${photo.id})">Удалить</button>
            </div>
        `;
        photoContainer.appendChild(photoDiv);
    });
    updatePhotoOrders();
}

window.movePhoto = function(id, direction) {
    const index = photos.findIndex(p => p.id === id);
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < photos.length) {
        [photos[index], photos[newIndex]] = [photos[newIndex], photos[index]];
        renderPhotos();
    }
};

window.removePhoto = function(id) {
    photos = photos.filter(p => p.id !== id);
    renderPhotos();
};

function updatePhotoOrders() {
    photos.forEach((photo, index) => {
        photo.order = index;
    });
}

generatePdfBtn.addEventListener('click', function() {
    const { jsPDF } = window.jspdf;

    // Создаём PDF с указанием шрифта
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    // Загружаем шрифт DejaVuSans (должен быть доступен по URL)
    doc.addFont('https://cdnjs.cloudflare.com/ajax/libs/dejavu-sans-ttf/1.0.0/DejaVuSans.ttf', 'DejaVuSans', 'normal');
    doc.setFont('DejaVuSans');

    const title = titleInput.value || 'Мои фотографии';

    doc.setFontSize(20);
    doc.text(title, 105, 20, { align: 'center' });

    let yPosition = 40;

    photos.sort((a, b) => a.order - b.order).forEach(photo => {
        // Проверяем, нужно ли добавить новую страницу
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }

        // Добавляем изображение
        doc.addImage(photo.src, 'JPEG', 10, yPosition, 190, 120);
        yPosition += 130; // Позиция после фото

        // Добавляем комментарий ПОД фото
        if (photo.comment) {
            doc.setFontSize(12);
            const splitComment = doc.splitTextToSize(photo.comment, 180);
            splitComment.forEach(line => {
                if (yPosition > 280) { // Если текст выходит за пределы страницы
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 15, yPosition);
                yPosition += 8;
            });
            yPosition += 5; // Отступ после комментария
        }
    });

    // Создаём ссылку для скачивания
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    downloadLink.href = url;
    downloadLink.classList.remove('hidden');
});

