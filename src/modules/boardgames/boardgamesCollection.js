// Boardgames Collection Manager Module
import { supabase } from '../../services/supabaseClient.js';
import { fetchBGG, parseBGGSearchXml, fetchBGGThingImage } from '../../services/bggService.js';
import { getSafeImage, handleImgError } from '../../utils/helpers.js';
import { ITEMS_PER_PAGE } from '../../config/constants.js';
import { updateReports } from './boardgamesReports.js';

export let inventory = [];
export let currentPage = 1;

let addSearchTimeout = null;
let currentAddSearchToken = 0;
let keyboardSelectedIndex = -1;

export function getInventory() {
    return inventory;
}

export function setInventory(newInventory) {
    inventory = newInventory;
}

export async function loadData() {
    try {
        let allData = [];
        let from = 0;
        let step = 1000;
        let fetchMore = true;

        while (fetchMore) {
            const { data, error } = await supabase
                .from('collection_dev')
                .select('*')
                .range(from, from + step - 1);
                
            if (error) throw error;
            if (data && data.length > 0) allData = allData.concat(data);
            if (!data || data.length < step) fetchMore = false;
            else from += step;
        }
        
        inventory = allData.map(g => {
            let chk = g.Checked !== undefined ? g.Checked : g.checked;
            if (chk === true) chk = "Yes";
            if (chk === false) chk = "No";
            if (!chk) chk = "No";

            return {
                _raw: g, 
                UID: String(g.UID || g.uid || g.id || ""),
                Name: String(g.Name || g.name || "Unknown"),
                BGGID: g["BGG ID"] || g.bgg_id || null,
                Image: g.Image || g.image || "",
                Location: String(g.Location || g.location || "N/A"),
                Playstatus: String(g.Playstatus || g.playstatus || "Not played"),
                Collectionstatus: String(g.Collectionstatus || g.collectionstatus || "TBD"),
                Purchasestatus: String(g.Purchasestatus || g.purchasestatus || "Owned"),
                Type: String(g.Type || g.type || "Game"),
                Players: String(g.Players || g.players || ""),
                Comments: String(g.Comments || g.comments || ""),
                Checked: String(chk)
            };
        });

        inventory.sort((a, b) => a.Name.localeCompare(b.Name));
        renderDashboard();
        renderList();
        updateReports();
    } catch (err) {
        console.error("Error loading boardgames data:", err);
    }
}

export function toggleCollectionViewGroup() {
    const fullView = document.getElementById('boardgames-full-view');
    const dashView = document.getElementById('boardgames-dashboard-view');
    const btn = document.getElementById('btn-show-collection-toggle');
    if (!fullView || !dashView || !btn) return;

    if (fullView.classList.contains('hidden')) {
        clearFilters();
        dashView.classList.add('hidden');
        fullView.classList.remove('hidden');
        btn.innerHTML = `<i data-lucide="layout-dashboard" size="16"></i> Show Dashboard`;
        renderList();
    } else {
        fullView.classList.add('hidden');
        dashView.classList.remove('hidden');
        btn.innerHTML = `<i data-lucide="layers" size="16"></i> Show Collection`;
        renderDashboard();
    }
    if (window.lucide) window.lucide.createIcons();
}

export function switchToFullCollection() {
    const fullView = document.getElementById('boardgames-full-view');
    const dashView = document.getElementById('boardgames-dashboard-view');
    const btn = document.getElementById('btn-show-collection-toggle');
    if (fullView) fullView.classList.remove('hidden');
    if (dashView) dashView.classList.add('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="layout-dashboard" size="16"></i> Show Dashboard`;
    renderList();
    if (window.lucide) window.lucide.createIcons();
}

export function switchToDashboard() {
    const fullView = document.getElementById('boardgames-full-view');
    const dashView = document.getElementById('boardgames-dashboard-view');
    const btn = document.getElementById('btn-show-collection-toggle');
    if (fullView) fullView.classList.add('hidden');
    if (dashView) dashView.classList.remove('hidden');
    if (btn) btn.innerHTML = `<i data-lucide="layers" size="16"></i> Show Collection`;
    renderDashboard();
    if (window.lucide) window.lucide.createIcons();
}

export function toggleAdvancedFilters() {
    const advancedFilters = document.getElementById('advanced-filters');
    const toggleText = document.getElementById('text-toggle-filters');
    const toggleBtn = document.getElementById('btn-toggle-filters');
    if (!advancedFilters) return;

    if (advancedFilters.classList.contains('hidden')) {
        advancedFilters.classList.remove('hidden');
        if (toggleText) toggleText.innerText = "Less Filters";
        if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="chevron-up" size="14"></i> <span id="text-toggle-filters">Less Filters</span>`;
    } else {
        advancedFilters.classList.add('hidden');
        if (toggleText) toggleText.innerText = "More Filters";
        if (toggleBtn) toggleBtn.innerHTML = `<i data-lucide="chevron-down" size="14"></i> <span id="text-toggle-filters">More Filters</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
}

export function renderDashboard() {
    const latestContainer = document.getElementById('latest-games-list');
    const lastPlayedContainer = document.getElementById('last-played-list');
    if (!latestContainer || !lastPlayedContainer) return;

    const sortedByCreated = [...inventory].sort((a, b) => {
        const tA = a._raw.created_at ? new Date(a._raw.created_at).getTime() : 0;
        const tB = b._raw.created_at ? new Date(b._raw.created_at).getTime() : 0;
        return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
    });
    const latest5 = sortedByCreated.slice(0, 5);

    const playedGames = inventory.filter(g => String(g.Playstatus).toLowerCase() === 'played');
    const sortedByPlayed = playedGames.sort((a, b) => {
        const tA = a._raw.played_at ? new Date(a._raw.played_at).getTime() : 0;
        const tB = b._raw.played_at ? new Date(b._raw.played_at).getTime() : 0;
        return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
    });
    const lastPlayed5 = sortedByPlayed.slice(0, 5);

    latestContainer.innerHTML = latest5.length === 0 ? `<p class="col-span-full text-xs text-slate-400 italic">No games added yet.</p>` : latest5.map(g => renderDashboardCard(g)).join('');
    lastPlayedContainer.innerHTML = lastPlayed5.length === 0 ? `<p class="col-span-full text-xs text-slate-400 italic">No games played yet.</p>` : lastPlayed5.map(g => renderDashboardCard(g)).join('');

    if (window.lucide) window.lucide.createIcons();
}

export function getBggLinkHtml(g) {
    const hasBggId = g.BGGID && String(g.BGGID).trim() !== '' && String(g.BGGID) !== '0';
    const url = hasBggId
        ? `https://boardgamegeek.com/boardgame/${g.BGGID}`
        : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(g.Name)}`;

    return `
        <div class="mb-1.5">
            <a href="${url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" class="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                <i data-lucide="external-link" size="10"></i> BGG Link
            </a>
        </div>
    `;
}

export function renderDashboardCard(g) {
    return `
        <div onclick="openGame('${g.UID}')" class="cursor-pointer group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full">
            <div class="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                <img src="${getSafeImage(g.Image)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="handleImgError(this)">
                <div class="absolute top-2 left-2 flex flex-col gap-1">
                    ${g.Collectionstatus === 'Keep' ? '<span class="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">KEEP</span>' : ''}
                </div>
            </div>
            <div class="p-3 flex-grow flex flex-col justify-between">
                <div>
                    <h4 class="font-black text-slate-800 text-xs leading-tight line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">${g.Name}</h4>
                    ${getBggLinkHtml(g)}
                    <div class="flex items-center gap-1 text-indigo-600 font-black text-[9px] uppercase tracking-wider mb-1">
                        <i data-lucide="map-pin" size="10"></i> ${g.Location}
                    </div>
                    <div class="flex items-center gap-1 text-slate-500 font-bold text-[9px]">
                        <i data-lucide="users" size="10"></i> ${g.Players || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function clearFilters() {
    if(document.getElementById('filter-name')) document.getElementById('filter-name').value = '';
    if(document.getElementById('filter-loc')) document.getElementById('filter-loc').value = '';
    if(document.getElementById('filter-players')) document.getElementById('filter-players').value = '';
    if(document.getElementById('filter-type')) document.getElementById('filter-type').value = 'All';
    if(document.getElementById('filter-play')) document.getElementById('filter-play').value = 'All';
    if(document.getElementById('filter-coll')) document.getElementById('filter-coll').value = 'All';
    if(document.getElementById('filter-purch')) document.getElementById('filter-purch').value = 'All';
    if(document.getElementById('filter-checked')) document.getElementById('filter-checked').value = 'All';
    
    const resultsSection = document.getElementById('search-results-section');
    if (resultsSection) resultsSection.classList.add('hidden');

    currentPage = 1;
    renderList();
}

export function applyFilters() {
    const fName = (document.getElementById('filter-name')?.value || "").toLowerCase().trim();
    const fLoc = (document.getElementById('filter-loc')?.value || "").toLowerCase().trim();
    const fPlayers = (document.getElementById('filter-players')?.value || "").toLowerCase().trim();
    const fType = document.getElementById('filter-type')?.value || "All";
    const fPlay = document.getElementById('filter-play')?.value || "All";
    const fColl = document.getElementById('filter-coll')?.value || "All";
    const fPurch = document.getElementById('filter-purch')?.value || "All";
    const fChecked = document.getElementById('filter-checked')?.value || "All";
    
    const resultsSection = document.getElementById('search-results-section');
    const resultsList = document.getElementById('search-results-list');
    const resultsCount = document.getElementById('search-results-count');

    const isFiltering = fName || fLoc || fPlayers || fType !== 'All' || fPlay !== 'All' || fColl !== 'All' || fPurch !== 'All' || fChecked !== 'All';

    if (!isFiltering) {
        if (resultsSection) resultsSection.classList.add('hidden');
        currentPage = 1;
        renderList();
        return;
    }

    const filtered = inventory.filter(g => {
        const matchName = String(g.Name).toLowerCase().includes(fName);
        let matchLoc = true;
        if (fLoc) {
            const itemLoc = String(g.Location).trim().toLowerCase();
            matchLoc = itemLoc.includes(fLoc);
        }
        const matchPlayers = String(g.Players).toLowerCase().includes(fPlayers);
        const matchType = fType === "All" || String(g.Type).toLowerCase() === fType.toLowerCase();
        const matchPlay = fPlay === "All" || String(g.Playstatus).toLowerCase() === fPlay.toLowerCase();
        const matchColl = fColl === "All" || String(g.Collectionstatus).toLowerCase() === fColl.toLowerCase();
        const matchPurch = fPurch === "All" || String(g.Purchasestatus).toLowerCase() === fPurch.toLowerCase();
        const matchChecked = fChecked === "All" || String(g.Checked).toLowerCase() === fChecked.toLowerCase();

        return matchName && matchLoc && matchPlayers && matchType && matchPlay && matchColl && matchPurch && matchChecked;
    });

    if (resultsSection) resultsSection.classList.remove('hidden');
    if (resultsCount) resultsCount.innerText = filtered.length;

    if (resultsList) {
        if (filtered.length === 0) {
            resultsList.innerHTML = `<div class="col-span-full py-6 text-center text-slate-400 text-xs font-bold"><i data-lucide="search-x" class="mx-auto mb-2" size="24"></i>No games match your search filters.</div>`;
        } else {
            resultsList.innerHTML = filtered.map(g => `
                <div onclick="openGame('${g.UID}')" class="cursor-pointer group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                    <div class="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                        <img src="${getSafeImage(g.Image)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="handleImgError(this)">
                    </div>
                    <div class="p-2.5 flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-black text-slate-800 text-xs leading-tight line-clamp-2 mb-1">${g.Name}</h4>
                            ${getBggLinkHtml(g)}
                            <div class="flex items-center gap-1 text-indigo-600 font-black text-[9px] uppercase tracking-wider mb-1">
                                <i data-lucide="map-pin" size="10"></i> ${g.Location}
                            </div>
                            <div class="flex items-center gap-1 text-slate-500 font-bold text-[9px]">
                                <i data-lucide="users" size="10"></i> ${g.Players || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    currentPage = 1;
    renderList();
    if (window.lucide) window.lucide.createIcons();
}

export function renderList() {
    const list = document.getElementById('game-list');
    if (!list) return;

    const fName = (document.getElementById('filter-name')?.value || "").toLowerCase().trim();
    const fLoc = (document.getElementById('filter-loc')?.value || "").toLowerCase().trim();
    const fPlayers = (document.getElementById('filter-players')?.value || "").toLowerCase().trim();
    const fType = document.getElementById('filter-type')?.value || "All";
    const fPlay = document.getElementById('filter-play')?.value || "All";
    const fColl = document.getElementById('filter-coll')?.value || "All";
    const fPurch = document.getElementById('filter-purch')?.value || "All";
    const fChecked = document.getElementById('filter-checked')?.value || "All";

    const filtered = inventory.filter(g => {
        const matchName = String(g.Name).toLowerCase().includes(fName);
        let matchLoc = true;
        if (fLoc) {
            const itemLoc = String(g.Location).trim().toLowerCase();
            matchLoc = itemLoc.includes(fLoc);
        }
        const matchPlayers = String(g.Players).toLowerCase().includes(fPlayers);
        const matchType = fType === "All" || String(g.Type).toLowerCase() === fType.toLowerCase();
        const matchPlay = fPlay === "All" || String(g.Playstatus).toLowerCase() === fPlay.toLowerCase();
        const matchColl = fColl === "All" || String(g.Collectionstatus).toLowerCase() === fColl.toLowerCase();
        const matchPurch = fPurch === "All" || String(g.Purchasestatus).toLowerCase() === fPurch.toLowerCase();
        const matchChecked = fChecked === "All" || String(g.Checked).toLowerCase() === fChecked.toLowerCase();

        return matchName && matchLoc && matchPlayers && matchType && matchPlay && matchColl && matchPurch && matchChecked;
    });

    const sortVal = document.getElementById('sort-collection-select')?.value || 'alpha';
    filtered.sort((a, b) => {
        if (sortVal === 'alpha') {
            return a.Name.localeCompare(b.Name);
        } else if (sortVal === 'location') {
            return String(a.Location).localeCompare(String(b.Location), undefined, {numeric: true, sensitivity: 'base'});
        } else if (sortVal === 'newest') {
            const tA = a._raw.created_at ? new Date(a._raw.created_at).getTime() : 0;
            const tB = b._raw.created_at ? new Date(b._raw.created_at).getTime() : 0;
            return (isNaN(tB) ? 0 : tB) - (isNaN(tA) ? 0 : tA);
        }
        return 0;
    });

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedItems = filtered.slice(startIndex, endIndex);
    
    if (filtered.length === 0) {
        list.innerHTML = `<div class="col-span-full py-12 text-center text-slate-400 font-bold"><i data-lucide="search-x" class="mx-auto mb-3" size="32"></i>No games match your search filters.</div>`;
    } else {
        list.innerHTML = paginatedItems.map(g => `
            <div onclick="openGame('${g.UID}')" class="cursor-pointer group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col h-full">
                <div class="aspect-[4/5] overflow-hidden bg-slate-100 relative">
                    <img src="${getSafeImage(g.Image)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="handleImgError(this)">
                    <div class="absolute top-2 left-2 flex flex-col gap-1">
                        ${g.Collectionstatus === 'Keep' ? '<span class="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">KEEP</span>' : ''}
                        ${g.Collectionstatus === 'TBD' ? '<span class="bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm">TBD</span>' : ''}
                    </div>
                </div>
                <div class="p-3 flex-grow flex flex-col justify-between">
                    <div>
                        <h4 class="font-black text-slate-800 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">${g.Name}</h4>
                        ${getBggLinkHtml(g)}
                        <div class="flex items-center gap-1 text-indigo-600 font-black text-[9px] uppercase tracking-wider mb-1">
                            <i data-lucide="map-pin" size="10"></i> ${g.Location}
                        </div>
                        <div class="flex items-center gap-1 text-slate-500 font-bold text-[9px]">
                            <i data-lucide="users" size="10"></i> ${g.Players || 'N/A'}
                        </div>
                    </div>
                    <div class="mt-3 pt-2 border-t border-slate-50 flex justify-between items-center">
                        <span class="text-[10px] font-bold ${g.Playstatus === 'Played' ? 'text-emerald-600' : 'text-slate-400'}">
                            ${g.Playstatus === 'Played' ? '✓ PLAYED' : '○ NEW'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const pageInfo = document.getElementById('page-info');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (pageInfo) pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    if (btnPrev) btnPrev.disabled = (currentPage === 1);
    if (btnNext) btnNext.disabled = (currentPage === totalPages);
    
    if (window.lucide) window.lucide.createIcons();
}

export function changePage(direction) {
    currentPage += direction;
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

// BGG Autocomplete in Add Panel
export function handleBggKeydown(event, mode) {
    const resultsId = mode === 'add' ? 'bgg-results' : 'modal-bgg-results';
    const box = document.getElementById(resultsId);
    if (!box || box.classList.contains('hidden')) return;

    const items = Array.from(box.children);
    if (items.length === 0) return;

    if (event.key === 'ArrowDown') {
        event.preventDefault();
        keyboardSelectedIndex = (keyboardSelectedIndex + 1) % items.length;
        updateKeyboardSelection(items);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        keyboardSelectedIndex = (keyboardSelectedIndex - 1 + items.length) % items.length;
        updateKeyboardSelection(items);
    } else if (event.key === 'Enter') {
        event.preventDefault();
        if (keyboardSelectedIndex >= 0 && keyboardSelectedIndex < items.length) {
            items[keyboardSelectedIndex].click();
            keyboardSelectedIndex = -1;
        }
    }
}

export function updateKeyboardSelection(items) {
    items.forEach((item, idx) => {
        if (idx === keyboardSelectedIndex) {
            item.classList.add('keyboard-selected');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('keyboard-selected');
        }
    });
}

export async function bggSearch(query) {
    keyboardSelectedIndex = -1;
    const box = document.getElementById('bgg-results');
    if (query.trim().length < 2) {
        if (box) box.classList.add('hidden');
        return;
    }
    if (box) {
        box.innerHTML = `<div class="p-3 text-xs text-slate-500 font-bold italic flex items-center gap-2"><i data-lucide="loader" class="animate-spin" size="14"></i> Searching BGG...</div>`;
        box.classList.remove('hidden');
    }
    if (window.lucide) window.lucide.createIcons();

    clearTimeout(addSearchTimeout);
    const token = ++currentAddSearchToken; 

    addSearchTimeout = setTimeout(async () => {
        try {
            const text = await fetchBGG('search', { query: query.trim() });
            if (currentAddSearchToken !== token) return;
            const parsedItems = await parseBGGSearchXml(text, query);
            
            if (parsedItems.length === 0) {
                if (box) box.innerHTML = `<div class="p-3 text-xs text-slate-400 font-bold">No matches found.</div>`;
                return;
            }

            if (box) {
                box.innerHTML = parsedItems.map(i => `
                    <div onclick="selectBGGGame('${i.id}', '${i.name.replace(/'/g, "\\'")}')" class="bgg-dropdown-item p-3 hover:bg-indigo-50 cursor-pointer border-b text-sm font-bold text-slate-700">
                        ${i.name} <span class="text-slate-400 font-normal ml-1">${i.year ? `(${i.year})` : ''}</span>
                    </div>
                `).join('');
            }
        } catch (e) { 
            if (currentAddSearchToken !== token) return; 
            if (box) box.innerHTML = `<div class="p-3 text-[10px] text-slate-400 font-bold bg-slate-50 rounded leading-tight border">No immediate matches found. Try typing more.</div>`;
        }
    }, 500); 
}

export async function selectBGGGame(id, name) {
    if (document.getElementById('in-name')) document.getElementById('in-name').value = name;
    if (document.getElementById('in-bggid')) document.getElementById('in-bggid').value = id;
    if (document.getElementById('bgg-results')) document.getElementById('bgg-results').classList.add('hidden');
    
    try {
        const imageUrl = await fetchBGGThingImage(id);
        if (document.getElementById('in-img')) document.getElementById('in-img').value = imageUrl || "";
    } catch (e) {
        console.error("Could not fetch image");
    }
}

export async function saveGame() {
    const game = {
        "Name": document.getElementById('in-name').value,
        "Location": document.getElementById('in-loc').value,
        "Type": document.getElementById('in-type').value,
        "Playstatus": document.getElementById('in-play').value,
        "Collectionstatus": document.getElementById('in-coll').value,
        "Purchasestatus": document.getElementById('in-purch').value,
        "Checked": document.getElementById('in-checked').value,
        "Players": document.getElementById('in-players').value,
        "BGG ID": document.getElementById('in-bggid').value || null,
        "Image": document.getElementById('in-img').value || "",
        "created_at": new Date().toISOString()
    };
    if (document.getElementById('in-play').value === 'Played') {
        game.played_at = new Date().toISOString();
    }

    if (!game.Name || !game.Location) return alert("Name and Location are mandatory!");
    
    const { error } = await supabase.from('collection_dev').insert([game]);
    if (error) {
        alert("Error: " + error.message);
    } else {
        document.getElementById('add-panel').classList.add('hidden');
        document.getElementById('in-name').value = '';
        document.getElementById('in-loc').value = '';
        document.getElementById('in-img').value = '';
        document.getElementById('in-bggid').value = '';
        document.getElementById('in-players').value = '';
        loadData();
    }
}
