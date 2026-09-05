// Delete Confirmation Modal Controller
import { supabase } from '../../services/supabaseClient.js';
import { currentGame, closeGame } from './gameModal.js';
import { currentBook, closeBook } from './bookModal.js';
import { loadData } from '../boardgames/boardgamesCollection.js';
import { loadBooksData } from '../books/booksCollection.js';

export let deleteTarget = 'game'; 

export function setDeleteTarget(target) {
    deleteTarget = target;
}

export function confirmDelete() {
    deleteTarget = 'game';
    const titleEl = document.getElementById('delete-modal-title');
    if (titleEl) titleEl.innerText = "Delete Game?";
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.remove('hidden');
}

export function confirmDeleteBook() {
    deleteTarget = 'book';
    const titleEl = document.getElementById('delete-modal-title');
    if (titleEl) titleEl.innerText = "Delete Book?";
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.remove('hidden');
}

export function cancelDelete() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('hidden');
}

export async function executeDelete() {
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('hidden');

    if (deleteTarget === 'game' && currentGame) {
        const raw = currentGame._raw;
        const pkCol = ('id' in raw) ? 'id' : ('uid' in raw ? 'uid' : 'UID');
        const { error } = await supabase.from('collection_dev').delete().eq(pkCol, currentGame.UID);
        
        if (error) {
            alert("Error deleting game: " + error.message);
        } else {
            closeGame();
            loadData();
        }
    } else if (deleteTarget === 'book' && currentBook) {
        const raw = currentBook._raw || {};
        const pkCol = ('id' in raw) ? 'id' : ('uid' in raw ? 'uid' : 'UID');
        const { error } = await supabase.from('books_dev').delete().eq(pkCol, currentBook.UID);
        
        if (error) {
            alert("Error deleting book: " + error.message);
        } else {
            closeBook();
            loadBooksData();
        }
    }
}
