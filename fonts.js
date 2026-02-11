export async function loadFont() {
    if (window.DejaVuSansLoaded) {
        console.log('🔁 Шрифт DejaVuSans уже загружен, пропускаем загрузку');
        return;
    }

    await waitForJsPDF();

    try {
        // Формируем путь для GitHub Pages
        const basePath = window.location.pathname.includes('/index.html')
            ? window.location.pathname.replace('/index.html', '')
            : window.location.pathname;
        const fontUrl = `${basePath}/DejaVuSans.ttf`.replace(/\/\/+/g, '/');

        console.log('🔎 Попытка загрузки шрифта:', fontUrl);

        // Проверка доступности файла
        const checkResponse = await fetch(fontUrl, { method: 'HEAD' });
        if (!checkResponse.ok) {
            throw new Error(`Файл шрифта не найден: ${fontUrl}`);
        }

        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`Ошибка загрузки шрифта: ${response.status} ${response.statusText}`);
        }

        const buffer = await response.arrayBuffer();
        const base64Font = arrayBufferToBase64(buffer);

        // РЕГИСТРИРУЕМ ШРИФТ ГЛОБАЛЬНО — ключевое изменение
        window.jspdf.API.addFileToVFS('DejaVuSans.ttf', base64Font);
        window.jspdf.API.addFont('DejaVuSans.ttf', 'DejaVuSans', 'normal');

        // Проверяем глобальную регистрацию
        const testDoc = new window.jspdf.jsPDF();
        const availableFonts = testDoc.getFontList();
        const hasDejaVu = Object.keys(availableFonts).some(fontName =>
            fontName.toLowerCase().includes('dejavusans')
        );

        if (!hasDejaVu) {
            console.error('❌ Шрифт не зарегистрирован глобально');
            throw new Error('Шрифт DejaVuSans не зарегистрирован в системе шрифтов jsPDF');
        }

        window.DejaVuSansLoaded = true;
        console.log('✓ Шрифт DejaVuSans успешно загружен и зарегистрирован ГЛОБАЛЬНО');
    } catch (error) {
        console.error('❌ Критическая ошибка загрузки шрифта:', error.message);
        throw error;
    }
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function waitForJsPDF() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve();
            return;
        }

        let attempts = 0;
        const maxAttempts = 100;

        const checkInterval = setInterval(() => {
            if (window.jspdf) {
                clearInterval(checkInterval);
                resolve();
            } else if (++attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error('jsPDF не загрузился в течение 10 секунд'));
            }
        }, 100);
    });
}
