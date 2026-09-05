// Authentication View Module
export const authViewHtml = `
<div id="auth-container" class="min-h-[80vh] flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
        <div>
            <div class="w-16 h-16 mx-auto bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
                <i data-lucide="gem" size="32"></i>
            </div>
            <h2 class="text-3xl font-black text-slate-900 tracking-tight">Our Treasures</h2>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Personal Collection Vault</p>
        </div>

        <div id="auth-error-box" class="hidden p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-bold text-left flex items-center gap-2">
            <i data-lucide="alert-circle" size="16" class="flex-shrink-0"></i>
            <span id="auth-error-msg">Invalid email or password.</span>
        </div>

        <form id="auth-form" onsubmit="event.preventDefault(); handleSignIn();" class="space-y-4 text-left">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
                <input type="email" id="auth-email" required autocomplete="email" placeholder="you@example.com"
                    class="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all font-medium text-slate-800">
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
                <input type="password" id="auth-password" required autocomplete="current-password" placeholder="••••••••"
                    class="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all font-medium text-slate-800">
            </div>
            
            <button type="submit" id="btn-auth-submit" 
                class="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer">
                <span id="btn-auth-text">Sign In</span>
                <i data-lucide="arrow-right" size="16"></i>
            </button>
        </form>

        <div class="pt-2 border-t border-slate-100">
            <p class="text-[11px] font-bold text-slate-400">
                Authorized access only • Secured by Supabase
            </p>
        </div>
    </div>
</div>
`;
