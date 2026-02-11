export async function loadFont() {
    if (window.DejaVuSansLoaded) return;

    await waitForJsPDF();


    try {
        const fontUrl = './DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки шрифта: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        // Конвертируем в Base64 без дополнительных заголовков
        const base64Font = arrayBufferToBase64(buffer);

        const doc = new window.jspdf.jsPDF();

        // Добавляем шрифт в vFS с корректным именем
        doc.addFileToVFS('DejaVuSans.ttf', base64Font);

        // Регистрируем шрифт — указываем имя и стиль
        doc.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');

        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error;
    }
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function waitForJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 100;

        const checkInterval = setInterval(() => {
            if (window.jspdf) {
                clearInterval(checkInterval);
                resolve();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error('jsPDF не загрузился в течение 10 секунд'));
            }
        }, 100);
    });
}
