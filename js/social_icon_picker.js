// ═══════════════════════════════════════════════════════════════════
// social_icon_picker.js  —  Ahmos Email Builder
//
// Unified image / icon browser modal.
// Reads window._sIconsManifest populated by SocialIcons.init().
//
// Tabs:
//   • sIcons/colored/  — brand-colored social icons
//   • sIcons/white/    — white/mono social icons
//   • images/          — general images (banners, logos, etc.)
//
// All selections are fetched and embedded as base64 data URIs,
// so the exported email HTML is fully self-contained.
// ═══════════════════════════════════════════════════════════════════


// ── Manifest loader ───────────────────────────────────────────────
const SocialIcons = {
    async init() {
        try {
            const res = await fetch('./sicons-manifest.json');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            window._sIconsManifest = await res.json();
            const total = (window._sIconsManifest.all || []).length;
            const imgs  = Object.keys(window._sIconsManifest.images || {}).length;
            if (total > 0 || imgs > 0) {
                console.log(`[SocialIcons] Manifest loaded — icons: ${total}, images: ${imgs}`);
            } else {
                console.warn('[SocialIcons] Manifest is empty. Run generate_sicons_manifest.py');
            }
        } catch (e) {
            console.warn('[SocialIcons] sicons-manifest.json not found.', e.message);
            window._sIconsManifest = { colored: {}, white: {}, images: {}, all: [] };
        }
    }
};


// ── Fetch URL and convert to base64 data URI ──────────────────────
async function fetchAsBase64(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: HTTP ${res.status}`);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('FileReader failed'));
        reader.readAsDataURL(blob);
    });
}


// ── Picker ────────────────────────────────────────────────────────
const SocialIconPicker = {

    // Tab definitions — add/edit tabs here
    TABS: [
        { key: 'colored', label: 'Colored Icons', folder: './sIcons/colored/', manifestKey: 'colored' },
        { key: 'white',   label: 'White Icons',   folder: './sIcons/white/',   manifestKey: 'white'   },
        { key: 'images',  label: 'Images',         folder: './images/',          manifestKey: 'images'  },
    ],

    DEFAULT_BG: { colored: '#ffffff', white: '#1a1a2e', images: '#f1f5f9' },

    _activeTab: 'colored',
    _tabBg:     {},
    _callback:  null,
    _loading:   false,

    // ── Open for a social icon slot ───────────────────────────────
    openForSocial(idx, manifest) {
        this._open('colored', manifest, async (src) => {
            const data = await fetchAsBase64(src);
            UI.updSocial(idx, 'customSrc', data);
            UI.buildFooterPanel();
            Utils.showToast('Icon set', 'success');
        });
    },

    // ── Open for any image block ──────────────────────────────────
    // applyFn receives the base64 string
    openForImage(applyFn, manifest) {
        this._open('images', manifest, async (src) => {
            const data = await fetchAsBase64(src);
            applyFn(data);
            Utils.showToast('Image set', 'success');
        });
    },

    // ── Internal open ─────────────────────────────────────────────
    _open(defaultTab, manifest, onSelect) {
        document.getElementById('sic-modal')?.remove();
        this._activeTab = defaultTab;
        this._tabBg     = { ...this.DEFAULT_BG };
        this._callback  = onSelect;
        this._loading   = false;

        const el = document.createElement('div');
        el.id = 'sic-modal';
        el.innerHTML = this._html(manifest);
        document.body.appendChild(el);

        this.TABS.forEach(t => this._buildGrid(t, manifest[t.manifestKey] || {}));
        this._switchTab(defaultTab);

        el._keyHandler = (e) => { if (e.key === 'Escape') this.close(); };
        document.addEventListener('keydown', el._keyHandler);
    },

    // ── HTML ──────────────────────────────────────────────────────
    _html(manifest) {
        const tabs = this.TABS.map(t => {
            const n = Object.keys(manifest[t.manifestKey] || {}).length;
            return `<button class="sic-tab" data-tab="${t.key}"
                        onclick="SocialIconPicker._switchTab('${t.key}')">
                        ${t.label}<span class="sic-tab-count">${n}</span>
                    </button>`;
        }).join('');

        const grids = this.TABS.map(t =>
            `<div class="sic-grid" id="sic-grid-${t.key}" style="display:none;"></div>`
        ).join('');

        return `
<div class="sic-overlay" onclick="SocialIconPicker._closeOnOverlay(event)">
  <div class="sic-modal" tabindex="-1">
    <div class="sic-header">
      <span class="sic-title"><i class="fas fa-images"></i>&nbsp; Browse Library</span>
      <button class="sic-close" onclick="SocialIconPicker.close()">✕</button>
    </div>
    <div class="sic-tabs">
      ${tabs}
      <div class="sic-bg-ctrl">
        <span class="sic-bg-label">Preview bg:</span>
        <div class="sic-bg-swatch" id="sic-bg-swatch"
             onclick="SocialIconPicker._pickBg()" title="Change preview background"></div>
        <input type="text" id="sic-bg-input" class="sic-bg-input" maxlength="7"
               oninput="SocialIconPicker._onBgInput(this.value)" placeholder="#ffffff">
      </div>
    </div>
    <div class="sic-body" id="sic-body">${grids}</div>
    <div class="sic-footer">
      <span id="sic-sel-label" class="sic-sel-label">Click an image to select it</span>
      <div id="sic-loading" class="sic-loading" style="display:none;">
        <i class="fas fa-spinner fa-spin"></i> Embedding…
      </div>
      <button class="sic-cancel-btn" onclick="SocialIconPicker.close()">Cancel</button>
    </div>
  </div>
</div>`;
    },

    // ── Build tile grid ───────────────────────────────────────────
    _buildGrid(tab, files) {
        const grid = document.getElementById(`sic-grid-${tab.key}`);
        if (!grid) return;
        if (!Object.keys(files).length) {
            grid.innerHTML = `
              <div class="sic-empty">
                <i class="fas fa-folder-open"></i><br>
                No files found in <code>${tab.folder}</code><br>
                <small>Add images then re-run <code>generate_sicons_manifest.py</code></small>
              </div>`;
            return;
        }
        grid.innerHTML = Object.entries(files).map(([key, fname]) => {
            const src = tab.folder + fname;
            return `
            <div class="sic-tile" data-key="${key}" data-src="${src}"
                 onclick="SocialIconPicker._select('${key}','${src}')" title="${key}">
              <div class="sic-thumb-wrap">
                <img class="sic-thumb" src="${src}" alt="${key}" loading="lazy" draggable="false">
              </div>
              <div class="sic-tile-name">${key}</div>
            </div>`;
        }).join('');
    },

    // ── Tab switch ────────────────────────────────────────────────
    _switchTab(key) {
        this._activeTab = key;
        document.querySelectorAll('.sic-tab').forEach(b =>
            b.classList.toggle('active', b.dataset.tab === key));
        this.TABS.forEach(t => {
            const g = document.getElementById(`sic-grid-${t.key}`);
            if (g) g.style.display = t.key === key ? '' : 'none';
        });
        this._applyBgUI(this._tabBg[key] || '#ffffff');
    },

    // ── Background ────────────────────────────────────────────────
    _pickBg() {
        let inp = document.getElementById('sic-color-native');
        if (!inp) {
            inp = document.createElement('input');
            inp.type = 'color'; inp.id = 'sic-color-native';
            inp.style.cssText = 'position:fixed;opacity:0;pointer-events:none;width:0;height:0;';
            document.body.appendChild(inp);
        }
        inp.value = this._tabBg[this._activeTab] || '#ffffff';
        inp.oninput  = e => this._applyBg(e.target.value);
        inp.onchange = e => this._applyBg(e.target.value);
        inp.click();
    },

    _onBgInput(val) { if (/^#[0-9a-fA-F]{6}$/.test(val)) this._applyBg(val); },

    _applyBg(color) {
        this._tabBg[this._activeTab] = color;
        this._applyBgUI(color);
    },

    _applyBgUI(color) {
        const body   = document.getElementById('sic-body');
        const swatch = document.getElementById('sic-bg-swatch');
        const input  = document.getElementById('sic-bg-input');
        if (body)   body.style.background   = color;
        if (swatch) swatch.style.background = color;
        if (input)  input.value             = color;
    },

    // ── Select (async fetch → base64) ────────────────────────────
    async _select(key, src) {
        if (this._loading) return;
        this._loading = true;
        document.querySelectorAll('.sic-tile').forEach(t =>
            t.classList.toggle('selected', t.dataset.key === key));
        const loadEl = document.getElementById('sic-loading');
        const lblEl  = document.getElementById('sic-sel-label');
        if (loadEl) loadEl.style.display = '';
        if (lblEl)  lblEl.textContent    = `Loading ${key}…`;
        try {
            if (this._callback) await this._callback(src);
            this.close();
        } catch (e) {
            if (loadEl) loadEl.style.display = 'none';
            if (lblEl)  lblEl.textContent    = '⚠ ' + e.message;
            this._loading = false;
        }
    },

    // ── Close ─────────────────────────────────────────────────────
    close() {
        const modal = document.getElementById('sic-modal');
        if (modal?._keyHandler) document.removeEventListener('keydown', modal._keyHandler);
        modal?.remove();
        document.getElementById('sic-color-native')?.remove();
        this._loading = false; this._callback = null;
    },

    _closeOnOverlay(e) {
        if (e.target.classList.contains('sic-overlay')) this.close();
    },
};
