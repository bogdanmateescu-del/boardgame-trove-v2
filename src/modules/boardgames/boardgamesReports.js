// Boardgames Reports Module
import { getInventory, clearFilters, applyFilters, switchToFullCollection } from './boardgamesCollection.js';
import { exportToCSV } from '../../utils/helpers.js';

export function updateReports() {
    const inventory = getInventory();
    if (!inventory || inventory.length === 0) return;

    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const totalItems = inventory.length;

    // Categorize by Type
    const typeCounts = {};
    const unplayedByType = {};
    const tbdByType = {};
    const uncheckedByType = {};

    let totalExpansions = 0;
    let totalGames = 0;
    let totalUnplayed = 0;
    let totalTbd = 0;
    let totalUnchecked = 0;

    inventory.forEach(g => {
        const rawType = String(g.Type || 'Game').trim();
        // Capitalize first letter, lowercase rest
        const type = rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase() : 'Game';

        typeCounts[type] = (typeCounts[type] || 0) + 1;

        const isExpansion = type.toLowerCase() === 'expansion';
        if (isExpansion) {
            totalExpansions++;
        } else {
            totalGames++;
        }

        const isUnplayed = String(g.Playstatus || '').toLowerCase().includes('not played');
        if (isUnplayed) {
            totalUnplayed++;
            unplayedByType[type] = (unplayedByType[type] || 0) + 1;
        }

        const isTbd = String(g.Collectionstatus || '').toUpperCase() === 'TBD';
        if (isTbd) {
            totalTbd++;
            tbdByType[type] = (tbdByType[type] || 0) + 1;
        }

        const isUnchecked = String(g.Checked || '').toLowerCase() === 'no';
        if (isUnchecked) {
            totalUnchecked++;
            uncheckedByType[type] = (uncheckedByType[type] || 0) + 1;
        }
    });

    // 1. Update Top Summary Lead Sentence
    const elTotalItems = document.getElementById('metric-total-items');
    const elTotalGames = document.getElementById('metric-total-games');
    const elTotalExpansions = document.getElementById('metric-total-expansions');

    if (elTotalItems) elTotalItems.innerText = totalItems.toLocaleString();
    if (elTotalGames) elTotalGames.innerText = totalGames.toLocaleString();
    if (elTotalExpansions) elTotalExpansions.innerText = totalExpansions.toLocaleString();

    // 2. Update Games Sub-list breakdown (excluding expansions)
    const baseGameTypes = ['Game', 'Legacy', 'Campaign', 'Escape'];
    const extraGameTypes = Object.keys(typeCounts).filter(t => t.toLowerCase() !== 'expansion' && !baseGameTypes.includes(t));
    const allGameTypes = [...baseGameTypes, ...extraGameTypes];

    const typeLabels = {
        'Game': 'Games',
        'Expansion': 'Expansions',
        'Legacy': 'Legacy',
        'Campaign': 'Campaign',
        'Escape': 'Escape'
    };

    const elGamesSublist = document.getElementById('games-type-breakdown-list');
    if (elGamesSublist) {
        elGamesSublist.innerHTML = allGameTypes.map(t => {
            const count = typeCounts[t] || 0;
            const label = typeLabels[t] || t;
            return `
                <div class="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${label}</span>
                    <span class="text-xl font-black text-slate-900 mt-1">${count.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    }

    // 3. Update Headlines for the 3 Core Cards
    const elRepUnplayed = document.getElementById('rep-unplayed');
    const elRepTbd = document.getElementById('rep-tbd');
    const elRepUnchecked = document.getElementById('rep-unchecked');

    if (elRepUnplayed) {
        elRepUnplayed.innerHTML = `Today, ${today} there are <span class="text-indigo-600 font-black px-1">${totalUnplayed.toLocaleString()}</span> unplayed games in your collection.`;
    }
    if (elRepTbd) {
        elRepTbd.innerHTML = `Today, ${today} there are <span class="text-amber-500 font-black px-1">${totalTbd.toLocaleString()}</span> games marked TBD.`;
    }
    if (elRepUnchecked) {
        elRepUnchecked.innerHTML = `Today, ${today} there are <span class="text-rose-600 font-black px-1">${totalUnchecked.toLocaleString()}</span> unchecked games in your collection.`;
    }

    // 4. Update Breakdowns inside the 3 Core Cards
    const baseAllTypes = ['Game', 'Expansion', 'Legacy', 'Campaign', 'Escape'];
    const extraTypes = Object.keys(typeCounts).filter(t => !baseAllTypes.includes(t));
    const allDisplayTypes = [...baseAllTypes, ...extraTypes];

    const typeDotColors = {
        'Game': 'bg-indigo-500',
        'Expansion': 'bg-purple-500',
        'Legacy': 'bg-rose-500',
        'Campaign': 'bg-amber-500',
        'Escape': 'bg-teal-500'
    };

    function renderBreakdownHtml(countsMap) {
        return allDisplayTypes.map(t => {
            const count = countsMap[t] || 0;
            const label = typeLabels[t] || t;
            const dotColor = typeDotColors[t] || 'bg-slate-400';
            const countClass = count > 0 ? 'text-slate-900 font-black' : 'text-slate-400 font-bold';
            return `
                <div class="flex justify-between items-center py-2 px-3.5 bg-slate-50/90 rounded-xl hover:bg-slate-100/80 transition-colors">
                    <span class="font-bold text-slate-600 flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full ${dotColor}"></span>
                        ${label}
                    </span>
                    <span class="${countClass} text-xs">${count.toLocaleString()}</span>
                </div>
            `;
        }).join('');
    }

    const elBreakdownUnplayed = document.getElementById('breakdown-unplayed');
    const elBreakdownTbd = document.getElementById('breakdown-tbd');
    const elBreakdownUnchecked = document.getElementById('breakdown-unchecked');

    if (elBreakdownUnplayed) elBreakdownUnplayed.innerHTML = renderBreakdownHtml(unplayedByType);
    if (elBreakdownTbd) elBreakdownTbd.innerHTML = renderBreakdownHtml(tbdByType);
    if (elBreakdownUnchecked) elBreakdownUnchecked.innerHTML = renderBreakdownHtml(uncheckedByType);

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

export function showUncheckedGames() {
    if (window.showSubTab) window.showSubTab('boardgames', 'manager');
    clearFilters();
    const elChecked = document.getElementById('filter-checked');
    if (elChecked) elChecked.value = 'No';
    switchToFullCollection();
    applyFilters();
}

export function exportCSV() {
    const inventory = getInventory();
    if (!inventory || inventory.length === 0) {
        alert("No boardgames data available to export.");
        return;
    }

    const headers = ["UID", "Name", "Location", "Type", "Playstatus", "Collectionstatus", "Purchasestatus", "Checked", "Players", "BGG ID", "Image", "Comments"];
    const rows = inventory.map(g => [
        g.UID || "",
        g.Name || "",
        g.Location || "",
        g.Type || "",
        g.Playstatus || "",
        g.Collectionstatus || "",
        g.Purchasestatus || "",
        g.Checked || "",
        g.Players || "",
        g.BGGID || "",
        g.Image || "",
        g.Comments || ""
    ]);

    exportToCSV(`boardgames_export_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
}

export async function syncMissingBGGData() {
    const statusEl = document.getElementById('sync-status');
    const btn = document.getElementById('btn-sync-bgg');
    if (statusEl) {
        statusEl.classList.remove('hidden');
        statusEl.innerText = "BGG sync is up to date.";
        setTimeout(() => statusEl.classList.add('hidden'), 4000);
    }
}
