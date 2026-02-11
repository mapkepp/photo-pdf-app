export function createPdfDocument() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    doc.setFont('DejaVuSans');
    return doc;
}

export function savePdfDocument(doc, downloadLink) {
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    downloadLink.href = url;
    downloadLink.classList.remove('hidden');
}
