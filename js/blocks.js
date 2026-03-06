// ============================================================
// BLOCKS
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

const Blocks = {
    openBlocks: {},

    // ─────────────────────────────────────────────
    // CREATE DEFAULT BLOCK
    // ─────────────────────────────────────────────
    createBlock(type) {
        const g = State.get().global;
        const isRTL = g.direction === 'rtl';
        const base = { id: Utils.generateId(), type, hideInMso: false };

        switch (type) {
            case 'text':
                return { ...base, content: isRTL ? '<p>مرحباً! هذا نص تجريبي باللغة العربية.</p>' : '<p>Hello! This is sample text content. Edit me.</p>', size: 16, color: '#334155', align: isRTL ? 'right' : 'left', padding: 25, backgroundColor: 'transparent' };
            case 'image':
                return { ...base, src: 'https://via.placeholder.com/600x300/2563eb/ffffff?text=Sample+Image', alt: 'Sample Image', width: 600, borderRadius: 0, link: '', align: 'center' };
            case 'two-images':
                return { ...base, images: [{ src: 'https://via.placeholder.com/280x180/3b82f6/ffffff?text=Image+1', alt: 'Image 1', link: '', width: 280, borderRadius: 0 }, { src: 'https://via.placeholder.com/280x180/10b981/ffffff?text=Image+2', alt: 'Image 2', link: '', width: 280, borderRadius: 0 }], gap: 20, align: 'center' };
            case 'two-texts':
                return { ...base, columns: [{ content: '<p>Left column content goes here.</p>', align: 'left', backgroundColor: 'transparent' }, { content: '<p>Right column content goes here.</p>', align: 'left', backgroundColor: 'transparent' }], gap: 30, backgroundColor: 'transparent' };
            case 'button':
                return { ...base, text: isRTL ? 'انقر هنا' : 'Click Here', link: 'https://example.com', backgroundColor: '#2563eb', textColor: '#ffffff', borderRadius: 6, padding: '13px 32px', align: 'center' };
            case 'table':
                return { ...base, rows: 2, cols: 3, cells: Array.from({length: 6}, (_, i) => ({ content: `Cell ${i+1}`, align: 'center', bgColor: i%2===0 ? '#f8fafc' : '#ffffff' })), borderWidth: 1, borderColor: '#e5e7eb', cellPadding: 15, cellSpacing: 0 };
            case 'divider':
                return { ...base, height: 1, color: '#e5e7eb', style: 'solid', width: '100%' };
            case 'spacer':
                return { ...base, height: 30 };
            default:
                return base;
        }
    },

    // ─────────────────────────────────────────────
    // ADD BLOCK
    // ─────────────────────────────────────────────
    addBlock(type) {
        const block = this.createBlock(type);
        State.addBlock(block);
        this.openBlocks[block.id] = true; // auto-expand new block
        this.render();
        Preview.render();
        UI.showTab('content');
        Utils.showToast((BLOCK_META[type]?.name || type) + ' block added', 'success');
        // Scroll to bottom of block list
        setTimeout(() => {
            const list = document.getElementById('block-list');
            if (list) list.scrollTop = list.scrollHeight;
        }, 50);
    },

    // ─────────────────────────────────────────────
    // RENDER LIST
    // ─────────────────────────────────────────────
    render() {
        const list = document.getElementById('block-list');
        if (!list) return;

        const blocks = State.get().blocks;
        if (!blocks.length) {
            list.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No content blocks</h3>
                    <p>Use the buttons below to add content</p>
                </div>`;
            return;
        }

        list.innerHTML = blocks.map((block, index) => this.renderBlockCard(block, index)).join('');
    },

    // ─────────────────────────────────────────────
    // RENDER ONE CARD
    // ─────────────────────────────────────────────
    renderBlockCard(block, index) {
        const meta = BLOCK_META[block.type] || { name: block.type, icon: 'fas fa-cube' };
        const isOpen = !!this.openBlocks[block.id];

        return `
            <div class="block-card" id="bc-${block.id}">
                <div class="block-header" onclick="Blocks.toggleBlock('${block.id}')">
                    <div class="block-title">
                        <i class="${meta.icon}"></i>
                        ${meta.name}
                        <span class="block-num">#${index + 1}</span>
                    </div>
                    <div class="block-actions" onclick="event.stopPropagation()">
                        <button class="bact" onclick="Blocks.moveBlock(${index},-1)" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                        <button class="bact" onclick="Blocks.moveBlock(${index},1)" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                        <button class="bact" onclick="Blocks.duplicate(${index})" title="Duplicate"><i class="fas fa-copy"></i></button>
                        <button class="bact danger" onclick="Blocks.delete(${index})" title="Delete"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="block-body ${isOpen ? 'open' : ''}" id="bb-${block.id}">
                    ${this.renderControls(block, index)}
                </div>
            </div>`;
    },

    toggleBlock(id) {
        this.openBlocks[id] = !this.openBlocks[id];
        const body = document.getElementById('bb-' + id);
        if (body) body.classList.toggle('open', !!this.openBlocks[id]);
    },

    // ─────────────────────────────────────────────
    // CONTROLS ROUTER
    // ─────────────────────────────────────────────
    renderControls(block, index) {
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

    // ─────────────────────────────────────────────
    // TEXT CONTROLS
    // ─────────────────────────────────────────────
    ctrlText(block, index) {
        return `
            <div class="ctrl"><label>Content (HTML)</label>
                <textarea rows="4" oninput="Blocks.upd(${index},'content',this.value)">${block.content}</textarea>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Font Size</label>
                    <input type="number" value="${block.size}" min="8" max="60" oninput="Blocks.upd(${index},'size',parseInt(this.value)||16)">
                </div>
                <div class="ctrl"><label>Padding</label>
                    <input type="number" value="${block.padding}" min="0" max="100" oninput="Blocks.upd(${index},'padding',parseInt(this.value)||0)">
                </div>
            </div>
            <div class="ctrl"><label>Alignment</label>
                <select onchange="Blocks.upd(${index},'align',this.value)">
                    <option value="left" ${block.align==='left'?'selected':''}>Left</option>
                    <option value="center" ${block.align==='center'?'selected':''}>Center</option>
                    <option value="right" ${block.align==='right'?'selected':''}>Right</option>
                    <option value="justify" ${block.align==='justify'?'selected':''}>Justify</option>
                </select>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Text Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.color};"></div><input type="color" value="${block.color}" oninput="Blocks.updColor(${index},'color',this)"></div>
                        <input type="text" value="${block.color}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'color',this)">
                    </div>
                </div>
                <div class="ctrl"><label>Background</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.backgroundColor==='transparent'?'#ffffff':block.backgroundColor};"></div><input type="color" value="${block.backgroundColor==='transparent'?'#ffffff':block.backgroundColor}" oninput="Blocks.updColor(${index},'backgroundColor',this)"></div>
                        <input type="text" value="${block.backgroundColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'backgroundColor',this)">
                    </div>
                </div>
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // IMAGE CONTROLS
    // ─────────────────────────────────────────────
    ctrlImage(block, index) {
        return `
            <div class="ctrl"><label>Image URL</label>
                <div style="display:flex;gap:6px;">
                    <input type="text" value="${block.src}" placeholder="https://..." oninput="Blocks.upd(${index},'src',this.value)" style="flex:1;">
                    <button class="ctrl-btn" style="width:auto;padding:6px 10px;" onclick="Blocks.uploadImage(${index})"><i class="fas fa-upload"></i></button>
                </div>
            </div>
            ${block.src ? `<div style="text-align:center;margin-bottom:8px;"><img src="${block.src}" style="max-width:100%;max-height:80px;border-radius:4px;border:1px solid var(--border2);"></div>` : ''}
            <div class="ctrl"><label>Alt Text</label>
                <input type="text" value="${block.alt}" placeholder="Describe the image" oninput="Blocks.upd(${index},'alt',this.value)">
            </div>
            <div class="row2">
                <div class="ctrl"><label>Width (px)</label>
                    <input type="number" value="${block.width}" min="50" max="800" oninput="Blocks.upd(${index},'width',parseInt(this.value)||600)">
                </div>
                <div class="ctrl"><label>Border Radius</label>
                    <input type="number" value="${block.borderRadius}" min="0" max="200" oninput="Blocks.upd(${index},'borderRadius',parseInt(this.value)||0)">
                </div>
            </div>
            <div class="ctrl"><label>Link URL (optional)</label>
                <input type="text" value="${block.link}" placeholder="https://..." oninput="Blocks.upd(${index},'link',this.value)">
            </div>
            <div class="ctrl"><label>Alignment</label>
                <select onchange="Blocks.upd(${index},'align',this.value)">
                    <option value="left" ${block.align==='left'?'selected':''}>Left</option>
                    <option value="center" ${block.align==='center'?'selected':''}>Center</option>
                    <option value="right" ${block.align==='right'?'selected':''}>Right</option>
                </select>
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // TWO IMAGES CONTROLS
    // ─────────────────────────────────────────────
    ctrlTwoImages(block, index) {
        return `
            <div class="row2">
                <div class="ctrl"><label>Image 1 URL</label>
                    <input type="text" value="${block.images[0].src}" placeholder="https://..." oninput="Blocks.updImg(${index},0,'src',this.value)">
                </div>
                <div class="ctrl"><label>Image 2 URL</label>
                    <input type="text" value="${block.images[1].src}" placeholder="https://..." oninput="Blocks.updImg(${index},1,'src',this.value)">
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Alt 1</label>
                    <input type="text" value="${block.images[0].alt}" oninput="Blocks.updImg(${index},0,'alt',this.value)">
                </div>
                <div class="ctrl"><label>Alt 2</label>
                    <input type="text" value="${block.images[1].alt}" oninput="Blocks.updImg(${index},1,'alt',this.value)">
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Link 1</label>
                    <input type="text" value="${block.images[0].link}" placeholder="https://..." oninput="Blocks.updImg(${index},0,'link',this.value)">
                </div>
                <div class="ctrl"><label>Link 2</label>
                    <input type="text" value="${block.images[1].link}" placeholder="https://..." oninput="Blocks.updImg(${index},1,'link',this.value)">
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Border Radius</label>
                    <input type="number" value="${block.images[0].borderRadius}" min="0" max="200" oninput="Blocks.updImg2BR(${index},parseInt(this.value)||0)">
                </div>
                <div class="ctrl"><label>Gap (px)</label>
                    <input type="number" value="${block.gap}" min="0" max="80" oninput="Blocks.upd(${index},'gap',parseInt(this.value)||0)">
                </div>
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // TWO TEXTS CONTROLS
    // ─────────────────────────────────────────────
    ctrlTwoTexts(block, index) {
        return `
            <div class="row2">
                <div class="ctrl"><label>Left Column</label>
                    <textarea rows="3" oninput="Blocks.updCol(${index},0,'content',this.value)">${block.columns[0].content}</textarea>
                </div>
                <div class="ctrl"><label>Right Column</label>
                    <textarea rows="3" oninput="Blocks.updCol(${index},1,'content',this.value)">${block.columns[1].content}</textarea>
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Left Align</label>
                    <select onchange="Blocks.updCol(${index},0,'align',this.value)">
                        <option value="left" ${block.columns[0].align==='left'?'selected':''}>Left</option>
                        <option value="center" ${block.columns[0].align==='center'?'selected':''}>Center</option>
                        <option value="right" ${block.columns[0].align==='right'?'selected':''}>Right</option>
                    </select>
                </div>
                <div class="ctrl"><label>Right Align</label>
                    <select onchange="Blocks.updCol(${index},1,'align',this.value)">
                        <option value="left" ${block.columns[1].align==='left'?'selected':''}>Left</option>
                        <option value="center" ${block.columns[1].align==='center'?'selected':''}>Center</option>
                        <option value="right" ${block.columns[1].align==='right'?'selected':''}>Right</option>
                    </select>
                </div>
            </div>
            <div class="ctrl"><label>Column Gap (px)</label>
                <input type="number" value="${block.gap}" min="0" max="100" oninput="Blocks.upd(${index},'gap',parseInt(this.value)||0)">
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // BUTTON CONTROLS
    // ─────────────────────────────────────────────
    ctrlButton(block, index) {
        return `
            <div class="row2">
                <div class="ctrl"><label>Button Text</label>
                    <input type="text" value="${block.text}" oninput="Blocks.upd(${index},'text',this.value)">
                </div>
                <div class="ctrl"><label>Link URL</label>
                    <input type="text" value="${block.link}" placeholder="https://..." oninput="Blocks.upd(${index},'link',this.value)">
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Button Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.backgroundColor};"></div><input type="color" value="${block.backgroundColor}" oninput="Blocks.updColor(${index},'backgroundColor',this)"></div>
                        <input type="text" value="${block.backgroundColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'backgroundColor',this)">
                    </div>
                </div>
                <div class="ctrl"><label>Text Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.textColor};"></div><input type="color" value="${block.textColor}" oninput="Blocks.updColor(${index},'textColor',this)"></div>
                        <input type="text" value="${block.textColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'textColor',this)">
                    </div>
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Border Radius</label>
                    <input type="number" value="${block.borderRadius}" min="0" max="50" oninput="Blocks.upd(${index},'borderRadius',parseInt(this.value)||0)">
                </div>
                <div class="ctrl"><label>Padding</label>
                    <input type="text" value="${block.padding}" oninput="Blocks.upd(${index},'padding',this.value)">
                </div>
            </div>
            <div class="ctrl"><label>Alignment</label>
                <select onchange="Blocks.upd(${index},'align',this.value)">
                    <option value="left" ${block.align==='left'?'selected':''}>Left</option>
                    <option value="center" ${block.align==='center'?'selected':''}>Center</option>
                    <option value="right" ${block.align==='right'?'selected':''}>Right</option>
                </select>
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // TABLE CONTROLS
    // ─────────────────────────────────────────────
    ctrlTable(block, index) {
        return `
            <div class="row3">
                <div class="ctrl"><label>Rows</label>
                    <input type="number" value="${block.rows}" min="1" max="10" oninput="Blocks.updTableDim(${index},'rows',parseInt(this.value)||2)">
                </div>
                <div class="ctrl"><label>Columns</label>
                    <input type="number" value="${block.cols}" min="1" max="6" oninput="Blocks.updTableDim(${index},'cols',parseInt(this.value)||2)">
                </div>
                <div class="ctrl"><label>Cell Pad</label>
                    <input type="number" value="${block.cellPadding}" min="0" max="50" oninput="Blocks.upd(${index},'cellPadding',parseInt(this.value)||0)">
                </div>
            </div>
            <div class="row2">
                <div class="ctrl"><label>Border Width</label>
                    <input type="number" value="${block.borderWidth}" min="0" max="5" oninput="Blocks.upd(${index},'borderWidth',parseInt(this.value)||0)">
                </div>
                <div class="ctrl"><label>Border Color</label>
                    <div class="color-row">
                        <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.borderColor};"></div><input type="color" value="${block.borderColor}" oninput="Blocks.updColor(${index},'borderColor',this)"></div>
                        <input type="text" value="${block.borderColor}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'borderColor',this)">
                    </div>
                </div>
            </div>
            <button class="ctrl-btn" onclick="Blocks.editCells(${index})"><i class="fas fa-table"></i> Edit Cell Contents</button>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // DIVIDER CONTROLS
    // ─────────────────────────────────────────────
    ctrlDivider(block, index) {
        return `
            <div class="row2">
                <div class="ctrl"><label>Height (px)</label>
                    <input type="number" value="${block.height}" min="1" max="20" oninput="Blocks.upd(${index},'height',parseInt(this.value)||1)">
                </div>
                <div class="ctrl"><label>Style</label>
                    <select onchange="Blocks.upd(${index},'style',this.value)">
                        <option value="solid" ${block.style==='solid'?'selected':''}>Solid</option>
                        <option value="dashed" ${block.style==='dashed'?'selected':''}>Dashed</option>
                        <option value="dotted" ${block.style==='dotted'?'selected':''}>Dotted</option>
                    </select>
                </div>
            </div>
            <div class="ctrl"><label>Color</label>
                <div class="color-row">
                    <div class="color-swatch"><div class="color-swatch-preview" style="background:${block.color};"></div><input type="color" value="${block.color}" oninput="Blocks.updColor(${index},'color',this)"></div>
                    <input type="text" value="${block.color}" maxlength="7" style="font-family:monospace;" oninput="Blocks.updHex(${index},'color',this)">
                </div>
            </div>
            <div class="ctrl"><label>Width</label>
                <select onchange="Blocks.upd(${index},'width',this.value)">
                    <option value="100%" ${block.width==='100%'?'selected':''}>100% (Full)</option>
                    <option value="80%" ${block.width==='80%'?'selected':''}>80%</option>
                    <option value="60%" ${block.width==='60%'?'selected':''}>60%</option>
                    <option value="40%" ${block.width==='40%'?'selected':''}>40%</option>
                </select>
            </div>
            ${this.ctrlVisibility(block, index)}`;
    },

    // ─────────────────────────────────────────────
    // SPACER CONTROLS
    // ─────────────────────────────────────────────
    ctrlSpacer(block, index) {
        return `
            <div class="ctrl"><label>Height</label>
                <div class="range-wrap">
                    <input type="range" value="${block.height}" min="5" max="120" oninput="Blocks.upd(${index},'height',parseInt(this.value)); this.nextElementSibling.textContent=this.value+'px'">
                    <span class="range-val">${block.height}px</span>
                </div>
            </div>`;
    },

    // ─────────────────────────────────────────────
    // VISIBILITY CONTROL (common)
    // ─────────────────────────────────────────────
    ctrlVisibility(block, index) {
        return `
            <div class="ctrl" style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);">
                <label>Client Visibility</label>
                <select onchange="Blocks.upd(${index},'hideInMso',this.value==='true'?true:(this.value==='false'?false:this.value))">
                    <option value="false" ${!block.hideInMso?'selected':''}>Show in All Clients</option>
                    <option value="true" ${block.hideInMso===true?'selected':''}>Hide in Outlook (MSO)</option>
                    <option value="mobile-only" ${block.hideInMso==='mobile-only'?'selected':''}>Mobile Only</option>
                    <option value="desktop-only" ${block.hideInMso==='desktop-only'?'selected':''}>Desktop Only</option>
                </select>
            </div>`;
    },

    // ─────────────────────────────────────────────
    // UPDATE HELPERS
    // ─────────────────────────────────────────────
    upd(index, prop, value) {
        const blocks = State.get().blocks;
        if (index < 0 || index >= blocks.length) return;
        blocks[index][prop] = value;
        State.updateBlocks(blocks);
        Preview.render();
    },

    updColor(index, prop, colorInput) {
        const val = colorInput.value;
        // sync swatch preview
        const swatch = colorInput.closest('.color-swatch');
        if (swatch) swatch.querySelector('.color-swatch-preview').style.background = val;
        // sync text input
        const row = colorInput.closest('.color-row');
        if (row) { const txt = row.querySelector('input[type="text"]'); if (txt) txt.value = val; }
        this.upd(index, prop, val);
    },

    updHex(index, prop, textInput) {
        let v = textInput.value.trim();
        if (!v.startsWith('#')) v = '#' + v;
        if (!Utils.isValidHex(v)) return;
        // sync color input
        const row = textInput.closest('.color-row');
        if (row) {
            const colorInput = row.querySelector('input[type="color"]');
            if (colorInput) {
                colorInput.value = v;
                const swatch = colorInput.closest('.color-swatch');
                if (swatch) swatch.querySelector('.color-swatch-preview').style.background = v;
            }
        }
        this.upd(index, prop, v);
    },

    updImg(blockIndex, imgIndex, prop, value) {
        const blocks = State.get().blocks;
        if (blocks[blockIndex]?.images?.[imgIndex]) {
            blocks[blockIndex].images[imgIndex][prop] = value;
            State.updateBlocks(blocks);
            Preview.render();
        }
    },

    updImg2BR(blockIndex, val) {
        const blocks = State.get().blocks;
        if (blocks[blockIndex]?.images) {
            blocks[blockIndex].images[0].borderRadius = val;
            blocks[blockIndex].images[1].borderRadius = val;
            State.updateBlocks(blocks);
            Preview.render();
        }
    },

    updCol(blockIndex, colIndex, prop, value) {
        const blocks = State.get().blocks;
        if (blocks[blockIndex]?.columns?.[colIndex]) {
            blocks[blockIndex].columns[colIndex][prop] = value;
            State.updateBlocks(blocks);
            Preview.render();
        }
    },

    updTableDim(blockIndex, dim, value) {
        const blocks = State.get().blocks;
        const block = blocks[blockIndex];
        if (!block) return;
        block[dim] = value;
        const total = block.rows * block.cols;
        const newCells = [];
        for (let i = 0; i < total; i++) {
            newCells.push(block.cells[i] || { content: `Cell ${i+1}`, align: 'center', bgColor: i%2===0 ? '#f8fafc' : '#ffffff' });
        }
        block.cells = newCells;
        State.updateBlocks(blocks);
        this.render();
        Preview.render();
    },

    // ─────────────────────────────────────────────
    // CELL EDITOR MODAL
    // ─────────────────────────────────────────────
    editCells(blockIndex) {
        const block = State.get().blocks[blockIndex];
        if (!block) return;

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>Edit Table Cells — ${block.rows}×${block.cols}</h3>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>
                </div>
                <div class="modal-body">
                    ${block.cells.map((cell, i) => `
                        <div class="cell-editor-row">
                            <div class="cell-label">Cell ${i+1} (Row ${Math.floor(i/block.cols)+1}, Col ${(i%block.cols)+1})</div>
                            <div class="cell-editor-grid">
                                <input type="text" value="${cell.content.replace(/"/g,'&quot;')}" placeholder="Content (HTML ok)" onchange="Blocks.updCell(${blockIndex},${i},'content',this.value)">
                                <select onchange="Blocks.updCell(${blockIndex},${i},'align',this.value)">
                                    <option value="left" ${cell.align==='left'?'selected':''}>Left</option>
                                    <option value="center" ${cell.align==='center'?'selected':''}>Center</option>
                                    <option value="right" ${cell.align==='right'?'selected':''}>Right</option>
                                </select>
                                <input type="color" value="${cell.bgColor||'#ffffff'}" title="Background color" onchange="Blocks.updCell(${blockIndex},${i},'bgColor',this.value)">
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;

        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
        document.body.appendChild(modal);
    },

    updCell(blockIndex, cellIndex, prop, value) {
        const blocks = State.get().blocks;
        if (blocks[blockIndex]?.cells?.[cellIndex] !== undefined) {
            blocks[blockIndex].cells[cellIndex][prop] = value;
            State.updateBlocks(blocks);
            Preview.render();
        }
    },

    // ─────────────────────────────────────────────
    // IMAGE UPLOAD
    // ─────────────────────────────────────────────
    uploadImage(blockIndex) {
        Utils.handleImageUpload(data => {
            const blocks = State.get().blocks;
            if (blocks[blockIndex]) {
                blocks[blockIndex].src = data;
                State.updateBlocks(blocks);
                this.render();
                Preview.render();
                Utils.showToast('Image uploaded', 'success');
            }
        });
    },

    // ─────────────────────────────────────────────
    // BLOCK OPERATIONS
    // ─────────────────────────────────────────────
    moveBlock(index, dir) {
        const newIndex = index + dir;
        if (newIndex < 0 || newIndex >= State.get().blocks.length) return;
        State.moveBlock(index, newIndex);
        this.render();
        Preview.render();
    },

    duplicate(index) {
        State.duplicateBlock(index);
        this.render();
        Preview.render();
        Utils.showToast('Block duplicated', 'success');
    },

    delete(index) {
        if (!confirm('Delete this block?')) return;
        State.deleteBlock(index);
        this.render();
        Preview.render();
        Utils.showToast('Block deleted', 'warning');
    }
};
