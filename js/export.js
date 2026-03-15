// ============================================================
// EXPORT  — v5.9
// ============================================================

const Export = {
    save() {
        // Show a small dialog to collect template metadata before exporting
        const s = State.get();
        // Pre-fill from existing state meta if present
        const prev = s._meta || {};

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:3000;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;';

        overlay.innerHTML = `
        <div style="background:#fff;border-radius:14px;padding:28px 28px 22px;width:100%;max-width:460px;margin:auto;box-shadow:0 20px 60px rgba(0,0,0,0.25);font-family:inherit;">
            <h3 style="margin:0 0 18px;font-size:17px;color:#0f172a;display:flex;align-items:center;gap:8px;">
                <i class="fas fa-save" style="color:#2563eb;"></i> Save Template
            </h3>

            <div style="margin-bottom:13px;">
                <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;">Template Name <span style="color:#ef4444;">*</span></label>
                <input id="sm-name" type="text" value="${prev.name || ''}" placeholder="e.g. Monthly Newsletter"
                    style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;outline:none;">
            </div>

            <div style="margin-bottom:13px;">
                <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;">Description <span style="color:#94a3b8;font-weight:400;">(optional)</span></label>
                <input id="sm-desc" type="text" value="${prev.desc || ''}" placeholder="e.g. With product highlights"
                    style="width:100%;box-sizing:border-box;padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;outline:none;">
            </div>

            <!-- Icon + Color row -->
            <div style="margin-bottom:13px;">
                <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;">
                    Icon
                    <span style="color:#94a3b8;font-weight:400;"> — pick below or type any </span>
                    <a href="https://fontawesome.com/icons?s=solid&m=free" target="_blank"
                        style="color:#2563eb;font-size:11px;text-decoration:none;font-weight:500;">
                        <i class="fas fa-external-link-alt"></i> Browse all icons
                    </a>
                </label>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <div style="width:36px;height:36px;border-radius:8px;background:#2563eb;display:flex;align-items:center;justify-content:center;flex-shrink:0;" id="sm-icon-preview-box">
                        <i id="sm-icon-preview-i" class="${prev.icon || 'fas fa-envelope'}" style="font-size:16px;color:#fff;"></i>
                    </div>
                    <input id="sm-icon" type="text" value="${prev.icon || ''}" placeholder="fas fa-envelope"
                        style="flex:1;padding:9px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;outline:none;box-sizing:border-box;">
                </div>
                <!-- Search + scrollable grid -->
                <input id="sm-icon-search" type="text" placeholder="Search icons…"
                    style="width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #cbd5e1;border-radius:7px;font-size:12px;outline:none;margin-bottom:6px;">
                <div id="sm-icon-grid"
                    style="display:grid;grid-template-columns:repeat(8,1fr);gap:3px;max-height:130px;overflow-y:auto;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:6px;">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
                <div style="display:none;"><!-- icon col moved above --></div>
                <div>
                    <label style="display:block;font-size:12px;font-weight:600;color:#475569;margin-bottom:5px;">Thumb Color</label>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <input id="sm-color-pick" type="color" value="${prev.thumbColor || (s.header && s.header.grad1) || '#2563eb'}"
                            style="width:42px;height:38px;padding:2px;border:1px solid #cbd5e1;border-radius:8px;cursor:pointer;background:none;">
                        <input id="sm-color" type="text" value="${prev.thumbColor || (s.header && s.header.grad1) || '#2563eb'}"
                            style="flex:1;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;outline:none;">
                    </div>
                    <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap;">
                        ${['#2563eb','#059669','#7c3aed','#dc2626','#d97706','#0f172a','#0891b2','#be185d']
                            .map(c => `<div onclick="document.getElementById('sm-color').value='${c}';document.getElementById('sm-color-pick').value='${c}';Export._previewIcon&&Export._previewIcon();;"
                                style="width:20px;height:20px;border-radius:4px;background:${c};cursor:pointer;border:2px solid transparent;" title="${c}"></div>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Live preview of the card -->
            <div style="background:#f1f5f9;border-radius:10px;padding:12px;margin-bottom:18px;display:flex;align-items:center;gap:10px;" id="sm-preview-card">
                <div id="sm-thumb" style="width:42px;height:42px;border-radius:8px;background:${prev.thumbColor || (s.header && s.header.grad1) || '#2563eb'};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                    <i id="sm-thumb-icon" class="${prev.icon || 'fas fa-envelope'}" style="font-size:18px;color:#fff;"></i>
                </div>
                <div>
                    <div id="sm-preview-name" style="font-size:13px;font-weight:600;color:#0f172a;">${prev.name || 'Template Name'}</div>
                    <div id="sm-preview-desc" style="font-size:11px;color:#64748b;">${prev.desc || 'Description'}</div>
                    <span style="font-size:10px;background:#dbeafe;color:#1e40af;padding:2px 6px;border-radius:4px;font-weight:600;">My Template</span>
                </div>
            </div>

            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button id="sm-cancel" type="button"
                    style="padding:9px 20px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;color:#475569;">
                    Cancel
                </button>
                <button id="sm-save" type="button"
                    style="padding:9px 24px;border:none;border-radius:8px;background:#2563eb;color:#fff;cursor:pointer;font-size:14px;font-weight:600;">
                    <i class="fas fa-download"></i> Export JSON
                </button>
            </div>
        </div>`;

        document.body.appendChild(overlay);

        // ── Icon catalogue — categorised FA6 Free Solid icons ──────────
        const ICONS = [
            // Email & Communication
            'fa-envelope','fa-envelope-open','fa-paper-plane','fa-inbox','fa-at','fa-reply','fa-comment','fa-comments','fa-message','fa-phone','fa-mobile-alt','fa-bell','fa-bell-slash','fa-bullhorn','fa-broadcast-tower',
            // Content & Media
            'fa-newspaper','fa-book','fa-book-open','fa-bookmark','fa-file','fa-file-alt','fa-file-pdf','fa-file-image','fa-file-video','fa-file-code','fa-clipboard','fa-edit','fa-pen','fa-pencil-alt','fa-feather',
            // Commerce & Finance
            'fa-tag','fa-tags','fa-shopping-bag','fa-shopping-cart','fa-shopping-basket','fa-store','fa-credit-card','fa-wallet','fa-dollar-sign','fa-euro-sign','fa-receipt','fa-file-invoice','fa-file-invoice-dollar','fa-percentage','fa-gift',
            // Layout & Design
            'fa-columns','fa-table','fa-images','fa-image','fa-photo-video','fa-th','fa-th-large','fa-list','fa-list-alt','fa-layer-group','fa-object-group','fa-vector-square','fa-crop','fa-palette','fa-paint-brush',
            // People & Business
            'fa-user','fa-users','fa-user-tie','fa-handshake','fa-building','fa-briefcase','fa-id-card','fa-address-card','fa-sitemap','fa-project-diagram','fa-network-wired','fa-hands-helping','fa-award','fa-certificate','fa-medal',
            // Events & Time
            'fa-calendar','fa-calendar-alt','fa-calendar-check','fa-clock','fa-history','fa-stopwatch','fa-hourglass','fa-flag','fa-map-marker-alt','fa-map','fa-location-arrow','fa-compass','fa-route','fa-plane','fa-hotel',
            // Tech & Tools
            'fa-cog','fa-cogs','fa-tools','fa-wrench','fa-code','fa-laptop','fa-desktop','fa-server','fa-database','fa-cloud','fa-cloud-upload-alt','fa-cloud-download-alt','fa-wifi','fa-lock','fa-shield-alt',
            // Alerts & Status
            'fa-check-circle','fa-times-circle','fa-exclamation-circle','fa-exclamation-triangle','fa-info-circle','fa-question-circle','fa-ban','fa-eye','fa-eye-slash','fa-thumbs-up','fa-thumbs-down','fa-heart','fa-star','fa-bolt','fa-fire',
            // Actions & Navigation
            'fa-search','fa-filter','fa-sort','fa-download','fa-upload','fa-share','fa-link','fa-external-link-alt','fa-arrow-right','fa-arrow-left','fa-chevron-right','fa-expand','fa-compress','fa-sync','fa-redo',
            // Misc
            'fa-globe','fa-language','fa-newspaper','fa-rss','fa-podcast','fa-music','fa-film','fa-gamepad','fa-graduation-cap','fa-flask','fa-leaf','fa-sun','fa-moon','fa-umbrella','fa-rocket'
        ];

        const buildIconGrid = (filter) => {
            const grid = document.getElementById('sm-icon-grid');
            if (!grid) return;
            const q = (filter || '').toLowerCase();
            const list = q ? ICONS.filter(ic => ic.includes(q)) : ICONS;
            grid.innerHTML = list.map(ic => {
                const cls = 'fas ' + ic;
                return `<button type="button" title="${ic}"
                    onclick="Export._pickIcon('${cls}')"
                    style="aspect-ratio:1;display:flex;align-items:center;justify-content:center;border:1px solid #e2e8f0;border-radius:6px;background:#fff;cursor:pointer;font-size:14px;color:#475569;padding:6px;transition:all 0.1s;"
                    onmouseover="this.style.background='#eff6ff';this.style.borderColor='#93c5fd';this.style.color='#2563eb';"
                    onmouseout="this.style.background='#fff';this.style.borderColor='#e2e8f0';this.style.color='#475569';">
                    <i class="${cls}"></i></button>`;
            }).join('') || '<div style="grid-column:1/-1;text-align:center;padding:16px;color:#94a3b8;font-size:12px;">No icons found</div>';
        };

        // Pick icon handler
        Export._pickIcon = (cls) => {
            document.getElementById('sm-icon').value = cls;
            document.getElementById('sm-icon-preview-i').className = cls;
            syncPreview();
        };

        buildIconGrid('');

        document.getElementById('sm-icon-search').addEventListener('input', function() {
            buildIconGrid(this.value.trim());
        });

        // Sync the small icon preview box when user types in the input
        document.getElementById('sm-icon').addEventListener('input', function() {
            const val = this.value.trim() || 'fas fa-envelope';
            const el = document.getElementById('sm-icon-preview-i');
            if (el) el.className = val;
            syncPreview();
        });

        // ── Live card preview ──────────────────────────────────────────
        const syncPreview = () => {
            const name  = document.getElementById('sm-name').value.trim();
            const desc  = document.getElementById('sm-desc').value.trim();
            const icon  = document.getElementById('sm-icon').value.trim() || 'fas fa-envelope';
            const color = document.getElementById('sm-color').value.trim() || '#2563eb';
            const thumb = document.getElementById('sm-thumb');
            if (thumb) thumb.style.background = color;
            const tIcon = document.getElementById('sm-thumb-icon');
            if (tIcon) tIcon.className = icon;
            const prevBox = document.getElementById('sm-icon-preview-box');
            if (prevBox) prevBox.style.background = color;
            const prevI = document.getElementById('sm-icon-preview-i');
            if (prevI) prevI.className = icon;
            const pName = document.getElementById('sm-preview-name');
            if (pName) pName.textContent = name || 'Template Name';
            const pDesc = document.getElementById('sm-preview-desc');
            if (pDesc) pDesc.textContent = desc || 'Description';
        };
        Export._previewIcon = syncPreview;

        ['sm-name','sm-desc','sm-color'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', syncPreview);
        });
        document.getElementById('sm-color-pick').addEventListener('input', function() {
            document.getElementById('sm-color').value = this.value;
            syncPreview();
        });
        document.getElementById('sm-color').addEventListener('input', function() {
            if (/^#[0-9a-f]{6}$/i.test(this.value)) {
                document.getElementById('sm-color-pick').value = this.value;
            }
            syncPreview();
        });

        // Cancel
        document.getElementById('sm-cancel').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) document.body.removeChild(overlay);
        });

        // Save
        document.getElementById('sm-save').addEventListener('click', () => {
            const name = document.getElementById('sm-name').value.trim();
            if (!name) {
                document.getElementById('sm-name').style.borderColor = '#ef4444';
                document.getElementById('sm-name').focus();
                return;
            }
            const meta = {
                name,
                desc:       document.getElementById('sm-desc').value.trim(),
                icon:       document.getElementById('sm-icon').value.trim() || 'fas fa-envelope',
                thumbColor: document.getElementById('sm-color').value.trim() || '#2563eb'
            };
            // Persist meta for Save dialog pre-fill (stored separately from email state)
            State.data._meta = meta;
            try { localStorage.setItem('ebp4_meta', JSON.stringify(meta)); } catch(e) {}
            State.save();

            // ── Build clean state copy — strip _meta so it doesn't pollute exports ──
            const rawState  = State.get();
            const cleanState = Object.assign({}, rawState);
            delete cleanState._meta;  // _meta is internal UI state, not email data

            const payload = {
                version:    '5.9',
                savedAt:    new Date().toISOString(),
                by:         'AHMOS Email Builder Pro',
                name:       meta.name,
                desc:       meta.desc,
                icon:       meta.icon,
                thumbColor: meta.thumbColor,
                state:      cleanState
            };

            // key: ASCII-only slug for localStorage (object key must be stable ASCII)
            // If name is fully non-ASCII (e.g. Arabic), fall back to timestamp
            const asciiSlug = meta.name.replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+/g,'-').replace(/^-|-$/g,'');
            const key = asciiSlug || ('template-' + Date.now());
            UI.registerUserTemplate(key, payload);

            // ── Also add to index.json in myTemplates folder (for folder-based loading) ──
            Export._updateFolderIndex(key + '.json');

            // ── Download the .json file — use the actual name for the filename ──
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            // Use the real name (supports Arabic & mixed) for the download filename
            a.download = meta.name.trim() + '.json';
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(overlay);
            Utils.showToast('✅ Saved & added to My Templates: ' + meta.name, 'success');
        });

        // Focus name field
        setTimeout(() => document.getElementById('sm-name').focus(), 50);
    },

    load() {
        document.getElementById('file-input').click();
    },

    handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        event.target.value = '';
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.state && data.state.global) {
                    // ── Apply state into builder ──────────────────────────
                    // Load the state but keep _meta clean (restore from file's top-level meta)
                    const loadedState = Object.assign({}, data.state);
                    delete loadedState._meta;  // clear any old _meta from the file
                    State.data = loadedState;
                    // Restore meta into state._meta for Save dialog pre-fill
                    State.data._meta = {
                        name:       data.name       || '',
                        desc:       data.desc       || '',
                        icon:       data.icon       || '',
                        thumbColor: data.thumbColor || ''
                    };
                    State.save();
                    UI.rebuildAll();
                    Preview.render();

                    // ── Register in My Templates section (with duplicate check) ──
                    const key = file.name.replace(/\.json$/i, '');
                    const tpl = data.state;
                    data.name       = data.name       || tpl.name       || key;
                    data.desc       = data.desc       || tpl.desc       || '';
                    data.icon       = data.icon       || tpl.icon       || UI.guessIcon(tpl);
                    data.thumbColor = data.thumbColor || tpl.thumbColor || UI.guessThumbColor(tpl);
                    const existingLoad = (window.myTemplates || {})[key];
                    if (existingLoad && !confirm('"' + data.name + '" already exists in My Templates.\nReplace it?')) return;
                    UI.registerUserTemplate(key, data);

                    Utils.showToast('✅ Loaded & added to My Templates: ' + data.name, 'success');
                } else {
                    Utils.showToast('Invalid template file', 'error');
                }
            } catch (err) {
                Utils.showToast('Error loading file', 'error');
            }
        };
        reader.readAsText(file);
    },

    // Track filenames in index.json (best-effort, requires a writable server)
    // In a static/local setup this is informational only — localStorage is the reliable store
    _updateFolderIndex(filename) {
        // Read the known index from localStorage, add entry, store back
        // This won't write to the actual file but keeps a client-side manifest
        try {
            const raw = localStorage.getItem('folderIndex') || '{"files":[]}';
            const idx = JSON.parse(raw);
            if (!idx.files.includes(filename)) {
                idx.files.push(filename);
                localStorage.setItem('folderIndex', JSON.stringify(idx));
            }
        } catch(e) {}
    },

    async copyHTML() {
        try {
            const html = Preview.generateHTML();
            await navigator.clipboard.writeText(html);
            Utils.showToast('HTML copied to clipboard!', 'success');
        } catch(e) {
            Utils.showToast('Could not copy HTML', 'error');
        }
    },

    async copyVisual() {
        try {
            const html = Preview.generateHTML();
            const blob = new Blob([html], { type: 'text/html' });
            await navigator.clipboard.write([new ClipboardItem({ 'text/html': blob })]);
            Utils.showToast('Visual email copied! Paste in Outlook/Gmail', 'success');
        } catch(e) {
            // Fallback to HTML copy
            this.copyHTML();
            Utils.showToast('Visual copy unsupported — HTML copied instead', 'warning');
        }
    },

    download() {
        const html = Preview.generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-${new Date().toISOString().slice(0,10)}.html`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.showToast('HTML file downloaded!', 'success');
    }
};
