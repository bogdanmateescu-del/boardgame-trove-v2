// Books Collection Manager Module
import { supabase } from '../../services/supabaseClient.js';
import { searchHardcoverByTitle as apiSearchByTitle, searchHardcoverByISBN as apiSearchByISBN } from '../../services/hardcoverService.js';
import { startCameraScanner as startScanner, stopCameraScanner as stopScanner } from '../../services/scannerService.js';
import { getSafeImage, handleImgError } from '../../utils/helpers.js';
import { ITEMS_PER_PAGE } from '../../config/constants.js';
import { updateBookReports } from './booksReports.js';

export let booksInventory = [];
export let currentBookSearchResults = [];
export let currentBookPage = 1;

export function getBooksInventory() {
    return booksInventory;
}

export function setBooksInventory(newInv) {
    booksInventory = newInv;
}

export async function loadBooksData() {
    try {
        let allData = [];
        let from = 0;
        let step = 1000;
        let fetchMore = true;

        while (fetchMore) {
            const { data, error } = await supabase
                .from('books_dev')
                .select('*')
                .range(from, from + step - 1);

            if (error) throw error;
            if (data && data.length > 0) allData = allData.concat(data);
            if (!data || data.length < step) fetchMore = false;
            else from += step;
        }

        booksInventory = allData.map(b => ({
            _raw: b,
            UID: String(b.UID || b.uid || b.id || ""),
            Title: String(b.Title || b.title || "Unknown Title"),
            Author: String(b.Author || b.author || "Unknown Author"),
            Publisher: String(b.Publisher || b.publisher || ""),
            ISBN: String(b.ISBN || b.isbn || ""),
            Genre: String(b.Genre || b.genre || ""),
            Format: String(b.Format || b.format || "Paperback"),
            Type: String(b.Type || b.type || "Standalone"),
            SeriesName: String(b.SeriesName || b.seriesname || b.series_name || ""),
            Location: String(b.Location || b.location || "N/A"),
            PurchaseStatus: String(b.PurchaseStatus || b.purchasestatus || b.purchase_status || "Owned"),
            ReadStatusB: String(b.ReadStatusB || b.readstatusb || b.read_status_b || "unread"),
            ReadStatusL: String(b.ReadStatusL || b.readstatusl || b.read_status_l || "unread"),
            CollectionStatus: String(b.CollectionStatus || b.collectionstatus || b.collection_status || "TBD"),
            SpecialEdition: !!(b.SpecialEdition !== undefined ? b.SpecialEdition : b.special_edition),
            Image: String(b.Image || b.image || "")
        }));

        booksInventory.sort((a, b) => a.Title.localeCompare(b.Title));
        renderBooksList();
        updateBookReports();
    } catch (err) {
        console.error("Error loading books:", err);
    }
}

export function renderBooksList() {
    const fText = (document.getElementById('filter-book-text')?.value || "").toLowerCase().trim();
    const fFormat = document.getElementById('filter-book-format')?.value || "All";
    const fType = document.getElementById('filter-book-type')?.value || "All";
    const fLoc = (document.getElementById('filter-book-loc')?.value || "").toLowerCase().trim();
    const fPurch = document.getElementById('filter-book-purch')?.value || "All";
    const fReadB = document.getElementById('filter-book-readb')?.value || "All";
    const fReadL = document.getElementById('filter-book-readl')?.value || "All";
    const fColl = document.getElementById('filter-book-coll')?.value || "All";

    const filtered = booksInventory.filter(b => {
        const matchText = !fText || b.Title.toLowerCase().includes(fText) || 
                            b.Author.toLowerCase().includes(fText) || 
                            b.Publisher.toLowerCase().includes(fText);
        
        const matchLoc = !fLoc || b.Location.toLowerCase().includes(fLoc);
        const matchFormat = fFormat === "All" || b.Format.toLowerCase() === fFormat.toLowerCase();
        const matchType = fType === "All" || b.Type.toLowerCase() === fType.toLowerCase();
        const matchPurch = fPurch === "All" || b.PurchaseStatus.toLowerCase() === fPurch.toLowerCase();
        const matchReadB = fReadB === "All" || b.ReadStatusB.toLowerCase() === fReadB.toLowerCase();
        const matchReadL = fReadL === "All" || b.ReadStatusL.toLowerCase() === fReadL.toLowerCase();
        const matchColl = fColl === "All" || b.CollectionStatus.toLowerCase() === fColl.toLowerCase();

        return matchText && matchLoc && matchFormat && matchType && matchPurch && matchReadB && matchReadL && matchColl;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentBookPage > totalPages) currentBookPage = totalPages;
    if (currentBookPage < 1) currentBookPage = 1;
    
    const startIndex = (currentBookPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(startIndex, endIndex);

    const list = document.getElementById('books-list');
    if (!list) return;
    
    if (filtered.length === 0) {
        list.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-bold"><i data-lucide="search-x" class="mx-auto mb-3" size="32"></i>No books match your filters.</div>`;
    } else {
        list.innerHTML = paginatedItems.map(b => `
            <div onclick="openBook('${b.UID}')" class="cursor-pointer group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                <div class="aspect-[3/4] overflow-hidden bg-slate-100 relative">
                    <img src="${getSafeImage(b.Image)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="handleImgError(this)">
                    <div class="absolute top-2 left-2 flex flex-col gap-1">
                        ${b.PurchaseStatus === 'Preorder' ? '<span class="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">PREORDER</span>' : ''}
                        ${b.SpecialEdition ? '<span class="bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">SPECIAL</span>' : ''}
                        ${b.CollectionStatus === 'Keep' ? '<span class="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">KEEP</span>' : ''}
                    </div>
                </div>
                <div class="p-3 flex-grow flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-slate-800 text-sm leading-tight line-clamp-2 mb-1">${b.Title}</h4>
                        <p class="text-slate-500 text-xs font-bold mb-1">${b.Author}</p>
                        ${b.SeriesName ? `<p class="text-indigo-600 text-[10px] font-black italic mb-2 leading-tight">Series: ${b.SeriesName}</p>` : ''}
                        <div class="flex items-center gap-1 text-slate-400 font-black text-[9px] uppercase tracking-wider">
                            <i data-lucide="map-pin" size="10" class="text-indigo-600"></i> ${b.Location} · ${b.Format}
                        </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400">
                        <span>B: ${b.ReadStatusB}</span>
                        <span>L: ${b.ReadStatusL}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    const pageInfo = document.getElementById('book-page-info');
    const btnPrev = document.getElementById('btn-book-prev');
    const btnNext = document.getElementById('btn-book-next');
    if (pageInfo) pageInfo.innerText = `Page ${currentBookPage} of ${totalPages}`;
    if (btnPrev) btnPrev.disabled = (currentBookPage === 1);
    if (btnNext) btnNext.disabled = (currentBookPage === totalPages);

    if (window.lucide) window.lucide.createIcons();
}

export function changeBookPage(direction) {
    currentBookPage += direction;
    renderBooksList();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

export function applyBookFilters() {
    currentBookPage = 1;
    renderBooksList();
}

export function clearBookFilters() {
    if(document.getElementById('filter-book-text')) document.getElementById('filter-book-text').value = '';
    if(document.getElementById('filter-book-format')) document.getElementById('filter-book-format').value = 'All';
    if(document.getElementById('filter-book-type')) document.getElementById('filter-book-type').value = 'All';
    if(document.getElementById('filter-book-loc')) document.getElementById('filter-book-loc').value = '';
    if(document.getElementById('filter-book-purch')) document.getElementById('filter-book-purch').value = 'All';
    if(document.getElementById('filter-book-readb')) document.getElementById('filter-book-readb').value = 'All';
    if(document.getElementById('filter-book-readl')) document.getElementById('filter-book-readl').value = 'All';
    if(document.getElementById('filter-book-coll')) document.getElementById('filter-book-coll').value = 'All';
    applyBookFilters();
}

export function toggleAdvancedBookFilters() {
    const advancedFilters = document.getElementById('advanced-book-filters');
    const toggleText = document.getElementById('text-toggle-book-filters');
    const toggleBtn = document.getElementById('btn-toggle-book-filters');
    if (!advancedFilters) return;

    if (advancedFilters.classList.contains('hidden')) {
        advancedFilters.classList.remove('hidden');
        if (toggleText) toggleText.innerText = "Less Filters";
        if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="chevron-up" size="14"></i> <span id="text-toggle-book-filters">Less Filters</span>`;
    } else {
        advancedFilters.classList.add('hidden');
        if (toggleText) toggleText.innerText = "More Filters";
        if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="chevron-down" size="14"></i> <span id="text-toggle-book-filters">More Filters</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
}

export function toggleSeriesInput() {
    const typeSelect = document.getElementById('in-book-type');
    const container = document.getElementById('container-series-name');
    if (!typeSelect || !container) return;
    if (typeSelect.value === 'Series') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        const sName = document.getElementById('in-book-seriesname');
        if (sName) sName.value = '';
    }
}

export function startCameraScanner() {
    startScanner((cleanedIsbn) => {
        if (document.getElementById('in-book-isbn')) {
            document.getElementById('in-book-isbn').value = cleanedIsbn;
        }
        searchBookByISBN();
    });
}

export function stopCameraScanner() {
    stopScanner();
}

export function updateCoverPreview() {
    const el = document.getElementById('in-book-img');
    if (!el) return;
    const val = el.value.trim();
    const box = document.getElementById('cover-preview-box');
    const img = document.getElementById('img-cover-preview');
    
    if(!box || !img) return;

    if (val.length > 5) {
        img.src = getSafeImage(val);
        box.classList.remove('hidden');
        box.classList.add('flex');
    } else {
        box.classList.add('hidden');
        box.classList.remove('flex');
    }
}

export function openGoogleImageSearch() {
    const elTitle = document.getElementById('in-book-title');
    const elAuthor = document.getElementById('in-book-author');
    const elPub = document.getElementById('in-book-publisher');
    
    const title = elTitle ? elTitle.value.trim() : "";
    const author = elAuthor ? elAuthor.value.trim() : "";
    const pub = elPub ? elPub.value.trim() : "";
    
    let query = title || "book cover";
    if (author) query += ` ${author}`;
    if (pub) query += ` ${pub}`;
    query += " cover";

    window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, '_blank');
}

export async function searchBookByTitle() {
    const titleInput = document.getElementById('in-book-title');
    if (!titleInput) return;
    const term = titleInput.value.trim();
    if (!term) {
        alert("Please enter a book title first.");
        return;
    }

    const { books, source } = await apiSearchByTitle(term);
    if (!books || books.length === 0) {
        alert("No books found matching that title.");
        return;
    }

    currentBookSearchResults = books;
    const resultsContainer = document.getElementById('edition-results');
    if (!resultsContainer) return;

    if (source === 'hardcover') {
        resultsContainer.innerHTML = books.map((b, bIdx) => {
            const bookTitle = b.title || 'Unknown Title';
            const authorName = b.contributions?.[0]?.author?.name || 'Unknown Author';
            const coverUrl = b.image?.url || '';

            const editionsList = b.editions && b.editions.length > 0 ? b.editions.map((ed, eIdx) => `
                <div onclick="selectHardcoverBookEdition(${bIdx}, ${eIdx})" class="cursor-pointer bg-white hover:bg-indigo-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between items-center transition-all">
                    <div>
                        <p class="font-black text-slate-800">${ed.publisher?.name || 'Standard Edition'} (${ed.edition_format || 'Format N/A'})</p>
                        <p class="text-[10px] text-slate-400">ISBN-13: ${ed.isbn_13 || 'N/A'}</p>
                    </div>
                    <span class="bg-indigo-600 text-white text-[9px] font-black py-1 px-2.5 rounded-lg">Select</span>
                </div>
            `).join('') : '<p class="text-xs text-slate-400 italic">No editions listed.</p>';

            return `
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
                    <div class="flex gap-3">
                        <img src="${getSafeImage(coverUrl)}" class="w-16 h-24 object-cover rounded-xl shadow-sm shrink-0" onerror="handleImgError(this)">
                        <div>
                            <h4 class="font-black text-slate-800 text-sm line-clamp-1">${bookTitle}</h4>
                            <p class="text-slate-500 text-xs font-bold mt-0.5">${authorName}</p>
                            <p class="text-[10px] text-indigo-600 font-bold mt-1">${b.editions?.length || 0} editions available</p>
                        </div>
                    </div>
                    <div class="space-y-2 max-h-40 overflow-y-auto pr-1">
                        ${editionsList}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        // Open Library fallback display
        resultsContainer.innerHTML = books.map((b, bIdx) => `
            <div onclick="selectHardcoverBookEdition(${bIdx}, 0)" class="cursor-pointer bg-slate-50 hover:bg-indigo-50 p-4 rounded-2xl border border-slate-200 transition-all flex gap-4 items-center">
                <img src="${getSafeImage(b.image?.url)}" class="w-16 h-24 object-cover rounded-xl shadow-sm shrink-0" onerror="handleImgError(this)">
                <div class="flex-grow">
                    <h4 class="font-black text-slate-800 text-sm line-clamp-1">${b.title}</h4>
                    <p class="text-slate-500 text-xs font-bold">${b.contributions?.[0]?.author?.name || 'Unknown'}</p>
                </div>
                <span class="bg-indigo-600 text-white text-[10px] font-black py-2 px-4 rounded-xl shadow-sm shrink-0">Select Edition</span>
            </div>
        `).join('');
    }

    const editionModal = document.getElementById('edition-modal');
    if (editionModal) editionModal.classList.remove('hidden');
}

export function selectHardcoverBookEdition(bookIdx, editionIdx) {
    const book = currentBookSearchResults[bookIdx];
    if (!book) return;

    const ed = book.editions?.[editionIdx] || {};
    const bookTitle = book.title || '';
    const authors = book.contributions?.map(c => c.author?.name).filter(Boolean) || [];

    if(document.getElementById('in-book-title')) document.getElementById('in-book-title').value = bookTitle;
    if(document.getElementById('in-book-author')) document.getElementById('in-book-author').value = authors.join(', ');
    if(document.getElementById('in-book-publisher')) document.getElementById('in-book-publisher').value = ed.publisher?.name || '';
    if(document.getElementById('in-book-isbn')) document.getElementById('in-book-isbn').value = ed.isbn_13 || ed.isbn_10 || '';
    
    if(document.getElementById('in-book-format') && ed.edition_format) {
        const formatSelect = document.getElementById('in-book-format');
        const fmtLower = ed.edition_format.toLowerCase();
        if (fmtLower.includes('hardcover')) formatSelect.value = 'Hardcover';
        else if (fmtLower.includes('paperback')) formatSelect.value = 'Paperback';
    }

    if(document.getElementById('in-book-img')) {
        const coverUrl = ed.image?.url || book.image?.url || '';
        document.getElementById('in-book-img').value = coverUrl;
        updateCoverPreview();
    }

    const editionModal = document.getElementById('edition-modal');
    if (editionModal) editionModal.classList.add('hidden');
}

export async function searchBookByISBN() {
    const isbnInput = document.getElementById('in-book-isbn');
    if (!isbnInput) return;
    const val = isbnInput.value.trim();
    if (!val) {
        alert("Please enter an ISBN, EAN, or Title first.");
        return;
    }

    const cleanIsbn = val.replace(/[^0-9X]/gi, '');
    const isIsbnSearch = cleanIsbn.length >= 10;

    if (!isIsbnSearch) {
        if(document.getElementById('in-book-title')) document.getElementById('in-book-title').value = val;
        searchBookByTitle();
        return;
    }

    const result = await apiSearchByISBN(cleanIsbn);
    if (result) {
        if(document.getElementById('in-book-title')) document.getElementById('in-book-title').value = result.title;
        if(document.getElementById('in-book-author')) document.getElementById('in-book-author').value = result.authors.join(', ');
        if(document.getElementById('in-book-publisher')) document.getElementById('in-book-publisher').value = result.publisher;
        if(document.getElementById('in-book-isbn')) document.getElementById('in-book-isbn').value = result.isbn;
        
        if(document.getElementById('in-book-format') && result.editionFormat) {
            const formatSelect = document.getElementById('in-book-format');
            const fmtLower = result.editionFormat.toLowerCase();
            if (fmtLower.includes('hardcover')) formatSelect.value = 'Hardcover';
            else if (fmtLower.includes('paperback')) formatSelect.value = 'Paperback';
        }

        if(document.getElementById('in-book-img')) {
            document.getElementById('in-book-img').value = result.imageUrl || '';
            updateCoverPreview();
        }
        return;
    }

    alert("No edition found with that ISBN.");
}

export async function saveBook() {
    const rawSample = booksInventory.length > 0 ? booksInventory[0]._raw : {};
    const assignKey = (keys) => {
        for(let k of keys) { if(k in rawSample) return k; }
        return keys[0];
    };

    const book = {};
    book[assignKey(['Title', 'title'])] = document.getElementById('in-book-title').value;
    book[assignKey(['Author', 'author'])] = document.getElementById('in-book-author').value;
    book[assignKey(['Publisher', 'publisher'])] = document.getElementById('in-book-publisher').value;
    book[assignKey(['ISBN', 'isbn'])] = document.getElementById('in-book-isbn').value;
    book[assignKey(['Genre', 'genre'])] = document.getElementById('in-book-genre').value;
    book[assignKey(['Format', 'format'])] = document.getElementById('in-book-format').value;
    book[assignKey(['Type', 'type'])] = document.getElementById('in-book-type').value;
    book[assignKey(['SeriesName', 'seriesname', 'series_name'])] = document.getElementById('in-book-seriesname').value;
    book[assignKey(['Location', 'location'])] = document.getElementById('in-book-loc').value;
    book[assignKey(['PurchaseStatus', 'purchasestatus', 'purchase_status'])] = document.getElementById('in-book-purch').value;
    book[assignKey(['ReadStatusB', 'readstatusb', 'read_status_b'])] = document.getElementById('in-book-readb').value;
    book[assignKey(['ReadStatusL', 'readstatusl', 'read_status_l'])] = document.getElementById('in-book-readl').value;
    book[assignKey(['CollectionStatus', 'collectionstatus', 'collection_status'])] = document.getElementById('in-book-coll').value;
    book[assignKey(['SpecialEdition', 'specialedition', 'special_edition'])] = document.getElementById('in-book-special').checked;
    book[assignKey(['Image', 'image'])] = document.getElementById('in-book-img').value || "";

    if (!book[assignKey(['Title', 'title'])] || !book[assignKey(['Location', 'location'])]) {
        return alert("Title and Location are mandatory!");
    }

    const { error } = await supabase.from('books_dev').insert([book]);
    if (error) {
        alert("Error saving book: " + error.message);
    } else {
        document.getElementById('add-book-panel').classList.add('hidden');
        document.getElementById('in-book-title').value = '';
        document.getElementById('in-book-author').value = '';
        document.getElementById('in-book-publisher').value = '';
        document.getElementById('in-book-isbn').value = '';
        document.getElementById('in-book-genre').value = '';
        document.getElementById('in-book-loc').value = '';
        document.getElementById('in-book-img').value = '';
        document.getElementById('cover-preview-box').classList.add('hidden');
        document.getElementById('in-book-special').checked = false;
        loadBooksData();
    }
}
