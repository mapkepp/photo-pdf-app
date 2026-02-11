export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    // Проверяем, что jsPDF загружен
    if (!window.jspdf || !window.jspdf.API) {
        console.warn('jsPDF ещё не загружен, пропускаем загрузку шрифта');
        return;
    }

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
        console.warn('⚠ Шрифт DejaVuSans не загружен, используется стандартный:', error.message);
    }
}
