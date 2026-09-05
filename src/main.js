// Main Application Entrypoint
import './styles/main.css';

// Import Views
import { authViewHtml } from './modules/auth/authView.js';
import { boardgamesViewHtml } from './modules/boardgames/boardgamesView.js';
import { booksViewHtml } from './modules/books/booksView.js';
import { comicsViewHtml } from './modules/comics/comicsView.js';
import { modalsViewHtml } from './modules/modals/modalsView.js';

// Import Auth Service
import { signInWithEmail, signOutUser, getCurrentSession, onAuthChange } from './modules/auth/authService.js';

// Import Boardgames Functions
import {
    loadData,
    toggleCollectionViewGroup,
    switchToFullCollection,
    switchToDashboard,
    toggleAdvancedFilters,
    renderDashboard,
    renderList,
    changePage,
    clearFilters,
    applyFilters,
    handleBggKeydown,
    bggSearch,
    selectBGGGame,
    saveGame
} from './modules/boardgames/boardgamesCollection.js';
import { roll } from './modules/boardgames/boardgamesRandomizer.js';
import { updateReports, showUncheckedGames, exportCSV, syncMissingBGGData } from './modules/boardgames/boardgamesReports.js';

// Import Books Functions
import {
    loadBooksData,
    renderBooksList,
    changeBookPage,
    applyBookFilters,
    clearBookFilters,
    toggleAdvancedBookFilters,
    toggleSeriesInput,
    startCameraScanner,
    stopCameraScanner,
    updateCoverPreview,
    openGoogleImageSearch,
    searchBookByTitle,
    selectHardcoverBookEdition,
    searchBookByISBN,
    saveBook
} from './modules/books/booksCollection.js';
import { rollBook } from './modules/books/booksRandomizer.js';
import { updateBookReports } from './modules/books/booksReports.js';

// Import Modals Functions
import {
    openGame,
    closeGame,
    toggleEditMode,
    checkChanges,
    saveEdit,
    modalBggSearch,
    selectModalBGGGame
} from './modules/modals/gameModal.js';
import {
    openBook,
    closeBook,
    toggleModalSeriesInput,
    toggleBookEditMode,
    checkBookChanges,
    saveBookEdit
} from './modules/modals/bookModal.js';
import {
    confirmDelete,
    confirmDeleteBook,
    cancelDelete,
    executeDelete
} from './modules/modals/deleteModal.js';

// Import Helpers
import { handleImgError, getSafeImage, getProp, exportToCSV } from './utils/helpers.js';

// 1. Mount Views to DOM
function mountApp() {
    const authRoot = document.getElementById('auth-root');
    if (authRoot) {
        authRoot.innerHTML = authViewHtml;
    }

    const categoriesRoot = document.getElementById('categories-root');
    if (categoriesRoot) {
        categoriesRoot.innerHTML = boardgamesViewHtml + booksViewHtml + comicsViewHtml;
    }

    const modalsRoot = document.getElementById('modals-root');
    if (modalsRoot) {
        modalsRoot.innerHTML = modalsViewHtml;
    }
}

// 2. Navigation Controllers
export function switchCategory(category) {
    ['boardgames', 'books', 'comics'].forEach(cat => {
        const el = document.getElementById(`category-${cat}`);
        const nav = document.getElementById(`cat-nav-${cat}`);
        if (!el || !nav) return;

        if (cat === category) {
            el.classList.remove('hidden');
            nav.className = "flex-1 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-200 bg-indigo-600 text-white shadow-md";
        } else {
            el.classList.add('hidden');
            nav.className = "flex-1 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 text-slate-400 hover:text-slate-200";
        }
    });

    if (category === 'books') {
        renderBooksList();
        updateBookReports();
    } else if (category === 'boardgames') {
        renderDashboard();
        renderList();
        updateReports();
    }

    if (window.lucide) window.lucide.createIcons();
}

export function showSubTab(category, tab) {
    let prefix = category === 'boardgames' ? 'bg' : category;
    ['manager', 'randomizer', 'reports'].forEach(t => {
        const content = document.getElementById(`${prefix}-tab-${t}`);
        const btn = document.getElementById(`${prefix}-btn-${t}`);
        if (!content || !btn) return;

        if (t === tab) {
            content.classList.remove('hidden');
            btn.className = "flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 bg-white text-indigo-600 shadow-sm";
        } else {
            content.classList.add('hidden');
            btn.className = "flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800";
        }
    });

    if (category === 'books') {
        if (tab === 'manager') renderBooksList();
        if (tab === 'reports') updateBookReports();
    } else if (category === 'boardgames') {
        if (tab === 'manager') renderDashboard();
        if (tab === 'reports') updateReports();
    }

    if (window.lucide) window.lucide.createIcons();
}

export function showTab(tab) {
    showSubTab('boardgames', tab);
}

// 3. Attach everything to window for 100% backward-compatible event triggers
Object.assign(window, {
    // Navigation
    switchCategory,
    showSubTab,
    showTab,
    toggleCollectionViewGroup,
    switchToFullCollection,
    switchToDashboard,
    toggleAdvancedFilters,
    toggleAdvancedBookFilters,
    toggleSeriesInput,

    // Boardgames
    loadData,
    renderDashboard,
    renderList,
    changePage,
    clearFilters,
    applyFilters,
    handleBggKeydown,
    bggSearch,
    selectBGGGame,
    saveGame,
    roll,
    updateReports,
    showUncheckedGames,
    exportCSV,
    syncMissingBGGData,

    // Books
    loadBooksData,
    renderBooksList,
    changeBookPage,
    applyBookFilters,
    clearBookFilters,
    startCameraScanner,
    stopCameraScanner,
    updateCoverPreview,
    openGoogleImageSearch,
    searchBookByTitle,
    selectHardcoverBookEdition,
    searchBookByISBN,
    saveBook,
    rollBook,
    updateBookReports,

    // Modals
    openGame,
    closeGame,
    toggleEditMode,
    checkChanges,
    saveEdit,
    modalBggSearch,
    selectModalBGGGame,
    openBook,
    closeBook,
    toggleModalSeriesInput,
    toggleBookEditMode,
    checkBookChanges,
    saveBookEdit,
    confirmDelete,
    confirmDeleteBook,
    cancelDelete,
    executeDelete,

    // Auth
    handleSignIn,
    handleSignOut,

    // Helpers
    handleImgError,
    getSafeImage,
    getProp,
    exportToCSV
});

// 4. Auth State & Lifecycle
let dataLoaded = false;

export function setAuthState(session) {
    const authRoot = document.getElementById('auth-root');
    const appShell = document.getElementById('app-shell');
    const emailDisplay = document.getElementById('user-email-display');

    if (session && session.user) {
        if (authRoot) authRoot.classList.add('hidden');
        if (appShell) appShell.classList.remove('hidden');
        if (emailDisplay) emailDisplay.innerText = session.user.email || "Authenticated";

        if (!dataLoaded) {
            dataLoaded = true;
            switchCategory('boardgames');
            showSubTab('boardgames', 'manager');
            loadData();
            loadBooksData();
        }
    } else {
        if (authRoot) authRoot.classList.remove('hidden');
        if (appShell) appShell.classList.add('hidden');
        if (emailDisplay) emailDisplay.innerText = "";
        dataLoaded = false;
    }

    if (window.lucide) window.lucide.createIcons();
}

export async function handleSignIn() {
    const emailInput = document.getElementById('auth-email');
    const passwordInput = document.getElementById('auth-password');
    const errorBox = document.getElementById('auth-error-box');
    const errorMsg = document.getElementById('auth-error-msg');
    const btnText = document.getElementById('btn-auth-text');
    const btnSubmit = document.getElementById('btn-auth-submit');

    if (!emailInput || !passwordInput) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        if (errorBox && errorMsg) {
            errorBox.classList.remove('hidden');
            errorMsg.innerText = "Please enter both email and password.";
        }
        if (window.lucide) window.lucide.createIcons();
        return;
    }

    try {
        if (errorBox) errorBox.classList.add('hidden');
        if (btnText) btnText.innerText = "Signing in...";
        if (btnSubmit) btnSubmit.disabled = true;

        const data = await signInWithEmail(email, password);
        setAuthState(data.session);
    } catch (err) {
        if (errorBox && errorMsg) {
            errorBox.classList.remove('hidden');
            errorMsg.innerText = err.message || "Invalid credentials. Please check your email and password.";
        }
    } finally {
        if (btnText) btnText.innerText = "Sign In";
        if (btnSubmit) btnSubmit.disabled = false;
        if (window.lucide) window.lucide.createIcons();
    }
}

export async function handleSignOut() {
    try {
        await signOutUser();
        setAuthState(null);
    } catch (err) {
        console.error("Sign out error:", err);
    }
}

export async function initApp() {
    mountApp();

    // Subscribe to auth changes
    onAuthChange((event, session) => {
        setAuthState(session);
    });

    // Check existing session
    const session = await getCurrentSession();
    setAuthState(session);
}

// 5. Initialize application on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
