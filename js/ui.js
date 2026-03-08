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
        this.loadMyTemplates(); // async — updates grid when done
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

            <div class="ctrl">
                <label>Container Position</label>
                <div class="btn-group" id="g-container-align-group">
                    <button onclick="UI.setContainerAlign('left')"   class="${(s.containerAlign||'center')==='left'   ? 'active' : ''}"><i class="fas fa-arrow-left"></i> Left</button>
                    <button onclick="UI.setContainerAlign('center')" class="${(s.containerAlign||'center')==='center' ? 'active' : ''}"><i class="fas fa-arrows-alt-h"></i> Center</button>
                    <button onclick="UI.setContainerAlign('right')"  class="${(s.containerAlign||'center')==='right'  ? 'active' : ''}">Right <i class="fas fa-arrow-right"></i></button>
                </div>
            </div>

            <div class="ctrl">
                <label>Outer Background</label>
                <div class="transparent-row">
                    <label class="toggle-transparent">
                        <input type="checkbox" id="g-bg-outer-trans" ${s.bgOuter === 'transparent' || !s.bgOuter ? 'checked' : ''}
                            onchange="UI.toggleOuterBgTransparent(this.checked)">
                        <span>Transparent / None</span>
                    </label>
                </div>
                <div id="g-bg-outer-wrap" style="${s.bgOuter === 'transparent' || !s.bgOuter ? 'opacity:0.35;pointer-events:none;' : ''}">
                    ${Utils.colorRowHTML('', 'g-bg-outer', 'g-bg-outer-hex', s.bgOuter === 'transparent' ? '#f1f5f9' : s.bgOuter)}
                </div>
            </div>
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

        Utils.setupColorSync('g-bg-outer', 'g-bg-outer-hex', v => {
            State.updateGlobal({ bgOuter: v });
            Preview.render();
        });
        Utils.setupColorSync('g-bg-inner', 'g-bg-inner-hex', v => { State.updateGlobal({ bgInner: v }); Preview.render(); });

        const fontSel = document.getElementById('g-font');
        if (fontSel) fontSel.addEventListener('change', e => { State.updateGlobal({ font: e.target.value }); Preview.render(); });
    },

    toggleOuterBgTransparent(isTransparent) {
        const val = isTransparent ? 'transparent' : (document.getElementById('g-bg-outer')?.value || '#f1f5f9');
        State.updateGlobal({ bgOuter: val });
        const wrap = document.getElementById('g-bg-outer-wrap');
        if (wrap) { wrap.style.opacity = isTransparent ? '0.35' : '1'; wrap.style.pointerEvents = isTransparent ? 'none' : ''; }
        Preview.render();
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

    setContainerAlign(val) {
        State.updateGlobal({ containerAlign: val });
        document.querySelectorAll('#g-container-align-group button').forEach(b => b.classList.remove('active'));
        const map = { left: 0, center: 1, right: 2 };
        const btns = document.querySelectorAll('#g-container-align-group button');
        if (btns[map[val]]) btns[map[val]].classList.add('active');
        Preview.render();
        Utils.showToast('Container: ' + val, 'info');
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
        const enabled = h.enabled !== false;
        const el = document.getElementById('acc-body-header');
        if (!el) return;

        el.innerHTML = `
            <div class="section-toggle-row">
                <span><i class="fas fa-heading"></i> Show Header</span>
                <label class="pill-toggle">
                    <input type="checkbox" id="h-enabled" ${enabled ? 'checked' : ''}>
                    <span class="pill-slider"></span>
                </label>
            </div>
            <div id="h-settings" style="${!enabled ? 'opacity:0.4;pointer-events:none;' : ''}">
                <div class="ctrl">
                    <label>Logo / Header Image</label>
                    <div class="img-drop" onclick="UI.uploadHeaderLogo()">
                        ${h.logo ? `<img src="${h.logo}" style="max-height:60px;display:block;margin:0 auto;">` : '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload logo</span>'}
                    </div>
                    <input type="text" id="h-logo-url" placeholder="Or paste image URL" value="${h.logo}">
                    ${h.logo ? `<button class="ctrl-btn" style="margin-top:6px;" onclick="UI.clearHeaderLogo()"><i class="fas fa-times"></i> Remove Logo</button>` : ''}
                </div>

                <div class="row2" id="h-logo-size-row" style="${h.logo ? '' : 'display:none;'}">
                    <div class="ctrl">
                        <label>Logo Width <span style="color:#94a3b8;font-weight:400;font-size:10px;">0 = auto</span></label>
                        <input type="number" id="h-logo-w" value="${h.logoWidth || 0}" min="0" max="600" placeholder="auto">
                    </div>
                    <div class="ctrl">
                        <label>Logo Height <span style="color:#94a3b8;font-weight:400;font-size:10px;">0 = auto</span></label>
                        <input type="number" id="h-logo-h" value="${h.logoHeight || 55}" min="0" max="400" placeholder="55">
                    </div>
                </div>

                <div class="ctrl">
                    <label>Header Title / Tagline</label>
                    <div id="h-rte-wrap"></div>
                </div>

                <div class="row2">
                    <div class="ctrl">
                        <label>Horizontal Align</label>
                        <div class="btn-group-sm">
                            <button title="Left"   id="h-align-left"   class="${(h.align||'center')==='left'  ?'active':''}" onclick="UI.setHeaderAlign('left')"><i class="fas fa-align-left"></i></button>
                            <button title="Center" id="h-align-center" class="${(h.align||'center')==='center'?'active':''}" onclick="UI.setHeaderAlign('center')"><i class="fas fa-align-center"></i></button>
                            <button title="Right"  id="h-align-right"  class="${(h.align||'center')==='right' ?'active':''}" onclick="UI.setHeaderAlign('right')"><i class="fas fa-align-right"></i></button>
                        </div>
                    </div>
                    <div class="ctrl">
                        <label>Vertical Align</label>
                        <div class="btn-group-sm">
                            <button title="Top"    class="${(h.verticalAlign||'middle')==='top'   ?'active':''}" onclick="UI.setHeaderVAlign('top')"><i class="fas fa-arrow-up"></i></button>
                            <button title="Middle" class="${(h.verticalAlign||'middle')==='middle'?'active':''}" onclick="UI.setHeaderVAlign('middle')"><i class="fas fa-minus"></i></button>
                            <button title="Bottom" class="${(h.verticalAlign||'middle')==='bottom'?'active':''}" onclick="UI.setHeaderVAlign('bottom')"><i class="fas fa-arrow-down"></i></button>
                        </div>
                    </div>
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
            </div>
        `;

        // Enable toggle
        const enabledEl = document.getElementById('h-enabled');
        if (enabledEl) enabledEl.addEventListener('change', e => {
            State.updateHeader({ enabled: e.target.checked });
            const wrap = document.getElementById('h-settings');
            if (wrap) { wrap.style.opacity = e.target.checked ? '1' : '0.4'; wrap.style.pointerEvents = e.target.checked ? '' : 'none'; }
            Preview.render();
        });

        Utils.setupColorSync('h-bg', 'h-bg-hex', v => { State.updateHeader({ bg: v }); Preview.render(); });
        Utils.setupColorSync('h-text-color', 'h-text-color-hex', v => { State.updateHeader({ textColor: v }); Preview.render(); });

        // Inject header RTE (key 10001)
        const hRteWrap = document.getElementById('h-rte-wrap');
        if (hRteWrap) {
            hRteWrap.innerHTML = Blocks.buildRTE({ content: '' }, 10001);
            Blocks.rteSetContent(10001, h.text || '');
            // Override rteSync for key 10001 → saves to header state
            UI._headerRteKey = 10001;
        }

        const logoUrl = document.getElementById('h-logo-url');
        if (logoUrl) logoUrl.addEventListener('input', e => {
            const val = e.target.value;
            State.updateHeader({ logo: val });
            // Show/hide size row
            const sizeRow = document.getElementById('h-logo-size-row');
            if (sizeRow) sizeRow.style.display = val ? '' : 'none';
            Preview.render();
        });

        const logoW = document.getElementById('h-logo-w');
        if (logoW) logoW.addEventListener('input', e => {
            State.updateHeader({ logoWidth: parseInt(e.target.value) || 0 });
            Preview.render();
        });

        const logoH = document.getElementById('h-logo-h');
        if (logoH) logoH.addEventListener('input', e => {
            State.updateHeader({ logoHeight: parseInt(e.target.value) || 0 });
            Preview.render();
        });

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

    setHeaderAlign(val) {
        State.updateHeader({ align: val });
        document.querySelectorAll('[id^="h-align-"]').forEach(b => b.classList.remove('active'));
        const btn = document.getElementById('h-align-' + val);
        if (btn) btn.classList.add('active');
        Preview.render();
    },

    setHeaderVAlign(val) {
        State.updateHeader({ verticalAlign: val });
        Preview.render();
        this.buildHeaderPanel();
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
        const enabled = f.enabled !== false;
        const el = document.getElementById('acc-body-footer');
        if (!el) return;

        el.innerHTML = `
            <div class="section-toggle-row">
                <span><i class="fas fa-shoe-prints"></i> Show Footer</span>
                <label class="pill-toggle">
                    <input type="checkbox" id="f-enabled" ${enabled ? 'checked' : ''}>
                    <span class="pill-slider"></span>
                </label>
            </div>
            <div id="f-settings" style="${!enabled ? 'opacity:0.4;pointer-events:none;' : ''}">
                <div class="ctrl">
                    <label>Footer Content</label>
                    <div id="f-rte-wrap"></div>
                </div>

                <div class="row2">
                    <div class="ctrl">
                        <label>Horizontal Align</label>
                        <div class="btn-group-sm">
                            <button title="Left"   class="${(f.align||'center')==='left'  ?'active':''}" onclick="UI.setFooterAlign('left')"><i class="fas fa-align-left"></i></button>
                            <button title="Center" class="${(f.align||'center')==='center'?'active':''}" onclick="UI.setFooterAlign('center')"><i class="fas fa-align-center"></i></button>
                            <button title="Right"  class="${(f.align||'center')==='right' ?'active':''}" onclick="UI.setFooterAlign('right')"><i class="fas fa-align-right"></i></button>
                        </div>
                    </div>
                    <div class="ctrl">
                        <label>Vertical Align</label>
                        <div class="btn-group-sm">
                            <button title="Top"    class="${(f.verticalAlign||'middle')==='top'   ?'active':''}" onclick="UI.setFooterVAlign('top')"><i class="fas fa-arrow-up"></i></button>
                            <button title="Middle" class="${(f.verticalAlign||'middle')==='middle'?'active':''}" onclick="UI.setFooterVAlign('middle')"><i class="fas fa-minus"></i></button>
                            <button title="Bottom" class="${(f.verticalAlign||'middle')==='bottom'?'active':''}" onclick="UI.setFooterVAlign('bottom')"><i class="fas fa-arrow-down"></i></button>
                        </div>
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
            </div>
        `;

        // Enable toggle
        const enabledEl = document.getElementById('f-enabled');
        if (enabledEl) enabledEl.addEventListener('change', e => {
            State.updateFooter({ enabled: e.target.checked });
            const wrap = document.getElementById('f-settings');
            if (wrap) { wrap.style.opacity = e.target.checked ? '1' : '0.4'; wrap.style.pointerEvents = e.target.checked ? '' : 'none'; }
            Preview.render();
        });

        Utils.setupColorSync('f-bg', 'f-bg-hex', v => { State.updateFooter({ bg: v }); Preview.render(); });
        Utils.setupColorSync('f-color', 'f-color-hex', v => { State.updateFooter({ color: v }); Preview.render(); });

        // Inject footer RTE (key 10002)
        const fRteWrap = document.getElementById('f-rte-wrap');
        if (fRteWrap) {
            fRteWrap.innerHTML = Blocks.buildRTE({ content: '' }, 10002);
            Blocks.rteSetContent(10002, f.text || '');
            UI._footerRteKey = 10002;
        }

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

    setFooterAlign(val) {
        State.updateFooter({ align: val });
        Preview.render();
        this.buildFooterPanel();
    },

    setFooterVAlign(val) {
        State.updateFooter({ verticalAlign: val });
        Preview.render();
        this.buildFooterPanel();
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
    // My Templates first, then built-ins, then Clear All
    // ─────────────────────────────────────────────────────────────────────
    // TEMPLATE GRID
    //
    //  Section 1 — My Templates   (localStorage "myTemplates" bucket)
    //              Saved via Save-dialog, or manually imported into this bucket.
    //              Loading here = current workspace. Duplicate-check with alert.
    //
    //  Section 2 — Global Templates (window.globalTemplates populated by folder scan)
    //              Read-only, always fresh from /myTemplates/ folder on every page load.
    //              Admin drops a JSON there + adds to index.json → users see it next visit.
    //              No delete button. Clicking always re-fetches (bypasses localStorage cache).
    //
    //  Section 3 — Built-in  (window.emailTemplates)
    //              Hard-coded in templates.js.
    // ─────────────────────────────────────────────────────────────────────
    buildTemplateGrid() {
        const grid = document.getElementById('template-grid');
        if (!grid) return;

        // ── My Templates card (deletable) ─────────────────────────────
        const makeMyCard = (key, tpl) => `
            <div class="tmpl-card tmpl-card-user" title="${tpl.desc || ''}">
                <div class="tmpl-thumb" style="background:${tpl.thumbColor || '#2563eb'};"
                     onclick="UI.loadMyTemplate('${key}')">
                    <i class="${tpl.icon || 'fas fa-envelope'}" style="font-size:20px;color:rgba(255,255,255,0.92);"></i>
                </div>
                <div class="tmpl-info" onclick="UI.loadMyTemplate('${key}')" style="cursor:pointer;">
                    <span class="tmpl-name">${tpl.name}</span>
                    <span class="tmpl-desc">${tpl.desc || '\u00a0'}</span>
                    <span class="tmpl-badge">My Template</span>
                </div>
                <button class="tmpl-delete" onclick="UI.deleteFromRegistry('myTemplates','${key}')" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;

        // ── Global Templates card (no delete, always from folder) ─────
        const makeGlobalCard = (key, tpl) => `
            <div class="tmpl-card tmpl-card-global" title="${tpl.desc || ''}">
                <div class="tmpl-thumb" style="background:${tpl.thumbColor || '#059669'};"
                     onclick="UI.loadGlobalTemplate('${key}')">
                    <i class="${tpl.icon || 'fas fa-globe'}" style="font-size:20px;color:rgba(255,255,255,0.92);"></i>
                </div>
                <div class="tmpl-info" onclick="UI.loadGlobalTemplate('${key}')" style="cursor:pointer;">
                    <span class="tmpl-name">${tpl.name}</span>
                    <span class="tmpl-desc">${tpl.desc || '\u00a0'}</span>
                    <span class="tmpl-badge" style="background:#059669;">Global</span>
                </div>
            </div>`;

        // ── Built-in card ─────────────────────────────────────────────
        const makeBuiltInCard = (key, tpl) => `
            <div class="tmpl-card" onclick="UI.loadTemplate('${key}', false)" title="${tpl.desc || ''}">
                <div class="tmpl-thumb" style="background:${tpl.thumbColor || '#2563eb'};">
                    <i class="${tpl.icon || 'fas fa-envelope'}" style="font-size:20px;color:rgba(255,255,255,0.92);"></i>
                </div>
                <div class="tmpl-info">
                    <span class="tmpl-name">${tpl.name}</span>
                    <span class="tmpl-desc">${tpl.desc || ''}</span>
                </div>
            </div>`;

        const makeSectionLabel = (title, extra = '') =>
            `<div class="tmpl-section-label">${title}${extra}</div>`;

        const importBtn = (handler) => `
            <label class="tmpl-import-btn" title="Import a .json file">
                <i class="fas fa-plus"></i> Import
                <input type="file" accept=".json" style="display:none;" onchange="${handler}">
            </label>`;

        const emptyMsg = (msg) =>
            `<div class="tmpl-empty"><i class="fas fa-folder-open"></i><span>${msg}</span></div>`;

        // ── Data ──────────────────────────────────────────────────────
        const myEntries     = Object.entries(window.myTemplates     || {});
        const globalEntries = Object.entries(window.globalTemplates  || {});
        const builtEntries  = Object.entries(window.emailTemplates   || {});

        // ── Assemble ──────────────────────────────────────────────────
        const mySection = makeSectionLabel('My Templates', importBtn('UI.importUserTemplate(event)')) +
            (myEntries.length
                ? myEntries.map(([k,t]) => makeMyCard(k,t)).join('')
                : emptyMsg('Nothing saved yet. Use Save to add templates here.'));

        const globalSection = makeSectionLabel('Global Templates',
            '<span class="tmpl-hint" title="Shared templates — managed via the myTemplates folder"><i class="fas fa-info-circle"></i></span>') +
            (globalEntries.length
                ? globalEntries.map(([k,t]) => makeGlobalCard(k,t)).join('')
                : emptyMsg('No shared templates found in the myTemplates folder.'));

        const builtInSection = builtEntries.length
            ? makeSectionLabel('Built-in') + builtEntries.map(([k,t]) => makeBuiltInCard(k,t)).join('')
            : '';

        grid.innerHTML = mySection + globalSection + builtInSection +
            `<div class="tmpl-card tmpl-card-clear" onclick="UI.clearAll()">
                <div class="tmpl-thumb" style="background:#ef4444;">
                    <i class="fas fa-trash-alt" style="font-size:20px;color:rgba(255,255,255,0.9);"></i>
                </div>
                <div class="tmpl-info">
                    <span class="tmpl-name">Clear All</span>
                    <span class="tmpl-desc">Start fresh</span>
                </div>
            </div>`;
    },
    // ──────────────────────────────────────────────
    // TEMPLATE REGISTRY — two localStorage buckets
    //   "myTemplates"    = saved via Save dialog
    //   "localTemplates" = loaded via Load button or Local Import
    // ──────────────────────────────────────────────

    // Parse a raw localStorage bucket into window[windowKey]
    _loadBucket(storageKey, windowKey) {
        window[windowKey] = {};
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;
            const stored = JSON.parse(raw);
            Object.entries(stored).forEach(([key, data]) => {
                const tpl = data.state ? data.state : data;
                tpl.name       = data.name       || tpl.name       || key;
                tpl.desc       = data.desc       || tpl.desc       || '';
                tpl.icon       = data.icon       || tpl.icon       || this.guessIcon(tpl);
                tpl.thumbColor = data.thumbColor || tpl.thumbColor || this.guessThumbColor(tpl);
                window[windowKey][key] = tpl;
            });
        } catch(e) { console.warn('Could not load ' + storageKey, e); }
    },

    async loadMyTemplates() {
        // 1. My Templates — localStorage "myTemplates" bucket (saved via dialog)
        this._loadBucket('myTemplates', 'myTemplates');

        // 2. Global Templates — always re-fetch from /myTemplates/ folder (fresh every load)
        //    Never cached in localStorage — admin controls these files directly.
        window.globalTemplates = {};
        try {
            const resp = await fetch('myTemplates/index.json?_=' + Date.now());
            if (resp.ok) {
                const idx = await resp.json();
                const files = Array.isArray(idx) ? idx : (idx.files || []);
                await Promise.all(files.filter(Boolean).map(async (filename) => {
                    try {
                        const r = await fetch('myTemplates/' + filename + '?_=' + Date.now());
                        if (!r.ok) return;
                        const data = await r.json();
                        if (!data.state || !data.state.global) return; // not a valid template
                        const key = filename.replace(/\.json$/i, '');
                        const tpl = data.state;
                        tpl.name       = data.name       || tpl.name       || key;
                        tpl.desc       = data.desc       || tpl.desc       || '';
                        tpl.icon       = data.icon       || tpl.icon       || this.guessIcon(tpl);
                        tpl.thumbColor = data.thumbColor || tpl.thumbColor || this.guessThumbColor(tpl);
                        window.globalTemplates[key] = tpl;
                    } catch(e) { console.warn('Could not load global template:', filename); }
                }));
            }
        } catch(e) { /* no index.json is fine — folder is empty */ }

        this.buildTemplateGrid();
    },

    // Load from My Templates (with duplicate-check alert if already exists as a different template)
    loadMyTemplate(key) {
        const tpl = (window.myTemplates || {})[key];
        if (!tpl) return;
        const blocks = State.get().blocks || [];
        if (blocks.length > 0) {
            if (!confirm('Loading "' + tpl.name + '" will replace your current work.\nContinue?')) return;
        }
        State.applyTemplate(tpl);
        this.rebuildAll();
        Preview.render();
        Utils.showToast('Loaded: ' + tpl.name, 'success');
        UI.showTab('content');
    },

    // Load Global Template — always re-fetches from folder (cache-busted)
    async loadGlobalTemplate(key) {
        const tpl = (window.globalTemplates || {})[key];
        if (!tpl) return;
        const blocks = State.get().blocks || [];
        if (blocks.length > 0) {
            if (!confirm('Loading "' + tpl.name + '" will replace your current work.\nContinue?')) return;
        }
        State.applyTemplate(tpl);
        this.rebuildAll();
        Preview.render();
        Utils.showToast('Loaded global: ' + tpl.name, 'success');
        UI.showTab('content');
    },
    // ── REGISTRY HELPERS ──────────────────────────────────────────────────────

    registerUserTemplate(key, payload) {
        // If key already exists, update silently (came from Save dialog — user chose this)
        this._saveToBucket('myTemplates', key, payload);
        this.loadMyTemplates();
    },

    registerLocalTemplate(key, payload) {
        // Also goes into myTemplates — we now have only one user bucket
        this._saveToBucket('myTemplates', key, payload);
        this.loadMyTemplates();
    },

    _loadBucket(storageKey, windowKey) {
        window[windowKey] = {};
        try {
            const raw = localStorage.getItem(storageKey);
            if (!raw) return;
            const stored = JSON.parse(raw);
            Object.entries(stored).forEach(([key, data]) => {
                const tpl = data.state ? data.state : data;
                tpl.name       = data.name       || tpl.name       || key;
                tpl.desc       = data.desc       || tpl.desc       || '';
                tpl.icon       = data.icon       || tpl.icon       || this.guessIcon(tpl);
                tpl.thumbColor = data.thumbColor || tpl.thumbColor || this.guessThumbColor(tpl);
                window[windowKey][key] = tpl;
            });
        } catch(e) { console.warn('Could not load ' + storageKey, e); }
    },

    _saveToBucket(storageKey, key, payload) {
        try {
            const raw    = localStorage.getItem(storageKey);
            const stored = raw ? JSON.parse(raw) : {};
            stored[key]  = payload;
            localStorage.setItem(storageKey, JSON.stringify(stored));
        } catch(e) { console.warn('Could not write to localStorage', e); }
    },

    deleteFromRegistry(storageKey, key) {
        const tpl = (window[storageKey === 'myTemplates' ? 'myTemplates' : 'globalTemplates'] || {})[key];
        const name = tpl ? tpl.name : key;
        if (!confirm('Remove "' + name + '" from My Templates?')) return;
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const stored = JSON.parse(raw);
                delete stored[key];
                localStorage.setItem(storageKey, JSON.stringify(stored));
            }
        } catch(e) {}
        this.loadMyTemplates();
        Utils.showToast('Template removed', 'info');
    },

    // Legacy — still used by built-in template cards
    loadFromRegistry(storageKey, key) {
        this.loadMyTemplate(key);
    },

    // Import file → My Templates
    importUserTemplate(event) {
        const file = event.target.files[0];
        if (!file) return;
        event.target.value = '';
        this._importFile(file, 'myTemplates');
    },

    // Legacy alias
    importLocalTemplate(event) {
        this.importUserTemplate(event);
    },

    _importFile(file, storageKey) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.state || !data.state.global) {
                    Utils.showToast('Not a valid Email Builder template', 'error');
                    return;
                }
                const key = file.name.replace(/\.json$/i, '');
                const tpl = data.state;
                data.name       = data.name       || tpl.name       || key;
                data.desc       = data.desc       || tpl.desc       || '';
                data.icon       = data.icon       || tpl.icon       || this.guessIcon(tpl);
                data.thumbColor = data.thumbColor || tpl.thumbColor || this.guessThumbColor(tpl);

                // Duplicate check
                const existing = (window.myTemplates || {})[key];
                if (existing) {
                    if (!confirm('"' + data.name + '" already exists in My Templates.\nReplace it?')) return;
                }
                this._saveToBucket(storageKey, key, data);
                this.loadMyTemplates();
                Utils.showToast('Imported: ' + data.name, 'success');
            } catch(err) {
                Utils.showToast('Invalid template file', 'error');
            }
        };
        reader.readAsText(file);
    },
    guessThumbColor(tpl) {
        const bg   = tpl.header && tpl.header.bg;
        const grad = tpl.header && tpl.header.grad1;
        return grad || bg || '#2563eb';
    },

    guessIcon(tpl) {
        // Auto-pick a Font Awesome icon based on name/desc/blocks
        const name = (tpl.name || '').toLowerCase();
        const desc = (tpl.desc || '').toLowerCase();
        const text = name + ' ' + desc;
        if (/arabic|rtl/.test(text))                return 'fas fa-globe';
        if (/news|newsletter/.test(text))           return 'fas fa-newspaper';
        if (/promo|discount|offer|sale/.test(text)) return 'fas fa-tag';
        if (/welcome|onboard/.test(text))           return 'fas fa-hand-sparkles';
        if (/invoice|receipt|payment/.test(text))   return 'fas fa-file-invoice';
        if (/product|shop|store/.test(text))        return 'fas fa-shopping-bag';
        if (/event|invite/.test(text))              return 'fas fa-calendar-alt';
        if (/confirm|verify|reset/.test(text))      return 'fas fa-shield-alt';
        if (/report|analyt|stats/.test(text))       return 'fas fa-chart-bar';
        if (/column|layout/.test(text))             return 'fas fa-columns';
        if (/image|photo|gallery/.test(text))       return 'fas fa-images';
        if (/table/.test(text))                     return 'fas fa-table';
        const blocks = tpl.blocks || [];
        if (blocks.some(b => b.type === 'table'))       return 'fas fa-table';
        if (blocks.some(b => b.type === 'two-images'))  return 'fas fa-images';
        if (blocks.some(b => b.type === 'button'))      return 'fas fa-mouse-pointer';
        return 'fas fa-envelope';
    },

    loadTemplate(key, isUser) {
        const tpl = isUser
            ? (window.myTemplates || {})[key]
            : (window.emailTemplates || {})[key];
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
