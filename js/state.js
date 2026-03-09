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
            arabicLineHeight: 1.8,
            containerAlign: 'center'
        },
        header: {
            enabled: true,
            logo: '',
            logoWidth: 0,
            logoHeight: 55,
            text: 'Company Name',
            align: 'center',
            verticalAlign: 'middle',
            textColor: '#ffffff',
            bg: '#2563eb',
            paddingTop: 35,
            paddingBottom: 35,
            paddingLeft: 30,
            paddingRight: 30
        },
        blocks: [],
        footer: {
            enabled: true,
            text: `© 2025${new Date().getFullYear() > 2025 ? ' – ' + new Date().getFullYear() : ' '} AHMOS. All rights reserved.\nProfessional Email Solutions\n<a href="https://phoronex.github.io/AhmosEmailBuilder/" target="_blank" style="color: #0066cc; text-decoration: underline;">Try Now</a> | <a href="mailto:phoronex@yahoo.com" target="_blank" style="color: #0066cc; text-decoration: underline;">Contact Me</a>`,
            bg: '#1e293b',
            color: '#94a3b8',
            align: 'center',
            verticalAlign: 'middle',
            paddingTop: 30,
            paddingBottom: 30,
            paddingLeft: 30,
            paddingRight: 30,
            fontSize: 14,
            lineHeight: 1.6,
            direction: 'ltr',
            textEnabled: true,
            socialEnabled: false,
            socialIcons: [],
            socialIconSize: 32,
            socialIconGap: 12,
            socialIconRadius: 5,
            socialPaddingTop: 0,
            socialPaddingBottom: 8,
            socialPosition: 'above',
            socialPaddingTop: 0,
            socialPaddingBottom: 8
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
            // Strip _meta before persisting — _meta is transient UI context (Save dialog pre-fill)
            // It should not appear in the saved state or exported JSON
            const clean = Object.assign({}, this.data);
            delete clean._meta;
            localStorage.setItem('ebp4_state', JSON.stringify(clean));
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
                    // Restore _meta from its own storage key (written by Save dialog)
                    try {
                        const metaRaw = localStorage.getItem('ebp4_meta');
                        if (metaRaw) this.data._meta = JSON.parse(metaRaw);
                    } catch(e) {}
                    // If footer still has the old default text (www.example.com), replace it entirely
                    const ft = this.data.footer.text || '';
                    if (ft.includes('www.example.com') || (!ft.includes('phoronex') && !ft.includes('Try Now'))) {
                        const yr = new Date().getFullYear();
                        const range = yr > 2025 ? `2025 – ${yr}` : '2025';
                        this.data.footer.text = `© ${range}&nbsp;AHMOS. All rights reserved.\nProfessional Email Solutions\n<a href="https://phoronex.github.io/AhmosEmailBuilder/" target="_blank" style="color: #0066cc; text-decoration: underline;">Try Now</a> | <a href="mailto:phoronex@yahoo.com" target="_blank" style="color: #0066cc; text-decoration: underline;">Contact Me</a>`;
                    } else {
                        // Just refresh the year range in existing text
                        const yr = new Date().getFullYear();
                        const range = yr > 2025 ? `2025 – ${yr}` : '2025';
                        this.data.footer.text = this.data.footer.text.replace(/© [\d –]+/, `© ${range}`);
                    }
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
                logoWidth: 0,
                logoHeight: 55,
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
                text: `© 2025${new Date().getFullYear() > 2025 ? ' – ' + new Date().getFullYear() : ' '} AHMOS. All rights reserved.\nProfessional Email Solutions\n<a href="https://phoronex.github.io/AhmosEmailBuilder/" target="_blank" style="color: #0066cc; text-decoration: underline;">Try Now</a> | <a href="mailto:phoronex@yahoo.com" target="_blank" style="color: #0066cc; text-decoration: underline;">Contact Me</a>`,
                bg: '#1e293b',
                color: '#94a3b8',
                paddingTop: 30,
                paddingBottom: 30,
                paddingLeft: 30,
                paddingRight: 30,
                fontSize: 14,
                lineHeight: 1.6,
                direction: 'ltr',
                textEnabled: true,
                socialEnabled: false,
                socialIcons: [],
                socialIconSize: 32,
                socialIconGap: 12,
                socialPosition: 'above',
                socialPaddingTop: 0,
                socialPaddingBottom: 8
            },
            images: { maxWidth: 600 },
            fixes: { outlook: true, ios: true, gmail: true }
        };
        this.save();
    }
};
