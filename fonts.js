export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    // Ждём готовности jsPDF и его API
    await waitForJsPDFAndAPI();

    try {
        // Загрузка шрифта DejaVuSans
        const fontUrl = './DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки шрифта: ${response.status} ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();

        // Регистрация шрифта в jsPDF
        window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error;
    }
}

// Функция ожидания загрузки jsPDF и его API
function waitForJsPDFAndAPI() {
    return new Promise((resolve, reject) => {
        if (window.jspdf && window.jspdf.API) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 100; // 10 секунд при проверке каждые 100 мс

        const checkInterval = setInterval(() => {
            if (window.jspdf && window.jspdf.API) {
                clearInterval(checkInterval);
                resolve();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error('jsPDF или его API не загрузились в течение 10 секунд'));
            }
        }, 100);
    });
}
