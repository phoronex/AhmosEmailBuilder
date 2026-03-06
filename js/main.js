// ============================================================
// MAIN
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Copyright year
    Utils.updateCopyrightYear();

    // Load saved state
    const restored = State.load();
    if (restored) {
        Utils.showToast('Session restored', 'info');
    }

    // Initialize UI
    UI.init();

    // Render blocks
    Blocks.render();

    // Render preview
    Preview.render();

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const ctrl = e.ctrlKey || e.metaKey;
        const active = document.activeElement;
        const isInput = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT';

        if (ctrl && e.key === 's') { e.preventDefault(); Export.save(); return; }
        if (ctrl && e.key === 'e') { e.preventDefault(); Export.download(); return; }
        if (ctrl && e.shiftKey && e.key === 'V') { e.preventDefault(); Export.copyVisual(); return; }

        if (!isInput) {
            if (ctrl && e.key === 't') { e.preventDefault(); Blocks.addBlock('text'); }
            if (ctrl && e.key === 'i') { e.preventDefault(); Blocks.addBlock('image'); }
            if (ctrl && e.key === 'b') { e.preventDefault(); Blocks.addBlock('button'); }
        }
    });

    // Welcome
    setTimeout(() => Utils.showToast('Email Builder Pro v4 Ready ✓', 'success'), 300);
});
