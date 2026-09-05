// Comics Section HTML Template
export const comicsViewHtml = `
<div id="category-comics" class="hidden space-y-6">
    <div class="bg-slate-200/80 p-1.5 rounded-2xl flex max-w-md mx-auto md:mx-0 shadow-inner">
        <button onclick="showSubTab('comics', 'manager')" id="comics-btn-manager" 
            class="flex-1 py-2 rounded-xl text-xs font-black transition-all duration-200 bg-white text-indigo-600 shadow-sm">
            Collection Manager
        </button>
        <button onclick="showSubTab('comics', 'randomizer')" id="comics-btn-randomizer" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Randomizer
        </button>
        <button onclick="showSubTab('comics', 'reports')" id="comics-btn-reports" 
            class="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 text-slate-500 hover:text-slate-800">
            Reports
        </button>
    </div>

    <!-- Sub-tab 1: Collection Manager -->
    <div id="comics-tab-manager" class="space-y-6">
        <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <button onclick="document.getElementById('add-comic-panel').classList.toggle('hidden')" class="w-full flex items-center justify-between p-5 hover:bg-slate-50 font-black text-slate-800 transition-colors text-base">
                <span class="flex items-center gap-3"><i data-lucide="plus-circle" class="text-indigo-600"></i> Add New Comic</span>
                <i data-lucide="chevron-down" class="text-slate-400" size="18"></i>
            </button>
            
            <div id="add-comic-panel" class="hidden p-6 border-t border-slate-100 bg-slate-50/50">
                <p class="text-slate-400 text-xs font-bold italic">Comic form ready for configuration...</p>
            </div>
        </div>

        <div class="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center text-slate-400 font-bold">
            <i data-lucide="newspaper" class="mx-auto mb-3 text-slate-300" size="48"></i>
            Comics collection view ready.
        </div>
    </div>

    <!-- Sub-tab 2: Randomizer -->
    <div id="comics-tab-randomizer" class="hidden space-y-8 max-w-4xl mx-auto text-center py-12 text-slate-400 font-bold">
        <i data-lucide="dices" class="mx-auto mb-3 text-slate-300" size="48"></i>
        Comic Randomizer ready.
    </div>

    <!-- Sub-tab 3: Reports -->
    <div id="comics-tab-reports" class="hidden space-y-6 text-center py-12 text-slate-400 font-bold">
        <i data-lucide="bar-chart-2" class="mx-auto mb-3 text-slate-300" size="48"></i>
        Comic Reports ready.
    </div>
</div>
`;
