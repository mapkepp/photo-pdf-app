export async function loadFont() {
    try {
        // Загружаем локальный шрифт из корня каталога
        const fontResponse = await fetch('DejaVuSans.ttf');
        if (!fontResponse.ok) {
            throw new Error(`Ошибка загрузки шрифта: ${fontResponse.status} ${fontResponse.statusText}`);
        }

        const fontArrayBuffer = await fontResponse.arrayBuffer();
        const { jsPDF } = window.jspdf;

        // Конвертируем ArrayBuffer в Base64
        const base64String = arrayBufferToBase64(fontArrayBuffer);

        // Добавляем шрифт в виртуальную файловую систему jsPDF
        jsPDF.API.addFileToVFS('DejaVuSans.ttf', base64String);
        jsPDF.API.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');
    } catch (error) {
        console.error('Не удалось загрузить шрифт DejaVuSans:', error);
        throw error;
    }
}

// Вспомогательная функция: конвертирует ArrayBuffer в Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
