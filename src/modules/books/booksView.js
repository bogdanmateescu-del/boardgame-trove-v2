// Books Section HTML Template
export const booksViewHtml = `
<div id="category-books" class="hidden space-y-6">
    <div class="bg-slate-200/80 p-1.5 rounded-2xl flex max-w-md mx-auto md:mx-0 shadow-inner">
        <button onclick="showSubTab('books', 'manager')" id="books-btn-manager" 
            class="flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 bg-white text-indigo-600 shadow-sm">
            Collection Manager
        </button>
        <button onclick="showSubTab('books', 'randomizer')" id="books-btn-randomizer" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Randomizer
        </button>
        <button onclick="showSubTab('books', 'reports')" id="books-btn-reports" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Reports
        </button>
    </div>

    <!-- Sub-tab 1: Collection Manager -->
    <div id="books-tab-manager" class="space-y-6">
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <button onclick="document.getElementById('add-book-panel').classList.toggle('hidden')" class="w-full flex items-center justify-between p-5 hover:bg-slate-50 font-black text-slate-800 transition-colors text-base">
                <span class="flex items-center gap-3"><i data-lucide="plus-circle" class="text-indigo-600"></i> Add New Book</span>
                <i data-lucide="chevron-down" class="text-slate-400" size="18"></i>
            </button>
            
            <div id="add-book-panel" class="hidden p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                <div id="scanner-container" class="hidden relative p-4 bg-slate-900 rounded-3xl text-white text-center space-y-3">
                    <div class="flex justify-between items-center px-2">
                        <span class="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                            <i data-lucide="camera" size="16"></i> Point Camera at Book Barcode
                        </span>
                        <button onclick="stopCameraScanner()" class="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300">
                            <i data-lucide="x" size="16"></i>
                        </button>
                    </div>
                    <div id="barcode-scanner" class="max-w-sm mx-auto overflow-hidden rounded-2xl"></div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="relative lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISBN / EAN (Type, Scan or Camera)</label>
                        <div class="flex gap-2 mt-1">
                            <input id="in-book-isbn" class="w-full p-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. 9780593723852">
                            <button onclick="startCameraScanner()" class="bg-slate-800 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-700 shadow-sm whitespace-nowrap flex items-center gap-1.5"><i data-lucide="camera" size="14"></i> Camera Scan</button>
                            <button onclick="searchBookByISBN()" class="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-black text-xs hover:bg-indigo-700 shadow-sm whitespace-nowrap">Fetch ISBN</button>
                        </div>
                    </div>

                    <div class="relative lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title * (Search API for Editions)</label>
                        <div class="flex gap-2 mt-1">
                            <input id="in-book-title" class="w-full p-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. A Trade of Blood...">
                            <button onclick="searchBookByTitle()" class="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-black text-xs hover:bg-indigo-700 shadow-sm whitespace-nowrap">Search Editions</button>
                        </div>
                    </div>

                    <div class="lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Author *</label>
                        <input id="in-book-author" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="Author name...">
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Publisher / Edition</label>
                        <input id="in-book-publisher" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none" placeholder="e.g. Folio Society, Illumicrate...">
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Genre</label>
                        <input id="in-book-genre" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none" placeholder="Genre...">
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format *</label>
                        <select id="in-book-format" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="Paperback">Paperback</option>
                            <option value="Hardcover">Hardcover</option>
                            <option value="Trade Paperback">Trade Paperback</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type *</label>
                        <select id="in-book-type" onchange="toggleSeriesInput()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="Standalone">Standalone</option>
                            <option value="Series">Series</option>
                        </select>
                    </div>

                    <div id="container-series-name" class="hidden lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Series Name *</label>
                        <input id="in-book-seriesname" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. The Realm of the Elderlings...">
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location *</label>
                        <input id="in-book-loc" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none" placeholder="Shelf B2...">
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Status</label>
                        <select id="in-book-purch" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="Owned">Owned</option><option value="Preorder">Preorder</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Status (B)</label>
                        <select id="in-book-readb" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="unread">Unread</option><option value="reading">Reading</option><option value="read">Read</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Status (L)</label>
                        <select id="in-book-readl" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="unread">Unread</option><option value="reading">Reading</option><option value="read">Read</option>
                        </select>
                    </div>

                    <div>
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Status</label>
                        <select id="in-book-coll" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                            <option value="TBD">TBD</option><option value="Keep">Keep</option><option value="Drop">Drop</option>
                        </select>
                    </div>

                    <div class="lg:col-span-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cover Image URL (Paste Custom Link or Search Google)</label>
                        <div class="flex gap-2 mt-1">
                            <input id="in-book-img" oninput="updateCoverPreview()" class="w-full p-2.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm outline-none" placeholder="Paste custom cover URL...">
                            <button onclick="openGoogleImageSearch()" class="bg-slate-800 text-white px-3 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-700 whitespace-nowrap flex items-center gap-1.5"><i data-lucide="search" size="14"></i> Google Images</button>
                        </div>
                    </div>

                    <div class="flex items-center pt-6">
                        <label class="flex items-center gap-2 cursor-pointer font-black text-xs text-slate-700 uppercase">
                            <input id="in-book-special" type="checkbox" class="w-4 h-4 text-indigo-600 rounded"> Special Edition
                        </label>
                    </div>
                </div>

                <div id="cover-preview-box" class="hidden items-center gap-4 p-4 bg-slate-100/80 rounded-2xl border border-slate-200">
                    <img id="img-cover-preview" class="w-16 h-24 object-cover rounded-lg border shadow-sm" src="" onerror="handleImgError(this)">
                    <div>
                        <p class="text-xs font-black text-slate-700 uppercase tracking-wider">Live Cover Preview</p>
                        <p class="text-[10px] text-slate-400 font-bold mt-0.5">Image URL recognized and ready to save!</p>
                    </div>
                </div>

                <div class="flex gap-3 pt-4 border-t border-slate-200">
                    <button onclick="saveBook()" class="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">Save Book</button>
                    <button onclick="document.getElementById('add-book-panel').classList.add('hidden')" class="text-slate-500 font-bold text-sm px-4 hover:text-slate-800">Cancel</button>
                </div>
            </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                    <i data-lucide="filter" size="14" class="text-indigo-600"></i> Find Books
                </h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="lg:col-span-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title / Author / Publisher</label>
                    <input id="filter-book-text" oninput="applyBookFilters()" placeholder="Search title, author, publisher..." class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Format</label>
                    <select id="filter-book-format" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Formats</option>
                        <option value="Paperback">Paperback</option>
                        <option value="Hardcover">Hardcover</option>
                        <option value="Trade Paperback">Trade Paperback</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                    <select id="filter-book-type" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Types</option>
                        <option value="Standalone">Standalone</option>
                        <option value="Series">Series</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                <button onclick="toggleAdvancedBookFilters()" id="btn-toggle-book-filters" class="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <i data-lucide="chevron-down" size="14"></i> <span id="text-toggle-book-filters">More Filters</span>
                </button>
                <button onclick="clearBookFilters()" class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">Clear All Filters</button>
            </div>

            <div id="advanced-book-filters" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                    <input id="filter-book-loc" oninput="applyBookFilters()" placeholder="Search location..." class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Status</label>
                    <select id="filter-book-purch" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option value="Owned">Owned</option>
                        <option value="Preorder">Preorder</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Status (B)</label>
                    <select id="filter-book-readb" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option value="unread">Unread</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Read Status (L)</label>
                    <select id="filter-book-readl" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option value="unread">Unread</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Status</label>
                    <select id="filter-book-coll" onchange="applyBookFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option value="TBD">TBD</option>
                        <option value="Keep">Keep</option>
                        <option value="Drop">Drop</option>
                    </select>
                </div>
            </div>
        </div>

        <div id="books-list" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 min-h-[400px]"></div>

        <div class="mt-8 flex items-center justify-center gap-4">
            <button onclick="changeBookPage(-1)" id="btn-book-prev" class="p-2 border border-slate-200 rounded-xl bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all">
                <i data-lucide="chevron-left" class="text-slate-600"></i>
            </button>
            <span id="book-page-info" class="font-bold text-slate-600 text-xs tracking-wider uppercase">Page 1</span>
            <button onclick="changeBookPage(1)" id="btn-book-next" class="p-2 border border-slate-200 rounded-xl bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all">
                <i data-lucide="chevron-right" class="text-slate-600"></i>
            </button>
        </div>
    </div>

    <!-- Sub-tab 2: Randomizer -->
    <div id="books-tab-randomizer" class="hidden space-y-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onclick="rollBook('L')" class="p-8 bg-white border border-slate-200 rounded-3xl font-black text-slate-800 hover:border-purple-500 hover:bg-purple-50/50 transition-all shadow-sm flex flex-col items-center">
                <i data-lucide="sparkles" class="text-purple-600 mb-3" size="36"></i> Randomizer Lore
                <span class="text-xs text-slate-400 font-normal mt-1">Rolls a random book where ReadStatusL is Unread</span>
            </button>
            <button onclick="rollBook('B')" class="p-8 bg-white border border-slate-200 rounded-3xl font-black text-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all shadow-sm flex flex-col items-center">
                <i data-lucide="dice-5" class="text-indigo-600 mb-3" size="36"></i> Randomizer Bogdan
                <span class="text-xs text-slate-400 font-normal mt-1">Rolls a random book where ReadStatusB is Unread</span>
            </button>
        </div>
        
        <div id="book-roll-res" class="hidden bg-slate-900 rounded-[3rem] p-10 text-white text-center shadow-2xl border border-slate-800">
            <div class="uppercase tracking-widest text-indigo-400 font-black text-xs mb-6" id="book-roll-target">The Treasure Found:</div>
            <img id="book-roll-img" class="w-48 h-64 mx-auto rounded-2xl mb-6 object-cover border-4 border-white/10 shadow-2xl" onerror="handleImgError(this)">
            <h2 id="book-roll-title" class="text-3xl font-black mb-1"></h2>
            <p id="book-roll-author" class="text-slate-400 text-sm font-bold mb-4"></p>
            <div class="flex justify-center gap-4 text-indigo-200 font-bold">
                <span id="book-roll-loc" class="bg-white/10 px-4 py-1.5 rounded-full text-xs"></span>
                <span id="book-roll-format" class="bg-white/10 px-4 py-1.5 rounded-full text-xs"></span>
            </div>
        </div>
    </div>

    <!-- Sub-tab 3: Reports -->
    <div id="books-tab-reports" class="hidden space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-indigo-50 text-indigo-600 p-4 rounded-2xl mb-4">
                    <i data-lucide="book-open" size="32"></i>
                </div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Total Collection</p>
                <h3 id="rep-book-total" class="text-4xl font-black text-slate-900">0</h3>
                <p class="text-xs text-slate-400 font-medium mt-1">Books in library</p>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-blue-50 text-blue-600 p-4 rounded-2xl mb-4">
                    <i data-lucide="user-check" size="32"></i>
                </div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Bogdan's Stats</p>
                <div class="flex items-center gap-3 my-1">
                    <span class="text-2xl font-black text-emerald-600" id="rep-book-b-read">0</span>
                    <span class="text-xs text-slate-300 font-bold">/</span>
                    <span class="text-2xl font-black text-amber-500" id="rep-book-b-unread">0</span>
                </div>
                <p class="text-xs text-slate-400 font-medium"><span class="text-emerald-600 font-bold">Read</span> vs <span class="text-amber-500 font-bold">Unread</span></p>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-purple-50 text-purple-600 p-4 rounded-2xl mb-4">
                    <i data-lucide="sparkles" size="32"></i>
                </div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Lore's Stats</p>
                <div class="flex items-center gap-3 my-1">
                    <span class="text-2xl font-black text-emerald-600" id="rep-book-l-read">0</span>
                    <span class="text-xs text-slate-300 font-bold">/</span>
                    <span class="text-2xl font-black text-amber-500" id="rep-book-l-unread">0</span>
                </div>
                <p class="text-xs text-slate-400 font-medium"><span class="text-emerald-600 font-bold">Read</span> vs <span class="text-amber-500 font-bold">Unread</span></p>
            </div>
        </div>
    </div>
</div>
`;
