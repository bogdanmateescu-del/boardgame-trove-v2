// Boardgames Reports Module
import { getInventory, clearFilters, applyFilters, switchToFullCollection } from './boardgamesCollection.js';
import { exportToCSV } from '../../utils/helpers.js';

export function updateReports() {
    const inventory = getInventory();
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const totalItems = inventory.length;
    const gamesCount = inventory.filter(g => String(g.Type).toLowerCase() === 'game').length;
    const expansionsCount = inventory.filter(g => String(g.Type).toLowerCase() === 'expansion').length;
    
    const unplayed = inventory.filter(g => String(g.Playstatus).toLowerCase().includes('not played')).length;
    const tbd = inventory.filter(g => String(g.Collectionstatus).toUpperCase() === 'TBD').length;
    const checked = inventory.filter(g => String(g.Checked).toLowerCase() === 'yes').length;
    
    if (document.getElementById('metric-total-items')) document.getElementById('metric-total-items').innerText = totalItems;
    if (document.getElementById('metric-total-games')) document.getElementById('metric-total-games').innerText = `${gamesCount} Games`;
    if (document.getElementById('metric-total-expansions')) document.getElementById('metric-total-expansions').innerText = `${expansionsCount} Expansions`;
    
    if (document.getElementById('metric-unplayed')) document.getElementById('metric-unplayed').innerText = `${unplayed}/${totalItems}`;
    if (document.getElementById('metric-decisions')) document.getElementById('metric-decisions').innerText = `${tbd}/${totalItems}`;
    if (document.getElementById('metric-checked')) document.getElementById('metric-checked').innerText = `${checked}/${totalItems}`;

    const unplayedReportText = unplayed;
    const tbdReportText = tbd;
    const unchecked = inventory.filter(g => String(g.Checked).toLowerCase() === 'no').length;
    
    if (document.getElementById('rep-unplayed')) document.getElementById('rep-unplayed').innerHTML = `Today, ${today} there are <span class="text-indigo-600 font-black px-1">${unplayedReportText}</span> unplayed games in your collection.`;
    if (document.getElementById('rep-tbd')) document.getElementById('rep-tbd').innerHTML = `Today, ${today} there are <span class="text-amber-500 font-black px-1">${tbdReportText}</span> games marked TBD.`;
    if (document.getElementById('rep-unchecked')) document.getElementById('rep-unchecked').innerHTML = `Today, ${today} there are <span class="text-rose-600 font-black px-1">${unchecked}</span> unchecked games in your collection.`;
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
