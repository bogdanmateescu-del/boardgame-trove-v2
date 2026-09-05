// Boardgames Section HTML Template
export const boardgamesViewHtml = `
<div id="category-boardgames" class="space-y-6">
    <div class="bg-slate-200/80 p-1.5 rounded-2xl flex max-w-md mx-auto md:mx-0 shadow-inner">
        <button onclick="showSubTab('boardgames', 'manager')" id="bg-btn-manager" 
            class="flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 bg-white text-indigo-600 shadow-sm">
            Collection Manager
        </button>
        <button onclick="showSubTab('boardgames', 'randomizer')" id="bg-btn-randomizer" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Randomizer
        </button>
        <button onclick="showSubTab('boardgames', 'reports')" id="bg-btn-reports" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Reports
        </button>
    </div>

    <!-- Sub-tab 1: Collection Manager -->
    <div id="bg-tab-manager" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div class="md:col-span-3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <button onclick="document.getElementById('add-panel').classList.toggle('hidden')" class="w-full flex items-center justify-between p-5 hover:bg-slate-50 font-black text-slate-800 transition-colors text-base">
                    <span class="flex items-center gap-3"><i data-lucide="plus-circle" class="text-indigo-600"></i> Add New game</span>
                    <i data-lucide="chevron-down" class="text-slate-400" size="18"></i>
                </button>
            </div>
            <div>
                <button id="btn-show-collection-toggle" onclick="toggleCollectionViewGroup()" class="w-full h-full bg-slate-900 text-white p-5 rounded-3xl font-black text-xs hover:bg-slate-800 shadow-md transition-all inline-flex items-center justify-center gap-2">
                    <i data-lucide="layers" size="16"></i> Show Collection
                </button>
            </div>
        </div>

        <div id="add-panel" class="hidden bg-white rounded-3xl shadow-sm border border-slate-200 p-6 bg-slate-50/50 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="relative lg:col-span-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name *</label>
                    <input id="in-name" onkeydown="handleBggKeydown(event, 'add')" oninput="bggSearch(this.value)" autocomplete="off" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-sm" placeholder="Search BGG...">
                    <div id="bgg-results" class="absolute z-[100] w-full bg-white shadow-2xl rounded-b-xl hidden max-h-60 overflow-y-auto border border-indigo-100 mt-1"></div>
                </div>
                <div class="lg:col-span-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location *</label>
                    <input id="in-loc" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-sm" placeholder="Shelf D18...">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type *</label>
                    <select id="in-type" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                        <option>Game</option><option>Expansion</option><option>Campaign</option><option>Legacy</option><option>Escape</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Play Status *</label>
                    <select id="in-play" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                        <option>Not played</option><option>Played</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Status *</label>
                    <select id="in-coll" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                        <option>TBD</option><option>Keep</option><option>Drop</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchase Status *</label>
                    <select id="in-purch" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                        <option>Owned</option><option>Ordered</option><option>Wishlist</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checked *</label>
                    <select id="in-checked" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm bg-white text-sm">
                        <option value="No">No</option><option value="Yes">Yes</option>
                    </select>
                </div>
                <div class="lg:col-span-1">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Players *</label>
                    <input id="in-players" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-sm" placeholder="e.g. 1-4 players">
                </div>
            </div>
            <input id="in-bggid" type="hidden"><input id="in-img" type="hidden">
            
            <div class="flex gap-3 pt-4 border-t border-slate-200">
                <button onclick="saveGame()" class="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-sm hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all">Save Game</button>
                <button onclick="document.getElementById('add-panel').classList.add('hidden')" class="text-slate-500 font-bold text-sm px-4 hover:text-slate-800">Cancel</button>
            </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
            <div class="flex justify-between items-center">
                <h3 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                    <i data-lucide="filter" size="14" class="text-indigo-600"></i> Find Game
                </h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div class="lg:col-span-2">
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                    <input id="filter-name" oninput="applyFilters()" placeholder="Search by name..." class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                    <select id="filter-type" onchange="applyFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Types</option>
                        <option>Game</option><option>Expansion</option><option>Campaign</option><option>Legacy</option><option>Escape</option>
                    </select>
                </div>
            </div>

            <div class="flex justify-between items-center border-b border-slate-100 pb-4">
                <button onclick="toggleAdvancedFilters()" id="btn-toggle-filters" class="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <i data-lucide="chevron-down" size="14"></i> <span id="text-toggle-filters">More Filters</span>
                </button>
                <button onclick="clearFilters()" class="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">Clear All Filters</button>
            </div>

            <div id="advanced-filters" class="hidden grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location (Exact)</label>
                    <input id="filter-loc" oninput="applyFilters()" placeholder="e.g. C1..." class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Players</label>
                    <input id="filter-players" oninput="applyFilters()" placeholder="Search players..." class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Play Status</label>
                    <select id="filter-play" onchange="applyFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option>Not played</option><option>Played</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Collection Status</label>
                    <select id="filter-coll" onchange="applyFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All Statuses</option>
                        <option>TBD</option><option>Keep</option><option>Drop</option>
                    </select>
                </div>
                <div>
                    <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checked Status</label>
                    <select id="filter-checked" onchange="applyFilters()" class="w-full p-2.5 mt-1 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none text-sm bg-slate-50/50">
                        <option value="All">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>

            <div id="search-results-section" class="hidden pt-4 space-y-3">
                <h4 class="text-xs font-black text-slate-400 uppercase tracking-wider">Search Results (<span id="search-results-count">0</span>)</h4>
                <div id="search-results-list" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4"></div>
            </div>
        </div>

        <div id="boardgames-dashboard-view" class="space-y-6">
            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                        <i data-lucide="sparkles" size="16" class="text-indigo-600"></i> Latest Boardgames Added
                    </h3>
                </div>
                <div id="latest-games-list" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4"></div>
            </div>

            <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                        <i data-lucide="check-circle-2" size="16" class="text-emerald-600"></i> Last Played
                    </h3>
                </div>
                <div id="last-played-list" class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4"></div>
            </div>
        </div>

        <div id="boardgames-full-view" class="hidden bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
                <h3 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2">
                    <i data-lucide="layers" size="14" class="text-indigo-600"></i> Full Collection Cards
                </h3>
                <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Sort By:</label>
                        <select id="sort-collection-select" onchange="renderList()" class="p-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-400">
                            <option value="alpha">Alphabetical (A-Z)</option>
                            <option value="location">Location (A1-Z9)</option>
                            <option value="newest">Newest Added</option>
                        </select>
                    </div>
                    <button onclick="switchToDashboard()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1 whitespace-nowrap">
                        <i data-lucide="arrow-left" size="14"></i> Back to Dashboard
                    </button>
                </div>
            </div>
            
            <div id="game-list" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 min-h-[400px]"></div>

            <div class="mt-10 flex items-center justify-center gap-4">
                <button onclick="changePage(-1)" id="btn-prev" class="p-2 border border-slate-200 rounded-xl bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all">
                    <i data-lucide="chevron-left" class="text-slate-600"></i>
                </button>
                <span id="page-info" class="font-bold text-slate-600 text-xs tracking-wider uppercase">Page 1</span>
                <button onclick="changePage(1)" id="btn-next" class="p-2 border border-slate-200 rounded-xl bg-white shadow-sm disabled:opacity-30 hover:bg-slate-50 transition-all">
                    <i data-lucide="chevron-right" class="text-slate-600"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Sub-tab 2: Randomizer -->
    <div id="bg-tab-randomizer" class="hidden space-y-8 max-w-4xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button onclick="roll('all')" class="p-8 bg-white border border-slate-200 rounded-3xl font-black text-slate-800 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all shadow-sm flex flex-col items-center">
                <i data-lucide="dice-5" class="text-indigo-600 mb-3" size="36"></i> Random Game
            </button>
            <button onclick="roll('unplayed')" class="p-8 bg-white border border-slate-200 rounded-3xl font-black text-slate-800 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all shadow-sm flex flex-col items-center">
                <i data-lucide="sparkles" class="text-emerald-600 mb-3" size="36"></i> Random Unplayed
            </button>
            <button onclick="roll('tbd')" class="p-8 bg-white border border-slate-200 rounded-3xl font-black text-slate-800 hover:border-amber-500 hover:bg-amber-50/50 transition-all shadow-sm flex flex-col items-center">
                <i data-lucide="help-circle" class="text-amber-500 mb-3" size="36"></i> Random TBD
            </button>
        </div>
        
        <div id="roll-res" class="hidden bg-indigo-950 rounded-[3rem] p-10 text-white text-center shadow-2xl">
            <div class="uppercase tracking-widest text-indigo-300 font-black text-xs mb-6">The Treasure Found:</div>
            <img id="roll-img" class="w-64 h-64 mx-auto rounded-3xl mb-6 object-cover border-8 border-white/10 shadow-2xl">
            <h2 id="roll-name" class="text-4xl font-black mb-2"></h2>
            <div class="flex justify-center gap-4 text-indigo-200 font-bold">
                <span id="roll-loc" class="bg-white/10 px-4 py-1.5 rounded-full text-xs"></span>
                <span id="roll-play" class="bg-white/10 px-4 py-1.5 rounded-full text-xs"></span>
            </div>
        </div>
    </div>

    <!-- Sub-tab 3: Reports -->
    <div id="bg-tab-reports" class="hidden space-y-6">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h4 class="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-2 mb-4">
                <i data-lucide="bar-chart" size="16" class="text-indigo-600"></i> Boardgames Collection Summary
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-bold text-slate-700">
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</span>
                    <span id="metric-total-items" class="text-xl font-black text-slate-900 mt-0.5">0</span>
                    <div class="text-xs text-slate-500 font-normal mt-1 space-x-2">
                        <span id="metric-total-games">0 Games</span> • <span id="metric-total-expansions">0 Expansions</span>
                    </div>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unplayed Games</span>
                    <span id="metric-unplayed" class="text-xl font-black text-indigo-600 mt-0.5">0/0</span>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decisions (TBD)</span>
                    <span id="metric-decisions" class="text-xl font-black text-amber-500 mt-0.5">0/0</span>
                </div>
                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Checked Status</span>
                    <span id="metric-checked" class="text-xl font-black text-emerald-600 mt-0.5">0/0</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-indigo-50 text-indigo-600 p-4 rounded-2xl mb-4"><i data-lucide="play-circle" size="32"></i></div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Unplayed Games</p>
                <h3 id="rep-unplayed" class="text-base font-bold text-slate-800 leading-relaxed"></h3>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-amber-50 text-amber-500 p-4 rounded-2xl mb-4"><i data-lucide="alert-circle" size="32"></i></div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Decisions Needed (TBD)</p>
                <h3 id="rep-tbd" class="text-base font-bold text-slate-800 leading-relaxed"></h3>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                <div class="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-4"><i data-lucide="x-circle" size="32"></i></div>
                <p class="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">Unchecked Games</p>
                <h3 id="rep-unchecked" class="text-base font-bold text-slate-800 leading-relaxed mb-4"></h3>
                <button onclick="showUncheckedGames()" class="bg-slate-900 hover:bg-slate-800 text-white text-xs px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm">
                    <i data-lucide="layers" size="14"></i> Display Unchecked Games
                </button>
            </div>
        </div>
        
        <div class="mt-8 p-8 bg-slate-900 rounded-3xl text-white shadow-xl">
            <h4 class="font-black text-lg mb-6 flex items-center gap-3"><i data-lucide="settings" class="text-indigo-400"></i> Administrative Options</h4>
            <div class="flex flex-col gap-4">
                <div class="bg-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-700">
                    <div>
                        <p class="font-bold text-sm text-slate-100">Export Collection</p>
                        <p class="text-xs text-slate-400 mt-0.5">Download a full CSV backup of your current database.</p>
                    </div>
                    <button onclick="exportCSV()" class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-xs px-5 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap">
                        <i data-lucide="download" size="16"></i> Download CSV
                    </button>
                </div>

                <div class="bg-slate-800/80 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 border border-slate-700">
                    <div class="flex-grow">
                        <p class="font-bold text-sm text-slate-100">One-Time BGG Sync</p>
                        <p class="text-xs text-slate-400 mt-0.5 mb-2">Scans your collection and automatically fetches missing BGG IDs and Cover Images.</p>
                        <span id="sync-status" class="text-xs font-mono text-indigo-400 font-bold bg-slate-950 px-3 py-1 rounded hidden">Ready to sync.</span>
                    </div>
                    <button id="btn-sync-bgg" onclick="syncMissingBGGData()" class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-xs px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg whitespace-nowrap">
                        <i data-lucide="refresh-cw" size="16"></i> Fetch Missing BGG Data
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
`;
