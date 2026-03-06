// ============================================================
// UI
// ============================================================

const UI = {
    init() {
        this.buildGlobalPanel();
        this.buildHeaderPanel();
        this.buildFooterPanel();
        this.buildRTLPanel();
        this.buildImagesPanel();
        this.buildFixesPanel();
        this.buildTemplateGrid();
        this.setupEventListeners();
        this.updateStatusBar();
    },

    // ──────────────────────────────────────────────
    // ACCORDION TOGGLE
    // ──────────────────────────────────────────────
    toggleAccordion(id) {
        const acc = document.getElementById('acc-' + id);
        if (!acc) return;
        acc.classList.toggle('open');
    },

    // ──────────────────────────────────────────────
    // TAB SWITCHING
    // ──────────────────────────────────────────────
    showTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const tab = document.getElementById('tab-' + tabId);
        const btn = document.querySelector(`[data-tab="${tabId}"]`);
        if (tab) tab.classList.add('active');
        if (btn) btn.classList.add('active');
    },

    // ──────────────────────────────────────────────
    // GLOBAL PANEL
    // ──────────────────────────────────────────────
    buildGlobalPanel() {
        const s = State.get().global;
        const el = document.getElementById('acc-body-global');
        if (!el) return;

        el.innerHTML = `
            ${Utils.rangeHTML('Email Width', 'g-width', 320, 800, s.width)}

            <div class="ctrl">
                <label>Base Font</label>
                <select id="g-font">
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"             ${s.font.includes('Segoe UI')       ?'selected':''}>Segoe UI (Recommended)</option>
                    <option value="Arial, Helvetica, sans-serif"                                ${s.font.includes('Arial')          ?'selected':''}>Arial</option>
                    <option value="'Helvetica Neue', Helvetica, Arial, sans-serif"              ${s.font.includes('Helvetica Neue') ?'selected':''}>Helvetica Neue</option>
                    <option value="'Tahoma', Geneva, sans-serif"                                ${s.font.includes('Tahoma')         ?'selected':''}>Tahoma</option>
                    <option value="Verdana, Geneva, Tahoma, sans-serif"                         ${s.font.includes('Verdana')        ?'selected':''}>Verdana</option>
                    <option value="Georgia, 'Times New Roman', serif"                           ${s.font.includes('Georgia')        ?'selected':''}>Georgia</option>
                    <option value="'Times New Roman', Times, serif"                             ${s.font.includes('Times New Roman')?'selected':''}>Times New Roman</option>
                    <option value="'Trebuchet MS', Helvetica, sans-serif"                       ${s.font.includes('Trebuchet')      ?'selected':''}>Trebuchet MS</option>
                    <option value="Garamond, 'Times New Roman', serif"                          ${s.font.includes('Garamond')       ?'selected':''}>Garamond</option>
                    <option value="'Palatino Linotype', 'Book Antiqua', Palatino, serif"        ${s.font.includes('Palatino')       ?'selected':''}>Palatino</option>
                    <option value="Cambria, Cochin, Georgia, Times, serif"                      ${s.font.includes('Cambria')        ?'selected':''}>Cambria</option>
                    <option value="Calibri, Candara, Segoe, 'Segoe UI', sans-serif"            ${s.font.includes('Calibri')        ?'selected':''}>Calibri</option>
                    <option value="'Gill Sans', 'Gill Sans MT', Calibri, sans-serif"            ${s.font.includes('Gill Sans')      ?'selected':''}>Gill Sans</option>
                    <option value="'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" ${s.font.includes('Franklin')       ?'selected':''}>Franklin Gothic</option>
                    <option value="'Lucida Sans Unicode', 'Lucida Grande', sans-serif"          ${s.font.includes('Lucida')         ?'selected':''}>Lucida Sans</option>
                    <option value="'Courier New', Courier, monospace"                           ${s.font.includes('Courier')        ?'selected':''}>Courier New (Mono)</option>
                </select>
            </div>

            <div class="ctrl">
                <label>Direction</label>
                <div class="btn-group" id="g-dir-group">
                    <button onclick="UI.setDirection('ltr')"  class="${s.direction === 'ltr'  ? 'active' : ''}">LTR</button>
                    <button onclick="UI.setDirection('rtl')"  class="${s.direction === 'rtl'  ? 'active' : ''}">RTL (Arabic)</button>
                    <button onclick="UI.setDirection('auto')" class="${s.direction === 'auto' ? 'active' : ''}">Auto</button>
                </div>
            </div>

            ${Utils.colorRowHTML('Outer Background', 'g-bg-outer', 'g-bg-outer-hex', s.bgOuter)}
            ${Utils.colorRowHTML('Email Background', 'g-bg-inner', 'g-bg-inner-hex', s.bgInner)}

            <div class="ctrl">
                <label>Color Presets</label>
                <div class="color-presets">
                    <div class="color-preset" style="background:#2563eb;" title="Blue"   onclick="UI.applyColorPreset('blue')"></div>
                    <div class="color-preset" style="background:#059669;" title="Green"  onclick="UI.applyColorPreset('green')"></div>
                    <div class="color-preset" style="background:#7c3aed;" title="Purple" onclick="UI.applyColorPreset('purple')"></div>
                    <div class="color-preset" style="background:#dc2626;" title="Red"    onclick="UI.applyColorPreset('red')"></div>
                    <div class="color-preset" style="background:#ea580c;" title="Orange" onclick="UI.applyColorPreset('orange')"></div>
                    <div class="color-preset" style="background:#0f172a;" title="Dark"   onclick="UI.applyColorPreset('dark')"></div>
                    <div class="color-preset" style="background:#0891b2;" title="Teal"   onclick="UI.applyColorPreset('teal')"></div>
                    <div class="color-preset" style="background:#be185d;" title="Pink"   onclick="UI.applyColorPreset('pink')"></div>
                    <div class="color-preset" style="background:#854d0e;" title="Brown"  onclick="UI.applyColorPreset('brown')"></div>
                    <div class="color-preset" style="background:#4d7c0f;" title="Olive"  onclick="UI.applyColorPreset('olive')"></div>
                </div>
            </div>
        `;

        Utils.setupRange('g-width', 'px', v => {
            State.updateGlobal({ width: v });
            document.getElementById('info-width').textContent = v + 'px';
            Preview.render();
        });

        Utils.setupColorSync('g-bg-outer', 'g-bg-outer-hex', v => { State.updateGlobal({ bgOuter: v }); Preview.render(); });
        Utils.setupColorSync('g-bg-inner', 'g-bg-inner-hex', v => { State.updateGlobal({ bgInner: v }); Preview.render(); });

        const fontSel = document.getElementById('g-font');
        if (fontSel) fontSel.addEventListener('change', e => { State.updateGlobal({ font: e.target.value }); Preview.render(); });
    },

    setDirection(dir) {
        State.updateGlobal({ direction: dir });
        document.querySelectorAll('#g-dir-group button').forEach(b => b.classList.remove('active'));
        const map = { ltr: 0, rtl: 1, auto: 2 };
        const btns = document.querySelectorAll('#g-dir-group button');
        if (btns[map[dir]]) btns[map[dir]].classList.add('active');
        document.getElementById('info-dir').textContent = dir.toUpperCase();
        Preview.render();
        Utils.showToast('Direction: ' + dir.toUpperCase(), 'info');
    },

    applyColorPreset(preset) {
        const presets = {
            blue:   { bg: '#2563eb', outer: '#eff6ff' },
            green:  { bg: '#059669', outer: '#f0fdf4' },
            purple: { bg: '#7c3aed', outer: '#faf5ff' },
            red:    { bg: '#dc2626', outer: '#fef2f2' },
            orange: { bg: '#ea580c', outer: '#fff7ed' },
            dark:   { bg: '#0f172a', outer: '#f8fafc' },
            teal:   { bg: '#0891b2', outer: '#ecfeff' },
            pink:   { bg: '#be185d', outer: '#fdf2f8' },
            brown:  { bg: '#854d0e', outer: '#fefce8' },
            olive:  { bg: '#4d7c0f', outer: '#f7fee7' }
        };
        const p = presets[preset];
        if (!p) return;
        State.updateHeader({ bg: p.bg });
        State.updateGlobal({ bgOuter: p.outer });
        this.buildGlobalPanel();
        this.buildHeaderPanel();
        Preview.render();
        Utils.showToast('Applied ' + preset + ' preset', 'success');
    },

    // ──────────────────────────────────────────────
    // HEADER PANEL
    // ──────────────────────────────────────────────
    buildHeaderPanel() {
        const h = State.get().header;
        const el = document.getElementById('acc-body-header');
        if (!el) return;

        el.innerHTML = `
            <div class="ctrl">
                <label>Logo / Header Image</label>
                <div class="img-drop" onclick="UI.uploadHeaderLogo()">
                    ${h.logo ? `<img src="${h.logo}" style="max-height:60px;display:block;margin:0 auto;">` : '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>'}
                </div>
                <input type="text" id="h-logo-url" placeholder="Or paste image URL" value="${h.logo}">
                ${h.logo ? `<button class="ctrl-btn" style="margin-top:6px;" onclick="UI.clearHeaderLogo()"><i class="fas fa-times"></i> Remove Logo</button>` : ''}
            </div>

            <div class="ctrl">
                <label>Header Title Text</label>
                <input type="text" id="h-text" value="${h.text}">
            </div>

            <div class="row2">
                <div class="ctrl">
                    <label>Alignment</label>
                    <select id="h-align">
                        <option value="center" ${h.align === 'center' ? 'selected' : ''}>Center</option>
                        <option value="left" ${h.align === 'left' ? 'selected' : ''}>Left</option>
                        <option value="right" ${h.align === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
                <div></div>
            </div>

            ${Utils.colorRowHTML('Background Color', 'h-bg', 'h-bg-hex', h.bg)}
            ${Utils.colorRowHTML('Text Color', 'h-text-color', 'h-text-color-hex', h.textColor)}

            <div class="row2">
                <div class="ctrl">
                    <label>Padding Top/Bottom</label>
                    <input type="number" id="h-pad-v" value="${h.paddingTop}" min="0" max="120">
                </div>
                <div class="ctrl">
                    <label>Padding Left/Right</label>
                    <input type="number" id="h-pad-h" value="${h.paddingLeft}" min="0" max="120">
                </div>
            </div>
        `;

        Utils.setupColorSync('h-bg', 'h-bg-hex', v => { State.updateHeader({ bg: v }); Preview.render(); });
        Utils.setupColorSync('h-text-color', 'h-text-color-hex', v => { State.updateHeader({ textColor: v }); Preview.render(); });

        const htext = document.getElementById('h-text');
        if (htext) htext.addEventListener('input', e => { State.updateHeader({ text: e.target.value }); Preview.render(); });

        const halign = document.getElementById('h-align');
        if (halign) halign.addEventListener('change', e => { State.updateHeader({ align: e.target.value }); Preview.render(); });

        const logoUrl = document.getElementById('h-logo-url');
        if (logoUrl) logoUrl.addEventListener('input', e => { State.updateHeader({ logo: e.target.value }); Preview.render(); });

        const padV = document.getElementById('h-pad-v');
        if (padV) padV.addEventListener('input', e => {
            const v = parseInt(e.target.value) || 0;
            State.updateHeader({ paddingTop: v, paddingBottom: v });
            Preview.render();
        });

        const padH = document.getElementById('h-pad-h');
        if (padH) padH.addEventListener('input', e => {
            const v = parseInt(e.target.value) || 0;
            State.updateHeader({ paddingLeft: v, paddingRight: v });
            Preview.render();
        });
    },

    uploadHeaderLogo() {
        Utils.handleImageUpload(data => {
            State.updateHeader({ logo: data });
            this.buildHeaderPanel();
            Preview.render();
            Utils.showToast('Logo uploaded', 'success');
        });
    },

    clearHeaderLogo() {
        State.updateHeader({ logo: '' });
        this.buildHeaderPanel();
        Preview.render();
    },

    // ──────────────────────────────────────────────
    // FOOTER PANEL
    // ──────────────────────────────────────────────
    buildFooterPanel() {
        const f = State.get().footer;
        const el = document.getElementById('acc-body-footer');
        if (!el) return;

        el.innerHTML = `
            <div class="ctrl">
                <label>Footer Content</label>
                <textarea id="f-text" rows="4">${f.text}</textarea>
                <div class="info-box blue" style="margin-top:6px;">
                    <i class="fas fa-info-circle"></i>
                    <span>Use new lines for line breaks. HTML tags are also supported.</span>
                </div>
            </div>

            ${Utils.colorRowHTML('Background', 'f-bg', 'f-bg-hex', f.bg)}
            ${Utils.colorRowHTML('Text Color', 'f-color', 'f-color-hex', f.color)}

            <div class="row2">
                <div class="ctrl">
                    <label>Padding V</label>
                    <input type="number" id="f-pad-v" value="${f.paddingTop}" min="0" max="100">
                </div>
                <div class="ctrl">
                    <label>Padding H</label>
                    <input type="number" id="f-pad-h" value="${f.paddingLeft}" min="0" max="100">
                </div>
            </div>

            <div class="row2">
                <div class="ctrl">
                    <label>Font Size</label>
                    <input type="number" id="f-fontsize" value="${f.fontSize}" min="10" max="22">
                </div>
                <div class="ctrl">
                    <label>Line Height</label>
                    <input type="number" id="f-lh" value="${f.lineHeight}" min="1" max="3" step="0.1">
                </div>
            </div>
        `;

        Utils.setupColorSync('f-bg', 'f-bg-hex', v => { State.updateFooter({ bg: v }); Preview.render(); });
        Utils.setupColorSync('f-color', 'f-color-hex', v => { State.updateFooter({ color: v }); Preview.render(); });

        const ftext = document.getElementById('f-text');
        if (ftext) ftext.addEventListener('input', e => { State.updateFooter({ text: e.target.value }); Preview.render(); });

        const fpv = document.getElementById('f-pad-v');
        if (fpv) fpv.addEventListener('input', e => {
            const v = parseInt(e.target.value) || 0;
            State.updateFooter({ paddingTop: v, paddingBottom: v });
            Preview.render();
        });

        const fph = document.getElementById('f-pad-h');
        if (fph) fph.addEventListener('input', e => {
            const v = parseInt(e.target.value) || 0;
            State.updateFooter({ paddingLeft: v, paddingRight: v });
            Preview.render();
        });

        const ffs = document.getElementById('f-fontsize');
        if (ffs) ffs.addEventListener('input', e => { State.updateFooter({ fontSize: parseInt(e.target.value) || 14 }); Preview.render(); });

        const flh = document.getElementById('f-lh');
        if (flh) flh.addEventListener('input', e => { State.updateFooter({ lineHeight: parseFloat(e.target.value) || 1.6 }); Preview.render(); });
    },

    // ──────────────────────────────────────────────
    // RTL PANEL
    // ──────────────────────────────────────────────
    buildRTLPanel() {
        const g = State.get().global;
        const el = document.getElementById('acc-body-rtl');
        if (!el) return;

        el.innerHTML = `
            <div class="ctrl">
                <label>Arabic Font</label>
                <select id="g-arabic-font">
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" ${g.arabicFont.includes('Segoe UI') ? 'selected' : ''}>Segoe UI</option>
                    <option value="'Traditional Arabic', serif" ${g.arabicFont.includes('Traditional Arabic') ? 'selected' : ''}>Traditional Arabic</option>
                    <option value="Arial, sans-serif" ${g.arabicFont.includes('Arial') ? 'selected' : ''}>Arial</option>
                </select>
            </div>
            <div class="ctrl">
                <label>Line Height</label>
                <input type="number" id="g-arabic-lh" value="${g.arabicLineHeight}" min="1" max="3" step="0.1">
            </div>
            <div class="info-box yellow">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Test RTL emails in Outlook Arabic version for best results. Set Direction to RTL in Global settings.</span>
            </div>
        `;

        const af = document.getElementById('g-arabic-font');
        if (af) af.addEventListener('change', e => { State.updateGlobal({ arabicFont: e.target.value }); Preview.render(); });

        const alh = document.getElementById('g-arabic-lh');
        if (alh) alh.addEventListener('input', e => { State.updateGlobal({ arabicLineHeight: parseFloat(e.target.value) || 1.8 }); Preview.render(); });
    },

    // ──────────────────────────────────────────────
    // IMAGES PANEL
    // ──────────────────────────────────────────────
    buildImagesPanel() {
        const im = State.get().images;
        const el = document.getElementById('acc-body-images');
        if (!el) return;

        el.innerHTML = `
            <div class="ctrl">
                <label>Max Image Width</label>
                <select id="img-max-w">
                    <option value="600" ${im.maxWidth == 600 ? 'selected' : ''}>600px — Full width</option>
                    <option value="500" ${im.maxWidth == 500 ? 'selected' : ''}>500px</option>
                    <option value="400" ${im.maxWidth == 400 ? 'selected' : ''}>400px — Medium</option>
                    <option value="300" ${im.maxWidth == 300 ? 'selected' : ''}>300px — Small</option>
                </select>
            </div>
            <div class="info-box blue">
                <i class="fas fa-info-circle"></i>
                <span>Use hosted URLs for best email client compatibility. Avoid large base64 embeds.</span>
            </div>
        `;

        const mw = document.getElementById('img-max-w');
        if (mw) mw.addEventListener('change', e => { State.updateSection('images', { maxWidth: parseInt(e.target.value) }); });
    },

    // ──────────────────────────────────────────────
    // FIXES PANEL
    // ──────────────────────────────────────────────
    buildFixesPanel() {
        const fixes = State.get().fixes;
        const el = document.getElementById('acc-body-fixes');
        if (!el) return;

        el.innerHTML = `
            <div class="toggle-row">
                <label>Outlook VML Buttons</label>
                <label class="toggle">
                    <input type="checkbox" id="fix-outlook" ${fixes.outlook ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-row">
                <label>iOS Link Color Fix</label>
                <label class="toggle">
                    <input type="checkbox" id="fix-ios" ${fixes.ios ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-row">
                <label>Gmail Rendering Fix</label>
                <label class="toggle">
                    <input type="checkbox" id="fix-gmail" ${fixes.gmail ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="info-box green">
                <i class="fas fa-check-circle"></i>
                <span>All email output uses 100% inline CSS for maximum compatibility.</span>
            </div>
        `;

        ['outlook', 'ios', 'gmail'].forEach(k => {
            const el = document.getElementById('fix-' + k);
            if (el) el.addEventListener('change', e => { State.updateSection('fixes', { [k]: e.target.checked }); Preview.render(); });
        });
    },

    // ──────────────────────────────────────────────
    // TEMPLATE GRID
    // ──────────────────────────────────────────────
    buildTemplateGrid() {
        const grid = document.getElementById('template-grid');
        if (!grid) return;

        grid.innerHTML = Object.entries(window.emailTemplates || {}).map(([key, tpl]) => `
            <div class="tmpl-card" onclick="UI.loadTemplate('${key}')">
                <i class="${tpl.icon}"></i>
                <span class="tmpl-name">${tpl.name}</span>
                <span class="tmpl-desc">${tpl.desc}</span>
            </div>
        `).join('') + `
            <div class="tmpl-card" onclick="UI.clearAll()" style="border-style:dashed;">
                <i class="fas fa-trash-alt" style="color:var(--danger);"></i>
                <span class="tmpl-name">Clear All</span>
                <span class="tmpl-desc">Start fresh</span>
            </div>
        `;
    },

    loadTemplate(key) {
        const tpl = window.emailTemplates[key];
        if (!tpl) return;
        State.applyTemplate(tpl);
        this.rebuildAll();
        Preview.render();
        Utils.showToast('Loaded: ' + tpl.name, 'success');
        UI.showTab('content');
    },

    clearAll() {
        if (!confirm('Clear all blocks and reset to default?')) return;
        State.reset();
        this.rebuildAll();
        Preview.render();
        Utils.showToast('Cleared — fresh start', 'info');
    },

    rebuildAll() {
        this.buildGlobalPanel();
        this.buildHeaderPanel();
        this.buildFooterPanel();
        this.buildRTLPanel();
        this.buildImagesPanel();
        this.buildFixesPanel();
        Blocks.render();
        this.updateStatusBar();
    },

    updateStatusBar() {
        const s = State.get();
        const w = document.getElementById('info-width');
        const d = document.getElementById('info-dir');
        if (w) w.textContent = s.global.width + 'px';
        if (d) d.textContent = s.global.direction.toUpperCase();
    },

    // ──────────────────────────────────────────────
    // EVENT LISTENERS
    // ──────────────────────────────────────────────
    setupEventListeners() {
        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', e => this.showTab(e.currentTarget.dataset.tab));
        });

        // Add block buttons
        document.querySelectorAll('.add-btn').forEach(btn => {
            btn.addEventListener('click', e => Blocks.addBlock(e.currentTarget.dataset.type));
        });

        // Device preview
        document.querySelectorAll('.dev-btn').forEach(btn => {
            btn.addEventListener('click', e => this.setDevice(e.currentTarget.dataset.device));
        });

        // Header buttons
        document.getElementById('save-btn')?.addEventListener('click', () => Export.save());
        document.getElementById('load-btn')?.addEventListener('click', () => Export.load());
        document.getElementById('copy-html-btn')?.addEventListener('click', () => Export.copyHTML());
        document.getElementById('copy-visual-btn')?.addEventListener('click', () => Export.copyVisual());
        document.getElementById('export-btn')?.addEventListener('click', () => Export.download());
        document.getElementById('refresh-btn')?.addEventListener('click', () => Preview.render());
        document.getElementById('file-input')?.addEventListener('change', e => Export.handleFile(e));
    },

    setDevice(device) {
        const wrap = document.getElementById('frame-wrap');
        const deviceMap = { desktop: '100%', tablet: '768px', mobile: '390px' };
        if (wrap) wrap.style.maxWidth = deviceMap[device] || '100%';

        document.querySelectorAll('.dev-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-device="${device}"]`)?.classList.add('active');

        const info = document.getElementById('info-device');
        if (info) info.textContent = device.charAt(0).toUpperCase() + device.slice(1);
    }
};

// Global function for HTML onclick
function toggleAccordion(id) {
    UI.toggleAccordion(id);
}
