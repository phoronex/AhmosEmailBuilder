// ============================================================
// BLOCKS  — v5.9
// ============================================================

const BLOCK_META = {
    text:        { name: 'Text',       icon: 'fas fa-font' },
    image:       { name: 'Image',      icon: 'fas fa-image' },
    'two-images':{ name: '2 Images',   icon: 'fas fa-images' },
    'two-texts': { name: '2 Columns',  icon: 'fas fa-columns' },
    button:      { name: 'Button',     icon: 'fas fa-hand-pointer' },
    table:       { name: 'Table',      icon: 'fas fa-table' },
    'text-image':   { name: 'Text + Image',   icon: 'fas fa-th-large' },
    'text-2images':  { name: 'Text + 2 Images', icon: 'fas fa-th' },
    divider:     { name: 'Divider',    icon: 'fas fa-minus' },
    spacer:      { name: 'Spacer',     icon: 'fas fa-arrows-alt-v' }
};

const DEFAULT_BORDER = { top: 0, right: 0, bottom: 0, left: 0, color: '#e5e7eb', style: 'solid' };

// ® AHMOS Email Builder Pro v5.9 | © 2025 phoronex | github.com/phoronex/AhmosEmailBuilder
const Blocks = {
    openBlocks: {},

    createBlock(type) {
        const g = State.get().global;
        const isRTL = g.direction === 'rtl';
        const base  = { id: Utils.generateId(), type, hideInMso: false, border: { ...DEFAULT_BORDER }, align: 'center' };

        switch (type) {
            case 'text':
                return { ...base,
                    content: isRTL ? '<p>مرحباً! هذا نص تجريبي باللغة العربية.</p>' : '<p>Hello! This is sample text content.</p>',
                    size: 16, color: '#334155',
                    align: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr',
                    lineHeight: 1.65,
                    whiteSpace: 'normal',
                    paddingTop: 25, paddingRight: 25, paddingBottom: 25, paddingLeft: 25,
                    backgroundColor: 'transparent',
                    lw: { enabled: true, hAlign: 'center', vAlign: 'middle', dir: 'ltr' }
                };
            case 'image':
                return { ...base, src: 'https://via.placeholder.com/600x300/2563eb/ffffff?text=Sample+Image', alt: 'Sample Image', width: 600, height: 300, lockRatio: true, _nw: 600, _nh: 300, borderRadius: 0, link: '', align: 'center', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } };
            case 'two-images':
                return { ...base,
                    images: [
                        { src: 'https://via.placeholder.com/280x180/3b82f6/ffffff?text=Image+1', alt: 'Image 1', link: '', width: 280, height: 180, lockRatio: true, _nw: 280, _nh: 180, borderRadius: 0, lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } },
                        { src: 'https://via.placeholder.com/280x180/10b981/ffffff?text=Image+2', alt: 'Image 2', link: '', width: 280, height: 180, lockRatio: true, _nw: 280, _nh: 180, borderRadius: 0, lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } }
                    ], gap: 20, align: 'center'
                };
            case 'two-texts':
                return { ...base,
                    columns: [
                        { content: '<p>Left column content.</p>', align: 'left', direction: 'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } },
                        { content: '<p>Right column content.</p>', align: 'left', direction: 'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } }
                    ],
                    gap: 20, backgroundColor: 'transparent',
                    outerPaddingTop: 16, outerPaddingRight: 16, outerPaddingBottom: 16, outerPaddingLeft: 16,
                    colRatio: '50-50', wrap: false, wrapCol: 0, wrapWidth: 220, wrapAlign: 'left'
                };
            case 'button':
                return { ...base, text: isRTL ? 'انقر هنا' : 'Click Here', link: 'https://example.com', backgroundColor: '#2563eb', textColor: '#ffffff', borderRadius: 6, padding: '13px 32px', align: 'center' };
            case 'table':
                return { ...base, rows: 2, cols: 3,
                    cells: Array.from({length: 6}, (_, i) => ({ content: `Cell ${i+1}`, align: 'center', bgColor: i%2===0 ? '#f8fafc' : '#ffffff' })),
                    borderWidth: 1, borderColor: '#e5e7eb', cellPadding: 15, cellSpacing: 0,
                    direction: 'ltr', tableAlign: 'center', fontSize: 14, lineHeight: 1.6,
                    wrap: false, wrapWidth: 280, wrapAlign: 'left',
                    paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16, lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } };
            case 'text-image':
                return { ...base,
                    orientation: 'horizontal', swapped: false, colRatio: '50-50',
                    gap: 20, backgroundColor: 'transparent',
                    outerPaddingTop: 16, outerPaddingRight: 16, outerPaddingBottom: 16, outerPaddingLeft: 16,
                    textCol: { content: '<p>Your text content here.</p>', align: 'left', direction: isRTL?'rtl':'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent', lw: { enabled: true, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } },
                    imgCol: { src: 'https://via.placeholder.com/280x200/2563eb/ffffff?text=Image', alt: '', link: '', width: 280, height: 200, lockRatio: true, _nw: 280, _nh: 200, borderRadius: 0, align: 'center', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } }
                };
            case 'text-2images':
                return { ...base,
                    orientation: 'horizontal', swapped: false, colRatio: '50-50',
                    gap: 20, imgGap: 12, backgroundColor: 'transparent',
                    outerPaddingTop: 16, outerPaddingRight: 16, outerPaddingBottom: 16, outerPaddingLeft: 16,
                    textCol: { content: '<p>Your text content here.</p>', align: 'left', direction: isRTL?'rtl':'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent', lw: { enabled: true, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } },
                    images: [
                        { src: 'https://via.placeholder.com/240x140/3b82f6/ffffff?text=Image+1', alt: '', link: '', width: 240, height: 140, lockRatio: true, _nw: 240, _nh: 140, borderRadius: 0, align: 'center', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } },
                        { src: 'https://via.placeholder.com/240x140/10b981/ffffff?text=Image+2', alt: '', link: '', width: 240, height: 140, lockRatio: true, _nw: 240, _nh: 140, borderRadius: 0, align: 'center', lw: { enabled: false, hAlign: 'center', vAlign: 'middle', dir: 'ltr' } }
                    ]
                };
            case 'divider':
                return { ...base, height: 1, color: '#e5e7eb', style: 'solid', width: '100%' };
            case 'spacer':
                return { ...base, height: 30 };
            default:
                return base;
        }
    },

    addBlock(type) {
        const block = this.createBlock(type);
        State.addBlock(block);
        this.openBlocks[block.id] = true;
        this.render();
        Preview.render();
        UI.showTab('content');
        Utils.showToast((BLOCK_META[type]?.name || type) + ' block added', 'success');
        setTimeout(() => { const list = document.getElementById('block-list'); if (list) list.scrollTop = list.scrollHeight; }, 50);
    },

    render() {
        const list = document.getElementById('block-list');
        if (!list) return;
        const blocks = State.get().blocks;
        if (!blocks.length) {
            list.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><h3>No content blocks</h3><p>Use the buttons below to add content</p></div>`;
            return;
        }
        list.innerHTML = blocks.map((b, i) => this.renderBlockCard(b, i)).join('');
        // Safely populate inline RTE editors after innerHTML render (content set via JS, not attribute injection)
        blocks.forEach((b, i) => {
            if (b.type === 'text') {
                Blocks.rteSetContent(i, b.content || '');
            } else if (b.type === 'two-texts') {
                b.columns?.forEach((c, ci) => {
                    Blocks.rteSetContent(20000 + i * 10 + ci, c.content || '');
                });
            } else if (b.type === 'text-image' || b.type === 'text-2images') {
                Blocks.rteSetContent(40000 + i * 10, b.textCol?.content || '');
            }
        });
    },

    renderBlockCard(block, index) {
        const meta   = BLOCK_META[block.type] || { name: block.type, icon: 'fas fa-cube' };
        const isOpen = !!this.openBlocks[block.id];
        return `<div class="block-card" id="bc-${block.id}">
            <div class="block-header" onclick="Blocks.toggleBlock('${block.id}')">
                <div class="block-title"><i class="${meta.icon}"></i>${meta.name}</div>
                <div class="block-actions" onclick="event.stopPropagation()">
                    <button title="Move up" onclick="Blocks.moveBlock(${index},-1)"><i class="fas fa-arrow-up"></i></button>
                    <button title="Move down" onclick="Blocks.moveBlock(${index}, 1)"><i class="fas fa-arrow-down"></i></button>
                    <button title="Duplicate" onclick="Blocks.duplicate(${index})"><i class="fas fa-copy"></i></button>
                    <button title="Delete" class="del" onclick="Blocks.delete(${index})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="block-body ${isOpen ? 'open' : ''}">${this.ctrlFor(block, index)}</div>
        </div>`;
    },

    toggleBlock(id) {
        this.openBlocks[id] = !this.openBlocks[id];
        const el = document.querySelector(`#bc-${id} .block-body`);
        if (el) el.classList.toggle('open', !!this.openBlocks[id]);
    },

    ctrlFor(block, index) {
        switch (block.type) {
            case 'text':        return this.ctrlText(block, index);
            case 'image':       return this.ctrlImage(block, index);
            case 'two-images':  return this.ctrlTwoImages(block, index);
            case 'two-texts':   return this.ctrlTwoTexts(block, index);
            case 'button':      return this.ctrlButton(block, index);
            case 'table':       return this.ctrlTable(block, index);
            case 'divider':     return this.ctrlDivider(block, index);
            case 'text-image':   return this.ctrlTextImage(block, index);
            case 'text-2images': return this.ctrlText2Images(block, index);
            case 'spacer':      return this.ctrlSpacer(block, index);
            default: return '';
        }
    },

    // RTE is now inline — no modal needed

    _rteSavedRange: null,
    _rtePainterActive: false,
    _rtePainterFormats: null,

    rteSaveSelection() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            this._rteSavedRange = sel.getRangeAt(0).cloneRange();
        }
    },

    rteRestoreSelection() {
        if (!this._rteSavedRange) return false;
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(this._rteSavedRange);
        return true;
    },

    buildRTE(block, i) {
        const edId  = `rte-body-${i}`;
        const htmId = `rte-html-${i}`;

        // Font size options
        const sizes = [10,11,12,13,14,15,16,18,20,22,24,28,32,36,42,48,60];

        const html = `
        <div class="rte-wrap" id="rte-wrap-${i}">
            <div class="rte-toolbar">

                <!-- Row 1: Formatting -->
                <div class="rte-row">
                    <button type="button" class="rte-btn" title="Bold"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'bold')"><b>B</b></button>
                    <button type="button" class="rte-btn" title="Italic"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'italic')"><i style="font-style:italic;">I</i></button>
                    <button type="button" class="rte-btn" title="Underline"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'underline')"><u>U</u></button>
                    <button type="button" class="rte-btn" title="Strikethrough"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'strikeThrough')"
                        style="text-decoration:line-through;font-size:10px;">S</button>
                    <button type="button" class="rte-btn" title="Superscript"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'superscript')"
                        style="font-size:10px;letter-spacing:-1px;">x²</button>
                    <button type="button" class="rte-btn" title="Subscript"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'subscript')"
                        style="font-size:10px;letter-spacing:-1px;">x₂</button>
                    <div class="rte-sep"></div>
                    <div class="rte-color-btn" title="Text Color">
                        <input type="color" value="#333333" id="rte-fc-${i}"
                            onmousedown="Blocks.rteSaveSelection()"
                            oninput="Blocks.rteApplyColor(${i},'foreColor',this.value);document.getElementById('rte-fc-line-${i}').style.background=this.value;">
                        <div class="rte-color-icon">
                            <span style="font-weight:800;font-size:11px;line-height:1;">A</span>
                            <span class="rte-color-underline" id="rte-fc-line-${i}" style="background:#333333;"></span>
                        </div>
                    </div>
                    <button type="button" class="rte-btn" title="Re-apply text color"
                        onmousedown="event.preventDefault();Blocks.rteReApplyColor(${i},'foreColor','rte-fc-${i}')">
                        <span style="font-weight:700;font-size:9px;">A+</span></button>
                    <div class="rte-sep"></div>
                    <div class="rte-color-btn" title="Highlight">
                        <input type="color" value="#fff176" id="rte-hl-${i}"
                            onmousedown="Blocks.rteSaveSelection()"
                            oninput="Blocks.rteApplyColor(${i},'hiliteColor',this.value);document.getElementById('rte-hl-line-${i}').style.background=this.value;">
                        <div class="rte-color-icon">
                            <i class="fas fa-highlighter" style="font-size:9px;"></i>
                            <span class="rte-color-underline" id="rte-hl-line-${i}" style="background:#fff176;"></span>
                        </div>
                    </div>
                    <button type="button" class="rte-btn" title="Re-apply highlight"
                        onmousedown="event.preventDefault();Blocks.rteReApplyColor(${i},'hiliteColor','rte-hl-${i}')">
                        <i class="fas fa-fill-drip" style="font-size:9px;"></i></button>
                    <div class="rte-sep"></div>
                    <button type="button" class="rte-btn" title="Clear Formatting"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'removeFormat')"
                        style="color:#f97316;"><i class="fas fa-eraser" style="font-size:9px;"></i></button>
                </div>

                <!-- Row 2: Font size + family -->
                <div class="rte-row">
                    <span class="rte-row-label">Size</span>
                    <select class="rte-sel-size" title="Font size"
                        onmousedown="Blocks.rteSaveSelection()"
                        onchange="Blocks.rteFontSize(${i},this.value);this.value=''">
                        <option value="">–</option>
                        ${sizes.map(s=>`<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <span class="rte-row-label">Font</span>
                    <select class="rte-sel-font" title="Font family"
                        onmousedown="Blocks.rteSaveSelection()"
                        onchange="Blocks.rteFontFamily(${i},this.value);this.value=''">
                        <option value="">–</option>
                        <option value="Arial,sans-serif">Arial</option>
                        <option value="Segoe UI,sans-serif">Segoe UI</option>
                        <option value="Georgia,serif">Georgia</option>
                        <option value="Times New Roman,serif">Times NR</option>
                        <option value="Verdana,sans-serif">Verdana</option>
                        <option value="Tahoma,sans-serif">Tahoma</option>
                        <option value="Courier New,monospace">Courier</option>
                        <option value="Traditional Arabic,serif">Arabic</option>
                    </select>
                    <div class="rte-sep"></div>
                    <button type="button" class="rte-btn" id="rte-painter-${i}" title="Format Painter"
                        onmousedown="event.preventDefault();Blocks.rteTogglePainter(${i})">
                        <i class="fas fa-paint-roller" style="font-size:9px;"></i></button>
                </div>

                <!-- Row 3: Alignment + lists -->
                <div class="rte-row">
                    <span class="rte-row-label">Align</span>
                    <button type="button" class="rte-btn" title="Left"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'justifyLeft')"><i class="fas fa-align-left"></i></button>
                    <button type="button" class="rte-btn" title="Center"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'justifyCenter')"><i class="fas fa-align-center"></i></button>
                    <button type="button" class="rte-btn" title="Right"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'justifyRight')"><i class="fas fa-align-right"></i></button>
                    <button type="button" class="rte-btn" title="Justify"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'justifyFull')"><i class="fas fa-align-justify"></i></button>
                    <div class="rte-sep"></div>
                    <button type="button" class="rte-btn" title="Bullet list"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'insertUnorderedList')"><i class="fas fa-list-ul"></i></button>
                    <button type="button" class="rte-btn" title="Numbered list"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'insertOrderedList')"><i class="fas fa-list-ol"></i></button>
                    <button type="button" class="rte-btn" title="Indent"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'indent')"><i class="fas fa-indent"></i></button>
                    <button type="button" class="rte-btn" title="Outdent"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'outdent')"><i class="fas fa-outdent"></i></button>
                    <div class="rte-sep"></div>
                    <button type="button" class="rte-btn" title="Insert Link"
                        onmousedown="event.preventDefault();Blocks.rteLink(${i})"><i class="fas fa-link"></i></button>
                    <button type="button" class="rte-btn" title="Remove Link"
                        onmousedown="event.preventDefault();Blocks.rteCmd(${i},'unlink')"><i class="fas fa-unlink"></i></button>
                    <div class="rte-sep"></div>
                    <button type="button" class="rte-btn" title="No Wrap — prevents line-breaking in Outlook (wraps selection in nowrap table)"
                        onmousedown="event.preventDefault();Blocks.rteNowrap(${i})"
                        style="font-size:9px;font-weight:700;letter-spacing:-0.5px;">NW</button>
                </div>

            </div>
            <div class="rte-body" id="${edId}" contenteditable="true"
                oninput="Blocks.rteSync(${i})"
                onmouseup="Blocks.rteSaveSelection()"
                onkeyup="Blocks.rteSaveSelection()"
                onpaste="Blocks.rtePaste(event,${i})"></div>
            <button type="button" class="rte-html-toggle"
                onclick="Blocks.rteToggleHTML(${i})">&lt;/&gt; HTML</button>
            <textarea class="rte-html-area" id="${htmId}"
                oninput="Blocks.rteHTMLSync(${i})"></textarea>
        </div>`;

        return html;
    },

    // Call after buildRTE html is inserted into DOM — safely sets content
    rteSetContent(i, content) {
        const el  = document.getElementById(`rte-body-${i}`);
        const htm = document.getElementById(`rte-html-${i}`);
        if (el)  el.innerHTML  = content || '';
        if (htm) htm.value     = content || '';
    },

    // Execute execCommand
    rteCmd(i, cmd, val) {
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        el.focus();
        document.execCommand(cmd, false, val || null);
        this.rteSync(i);
    },

    // Apply font size as real px (not HTML 1-7)
    rteFontSize(i, px) {
        if (!px) return;
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        this.rteRestoreSelection();
        el.focus();
        document.execCommand('fontSize', false, '7');
        el.querySelectorAll('font[size="7"]').forEach(s => {
            s.removeAttribute('size');
            s.style.fontSize = px + 'px';
        });
        this.rteSync(i);
    },

    // Apply font family
    rteFontFamily(i, family) {
        if (!family) return;
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        this.rteRestoreSelection();
        el.focus();
        document.execCommand('fontName', false, family);
        this.rteSync(i);
    },

    // Apply color with selection restore (fixes the click-then-enter problem)
    rteApplyColor(i, cmd, color) {
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        this.rteRestoreSelection();
        el.focus();
        if (cmd === 'hiliteColor') {
            // Try hiliteColor first (Chrome/Firefox), fall back to backColor
            try { document.execCommand('hiliteColor', false, color); }
            catch(e) { document.execCommand('backColor', false, color); }
        } else {
            document.execCommand(cmd, false, color);
        }
        this.rteSync(i);
    },

    // Re-apply the last chosen color with one click (no picker needed)
    rteReApplyColor(i, cmd, pickerId) {
        const picker = document.getElementById(pickerId);
        if (!picker) return;
        this.rteApplyColor(i, cmd, picker.value);
        // Flash the button
        const dotId = pickerId.replace('rte-fc-', 'rte-fc-dot-').replace('rte-hl-', 'rte-hl-dot-');
        const dot = document.getElementById(dotId);
        if (dot) dot.style.background = picker.value;
    },

    // ── FORMAT PAINTER ────────────────────────────
    rteTogglePainter(i) {
        const btn = document.getElementById(`rte-painter-${i}`);
        const el  = document.getElementById(`rte-body-${i}`);
        if (!el) return;

        if (this._rtePainterActive) {
            // Deactivate
            this._rtePainterActive = false;
            this._rtePainterFormats = null;
            if (btn) btn.classList.remove('active');
            el.style.cursor = '';
            el.removeEventListener('mouseup', el._painterHandler);
        } else {
            // Capture format from current selection
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) {
                Utils.showToast('Select some text first, then click Format Painter', 'info');
                return;
            }
            // Read computed styles of the selection anchor node
            const node = sel.anchorNode?.parentElement || el;
            const cs = window.getComputedStyle(node);
            this._rtePainterFormats = {
                bold:      document.queryCommandState('bold'),
                italic:    document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                color:     cs.color,
                fontSize:  cs.fontSize,
                fontFamily:cs.fontFamily,
                bgColor:   cs.backgroundColor
            };
            this._rtePainterActive = true;
            if (btn) btn.classList.add('active');
            el.style.cursor = 'crosshair';
            Utils.showToast('Format Painter active — now select target text', 'info');

            // Apply on next mouseup
            const self = this;
            el._painterHandler = function() {
                self.rteApplyPainter(i);
                el.removeEventListener('mouseup', el._painterHandler);
            };
            el.addEventListener('mouseup', el._painterHandler);
        }
    },

    rteApplyPainter(i) {
        const f = this._rtePainterFormats;
        if (!f) return;
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        el.focus();
        if (f.bold)      document.execCommand('bold',      false, null);
        if (f.italic)    document.execCommand('italic',    false, null);
        if (f.underline) document.execCommand('underline', false, null);
        if (f.color && f.color !== 'rgba(0, 0, 0, 0)') document.execCommand('foreColor', false, f.color);
        if (f.bgColor && f.bgColor !== 'rgba(0, 0, 0, 0)' && f.bgColor !== 'transparent') {
            try { document.execCommand('hiliteColor', false, f.bgColor); }
            catch(e) { document.execCommand('backColor', false, f.bgColor); }
        }
        if (f.fontSize && f.fontSize !== '') {
            const px = parseInt(f.fontSize);
            document.execCommand('fontSize', false, '7');
            el.querySelectorAll('font[size="7"]').forEach(s => { s.removeAttribute('size'); s.style.fontSize = px + 'px'; });
        }
        this.rteSync(i);
        // Deactivate painter
        this._rtePainterActive = false;
        this._rtePainterFormats = null;
        el.style.cursor = '';
        const btn = document.getElementById(`rte-painter-${i}`);
        if (btn) btn.classList.remove('active');
        Utils.showToast('Format applied!', 'success');
    },

    // Insert link
    rteLink(i) {
        const url = prompt('Enter URL:', 'https://');
        if (!url) return;
        const el = document.getElementById(`rte-body-${i}`);
        if (!el) return;
        el.focus();
        document.execCommand('createLink', false, url);
        // Make links open in new tab
        el.querySelectorAll('a').forEach(a => { a.target = '_blank'; a.rel = 'noopener'; });
        this.rteSync(i);
    },

    // Wrap selected text in email-safe nowrap table structure
    // Works on any selection — if mid-paragraph, the <p> will split (browser behavior)
    rteNowrap(i) {
        const el = document.getElementById('rte-body-' + i);
        if (!el) return;
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
            Utils.showToast('Select text first, then click No Wrap', 'info');
            return;
        }
        el.focus();
        // Get selected HTML
        const range = sel.getRangeAt(0);
        const frag  = range.cloneContents();
        const div   = document.createElement('div');
        div.appendChild(frag);
        const selHtml = div.innerHTML;
        // Build nowrap wrapper
        const wrapped =
            '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">' +
            '<tr><td style="white-space:nowrap !important;" nowrap>' +
            '<span style="white-space:nowrap !important;">' + selHtml + '</span>' +
            '</td></tr></table>';
        // Replace selection
        range.deleteContents();
        const tmp = document.createElement('div');
        tmp.innerHTML = wrapped;
        const insertFrag = document.createDocumentFragment();
        while (tmp.firstChild) insertFrag.appendChild(tmp.firstChild);
        range.insertNode(insertFrag);
        // Move cursor after inserted content
        sel.collapseToEnd();
        this.rteSync(i);
    },

    // Decode a compound RTE key back to blockIndex + optional colIndex
    // Keys < 1000 = plain block index
    // Keys >= 1000 = 20000 + i*10 + ci (e.g. block 2 col 1 = 201)
    _rteDecodeKey(k) {
        if (k < 20000) return { bi: k, ci: -1 };       // plain block index
        return { bi: Math.floor((k - 20000) / 10), ci: (k - 20000) % 10 };
    },

    // Sync RTE body → state
    rteSync(i) {
        const el  = document.getElementById(`rte-body-${i}`);
        const htm = document.getElementById(`rte-html-${i}`);
        if (!el) return;
        const html = el.innerHTML;
        if (htm) htm.value = html;
        // Special keys for header (10001) and footer (10002)
        if (i === 10001) { State.updateHeader({ text: html }); Preview.render(); return; }
        if (i === 10002) { State.updateFooter({ text: html }); Preview.render(); return; }
        // text-image / text-2images text column: 40000 + bi*10
        if (i >= 40000) {
            const bi2 = Math.floor((i - 40000) / 10);
            const blks = State.get().blocks;
            if (blks[bi2]?.textCol !== undefined) {
                blks[bi2].textCol.content = html;
                State.updateBlocks(blks);
                Preview.render();
            }
            return;
        }
        // Cell RTE keys: 30000 + bi*100 + cellIdx
        if (i >= 40000) {
            const bi2 = Math.floor((i - 40000) / 10);
            const blks = State.get().blocks;
            if (blks[bi2]?.textCol !== undefined) {
                blks[bi2].textCol.content = htm.value;
                State.updateBlocks(blks);
                Preview.render();
            }
            return;
        }
        if (i >= 30000) {
            const ci2 = i - 30000;
            const cbi = Math.floor(ci2 / 100);
            const cIdx = ci2 % 100;
            this.updCell(cbi, cIdx, 'content', html);
            return;
        }
        const { bi, ci } = this._rteDecodeKey(i);
        if (ci === -1) {
            this.upd(bi, 'content', html);
        } else {
            const blocks = State.get().blocks;
            if (blocks[bi]?.columns?.[ci] !== undefined) {
                blocks[bi].columns[ci].content = html;
                State.updateBlocks(blocks);
                Preview.render();
            }
        }
    },

    // Sync html textarea → RTE
    rteHTMLSync(i) {
        const htm = document.getElementById(`rte-html-${i}`);
        const el  = document.getElementById(`rte-body-${i}`);
        if (!htm || !el) return;
        el.innerHTML = htm.value;
        if (i === 10001) { State.updateHeader({ text: htm.value }); Preview.render(); return; }
        if (i === 10002) { State.updateFooter({ text: htm.value }); Preview.render(); return; }
        if (i >= 40000) {
            const bi2 = Math.floor((i - 40000) / 10);
            const blks = State.get().blocks;
            if (blks[bi2]?.textCol !== undefined) {
                blks[bi2].textCol.content = htm.value;
                State.updateBlocks(blks);
                Preview.render();
            }
            return;
        }
        if (i >= 30000) {
            const ci2 = i - 30000;
            const cbi = Math.floor(ci2 / 100);
            const cIdx = ci2 % 100;
            this.updCell(cbi, cIdx, 'content', htm.value);
            return;
        }
        const { bi, ci } = this._rteDecodeKey(i);
        if (ci === -1) {
            this.upd(bi, 'content', htm.value);
        } else {
            const blocks = State.get().blocks;
            if (blocks[bi]?.columns?.[ci] !== undefined) {
                blocks[bi].columns[ci].content = htm.value;
                State.updateBlocks(blocks);
                Preview.render();
            }
        }
    },

    // Toggle HTML textarea
    rteToggleHTML(i) {
        const area = document.getElementById(`rte-html-${i}`);
        const btn  = area?.previousElementSibling;
        if (!area) return;
        const showing = area.style.display === 'block';
        area.style.display = showing ? 'none' : 'block';
        if (btn) btn.style.color = showing ? '' : 'var(--accent)';
        if (!showing) {
            const el = document.getElementById(`rte-body-${i}`);
            if (el) area.value = el.innerHTML;
        }
    },

    // Paste handler — strips external styles but preserves HTML formatting
    rtePaste(e, i) {
        e.preventDefault();
        const cd = e.clipboardData || window.clipboardData;
        // Check for image in clipboard first
        if (cd.files && cd.files.length > 0) {
            const file = cd.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.execCommand('insertImage', false, ev.target.result);
                    this.rteSync(i);
                };
                reader.readAsDataURL(file);
                return;
            }
        }
        // Try HTML paste (preserves bold/italic/links) — strip dangerous attrs
        const html = cd.getData('text/html');
        if (html) {
            const clean = html
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/\s*style="[^"]*"/gi, '')
                .replace(/\s*class="[^"]*"/gi, '')
                .replace(/<font[^>]*>/gi, '').replace(/<\/font>/gi, '')
                .replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '');
            document.execCommand('insertHTML', false, clean);
        } else {
            const text = cd.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
        this.rteSync(i);
    },

    handleImageInputPaste(e, blockIndex, imageIndex) {
        const cd = e.clipboardData || window.clipboardData;
        if (!cd) return;
        const tryBlob = (file) => {
            if (!file || !file.type.startsWith('image/')) return false;
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = ev => { this._applyImg(blockIndex, imageIndex ?? null, ev.target.result); };
            reader.readAsDataURL(file);
            return true;
        };
        if (cd.files && cd.files.length > 0 && tryBlob(cd.files[0])) return;
        const imgItem = Array.from(cd.items||[]).find(it=>it.type.startsWith('image/'));
        if (imgItem) tryBlob(imgItem.getAsFile());
    },

    // ── Sec image helpers — mirror of _applyImg/handleImageInputPaste for sec blocks ──

    // URL typed/pasted as text → load image, detect dimensions, write to sec
    updSecSrcFromInput(bi, sec, src) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.[sec]) return;
        const obj = blocks[bi][sec];
        obj.src = src;
        const img = new Image();
        img.onload = () => {
            obj._nw = img.naturalWidth; obj._nh = img.naturalHeight;
            obj.width = img.naturalWidth; obj.height = img.naturalHeight;
            State.updateBlocks(blocks); this.render(); Preview.render();
        };
        img.onerror = () => { State.updateBlocks(blocks); Preview.render(); };
        img.src = src;
    },

    // URL typed/pasted as text → load image, detect dimensions, write to images[ii]
    updSecImgSrcFromInput(bi, ii, src) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        const obj = blocks[bi].images[ii];
        obj.src = src;
        const img = new Image();
        img.onload = () => {
            obj._nw = img.naturalWidth; obj._nh = img.naturalHeight;
            obj.width = img.naturalWidth; obj.height = img.naturalHeight;
            State.updateBlocks(blocks); this.render(); Preview.render();
        };
        img.onerror = () => { State.updateBlocks(blocks); Preview.render(); };
        img.src = src;
    },

    // Image file pasted via Ctrl+V into URL input — text-image section
    handleSecPaste(e, bi, sec) {
        const cd = e.clipboardData || window.clipboardData;
        if (!cd) return;
        const tryBlob = (file) => {
            if (!file || !file.type.startsWith('image/')) return false;
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = ev => { this.updSecSrcFromInput(bi, sec, ev.target.result); };
            reader.readAsDataURL(file);
            return true;
        };
        if (cd.files && cd.files.length > 0 && tryBlob(cd.files[0])) return;
        const imgItem = Array.from(cd.items||[]).find(it=>it.type.startsWith('image/'));
        if (imgItem) tryBlob(imgItem.getAsFile());
    },

    // Image file pasted via Ctrl+V into URL input — text-2images section
    handleSecImgPaste(e, bi, ii) {
        const cd = e.clipboardData || window.clipboardData;
        if (!cd) return;
        const tryBlob = (file) => {
            if (!file || !file.type.startsWith('image/')) return false;
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = ev => { this.updSecImgSrcFromInput(bi, ii, ev.target.result); };
            reader.readAsDataURL(file);
            return true;
        };
        if (cd.files && cd.files.length > 0 && tryBlob(cd.files[0])) return;
        const imgItem = Array.from(cd.items||[]).find(it=>it.type.startsWith('image/'));
        if (imgItem) tryBlob(imgItem.getAsFile());
    },


    // ── TEXT CONTROLS ─────────────────────────────
    // FIX #1: Text Color and Background are now STACKED (each .ctrl on its own row, no .row2 wrapper)
    // The root cause was wrapping both color inputs in <div class="row2"> which forced 2-column grid.
    // Fix: removed .row2 wrapper — each color has its own .ctrl div at full width.
    ctrlText(block, i) {
        const ptop  = block.paddingTop    ?? 25;
        const pright= block.paddingRight  ?? 25;
        const pbot  = block.paddingBottom ?? 25;
        const pleft = block.paddingLeft   ?? 25;
        return `
        <div class="ctrl">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <label style="margin:0;">Content</label>
                <button type="button" class="mini-btn" onclick="Blocks.showDatePicker(${i},'text')" title="Insert date"><i class="fas fa-calendar-alt"></i> Date</button>
            </div>
            ${this.buildRTE(block, i)}
        </div>
        <div class="row2">
            <div class="ctrl"><label>Font Size</label>
                <input type="number" value="${block.size}" min="8" max="72" oninput="Blocks.upd(${i},'size',parseInt(this.value)||16)">
            </div>
            <div class="ctrl"><label>Line Height</label>
                <input type="number" value="${block.lineHeight??1.65}" min="1" max="4" step="0.05" oninput="Blocks.upd(${i},'lineHeight',parseFloat(this.value)||1.65)">
            </div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Text Align</label>
                <select onchange="Blocks.upd(${i},'align',this.value)">
                    <option value="left"    ${block.align==='left'   ?'selected':''}>Left</option>
                    <option value="center"  ${block.align==='center' ?'selected':''}>Center</option>
                    <option value="right"   ${block.align==='right'  ?'selected':''}>Right</option>
                    <option value="justify" ${block.align==='justify'?'selected':''}>Justify</option>
                </select>
            </div>
            <div class="ctrl"><label>Direction</label>
                <select onchange="Blocks.upd(${i},'direction',this.value)">
                    <option value="ltr" ${(block.direction||'ltr')==='ltr'?'selected':''}>LTR →</option>
                    <option value="rtl" ${(block.direction||'ltr')==='rtl'?'selected':''}>RTL ← Arabic</option>
                </select>
            </div>
        </div>
        <div class="ctrl"><label>Text Color</label>
            <div class="color-row">
                <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.color};"></div>
                    <input type="color" value="${block.color}" oninput="Blocks.updColor(${i},'color',this)">
                </div>
                <input type="text" value="${block.color}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'color',this)">
            </div>
        </div>
        <div class="ctrl"><label>Background</label>
            ${this.colorRowTransparent('txbg-'+i, block.backgroundColor, i, 'backgroundColor')}
        </div>
        <div class="ctrl"><label>Padding (px) — Top / Right / Bottom / Left</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${ptop}"  min="0" max="200" oninput="Blocks.upd(${i},'paddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${pright}" min="0" max="200" oninput="Blocks.upd(${i},'paddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${pbot}"  min="0" max="200" oninput="Blocks.upd(${i},'paddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${pleft}" min="0" max="200" oninput="Blocks.upd(${i},'paddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlLW(block.lw, `Blocks.updLW(${i}`, `blk-${i}`)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── IMAGE CONTROLS ────────────────────────────
    ctrlImage(block, i) {
        const pt = block.paddingTop    ?? 0;
        const pr = block.paddingRight  ?? 0;
        const pb = block.paddingBottom ?? 0;
        const pl = block.paddingLeft   ?? 0;
        const locked = block.lockRatio !== false;
        const w = Math.max(1, block.width  || 1);
        const h = Math.max(1, block.height || 1);
        return `
        <div class="ctrl"><label>Image</label>
            <div class="img-drop" onclick="Blocks.uploadImage(${i})">
                ${block.src
                    ? `<img src="${block.src}" style="max-height:80px;max-width:100%;display:block;margin:0 auto;border-radius:4px;border:1px solid var(--border2);">`
                    : '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload image</span>'}
            </div>
            <div class="img-action-row">
                <button type="button" class="clipboard-paste-btn" onclick="Blocks.pasteImageClipboard(${i},null)">
                    <i class="fas fa-clipboard"></i> Paste from Clipboard
                </button>
                <button type="button" class="browse-lib-btn" onclick="Blocks.browseLibImg(${i},null)">
                    <i class="fas fa-images"></i> Browse Library
                </button>
            </div>
            <div class="img-url-row">
                <input type="text" id="url-img-${i}" value="${block.src}" placeholder="Or paste image URL / Ctrl+V"
                    oninput="Blocks.updSrcFromInput(${i},null,this.value);Blocks._toggleFetchBtn('fetch-img-${i}',this.value)"
                    onpaste="Blocks.handleImageInputPaste(event,${i},null)">
                <button type="button" id="fetch-img-${i}" class="fetch-url-btn" ${Blocks._isValidUrl(block.src)?'':'disabled'}
                    onclick="Blocks.fetchImgFromUrl(${i},null,document.getElementById('url-img-${i}').value)"
                    title="Fetch & embed as base64"><i class="fas fa-download"></i>
                </button>
            </div>
            ${block.src ? `
            <button type="button" class="ctrl-btn" style="margin-top:5px;" onclick="(()=>{const t='<img src=\\'${block.src.replace(/'/g,"\\'").replace(/\\/g,'\\\\')}\\'  alt=\\'${(block.alt||'').replace(/'/g,"\\'")}\\' width=\\'${block.width}\\' height=\\'${block.height}\\' border=\\'0\\'>';navigator.clipboard.writeText(t).then(()=>Utils.showToast('&lt;img&gt; tag copied','success'));})()"><i class="fas fa-code"></i> Copy &lt;img&gt; Tag</button>
            <button type="button" class="ctrl-btn ctrl-btn-danger" onclick="Blocks.clearImg(${i})"><i class="fas fa-times"></i> Remove Image</button>` : ''}
        </div>
        <div class="ctrl"><label>Alt Text</label>
            <input type="text" value="${block.alt}" placeholder="Describe the image" oninput="Blocks.upd(${i},'alt',this.value)">
        </div>
        <div class="ctrl"><label>Size</label>
            <div class="img-size-row">
                <div class="img-size-field">
                    <span class="img-size-lbl">W</span>
                    <input type="number" id="imgW-${i}" value="${w}" min="1" max="4000" oninput="Blocks.updWH(${i},null,'w',this.value)">
                    <span class="img-size-unit">px</span>
                </div>
                <button type="button" class="ratio-lock-btn ${locked?'active':''}" id="lock-${i}"
                    title="${locked?'Ratio locked — W drives H':'Ratio unlocked'}"
                    onclick="Blocks.toggleLock(${i},null,this)">
                    <i class="fas ${locked?'fa-link':'fa-unlink'}"></i>
                </button>
                <div class="img-size-field">
                    <span class="img-size-lbl">H</span>
                    <input type="number" id="imgH-${i}" value="${h}" min="1" max="4000" oninput="Blocks.updWH(${i},null,'h',this.value)">
                    <span class="img-size-unit">px</span>
                </div>
            </div>
        </div>
        <div class="ctrl"><label>Border Radius</label>
            <input type="number" value="${block.borderRadius}" min="0" max="200" oninput="Blocks.upd(${i},'borderRadius',parseInt(this.value)||0)">
        </div>
        <div class="ctrl"><label>Link URL (optional)</label>
            <input type="text" value="${block.link}" placeholder="https://..." oninput="Blocks.upd(${i},'link',this.value)">
        </div>
        <div class="ctrl"><label>Padding (px) — Top / Right / Bottom / Left</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="200" oninput="Blocks.upd(${i},'paddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="200" oninput="Blocks.upd(${i},'paddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="200" oninput="Blocks.upd(${i},'paddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="200" oninput="Blocks.upd(${i},'paddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlAlign(block, i)}
        ${this.ctrlVAlign(block, i)}
        ${this.ctrlLW(block.lw, `Blocks.updLW(${i}`, `img-${i}`)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TWO IMAGES CONTROLS ───────────────────────
    ctrlTwoImages(block, i) {
        const imgPanel = (img, idx) => {
            const alignIcons = ['left','center','right'].map(a =>
                `<button type="button" class="rte-btn ${(img.align||'center')===a?'active':''}" title="${a}"
                    onclick="Blocks.updImg(${i},${idx},'align','${a}')">
                    <i class="fas fa-align-${a}" style="font-size:10px;"></i></button>`
            ).join('');
            return `
            <div class="img2-panel">
                <div class="img-drop img2-drop" onclick="Blocks.uploadImg2(${i},${idx})">
                    ${img.src
                        ? `<img src="${img.src}" style="max-height:70px;max-width:100%;display:block;margin:0 auto;border-radius:4px;border:1px solid var(--border2);">`
                        : '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload</span>'}
                </div>
                <div class="img-action-row img-action-row--narrow">
                    <button type="button" class="clipboard-paste-btn" onclick="Blocks.pasteImageClipboard(${i},${idx})">
                        <i class="fas fa-clipboard"></i> Paste from Clipboard
                    </button>
                    <button type="button" class="browse-lib-btn" onclick="Blocks.browseLibImg(${i},${idx})">
                        <i class="fas fa-images"></i> Browse Library
                    </button>
                </div>
                <div class="ctrl" style="margin-bottom:4px;">
                    <label style="font-size:10px;font-weight:700;color:var(--accent);">IMAGE ${idx+1}</label>
                    <div class="img-url-row">
                        <input type="text" id="url-img2-${i}-${idx}" value="${img.src}" placeholder="Or paste URL / Ctrl+V" style="font-size:11px;"
                            oninput="Blocks.updSrcFromInput(${i},${idx},this.value);Blocks._toggleFetchBtn('fetch-img2-${i}-${idx}',this.value)"
                            onpaste="Blocks.handleImageInputPaste(event,${i},${idx})">
                        <button type="button" id="fetch-img2-${i}-${idx}" class="fetch-url-btn" ${Blocks._isValidUrl(img.src)?'':'disabled'}
                            onclick="Blocks.fetchImgFromUrl(${i},${idx},document.getElementById('url-img2-${i}-${idx}').value)"
                            title="Fetch & embed as base64"><i class="fas fa-download"></i>
                        </button>
                    </div>
                    ${img.src ? `
                    <button type="button" class="ctrl-btn" style="margin-top:4px;font-size:10px;" onclick="(()=>{const t='<img src=\\'${img.src.replace(/'/g,"\\'")}\\'  alt=\\'${(img.alt||'').replace(/'/g,"\\'")}\\' width=\\'${Math.max(1,img.width||1)}\\' height=\\'${Math.max(1,img.height||1)}\\' border=\\'0\\'>';navigator.clipboard.writeText(t).then(()=>Utils.showToast('&lt;img&gt; tag copied','success'));})()"><i class="fas fa-code"></i> Copy &lt;img&gt; Tag</button>
                    <button type="button" class="ctrl-btn ctrl-btn-danger" style="margin-top:3px;font-size:10px;" onclick="Blocks.clearImg2(${i},${idx})"><i class="fas fa-times"></i> Remove Image</button>` : ''}
                </div>
                <div class="ctrl" style="margin-bottom:4px;"><label>Alt text</label>
                    <input type="text" value="${img.alt}" placeholder="Describe image"
                        oninput="Blocks.updImg(${i},${idx},'alt',this.value)" style="font-size:11px;">
                </div>
                <div class="ctrl" style="margin-bottom:4px;"><label>Link URL</label>
                    <input type="text" value="${img.link||''}" placeholder="https://..."
                        oninput="Blocks.updImg(${i},${idx},'link',this.value)" style="font-size:11px;">
                </div>
                <div style="margin-bottom:4px;">
                    <div class="img-size-row" style="margin-bottom:5px;">
                        <div class="img-size-field">
                            <span class="img-size-lbl">W</span>
                            <input type="number" id="imgW-${i}-${idx}" value="${Math.max(1,img.width||1)}" min="1" max="4000"
                                oninput="Blocks.updWH(${i},${idx},'w',this.value)">
                            <span class="img-size-unit">px</span>
                        </div>
                        <button type="button" class="ratio-lock-btn ${(img.lockRatio!==false)?'active':''}"
                            id="lock-${i}-${idx}" title="${(img.lockRatio!==false)?'Locked':'Unlocked'}"
                            onclick="Blocks.toggleLock(${i},${idx},this)">
                            <i class="fas ${(img.lockRatio!==false)?'fa-link':'fa-unlink'}"></i>
                        </button>
                        <div class="img-size-field">
                            <span class="img-size-lbl">H</span>
                            <input type="number" id="imgH-${i}-${idx}" value="${Math.max(1,img.height||1)}" min="1" max="4000"
                                oninput="Blocks.updWH(${i},${idx},'h',this.value)">
                            <span class="img-size-unit">px</span>
                        </div>
                    </div>
                    <div class="ctrl" style="margin:0;"><label>Radius</label>
                        <input type="number" value="${img.borderRadius||0}" min="0" max="200"
                            oninput="Blocks.updImg(${i},${idx},'borderRadius',parseInt(this.value)||0)">
                    </div>
                </div>
                <div class="ctrl" style="margin:0;"><label>Align</label>
                    <div class="btn-group-sm" style="margin-top:3px;">${alignIcons}</div>
                </div>
                ${this.ctrlLW(img.lw, `Blocks.updLWImg(${i},${idx}`, `img2-${i}-${idx}`)}
            </div>`;
        };

        const pt = block.paddingTop    ?? 16;
        const pr = block.paddingRight  ?? 16;
        const pb = block.paddingBottom ?? 16;
        const pl = block.paddingLeft   ?? 16;

        return `
        <div class="img2-container">
            ${imgPanel(block.images[0], 0)}
            <div class="img2-divider"></div>
            ${imgPanel(block.images[1], 1)}
        </div>
        <div class="ctrl" style="margin-top:10px;"><label>Gap between images (px)</label>
            <input type="number" value="${block.gap}" min="0" max="80" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)">
        </div>
        <div class="ctrl"><label>Padding (px) — Top / Right / Bottom / Left</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="200" oninput="Blocks.upd(${i},'paddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="200" oninput="Blocks.upd(${i},'paddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="200" oninput="Blocks.upd(${i},'paddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="200" oninput="Blocks.upd(${i},'paddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlAlign(block, i)}
        ${this.ctrlVAlign(block, i)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TWO TEXTS CONTROLS ────────────────────────
    ctrlTwoTexts(block, i) {
        const [c0, c1] = block.columns;
        const opT = block.outerPaddingTop    ?? 16;
        const opR = block.outerPaddingRight  ?? 16;
        const opB = block.outerPaddingBottom ?? 16;
        const opL = block.outerPaddingLeft   ?? 16;

        const col = (c, ci) => {
            const pt = c.paddingTop    ?? 12;
            const pr = c.paddingRight  ?? 12;
            const pb = c.paddingBottom ?? 12;
            const pl = c.paddingLeft   ?? 12;
            return `
            <div class="col-panel">
                <div class="col-panel-head"><span>${ci===0?'⬅ Left':'Right ➡'} Column</span>
                    <button type="button" class="mini-btn" onclick="Blocks.showDatePicker(${i},'two-texts',${ci})"><i class="fas fa-calendar-alt"></i></button>
                </div>
                ${this.buildRTE(c, 20000 + i*10 + ci)}
                <div class="row2">
                    <div class="ctrl"><label>Size</label><input type="number" value="${c.size||15}" min="8" max="72" oninput="Blocks.updCol(${i},${ci},'size',parseInt(this.value)||15)"></div>
                    <div class="ctrl"><label>Line Height</label><input type="number" value="${c.lineHeight||1.65}" min="1" max="4" step="0.05" oninput="Blocks.updCol(${i},${ci},'lineHeight',parseFloat(this.value)||1.65)"></div>
                </div>
                <div class="row2">
                    <div class="ctrl"><label>Align</label>
                        <select onchange="Blocks.updCol(${i},${ci},'align',this.value)">
                            <option value="left"    ${c.align==='left'   ?'selected':''}>Left</option>
                            <option value="center"  ${c.align==='center' ?'selected':''}>Center</option>
                            <option value="right"   ${c.align==='right'  ?'selected':''}>Right</option>
                            <option value="justify" ${c.align==='justify'?'selected':''}>Justify</option>
                        </select>
                    </div>
                    <div class="ctrl"><label>Direction</label>
                        <select onchange="Blocks.updCol(${i},${ci},'direction',this.value)">
                            <option value="ltr" ${(c.direction||'ltr')==='ltr'?'selected':''}>LTR →</option>
                            <option value="rtl" ${(c.direction||'ltr')==='rtl'?'selected':''}>RTL ←</option>
                        </select>
                    </div>
                </div>
                <div class="ctrl"><label>Vertical Align</label>
                    <div class="btn-group-sm">
                        <button type="button" title="Top"    class="${(c.verticalAlign||'top')==='top'   ?'active':''}" onclick="Blocks.updCol(${i},${ci},'verticalAlign','top')"><i class="fas fa-arrow-up"></i></button>
                        <button type="button" title="Middle" class="${(c.verticalAlign||'top')==='middle'?'active':''}" onclick="Blocks.updCol(${i},${ci},'verticalAlign','middle')"><i class="fas fa-minus"></i></button>
                        <button type="button" title="Bottom" class="${(c.verticalAlign||'top')==='bottom'?'active':''}" onclick="Blocks.updCol(${i},${ci},'verticalAlign','bottom')"><i class="fas fa-arrow-down"></i></button>
                    </div>
                </div>
                ${this.ctrlLW(c.lw, `Blocks.updLWCol(${i},${ci}`, `col-${i}-${ci}`)}
                <div class="ctrl"><label>Text Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${c.color||'#334155'};"></div>
                            <input type="color" value="${c.color||'#334155'}" oninput="Blocks.updColColor(${i},${ci},'color',this)">
                        </div>
                        <input type="text" value="${c.color||'#334155'}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updColHex(${i},${ci},'color',this)">
                    </div>
                </div>
                <div class="ctrl"><label>Background</label>
                    ${this.colorRowTransparentCol(i, ci, 'backgroundColor', c.backgroundColor||'transparent')}
                </div>
                <div class="ctrl"><label>Padding T/R/B/L</label>
                    <div class="row4">
                        <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="100" oninput="Blocks.updCol(${i},${ci},'paddingTop',parseInt(this.value)||0)"></div>
                        <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="100" oninput="Blocks.updCol(${i},${ci},'paddingRight',parseInt(this.value)||0)"></div>
                        <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="100" oninput="Blocks.updCol(${i},${ci},'paddingBottom',parseInt(this.value)||0)"></div>
                        <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="100" oninput="Blocks.updCol(${i},${ci},'paddingLeft',parseInt(this.value)||0)"></div>
                    </div>
                </div>
            </div>`;
        };

        return `
        ${col(c0,0)}
        <div class="col-divider"></div>
        ${col(c1,1)}
        <div class="col-divider"></div>
        <div class="ctrl"><label>Column Gap (px)</label>
            <input type="number" value="${block.gap}" min="0" max="100" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)">
        </div>
        <div class="ctrl"><label>Column Ratio</label>
            <div class="btn-group-sm">
                <button type="button" class="${(block.colRatio||'50-50')==='50-50'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','50-50')">50/50</button>
                <button type="button" class="${(block.colRatio||'50-50')==='60-40'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','60-40')">60/40</button>
                <button type="button" class="${(block.colRatio||'50-50')==='40-60'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','40-60')">40/60</button>
                <button type="button" class="${(block.colRatio||'50-50')==='70-30'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','70-30')">70/30</button>
                <button type="button" class="${(block.colRatio||'50-50')==='30-70'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','30-70')">30/70</button>
            </div>
        </div>
        <div class="ctrl">
            <label>Text Wrap <span style="color:var(--text3);font-weight:400;font-size:10px;">(one col floats, text flows around)</span></label>
            <div class="section-toggle-row" style="padding:0;margin-bottom:${!!block.wrap?'8px':'0'};">
                <span style="font-size:11px;color:var(--text2);">Enable Wrap</span>
                <label class="pill-toggle"><input type="checkbox" ${block.wrap?'checked':''} onchange="Blocks.upd(${i},'wrap',this.checked)"><span class="pill-slider"></span></label>
            </div>
            ${block.wrap ? `<div class="row3" style="gap:6px;">
                <div class="ctrl" style="margin:0;"><label>Float Col</label>
                    <select onchange="Blocks.upd(${i},'wrapCol',parseInt(this.value))">
                        <option value="0" ${(block.wrapCol||0)===0?'selected':''}>Left Col</option>
                        <option value="1" ${(block.wrapCol||0)===1?'selected':''}>Right Col</option>
                    </select>
                </div>
                <div class="ctrl" style="margin:0;"><label>Width (px)</label>
                    <input type="number" value="${block.wrapWidth||220}" min="80" max="500" oninput="Blocks.upd(${i},'wrapWidth',parseInt(this.value)||220)">
                </div>
                <div class="ctrl" style="margin:0;"><label>Side</label>
                    <div class="btn-group-sm">
                        <button type="button" class="${(block.wrapAlign||'left')==='left'?'active':''}" onclick="Blocks.upd(${i},'wrapAlign','left')">L</button>
                        <button type="button" class="${(block.wrapAlign||'left')==='right'?'active':''}" onclick="Blocks.upd(${i},'wrapAlign','right')">R</button>
                    </div>
                </div>
            </div>` : ''}
        </div>
        <div class="ctrl"><label>Container Background</label>
            ${this.colorRowTransparent('ttbg-'+i, block.backgroundColor||'transparent', i, 'backgroundColor')}
        </div>
        <div class="ctrl"><label>Outer Padding T/R/B/L</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${opT}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${opR}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${opB}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${opL}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlAlign(block, i)}
        ${this.ctrlVAlign(block, i)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── BUTTON CONTROLS ───────────────────────────
    ctrlButton(block, i) {
        return `
        <div class="row2">
            <div class="ctrl"><label>Button Text</label><input type="text" value="${block.text}" oninput="Blocks.upd(${i},'text',this.value)"></div>
            <div class="ctrl"><label>Link URL</label><input type="text" value="${block.link}" placeholder="https://..." oninput="Blocks.upd(${i},'link',this.value)"></div>
        </div>
        <div class="ctrl"><label>Button Color</label>
            <div class="color-row">
                <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.backgroundColor};"></div>
                    <input type="color" value="${block.backgroundColor}" oninput="Blocks.updColor(${i},'backgroundColor',this)"></div>
                <input type="text" value="${block.backgroundColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'backgroundColor',this)">
            </div>
        </div>
        <div class="ctrl"><label>Text Color</label>
            <div class="color-row">
                <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.textColor};"></div>
                    <input type="color" value="${block.textColor}" oninput="Blocks.updColor(${i},'textColor',this)"></div>
                <input type="text" value="${block.textColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'textColor',this)">
            </div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Radius</label><input type="number" value="${block.borderRadius}" min="0" max="50" oninput="Blocks.upd(${i},'borderRadius',parseInt(this.value)||0)"></div>
            <div class="ctrl"><label>Padding</label><input type="text" value="${block.padding}" oninput="Blocks.upd(${i},'padding',this.value)"></div>
        </div>
        ${this.ctrlAlign(block, i)}
        ${this.ctrlVAlign(block, i)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TABLE CONTROLS ────────────────────────────
    ctrlTable(block, i) {
        const tDir  = block.direction  || 'ltr';
        const tAln  = block.tableAlign || 'center';
        const tWrap = !!block.wrap;
        const wWid  = block.wrapWidth  || 280;
        const wAln  = block.wrapAlign  || 'left';
        const fs    = block.fontSize   || 14;
        const lh    = block.lineHeight || 1.6;
        const pt    = block.paddingTop    ?? 16;
        const pr    = block.paddingRight  ?? 16;
        const pb    = block.paddingBottom ?? 16;
        const pl    = block.paddingLeft   ?? 16;
        return `
        <div class="row3">
            <div class="ctrl"><label>Rows</label>
                <input type="number" value="${block.rows}" min="1" max="10" oninput="Blocks.updTableDim(${i},'rows',parseInt(this.value)||2)">
            </div>
            <div class="ctrl"><label>Cols</label>
                <input type="number" value="${block.cols}" min="1" max="6" oninput="Blocks.updTableDim(${i},'cols',parseInt(this.value)||2)">
            </div>
            <div class="ctrl"><label>Cell Pad</label>
                <input type="number" value="${block.cellPadding}" min="0" max="50" oninput="Blocks.upd(${i},'cellPadding',parseInt(this.value)||0)">
            </div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Border Width</label>
                <input type="number" value="${block.borderWidth}" min="0" max="5" oninput="Blocks.upd(${i},'borderWidth',parseInt(this.value)||0)">
            </div>
            <div class="ctrl"><label>Border Color</label>
                <div class="color-row">
                    <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.borderColor};"></div>
                        <input type="color" value="${block.borderColor}" oninput="Blocks.updColor(${i},'borderColor',this)"></div>
                    <input type="text" value="${block.borderColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'borderColor',this)">
                </div>
            </div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Font Size (px)</label>
                <input type="number" value="${fs}" min="10" max="30" oninput="Blocks.upd(${i},'fontSize',parseInt(this.value)||14)">
            </div>
            <div class="ctrl"><label>Line Height</label>
                <input type="number" value="${lh}" min="1" max="3" step="0.1" oninput="Blocks.upd(${i},'lineHeight',parseFloat(this.value)||1.6)">
            </div>
        </div>
        <div class="ctrl"><label>Direction</label>
            <div class="btn-group-sm">
                <button type="button" class="${tDir==='ltr'?'active':''}" onclick="Blocks.upd(${i},'direction','ltr')"><i class="fas fa-arrow-right"></i> LTR</button>
                <button type="button" class="${tDir==='rtl'?'active':''}" onclick="Blocks.upd(${i},'direction','rtl')"><i class="fas fa-arrow-left"></i> RTL</button>
            </div>
        </div>
        <div class="ctrl"><label>Table Alignment</label>
            <div class="btn-group-sm">
                <button type="button" class="${tAln==='left'?'active':''}" onclick="Blocks.upd(${i},'tableAlign','left')"><i class="fas fa-align-left"></i></button>
                <button type="button" class="${tAln==='center'?'active':''}" onclick="Blocks.upd(${i},'tableAlign','center')"><i class="fas fa-align-center"></i></button>
                <button type="button" class="${tAln==='right'?'active':''}" onclick="Blocks.upd(${i},'tableAlign','right')"><i class="fas fa-align-right"></i></button>
            </div>
        </div>
        <div class="ctrl"><label>Padding T / R / B / L</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="100" oninput="Blocks.upd(${i},'paddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="100" oninput="Blocks.upd(${i},'paddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="100" oninput="Blocks.upd(${i},'paddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="100" oninput="Blocks.upd(${i},'paddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        <div class="ctrl">
            <label>Text Wrap <span style="color:var(--text3);font-weight:400;font-size:10px;">(float table, text flows around it)</span></label>
            <div class="section-toggle-row" style="padding:0;margin-bottom:${tWrap?'8px':'0'};">
                <span style="font-size:11px;color:var(--text2);">Enable Wrap</span>
                <label class="pill-toggle"><input type="checkbox" ${tWrap?'checked':''} onchange="Blocks.upd(${i},'wrap',this.checked)"><span class="pill-slider"></span></label>
            </div>
            ${tWrap ? `<div class="row2">
                <div class="ctrl" style="margin:0;"><label>Table Width (px)</label>
                    <input type="number" value="${wWid}" min="80" max="500" oninput="Blocks.upd(${i},'wrapWidth',parseInt(this.value)||280)">
                </div>
                <div class="ctrl" style="margin:0;"><label>Float Side</label>
                    <div class="btn-group-sm">
                        <button type="button" class="${wAln==='left'?'active':''}" onclick="Blocks.upd(${i},'wrapAlign','left')">Left</button>
                        <button type="button" class="${wAln==='right'?'active':''}" onclick="Blocks.upd(${i},'wrapAlign','right')">Right</button>
                    </div>
                </div>
            </div>` : ''}
        </div>
        <button class="ctrl-btn" onclick="Blocks.editCells(${i})"><i class="fas fa-table"></i> Edit Cell Contents</button>
        ${this.ctrlLW(block.lw, `Blocks.updLW(${i}`, `tbl-${i}`)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── DIVIDER CONTROLS ──────────────────────────
    ctrlDivider(block, i) {
        return `
        <div class="row2">
            <div class="ctrl"><label>Height (px)</label><input type="number" value="${block.height}" min="1" max="20" oninput="Blocks.upd(${i},'height',parseInt(this.value)||1)"></div>
            <div class="ctrl"><label>Style</label>
                <select onchange="Blocks.upd(${i},'style',this.value)">
                    <option value="solid"  ${block.style==='solid' ?'selected':''}>Solid</option>
                    <option value="dashed" ${block.style==='dashed'?'selected':''}>Dashed</option>
                    <option value="dotted" ${block.style==='dotted'?'selected':''}>Dotted</option>
                </select>
            </div>
        </div>
        <div class="ctrl"><label>Color</label>
            <div class="color-row">
                <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.color};"></div>
                    <input type="color" value="${block.color}" oninput="Blocks.updColor(${i},'color',this)"></div>
                <input type="text" value="${block.color}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'color',this)">
            </div>
        </div>
        <div class="ctrl"><label>Width</label>
            <div class="range-wrap">
                <input type="range" min="10" max="100" step="1"
                    value="${parseInt(block.width)||100}"
                    oninput="Blocks.upd(${i},'width',this.value+'%');this.nextElementSibling.value=this.value">
                <input type="number" min="10" max="100" step="1"
                    value="${parseInt(block.width)||100}"
                    oninput="Blocks.upd(${i},'width',this.value+'%');this.previousElementSibling.value=this.value"
                    style="width:52px;"><span style="font-size:11px;color:var(--text3);">%</span>
            </div>
        </div>
        ${this.ctrlAlign(block, i)}
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── SPACER CONTROLS ───────────────────────────
    ctrlSpacer(block, i) {
        return `<div class="ctrl"><label>Height</label>
            <div class="range-wrap">
                <input type="range" value="${block.height}" min="5" max="120" oninput="Blocks.upd(${i},'height',parseInt(this.value));this.nextElementSibling.textContent=this.value+'px'">
                <span class="range-val">${block.height}px</span>
            </div></div>
        ${this.ctrlBorder(block, i)}`;
    },

    // ── TEXT + IMAGE CONTROLS ────────────────────
    ctrlTextImage(block, i) {
        const tc = block.textCol || {};
        const ic = block.imgCol  || {};
        const opT = block.outerPaddingTop    ?? 16;
        const opR = block.outerPaddingRight  ?? 16;
        const opB = block.outerPaddingBottom ?? 16;
        const opL = block.outerPaddingLeft   ?? 16;
        const locked = ic.lockRatio !== false;
        const iw = Math.max(1, ic.width  || 1);
        const ih = Math.max(1, ic.height || 1);
        const pt = tc.paddingTop    ?? 12;
        const pr = tc.paddingRight  ?? 12;
        const pb = tc.paddingBottom ?? 12;
        const pl = tc.paddingLeft   ?? 12;

        return `
        <div class="section-toggle-row" style="padding:0;margin-bottom:8px;">
            <label style="font-weight:700;font-size:12px;">Orientation</label>
            <div class="btn-group-sm">
                <button type="button" class="${(block.orientation||'horizontal')==='horizontal'?'active':''}" onclick="Blocks.updAndRerender(${i},'orientation','horizontal')"><i class="fas fa-arrows-alt-h"></i> Side</button>
                <button type="button" class="${(block.orientation||'horizontal')==='vertical'?'active':''}" onclick="Blocks.updAndRerender(${i},'orientation','vertical')"><i class="fas fa-arrows-alt-v"></i> Stack</button>
            </div>
        </div>
        <div class="section-toggle-row" style="padding:0;margin-bottom:12px;">
            <label style="font-weight:700;font-size:12px;">Swap Sides</label>
            <label class="pill-toggle">
                <input type="checkbox" ${block.swapped?'checked':''} onchange="Blocks.updAndRerender(${i},'swapped',this.checked)">
                <span class="pill-slider"></span>
            </label>
        </div>
        ${(block.orientation||'horizontal')==='horizontal' ? `
        <div class="ctrl"><label>Column Ratio</label>
            <div class="btn-group-sm">
                <button type="button" class="${(block.colRatio||'50-50')==='50-50'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','50-50')">50/50</button>
                <button type="button" class="${(block.colRatio||'50-50')==='60-40'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','60-40')">60/40</button>
                <button type="button" class="${(block.colRatio||'50-50')==='40-60'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','40-60')">40/60</button>
                <button type="button" class="${(block.colRatio||'50-50')==='70-30'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','70-30')">70/30</button>
                <button type="button" class="${(block.colRatio||'50-50')==='30-70'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','30-70')">30/70</button>
            </div>
        </div>` : ''}
        <div class="col-divider"></div>

        <!-- TEXT SECTION -->
        <div class="col-panel">
            <div class="col-panel-head"><span>📝 Text Section</span></div>
            ${this.buildRTE(tc, 40000 + i*10)}
            <div class="row2">
                <div class="ctrl"><label>Size</label><input type="number" value="${tc.size||15}" min="8" max="72" oninput="Blocks.updSec(${i},'textCol','size',parseInt(this.value)||15)"></div>
                <div class="ctrl"><label>Line Height</label><input type="number" value="${tc.lineHeight||1.65}" min="1" max="4" step="0.05" oninput="Blocks.updSec(${i},'textCol','lineHeight',parseFloat(this.value)||1.65)"></div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Align</label>
                    <select onchange="Blocks.updSec(${i},'textCol','align',this.value)">
                        <option value="left"    ${tc.align==='left'   ?'selected':''}>Left</option>
                        <option value="center"  ${tc.align==='center' ?'selected':''}>Center</option>
                        <option value="right"   ${tc.align==='right'  ?'selected':''}>Right</option>
                        <option value="justify" ${tc.align==='justify'?'selected':''}>Justify</option>
                    </select>
                </div>
                <div class="ctrl"><label>Direction</label>
                    <select onchange="Blocks.updSec(${i},'textCol','direction',this.value)">
                        <option value="ltr" ${(tc.direction||'ltr')==='ltr'?'selected':''}>LTR →</option>
                        <option value="rtl" ${(tc.direction||'ltr')==='rtl'?'selected':''}>RTL ←</option>
                    </select>
                </div>
            </div>
            <div class="ctrl"><label>Text Color</label>
                <div class="color-row">
                    <div class="color-swatch"><div class="color-swatch-preview" style="background:${tc.color||'#334155'};"></div>
                        <input type="color" value="${tc.color||'#334155'}" oninput="Blocks.updSecColor(${i},'textCol','color',this)">
                    </div>
                    <input type="text" value="${tc.color||'#334155'}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updSecHex(${i},'textCol','color',this)">
                </div>
            </div>
            <div class="ctrl"><label>Padding T/R/B/L</label>
                <div class="row4">
                    <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingTop',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingRight',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingBottom',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingLeft',parseInt(this.value)||0)"></div>
                </div>
            </div>
            ${this.ctrlLW(tc.lw, `Blocks.updLWSec(\${i},'textCol'`, `ti-tc-\${i}`)}
        </div>
        <div class="col-divider"></div>

        <!-- IMAGE SECTION -->
        <div class="col-panel">
            <div class="col-panel-head"><span>🖼️ Image Section</span></div>
            <div class="img-drop" onclick="Blocks.uploadSec(${i},'imgCol')">
                ${ic.src ? `<img src="${ic.src}" style="max-height:70px;max-width:100%;display:block;margin:0 auto;border-radius:4px;">` : '<i class="fas fa-cloud-upload-alt"></i><span>Click to upload</span>'}
            </div>
            <div class="img-action-row">
                <button type="button" class="clipboard-paste-btn" onclick="Blocks.pasteSecClipboard(${i},'imgCol')">
                    <i class="fas fa-clipboard"></i> Paste from Clipboard
                </button>
                <button type="button" class="browse-lib-btn" onclick="Blocks.browseLibSec(${i},'imgCol')">
                    <i class="fas fa-images"></i> Browse Library
                </button>
            </div>
            <div class="ctrl" style="margin-bottom:6px;"><label>Image URL</label>
                <div class="img-url-row">
                    <input type="text" id="url-ti-${i}" value="${ic.src||''}" placeholder="Or paste image URL / Ctrl+V"
                        oninput="Blocks.updSecSrcFromInput(${i},'imgCol',this.value);Blocks._toggleFetchBtn('fetch-ti-${i}',this.value)"
                        onpaste="Blocks.handleSecPaste(event,${i},'imgCol')">
                    <button type="button" id="fetch-ti-${i}" class="fetch-url-btn" ${Blocks._isValidUrl(ic.src)?'':'disabled'}
                        onclick="Blocks.fetchSecImgFromUrl(${i},'imgCol',document.getElementById('url-ti-${i}').value)"
                        title="Fetch & embed as base64"><i class="fas fa-download"></i>
                    </button>
                </div>
                ${ic.src ? `
                <button type="button" class="ctrl-btn" style="margin-top:5px;" onclick="(()=>{const t='<img src=\\'${(ic.src||'').replace(/'/g,"\\'").replace(/\\/g,'\\\\')}\\'  alt=\\'${(ic.alt||'').replace(/'/g,"\\'")}\\' width=\\'${Math.max(1,ic.width||1)}\\' height=\\'${Math.max(1,ic.height||1)}\\' border=\\'0\\'>';navigator.clipboard.writeText(t).then(()=>Utils.showToast('&lt;img&gt; tag copied','success'));})()"><i class="fas fa-code"></i> Copy &lt;img&gt; Tag</button>
                <button type="button" class="ctrl-btn ctrl-btn-danger" onclick="Blocks.clearSecImg(${i},'imgCol')"><i class="fas fa-times"></i> Remove Image</button>` : ''}
            </div>
            <div class="ctrl"><label>Alt Text</label>
                <input type="text" value="${ic.alt||''}" oninput="Blocks.updSec(${i},'imgCol','alt',this.value)">
            </div>
            <div class="ctrl"><label>Size</label>
                <div class="img-size-row">
                    <div class="img-size-field"><span class="img-size-lbl">W</span>
                        <input type="number" id="imgW-ti-${i}" value="${iw}" min="1" max="4000" oninput="Blocks.updSecWH(${i},'imgCol','w',this.value)">
                        <span class="img-size-unit">px</span></div>
                    <button type="button" class="ratio-lock-btn ${locked?'active':''}" id="lock-ti-${i}"
                        onclick="Blocks.toggleSecLock(${i},'imgCol',this)" title="${locked?'Ratio locked':'Unlocked'}">
                        <i class="fas ${locked?'fa-link':'fa-unlink'}"></i></button>
                    <div class="img-size-field"><span class="img-size-lbl">H</span>
                        <input type="number" id="imgH-ti-${i}" value="${ih}" min="1" max="4000" oninput="Blocks.updSecWH(${i},'imgCol','h',this.value)">
                        <span class="img-size-unit">px</span></div>
                </div>
            </div>
            <div class="ctrl"><label>Border Radius</label>
                <input type="number" value="${ic.borderRadius||0}" min="0" max="200" oninput="Blocks.updSec(${i},'imgCol','borderRadius',parseInt(this.value)||0)">
            </div>
            <div class="ctrl"><label>Link URL</label>
                <input type="text" value="${ic.link||''}" placeholder="https://..." oninput="Blocks.updSec(${i},'imgCol','link',this.value)">
            </div>
            ${this.ctrlLW(ic.lw, `Blocks.updLWSec(\${i},'imgCol'`, `ti-ic-\${i}`)}
        </div>
        <div class="col-divider"></div>

        <div class="ctrl"><label>Gap (px)</label>
            <input type="number" value="${block.gap||20}" min="0" max="100" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)">
        </div>
        <div class="ctrl"><label>Container Background</label>
            ${this.colorRowTransparent('tibg-'+i, block.backgroundColor||'transparent', i, 'backgroundColor')}
        </div>
        <div class="ctrl"><label>Outer Padding T/R/B/L</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${opT}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${opR}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${opB}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${opL}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TEXT + 2 IMAGES CONTROLS ─────────────────
    ctrlText2Images(block, i) {
        const tc  = block.textCol  || {};
        const im0 = block.images?.[0] || {};
        const im1 = block.images?.[1] || {};
        const opT = block.outerPaddingTop    ?? 16;
        const opR = block.outerPaddingRight  ?? 16;
        const opB = block.outerPaddingBottom ?? 16;
        const opL = block.outerPaddingLeft   ?? 16;
        const pt = tc.paddingTop    ?? 12;
        const pr = tc.paddingRight  ?? 12;
        const pb = tc.paddingBottom ?? 12;
        const pl = tc.paddingLeft   ?? 12;

        const imgMini = (img, ii) => {
            const lk = img.lockRatio !== false;
            const iw = Math.max(1, img.width  || 1);
            const ih = Math.max(1, img.height || 1);
            return `
            <div class="col-panel" style="margin-bottom:8px;">
                <div class="col-panel-head"><span>Image ${ii+1}</span></div>
                <div class="img-drop img2-drop" onclick="Blocks.uploadSecImg(${i},${ii})">
                    ${img.src ? `<img src="${img.src}" style="max-height:60px;max-width:100%;display:block;margin:0 auto;border-radius:3px;">` : '<i class="fas fa-cloud-upload-alt"></i><span>Upload</span>'}
                </div>
                <div class="img-action-row img-action-row--narrow">
                    <button type="button" class="clipboard-paste-btn" onclick="Blocks.pasteSecImgClipboard(${i},${ii})">
                        <i class="fas fa-clipboard"></i> Paste from clipboard
                    </button>
                    <button type="button" class="browse-lib-btn" onclick="Blocks.browseLibSecImg(${i},${ii})">
                        <i class="fas fa-images"></i> Browse Library
                    </button>
                </div>
                <div class="ctrl" style="margin-bottom:4px;"><label style="font-size:10px;">Image URL</label>
                    <div class="img-url-row">
                        <input type="text" id="url-t2i-${i}-${ii}" value="${img.src||''}" placeholder="Or paste URL / Ctrl+V" style="font-size:11px;"
                            oninput="Blocks.updSecImgSrcFromInput(${i},${ii},this.value);Blocks._toggleFetchBtn('fetch-t2i-${i}-${ii}',this.value)"
                            onpaste="Blocks.handleSecImgPaste(event,${i},${ii})">
                        <button type="button" id="fetch-t2i-${i}-${ii}" class="fetch-url-btn" ${Blocks._isValidUrl(img.src)?'':'disabled'}
                            onclick="Blocks.fetchSecImg2FromUrl(${i},${ii},document.getElementById('url-t2i-${i}-${ii}').value)"
                            title="Fetch & embed as base64"><i class="fas fa-download"></i>
                        </button>
                    </div>
                    ${img.src ? `
                    <button type="button" class="ctrl-btn" style="margin-top:4px;font-size:10px;" onclick="(()=>{const t='<img src=\\'${(img.src||'').replace(/'/g,"\\'").replace(/\\/g,'\\\\')}\\'  alt=\\'${(img.alt||'').replace(/'/g,"\\'")}\\' width=\\'${Math.max(1,img.width||1)}\\' height=\\'${Math.max(1,img.height||1)}\\' border=\\'0\\'>';navigator.clipboard.writeText(t).then(()=>Utils.showToast('&lt;img&gt; tag copied','success'));})()"><i class="fas fa-code"></i> Copy &lt;img&gt; Tag</button>
                    <button type="button" class="ctrl-btn ctrl-btn-danger" style="font-size:10px;" onclick="Blocks.clearSecImg2(${i},${ii})"><i class="fas fa-times"></i> Remove</button>` : ''}
                </div>
                <div class="ctrl" style="margin-bottom:4px;"><label>Alt</label>
                    <input type="text" value="${img.alt||''}" style="font-size:11px;" oninput="Blocks.updSecImg(${i},${ii},'alt',this.value)">
                </div>
                <div class="ctrl" style="margin-bottom:4px;"><label>Link</label>
                    <input type="text" value="${img.link||''}" placeholder="https://..." style="font-size:11px;" oninput="Blocks.updSecImg(${i},${ii},'link',this.value)">
                </div>
                <div class="img-size-row" style="margin-bottom:5px;">
                    <div class="img-size-field"><span class="img-size-lbl">W</span>
                        <input type="number" id="imgW-t2-${i}-${ii}" value="${iw}" min="1" max="4000" oninput="Blocks.updSecImgWH(${i},${ii},'w',this.value)">
                        <span class="img-size-unit">px</span></div>
                    <button type="button" class="ratio-lock-btn ${lk?'active':''}" id="lock-t2-${i}-${ii}"
                        onclick="Blocks.toggleSecImgLock(${i},${ii},this)" title="${lk?'Locked':'Unlocked'}">
                        <i class="fas ${lk?'fa-link':'fa-unlink'}"></i></button>
                    <div class="img-size-field"><span class="img-size-lbl">H</span>
                        <input type="number" id="imgH-t2-${i}-${ii}" value="${ih}" min="1" max="4000" oninput="Blocks.updSecImgWH(${i},${ii},'h',this.value)">
                        <span class="img-size-unit">px</span></div>
                </div>
                <div class="ctrl" style="margin:0;"><label>Radius</label>
                    <input type="number" value="${img.borderRadius||0}" min="0" max="200" oninput="Blocks.updSecImg(${i},${ii},'borderRadius',parseInt(this.value)||0)">
                </div>
                ${this.ctrlLW(img.lw, `Blocks.updLWSecImg(\${i},\${ii}`, `t2i-${i}-${ii}`)}
            </div>`;
        };

        return `
        <div class="section-toggle-row" style="padding:0;margin-bottom:8px;">
            <label style="font-weight:700;font-size:12px;">Orientation</label>
            <div class="btn-group-sm">
                <button type="button" class="${(block.orientation||'horizontal')==='horizontal'?'active':''}" onclick="Blocks.updAndRerender(${i},'orientation','horizontal')"><i class="fas fa-arrows-alt-h"></i> Side</button>
                <button type="button" class="${(block.orientation||'horizontal')==='vertical'?'active':''}" onclick="Blocks.updAndRerender(${i},'orientation','vertical')"><i class="fas fa-arrows-alt-v"></i> Stack</button>
            </div>
        </div>
        <div class="section-toggle-row" style="padding:0;margin-bottom:12px;">
            <label style="font-weight:700;font-size:12px;">Swap Sides</label>
            <label class="pill-toggle">
                <input type="checkbox" ${block.swapped?'checked':''} onchange="Blocks.updAndRerender(${i},'swapped',this.checked)">
                <span class="pill-slider"></span>
            </label>
        </div>
        ${(block.orientation||'horizontal')==='horizontal' ? `
        <div class="ctrl"><label>Column Ratio</label>
            <div class="btn-group-sm">
                <button type="button" class="${(block.colRatio||'50-50')==='50-50'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','50-50')">50/50</button>
                <button type="button" class="${(block.colRatio||'50-50')==='60-40'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','60-40')">60/40</button>
                <button type="button" class="${(block.colRatio||'50-50')==='40-60'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','40-60')">40/60</button>
                <button type="button" class="${(block.colRatio||'50-50')==='70-30'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','70-30')">70/30</button>
                <button type="button" class="${(block.colRatio||'50-50')==='30-70'?'active':''}" onclick="Blocks.updAndRerender(${i},'colRatio','30-70')">30/70</button>
            </div>
        </div>
        <div class="ctrl"><label>Gap between text and images column (px)</label>
            <input type="number" value="${block.gap||20}" min="0" max="100" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)">
        </div>` : `
        <div class="ctrl"><label>Gap between sections (px)</label>
            <input type="number" value="${block.gap||20}" min="0" max="100" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)">
        </div>`}
        <div class="ctrl"><label>Gap between images (px)</label>
            <input type="number" value="${block.imgGap||12}" min="0" max="100" oninput="Blocks.upd(${i},'imgGap',parseInt(this.value)||0)">
        </div>
        <div class="col-divider"></div>

        <!-- TEXT SECTION -->
        <div class="col-panel">
            <div class="col-panel-head"><span>📝 Text Section</span></div>
            ${this.buildRTE(tc, 40000 + i*10)}
            <div class="row2">
                <div class="ctrl"><label>Size</label><input type="number" value="${tc.size||15}" min="8" max="72" oninput="Blocks.updSec(${i},'textCol','size',parseInt(this.value)||15)"></div>
                <div class="ctrl"><label>Line Height</label><input type="number" value="${tc.lineHeight||1.65}" min="1" max="4" step="0.05" oninput="Blocks.updSec(${i},'textCol','lineHeight',parseFloat(this.value)||1.65)"></div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Align</label>
                    <select onchange="Blocks.updSec(${i},'textCol','align',this.value)">
                        <option value="left"    ${tc.align==='left'   ?'selected':''}>Left</option>
                        <option value="center"  ${tc.align==='center' ?'selected':''}>Center</option>
                        <option value="right"   ${tc.align==='right'  ?'selected':''}>Right</option>
                        <option value="justify" ${tc.align==='justify'?'selected':''}>Justify</option>
                    </select>
                </div>
                <div class="ctrl"><label>Direction</label>
                    <select onchange="Blocks.updSec(${i},'textCol','direction',this.value)">
                        <option value="ltr" ${(tc.direction||'ltr')==='ltr'?'selected':''}>LTR →</option>
                        <option value="rtl" ${(tc.direction||'ltr')==='rtl'?'selected':''}>RTL ←</option>
                    </select>
                </div>
            </div>
            <div class="ctrl"><label>Text Color</label>
                <div class="color-row">
                    <div class="color-swatch"><div class="color-swatch-preview" style="background:${tc.color||'#334155'};"></div>
                        <input type="color" value="${tc.color||'#334155'}" oninput="Blocks.updSecColor(${i},'textCol','color',this)">
                    </div>
                    <input type="text" value="${tc.color||'#334155'}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updSecHex(${i},'textCol','color',this)">
                </div>
            </div>
            <div class="ctrl"><label>Padding T/R/B/L</label>
                <div class="row4">
                    <div><label class="sub-label">T</label><input type="number" value="${pt}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingTop',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">R</label><input type="number" value="${pr}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingRight',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">B</label><input type="number" value="${pb}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingBottom',parseInt(this.value)||0)"></div>
                    <div><label class="sub-label">L</label><input type="number" value="${pl}" min="0" max="100" oninput="Blocks.updSec(${i},'textCol','paddingLeft',parseInt(this.value)||0)"></div>
                </div>
            </div>
            ${this.ctrlLW(tc.lw, `Blocks.updLWSec(\${i},'textCol'`, `t2-tc-\${i}`)}
        </div>
        <div class="col-divider"></div>

        <!-- IMAGES SECTION -->
        <div class="col-panel">
            <div class="col-panel-head"><span>🖼️ Images Section</span></div>
            ${imgMini(im0, 0)}
            ${imgMini(im1, 1)}
        </div>
        <div class="col-divider"></div>

        <div class="ctrl"><label>Container Background</label>
            ${this.colorRowTransparent('t2bg-'+i, block.backgroundColor||'transparent', i, 'backgroundColor')}
        </div>
        <div class="ctrl"><label>Outer Padding T/R/B/L</label>
            <div class="row4">
                <div><label class="sub-label">T</label><input type="number" value="${opT}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingTop',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">R</label><input type="number" value="${opR}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingRight',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">B</label><input type="number" value="${opB}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingBottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">L</label><input type="number" value="${opL}" min="0" max="100" oninput="Blocks.upd(${i},'outerPaddingLeft',parseInt(this.value)||0)"></div>
            </div>
        </div>
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── LAYOUT WRAP CTRL ─────────────────────────
    // updCmd: prefix string e.g. "Blocks.updLW(0" — helper appends ,'prop',val)
    ctrlLW(lw, updCmd, uid) {
        const en  = lw?.enabled  || false;
        const ha  = lw?.hAlign   || 'center';
        const va  = lw?.vAlign   || 'middle';
        const dr  = lw?.dir      || 'ltr';
        return `
        <div class="ctrl lw-ctrl" style="border:1px solid var(--border2);border-radius:var(--radius);padding:8px 10px;margin-top:6px;background:var(--bg2);">
            <div class="section-toggle-row" style="padding:0;margin-bottom:${en?'10px':'0'};">
                <label style="font-size:12px;font-weight:700;color:var(--accent);">Layout Wrap
                    <span style="font-size:10px;font-weight:400;color:var(--text3);display:block;margin-top:1px;">Nowrap container — aligns content inside</span>
                </label>
                <label class="pill-toggle">
                    <input type="checkbox" id="lw-en-${uid}" ${en?'checked':''} onchange="${updCmd},'enabled',this.checked)">
                    <span class="pill-slider"></span>
                </label>
            </div>
            ${en ? `
            <div class="row3" style="gap:6px;margin-top:6px;">
                <div class="ctrl" style="margin:0;">
                    <label style="font-size:10px;">H-Align</label>
                    <div class="btn-group-sm" style="margin-top:3px;">
                        <button type="button" title="Left"   class="${ha==='left'  ?'active':''}" onmousedown="event.preventDefault();${updCmd},'hAlign','left')"  ><i class="fas fa-align-left"   style="font-size:9px;"></i></button>
                        <button type="button" title="Center" class="${ha==='center'?'active':''}" onmousedown="event.preventDefault();${updCmd},'hAlign','center')"><i class="fas fa-align-center" style="font-size:9px;"></i></button>
                        <button type="button" title="Right"  class="${ha==='right' ?'active':''}" onmousedown="event.preventDefault();${updCmd},'hAlign','right')" ><i class="fas fa-align-right"  style="font-size:9px;"></i></button>
                    </div>
                </div>
                <div class="ctrl" style="margin:0;">
                    <label style="font-size:10px;">V-Align</label>
                    <div class="btn-group-sm" style="margin-top:3px;">
                        <button type="button" title="Top"    class="${va==='top'   ?'active':''}" onmousedown="event.preventDefault();${updCmd},'vAlign','top')"   ><i class="fas fa-arrow-up"   style="font-size:9px;"></i></button>
                        <button type="button" title="Middle" class="${va==='middle'?'active':''}" onmousedown="event.preventDefault();${updCmd},'vAlign','middle')"><i class="fas fa-minus"      style="font-size:9px;"></i></button>
                        <button type="button" title="Bottom" class="${va==='bottom'?'active':''}" onmousedown="event.preventDefault();${updCmd},'vAlign','bottom')"><i class="fas fa-arrow-down" style="font-size:9px;"></i></button>
                    </div>
                </div>
                <div class="ctrl" style="margin:0;">
                    <label style="font-size:10px;">Direction</label>
                    <div class="btn-group-sm" style="margin-top:3px;">
                        <button type="button" title="LTR"  class="${dr==='ltr' ?'active':''}" onmousedown="event.preventDefault();${updCmd},'dir','ltr')" >LTR</button>
                        <button type="button" title="RTL"  class="${dr==='rtl' ?'active':''}" onmousedown="event.preventDefault();${updCmd},'dir','rtl')" >RTL</button>
                        <button type="button" title="Auto" class="${dr==='auto'?'active':''}" onmousedown="event.preventDefault();${updCmd},'dir','auto')">Auto</button>
                    </div>
                </div>
            </div>` : ''}
        </div>`;
    },

    // ── BORDER CTRL (per-side) ────────────────────
    ctrlBorder(block, i) {
        const bdr   = block.border || DEFAULT_BORDER;
        const top   = bdr.top    ?? 0, right  = bdr.right  ?? 0;
        const bot   = bdr.bottom ?? 0, left   = bdr.left   ?? 0;
        const color = bdr.color  || '#e5e7eb';
        const style = bdr.style  || 'solid';
        return `
        <div class="ctrl border-ctrl">
            <label>Block Border</label>
            <div class="row4" style="margin-bottom:6px;">
                <div><label class="sub-label">Top</label><input type="number" value="${top}"   min="0" max="20" oninput="Blocks.updBorder(${i},'top',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">Right</label><input type="number" value="${right}" min="0" max="20" oninput="Blocks.updBorder(${i},'right',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">Bottom</label><input type="number" value="${bot}"   min="0" max="20" oninput="Blocks.updBorder(${i},'bottom',parseInt(this.value)||0)"></div>
                <div><label class="sub-label">Left</label><input type="number" value="${left}"  min="0" max="20" oninput="Blocks.updBorder(${i},'left',parseInt(this.value)||0)"></div>
            </div>
            <div class="row2">
                <div class="ctrl" style="margin:0;"><label>Style</label>
                    <select onchange="Blocks.updBorder(${i},'style',this.value)">
                        <option value="solid"  ${style==='solid' ?'selected':''}>Solid</option>
                        <option value="dashed" ${style==='dashed'?'selected':''}>Dashed</option>
                        <option value="dotted" ${style==='dotted'?'selected':''}>Dotted</option>
                        <option value="double" ${style==='double'?'selected':''}>Double</option>
                    </select>
                </div>
                <div class="ctrl" style="margin:0;"><label>Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${color};"></div>
                            <input type="color" value="${color}" oninput="Blocks.updBorderColor(${i},this)"></div>
                        <input type="text" value="${color}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updBorderColorHex(${i},this)">
                    </div>
                </div>
            </div>
            <div style="display:flex;gap:5px;margin-top:7px;">
                <button class="mini-btn" onclick="Blocks.setBorderAll(${i},1)">All 1px</button>
                <button class="mini-btn" onclick="Blocks.setBorderAll(${i},2)">All 2px</button>
                <button class="mini-btn" onclick="Blocks.setBorderAll(${i},0)">None</button>
            </div>
        </div>`;
    },

    // ── VISIBILITY CTRL ───────────────────────────
    ctrlVisibility(block, i) {
        return `<div class="ctrl" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);">
            <label>Client Visibility</label>
            <select onchange="Blocks.upd(${i},'hideInMso',this.value==='true'?true:(this.value==='false'?false:this.value))">
                <option value="false"        ${!block.hideInMso?'selected':''}>Show in All Clients</option>
                <option value="true"         ${block.hideInMso===true?'selected':''}>Hide in Outlook (MSO)</option>
                <option value="mobile-only"  ${block.hideInMso==='mobile-only'?'selected':''}>Mobile Only</option>
                <option value="desktop-only" ${block.hideInMso==='desktop-only'?'selected':''}>Desktop Only</option>
            </select></div>`;
    },

    // ── ALIGNMENT CTRL (shared by all blocks) ────
    ctrlAlign(block, i, showJustify = false) {
        const h = block.align || 'center';
        const justifyBtn = showJustify ? `<button type="button" title="Justify" class="${h==='justify'?'active':''}" onclick="Blocks.updAlign(${i},'align','justify','halign-grp-${i}',this)"><i class="fas fa-align-justify"></i></button>` : '';
        return `
        <div class="ctrl" style="margin-top:4px;">
            <label>Alignment</label>
            <div class="btn-group-sm" id="halign-grp-${i}" style="margin-top:4px;">
                <button type="button" title="Left"    class="${h==='left'   ?'active':''}" onclick="Blocks.updAlign(${i},'align','left','halign-grp-${i}',this)"><i class="fas fa-align-left"></i></button>
                <button type="button" title="Center"  class="${h==='center' ?'active':''}" onclick="Blocks.updAlign(${i},'align','center','halign-grp-${i}',this)"><i class="fas fa-align-center"></i></button>
                <button type="button" title="Right"   class="${h==='right'  ?'active':''}" onclick="Blocks.updAlign(${i},'align','right','halign-grp-${i}',this)"><i class="fas fa-align-right"></i></button>
                ${justifyBtn}
            </div>
        </div>`;
    },

    ctrlVAlign(block, i) {
        const v = block.verticalAlign || 'top';
        return `
        <div class="ctrl" style="margin-top:4px;">
            <label>Vertical Align</label>
            <div class="btn-group-sm" id="valign-grp-${i}" style="margin-top:4px;">
                <button type="button" title="Top"    class="${v==='top'   ?'active':''}" onclick="Blocks.updAlign(${i},'verticalAlign','top','valign-grp-${i}',this)"><i class="fas fa-arrow-up"></i></button>
                <button type="button" title="Middle" class="${v==='middle'?'active':''}" onclick="Blocks.updAlign(${i},'verticalAlign','middle','valign-grp-${i}',this)"><i class="fas fa-minus"></i></button>
                <button type="button" title="Bottom" class="${v==='bottom'?'active':''}" onclick="Blocks.updAlign(${i},'verticalAlign','bottom','valign-grp-${i}',this)"><i class="fas fa-arrow-down"></i></button>
            </div>
        </div>`;
    },

    // ── TRANSPARENT COLOR ROW ─────────────────────
    colorRowTransparent(id, currentVal, blockIndex, prop) {
        const isTrans  = (!currentVal || currentVal === 'transparent');
        const colorVal = isTrans ? '#ffffff' : currentVal;
        return `<div class="transparent-row">
            <label class="toggle-transparent">
                <input type="checkbox" ${isTrans?'checked':''} onchange="Blocks.toggleTrans(${blockIndex},'${prop}',this.checked,'${id}')">
                <span>Transparent</span>
            </label>
        </div>
        <div class="color-row" id="crw-${id}" style="${isTrans?'opacity:0.35;pointer-events:none;':''}">
            <div class="color-swatch"><div class="color-swatch-preview" style="background:${colorVal};"></div>
                <input type="color" id="${id}" value="${colorVal}"
                    oninput="Blocks.updColor(${blockIndex},'${prop}',this);document.getElementById('${id}-hex').value=this.value">
            </div>
            <input type="text" id="${id}-hex" value="${colorVal}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${blockIndex},'${prop}',this)">
        </div>`;
    },

    colorRowTransparentCol(bi, ci, prop, currentVal) {
        const id = `colbg-${bi}-${ci}`;
        const isTrans  = (!currentVal || currentVal === 'transparent');
        const colorVal = isTrans ? '#ffffff' : currentVal;
        return `<div class="transparent-row">
            <label class="toggle-transparent">
                <input type="checkbox" ${isTrans?'checked':''} onchange="Blocks.toggleTransCol(${bi},${ci},'${prop}',this.checked,'${id}')">
                <span>Transparent</span>
            </label>
        </div>
        <div class="color-row" id="crw-${id}" style="${isTrans?'opacity:0.35;pointer-events:none;':''}">
            <div class="color-swatch"><div class="color-swatch-preview" style="background:${colorVal};"></div>
                <input type="color" id="${id}" value="${colorVal}" oninput="Blocks.updColColor(${bi},${ci},'${prop}',this)">
            </div>
            <input type="text" id="${id}-hex" value="${colorVal}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updColHex(${bi},${ci},'${prop}',this)">
        </div>`;
    },

    toggleTrans(bi, prop, isTrans, id) {
        const val = isTrans ? 'transparent' : (document.getElementById(id)?.value || '#ffffff');
        this.upd(bi, prop, val);
        const w = document.getElementById('crw-'+id);
        if (w) { w.style.opacity = isTrans?'0.35':'1'; w.style.pointerEvents = isTrans?'none':''; }
    },

    toggleTransCol(bi, ci, prop, isTrans, id) {
        const val = isTrans ? 'transparent' : (document.getElementById(id)?.value || '#ffffff');
        this.updCol(bi, ci, prop, val);
        const w = document.getElementById('crw-'+id);
        if (w) { w.style.opacity = isTrans?'0.35':'1'; w.style.pointerEvents = isTrans?'none':''; }
    },

    // ── DATE PICKER ───────────────────────────────
    showDatePicker(bi, blockType, ci) {
        const now = new Date();
        const fmts = [
            { l: 'March 6, 2026',               v: now.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) },
            { l: '06 March 2026',               v: now.toLocaleDateString('en-GB',{year:'numeric',month:'long',day:'numeric'}) },
            { l: '2026-03-06 (ISO)',             v: now.toISOString().slice(0,10) },
            { l: 'MM/DD/YYYY',                  v: now.toLocaleDateString('en-US') },
            { l: 'DD/MM/YYYY',                  v: now.toLocaleDateString('en-GB') },
            { l: 'Friday, March 6, 2026',       v: now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) },
            { l: 'March 2026',                  v: now.toLocaleDateString('en-US',{year:'numeric',month:'long'}) },
            { l: '٦ مارس ٢٠٢٦ (Arabic)',        v: now.toLocaleDateString('ar-SA',{year:'numeric',month:'long',day:'numeric',calendar:'gregory'}) },
            { l: 'الجمعة ٦ مارس (Arabic Full)', v: now.toLocaleDateString('ar-SA',{weekday:'long',year:'numeric',month:'long',day:'numeric',calendar:'gregory'}) },
            { l: 'Hijri (Islamic Arabic)',      v: (()=>{ try{ return now.toLocaleDateString('ar-SA-u-ca-islamic',{year:'numeric',month:'long',day:'numeric'}); }catch(e){ return now.toLocaleDateString('ar',{year:'numeric',month:'long',day:'numeric'}); }})() },
            { l: 'Hijri (Latin script)',        v: (()=>{ try{ return now.toLocaleDateString('en-SA-u-ca-islamic',{year:'numeric',month:'long',day:'numeric'}); }catch(e){ return ''; }})() },
        ].filter(f=>f.v);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `<div class="modal" style="max-width:400px;">
            <div class="modal-header">
                <h3><i class="fas fa-calendar-alt"></i> Insert Date</h3>
                <button class="modal-close" id="dp-close">✕</button>
            </div>
            <div class="modal-body" style="padding:14px;">
                <div class="ctrl"><label>Format</label>
                    <select id="dp-sel" style="width:100%;padding:8px;background:var(--bg);border:1px solid var(--border2);border-radius:var(--radius);color:var(--text);font-size:12px;">
                        ${fmts.map((f,idx)=>`<option value="${idx}">${f.l}</option>`).join('')}
                    </select>
                </div>
                <div class="ctrl"><label>Preview</label>
                    <div id="dp-preview" style="padding:10px;background:var(--bg2);border-radius:var(--radius);font-size:14px;color:var(--text2);border:1px solid var(--border);direction:auto;">${fmts[0].v}</div>
                </div>
                <div class="ctrl"><label>Custom (overrides selection)</label>
                    <input type="text" id="dp-custom" placeholder="Type your own date text...">
                </div>
                <div style="display:flex;gap:8px;margin-top:4px;">
                    <button class="ctrl-btn" id="dp-insert" style="flex:1;"><i class="fas fa-check"></i> Insert</button>
                    <button class="ctrl-btn" id="dp-cancel" style="flex:1;background:var(--bg3);">Cancel</button>
                </div>
            </div>
        </div>`;

        // Attach events AFTER modal is in the DOM — no inline onclick with JSON
        const selEl     = modal.querySelector('#dp-sel');
        const previewEl = modal.querySelector('#dp-preview');
        const customEl  = modal.querySelector('#dp-custom');
        const insertBtn = modal.querySelector('#dp-insert');
        const cancelBtn = modal.querySelector('#dp-cancel');
        const closeBtn  = modal.querySelector('#dp-close');

        selEl.addEventListener('change', function() {
            previewEl.textContent = fmts[parseInt(this.value)].v;
        });

        insertBtn.addEventListener('click', () => {
            const val = customEl.value.trim() || fmts[parseInt(selEl.value)].v;
            Blocks.insertDate(bi, blockType, ci !== undefined ? ci : null, val);
            modal.remove();
        });

        cancelBtn.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('click',  () => modal.remove());
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });

        document.body.appendChild(modal);
    },

    insertDate(bi, blockType, ci, dateStr) {
        const blocks = State.get().blocks;
        const block  = blocks[bi];
        if (!block || !dateStr) return;
        const span = `<span style="display:inline;">${dateStr}</span>`;
        if (blockType === 'text') {
            block.content = (block.content||'') + span;
        } else if (blockType === 'two-texts' && ci !== null && block.columns?.[ci]) {
            block.columns[ci].content = (block.columns[ci].content||'') + span;
        }
        State.updateBlocks(blocks);
        this.render();
        Preview.render();
        Utils.showToast('Date inserted: ' + dateStr, 'success');
    },

    // ── UPDATE HELPERS ────────────────────────────
    upd(i, prop, val) {
        const blocks = State.get().blocks;
        if (i < 0 || i >= blocks.length) return;
        blocks[i][prop] = val;
        State.updateBlocks(blocks);
        Preview.render();
    },

    // Update alignment — groupId is the id of the btn-group-sm container
    updAlign(i, prop, val, groupId, btn) {
        const blocks = State.get().blocks;
        if (i < 0 || i >= blocks.length) return;
        blocks[i][prop] = val;
        State.updateBlocks(blocks);
        Preview.render();
        // Update active highlights using stable group ID
        const group = document.getElementById(groupId);
        if (group) {
            group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        }
    },

    // ── Section update helpers (text-image / text-2images) ──
    updSec(bi, sec, prop, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.[sec]) return;
        blocks[bi][sec][prop] = val;
        State.updateBlocks(blocks);
        Preview.render();
    },
    updSecColor(bi, sec, prop, colorInput) {
        const val = colorInput.value;
        const sw = colorInput.closest('.color-swatch');
        if (sw) sw.querySelector('.color-swatch-preview').style.background = val;
        const row = colorInput.closest('.color-row');
        if (row) { const t = row.querySelector('input[type="text"]'); if(t) t.value = val; }
        this.updSec(bi, sec, prop, val);
    },
    updSecHex(bi, sec, prop, textInput) {
        let v = textInput.value.trim();
        if (!v.startsWith('#')) v = '#'+v;
        if (!Utils.isValidHex(v)) return;
        const row = textInput.closest('.color-row');
        if (row) { const ci = row.querySelector('input[type="color"]'); if(ci){ ci.value=v; const sw=ci.closest('.color-swatch'); if(sw) sw.querySelector('.color-swatch-preview').style.background=v; }}
        this.updSec(bi, sec, prop, v);
    },
    updSecWH(bi, sec, dim, rawVal) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.[sec]) return;
        const obj = blocks[bi][sec];
        const v = parseInt(rawVal) || 1;
        if (dim === 'w') {
            const locked = obj.lockRatio !== false;
            if (locked && obj._nw && obj._nh) {
                obj.height = Math.round(v * obj._nh / obj._nw);
                const hEl = document.getElementById('imgH-ti-' + bi);
                if (hEl) hEl.value = obj.height;
            }
            obj.width = v;
        } else {
            const locked = obj.lockRatio !== false;
            if (locked && obj._nw && obj._nh) {
                obj.width = Math.round(v * obj._nw / obj._nh);
                const wEl = document.getElementById('imgW-ti-' + bi);
                if (wEl) wEl.value = obj.width;
            }
            obj.height = v;
        }
        State.updateBlocks(blocks);
        Preview.render();
    },
    toggleSecLock(bi, sec, btn) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.[sec]) return;
        const obj = blocks[bi][sec];
        obj.lockRatio = !obj.lockRatio;
        if (obj.lockRatio) { obj._nw = obj.width; obj._nh = obj.height; }
        btn.classList.toggle('active', !!obj.lockRatio);
        btn.title = obj.lockRatio ? 'Ratio locked' : 'Ratio unlocked';
        btn.querySelector('i').className = 'fas ' + (obj.lockRatio ? 'fa-link' : 'fa-unlink');
        State.updateBlocks(blocks);
    },
    uploadSec(bi, sec) {
        Utils.handleImageUpload(data => {
            const img = new Image();
            img.onload = () => {
                const blocks = State.get().blocks;
                if (!blocks[bi]?.[sec]) return;
                const obj = blocks[bi][sec];
                obj.src = data; obj._nw = img.naturalWidth; obj._nh = img.naturalHeight;
                if (!obj.width) obj.width = img.naturalWidth;
                if (!obj.height) obj.height = img.naturalHeight;
                State.updateBlocks(blocks);
                this.render(); Preview.render();
            };
            img.src = data;
        });
    },
    pasteSecClipboard(bi, sec) {
        if (!navigator.clipboard?.read) { Utils.showToast('Clipboard API unavailable','warning'); return; }
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                const t = item.types.find(x => x.startsWith('image/'));
                if (t) { item.getType(t).then(blob => { const r=new FileReader(); r.onload=ev=>{ this.updSec(bi,sec,'src',ev.target.result); this.render(); }; r.readAsDataURL(blob); }); return; }
            }
            Utils.showToast('No image in clipboard','warning');
        }).catch(()=>Utils.showToast('Clipboard access denied','warning'));
    },
    updSecImg(bi, ii, prop, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        blocks[bi].images[ii][prop] = val;
        State.updateBlocks(blocks);
        Preview.render();
    },
    updSecImgWH(bi, ii, dim, rawVal) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        const img = blocks[bi].images[ii];
        const v = parseInt(rawVal) || 1;
        if (dim === 'w') {
            if (img.lockRatio !== false && img._nw && img._nh) {
                img.height = Math.round(v * img._nh / img._nw);
                const hEl = document.getElementById('imgH-t2-'+bi+'-'+ii);
                if (hEl) hEl.value = img.height;
            }
            img.width = v;
        } else {
            if (img.lockRatio !== false && img._nw && img._nh) {
                img.width = Math.round(v * img._nw / img._nh);
                const wEl = document.getElementById('imgW-t2-'+bi+'-'+ii);
                if (wEl) wEl.value = img.width;
            }
            img.height = v;
        }
        State.updateBlocks(blocks);
        Preview.render();
    },
    toggleSecImgLock(bi, ii, btn) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        const img = blocks[bi].images[ii];
        img.lockRatio = !img.lockRatio;
        if (img.lockRatio) { img._nw = img.width; img._nh = img.height; }
        btn.classList.toggle('active', !!img.lockRatio);
        btn.title = img.lockRatio ? 'Ratio locked' : 'Ratio unlocked';
        btn.querySelector('i').className = 'fas ' + (img.lockRatio ? 'fa-link' : 'fa-unlink');
        State.updateBlocks(blocks);
    },
    uploadSecImg(bi, ii) {
        Utils.handleImageUpload(data => {
            const img2 = new Image();
            img2.onload = () => {
                const blocks = State.get().blocks;
                if (!blocks[bi]?.images?.[ii]) return;
                const obj = blocks[bi].images[ii];
                obj.src = data; obj._nw = img2.naturalWidth; obj._nh = img2.naturalHeight;
                if (!obj.width) obj.width = img2.naturalWidth;
                if (!obj.height) obj.height = img2.naturalHeight;
                State.updateBlocks(blocks);
                this.render(); Preview.render();
            };
            img2.src = data;
        });
    },
    pasteSecImgClipboard(bi, ii) {
        if (!navigator.clipboard?.read) { Utils.showToast('Clipboard API unavailable','warning'); return; }
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                const t = item.types.find(x => x.startsWith('image/'));
                if (t) { item.getType(t).then(blob => { const r=new FileReader(); r.onload=ev=>{ this.updSecImg(bi,ii,'src',ev.target.result); this.render(); }; r.readAsDataURL(blob); }); return; }
            }
            Utils.showToast('No image in clipboard','warning');
        }).catch(()=>Utils.showToast('Clipboard access denied','warning'));
    },
    updLWSecImg(bi, ii, field, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        if (!blocks[bi].images[ii].lw) blocks[bi].images[ii].lw = {};
        blocks[bi].images[ii].lw[field] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },

    // ── LW update helpers ────────────────────────
    updLW(bi, field, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]) return;
        if (!blocks[bi].lw) blocks[bi].lw = {};
        blocks[bi].lw[field] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },
    updLWCol(bi, ci, field, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.columns?.[ci]) return;
        if (!blocks[bi].columns[ci].lw) blocks[bi].columns[ci].lw = {};
        blocks[bi].columns[ci].lw[field] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },
    updLWImg(bi, ii, field, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.images?.[ii]) return;
        if (!blocks[bi].images[ii].lw) blocks[bi].images[ii].lw = {};
        blocks[bi].images[ii].lw[field] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },
    updLWSec(bi, sec, field, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]?.[sec]) return;
        if (!blocks[bi][sec].lw) blocks[bi][sec].lw = {};
        blocks[bi][sec].lw[field] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },

    // updAndRerender — like upd() but also re-renders sidebar (for panel-state changes)
    updAndRerender(i, prop, val) {
        const blocks = State.get().blocks;
        if (i < 0 || i >= blocks.length) return;
        blocks[i][prop] = val;
        State.updateBlocks(blocks);
        Preview.render();
        this.render();
    },

    updColor(i, prop, colorInput) {
        const val = colorInput.value;
        const sw = colorInput.closest('.color-swatch');
        if (sw) sw.querySelector('.color-swatch-preview').style.background = val;
        const row = colorInput.closest('.color-row');
        if (row) { const t = row.querySelector('input[type="text"]'); if(t) t.value = val; }
        this.upd(i, prop, val);
    },

    updHex(i, prop, textInput) {
        let v = textInput.value.trim();
        if (!v.startsWith('#')) v = '#'+v;
        if (!Utils.isValidHex(v)) return;
        const row = textInput.closest('.color-row');
        if (row) { const ci = row.querySelector('input[type="color"]'); if(ci){ ci.value=v; const sw=ci.closest('.color-swatch'); if(sw) sw.querySelector('.color-swatch-preview').style.background=v; }}
        this.upd(i, prop, v);
    },

    updImg(bi, ii, prop, val) {
        const blocks = State.get().blocks;
        if (blocks[bi]?.images?.[ii]) {
            blocks[bi].images[ii][prop] = val;
            State.updateBlocks(blocks);
            Preview.render();
            // Re-render sidebar only for non-text props (avoids cursor-jump in inputs)
            if (prop === 'align') this.render();
        }
    },

    updImg2BR(bi, val) {
        const blocks = State.get().blocks;
        if (blocks[bi]?.images) { blocks[bi].images[0].borderRadius=val; blocks[bi].images[1].borderRadius=val; State.updateBlocks(blocks); Preview.render(); }
    },

    updCol(bi, ci, prop, val) {
        const blocks = State.get().blocks;
        if (blocks[bi]?.columns?.[ci]!==undefined) { blocks[bi].columns[ci][prop]=val; State.updateBlocks(blocks); Preview.render(); }
    },

    updColColor(bi, ci, prop, colorInput) {
        const val = colorInput.value;
        const sw = colorInput.closest('.color-swatch');
        if (sw) sw.querySelector('.color-swatch-preview').style.background = val;
        const row = colorInput.closest('.color-row');
        if (row) { const t = row.querySelector('input[type="text"]'); if(t) t.value=val; }
        this.updCol(bi, ci, prop, val);
    },

    updColHex(bi, ci, prop, textInput) {
        let v = textInput.value.trim();
        if (!v.startsWith('#')) v='#'+v;
        if (!Utils.isValidHex(v)) return;
        const row = textInput.closest('.color-row');
        if (row) { const c=row.querySelector('input[type="color"]'); if(c){ c.value=v; const sw=c.closest('.color-swatch'); if(sw) sw.querySelector('.color-swatch-preview').style.background=v; }}
        this.updCol(bi, ci, prop, v);
    },

    updBorder(bi, side, val) {
        const blocks = State.get().blocks;
        if (!blocks[bi]) return;
        if (!blocks[bi].border) blocks[bi].border = {...DEFAULT_BORDER};
        blocks[bi].border[side] = val;
        State.updateBlocks(blocks); Preview.render();
    },

    updBorderColor(bi, colorInput) {
        const val = colorInput.value;
        const sw = colorInput.closest('.color-swatch');
        if (sw) sw.querySelector('.color-swatch-preview').style.background=val;
        const row = colorInput.closest('.color-row');
        if (row) { const t=row.querySelector('input[type="text"]'); if(t) t.value=val; }
        this.updBorder(bi, 'color', val);
    },

    updBorderColorHex(bi, textInput) {
        let v = textInput.value.trim();
        if (!v.startsWith('#')) v='#'+v;
        if (!Utils.isValidHex(v)) return;
        const row = textInput.closest('.color-row');
        if (row) { const c=row.querySelector('input[type="color"]'); if(c){ c.value=v; const sw=c.closest('.color-swatch'); if(sw) sw.querySelector('.color-swatch-preview').style.background=v; }}
        this.updBorder(bi, 'color', v);
    },

    setBorderAll(bi, size) {
        const blocks = State.get().blocks;
        if (!blocks[bi]) return;
        const cur = blocks[bi].border || {};
        blocks[bi].border = { ...cur, top:size, right:size, bottom:size, left:size };
        State.updateBlocks(blocks); this.render(); Preview.render();
    },

    updTableDim(bi, dim, val) {
        const blocks = State.get().blocks;
        const block = blocks[bi]; if(!block) return;
        block[dim] = val;
        const total = block.rows * block.cols;
        const nc = [];
        for (let i=0;i<total;i++) nc.push(block.cells[i]||{content:`Cell ${i+1}`,align:'center',bgColor:i%2===0?'#f8fafc':'#ffffff'});
        block.cells = nc;
        State.updateBlocks(blocks); this.render(); Preview.render();
    },

    editCells(bi) {
        const block = State.get().blocks[bi]; if(!block) return;
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        const cellRows = block.cells.map((cell, cellIdx) => {
            const r = Math.floor(cellIdx / block.cols) + 1;
            const c = (cellIdx % block.cols) + 1;
            const escaped = (cell.content||'').replace(/`/g,'\`');
            return `
            <div class="cell-simple-row">
                <div class="cell-simple-head">
                    <span class="cell-label">R${r} · C${c}</span>
                    <div style="display:flex;align-items:center;gap:8px;flex-shrink:0;">
                        <select class="cell-align-sel" data-idx="${cellIdx}"
                            style="font-size:11px;padding:3px 6px;border:1px solid var(--border2);border-radius:4px;background:var(--bg);color:var(--text);">
                            <option value="left"   ${cell.align==='left'  ?'selected':''}>Left</option>
                            <option value="center" ${cell.align==='center'?'selected':''}>Center</option>
                            <option value="right"  ${cell.align==='right' ?'selected':''}>Right</option>
                        </select>
                        <label style="font-size:11px;color:var(--text3);">BG</label>
                        <input type="color" value="${cell.bgColor||'#ffffff'}" data-idx="${cellIdx}" class="cell-bg-inp"
                            style="width:28px;height:22px;border:1px solid var(--border2);border-radius:4px;padding:1px;cursor:pointer;">
                    </div>
                </div>
                <textarea class="cell-html-input" data-idx="${cellIdx}"
                    rows="3" placeholder="HTML content — paste from any editor"
                    style="width:100%;box-sizing:border-box;font-family:monospace;font-size:12px;padding:8px;border:none;border-top:1px solid var(--border);resize:vertical;background:var(--bg);color:var(--text);outline:none;"
                >${(cell.content||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</textarea>
            </div>`;
        }).join('');

        modal.innerHTML = `<div class="modal" style="max-width:600px;width:95vw;">
            <div class="modal-header">
                <h3><i class="fas fa-table"></i> Table Cells — ${block.rows}×${block.cols}</h3>
                <button class="modal-close" id="cell-modal-close">✕</button>
            </div>
            <div class="modal-body" style="padding:12px;">
                <div class="info-box blue" style="margin-bottom:8px;">
                    <i class="fas fa-info-circle"></i>
                    <span>Paste HTML from any editor. Changes apply instantly to preview.</span>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;">
                ${cellRows}
                </div>
            </div>
        </div>`;

        document.body.appendChild(modal);

        // Wire events after render
        modal.querySelectorAll('.cell-html-input').forEach(ta => {
            ta.addEventListener('input', e => {
                const idx = parseInt(e.target.dataset.idx);
                Blocks.updCell(bi, idx, 'content', e.target.value);
            });
            // Decode HTML entities back to real HTML when focused
            ta.addEventListener('focus', e => {
                const idx = parseInt(e.target.dataset.idx);
                const blocks = State.get().blocks;
                e.target.value = blocks[bi]?.cells?.[idx]?.content || '';
            });
        });
        modal.querySelectorAll('.cell-align-sel').forEach(sel => {
            sel.addEventListener('change', e => {
                Blocks.updCell(bi, parseInt(e.target.dataset.idx), 'align', e.target.value);
            });
        });
        modal.querySelectorAll('.cell-bg-inp').forEach(inp => {
            inp.addEventListener('input', e => {
                Blocks.updCell(bi, parseInt(e.target.dataset.idx), 'bgColor', e.target.value);
            });
        });

        modal.querySelector('#cell-modal-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    },

    updCell(bi, ci2, prop, val) {
        const blocks = State.get().blocks;
        if (blocks[bi]?.cells?.[ci2]!==undefined) { blocks[bi].cells[ci2][prop]=val; State.updateBlocks(blocks); Preview.render(); }
    },

    uploadImage(bi) { Utils.handleImageUpload(d => { this._applyImg(bi,null,d); Utils.showToast('Image uploaded','success'); }); },
    
    uploadImg2(bi,idx) { Utils.handleImageUpload(d => { this._applyImg(bi,idx,d); Utils.showToast('Image uploaded','success'); }); },
    
    browseLibImg(bi, idx) {
        const m = window._sIconsManifest;
        if (!m) { Utils.showToast('Manifest not loaded yet', 'warning'); return; }
        SocialIconPicker.openForImage((data) => { this._applyImg(bi, idx, data); }, m);
    },

    browseLibSec(bi, sec) {
        const m = window._sIconsManifest;
        if (!m) { Utils.showToast('Manifest not loaded yet', 'warning'); return; }
        SocialIconPicker.openForImage((data) => { this.updSec(bi, sec, 'src', data); this.render(); Preview.render(); }, m);
    },

    browseLibSecImg(bi, ii) {
        const m = window._sIconsManifest;
        if (!m) { Utils.showToast('Manifest not loaded yet', 'warning'); return; }
        SocialIconPicker.openForImage((data) => { this.updSecImg(bi, ii, 'src', data); this.render(); Preview.render(); }, m);
    },

    // ── Fetch URL → base64 embed ──────────────────────────────────
    // Fetches an external image URL and embeds it as base64 so the
    // exported email has no external dependencies.

    // ── URL validation helpers ───────────────────────────────────
    _isValidUrl(url) {
        if (!url || !url.trim()) return false;
        return /^(https?|ftp):\/\/.+/i.test(url.trim());
    },

    _toggleFetchBtn(btnId, urlVal) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const valid = this._isValidUrl(urlVal);
        btn.disabled = !valid;
    },

    fetchImgFromUrl(bi, idx, url) {
        if (!this._isValidUrl(url)) { Utils.showToast('Enter a valid URL (http/https/ftp)', 'warning'); return; }
        Utils.showToast('Fetching…', 'info');
        fetch(url.trim())
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
            .then(blob => {
                if (!blob.type.startsWith('image/')) throw new Error('URL is not an image (' + (blob.type||'unknown type') + ')');
                return new Promise((res, rej) => {
                    const reader = new FileReader();
                    reader.onload  = () => res(reader.result);
                    reader.onerror = () => rej(new Error('Read failed'));
                    reader.readAsDataURL(blob);
                });
            })
            .then(data => { this._applyImg(bi, idx, data); Utils.showToast('Image embedded ✓', 'success'); })
            .catch(e => Utils.showToast('Fetch failed: ' + e.message, 'error'));
    },

    fetchSecImgFromUrl(bi, sec, url) {
        if (!this._isValidUrl(url)) { Utils.showToast('Enter a valid URL (http/https/ftp)', 'warning'); return; }
        Utils.showToast('Fetching…', 'info');
        fetch(url.trim())
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
            .then(blob => {
                if (!blob.type.startsWith('image/')) throw new Error('URL is not an image (' + (blob.type||'unknown type') + ')');
                return new Promise((res, rej) => {
                    const reader = new FileReader();
                    reader.onload  = () => res(reader.result);
                    reader.onerror = () => rej(new Error('Read failed'));
                    reader.readAsDataURL(blob);
                });
            })
            .then(data => { this.updSecSrcFromInput(bi, sec, data); Utils.showToast('Image embedded ✓', 'success'); })
            .catch(e => Utils.showToast('Fetch failed: ' + e.message, 'error'));
    },

    fetchSecImg2FromUrl(bi, ii, url) {
        if (!this._isValidUrl(url)) { Utils.showToast('Enter a valid URL (http/https/ftp)', 'warning'); return; }
        Utils.showToast('Fetching…', 'info');
        fetch(url.trim())
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.blob(); })
            .then(blob => {
                if (!blob.type.startsWith('image/')) throw new Error('URL is not an image (' + (blob.type||'unknown type') + ')');
                return new Promise((res, rej) => {
                    const reader = new FileReader();
                    reader.onload  = () => res(reader.result);
                    reader.onerror = () => rej(new Error('Read failed'));
                    reader.readAsDataURL(blob);
                });
            })
            .then(data => { this.updSecImgSrcFromInput(bi, ii, data); Utils.showToast('Image embedded ✓', 'success'); })
            .catch(e => Utils.showToast('Fetch failed: ' + e.message, 'error'));
    },

    pasteImageClipboard(bi, idx) {
        if (!navigator.clipboard?.read) { Utils.showToast('Clipboard API unavailable — use Ctrl+V','warning'); return; }
        navigator.clipboard.read().then(items => {
            for (const item of items) {
                const t = item.types.find(x => x.startsWith('image/'));
                if (t) { item.getType(t).then(blob => { const r=new FileReader(); r.onload=ev=>{ this._applyImg(bi,idx,ev.target.result); Utils.showToast('Pasted from clipboard','success'); }; r.readAsDataURL(blob); }); return; }
            }
            Utils.showToast('No image found in clipboard','warning');
        }).catch(()=>Utils.showToast('Clipboard access denied — use Ctrl+V','warning'));
    },

    updSrcFromInput(bi, idx, src) { this._applyImg(bi, idx, src); },

    // Clear Image Functions
    clearImg(bi) {
        const blocks = State.get().blocks;
        const b = blocks[bi]; if (!b) return;
        b.src = ''; b.width = 1; b.height = 1;
        State.updateBlocks(blocks); this.render(); Preview.render();
    },
    clearImg2(bi, idx) {
        const blocks = State.get().blocks;
        const im = blocks[bi]?.images?.[idx]; if (!im) return;
        im.src = ''; im.width = 1; im.height = 1;
        State.updateBlocks(blocks); this.render(); Preview.render();
    },
    
    // Remove image — text-image section
    clearSecImg(bi, sec) {
        const blocks = State.get().blocks;
        const b = blocks[bi]; if (!b || !b[sec]) return;
        b[sec].src = ''; b[sec].width = 1; b[sec].height = 1;
        State.updateBlocks(blocks); this.render(); Preview.render();
    },

    // Remove image — text-2images section
    clearSecImg2(bi, ii) {
        const blocks = State.get().blocks;
        const im = blocks[bi]?.images?.[ii]; if (!im) return;
        im.src = ''; im.width = 1; im.height = 1;
        State.updateBlocks(blocks); this.render(); Preview.render();
    },

    // Central function: set src + auto-read natural dims + clamp to maxWidth
    _applyImg(bi, idx, src) {
        const maxW = (State.get().images||{}).maxWidth||600;
        const img  = new Image();
        const done = (nw, nh) => {
            const blocks = State.get().blocks;
            const set = (obj) => {
                obj.src = src;
                if (nw > 0 && nh > 0) {
                    obj._nw = nw; obj._nh = nh;
                    obj.width  = nw > maxW ? maxW : nw;
                    obj.height = Math.max(1, nw > maxW ? Math.round((maxW/nw)*nh) : nh);
                }
            };
            if (idx === null || idx === undefined) { const b=blocks[bi]; if(b) set(b); }
            else { const im=blocks[bi]?.images?.[idx]; if(im) set(im); }
            State.updateBlocks(blocks); this.render(); Preview.render();
        };
        img.onload  = () => done(img.naturalWidth, img.naturalHeight);
        img.onerror = () => done(0, 0);
        img.src = src;
    },

    // W or H changed — enforce ratio lock, min=1
    updWH(bi, idx, dim, rawVal) {
        const n = Math.max(1, parseInt(rawVal)||1);
        const blocks = State.get().blocks;
        const upd = (obj, wId, hId) => {
            const locked = obj.lockRatio !== false;
            const hasR   = obj._nw > 0 && obj._nh > 0;
            if (dim === 'w') {
                obj.width = n;
                if (locked && hasR) { obj.height = Math.max(1,Math.round((n/obj._nw)*obj._nh)); const el=document.getElementById(hId); if(el)el.value=obj.height; }
            } else {
                obj.height = n;
                if (locked && hasR) { obj.width = Math.max(1,Math.round((n/obj._nh)*obj._nw)); const el=document.getElementById(wId); if(el)el.value=obj.width; }
            }
        };
        if (idx === null || idx === undefined) { const b=blocks[bi]; if(b) upd(b,'imgW-'+bi,'imgH-'+bi); }
        else { const im=blocks[bi]?.images?.[idx]; if(im) upd(im,'imgW-'+bi+'-'+idx,'imgH-'+bi+'-'+idx); }
        State.updateBlocks(blocks); Preview.render();
    },

    toggleLock(bi, idx, btn) {
        const blocks=State.get().blocks; let locked;
        if (idx===null||idx===undefined) { const b=blocks[bi]; if(!b)return; b.lockRatio=!(b.lockRatio!==false); locked=b.lockRatio; }
        else { const im=blocks[bi]?.images?.[idx]; if(!im)return; im.lockRatio=!(im.lockRatio!==false); locked=im.lockRatio; }
        State.updateBlocks(blocks);
        btn.classList.toggle('active',locked);
        btn.title = locked?'Ratio locked — W drives H':'Ratio unlocked';
        btn.querySelector('i').className='fas '+(locked?'fa-link':'fa-unlink');
    },

    moveBlock(i, dir) {
        const ni = i+dir;
        if (ni<0||ni>=State.get().blocks.length) return;
        State.moveBlock(i,ni); this.render(); Preview.render();
    },

    duplicate(i) { State.duplicateBlock(i); this.render(); Preview.render(); Utils.showToast('Block duplicated','success'); },
    delete(i) { if(!confirm('Delete this block?')) return; State.deleteBlock(i); this.render(); Preview.render(); Utils.showToast('Block deleted','warning'); }
};
