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

        // Проверяем доступность методов addFont в разных версиях jsPDF
        const jsPDF = window.jspdf;

        if (jsPDF && jsPDF.API && typeof jsPDF.API.addFont === 'function') {
            // Основной способ (для современных версий)
            jsPDF.API.addFont(buffer, 'DejaVuSans', 'normal');
        } else if (jsPDF && typeof jsPDF.jsPDF === 'function') {
            // Альтернативный способ — создаём временный документ для регистрации шрифта
            const tempDoc = new jsPDF.jsPDF();
            if (typeof tempDoc.addFont === 'function') {
                tempDoc.addFont(buffer, 'DejaVuSans', 'normal');
            } else {
                throw new Error('Метод addFont недоступен в текущей версии jsPDF');
            }
        } else {
            throw new Error('jsPDF не инициализирован корректно или API недоступно');
        }

        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
    } catch (error) {
        console.error('❌ Критическая ошибка: шрифт DejaVuSans не загружен:', error.message);
        throw error;
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
