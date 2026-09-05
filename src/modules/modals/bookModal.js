// Book Details & Edit Modal Controller
import { supabase } from '../../services/supabaseClient.js';
import { getSafeImage } from '../../utils/helpers.js';
import { getBooksInventory, loadBooksData } from '../books/booksCollection.js';
import { setDeleteTarget } from './deleteModal.js';

export let currentBook = null;
export let originalBookData = {};

export function getCurrentBook() {
    return currentBook;
}

export function openBook(uid) {
    if (!uid) return;
    const booksInventory = getBooksInventory();
    currentBook = booksInventory.find(b => String(b.UID) === String(uid));
    if (!currentBook) return;

    setDeleteTarget('book');

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val !== undefined && val !== null ? val : '';
    };

    setVal('modal-book-title', currentBook.Title);
    setVal('modal-book-author', currentBook.Author);
    setVal('modal-book-publisher', currentBook.Publisher);
    setVal('modal-book-isbn', currentBook.ISBN);
    setVal('modal-book-genre', currentBook.Genre);
    setVal('modal-book-format', currentBook.Format);
    setVal('modal-book-type', currentBook.Type);
    setVal('modal-book-seriesname', currentBook.SeriesName);
    setVal('modal-book-loc', currentBook.Location);
    setVal('modal-book-purch', currentBook.PurchaseStatus);
    setVal('modal-book-readb', currentBook.ReadStatusB);
    setVal('modal-book-readl', currentBook.ReadStatusL);
    setVal('modal-book-coll', currentBook.CollectionStatus);
    
    const chkSpecial = document.getElementById('modal-book-special');
    if (chkSpecial) chkSpecial.checked = !!currentBook.SpecialEdition;
    
    setVal('modal-book-img', currentBook.Image);
    
    const imgDisplay = document.getElementById('modal-book-img-display');
    if (imgDisplay) imgDisplay.src = getSafeImage(currentBook.Image);
    
    toggleModalSeriesInput();

    originalBookData = { ...currentBook };
    toggleBookEditMode(false);
    
    const modal = document.getElementById('book-modal');
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
}

export function closeBook() {
    const modal = document.getElementById('book-modal');
    if (modal) modal.classList.add('hidden');
    currentBook = null;
}

export function toggleModalSeriesInput() {
    const el = document.getElementById('modal-book-type');
    if (!el) return;
    const container = document.getElementById('modal-container-series-name');
    if (!container) return;
    if (el.value === 'Series') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        const sName = document.getElementById('modal-book-seriesname');
        if (sName) sName.value = '';
    }
}

export function toggleBookEditMode(isEditing) {
    const inputs = [
        'modal-book-title', 'modal-book-author', 'modal-book-publisher', 
        'modal-book-isbn', 'modal-book-genre', 'modal-book-format', 
        'modal-book-type', 'modal-book-seriesname', 'modal-book-loc', 
        'modal-book-purch', 'modal-book-readb', 'modal-book-readl', 
        'modal-book-coll'
    ];
    const coverEditBox = document.getElementById('modal-book-cover-edit');
    const specialCheckbox = document.getElementById('modal-book-special');

    if (!isEditing && currentBook) {
        const imgDisplay = document.getElementById('modal-book-img-display');
        if (imgDisplay) imgDisplay.src = getSafeImage(originalBookData.Image);
    }

    if (isEditing) {
        if (coverEditBox) coverEditBox.classList.remove('hidden');
        if (specialCheckbox) {
            specialCheckbox.removeAttribute('disabled');
            specialCheckbox.classList.remove('pointer-events-none');
        }
    } else {
        if (coverEditBox) coverEditBox.classList.add('hidden');
        if (specialCheckbox) {
            specialCheckbox.setAttribute('disabled', 'true');
            specialCheckbox.classList.add('pointer-events-none');
        }
    }

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (isEditing) {
            el.removeAttribute('readonly');
            el.removeAttribute('disabled');
            el.classList.add('border-indigo-300', 'focus:ring-2', 'focus:ring-indigo-400', 'bg-white');
            el.classList.remove('border-transparent', 'bg-slate-50', 'pointer-events-none');
        } else {
            el.setAttribute('readonly', 'true');
            if (el.tagName === 'SELECT') el.setAttribute('disabled', 'true');
            el.classList.remove('border-indigo-300', 'focus:ring-2', 'focus:ring-indigo-400', 'bg-white');
            el.classList.add('border-transparent', 'bg-slate-50', 'pointer-events-none');
        }
    });

    if (isEditing) {
        document.getElementById('modal-book-btn-edit')?.classList.add('hidden');
        document.getElementById('modal-book-btn-delete')?.classList.add('hidden');
        document.getElementById('modal-book-btn-save')?.classList.remove('hidden');
        document.getElementById('modal-book-btn-cancel')?.classList.remove('hidden');
        checkBookChanges();
    } else {
        document.getElementById('modal-book-btn-edit')?.classList.remove('hidden');
        document.getElementById('modal-book-btn-delete')?.classList.remove('hidden');
        document.getElementById('modal-book-btn-save')?.classList.add('hidden');
        document.getElementById('modal-book-btn-cancel')?.classList.add('hidden');
    }
}

export function checkBookChanges() {
    if (!currentBook) return;
    const currentData = {
        Title: document.getElementById('modal-book-title')?.value,
        Author: document.getElementById('modal-book-author')?.value,
        Publisher: document.getElementById('modal-book-publisher')?.value,
        ISBN: document.getElementById('modal-book-isbn')?.value,
        Genre: document.getElementById('modal-book-genre')?.value,
        Format: document.getElementById('modal-book-format')?.value,
        Type: document.getElementById('modal-book-type')?.value,
        SeriesName: document.getElementById('modal-book-seriesname')?.value,
        Location: document.getElementById('modal-book-loc')?.value,
        PurchaseStatus: document.getElementById('modal-book-purch')?.value,
        ReadStatusB: document.getElementById('modal-book-readb')?.value,
        ReadStatusL: document.getElementById('modal-book-readl')?.value,
        CollectionStatus: document.getElementById('modal-book-coll')?.value,
        SpecialEdition: document.getElementById('modal-book-special')?.checked,
        Image: document.getElementById('modal-book-img')?.value
    };

    let isChanged = false;
    for (let key in originalBookData) {
        if (key !== '_raw' && originalBookData[key] !== currentData[key]) {
            isChanged = true;
            break;
        }
    }

    const saveBtn = document.getElementById('modal-book-btn-save');
    if (saveBtn) {
        if (isChanged) {
            saveBtn.disabled = false;
            saveBtn.classList.remove('opacity-50');
        } else {
            saveBtn.disabled = true;
            saveBtn.classList.add('opacity-50');
        }
    }
}

export async function saveBookEdit() {
    if (!currentBook) return;
    const saveBtn = document.getElementById('modal-book-btn-save');
    if (saveBtn) {
        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;
    }
    
    const raw = currentBook._raw || {};
    const assignKey = (keys) => {
        for (let k of keys) { if (k in raw) return k; }
        return keys[0];
    };

    const payload = {};
    payload[assignKey(['Title', 'title'])] = document.getElementById('modal-book-title')?.value;
    payload[assignKey(['Author', 'author'])] = document.getElementById('modal-book-author')?.value;
    payload[assignKey(['Publisher', 'publisher'])] = document.getElementById('modal-book-publisher')?.value;
    payload[assignKey(['ISBN', 'isbn'])] = document.getElementById('modal-book-isbn')?.value;
    payload[assignKey(['Genre', 'genre'])] = document.getElementById('modal-book-genre')?.value;
    payload[assignKey(['Format', 'format'])] = document.getElementById('modal-book-format')?.value;
    payload[assignKey(['Type', 'type'])] = document.getElementById('modal-book-type')?.value;
    payload[assignKey(['SeriesName', 'seriesname', 'series_name'])] = document.getElementById('modal-book-seriesname')?.value;
    payload[assignKey(['Location', 'location'])] = document.getElementById('modal-book-loc')?.value;
    payload[assignKey(['PurchaseStatus', 'purchasestatus', 'purchase_status'])] = document.getElementById('modal-book-purch')?.value;
    payload[assignKey(['ReadStatusB', 'readstatusb', 'read_status_b'])] = document.getElementById('modal-book-readb')?.value;
    payload[assignKey(['ReadStatusL', 'readstatusl', 'read_status_l'])] = document.getElementById('modal-book-readl')?.value;
    payload[assignKey(['CollectionStatus', 'collectionstatus', 'collection_status'])] = document.getElementById('modal-book-coll')?.value;
    payload[assignKey(['SpecialEdition', 'specialedition', 'special_edition'])] = document.getElementById('modal-book-special')?.checked;
    payload[assignKey(['Image', 'image'])] = document.getElementById('modal-book-img')?.value || "";

    const pkCol = ('id' in raw) ? 'id' : ('uid' in raw ? 'uid' : 'UID');
    const { error } = await supabase.from('books_dev').update(payload).eq(pkCol, currentBook.UID);
    
    if (error) {
        alert("Database Error: " + error.message);
        if (saveBtn) {
            saveBtn.innerText = "Save Changes";
            saveBtn.disabled = false;
        }
    } else {
        loadBooksData();
        closeBook();
        if (saveBtn) {
            saveBtn.innerText = "Save Changes";
        }
    }
}
