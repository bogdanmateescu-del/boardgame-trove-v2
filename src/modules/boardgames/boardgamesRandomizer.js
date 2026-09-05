// Boardgames Randomizer Module
import { getInventory } from './boardgamesCollection.js';
import { getSafeImage } from '../../utils/helpers.js';

export function roll(mode) {
    const inventory = getInventory();
    let pool = inventory;
    if (mode === 'unplayed') pool = inventory.filter(g => String(g.Playstatus).toLowerCase().includes('not played'));
    if (mode === 'tbd') pool = inventory.filter(g => String(g.Collectionstatus).toUpperCase() === 'TBD');
    
    if (pool.length === 0) return alert("No games found in this category!");

    const pick = pool[Math.floor(Math.random() * pool.length)];

    const res = document.getElementById('roll-res');
    if (res) res.classList.remove('hidden');
    if (document.getElementById('roll-name')) document.getElementById('roll-name').innerText = String(pick.Name);
    if (document.getElementById('roll-loc')) document.getElementById('roll-loc').innerText = "LOCATION: " + String(pick.Location);
    if (document.getElementById('roll-play')) document.getElementById('roll-play').innerText = String(pick.Playstatus).toUpperCase();
    if (document.getElementById('roll-img')) document.getElementById('roll-img').src = getSafeImage(pick.Image);
    if (res) res.scrollIntoView({ behavior: 'smooth' });
}
