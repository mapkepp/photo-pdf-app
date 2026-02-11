export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    try {
        // Загрузка шрифта DejaVuSans (должен быть доступен по пути)
        const fontUrl = 'DejaVuSans.ttf'; // Укажите корректный путь
        const response = await fetch(fontUrl);
        const buffer = await response.arrayBuffer();

        // Регистрация шрифта в jsPDF
        window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
        window.DejaVuSansLoaded = true;
    } catch (error) {
        console.warn('Шрифт DejaVuSans не загружен, используется стандартный:', error);
    }
}
