// Modals Markup Template
export const modalsViewHtml = `
<!-- Hardcover Edition Selector Modal -->
<div id="edition-modal" class="hidden fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[85vh] overflow-hidden">
        <div class="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
            <h3 class="text-lg font-black text-slate-800 flex items-center gap-2">
                <i data-lucide="book-open" class="text-indigo-600"></i> Select Book & Edition from Hardcover
            </h3>
            <button onclick="document.getElementById('edition-modal').classList.add('hidden')" class="p-2 text-slate-400 hover:text-slate-700 rounded-full">
                <i data-lucide="x"></i>
            </button>
        </div>
        <div id="edition-results" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[65vh]"></div>
    </div>
</div>

<!-- Book Details & Edit Modal -->
<div id="book-modal" class="hidden fixed inset-0 bg-slate-950/70 z-40 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md transition-opacity">
    <div class="bg-white rounded-3xl sm:rounded-[2.5rem] shadow-2xl w-full max-w-4xl flex flex-col h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden border border-slate-100">
        <div class="flex justify-between items-center p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <h2 class="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2"><i data-lucide="book-open" class="text-indigo-600"></i> Book Details</h2>
            <button onclick="closeBook()" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"><i data-lucide="x"></i></button>
        </div>
        
        <div class="flex flex-col md:flex-row overflow-y-auto bg-white flex-grow">
            <div class="w-full md:w-1/3 bg-slate-100 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-slate-100 shrink-0">
                <img id="modal-book-img-display" class="w-36 md:w-full max-w-[200px] md:max-w-none rounded-2xl shadow-lg object-cover border-4 border-white transition-all" src="" onerror="handleImgError(this)">
                
                <div id="modal-book-cover-edit" class="hidden w-full mt-4 space-y-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover URL</label>
                    <input id="modal-book-img" oninput="document.getElementById('modal-book-img-display').src = getSafeImage(this.value); checkBookChanges()" class="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white outline-none">
                </div>
            </div>
            
            <div class="w-full md:w-2/3 p-4 sm:p-6 space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="col-span-1 sm:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                        <input id="modal-book-title" oninput="checkBookChanges()" class="w-full p-2.5 sm:p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-black text-base sm:text-lg outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Author</label>
                        <input id="modal-book-author" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Publisher / Edition</label>
                        <input id="modal-book-publisher" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ISBN</label>
                        <input id="modal-book-isbn" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Genre</label>
                        <input id="modal-book-genre" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Format</label>
                        <select id="modal-book-format" onchange="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="Paperback">Paperback</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="Trade Paperback">Trade Paperback</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select id="modal-book-type" onchange="toggleModalSeriesInput(); checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="Standalone">Standalone</option>
                            <option value="Series">Series</option>
                        </select>
                    </div>

                    <div id="modal-container-series-name" class="hidden col-span-1 sm:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Series Name</label>
                        <input id="modal-book-seriesname" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <input id="modal-book-loc" oninput="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none" readonly>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purchase Status</label>
                        <select id="modal-book-purch" onchange="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="Owned">Owned</option>
                            <option value="Preorder">Preorder</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Read Status (B)</label>
                        <select id="modal-book-readb" onchange="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="unread">Unread</option>
                            <option value="reading">Reading</option>
                            <option value="read">Read</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Read Status (L)</label>
                        <select id="modal-book-readl" onchange="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="unread">Unread</option>
                            <option value="reading">Reading</option>
                            <option value="read">Read</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Collection Status</label>
                        <select id="modal-book-coll" onchange="checkBookChanges()" class="w-full p-2.5 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="TBD">TBD</option>
                            <option value="Keep">Keep</option>
                            <option value="Drop">Drop</option>
                        </select>
                    </div>

                    <div class="flex items-center pt-2 sm:pt-4">
                        <label class="flex items-center gap-2 cursor-pointer font-black text-xs text-slate-700 uppercase">
                            <input id="modal-book-special" onchange="checkBookChanges()" type="checkbox" class="w-4 h-4 text-indigo-600 rounded pointer-events-none" disabled> Special Edition
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-b-3xl sm:rounded-b-[2.5rem] shrink-0">
            <div>
                <button id="modal-book-btn-delete" onclick="confirmDeleteBook()" class="text-red-500 font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1.5"><i data-lucide="trash-2" size="16"></i> Delete</button>
            </div>
            <div class="flex gap-2 sm:gap-3">
                <button id="modal-book-btn-edit" onclick="toggleBookEditMode(true)" class="bg-indigo-50 text-indigo-700 px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm hover:bg-indigo-100 transition-all">Edit Details</button>
                <button id="modal-book-btn-cancel" onclick="toggleBookEditMode(false)" class="hidden text-slate-500 font-bold text-xs sm:text-sm px-3 sm:px-5 py-2.5 rounded-xl hover:bg-slate-200/50 transition-all">Cancel</button>
                <button id="modal-book-btn-save" onclick="saveBookEdit()" class="hidden bg-indigo-600 text-white px-4 sm:px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all" disabled>Save Changes</button>
            </div>
        </div>
    </div>
</div>

<!-- Boardgame Details & Edit Modal -->
<div id="game-modal" class="hidden fixed inset-0 bg-slate-950/70 z-40 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
    <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
        <div class="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 class="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2"><i data-lucide="box" class="text-indigo-600"></i> Game Details</h2>
            <button onclick="closeGame()" class="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"><i data-lucide="x"></i></button>
        </div>
        
        <div class="flex flex-col md:flex-row overflow-y-auto bg-white">
            <div class="w-full md:w-2/5 bg-slate-100 p-8 flex flex-col items-center border-r border-slate-100 relative">
                <img id="modal-img-display" class="w-full rounded-2xl shadow-lg object-cover border-4 border-white transition-all mb-4" src="" onerror="handleImgError(this)">
                <div class="w-full space-y-1">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Comments</label>
                    <textarea id="modal-comments" rows="3" oninput="checkChanges()" class="w-full p-3 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold text-xs outline-none transition-all pointer-events-none resize-none" readonly></textarea>
                </div>
            </div>
            
            <div class="w-full md:w-3/5 p-8 space-y-5">
                <div class="relative">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                    <input id="modal-name" onkeydown="handleBggKeydown(event, 'edit')" oninput="modalBggSearch(this.value); checkChanges()" autocomplete="off" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-black text-lg outline-none transition-all pointer-events-none" readonly>
                    <div id="modal-bgg-results" class="absolute z-[9999] w-full bg-white shadow-2xl rounded-b-xl hidden max-h-60 overflow-y-auto border border-indigo-100 mt-1 left-0"></div>
                    <div id="modal-bgg-link-container" class="mt-2 ml-1">
                        <a id="modal-bgg-link" href="#" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline bg-indigo-50/80 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all">
                            <i data-lucide="external-link" size="13"></i>
                            <span id="modal-bgg-link-text">BGG Link</span>
                        </a>
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-5">
                    <div class="col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                        <input id="modal-loc" oninput="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none" readonly>
                    </div>
                    <div class="col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Players</label>
                        <input id="modal-players" oninput="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none" readonly>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select id="modal-type" onchange="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option>Game</option><option>Expansion</option><option>Campaign</option><option>Legacy</option><option>Escape</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Purchase Status</label>
                        <select id="modal-purch" onchange="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option>Owned</option><option>Ordered</option><option>Wishlist</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Play Status</label>
                        <select id="modal-play" onchange="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option>Not played</option><option>Played</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Collection Status</label>
                        <select id="modal-coll" onchange="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option>TBD</option><option>Keep</option><option>Drop</option>
                        </select>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Checked</label>
                        <select id="modal-checked" onchange="checkChanges()" class="w-full p-3 mt-1 rounded-xl border-2 border-transparent bg-slate-50 text-slate-800 font-bold outline-none transition-all pointer-events-none appearance-none" disabled>
                            <option value="No">No</option><option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center rounded-b-[2.5rem]">
            <div>
                <button id="modal-btn-delete" onclick="confirmDelete()" class="text-red-500 font-bold text-sm px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"><i data-lucide="trash-2" size="16"></i> Delete</button>
            </div>
            <div class="flex gap-3">
                <button id="modal-btn-edit" onclick="toggleEditMode(true)" class="bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-100 transition-all">Edit Details</button>
                <button id="modal-btn-cancel" onclick="toggleEditMode(false)" class="hidden text-slate-500 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-200/50 transition-all">Cancel</button>
                <button id="modal-btn-save" onclick="saveEdit()" class="hidden bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-sm shadow-md transition-all" disabled>Save Changes</button>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="delete-modal" class="hidden fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center border border-slate-100">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <i data-lucide="alert-triangle" size="32"></i>
        </div>
        <h3 id="delete-modal-title" class="text-xl font-black text-slate-800 mb-2">Delete Item?</h3>
        <p class="text-slate-500 text-xs mb-6 font-medium leading-relaxed">This action cannot be undone. It will be permanently removed from your treasure trove.</p>
        <div class="flex gap-3 justify-center">
            <button onclick="cancelDelete()" class="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all w-1/2">Cancel</button>
            <button onclick="executeDelete()" class="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-red-500 hover:bg-red-600 shadow-md transition-all w-1/2 flex items-center justify-center gap-1.5"><i data-lucide="trash" size="14"></i> Delete</button>
        </div>
    </div>
</div>
`;
