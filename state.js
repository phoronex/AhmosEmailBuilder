// ============================================================
// STATE
// ============================================================

const State = {
    data: {
        global: {
            width: 600,
            bgOuter: '#f1f5f9',
            bgInner: '#ffffff',
            font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            direction: 'ltr',
            arabicFont: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            arabicLineHeight: 1.8
        },
        header: {
            logo: '',
            text: 'Company Name',
            align: 'center',
            textColor: '#ffffff',
            bg: '#2563eb',
            paddingTop: 35,
            paddingBottom: 35,
            paddingLeft: 30,
            paddingRight: 30
        },
        blocks: [],
        footer: {
            text: `© ${new Date().getFullYear()} AHMOS. All rights reserved.\nProfessional Email Solutions\nwww.example.com`,
            bg: '#1e293b',
            color: '#94a3b8',
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 30,
            paddingRight: 30,
            fontSize: 14,
            lineHeight: 1.6
        },
        images: {
            maxWidth: 600
        },
        fixes: {
            outlook: true,
            ios: true,
            gmail: true
        }
    },

    get() { return this.data; },

    updateGlobal(obj) {
        Object.assign(this.data.global, obj);
        this.save();
    },

    updateHeader(obj) {
        Object.assign(this.data.header, obj);
        this.save();
    },

    updateFooter(obj) {
        Object.assign(this.data.footer, obj);
        this.save();
    },

    updateSection(section, obj) {
        if (!this.data[section]) this.data[section] = {};
        Object.assign(this.data[section], obj);
        this.save();
    },

    updateBlocks(blocks) {
        this.data.blocks = blocks;
        this.save();
    },

    addBlock(block) {
        this.data.blocks.push(block);
        this.save();
    },

    moveBlock(from, to) {
        const blocks = this.data.blocks;
        if (from < 0 || from >= blocks.length || to < 0 || to >= blocks.length) return;
        const [block] = blocks.splice(from, 1);
        blocks.splice(to, 0, block);
        this.save();
    },

    deleteBlock(index) {
        this.data.blocks.splice(index, 1);
        this.save();
    },

    duplicateBlock(index) {
        const orig = this.data.blocks[index];
        const copy = JSON.parse(JSON.stringify(orig));
        copy.id = Utils.generateId();
        this.data.blocks.splice(index + 1, 0, copy);
        this.save();
    },

    save() {
        try {
            localStorage.setItem('ebp4_state', JSON.stringify(this.data));
            Utils.updateSaveBadge(true);
        } catch(e) {}
    },

    load() {
        try {
            const raw = localStorage.getItem('ebp4_state');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.global) {
                    this.data = parsed;
                    // Refresh copyright year
                    this.data.footer.text = this.data.footer.text.replace(/© \d{4}/, `© ${new Date().getFullYear()}`);
                    return true;
                }
            }
        } catch(e) {}
        return false;
    },

    applyTemplate(tpl) {
        if (!tpl) return;
        if (tpl.global) this.data.global = Object.assign({}, this.data.global, tpl.global);
        if (tpl.header) this.data.header = Object.assign({}, this.data.header, tpl.header);
        if (tpl.footer) this.data.footer = Object.assign({}, this.data.footer, tpl.footer);
        if (tpl.blocks) this.data.blocks = JSON.parse(JSON.stringify(tpl.blocks));
        this.save();
    },

    reset() {
        this.data = {
            global: {
                width: 600,
                bgOuter: '#f1f5f9',
                bgInner: '#ffffff',
                font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                direction: 'ltr',
                arabicFont: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                arabicLineHeight: 1.8
            },
            header: {
                logo: '',
                text: 'Company Name',
                align: 'center',
                textColor: '#ffffff',
                bg: '#2563eb',
                paddingTop: 35,
                paddingBottom: 35,
                paddingLeft: 30,
                paddingRight: 30
            },
            blocks: [],
            footer: {
                text: `© ${new Date().getFullYear()} AHMOS. All rights reserved.\nProfessional Email Solutions\nwww.example.com`,
                bg: '#1e293b',
                color: '#94a3b8',
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 30,
                fontSize: 14,
                lineHeight: 1.6
            },
            images: { maxWidth: 600 },
            fixes: { outlook: true, ios: true, gmail: true }
        };
        this.save();
    }
};
