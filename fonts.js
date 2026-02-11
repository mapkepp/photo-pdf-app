export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    // Ждём готовности jsPDF
    await waitForJsPDF();

    try {
        // Загрузка шрифта DejaVuSans
        const fontUrl = './DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        const buffer = await response.arrayBuffer();

        // Регистрация шрифта в jsPDF
        window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error; // Выбрасываем ошибку, чтобы остановить генерацию PDF
    }
}

// Функция ожидания загрузки jsPDF с таймаутом
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
