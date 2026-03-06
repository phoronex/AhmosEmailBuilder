// ============================================================
// BLOCKS  — v4.2
// ============================================================

const BLOCK_META = {
    text:        { name: 'Text',       icon: 'fas fa-font' },
    image:       { name: 'Image',      icon: 'fas fa-image' },
    'two-images':{ name: '2 Images',   icon: 'fas fa-images' },
    'two-texts': { name: '2 Columns',  icon: 'fas fa-columns' },
    button:      { name: 'Button',     icon: 'fas fa-hand-pointer' },
    table:       { name: 'Table',      icon: 'fas fa-table' },
    divider:     { name: 'Divider',    icon: 'fas fa-minus' },
    spacer:      { name: 'Spacer',     icon: 'fas fa-arrows-alt-v' }
};

const DEFAULT_BORDER = { top: 0, right: 0, bottom: 0, left: 0, color: '#e5e7eb', style: 'solid' };

const Blocks = {
    openBlocks: {},

    createBlock(type) {
        const g = State.get().global;
        const isRTL = g.direction === 'rtl';
        const base  = { id: Utils.generateId(), type, hideInMso: false, border: { ...DEFAULT_BORDER } };

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
                    backgroundColor: 'transparent'
                };
            case 'image':
                return { ...base, src: 'https://via.placeholder.com/600x300/2563eb/ffffff?text=Sample+Image', alt: 'Sample Image', width: 600, borderRadius: 0, link: '', align: 'center' };
            case 'two-images':
                return { ...base,
                    images: [
                        { src: 'https://via.placeholder.com/280x180/3b82f6/ffffff?text=Image+1', alt: 'Image 1', link: '', width: 280, borderRadius: 0 },
                        { src: 'https://via.placeholder.com/280x180/10b981/ffffff?text=Image+2', alt: 'Image 2', link: '', width: 280, borderRadius: 0 }
                    ], gap: 20, align: 'center'
                };
            case 'two-texts':
                return { ...base,
                    columns: [
                        { content: '<p>Left column content.</p>', align: 'left', direction: 'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent' },
                        { content: '<p>Right column content.</p>', align: 'left', direction: 'ltr', lineHeight: 1.65, color: '#334155', size: 15, paddingTop: 12, paddingRight: 12, paddingBottom: 12, paddingLeft: 12, backgroundColor: 'transparent' }
                    ],
                    gap: 20, backgroundColor: 'transparent',
                    outerPaddingTop: 16, outerPaddingRight: 16, outerPaddingBottom: 16, outerPaddingLeft: 16
                };
            case 'button':
                return { ...base, text: isRTL ? 'انقر هنا' : 'Click Here', link: 'https://example.com', backgroundColor: '#2563eb', textColor: '#ffffff', borderRadius: 6, padding: '13px 32px', align: 'center' };
            case 'table':
                return { ...base, rows: 2, cols: 3,
                    cells: Array.from({length: 6}, (_, i) => ({ content: `Cell ${i+1}`, align: 'center', bgColor: i%2===0 ? '#f8fafc' : '#ffffff' })),
                    borderWidth: 1, borderColor: '#e5e7eb', cellPadding: 15, cellSpacing: 0 };
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
            case 'spacer':      return this.ctrlSpacer(block, index);
            default: return '';
        }
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
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
                <label style="margin:0;">Content (HTML)</label>
                <button class="mini-btn" onclick="Blocks.showDatePicker(${i},'text')" title="Insert date"><i class="fas fa-calendar-alt"></i> Date</button>
            </div>
            <textarea rows="4" oninput="Blocks.upd(${i},'content',this.value)">${block.content}</textarea>
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
        <div class="ctrl"><label>Text Wrap</label>
            <select onchange="Blocks.upd(${i},'whiteSpace',this.value)">
                <option value="normal"   ${(block.whiteSpace||'normal')==='normal'  ?'selected':''}>Normal (wrap)</option>
                <option value="nowrap"   ${(block.whiteSpace||'normal')==='nowrap'  ?'selected':''}>No Wrap</option>
                <option value="pre-wrap" ${(block.whiteSpace||'normal')==='pre-wrap'?'selected':''}>Pre-wrap (preserve spaces)</option>
            </select>
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
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── IMAGE CONTROLS ────────────────────────────
    ctrlImage(block, i) {
        return `
        <div class="ctrl"><label>Image URL</label>
            <div style="display:flex;gap:6px;">
                <input type="text" value="${block.src}" placeholder="https://..." oninput="Blocks.upd(${i},'src',this.value)" style="flex:1;">
                <button class="ctrl-btn" style="width:auto;padding:6px 10px;" onclick="Blocks.uploadImage(${i})"><i class="fas fa-upload"></i></button>
            </div>
        </div>
        ${block.src ? `<div style="text-align:center;margin-bottom:8px;"><img src="${block.src}" style="max-width:100%;max-height:80px;border-radius:4px;border:1px solid var(--border2);"></div>` : ''}
        <div class="ctrl"><label>Alt Text</label>
            <input type="text" value="${block.alt}" placeholder="Describe the image" oninput="Blocks.upd(${i},'alt',this.value)">
        </div>
        <div class="row2">
            <div class="ctrl"><label>Width (px)</label>
                <input type="number" value="${block.width}" min="50" max="800" oninput="Blocks.upd(${i},'width',parseInt(this.value)||600)">
            </div>
            <div class="ctrl"><label>Border Radius</label>
                <input type="number" value="${block.borderRadius}" min="0" max="200" oninput="Blocks.upd(${i},'borderRadius',parseInt(this.value)||0)">
            </div>
        </div>
        <div class="ctrl"><label>Link URL (optional)</label>
            <input type="text" value="${block.link}" placeholder="https://..." oninput="Blocks.upd(${i},'link',this.value)">
        </div>
        <div class="ctrl"><label>Alignment</label>
            <select onchange="Blocks.upd(${i},'align',this.value)">
                <option value="left"   ${block.align==='left'  ?'selected':''}>Left</option>
                <option value="center" ${block.align==='center'?'selected':''}>Center</option>
                <option value="right"  ${block.align==='right' ?'selected':''}>Right</option>
            </select>
        </div>
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TWO IMAGES CONTROLS ───────────────────────
    ctrlTwoImages(block, i) {
        return `
        <div class="row2">
            <div class="ctrl"><label>Image 1 URL</label><input type="text" value="${block.images[0].src}" placeholder="https://..." oninput="Blocks.updImg(${i},0,'src',this.value)"></div>
            <div class="ctrl"><label>Image 2 URL</label><input type="text" value="${block.images[1].src}" placeholder="https://..." oninput="Blocks.updImg(${i},1,'src',this.value)"></div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Alt 1</label><input type="text" value="${block.images[0].alt}" oninput="Blocks.updImg(${i},0,'alt',this.value)"></div>
            <div class="ctrl"><label>Alt 2</label><input type="text" value="${block.images[1].alt}" oninput="Blocks.updImg(${i},1,'alt',this.value)"></div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Link 1</label><input type="text" value="${block.images[0].link}" placeholder="https://..." oninput="Blocks.updImg(${i},0,'link',this.value)"></div>
            <div class="ctrl"><label>Link 2</label><input type="text" value="${block.images[1].link}" placeholder="https://..." oninput="Blocks.updImg(${i},1,'link',this.value)"></div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Border Radius</label><input type="number" value="${block.images[0].borderRadius}" min="0" max="200" oninput="Blocks.updImg2BR(${i},parseInt(this.value)||0)"></div>
            <div class="ctrl"><label>Gap (px)</label><input type="number" value="${block.gap}" min="0" max="80" oninput="Blocks.upd(${i},'gap',parseInt(this.value)||0)"></div>
        </div>
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
                    <button class="mini-btn" onclick="Blocks.showDatePicker(${i},'two-texts',${ci})"><i class="fas fa-calendar-alt"></i></button>
                </div>
                <div class="ctrl"><textarea rows="3" oninput="Blocks.updCol(${i},${ci},'content',this.value)">${c.content}</textarea></div>
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
        <div class="ctrl"><label>Alignment</label>
            <select onchange="Blocks.upd(${i},'align',this.value)">
                <option value="left"   ${block.align==='left'  ?'selected':''}>Left</option>
                <option value="center" ${block.align==='center'?'selected':''}>Center</option>
                <option value="right"  ${block.align==='right' ?'selected':''}>Right</option>
            </select>
        </div>
        ${this.ctrlBorder(block, i)}
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── TABLE CONTROLS ────────────────────────────
    ctrlTable(block, i) {
        return `
        <div class="row3">
            <div class="ctrl"><label>Rows</label><input type="number" value="${block.rows}" min="1" max="10" oninput="Blocks.updTableDim(${i},'rows',parseInt(this.value)||2)"></div>
            <div class="ctrl"><label>Cols</label><input type="number" value="${block.cols}" min="1" max="6" oninput="Blocks.updTableDim(${i},'cols',parseInt(this.value)||2)"></div>
            <div class="ctrl"><label>Cell Pad</label><input type="number" value="${block.cellPadding}" min="0" max="50" oninput="Blocks.upd(${i},'cellPadding',parseInt(this.value)||0)"></div>
        </div>
        <div class="row2">
            <div class="ctrl"><label>Border Width</label><input type="number" value="${block.borderWidth}" min="0" max="5" oninput="Blocks.upd(${i},'borderWidth',parseInt(this.value)||0)"></div>
            <div class="ctrl"><label>Border Color</label>
                <div class="color-row">
                    <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.borderColor};"></div>
                        <input type="color" value="${block.borderColor}" oninput="Blocks.updColor(${i},'borderColor',this)"></div>
                    <input type="text" value="${block.borderColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${i},'borderColor',this)">
                </div>
            </div>
        </div>
        <button class="ctrl-btn" onclick="Blocks.editCells(${i})"><i class="fas fa-table"></i> Edit Cell Contents</button>
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
            <select onchange="Blocks.upd(${i},'width',this.value)">
                <option value="100%" ${block.width==='100%'?'selected':''}>100%</option>
                <option value="80%"  ${block.width==='80%' ?'selected':''}>80%</option>
                <option value="60%"  ${block.width==='60%' ?'selected':''}>60%</option>
                <option value="40%"  ${block.width==='40%' ?'selected':''}>40%</option>
            </select>
        </div>
        ${this.ctrlVisibility(block, i)}`;
    },

    // ── SPACER CONTROLS ───────────────────────────
    ctrlSpacer(block, i) {
        return `<div class="ctrl"><label>Height</label>
            <div class="range-wrap">
                <input type="range" value="${block.height}" min="5" max="120" oninput="Blocks.upd(${i},'height',parseInt(this.value));this.nextElementSibling.textContent=this.value+'px'">
                <span class="range-val">${block.height}px</span>
            </div></div>`;
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
        if (blocks[bi]?.images?.[ii]) { blocks[bi].images[ii][prop]=val; State.updateBlocks(blocks); Preview.render(); }
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
        modal.innerHTML = `<div class="modal"><div class="modal-header">
            <h3>Edit Table Cells — ${block.rows}×${block.cols}</h3>
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
        </div><div class="modal-body">
            ${block.cells.map((cell,i)=>`<div class="cell-editor-row">
                <div class="cell-label">Cell ${i+1} (R${Math.floor(i/block.cols)+1} C${(i%block.cols)+1})</div>
                <div class="cell-editor-grid">
                    <input type="text" value="${cell.content.replace(/"/g,'&quot;')}" placeholder="Content (HTML ok)" onchange="Blocks.updCell(${bi},${i},'content',this.value)">
                    <select onchange="Blocks.updCell(${bi},${i},'align',this.value)">
                        <option value="left" ${cell.align==='left'?'selected':''}>Left</option>
                        <option value="center" ${cell.align==='center'?'selected':''}>Center</option>
                        <option value="right" ${cell.align==='right'?'selected':''}>Right</option>
                    </select>
                    <input type="color" value="${cell.bgColor||'#ffffff'}" title="Background" onchange="Blocks.updCell(${bi},${i},'bgColor',this.value)">
                </div></div>`).join('')}
        </div></div>`;
        modal.addEventListener('click', e=>{ if(e.target===modal) modal.remove(); });
        document.body.appendChild(modal);
    },

    updCell(bi, ci2, prop, val) {
        const blocks = State.get().blocks;
        if (blocks[bi]?.cells?.[ci2]!==undefined) { blocks[bi].cells[ci2][prop]=val; State.updateBlocks(blocks); Preview.render(); }
    },

    uploadImage(bi) {
        Utils.handleImageUpload(data => {
            const blocks = State.get().blocks;
            if (blocks[bi]) { blocks[bi].src=data; State.updateBlocks(blocks); this.render(); Preview.render(); Utils.showToast('Image uploaded','success'); }
        });
    },

    moveBlock(i, dir) {
        const ni = i+dir;
        if (ni<0||ni>=State.get().blocks.length) return;
        State.moveBlock(i,ni); this.render(); Preview.render();
    },

    duplicate(i) { State.duplicateBlock(i); this.render(); Preview.render(); Utils.showToast('Block duplicated','success'); },
    delete(i) { if(!confirm('Delete this block?')) return; State.deleteBlock(i); this.render(); Preview.render(); Utils.showToast('Block deleted','warning'); }
};
