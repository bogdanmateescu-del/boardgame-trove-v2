// Books Randomizer Module
import { getBooksInventory } from './booksCollection.js';
import { getSafeImage } from '../../utils/helpers.js';

export function rollBook(person) {
    const booksInventory = getBooksInventory();
    let pool = booksInventory.filter(b => {
        const status = (person === 'L' ? b.ReadStatusL : b.ReadStatusB) || "";
        return String(status).toLowerCase() === 'unread';
    });

    if (pool.length === 0) {
        return alert(`No unread books found for ${person === 'L' ? 'Lore' : 'Bogdan'}!`);
    }

    const pick = pool[Math.floor(Math.random() * pool.length)];

    const resBox = document.getElementById('book-roll-res');
    if (resBox) resBox.classList.remove('hidden');
    
    if (document.getElementById('book-roll-target')) document.getElementById('book-roll-target').innerText = `TREASURE FOUND FOR ${person === 'L' ? 'LORE' : 'BOGDAN'}:`;
    if (document.getElementById('book-roll-title')) document.getElementById('book-roll-title').innerText = pick.Title;
    if (document.getElementById('book-roll-author')) document.getElementById('book-roll-author').innerText = "by " + pick.Author;
    if (document.getElementById('book-roll-loc')) document.getElementById('book-roll-loc').innerText = "LOCATION: " + pick.Location;
    if (document.getElementById('book-roll-format')) document.getElementById('book-roll-format').innerText = String(pick.Format).toUpperCase();
    if (document.getElementById('book-roll-img')) document.getElementById('book-roll-img').src = getSafeImage(pick.Image);

    if (resBox) resBox.scrollIntoView({ behavior: 'smooth' });
}
