export async function loadFont() {
    // Если шрифт уже загружен, ничего не делаем
    if (window.DejaVuSansLoaded) return;

    try {
        // Загрузка шрифта DejaVuSans
        const fontUrl = 'DejaVuSans.ttf';
        const response = await fetch(fontUrl);
        const buffer = await response.arrayBuffer();

        // Регистрация шрифта в jsPDF
        if (window.jspdf && window.jspdf.API) {
            window.jspdf.API.addFont(buffer, 'DejaVuSans', 'normal');
            window.DejaVuSansLoaded = true;
        } else {
            console.error('jsPDF не загружен — невозможно добавить шрифт');
        }
    } catch (error) {
        console.warn('Шрифт DejaVuSans не загружен, используется стандартный:', error);
    }
}
