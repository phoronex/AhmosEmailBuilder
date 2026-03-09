// ============================================================
// PREVIEW v5 — Outlook-safe, fully inline, zero div-layout
// Rules enforced:
//   1. NO <div> for layout — all structure via <table><tr><td>
//   2. NO reliance on <style> for visual rendering in Outlook
//      <style> block kept ONLY for mobile @media queries
//   3. bgcolor="" attribute alongside background-color: inline
//      (legacy Outlook/Lotus Notes uses bgcolor attribute)
//   4. All text formatting (italic, bold, underline) converted
//      to inline spans by sanitizeHTML — <em>/<i> → squares in Outlook
//   5. Images: width on <img style> only (not attr), height:auto always
//      — setting width attr forces Outlook to scale to that exact px
//      — max-width:100% ensures fluid on mobile
//   6. Two-col layouts: MSO conditional comment wraps outer td,
//      inner non-MSO table for modern clients
//   7. VML button for Outlook, <a> hidden from MSO via !mso conditional
//   8. Spacer/Divider: font-size + line-height + height + mso-line-height-rule
// ============================================================

const Preview = {

    render() {
        const frame = document.getElementById('frame');
        if (!frame) return;
        const html = this.generateHTML();
        if ('srcdoc' in frame) {
            frame.srcdoc = html;
        } else {
            const blob = new Blob([html], { type: 'text/html' });
            const prev = frame.src && frame.src.startsWith('blob:') ? frame.src : null;
            frame.src  = URL.createObjectURL(blob);
            if (prev) URL.revokeObjectURL(prev);
        }
        frame.onload = () => {
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                frame.style.height = (Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) + 20) + 'px';
            } catch(e) {}
            if (window._applyDarkMode) window._applyDarkMode();
        };
    },

    // ─────────────────────────────────────────────────────────────────
    // sanitizeHTML
    // Converts semantic formatting tags → inline-style spans
    // Outlook ignores <style> entirely so <em> renders as □ squares.
    // This runs on ALL user-generated HTML content before output.
    // ─────────────────────────────────────────────────────────────────
    sanitizeHTML(html) {
        if (!html) return '';
        return html
            // ── italic ──
            // <em> with optional attributes
            .replace(/<em(\s[^>]*)?>/gi, '<span style="font-style:italic;mso-bidi-font-style:italic;">')
            .replace(/<\/em>/gi, '</span>')
            // <i> — but NOT Font Awesome icons (class contains "fa-" or "fas" or "far" etc.)
            .replace(/<i(\s[^>]*)?>/gi, function(match, attrs) {
                var a = attrs || '';
                if (/class\s*=\s*["'][^"']*\bfa[srb]?\b/i.test(a)) return match;
                return '<span style="font-style:italic;mso-bidi-font-style:italic;">';
            })
            .replace(/<\/i>/gi, '</span>')
            // ── bold ──
            .replace(/<strong(\s[^>]*)?>/gi, '<span style="font-weight:bold;mso-bidi-font-weight:bold;">')
            .replace(/<\/strong>/gi, '</span>')
            .replace(/<b(\s[^>]*)?>/gi, function(match, attrs) {
                var a = attrs || '';
                // don't convert <body> or other b-starting tags accidentally
                return '<span style="font-weight:bold;mso-bidi-font-weight:bold;">';
            })
            .replace(/<\/b>/gi, '</span>')
            // ── underline ──
            .replace(/<u(\s[^>]*)?>/gi, '<span style="text-decoration:underline;">')
            .replace(/<\/u>/gi, '</span>')
            // ── strikethrough ──
            .replace(/<s(\s[^>]*)?>/gi, '<span style="text-decoration:line-through;">')
            .replace(/<\/s>/gi, '</span>')
            // ── inline p margin — Outlook ignores <style> so we inline it ──
            // Add margin-bottom to every <p> that doesn't already have margin style
            .replace(/<p(\s[^>]*)?>/gi, function(match, attrs) {
                var a = attrs || '';
                if (/margin/i.test(a)) return match;
                return '<p' + a + ' style="margin:0 0 14px 0;">';
            });
    },

    // ─────────────────────────────────────────────────────────────────
    // borderCSS — converts block.border object to inline CSS string
    // ─────────────────────────────────────────────────────────────────
    borderCSS(border) {
        if (!border) return '';
        const { top=0, right=0, bottom=0, left=0, color='#e5e7eb', style='solid' } = border;
        if (!top && !right && !bottom && !left) return '';
        let css = '';
        if (top)    css += 'border-top:'    + top    + 'px ' + style + ' ' + color + ';';
        if (right)  css += 'border-right:'  + right  + 'px ' + style + ' ' + color + ';';
        if (bottom) css += 'border-bottom:' + bottom + 'px ' + style + ' ' + color + ';';
        if (left)   css += 'border-left:'   + left   + 'px ' + style + ' ' + color + ';';
        return css;
    },

    // ─────────────────────────────────────────────────────────────────
    // generateHTML — full email document
    // ─────────────────────────────────────────────────────────────────
    generateHTML() {
        const s     = State.get();
        const g     = s.global;
        const h     = s.header;
        const f     = s.footer;
        const isRTL = g.direction === 'rtl';
        const font  = isRTL ? g.arabicFont : g.font;

        const blocksHTML = s.blocks.map(b => this.block(b)).join('\n');

        // <style> ONLY for mobile media query — nothing visual here
        // Outlook ignores all of this; we rely solely on inline styles for desktop
        const styleBlock = [
            '<style>',
            '/* reset */',
            'body,table,td,a,p{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}',
            'table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}',
            'img{-ms-interpolation-mode:bicubic;display:block;border:0;outline:none;text-decoration:none;}',
            'a img{border:none;}',
            '/* mobile */',
            '@media screen and (max-width:600px){',
            '  .em-wrap{width:100% !important;}',
            '  .em-stack{display:block !important;width:100% !important;}',
            '  .em-scell{display:block !important;width:100% !important;padding-right:0 !important;padding-left:0 !important;margin-bottom:12px !important;}',
            '  .em-img{width:100% !important;height:auto !important;max-width:100% !important;}',
            '}',
            s.fixes && s.fixes.ios ? 'a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;}' : '',
            '</style>'
        ].join('\n');

        const outerBg  = g.bgOuter || '#f1f5f9';
        const innerBg  = g.bgInner || '#ffffff';
        const dir      = g.direction || 'ltr';
        const lang     = isRTL ? 'ar' : 'en';
        const w        = g.width || 600;
        const cAlign   = g.containerAlign || 'center';
        const cMargin  = cAlign === 'left' ? '0 auto 0 0' : cAlign === 'right' ? '0 0 0 auto' : '0 auto';

        return '<!DOCTYPE html>\n' +
'<html lang="' + lang + '" dir="' + dir + '" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n' +
'<head>\n' +
'<meta charset="UTF-8">\n' +
'<meta name="viewport" content="width=device-width,initial-scale=1.0">\n' +
'<meta http-equiv="X-UA-Compatible" content="IE=edge">\n' +
'<meta name="x-apple-disable-message-reformatting">\n' +
'<title>' + (h.text || 'Email') + '</title>\n' +
'<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->\n' +
styleBlock + '\n' +
'</head>\n' +
'<body style="margin:0;padding:0;background-color:' + outerBg + ';" bgcolor="' + outerBg + '" dir="' + dir + '">\n\n' +

'<!-- preheader -->\n' +
'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:' + outerBg + ';">&#847;&zwnj;</div>\n\n' +

'<!-- outer wrapper -->\n' +
'<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + outerBg + '" style="width:100%;background-color:' + outerBg + ';">\n' +
'<tr>\n' +
'<td align="center" valign="top" bgcolor="' + outerBg + '" style="padding:20px 0;background-color:' + outerBg + ';">\n\n' +

'<!--[if mso|IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="' + w + '" align="center"><tr><td><![endif]-->\n\n' +

'<!-- email container -->\n' +
'<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="' + w + '" align="' + cAlign + '" class="em-wrap"\n' +
'  style="width:' + w + 'px;max-width:' + w + 'px;background-color:' + innerBg + ';margin:' + cMargin + ';mso-table-lspace:0pt;mso-table-rspace:0pt;" bgcolor="' + innerBg + '">\n' +
'<tr><td style="font-size:0;line-height:0;height:0;padding:0;margin:0;border:0;mso-line-height-rule:exactly;">&shy;</td></tr>\n' +

(h.enabled !== false ? this.htmlHeader(h, font) : '') + '\n' +
blocksHTML + '\n' +
(f.enabled !== false ? this.htmlFooter(f, font, dir) : '') + '\n' +

'</table>\n\n' +
'<!--[if mso|IE]></td></tr></table><![endif]-->\n\n' +
'</td>\n</tr>\n</table>\n' +
'</body>\n</html>';
    },

    // ─────────────────────────────────────────────────────────────────
    // HEADER
    // ─────────────────────────────────────────────────────────────────
    htmlHeader(h, font) {
        const align  = h.align || 'center';
        const valign = h.verticalAlign || 'middle';
        const bg     = h.bg || '#2563eb';
        const pt = h.paddingTop    || 35;
        const pr = h.paddingRight  || 30;
        const pb = h.paddingBottom || 35;
        const pl = h.paddingLeft   || 30;

        const logoMargin = align === 'center' ? 'margin:0 auto 16px;'
                         : align === 'right'  ? 'margin:0 0 16px auto;'
                         : 'margin:0 0 16px 0;';

        const logoHtml = h.logo
            ? (() => {
                const lw = h.logoWidth  && h.logoWidth  > 0 ? h.logoWidth  : null;
                const lh = h.logoHeight && h.logoHeight > 0 ? h.logoHeight : 55;
                const wAttr  = lw ? ` width="${lw}"` : '';
                const hAttr  = lh ? ` height="${lh}"` : '';
                const wStyle = lw ? `width:${lw}px;` : 'width:auto;';
                const hStyle = lh ? `height:${lh}px;` : 'height:auto;';
                return '<img src="' + h.logo + '"' + wAttr + hAttr + ' alt="Logo" border="0" style="display:block;' + wStyle + hStyle + 'border:0;' + logoMargin + '">';
            })()
            : '';

        const titleHtml = h.text
            ? '<h1 style="margin:0;padding:0;color:' + h.textColor + ';font-weight:800;font-size:28px;font-family:' + font + ';line-height:1.25;letter-spacing:-0.5px;mso-line-height-rule:exactly;">' + this.sanitizeHTML(h.text) + '</h1>'
            : '';

        return '<tr>\n' +
'  <td align="' + align + '" valign="' + valign + '" bgcolor="' + bg + '"\n' +
'    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;text-align:' + align + ';vertical-align:' + valign + ';background-color:' + bg + ';">\n' +
'    ' + logoHtml + titleHtml + '\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // FOOTER  v5.4  — social icons + text content + per-footer direction
    // Social icons: nested table/<img> — the only structure that works in
    // Outlook, Gmail, and Apple Mail without transformation.
    // Each icon = inline SVG data-URI. btoa(unescape(encodeURIComponent))
    // safely encodes any unicode that may appear in SVG paths.
    // ─────────────────────────────────────────────────────────────────
    htmlFooter(f, font, globalDir) {
        const align  = f.align          || 'center';
        const valign = f.verticalAlign  || 'middle';
        const bg     = f.bg             || '#1e293b';
        const color  = f.color          || '#94a3b8';
        const pt = f.paddingTop    != null ? f.paddingTop    : 30;
        const pr = f.paddingRight  != null ? f.paddingRight  : 30;
        const pb = f.paddingBottom != null ? f.paddingBottom : 30;
        const pl = f.paddingLeft   != null ? f.paddingLeft   : 30;
        const fs = f.fontSize   || 14;
        const lh = f.lineHeight || 1.6;
        const dir    = f.direction      || globalDir || 'ltr';
        const sz     = Math.max(16, f.socialIconSize  || 32);
        const gap    = Math.max(0,  f.socialIconGap   || 12);
        const socPT  = f.socialPaddingTop    != null ? f.socialPaddingTop    : 0;
        const socPB  = f.socialPaddingBottom != null ? f.socialPaddingBottom : 8;

        // ── Build social icon row ─────────────────────────────────
        var socialRow = '';
        if (f.socialEnabled && Array.isArray(f.socialIcons) && f.socialIcons.length > 0) {
            var SRCS = this._socialIconSrcs();
            var half = Math.max(2, Math.floor(gap / 2));
            var rr   = f.socialIconRadius != null ? f.socialIconRadius : Math.round(sz / 6);
            var tdW  = sz + (half * 2);
            var cells = f.socialIcons.map(function(ic) {
                var src = (ic.customSrc && ic.customSrc.trim())
                    ? ic.customSrc.trim()
                    : (SRCS[ic.platform] || SRCS.email || '');
                if (!src) return '';
                var href = (ic.url && ic.url.trim()) ? ic.url.trim() : '#';
                var alt  = ic.label || ic.platform || '';
                // Each icon: td with explicit pixel width, img with both attrs+style
                // border-radius on img only (Outlook ignores it but other clients use it)
                return '<td align="center" valign="middle" width="' + tdW + '"' +
                       ' style="width:' + tdW + 'px;padding:0;font-size:0;line-height:0;mso-line-height-rule:exactly;">' +
                       '<table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center"' +
                       ' style="margin:0 ' + half + 'px;">' +
                       '<tr><td align="center" valign="middle" style="font-size:0;line-height:0;">' +
                       '<a href="' + href + '" target="_blank"' +
                       ' style="display:block;text-decoration:none;border:0;font-size:0;line-height:0;">' +
                       '<img src="' + src + '" alt="' + alt + '" width="' + sz + '" height="' + sz + '" border="0"' +
                       ' style="display:block;width:' + sz + 'px;height:' + sz + 'px;border:0;' +
                       (rr > 0 ? 'border-radius:' + rr + 'px;' : '') + '">' +
                       '</a></td></tr></table>' +
                       '</td>';
            }).filter(Boolean).join('\n');

            if (cells) {
                // Double-table pattern: outer centers, inner holds the icon row
                // Outer table: full-width, centers content
                // Inner table: just the icon cells, no extra width
                socialRow =
                    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"' +
                    ' style="width:100%;border-collapse:collapse;">' +
                    '<tr><td align="' + align + '" valign="middle"' +
                    ' style="padding:' + socPT + 'px 0 ' + socPB + 'px;font-size:0;line-height:0;text-align:' + align + ';">' +
                    '<table role="presentation" border="0" cellpadding="0" cellspacing="0"' +
                    ' align="' + align + '" style="border-collapse:collapse;display:inline-table;">' +
                    '<tr>' + cells + '</tr>' +
                    '</table>' +
                    '</td></tr></table>';
            }
        }

        // ── Text content ─────────────────────────────────────────
        var textHTML = '';
        if (f.textEnabled !== false && f.text) {
            textHTML = this.sanitizeHTML(f.text.replace(/\n/g, '<br>'));
        }

        // ── Order: social above or below text ────────────────────
        var parts = [];
        if ((f.socialPosition || 'above') === 'above') {
            if (socialRow) parts.push(socialRow);
            if (textHTML)  parts.push(textHTML);
        } else {
            if (textHTML)  parts.push(textHTML);
            if (socialRow) parts.push(socialRow);
        }
        var inner = parts.join('<br style="font-size:8px;line-height:8px;display:block;">');
        if (!inner) inner = '&nbsp;';

        return '<tr>\n' +
'  <td align="' + align + '" valign="' + valign + '" bgcolor="' + bg + '" dir="' + dir + '"\n' +
'    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;text-align:' + align + ';background-color:' + bg + ';color:' + color + ';font-size:' + fs + 'px;font-family:' + font + ';line-height:' + lh + ';mso-line-height-rule:exactly;">\n' +
'    ' + inner + '\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // Social icon SVG library — 32×32 inline data-URIs
    // ─────────────────────────────────────────────────────────────────
    _socialIconSrcs() {
        function mk(path, bg) {
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">'
                    + '<rect width="32" height="32" rx="6" fill="' + bg + '"/>'
                    + path + '</svg>';
            try { return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg))); }
            catch(e) { return ''; }
        }
        return {
            facebook:  mk('<path fill="#fff" d="M18.9 6H16c-2.2 0-3.7 1.4-3.7 3.9V12H9.5v3.2h2.8V24h3.3v-8.8h2.7l.4-3.2h-3.1v-1.7c0-.9.3-1.5 1.6-1.5h1.7V6z"/>', '#1877f2'),
            x:         mk('<path fill="#fff" d="M18.2 14.8 24 8h-1.4l-5 5.8L13.2 8H8l6.1 8.9L8 24h1.4l5.3-6.2 4.2 6.2H24l-5.8-9.2zm-1.9 2.2-.6-.9-4.9-7H13l4 5.7.6.9 5.1 7.3h-2.2l-4.2-6z"/>', '#000'),
            twitter:   mk('<path fill="#fff" d="M24 9.6a7 7 0 0 1-2 .5 3.5 3.5 0 0 0 1.5-1.9 7 7 0 0 1-2.2.8A3.5 3.5 0 0 0 15.4 12a10 10 0 0 1-7.2-3.6 3.5 3.5 0 0 0 1.1 4.6 3.5 3.5 0 0 1-1.6-.4v.04a3.5 3.5 0 0 0 2.8 3.4 3.5 3.5 0 0 1-1.6.06 3.5 3.5 0 0 0 3.3 2.4A7 7 0 0 1 8 20a10 10 0 0 0 5.4 1.6c6.4 0 10-5.3 10-10v-.5A7 7 0 0 0 24 9.6z"/>', '#1da1f2'),
            instagram: mk('<path fill="#fff" d="M16 10.7a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6zm0 8.7a3.4 3.4 0 1 1 0-6.8 3.4 3.4 0 0 1 0 6.8zm5.5-8.9a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0zM21.4 8h-10.8A4.6 4.6 0 0 0 6 12.6v10.8A4.6 4.6 0 0 0 10.6 28h10.8A4.6 4.6 0 0 0 26 23.4V12.6A4.6 4.6 0 0 0 21.4 8zm2.7 15.4a2.7 2.7 0 0 1-2.7 2.7H10.6a2.7 2.7 0 0 1-2.7-2.7V12.6a2.7 2.7 0 0 1 2.7-2.7h10.8a2.7 2.7 0 0 1 2.7 2.7v10.8z"/>', '#e1306c'),
            linkedin:  mk('<path fill="#fff" d="M11 13h-2.8v9H11v-9zm-1.4-4.4a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm12.8 4.2c-1.5 0-2.5.8-2.9 1.6h-.04V13H17v9h2.8v-4.5c0-1.2.2-2.3 1.7-2.3 1.4 0 1.4 1.3 1.4 2.4V22H26v-5c0-2.5-.5-4.2-3.3-4.2-.5 0-1.2.1-1.5.3z"/>', '#0a66c2'),
            youtube:   mk('<path fill="#fff" d="M25.8 11.2s-.3-2-1.1-2.7C23.6 7.4 22.4 7.4 21.8 7.3 19.2 7 16 7 16 7s-3.2 0-5.8.3c-.6.1-1.8.1-2.9 1.2-.8.7-1.1 2.7-1.1 2.7S6 13.4 6 15.6v2c0 2.2.2 4.4.2 4.4s.3 2 1.1 2.7c1.1 1.1 2.5 1.1 3.2 1.1C12.8 26 16 26 16 26s3.2 0 5.8-.2c.6-.1 1.8-.1 2.9-1.2.8-.8 1.1-2.7 1.1-2.7s.2-2.2.2-4.4v-2c0-2.2-.2-4.3-.2-4.3zm-11.7 9V11.8l8.5 4.2-8.5 4.2z"/>', '#ff0000'),
            tiktok:    mk('<path fill="#fff" d="M21 8.4a5.6 5.6 0 0 1-3.4-1.9V18a5 5 0 1 1-4.3-4.9v2.8a2.3 2.3 0 1 0 1.8 2.2V6h2.9a5.6 5.6 0 0 0 3 4.5V8.4z"/>', '#010101'),
            whatsapp:  mk('<path fill="#fff" d="M22.5 9.4A9.4 9.4 0 0 0 7.2 21.7L6 26l4.4-1.1a9.4 9.4 0 0 0 4.5 1.1A9.4 9.4 0 0 0 22.5 9.4zm-7.6 14.4a7.8 7.8 0 0 1-4-.1l-2.6.7.7-2.5a7.8 7.8 0 1 1 5.9 1.9zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-1.2-.6-2.9-1.8-4.1-4.3-.1-.3 0-.4.1-.5l.4-.4c.1-.2.2-.4.2-.5l-.4-1c-.1-.3-.2-.3-.4-.3h-.5c-.2.2-.8.8-.8 1.9s.8 2.2 1 2.4c1.8 2.7 4.5 3.8 5.5 4 .5.1 1 .1 1.4 0 .5-.1 1.4-.6 1.6-1.1.1-.5.1-.9 0-1l-.2-.5z"/>', '#25d366'),
            telegram:  mk('<path fill="#fff" d="M22.3 9 7.5 15a.5.5 0 0 0 0 .9l3.6 1.2 1.4 4.4c.1.4.7.5 1 .2l2-2 4 2.9c.4.3.9.1 1-.4l2.5-12.5c.1-.6-.5-1.1-1-.7z"/>', '#2ca5e0'),
            snapchat:  mk('<path fill="#fff" d="M16 7c-3.3 0-5.5 2.5-5.5 5.2v1.3l-.8.2c-.6 0-1.1-.3-1.1-.7 0-.2.2-.4.6-.6-.1-.2-.2-.5-.5-.5-.4 0-.9.5-.9 1.1 0 .9.9 1.7 2 1.9-.1.3-.1.5-.1.7 0 2.1 1.8 3.8 4.3 4.4-.2.2-.3.4-.6.5-.8.3-2.1.1-2.5.1a.9.9 0 0 0-.9.8c0 .5.5.9 1.1 1 2 .4 3.4 1.9 3.4 1.9s1.4-1.5 3.4-1.9c.7-.1 1.1-.5 1.1-1a.9.9 0 0 0-.9-.8c-.4 0-1.7.2-2.5-.1-.3-.1-.4-.3-.6-.5 2.5-.6 4.3-2.3 4.3-4.4 0-.2 0-.4-.1-.7 1.1-.2 2-1 2-1.9 0-.6-.5-1.1-.9-1.1-.3 0-.4.3-.5.5.4.2.6.4.6.6 0 .4-.5.7-1.1.7l-.8-.2V12.2C21.5 9.5 19.3 7 16 7z"/>', '#fffc00'),
            email:     mk('<path fill="#fff" d="M24 10H8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm0 2-8 5-8-5h16zm0 8H8v-6.5l8 5 8-5V20z"/>', '#4b5563'),
            website:   mk('<path fill="#fff" d="M16 6a10 10 0 1 0 0 20A10 10 0 0 0 16 6zm-1.3 2.1v3.8h-3.5A8.3 8.3 0 0 1 14.7 8.1zm2.6 0a8.3 8.3 0 0 1 3.5 3.8h-3.5V8.1zm-6.4 5.8h4.1v4.2H9.5c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1h.6zm1.6 6.2h3.8v3.8a8.3 8.3 0 0 1-3.8-3.8zm5.1 3.8v-3.8h4.2a8.3 8.3 0 0 1-4.2 3.8zm4.8-5.8h-5.1v-4.2h5.4c.2.7.3 1.4.3 2.1s-.1 1.4-.3 2.1h-.3z"/>', '#6366f1'),
            phone:     mk('<path fill="#fff" d="M20.5 21.5c-1.2 1.2-5.2-.2-8.5-3.5S8.3 12.7 9.5 11.5l1.5-1.5c.4-.4 1-.4 1.4 0l2.1 2.1c.4.4.4 1 0 1.4l-1 1c.5 1 1.3 2 2.1 2.9.8.8 1.9 1.6 2.9 2.1l1-1c.4-.4 1-.4 1.4 0l2.1 2.1c.4.4.4 1 0 1.4l-1.5 1.5z"/>', '#10b981'),
            mobile:    mk('<path fill="#fff" d="M19 6H13a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm-3 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4-4H12V9h8v12z"/>', '#6366f1'),
            location:  mk('<path fill="#fff" d="M16 6a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"/>', '#ef4444'),
            custom:    mk('<path fill="#fff" d="M16 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>', '#64748b'),
        };
    },

    // ─────────────────────────────────────────────────────────────────
    // BLOCK ROUTER
    // ─────────────────────────────────────────────────────────────────
    block(b) {
        var pre = '', post = '';
        if (b.hideInMso === true || b.hideInMso === 'mobile-only') {
            pre  = '<!--[if !mso]><!-->';
            post = '<!--<![endif]-->';
        } else if (b.hideInMso === 'desktop-only') {
            pre  = '<!--[if gte mso 9]><!-->';
            post = '<!--<![endif]-->';
        }
        var inner = this.blockInner(b);
        if (!inner) return '';
        return pre + inner + post;
    },

    blockInner(b) {
        switch (b.type) {
            case 'text':       return this.htmlText(b);
            case 'image':      return this.htmlImage(b);
            case 'two-images': return this.htmlTwoImages(b);
            case 'two-texts':  return this.htmlTwoTexts(b);
            case 'button':     return this.htmlButton(b);
            case 'table':      return this.htmlTable(b);
            case 'divider':    return this.htmlDivider(b);
            case 'spacer':     return this.htmlSpacer(b);
            default: return '';
        }
    },

    // ─────────────────────────────────────────────────────────────────
    // TEXT BLOCK
    // All styles inline. sanitizeHTML inlines p-margins + formatting.
    // bgcolor attribute for legacy clients.
    // ─────────────────────────────────────────────────────────────────
    htmlText(block) {
        const g     = State.get().global;
        const font  = g.font;
        const lh    = block.lineHeight || 1.65;
        const dir   = block.direction  || g.direction || 'ltr';
        const bg    = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        const pt    = block.paddingTop    != null ? block.paddingTop    : (block.padding != null ? block.padding : 25);
        const pr    = block.paddingRight  != null ? block.paddingRight  : (block.padding != null ? block.padding : 25);
        const pb    = block.paddingBottom != null ? block.paddingBottom : (block.padding != null ? block.padding : 25);
        const pl    = block.paddingLeft   != null ? block.paddingLeft   : (block.padding != null ? block.padding : 25);
        const bdr   = this.borderCSS(block.border);
        const align = block.align || 'left';
        const bgAttr  = bg ? ' bgcolor="' + bg + '"' : '';
        const bgStyle = bg ? 'background-color:' + bg + ';' : '';

        return '<tr>\n' +
'  <td dir="' + dir + '" align="' + align + '" valign="top"' + bgAttr + '\n' +
'    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;font-size:' + block.size + 'px;color:' + block.color + ';text-align:' + align + ';line-height:' + lh + ';font-family:' + font + ';' + bgStyle + bdr + 'mso-line-height-rule:exactly;">\n' +
'    ' + this.sanitizeHTML(block.content) + '\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // IMAGE BLOCK
    // Width via style only (not attr) so Outlook doesn't force-scale.
    // Nested table for alignment — margin:auto on <img> fails in Outlook.
    // border + padding on the alignment table's <td>.
    // ─────────────────────────────────────────────────────────────────
    htmlImage(block) {
        const maxW  = (State.get().images || {}).maxWidth || 600;
        const w     = Math.min(block.width || 1, maxW);
        const h     = block.height || 0;
        const align = block.align || 'center';
        const bdr   = this.borderCSS(block.border);
        const pt    = block.paddingTop    != null ? block.paddingTop    : 0;
        const pr    = block.paddingRight  != null ? block.paddingRight  : 0;
        const pb    = block.paddingBottom != null ? block.paddingBottom : 0;
        const pl    = block.paddingLeft   != null ? block.paddingLeft   : 0;

        const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';
        const radius = block.borderRadius ? 'border-radius:' + block.borderRadius + 'px;' : '';

        // ALWAYS emit both width="" and height="" attrs + matching style values.
        // This is the only technique that prevents stretching when pasting into
        // Gmail Compose / Outlook Compose (which strip style= but honour HTML attrs).
        const hStyle = h > 0 ? 'height:' + h + 'px;' : 'height:auto;';
        const hAttr  = h > 0 ? ' height="' + h + '"' : '';
        const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;' + hStyle + 'border:0;' + radius;
        const imgTag   = '<img src="' + block.src + '" alt="' + (block.alt || '') + '" width="' + w + '"' + hAttr + ' border="0" class="em-img" style="' + imgStyle + '">';
        const content  = block.link
            ? '<a href="' + block.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag + '</a>'
            : imgTag;

        const innerTdStyle = 'font-size:0;line-height:0;' + (pt||pr||pb||pl ? 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;' : 'padding:0;') + bdr;

        const valign = block.verticalAlign || 'top';
        return '<tr>\n' +
'  <td align="' + align + '" valign="' + valign + '" style="padding:0;font-size:0;line-height:0;">\n' +
'    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="' + align + '" style="margin:' + margin + ';">\n' +
'      <tr><td align="' + align + '" style="' + innerTdStyle + '">' + content + '</td></tr>\n' +
'    </table>\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // TWO IMAGES BLOCK
    // Problems solved vs v4:
    //   STRETCH: no width attr on <img>, width via style only
    //   BORDER:  border on outer <td> — NOT on a <div> (Outlook ignores div)
    //   GAP:     spacer <td> column (v4 already fixed this correctly)
    //   MSO:     conditional comment wraps the two-col table for Outlook
    // ─────────────────────────────────────────────────────────────────
    htmlTwoImages(block) {
        const img1 = block.images[0];
        const img2 = block.images[1];
        const gap  = typeof block.gap === 'number' ? block.gap : 20;
        const bdr  = this.borderCSS(block.border);
        const pt   = block.paddingTop    != null ? block.paddingTop    : 16;
        const pr   = block.paddingRight  != null ? block.paddingRight  : 16;
        const pb   = block.paddingBottom != null ? block.paddingBottom : 16;
        const pl   = block.paddingLeft   != null ? block.paddingLeft   : 16;

        const makeImgCell = function(img, self) {
            const w      = Math.max(1, img.width || 1);
            const h      = img.height || 0;
            const a      = img.align || 'center';
            const margin = a === 'center' ? '0 auto' : a === 'right' ? '0 0 0 auto' : '0';
            const radius = img.borderRadius ? 'border-radius:' + img.borderRadius + 'px;' : '';
            const hStyle = h > 0 ? 'height:' + h + 'px;' : 'height:auto;';
            const hAttr  = h > 0 ? ' height="' + h + '"' : '';
            const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;' + hStyle + 'border:0;' + radius;
            const imgTag   = '<img src="' + img.src + '" alt="' + (img.alt || '') + '" width="' + w + '"' + hAttr + ' border="0" class="em-img" style="' + imgStyle + '">';
            const inner    = img.link
                ? '<a href="' + img.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag + '</a>'
                : imgTag;
            // Nested alignment table — NOT a div
            return '<td valign="top" width="50%" class="em-scell" style="vertical-align:top;font-size:0;line-height:0;">\n' +
'        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="' + a + '" style="margin:' + margin + ';">\n' +
'          <tr><td align="' + a + '" style="font-size:0;line-height:0;">' + inner + '</td></tr>\n' +
'        </table>\n' +
'      </td>';
        };

        // Gap spacer column — reliable in all clients including Outlook
        const spacerTd = gap > 0
            ? '<td width="' + gap + '" style="width:' + gap + 'px;min-width:' + gap + 'px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>\n      '
            : '';

        // Outer <td> carries padding + border (NOT a <div>)
        const outerTdStyle = 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;font-size:0;line-height:0;' + bdr;

        const valignOuter = block.verticalAlign || 'top';
        return '<tr>\n' +
'  <td align="center" valign="' + valignOuter + '" style="' + outerTdStyle + '">\n' +
'    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><![endif]-->\n' +
'    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="em-stack">\n' +
'      <tr>\n' +
'        ' + makeImgCell(img1, this) + '\n' +
'      ' + spacerTd +
'        ' + makeImgCell(img2, this) + '\n' +
'      </tr>\n' +
'    </table>\n' +
'    <!--[if mso]></tr></table><![endif]-->\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // TWO TEXTS BLOCK
    // MSO conditional: duplicate content in VML-safe table for Outlook
    // ─────────────────────────────────────────────────────────────────
    htmlTwoTexts(block) {
        const g    = State.get().global;
        const font = g.font;
        const gap  = block.gap || 0;
        const c0   = block.columns[0];
        const c1   = block.columns[1];
        const outerBg = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        const bdr   = this.borderCSS(block.border);
        const opT   = block.outerPaddingTop    != null ? block.outerPaddingTop    : 16;
        const opR   = block.outerPaddingRight  != null ? block.outerPaddingRight  : 16;
        const opB   = block.outerPaddingBottom != null ? block.outerPaddingBottom : 16;
        const opL   = block.outerPaddingLeft   != null ? block.outerPaddingLeft   : 16;

        const self = this;
        const colStyle = function(c, side) {
            const lh  = c.lineHeight || 1.65;
            const dir = c.direction  || 'ltr';
            const sz  = c.size       || 15;
            const col = c.color      || '#334155';
            const bg  = (c.backgroundColor && c.backgroundColor !== 'transparent') ? 'background-color:' + c.backgroundColor + ';' : '';
            const cpt = c.paddingTop    != null ? c.paddingTop    : 12;
            const cpr = (c.paddingRight  != null ? c.paddingRight  : 12) + (side === 'left'  ? Math.round(gap/2) : 0);
            const cpb = c.paddingBottom != null ? c.paddingBottom : 12;
            const cpl = (c.paddingLeft  != null ? c.paddingLeft   : 12) + (side === 'right' ? Math.round(gap/2) : 0);
            return 'padding:' + cpt + 'px ' + cpr + 'px ' + cpb + 'px ' + cpl + 'px;font-family:' + font + ';font-size:' + sz + 'px;line-height:' + lh + ';color:' + col + ';text-align:' + c.align + ';direction:' + dir + ';vertical-align:top;mso-line-height-rule:exactly;' + bg;
        };

        const outerStyle = 'padding:' + opT + 'px ' + opR + 'px ' + opB + 'px ' + opL + 'px;font-size:0;line-height:0;' + (outerBg ? 'background-color:' + outerBg + ';' : '') + bdr;
        const outerBgAttr = outerBg ? ' bgcolor="' + outerBg + '"' : '';

        const c0html = self.sanitizeHTML(c0.content);
        const c1html = self.sanitizeHTML(c1.content);
        const cs0    = colStyle(c0, 'left');
        const cs1    = colStyle(c1, 'right');

        const ttValign = block.verticalAlign || 'top';
        return '<tr>\n' +
'  <td align="' + (block.align||'left') + '" valign="' + ttValign + '"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
// MSO version — direct td children (Outlook ignores nested tables inside conditional comments oddly)
'    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>\n' +
'    <td width="50%" valign="top" style="' + cs0 + '" dir="' + (c0.direction||'ltr') + '">' + c0html + '</td>\n' +
'    <td width="50%" valign="top" style="' + cs1 + '" dir="' + (c1.direction||'ltr') + '">' + c1html + '</td>\n' +
'    </tr></table><![endif]-->\n' +
// Non-MSO version
'    <!--[if !mso]><!-->\n' +
'    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="em-stack">\n' +
'      <tr>\n' +
'        <td width="50%" valign="top" class="em-scell" dir="' + (c0.direction||'ltr') + '" style="' + cs0 + '">' + c0html + '</td>\n' +
'        <td width="50%" valign="top" class="em-scell" dir="' + (c1.direction||'ltr') + '" style="' + cs1 + '">' + c1html + '</td>\n' +
'      </tr>\n' +
'    </table>\n' +
'    <!--<![endif]-->\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // BUTTON BLOCK
    // VML roundrect for Outlook — the only way to get a styled button
    // HTML <a> wrapped in <!--[if !mso]><!--> hidden from Outlook
    // ─────────────────────────────────────────────────────────────────
    htmlButton(block) {
        const s     = State.get();
        const font  = s.global.direction === 'rtl' ? s.global.arabicFont : s.global.font;
        const align = block.align || 'center';
        const bg    = block.backgroundColor || '#2563eb';
        const tc    = block.textColor || '#ffffff';
        const pad   = block.padding   || '14px 32px';
        const rad   = block.borderRadius != null ? block.borderRadius : 8;
        const link  = block.link || '#';
        const text  = block.text || 'Click Here';

        const vml = s.fixes && s.fixes.outlook
            ? '<!--[if mso]>\n' +
'        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"\n' +
'          href="' + link + '" style="height:46px;v-text-anchor:middle;width:200px;" arcsize="' + rad + '%"\n' +
'          stroke="f" fillcolor="' + bg + '">\n' +
'          <w:anchorlock/>\n' +
'          <center style="color:' + tc + ';font-family:' + font + ';font-size:16px;font-weight:bold;">' + text + '</center>\n' +
'        </v:roundrect>\n' +
'        <![endif]-->'
            : '';

        const htmlBtn = '<!--[if !mso]><!-->' +
'<a href="' + link + '" style="background-color:' + bg + ';color:' + tc + ';display:inline-block;font-family:' + font + ';font-size:16px;font-weight:bold;line-height:1;text-decoration:none;text-align:center;padding:' + pad + ';border-radius:' + rad + 'px;">' + text + '</a>' +
'<!--<![endif]-->';

        return '<tr>\n' +
'  <td align="' + align + '" valign="top" style="padding:20px 30px;text-align:' + align + ';">\n' +
'    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="' + align + '">\n' +
'      <tr><td align="' + align + '" bgcolor="' + bg + '" style="border-radius:' + rad + 'px;">' + vml + htmlBtn + '</td></tr>\n' +
'    </table>\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // TABLE BLOCK
    // Block-level border on the outer <td> NOT a <div>
    // Cell content run through sanitizeHTML for italic support
    // bgcolor attribute on each <td> for legacy client support
    // ─────────────────────────────────────────────────────────────────
    htmlTable(block) {
        const bdr  = this.borderCSS(block.border);
        const bw   = block.borderWidth  != null ? block.borderWidth  : 1;
        const bc   = block.borderColor  || '#e5e7eb';
        const cp   = block.cellPadding  != null ? block.cellPadding  : 15;
        const cs   = block.cellSpacing  != null ? block.cellSpacing  : 0;
        const fs   = block.fontSize     || 14;
        const lh   = block.lineHeight   || 1.6;
        const dir  = block.direction    || 'ltr';
        const aln  = block.tableAlign   || 'center';
        const pt   = block.paddingTop    != null ? block.paddingTop    : 16;
        const pr   = block.paddingRight  != null ? block.paddingRight  : 16;
        const pb   = block.paddingBottom != null ? block.paddingBottom : 16;
        const pl   = block.paddingLeft   != null ? block.paddingLeft   : 16;
        const font = State.get().global.font;

        let rows = '';
        let ci   = 0;
        for (var r = 0; r < block.rows; r++) {
            rows += '<tr>';
            for (var c = 0; c < block.cols; c++) {
                const cell = block.cells[ci] || { content: '', align: 'center', bgColor: '#ffffff' };
                const colW = Math.round(100 / block.cols);
                const cBg  = cell.bgColor || '#ffffff';
                rows += '<td width="' + colW + '%" valign="top" bgcolor="' + cBg + '" dir="' + dir + '"' +
                        ' style="padding:' + cp + 'px;border:' + bw + 'px solid ' + bc + ';background-color:' + cBg + ';' +
                        'text-align:' + cell.align + ';vertical-align:top;font-size:' + fs + 'px;font-family:' + font + ';' +
                        'line-height:' + lh + ';direction:' + dir + ';mso-line-height-rule:exactly;">' +
                        this.sanitizeHTML(cell.content) + '</td>';
                ci++;
            }
            rows += '</tr>';
        }

        const tblValign  = block.verticalAlign || 'top';
        const outerStyle = 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;' + bdr;

        if (block.wrap) {
            const ww = block.wrapWidth || 280;
            const wa = block.wrapAlign || 'left';
            return '<tr>\n' +
'  <td valign="' + tblValign + '" style="' + outerStyle + '">\n' +
'    <table role="presentation" width="' + ww + '" border="0" cellpadding="0" cellspacing="' + cs + '"\n' +
'      align="' + wa + '" style="float:' + wa + ';width:' + ww + 'px;border-collapse:collapse;">\n' +
'      ' + rows + '\n' +
'    </table>\n' +
'  </td>\n</tr>';
        }

        return '<tr>\n' +
'  <td align="' + aln + '" valign="' + tblValign + '" style="' + outerStyle + '">\n' +
'    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="' + cs + '"\n' +
'      style="border-collapse:collapse;width:100%;">\n' +
'      ' + rows + '\n' +
'    </table>\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // DIVIDER BLOCK
    // Single table — mso-line-height-rule + matching font-size/line-height/height
    // ensures Outlook renders the line at exactly the right height
    // ─────────────────────────────────────────────────────────────────
    htmlDivider(block) {
        const align  = block.align  || 'center';
        const h      = block.height || 1;
        const col    = block.color  || '#e5e7eb';
        const sty    = block.style  || 'solid';
        const w      = block.width  || '100%';
        const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';

        // mso-line-height-rule:exactly + font-size=height + line-height=height
        // — the triple lock that prevents Outlook from adding extra space around the line
        const lineTdStyle = 'border-top:' + h + 'px ' + sty + ' ' + col + ';height:' + h + 'px;font-size:' + h + 'px;line-height:' + h + 'px;mso-line-height-rule:exactly;';

        return '<tr>\n' +
'  <td style="padding:10px 20px;font-size:0;line-height:0;mso-line-height-rule:exactly;">\n' +
'    <table role="presentation" width="' + w + '" border="0" cellpadding="0" cellspacing="0" align="' + align + '" style="margin:' + margin + ';border-collapse:collapse;">\n' +
'      <tr><td style="' + lineTdStyle + '">&nbsp;</td></tr>\n' +
'    </table>\n' +
'  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // SPACER BLOCK
    // Triple-lock: font-size + line-height + height + mso-line-height-rule
    // ─────────────────────────────────────────────────────────────────
    htmlSpacer(block) {
        const h = block.height || 20;
        return '<tr>\n' +
'  <td style="font-size:' + h + 'px;line-height:' + h + 'px;height:' + h + 'px;mso-line-height-rule:exactly;">&nbsp;</td>\n</tr>';
    }

};
