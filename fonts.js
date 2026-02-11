export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    // Ждём готовности jsPDF
    await waitForJsPDF();

    try {
        // Загрузка шрифта DejaVuSans
        const fontUrl = 'DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        const buffer = await response.arrayBuffer();

        // Регистрация шрифта в jsPDF
        window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
        window.DejaVuSansLoaded = true;
        console.log('Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.warn('Шрифт DejaVuSans не загружен, используется стандартный:', error);
    }
}

// Функция ожидания загрузки jsPDF
function waitForJsPDF() {
    return new Promise((resolve) => {
        if (window.jspdf) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 50; // 5 секунд при проверке каждые 100 мс

        const checkInterval = setInterval(() => {
            if (window.jspdf) {
                clearInterval(checkInterval);
                resolve();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('jsPDF не загрузился в течение 5 секунд');
                resolve(); // Продолжаем без шрифта, если jsPDF так и не загрузился
            }
        }, 100);
    });
}
