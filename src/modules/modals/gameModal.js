// Game Details & Edit Modal Controller
import { supabase } from '../../services/supabaseClient.js';
import { fetchBGG, parseBGGSearchXml, fetchBGGThingImage } from '../../services/bggService.js';
import { getSafeImage, handleImgError } from '../../utils/helpers.js';
import { getInventory, loadData } from '../boardgames/boardgamesCollection.js';
import { setDeleteTarget } from './deleteModal.js';

export let currentGame = null;
export let originalGameData = {};
export let modalTempBGGID = null;
export let modalTempImage = null;

let editSearchTimeout = null;
let currentEditSearchToken = 0;

export function openGame(uid) {
    if (!uid) return;
    const inventory = getInventory();
    currentGame = inventory.find(g => String(g.UID) === String(uid));
    if (!currentGame) return;
    
    setDeleteTarget('game');
    modalTempBGGID = currentGame.BGGID;
    modalTempImage = currentGame.Image;

    const elName = document.getElementById('modal-name');
    const elLoc = document.getElementById('modal-loc');
    const elType = document.getElementById('modal-type');
    const elPlay = document.getElementById('modal-play');
    const elColl = document.getElementById('modal-coll');
    const elPurch = document.getElementById('modal-purch');
    const elChecked = document.getElementById('modal-checked');
    const elPlayers = document.getElementById('modal-players');
    const elComments = document.getElementById('modal-comments');
    const elImg = document.getElementById('modal-img-display');

    if (elName) elName.value = currentGame.Name;
    if (elLoc) elLoc.value = currentGame.Location;
    if (elType) elType.value = currentGame.Type;
    if (elPlay) elPlay.value = currentGame.Playstatus;
    if (elColl) elColl.value = currentGame.Collectionstatus;
    if (elPurch) elPurch.value = currentGame.Purchasestatus;
    if (elChecked) elChecked.value = currentGame.Checked;
    if (elPlayers) elPlayers.value = currentGame.Players;
    if (elComments) elComments.value = currentGame.Comments;
    if (elImg) elImg.src = getSafeImage(currentGame.Image);
    
    const elBggLink = document.getElementById('modal-bgg-link');
    const elBggText = document.getElementById('modal-bgg-link-text');
    if (elBggLink) {
        const hasBggId = currentGame.BGGID && String(currentGame.BGGID).trim() !== '' && String(currentGame.BGGID) !== '0';
        elBggLink.href = hasBggId
            ? `https://boardgamegeek.com/boardgame/${currentGame.BGGID}`
            : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(currentGame.Name)}`;
        if (elBggText) {
            elBggText.innerText = hasBggId ? "BGG Link" : "Search on BGG";
        }
    }
    
    originalGameData = { ...currentGame };

    toggleEditMode(false);
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
}

export function closeGame() {
    const modal = document.getElementById('game-modal');
    if (modal) modal.classList.add('hidden');
    const results = document.getElementById('modal-bgg-results');
    if (results) results.classList.add('hidden');
    currentGame = null;
}

export function toggleEditMode(isEditing) {
    const inputs = ['modal-name', 'modal-loc', 'modal-type', 'modal-play', 'modal-coll', 'modal-purch', 'modal-checked', 'modal-players', 'modal-comments'];
    if (!isEditing && currentGame) {
        modalTempBGGID = originalGameData.BGGID;
        modalTempImage = originalGameData.Image;
        const imgDisplay = document.getElementById('modal-img-display');
        if (imgDisplay) imgDisplay.src = getSafeImage(modalTempImage);
        const results = document.getElementById('modal-bgg-results');
        if (results) results.classList.add('hidden');

        const elBggLink = document.getElementById('modal-bgg-link');
        const elBggText = document.getElementById('modal-bgg-link-text');
        if (elBggLink) {
            const hasBggId = originalGameData.BGGID && String(originalGameData.BGGID).trim() !== '' && String(originalGameData.BGGID) !== '0';
            elBggLink.href = hasBggId
                ? `https://boardgamegeek.com/boardgame/${originalGameData.BGGID}`
                : `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(originalGameData.Name || '')}`;
            if (elBggText) elBggText.innerText = hasBggId ? "BGG Link" : "Search on BGG";
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
        document.getElementById('modal-btn-edit')?.classList.add('hidden');
        document.getElementById('modal-btn-delete')?.classList.add('hidden');
        document.getElementById('modal-btn-save')?.classList.remove('hidden');
        document.getElementById('modal-btn-cancel')?.classList.remove('hidden');
        checkChanges();
    } else {
        document.getElementById('modal-btn-edit')?.classList.remove('hidden');
        document.getElementById('modal-btn-delete')?.classList.remove('hidden');
        document.getElementById('modal-btn-save')?.classList.add('hidden');
        document.getElementById('modal-btn-cancel')?.classList.add('hidden');
    }
}

export function checkChanges() {
    if (!currentGame) return;
    const currentData = {
        Name: document.getElementById('modal-name')?.value,
        Location: document.getElementById('modal-loc')?.value,
        Type: document.getElementById('modal-type')?.value,
        Playstatus: document.getElementById('modal-play')?.value,
        Collectionstatus: document.getElementById('modal-coll')?.value,
        Purchasestatus: document.getElementById('modal-purch')?.value,
        Checked: document.getElementById('modal-checked')?.value,
        Players: document.getElementById('modal-players')?.value,
        Comments: document.getElementById('modal-comments')?.value
    };

    let isChanged = false;
    for (let key in currentData) {
        if (originalGameData[key] !== currentData[key]) {
            isChanged = true;
            break;
        }
    }

    const saveBtn = document.getElementById('modal-btn-save');
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

export async function saveEdit() {
    if (!currentGame) return;
    const saveBtn = document.getElementById('modal-btn-save');
    if (saveBtn) {
        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;
    }
    
    const raw = currentGame._raw;
    const payload = {};
    const assignSafe = (keys, val) => {
        for (let k of keys) { if (k in raw) { payload[k] = val; return; } }
        payload[keys[0]] = val; 
    };

    assignSafe(['Name', 'name'], document.getElementById('modal-name')?.value);
    assignSafe(['Location', 'location'], document.getElementById('modal-loc')?.value);
    assignSafe(['Type', 'type'], document.getElementById('modal-type')?.value);
    assignSafe(['Playstatus', 'playstatus'], document.getElementById('modal-play')?.value);
    assignSafe(['Collectionstatus', 'collectionstatus'], document.getElementById('modal-coll')?.value);
    assignSafe(['Purchasestatus', 'purchasestatus'], document.getElementById('modal-purch')?.value);
    assignSafe(['Checked', 'checked'], document.getElementById('modal-checked')?.value);
    assignSafe(['Players', 'players'], document.getElementById('modal-players')?.value);
    assignSafe(['Comments', 'comments'], document.getElementById('modal-comments')?.value);
    assignSafe(['BGG ID', 'bgg_id', 'BGGID'], modalTempBGGID);
    assignSafe(['Image', 'image'], modalTempImage);

    if (payload.Playstatus === 'Played' && originalGameData.Playstatus !== 'Played') {
        payload.played_at = new Date().toISOString();
    }

    const pkCol = ('id' in raw) ? 'id' : ('uid' in raw ? 'uid' : 'UID');
    const { error } = await supabase.from('collection_dev').update(payload).eq(pkCol, currentGame.UID);
    
    if (error) {
        alert("Database Error: " + error.message);
        if (saveBtn) {
            saveBtn.innerText = "Save Changes";
            saveBtn.disabled = false;
        }
    } else {
        loadData();
        closeGame();
        if (saveBtn) {
            saveBtn.innerText = "Save Changes";
        }
    }
}

export async function modalBggSearch(query) {
    const box = document.getElementById('modal-bgg-results');
    if (query.trim().length < 2) {
        if (box) box.classList.add('hidden');
        return;
    }
    if (box) {
        box.innerHTML = `<div class="p-3 text-xs text-slate-500 font-bold italic flex items-center gap-2"><i data-lucide="loader" class="animate-spin" size="14"></i> Searching BGG...</div>`;
        box.classList.remove('hidden');
    }
    if (window.lucide) window.lucide.createIcons();

    clearTimeout(editSearchTimeout);
    const token = ++currentEditSearchToken; 

    editSearchTimeout = setTimeout(async () => {
        try {
            const text = await fetchBGG('search', { query: query.trim() });
            if (currentEditSearchToken !== token) return; 
            const parsedItems = await parseBGGSearchXml(text, query);
            
            if (parsedItems.length === 0) {
                if (box) box.innerHTML = `<div class="p-3 text-xs text-slate-400 font-bold">No matches found.</div>`;
                return;
            }

            if (box) {
                box.innerHTML = parsedItems.map(i => `
                    <div onclick="selectModalBGGGame('${i.id}', '${i.name.replace(/'/g, "\\'")}')" class="bgg-dropdown-item p-3 hover:bg-indigo-50 cursor-pointer border-b text-sm font-bold text-slate-700">
                        ${i.name} <span class="text-slate-400 font-normal ml-1">${i.year ? `(${i.year})` : ''}</span>
                    </div>
                `).join('');
            }
        } catch (e) { 
            if (currentEditSearchToken !== token) return; 
            if (box) box.innerHTML = `<div class="p-3 text-[10px] text-slate-400 font-bold bg-slate-50 rounded leading-tight border">No immediate matches found. Try typing more.</div>`;
        }
    }, 500); 
}

export async function selectModalBGGGame(id, name) {
    if (document.getElementById('modal-name')) document.getElementById('modal-name').value = name;
    modalTempBGGID = id; 
    if (document.getElementById('modal-bgg-results')) document.getElementById('modal-bgg-results').classList.add('hidden');
    if (document.getElementById('modal-img-display')) document.getElementById('modal-img-display').src = getSafeImage(null);
    
    try {
        const imageUrl = await fetchBGGThingImage(id);
        modalTempImage = imageUrl; 
        if (document.getElementById('modal-img-display')) document.getElementById('modal-img-display').src = getSafeImage(imageUrl);
    } catch(e) {
        if (document.getElementById('modal-img-display')) document.getElementById('modal-img-display').src = getSafeImage(null);
    }

    const elBggLink = document.getElementById('modal-bgg-link');
    const elBggText = document.getElementById('modal-bgg-link-text');
    if (elBggLink) {
        elBggLink.href = `https://boardgamegeek.com/boardgame/${id}`;
        if (elBggText) elBggText.innerText = "BGG Link";
    }

    checkChanges(); 
}
