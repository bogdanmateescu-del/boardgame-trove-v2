import { FALLBACK_IMAGE } from '../config/constants.js';

export function handleImgError(el) {
    if (!el) return;
    el.onerror = null;
    el.src = FALLBACK_IMAGE;
}

export function getSafeImage(imgStr) {
    if (!imgStr || imgStr === "null" || imgStr === "undefined" || String(imgStr).trim() === "" || String(imgStr).includes('blank.gif') || String(imgStr).includes('zoom=0')) {
        return FALLBACK_IMAGE;
    }
    if (String(imgStr).startsWith('//')) {
        return 'https:' + imgStr;
    }
    return String(imgStr).replace(/^http:\/\//i, 'https://');
}

export function getProp(obj, ...keys) {
    for (let k of keys) {
        if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return undefined;
}

export function exportToCSV(filename, headers, rows) {
    let csvContent = headers.join(",") + "\n";
    rows.forEach(row => {
        csvContent += row.map(val => `"${String(val !== null && val !== undefined ? val : '').replace(/"/g, '""')}"`).join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
