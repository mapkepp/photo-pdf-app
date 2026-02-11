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

        // Альтернативный способ регистрации шрифта — ищем корректный метод
        if (window.jspdf && window.jspdf.jsPDF) {
            const doc = new window.jspdf.jsPDF();
            // Проверяем наличие метода addFont
            if (doc.addFont) {
                doc.addFont(buffer, 'DejaVuSans', 'normal');
                window.DejaVuSansLoaded = true;
                console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован');
            } else {
                // Если addFont отсутствует, используем стандартный шрифт
                console.warn('⚠ Метод addFont не найден, используется стандартный шрифт');
                throw new Error('Метод addFont не доступен в текущей версии jsPDF');
            }
        } else {
            throw new Error('jsPDF не инициализирован корректно');
        }
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
