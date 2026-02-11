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

        // Принудительная регистрация шрифта — используем правильный метод для текущей версии jsPDF
        if (window.jspdf && window.jspdf.API && window.jspdf.API.addFont) {
            window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
            window.DejaVuSansLoaded = true;
            console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
        } else {
            // Альтернативный метод регистрации (для старых версий jsPDF)
            const doc = new window.jspdf.jsPDF();
            if (doc.addFont) {
                doc.addFont(buffer, 'DejaVuSans', 'normal');
                window.DejaVuSansLoaded = true;
                console.log('✓ Шрифт DejaVuSans загружен альтернативным методом');
            } else {
                throw new Error('Ни один из методов добавления шрифта (addFont/API.addFont) не доступен');
            }
        }
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error; // Не продолжаем без шрифта — кириллица обязательна
    }
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
