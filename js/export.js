// ============================================================
// EXPORT
// ============================================================

const Export = {
    save() {
        const payload = {
            version: '4.0',
            savedAt: new Date().toISOString(),
            by: 'AHMOS Email Builder Pro',
            state: State.get()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `email-template-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        Utils.showToast('Template saved!', 'success');
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
                    State.data = data.state;
                    State.save();
                    UI.rebuildAll();
                    Preview.render();
                    Utils.showToast('Template loaded!', 'success');
                } else {
                    Utils.showToast('Invalid template file', 'error');
                }
            } catch (err) {
                Utils.showToast('Error loading file', 'error');
            }
        };
        reader.readAsText(file);
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
