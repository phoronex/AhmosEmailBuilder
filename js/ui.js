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
            <div class="ctrl">
                <label>Email Width</label>
                <div class="range-wrap">
                    <input type="range" id="g-width" min="320" max="800" value="${s.width}">
                    <span class="range-val" id="g-width-val">${s.width}px</span>
                    <input type="number" id="g-width-num" value="${s.width}" min="320" max="800"
                        style="width:64px;margin-left:6px;font-size:12px;font-family:monospace;border:1px solid var(--border2);border-radius:var(--radius);background:var(--bg);color:var(--text);padding:3px 6px;text-align:center;">
                </div>
            </div>

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
            const iw = document.getElementById('info-width');
            if (iw) iw.textContent = v + 'px';
            const numEl = document.getElementById('g-width-num');
            if (numEl) numEl.value = v;
            Preview.render();
        });
        // Number input syncs back to range
        const gWidthNum = document.getElementById('g-width-num');
        if (gWidthNum) gWidthNum.addEventListener('input', function() {
            const v = Math.min(800, Math.max(320, parseInt(this.value)||600));
            const rangeEl = document.getElementById('g-width');
            const valEl = document.getElementById('g-width-val');
            if (rangeEl) rangeEl.value = v;
            if (valEl) valEl.textContent = v + 'px';
            State.updateGlobal({ width: v });
            const iw = document.getElementById('info-width');
            if (iw) iw.textContent = v + 'px';
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
                    <button type="button" class="clipboard-paste-btn" onclick="UI.pasteHeaderLogoClipboard()" style="margin-top:5px;">
                        <i class="fas fa-clipboard"></i> Paste from Clipboard
                    </button>
                    <input type="text" id="h-logo-url" placeholder="Or paste image URL / Ctrl+V" value="${h.logo||''}"
                        onpaste="UI.handleHeaderLogoPaste(event)">
                    ${h.logo ? `<button class="ctrl-btn" style="margin-top:5px;color:#ef4444;" onclick="UI.clearHeaderLogo()"><i class="fas fa-times"></i> Remove Logo</button>` : ''}
                </div>

                <div id="h-logo-size-row" style="${h.logo ? '' : 'display:none;'}">
                    <div class="ctrl"><label>Alt Text <span style="font-size:10px;font-weight:400;color:var(--text3);">(image tag)</span></label>
                        <input type="text" id="h-logo-alt" value="${h.logoAlt||''}" placeholder="Company logo"
                            oninput="UI._updHeader('logoAlt',this.value)">
                    </div>
                    <div class="ctrl"><label>Logo Size</label>
                        <div class="img-size-row">
                            <div class="img-size-field">
                                <span class="img-size-lbl">W</span>
                                <input type="number" id="h-logo-w" value="${Math.max(1,h.logoWidth||1)}" min="1" max="800"
                                    oninput="UI.updLogoWH('w',this.value)">
                                <span class="img-size-unit">px</span>
                            </div>
                            <button type="button" class="ratio-lock-btn ${(h.logoLockRatio!==false)?'active':''}" id="h-logo-lock"
                                title="${(h.logoLockRatio!==false)?'Ratio locked':'Ratio unlocked'}"
                                onclick="UI.toggleLogoLock(this)">
                                <i class="fas ${(h.logoLockRatio!==false)?'fa-link':'fa-unlink'}"></i>
                            </button>
                            <div class="img-size-field">
                                <span class="img-size-lbl">H</span>
                                <input type="number" id="h-logo-h" value="${Math.max(1,h.logoHeight||55)}" min="1" max="600"
                                    oninput="UI.updLogoWH('h',this.value)">
                                <span class="img-size-unit">px</span>
                            </div>
                        </div>
                    </div>
                    <div class="ctrl"><label>Border Radius <span style="font-size:10px;font-weight:400;color:var(--text3);">(px, 0 = none)</span></label>
                        <div style="display:flex;gap:6px;align-items:center;">
                            <input type="number" id="h-logo-radius" value="${h.logoBorderRadius||0}" min="0" max="200" style="flex:1;"
                                oninput="UI._updHeader('logoBorderRadius',parseInt(this.value)||0)">
                            <button class="mini-btn" onclick="UI._updHeader('logoBorderRadius',0);document.getElementById('h-logo-radius').value=0" title="Remove radius"><i class="fas fa-square"></i> None</button>
                        </div>
                    </div>
                    <div class="ctrl"><label>Hyperlink <span style="font-size:10px;font-weight:400;color:var(--text3);">(opens in new tab)</span></label>
                        <input type="text" id="h-logo-link" value="${h.logoLink||''}" placeholder="https://..."
                            oninput="UI._updHeader('logoLink',this.value)">
                    </div>
                    <div class="ctrl"><label>Padding (px) — Top / Right / Bottom / Left</label>
                        <div class="row4">
                            <div><label class="sub-label">T</label><input type="number" value="${h.logoPaddingTop??0}" min="0" max="100" oninput="UI._updHeader('logoPaddingTop',parseInt(this.value)||0)"></div>
                            <div><label class="sub-label">R</label><input type="number" value="${h.logoPaddingRight??0}" min="0" max="100" oninput="UI._updHeader('logoPaddingRight',parseInt(this.value)||0)"></div>
                            <div><label class="sub-label">B</label><input type="number" value="${h.logoPaddingBottom??0}" min="0" max="100" oninput="UI._updHeader('logoPaddingBottom',parseInt(this.value)||0)"></div>
                            <div><label class="sub-label">L</label><input type="number" value="${h.logoPaddingLeft??0}" min="0" max="100" oninput="UI._updHeader('logoPaddingLeft',parseInt(this.value)||0)"></div>
                        </div>
                    </div>
                </div>

                <div class="ctrl">
                    <div class="section-toggle-row" style="padding:0;margin-bottom:8px;">
                        <label style="font-size:12px;font-weight:700;color:var(--text);">Header Title / Tagline</label>
                        <label class="pill-toggle" title="Show or hide the title text (logo-only mode when off)">
                            <input type="checkbox" id="h-text-enabled" ${h.textEnabled !== false ? 'checked' : ''}>
                            <span class="pill-slider"></span>
                        </label>
                    </div>
                    <div id="h-rte-wrap" style="${h.textEnabled === false ? 'opacity:0.4;pointer-events:none;' : ''}"></div>
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

                ${Blocks.ctrlLW(h.lw, 'UI.updLWHeader', 'hdr')}
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
            const val = e.target.value.trim();
            if (val) { UI._applyHeaderLogo(val); }
            else { State.updateHeader({ logo: '' }); this.buildHeaderPanel(); Preview.render(); }
        });

        const hTextToggle = document.getElementById('h-text-enabled');
        if (hTextToggle) hTextToggle.addEventListener('change', e => {
            State.updateHeader({ textEnabled: e.target.checked });
            const rteWrap = document.getElementById('h-rte-wrap');
            if (rteWrap) { rteWrap.style.opacity = e.target.checked ? '1' : '0.4'; rteWrap.style.pointerEvents = e.target.checked ? '' : 'none'; }
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
        Utils.handleImageUpload(data => { this._applyHeaderLogo(data); Utils.showToast('Logo uploaded','success'); });
    },

    pasteHeaderLogoClipboard() {
        if (!navigator.clipboard?.read) { Utils.showToast('Clipboard API unavailable — use Ctrl+V','warning'); return; }
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                const t = item.types.find(x => x.startsWith('image/'));
                if (t) { item.getType(t).then(blob => { const r=new FileReader(); r.onload=ev=>{ this._applyHeaderLogo(ev.target.result); Utils.showToast('Logo pasted from clipboard','success'); }; r.readAsDataURL(blob); }); return; }
            }
            Utils.showToast('No image in clipboard','warning');
        }).catch(()=>Utils.showToast('Clipboard access denied','warning'));
    },

    handleHeaderLogoPaste(e) {
        const cd = e.clipboardData || window.clipboardData;
        if (!cd) return;
        const tryBlob = (file) => {
            if (!file || !file.type.startsWith('image/')) return false;
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = ev => { this._applyHeaderLogo(ev.target.result); };
            reader.readAsDataURL(file);
            return true;
        };
        if (cd.files && cd.files.length && tryBlob(cd.files[0])) return;
        const it = Array.from(cd.items||[]).find(x => x.type.startsWith('image/'));
        if (it) tryBlob(it.getAsFile());
    },

    // Central: load logo, read natural dims, clamp, store
    _applyHeaderLogo(src) {
        const maxW = (State.get().images||{}).maxWidth || 600;
        const img  = new Image();
        img.onload = () => {
            const nw = img.naturalWidth, nh = img.naturalHeight;
            let lw = nw, lh = nh;
            if (nw > maxW) { lw = maxW; lh = Math.max(1, Math.round((maxW/nw)*nh)); }
            State.updateHeader({ logo: src, logoWidth: lw, logoHeight: lh, _logNW: nw, _logNH: nh });
            this.buildHeaderPanel(); Preview.render();
        };
        img.onerror = () => {
            State.updateHeader({ logo: src });
            this.buildHeaderPanel(); Preview.render();
        };
        img.src = src;
    },

    updLogoWH(dim, rawVal) {
        const n = Math.max(1, parseInt(rawVal)||1);
        const h = State.get().header;
        const locked = h.logoLockRatio !== false;
        const nw = h._logNW || 0, nh = h._logNH || 0;
        const hasR = nw > 0 && nh > 0;
        if (dim === 'w') {
            const upd = { logoWidth: n };
            if (locked && hasR) { upd.logoHeight = Math.max(1,Math.round((n/nw)*nh)); const el=document.getElementById('h-logo-h'); if(el)el.value=upd.logoHeight; }
            State.updateHeader(upd);
        } else {
            const upd = { logoHeight: n };
            if (locked && hasR) { upd.logoWidth = Math.max(1,Math.round((n/nh)*nw)); const el=document.getElementById('h-logo-w'); if(el)el.value=upd.logoWidth; }
            State.updateHeader(upd);
        }
        Preview.render();
    },

    toggleLogoLock(btn) {
        const h = State.get().header;
        const locked = !(h.logoLockRatio !== false);
        State.updateHeader({ logoLockRatio: locked });
        btn.classList.toggle('active', locked);
        btn.title = locked ? 'Ratio locked' : 'Ratio unlocked';
        btn.querySelector('i').className = 'fas ' + (locked ? 'fa-link' : 'fa-unlink');
    },

    clearHeaderLogo() {
        State.updateHeader({ logo: '' });
        this.buildHeaderPanel();
        Preview.render();
    },

    _updHeader(prop, val) {
        State.updateHeader({ [prop]: val });
        Preview.render();
    },

    // ──────────────────────────────────────────────
    // FOOTER PANEL  v5.4
    // ──────────────────────────────────────────────
    buildFooterPanel() {
        const f       = State.get().footer;
        const enabled = f.enabled !== false;
        const textOn  = f.textEnabled !== false;
        const socOn   = !!f.socialEnabled;
        const icons   = f.socialIcons || [];
        const pos     = f.socialPosition || 'above';
        const fDir    = f.direction || 'ltr';
        const el      = document.getElementById('acc-body-footer');
        if (!el) return;

        const PLATFORMS = [
            'facebook','x','twitter','instagram','linkedin','youtube',
            'tiktok','whatsapp','telegram','snapchat',
            'email','website','phone','mobile','location','custom'
        ];

        // Social rows — URL input + custom icon upload
        const iconRows = icons.map((ic, idx) => `
            <div class="soc-row" id="soc-row-${idx}">
                <div class="soc-row-top">
                    <select class="soc-plat" onchange="UI.updSocial(${idx},'platform',this.value)">
                        ${PLATFORMS.map(p=>`<option value="${p}" ${ic.platform===p?'selected':''}>${p.charAt(0).toUpperCase()+p.slice(1)}</option>`).join('')}
                    </select>
                    <div class="soc-row-btns">
                        ${idx > 0 ? `<button type="button" class="soc-move-btn" onclick="UI.moveSocial(${idx},-1)" title="Move up"><i class="fas fa-chevron-up"></i></button>` : '<span class="soc-move-placeholder"></span>'}
                        ${idx < icons.length-1 ? `<button type="button" class="soc-move-btn" onclick="UI.moveSocial(${idx},1)" title="Move down"><i class="fas fa-chevron-down"></i></button>` : '<span class="soc-move-placeholder"></span>'}
                        <button type="button" class="soc-del-btn" onclick="UI.delSocial(${idx})" title="Remove"><i class="fas fa-times"></i></button>
                    </div>
                </div>
                <input type="text" class="soc-url" value="${ic.url||''}"
                    placeholder="${ic.platform==='phone'||ic.platform==='mobile'?'tel:+1234567890':ic.platform==='email'?'mailto:you@example.com':ic.platform==='location'?'https://maps.google.com/?q=...':'https://'}"
                    oninput="UI.updSocial(${idx},'url',this.value)">
                <div class="soc-icon-row">
                    ${ic.customSrc
                        ? `<img src="${ic.customSrc}" class="soc-icon-preview">`
                        : `<div class="soc-icon-preview soc-icon-placeholder"><i class="fas fa-image"></i></div>`}
                    <div class="soc-icon-actions">
                        <button type="button" class="soc-icon-btn" onclick="UI.uploadSocialIcon(${idx})" title="Upload custom icon"><i class="fas fa-upload"></i> Upload</button>
                        <button type="button" class="soc-icon-btn" onclick="UI.pasteSocialIcon(${idx})" title="Paste from clipboard"><i class="fas fa-clipboard"></i> Paste</button>
                        <input type="text" class="soc-icon-url-inp" value="${ic.customSrc||''}" placeholder="Or icon URL…"
                            oninput="UI.updSocial(${idx},'customSrc',this.value)" style="flex:1;min-width:0;">
                        ${ic.customSrc ? `<button type="button" class="soc-icon-clear" onclick="UI.updSocial(${idx},'customSrc','')" title="Use default"><i class="fas fa-times"></i></button>` : ''}
                    </div>
                </div>
            </div>`).join('');

        const addChips = PLATFORMS.map(p =>
            `<button type="button" class="soc-add-chip" onclick="UI.addSocial('${p}')">${p.charAt(0).toUpperCase()+p.slice(1)}</button>`
        ).join('');

        el.innerHTML = `
            <div class="section-toggle-row">
                <span><i class="fas fa-shoe-prints"></i> Show Footer</span>
                <label class="pill-toggle">
                    <input type="checkbox" id="f-enabled" ${enabled ? 'checked' : ''}>
                    <span class="pill-slider"></span>
                </label>
            </div>
            <div id="f-settings" style="${!enabled ? 'opacity:0.4;pointer-events:none;' : ''}">

                <!-- ═══ ORDER + VISIBILITY ═══════════════════════ -->
                <div class="ctrl" style="margin-bottom:8px;">
                    <label>Content &amp; social order</label>
                    <div class="footer-order-row">
                        <div class="footer-order-box ${pos==='above'?'first':'second'}">
                            <label class="pill-toggle" style="transform:scale(0.75);flex-shrink:0;">
                                <input type="checkbox" id="f-soc-en" ${socOn?'checked':''}>
                                <span class="pill-slider"></span>
                            </label>
                            <span><i class="fas fa-share-alt"></i> Social</span>
                        </div>
                        <button type="button" class="footer-swap-btn" onclick="UI.swapFooterOrder()" title="Swap order">
                            <i class="fas fa-arrows-alt-v"></i>
                        </button>
                        <div class="footer-order-box ${pos==='above'?'second':'first'}">
                            <label class="pill-toggle" style="transform:scale(0.75);flex-shrink:0;">
                                <input type="checkbox" id="f-text-en" ${textOn?'checked':''}>
                                <span class="pill-slider"></span>
                            </label>
                            <span><i class="fas fa-font"></i> Text</span>
                        </div>
                    </div>
                </div>

                <!-- ═══ SOCIAL ICONS ══════════════════════════════ -->
                <div id="f-soc-section" style="${!socOn?'opacity:0.45;pointer-events:none;':''}">
                    <div class="ctrl-section-head"><i class="fas fa-share-alt"></i> Social Icons</div>
                    <div class="ctrl">
                        <label>Icon Style
                            <span style="font-weight:400;color:var(--text3);font-size:10px;display:block;margin-top:2px;">Sharp = SVG quality &nbsp;·&nbsp; Gmail = works everywhere</span>
                        </label>
                        <div class="btn-group-sm" style="flex-wrap:wrap;gap:4px;">
                            <button type="button" class="${(f.socialIconStyle||'colored')==='colored'?'active':''}"
                                onclick="UI.setSocialIconStyle('colored')" title="SVG brand colors — sharp at any size">
                                <i class="fas fa-palette"></i> Colored
                            </button>
                            <button type="button" class="${(f.socialIconStyle||'colored')==='white'?'active':''}"
                                onclick="UI.setSocialIconStyle('white')" title="SVG white — sharp at any size">
                                <i class="fas fa-circle"></i> White
                            </button>
                            <button type="button" class="${(f.socialIconStyle||'colored')==='colored-compat'?'active':''}"
                                onclick="UI.setSocialIconStyle('colored-compat')" title="PNG brand colors — works in Gmail">
                                <i class="fas fa-envelope"></i> Gmail Colored
                            </button>
                            <button type="button" class="${(f.socialIconStyle||'colored')==='white-compat'?'active':''}"
                                onclick="UI.setSocialIconStyle('white-compat')" title="PNG white — works in Gmail">
                                <i class="fas fa-envelope-open"></i> Gmail White
                            </button>
                        </div>
                    </div>
                    <div class="ctrl">
                        <label>Icon Alignment <span style="font-weight:400;color:var(--text3);font-size:10px;">(independent of text)</span></label>
                        <div class="btn-group-sm">
                            <button type="button" class="${(f.socialAlign||f.align||'center')==='left'?'active':''}"
                                onclick="UI.setSocialAlign('left')"><i class="fas fa-align-left"></i></button>
                            <button type="button" class="${(f.socialAlign||f.align||'center')==='center'?'active':''}"
                                onclick="UI.setSocialAlign('center')"><i class="fas fa-align-center"></i></button>
                            <button type="button" class="${(f.socialAlign||f.align||'center')==='right'?'active':''}"
                                onclick="UI.setSocialAlign('right')"><i class="fas fa-align-right"></i></button>
                        </div>
                    </div>
                    <div class="row3">
                        <div class="ctrl"><label>Size (px)</label>
                            <input type="number" id="f-soc-sz" value="${f.socialIconSize||32}" min="16" max="80">
                        </div>
                        <div class="ctrl"><label>Gap (px)</label>
                            <input type="number" id="f-soc-gap" value="${f.socialIconGap||12}" min="0" max="60">
                        </div>
                        <div class="ctrl"><label>Radius (px)</label>
                            <input type="number" id="f-soc-radius" value="${f.socialIconRadius!=null?f.socialIconRadius:5}" min="0" max="50">
                        </div>
                    </div>
                    <div class="row2">
                        <div class="ctrl"><label>Padding Top (px)</label>
                            <input type="number" id="f-soc-pt" value="${f.socialPaddingTop!=null?f.socialPaddingTop:0}" min="0" max="60">
                        </div>
                        <div class="ctrl"><label>Padding Bottom (px)</label>
                            <input type="number" id="f-soc-pb" value="${f.socialPaddingBottom!=null?f.socialPaddingBottom:8}" min="0" max="60">
                        </div>
                    </div>
                    <div class="ctrl" style="margin-bottom:4px;">
                        <label>Icons</label>
                        <div id="soc-list" style="display:flex;flex-direction:column;gap:6px;margin-top:4px;">
                            ${iconRows || '<div style="font-size:11px;color:var(--text3);padding:3px 0;">No icons — add below</div>'}
                        </div>
                        <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">
                            ${addChips}
                        </div>
                    </div>
                </div>

                <!-- ═══ FOOTER TEXT ══════════════════════════════ -->
                <div id="f-text-section" style="${!textOn?'opacity:0.45;pointer-events:none;':''}">
                    <div class="ctrl-section-head"><i class="fas fa-font"></i> Footer Text</div>
                    <div class="ctrl">
                        <div id="f-rte-wrap"></div>
                    </div>
                    <div class="ctrl">
                        <label>Text Direction</label>
                        <div class="btn-group-sm">
                            <button title="LTR" class="${fDir==='ltr'?'active':''}" onclick="UI.setFooterDir('ltr')"><i class="fas fa-arrow-right"></i> LTR</button>
                            <button title="RTL" class="${fDir==='rtl'?'active':''}" onclick="UI.setFooterDir('rtl')"><i class="fas fa-arrow-left"></i> RTL</button>
                        </div>
                    </div>
                </div>

                <!-- ═══ SHARED STYLE ════════════════════════════ -->
                <div class="ctrl-section-head"><i class="fas fa-paint-brush"></i> Footer Style</div>
                <div class="row2">
                    <div class="ctrl">
                        <label>H Align</label>
                        <div class="btn-group-sm">
                            <button title="Left"   class="${(f.align||'center')==='left'  ?'active':''}" onclick="UI.setFooterAlign('left')"><i class="fas fa-align-left"></i></button>
                            <button title="Center" class="${(f.align||'center')==='center'?'active':''}" onclick="UI.setFooterAlign('center')"><i class="fas fa-align-center"></i></button>
                            <button title="Right"  class="${(f.align||'center')==='right' ?'active':''}" onclick="UI.setFooterAlign('right')"><i class="fas fa-align-right"></i></button>
                        </div>
                    </div>
                    <div class="ctrl">
                        <label>V Align</label>
                        <div class="btn-group-sm">
                            <button title="Top"    class="${(f.verticalAlign||'middle')==='top'   ?'active':''}" onclick="UI.setFooterVAlign('top')"><i class="fas fa-arrow-up"></i></button>
                            <button title="Middle" class="${(f.verticalAlign||'middle')==='middle'?'active':''}" onclick="UI.setFooterVAlign('middle')"><i class="fas fa-minus"></i></button>
                            <button title="Bottom" class="${(f.verticalAlign||'middle')==='bottom'?'active':''}" onclick="UI.setFooterVAlign('bottom')"><i class="fas fa-arrow-down"></i></button>
                        </div>
                    </div>
                </div>
                ${Utils.colorRowHTML('Background', 'f-bg', 'f-bg-hex', f.bg)}
                ${Utils.colorRowHTML('Text Color', 'f-color', 'f-color-hex', f.color)}
                ${Blocks.ctrlLW(f.lw, 'UI.updLWFooter', 'ftr')}
                <div class="row2">
                    <div class="ctrl"><label>Padding V</label>
                        <input type="number" id="f-pad-v" value="${f.paddingTop}" min="0" max="100">
                    </div>
                    <div class="ctrl"><label>Padding H</label>
                        <input type="number" id="f-pad-h" value="${f.paddingLeft}" min="0" max="100">
                    </div>
                </div>
                <div class="row2">
                    <div class="ctrl"><label>Font Size</label>
                        <input type="number" id="f-fontsize" value="${f.fontSize}" min="10" max="22">
                    </div>
                    <div class="ctrl"><label>Line Height</label>
                        <input type="number" id="f-lh" value="${f.lineHeight}" min="1" max="3" step="0.1">
                    </div>
                </div>
            </div>
        `;

        // ── Wire events ─────────────────────────────────────────
        document.getElementById('f-enabled')?.addEventListener('change', e => {
            State.updateFooter({ enabled: e.target.checked });
            document.getElementById('f-settings').style.opacity = e.target.checked ? '1' : '0.4';
            document.getElementById('f-settings').style.pointerEvents = e.target.checked ? '' : 'none';
            Preview.render();
        });

        document.getElementById('f-soc-en')?.addEventListener('change', e => {
            State.updateFooter({ socialEnabled: e.target.checked });
            const sec = document.getElementById('f-soc-section');
            if (sec) { sec.style.opacity = e.target.checked ? '1' : '0.45'; sec.style.pointerEvents = e.target.checked ? '' : 'none'; }
            Preview.render();
        });

        document.getElementById('f-text-en')?.addEventListener('change', e => {
            State.updateFooter({ textEnabled: e.target.checked });
            const sec = document.getElementById('f-text-section');
            if (sec) { sec.style.opacity = e.target.checked ? '1' : '0.45'; sec.style.pointerEvents = e.target.checked ? '' : 'none'; }
            Preview.render();
        });

        document.getElementById('f-soc-sz')?.addEventListener('input', e => { State.updateFooter({ socialIconSize: parseInt(e.target.value)||32 }); Preview.render(); });
        document.getElementById('f-soc-gap')?.addEventListener('input', e => { State.updateFooter({ socialIconGap: parseInt(e.target.value)||12 }); Preview.render(); });
        document.getElementById('f-soc-radius')?.addEventListener('input', e => { State.updateFooter({ socialIconRadius: parseInt(e.target.value)||0 }); Preview.render(); });
        document.getElementById('f-soc-pt')?.addEventListener('input', e => { State.updateFooter({ socialPaddingTop: parseInt(e.target.value)||0 }); Preview.render(); });
        document.getElementById('f-soc-pb')?.addEventListener('input', e => { State.updateFooter({ socialPaddingBottom: parseInt(e.target.value)||8 }); Preview.render(); });

        Utils.setupColorSync('f-bg', 'f-bg-hex', v => { State.updateFooter({ bg: v }); Preview.render(); });
        Utils.setupColorSync('f-color', 'f-color-hex', v => { State.updateFooter({ color: v }); Preview.render(); });

        const fRteWrap = document.getElementById('f-rte-wrap');
        if (fRteWrap) {
            fRteWrap.innerHTML = Blocks.buildRTE({ content: '' }, 10002);
            Blocks.rteSetContent(10002, f.text || '');
            UI._footerRteKey = 10002;
        }

        document.getElementById('f-pad-v')?.addEventListener('input', e => { const v=parseInt(e.target.value)||0; State.updateFooter({ paddingTop:v, paddingBottom:v }); Preview.render(); });
        document.getElementById('f-pad-h')?.addEventListener('input', e => { const v=parseInt(e.target.value)||0; State.updateFooter({ paddingLeft:v, paddingRight:v }); Preview.render(); });
        document.getElementById('f-fontsize')?.addEventListener('input', e => { State.updateFooter({ fontSize: parseInt(e.target.value)||14 }); Preview.render(); });
        document.getElementById('f-lh')?.addEventListener('input', e => { State.updateFooter({ lineHeight: parseFloat(e.target.value)||1.6 }); Preview.render(); });
    },

    // ── Social icon CRUD ──────────────────────────────────
    addSocial(platform) {
        const icons = JSON.parse(JSON.stringify(State.get().footer.socialIcons || []));
        icons.push({ platform, url: '', customSrc: '' });
        State.updateFooter({ socialIcons: icons, socialEnabled: true });
        Preview.render();
        this.buildFooterPanel();
    },

    updSocial(idx, key, val) {
        const icons = JSON.parse(JSON.stringify(State.get().footer.socialIcons || []));
        if (icons[idx] !== undefined) { icons[idx][key] = val; State.updateFooter({ socialIcons: icons }); Preview.render(); }
    },

    delSocial(idx) {
        const icons = JSON.parse(JSON.stringify(State.get().footer.socialIcons || []));
        icons.splice(idx, 1);
        State.updateFooter({ socialIcons: icons });
        Preview.render();
        this.buildFooterPanel();
    },

    moveSocial(idx, dir) {
        const icons = JSON.parse(JSON.stringify(State.get().footer.socialIcons || []));
        const ni = idx + dir;
        if (ni < 0 || ni >= icons.length) return;
        [icons[idx], icons[ni]] = [icons[ni], icons[idx]];
        State.updateFooter({ socialIcons: icons });
        Preview.render();
        this.buildFooterPanel();
    },

    // Upload custom icon image for a social entry
    uploadSocialIcon(idx) {
        Utils.handleImageUpload(data => {
            this.updSocial(idx, 'customSrc', data);
            this.buildFooterPanel();
            Utils.showToast('Custom icon uploaded', 'success');
        });
    },

    pasteSocialIcon(idx) {
        if (!navigator.clipboard?.read) { Utils.showToast('Clipboard API not supported — use URL field','warning'); return; }
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                const t = item.types.find(x => x.startsWith('image/'));
                if (t) {
                    item.getType(t).then(blob => {
                        const r = new FileReader();
                        r.onload = ev => { this.updSocial(idx, 'customSrc', ev.target.result); this.buildFooterPanel(); Utils.showToast('Icon pasted','success'); };
                        r.readAsDataURL(blob);
                    }); return;
                }
            }
            Utils.showToast('No image in clipboard','warning');
        }).catch(()=>Utils.showToast('Clipboard access denied','warning'));
    },

    setSocialIconStyle(val) {
        State.updateFooter({ socialIconStyle: val });
        Preview.render();
        this.buildFooterPanel();
    },

    setSocialAlign(val) {
        State.updateFooter({ socialAlign: val });
        Preview.render();
        this.buildFooterPanel();
    },

    swapFooterOrder() {
        const cur = State.get().footer.socialPosition || 'above';
        State.updateFooter({ socialPosition: cur === 'above' ? 'below' : 'above' });
        Preview.render();
        this.buildFooterPanel();
    },

    setFooterDir(val) {
        State.updateFooter({ direction: val });
        Preview.render();
        this.buildFooterPanel();
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

    openHelpModal() {
        const existing = document.getElementById('help-modal');
        if (existing) { existing.remove(); return; }
        const modal = document.createElement('div');
        modal.id = 'help-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
        <div class="modal-box help-modal-box">
            <div class="modal-header">
                <span><i class="fas fa-question-circle"></i> Usage Guide — Ahmos Email Builder</span>
                <button class="modal-close" onclick="document.getElementById('help-modal').remove()">&times;</button>
            </div>
            <div class="help-modal-body">

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-layer-group"></i> Blocks</div>
                    <p>Add blocks using the buttons at the bottom of the left panel. Drag blocks to reorder them. Each block has its own settings panel — click a block in the canvas to select it and open its settings.</p>
                    <ul>
                        <li><b>Text</b> — Rich text with font, size, color, alignment and direction controls. Supports RTL/Arabic.</li>
                        <li><b>2 Cols</b> — Two text columns side by side. Set column ratio (50/50, 60/40…), gap, and per-column padding.</li>
                        <li><b>Image</b> — Upload, paste from clipboard, or enter a URL. Resize, add link, border radius.</li>
                        <li><b>2 Images</b> — Two images side by side with independent controls.</li>
                        <li><b>Button</b> — CTA button with VML Outlook support for rounded corners.</li>
                        <li><b>Table</b> — Data table with custom headers, row colors, and cell editing.</li>
                        <li><b>Divider</b> — Horizontal rule. Use the slider to set width (10–100%).</li>
                        <li><b>Spacer</b> — Invisible vertical gap.</li>
                        <li><b>Text+Img</b> — Text and image side by side or stacked. Swap sides, set ratio.</li>
                        <li><b>Text+2Img</b> — Text with two images. Horizontal or vertical orientation.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-image"></i> Images &amp; Upload</div>
                    <ul>
                        <li>Images are automatically resized to max 1600px and compressed to JPEG 92% quality on upload. Transparent PNGs are preserved as PNG.</li>
                        <li>Click the upload area to browse, or use <b>Paste from Clipboard</b> after copying a screenshot.</li>
                        <li>When an image is loaded, click the thumbnail to <b>replace</b> it. Click the <b>✕</b> button to remove it.</li>
                        <li>Use <b>Save to Image Library</b> on any image block to keep it for reuse across emails.</li>
                        <li>Access saved images via the <b>Library</b> tab in the left panel. Click an image to insert it into the selected block, or add it as a new block.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-header"></i> Header &amp; Footer</div>
                    <ul>
                        <li>Toggle header/footer visibility with the switch at the top of each section.</li>
                        <li>Upload a logo, set size and lock/unlock aspect ratio.</li>
                        <li>Footer supports social icons. Choose <b>Colored</b> or <b>White</b> for sharp SVG icons, or <b>Gmail Colored / Gmail White</b> for PNG icons that render in Gmail.</li>
                        <li>Social icons can be reordered with the up/down arrows and deleted with the ✕ button.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-align-left"></i> Layout Wrap</div>
                    <p>Each block has a <b>Layout Wrap</b> section. When enabled, it wraps the block content in a table cell so you can control horizontal alignment, vertical alignment, and text direction independently of the block's own settings. Useful for RTL/LTR mixed content.</p>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-globe"></i> RTL / Arabic Support</div>
                    <ul>
                        <li>Set global direction to RTL in the <b>Settings</b> tab. This sets the Arabic font and reverses the email direction.</li>
                        <li>Individual text blocks can be set to RTL/LTR independently.</li>
                        <li>Use the Layout Wrap direction control for fine-grained control per block.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-envelope"></i> Export</div>
                    <ul>
                        <li>Click <b>Copy HTML</b> to copy the email HTML to clipboard — paste directly into your ESP (Mailchimp, SendGrid, etc.).</li>
                        <li>Click <b>Download HTML</b> to save as a .html file.</li>
                        <li>Use <b>Send Test</b> to preview in a real inbox (requires configuration).</li>
                        <li>The <b>Preview</b> panel shows a live render. Use Desktop / Tablet / Mobile buttons to check responsive layouts.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-save"></i> Templates &amp; Saving</div>
                    <ul>
                        <li>Save the current design as a template using <b>Save Template</b>. Templates are stored in your browser's localStorage.</li>
                        <li>Load a template from the <b>Templates</b> tab to start from a saved design.</li>
                        <li>The builder auto-saves your work to localStorage — your progress is not lost on page refresh.</li>
                    </ul>
                </div>

                <div class="help-section">
                    <div class="help-section-title"><i class="fas fa-bug"></i> Email Client Fixes</div>
                    <p>In the <b>Settings</b> tab, toggle compatibility fixes for Outlook, iOS Mail, and Gmail. These inject conditional comments and MSO-specific CSS that fix rendering issues in each client.</p>
                </div>

            </div>
        </div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
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
