// ============================================================
// UTILS
// ============================================================

const Utils = {
    generateId() {
        return 'b' + Date.now() + Math.random().toString(36).substr(2, 6);
    },

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const icon = document.getElementById('toast-icon');
        const text = document.getElementById('toast-text');
        if (!toast) return;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.className = type;
        icon.className = icons[type] || icons.info;
        text.textContent = message;
        toast.classList.add('show');

        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
    },

    updateSaveBadge(show) {
        const badge = document.getElementById('save-badge');
        if (badge) badge.style.display = show ? 'flex' : 'none';
    },

    isValidHex(val) {
        return /^#[0-9A-Fa-f]{6}$/.test(val);
    },

    toHex(val) {
        if (!val) return '#000000';
        if (val.startsWith('#')) return val;
        return '#' + val;
    },

    updateCopyrightYear() {
        const startYear = 2025;
        const thisYear  = new Date().getFullYear();
        const text      = thisYear > startYear ? `${startYear} – ${thisYear}` : String(startYear);
        // support both id formats
        const el1 = document.getElementById('copyright-year');
        const el2 = document.getElementById('copyright-year-range');
        if (el1) el1.textContent = thisYear;
        if (el2) el2.textContent = text;
    },

    handleImageUpload(callback) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => callback(e.target.result);
            reader.readAsDataURL(file);
        };
        input.click();
    },

    // Sync color picker + hex text input
    setupColorSync(colorId, hexId, onChange) {
        const colorEl = document.getElementById(colorId);
        const hexEl = document.getElementById(hexId);
        if (!colorEl || !hexEl) return;

        colorEl.addEventListener('input', function () {
            hexEl.value = this.value;
            // update swatch preview
            const swatch = colorEl.closest('.color-swatch');
            if (swatch) {
                const preview = swatch.querySelector('.color-swatch-preview');
                if (preview) preview.style.background = this.value;
            }
            if (onChange) onChange(this.value);
        });

        hexEl.addEventListener('input', function () {
            let v = this.value.trim();
            if (!v.startsWith('#')) v = '#' + v;
            if (Utils.isValidHex(v)) {
                colorEl.value = v;
                const swatch = colorEl.closest('.color-swatch');
                if (swatch) {
                    const preview = swatch.querySelector('.color-swatch-preview');
                    if (preview) preview.style.background = v;
                }
                if (onChange) onChange(v);
            }
        });
    },

    // Build a color row HTML
    colorRowHTML(label, colorId, hexId, defaultVal) {
        const val = defaultVal || '#000000';
        return `
            <div class="ctrl">
                <label>${label}</label>
                <div class="color-row">
                    <div class="color-swatch">
                        <div class="color-swatch-preview" style="background:${val};"></div>
                        <input type="color" id="${colorId}" value="${val}">
                    </div>
                    <input type="text" id="${hexId}" value="${val}" maxlength="7" style="font-family:monospace; font-size:12px;">
                </div>
            </div>
        `;
    },

    // Build range HTML
    rangeHTML(label, id, min, max, val, suffix = 'px') {
        return `
            <div class="ctrl">
                <label>${label}</label>
                <div class="range-wrap">
                    <input type="range" id="${id}" min="${min}" max="${max}" value="${val}">
                    <span class="range-val" id="${id}-val">${val}${suffix}</span>
                </div>
            </div>
        `;
    },

    setupRange(id, suffix, onChange) {
        const el = document.getElementById(id);
        const valEl = document.getElementById(id + '-val');
        if (!el) return;
        el.addEventListener('input', function () {
            if (valEl) valEl.textContent = this.value + suffix;
            if (onChange) onChange(parseInt(this.value));
        });
    }
};
