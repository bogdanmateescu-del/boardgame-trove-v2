// Barcode & Camera Scanner Service using Html5QrcodeScanner
let html5QrcodeScanner = null;

export function startCameraScanner(onSuccess) {
    const container = document.getElementById('scanner-container');
    if (!container) return;
    container.classList.remove('hidden');

    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear();
    }

    // Html5QrcodeScanner is loaded from window or import
    const ScannerClass = window.Html5QrcodeScanner || (typeof Html5QrcodeScanner !== 'undefined' ? Html5QrcodeScanner : null);
    if (!ScannerClass) {
        alert("Scanner library is loading or not supported on this browser.");
        return;
    }

    html5QrcodeScanner = new ScannerClass("barcode-scanner", { 
        fps: 10, 
        qrbox: { width: 280, height: 160 },
        rememberLastUsedCamera: true
    }, false);

    html5QrcodeScanner.render((decodedText) => {
        const cleanedIsbn = decodedText.replace(/[^0-9X]/gi, '');
        stopCameraScanner();
        if (onSuccess) onSuccess(cleanedIsbn);
    }, (error) => {});
}

export function stopCameraScanner() {
    const container = document.getElementById('scanner-container');
    if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().then(() => {
            if (container) container.classList.add('hidden');
        }).catch(() => {
            if (container) container.classList.add('hidden');
        });
    } else {
        if (container) container.classList.add('hidden');
    }
}
