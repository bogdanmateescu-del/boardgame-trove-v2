// Boardgames Randomizer Module
import { getInventory } from './boardgamesCollection.js';
import { getSafeImage } from '../../utils/helpers.js';

export function roll(mode) {
    const inventory = getInventory();

    // Filter out Expansions and games stored at location Z0 (case-insensitive)
    let pool = inventory.filter(g => {
        const type = String(g.Type || '').trim().toLowerCase();
        const loc = String(g.Location || '').trim().toUpperCase();

        const isExpansion = type === 'expansion';
        const isZ0 = loc === 'Z0';

        return !isExpansion && !isZ0;
    });

    // Apply mode-specific filters
    if (mode === 'unplayed') {
        pool = pool.filter(g => String(g.Playstatus || '').toLowerCase().includes('not played'));
    } else if (mode === 'tbd') {
        pool = pool.filter(g => String(g.Collectionstatus || '').toUpperCase() === 'TBD');
    }
    
    if (pool.length === 0) {
        return alert("No eligible games found in this category (excluding Expansions and Z0 location)!");
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];

    const res = document.getElementById('roll-res');
    if (res) res.classList.remove('hidden');
    if (document.getElementById('roll-name')) document.getElementById('roll-name').innerText = String(pick.Name);
    if (document.getElementById('roll-loc')) document.getElementById('roll-loc').innerText = "LOCATION: " + String(pick.Location);
    if (document.getElementById('roll-play')) document.getElementById('roll-play').innerText = String(pick.Playstatus).toUpperCase();
    if (document.getElementById('roll-img')) document.getElementById('roll-img').src = getSafeImage(pick.Image);
    if (res) res.scrollIntoView({ behavior: 'smooth' });
}
