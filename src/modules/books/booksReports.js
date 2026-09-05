// Books Reports Module
import { getBooksInventory } from './booksCollection.js';

export function updateBookReports() {
    const booksInventory = getBooksInventory();
    const total = booksInventory.length;
    const bRead = booksInventory.filter(b => String(b.ReadStatusB).toLowerCase() === 'read').length;
    const bUnread = booksInventory.filter(b => String(b.ReadStatusB).toLowerCase() === 'unread').length;
    const lRead = booksInventory.filter(b => String(b.ReadStatusL).toLowerCase() === 'read').length;
    const lUnread = booksInventory.filter(b => String(b.ReadStatusL).toLowerCase() === 'unread').length;

    if (document.getElementById('rep-book-total')) document.getElementById('rep-book-total').innerText = total;
    if (document.getElementById('rep-book-b-read')) document.getElementById('rep-book-b-read').innerText = bRead;
    if (document.getElementById('rep-book-b-unread')) document.getElementById('rep-book-b-unread').innerText = bUnread;
    if (document.getElementById('rep-book-l-read')) document.getElementById('rep-book-l-read').innerText = lRead;
    if (document.getElementById('rep-book-l-unread')) document.getElementById('rep-book-l-unread').innerText = lUnread;
}
