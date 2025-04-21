import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export function exportAsJson(canvas, fileName=`Pixilo-${Date.now()}`){
    if(!canvas) return false;

    try {
        const canvasData = canvas.toJSON(['id', 'filters']);
        const jsonString = JSON.stringify(canvasData, null, 2);
        const canvasJsonBlob = new Blob([jsonString], {type:'application/json'});

        saveAs(canvasJsonBlob, `${fileName}.json`);

        return true; // ✅ success!
    } catch (error) {
        console.error("Export JSON Error:", error);
        return false;
    }
}


function dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

export function exportAsPng(canvas, fileName = `Pixilo-${Date.now()}`) {
    if (!canvas) return false;

    try {
        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
        });

        const blob = dataURLToBlob(dataUrl);
        saveAs(blob, `${fileName}.png`);
        return true;
    } catch (error) {
        console.error("Export PNG Error:", error);
        return false;
    }
}


export function exportAsSvg(canvas, fileName = `Pixilo-${Date.now()}`) {
    if (!canvas) return false;

    try {
        const svgData = canvas.toSVG();
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        saveAs(blob, `${fileName}.svg`);
        return true;
    } catch (error) {
        console.error("Export SVG Error:", error);
        return false;
    }
}


export function exportAsPdf(canvas, fileName = `Pixilo-${Date.now()}`) {
    if (!canvas) return false;

    try {
        const dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
        });

        const pdf = new jsPDF('l', 'pt', [canvas.getWidth(), canvas.getHeight()]);
        pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.getWidth(), canvas.getHeight());
        pdf.save(`${fileName}.pdf`);
        return true;
    } catch (error) {
        console.error("Export PDF Error:", error);
        return false;
    }
}