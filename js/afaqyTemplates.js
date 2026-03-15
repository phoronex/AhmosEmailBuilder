// ============================================================
// AFAQY BRANDED TEMPLATES
// ============================================================
// Brand:   AFAQY — Fleet Management & IoT Solutions
// Site:    https://www.afaqy.com
// Colors:  Primary #0a3d6b (navy), Accent #00b4d8 (cyan),
//          Dark #05203a, Light #f0f7ff, Text #1e3a5f
// Logo:    https://cdn.prod.website-files.com/64934b1b5b168f3686f8521b/64aeaf18b0e4652c6f622cf2_afaqy-logo.svg
//
// HOW TO REGISTER IN index.html:
//   1. Add a <script> tag AFTER templates.js:
//        <script src="afaqyTemplates.js"></script>
//   2. In templates.js (or main.js), after window.emailTemplates is defined,
//      merge with:
//        Object.assign(window.emailTemplates, window.afaqyTemplates);
//      OR add this one-liner at the bottom of afaqyTemplates.js (already done below).
// ============================================================

const AfaqyTemplates = {

    // ─────────────────────────────────────────────────────────────────
    // AFAQY — ENGLISH
    // A product announcement / company introduction email
    // showcasing AFAQY's fleet & IoT solutions
    // ─────────────────────────────────────────────────────────────────
   
    // ─────────────────────────────────────────────────────────────────
    // AFAQY — ARABIC (RTL)
    // نفس المحتوى باللغة العربية مع تخطيط RTL كامل
    // ─────────────────────────────────────────────────────────────────
    
};

// ── AUTO-MERGE into window.emailTemplates ─────────────────────────
// This runs after templates.js has already set window.emailTemplates.
// If templates.js hasn't run yet, we set a flag and let main.js pick it up.
if (window.emailTemplates) {
    Object.assign(window.emailTemplates, AfaqyTemplates);
} else {
    window.afaqyTemplates = AfaqyTemplates;
}
