export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    // Ждём готовности jsPDF
    await waitForJsPDF();

    try {
        // Загрузка шрифта DejaVuSans
        const fontUrl = './DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки шрифта: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();

        // Конвертация ArrayBuffer в Base64
        const base64Font = arrayBufferToBase64(buffer);

        const doc = new window.jspdf.jsPDF();

        // Добавляем шрифт в виртуальную файловую систему (vFS)
        doc.addFileToVFS('DejaVuSans.ttf', base64Font);

        // Регистрируем шрифт через addFont (используем прямой вызов API, если доступен)
        if (window.jspdf && window.jspdf.API && typeof window.jspdf.API.addFont === 'function') {
            window.jspdf.API.addFont(base64Font, 'DejaVuSans', 'normal');
        } else {
            // Альтернативный способ — создаём временный документ и регистрируем шрифт
            const tempDoc = new window.jspdf.jsPDF();
            if (typeof tempDoc.addFont === 'function') {
                tempDoc.addFont(base64Font, 'DejaVuSans', 'normal');
            } else {
                throw new Error('Ни один из методов добавления шрифта (addFont/API.addFont) не доступен');
            }
        }

        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error;
    }
}

// Функция конвертации ArrayBuffer в Base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Функция ожидания загрузки jsPDF с проверкой структуры
function waitForJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 100; // 10 секунд при проверке каждые 100 мс

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
