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

    /* ® AHMOS Email Builder Pro v5.9 | © 2025 phoronex
       github.com/phoronex/AhmosEmailBuilder
       This identifier must not be removed — see LICENSE.md */
    _origin: 'AHMOS-EmailBuilder-Pro-v5.9-phoronex-2025',

    render() {
        const frame = document.getElementById('frame');
        if (!frame) return;
        const html = this.generateHTML();
        if ('srcdoc' in frame) {
            frame.srcdoc = html;
        } else {
            const blob = new Blob([html], { type: 'text/html' });
            const prev = frame.src && frame.src.startsWith('blob:') ? frame.src : null;
            frame.src = URL.createObjectURL(blob);
            if (prev) URL.revokeObjectURL(prev);
        }
        frame.onload = () => {
            try {
                const doc = frame.contentDocument || frame.contentWindow.document;
                frame.style.height = (Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight) + 20) + 'px';
            } catch (e) { }
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
            .replace(/<i(\s[^>]*)?>/gi, function (match, attrs) {
                var a = attrs || '';
                if (/class\s*=\s*["'][^"']*\bfa[srb]?\b/i.test(a)) return match;
                return '<span style="font-style:italic;mso-bidi-font-style:italic;">';
            })
            .replace(/<\/i>/gi, '</span>')
            // ── bold ──
            .replace(/<strong(\s[^>]*)?>/gi, '<span style="font-weight:bold;mso-bidi-font-weight:bold;">')
            .replace(/<\/strong>/gi, '</span>')
            .replace(/<b(\s[^>]*)?>/gi, function (match, attrs) {
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
            .replace(/<p(\s[^>]*)?>/gi, function (match, attrs) {
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
        const { top = 0, right = 0, bottom = 0, left = 0, color = '#e5e7eb', style = 'solid' } = border;
        if (!top && !right && !bottom && !left) return '';
        let css = '';
        if (top) css += 'border-top:' + top + 'px ' + style + ' ' + color + ';';
        if (right) css += 'border-right:' + right + 'px ' + style + ' ' + color + ';';
        if (bottom) css += 'border-bottom:' + bottom + 'px ' + style + ' ' + color + ';';
        if (left) css += 'border-left:' + left + 'px ' + style + ' ' + color + ';';
        return css;
    },

    // ─────────────────────────────────────────────────────────────────
    // generateHTML — full email document
    // ─────────────────────────────────────────────────────────────────
    generateHTML() {
        const s = State.get();
        const g = s.global;
        const h = s.header;
        const f = s.footer;
        const isRTL = g.direction === 'rtl';
        const font = isRTL ? g.arabicFont : g.font;

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

        const outerBg = g.bgOuter || '#f1f5f9';
        const innerBg = g.bgInner || '#ffffff';
        const dir = g.direction || 'ltr';
        const lang = isRTL ? 'ar' : 'en';
        const w = g.width || 600;
        const cAlign = g.containerAlign || 'center';
        const cMargin = cAlign === 'left' ? '0 auto 0 0' : cAlign === 'right' ? '0 0 0 auto' : '0 auto';

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
            '<!-- ​‌​ AHMOS Email Builder Pro © 2025 phoronex '
            + 'github.com/phoronex/AhmosEmailBuilder ​‌​ -->\n' +
            '<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:' + outerBg + ';">&#847;&zwnj;</div>\n\n' +

            '<!-- outer wrapper -->\n' +
            '<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="' + outerBg + '" style="width:100%;background-color:' + outerBg + ';">\n' +
            '<tr>\n' +
            '<td align="center" valign="top" bgcolor="' + outerBg + '" style="padding:20px 0;background-color:' + outerBg + ';">\n\n' +

            '<!--[if mso|IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="' + w + '" align="center"><tr><td><![endif]-->\n\n' +

            '<!-- email container -->\n' +
            '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="' + w + '" align="' + cAlign + '" class="em-wrap"\n' +
            '  style="width:' + w + 'px;max-width:' + w + 'px;background-color:' + innerBg + ';margin:' + cMargin + ';border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;" bgcolor="' + innerBg + '">\n' +
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
    // NOWRAP HELPER
    // Wraps content in an Outlook-safe nowrap table structure.
    // This is the ONLY reliable way to prevent line-breaking in Outlook —
    // white-space:nowrap on a <td> alone is ignored by MSO rendering engine.
    //
    // Usage: this.nowrapWrap(html)  → returns wrapped html if applicable
    //
    // Structure used:
    //   <table border="0" cellpadding="0" cellspacing="0"
    //     style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">
    //     <tr>
    //       <td style="white-space:nowrap !important;" nowrap>
    //         <span style="white-space:nowrap !important;">content</span>
    //       </td>
    //     </tr>
    //   </table>
    // ─────────────────────────────────────────────────────────────────
    nowrapWrap(html) {
        return '<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;">' +
            '<tr><td style="white-space:nowrap !important;" nowrap>' +
            '<span style="white-space:nowrap !important;">' + html + '</span>' +
            '</td></tr></table>';
    },

    // ─────────────────────────────────────────────────────────────────
    // layoutWrap — Outlook-safe nowrap container
    // lw = { enabled, hAlign, vAlign, dir }
    // ─────────────────────────────────────────────────────────────────
    layoutWrap(content, lw) {
        if (!lw || !lw.enabled) return content;
        var ha = lw.hAlign || 'center';
        var va = lw.vAlign || 'middle';
        var dr = lw.dir || 'ltr';
        return '<table border="0" cellpadding="0" cellspacing="0"'
            + ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:100%;">'
            + '<tr><td style="white-space:nowrap !important;text-align:' + ha + ';vertical-align:' + va + ';"'
            + ' dir="' + dr + '" nowrap>'
            + content
            + '</td></tr></table>';
    },

    // ─────────────────────────────────────────────────────────────────
    htmlHeader(h, font) {
        const align = h.align || 'center';
        const valign = h.verticalAlign || 'middle';
        const bg = h.bg || '#2563eb';
        const pt = h.paddingTop || 35;
        const pr = h.paddingRight || 30;
        const pb = h.paddingBottom || 35;
        const pl = h.paddingLeft || 30;
        const link = h.logoLink ? this.sanitizeHTML(h.logoLink) : '';
        // When text is hidden, no bottom-margin on the logo (no content below it)
        const hasText = h.textEnabled !== false && !!h.text;
        const lbm = hasText ? '16px' : '0';
        const logoMargin = align === 'center' ? 'margin:0 auto ' + lbm + ';'
            : align === 'right' ? 'margin:0 0 ' + lbm + ' auto;'
                : 'margin:0 0 ' + lbm + ' 0;';

        const logoHtml = h.logo
            ? (() => {

                const lw = h.logoWidth && h.logoWidth > 0 ? h.logoWidth : null;
                const lh = h.logoHeight && h.logoHeight > 0 ? h.logoHeight : 55;

                const wAttr = lw ? ` width="${lw}"` : '';
                const hAttr = lh ? ` height="${lh}"` : '';

                const wStyle = lw ? `width:${lw}px;` : 'width:auto;';
                const hStyle = lh ? `height:${lh}px;` : 'height:auto;';

                const img =
                    '<img src="' + this.sanitizeHTML(h.logo) + '"' +
                    wAttr + hAttr +
                    ' alt="Logo" border="0"' +
                    ' style="display:block;' +
                    wStyle +
                    hStyle +
                    'border:0;outline:none;text-decoration:none;">';

                // Wrap logo with hyperlink if link exists
                const wrapperStart = link
                    ? '<a href="' + link + '" target="_blank" rel="noopener noreferrer" style="text-decoration:none;border:0;display:inline-block;' + logoMargin + '">'
                    : '<span style="display:inline-block;' + logoMargin + '">';

                const wrapperEnd = link ? '</a>' : '</span>';

                return wrapperStart + img + wrapperEnd;

            })()
            : '';

        // textEnabled===false = hide title but keep header area (logo-only mode)
        var rawTitle = (h.textEnabled !== false && h.text)
            ? '<h1 style="margin:0;padding:0;color:' + h.textColor + ';font-weight:800;font-size:28px;font-family:' + font + ';line-height:1.25;letter-spacing:-0.5px;mso-line-height-rule:exactly;">' + this.sanitizeHTML(h.text) + '</h1>'
            : '';
        var titleHtml = rawTitle ? this.layoutWrap(rawTitle, h.lw) : '';

        return '<tr>\n' +
            '  <td align="' + align + '" valign="' + valign + '" bgcolor="' + bg + '"\n' +
            '    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;text-align:' + align + ';vertical-align:' + valign + ';background-color:' + bg + ';">\n' +
            '    ' + logoHtml + titleHtml + '\n' +
            '  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // FOOTER  v5.9  — social icons + text content + per-footer direction
    // Social icons: nested table/<img> — the only structure that works in
    // Outlook, Gmail, and Apple Mail without transformation.
    // Each icon = inline SVG data-URI. btoa(unescape(encodeURIComponent))
    // safely encodes any unicode that may appear in SVG paths.
    // ─────────────────────────────────────────────────────────────────
    htmlFooter(f, font, globalDir) {
        const align = f.align || 'center';
        const valign = f.verticalAlign || 'middle';
        const bg = f.bg || '#1e293b';
        const color = f.color || '#94a3b8';
        const pt = f.paddingTop != null ? f.paddingTop : 30;
        const pr = f.paddingRight != null ? f.paddingRight : 30;
        const pb = f.paddingBottom != null ? f.paddingBottom : 30;
        const pl = f.paddingLeft != null ? f.paddingLeft : 30;
        const fs = f.fontSize || 14;
        const lh = f.lineHeight || 1.6;
        const dir = f.direction || globalDir || 'ltr';
        const sz = Math.max(16, f.socialIconSize || 32);
        const gap = Math.max(0, f.socialIconGap || 12);
        const socPT = f.socialPaddingTop != null ? f.socialPaddingTop : 0;
        const socPB = f.socialPaddingBottom != null ? f.socialPaddingBottom : 8;
        const socAln = f.socialAlign || align;  // separate icon alignment
        const icnStyle = f.socialIconStyle || 'colored';

        // ── Build social icon row ─────────────────────────────────
        var socialRow = '';
        if (f.socialEnabled && Array.isArray(f.socialIcons) && f.socialIcons.length > 0) {
            var SRCS = this._socialIconSrcs(icnStyle);
            var half = Math.max(2, Math.floor(gap / 2));
            var rr = f.socialIconRadius != null ? f.socialIconRadius : Math.round(sz / 6);
            var tdW = sz + (half * 2);
            var cells = f.socialIcons.map(function (ic) {
                var src = (ic.customSrc && ic.customSrc.trim())
                    ? ic.customSrc.trim()
                    : (SRCS[ic.platform] || SRCS.email || '');
                if (!src) return '';
                var href = (ic.url && ic.url.trim()) ? ic.url.trim() : '#';
                var alt = ic.label || ic.platform || '';
                // Each icon: full-width table wrap (same pattern that fixes image blocks).
                // Explicit width + height on every wrapping cell so Outlook has zero room
                // to inject phantom spacing. valign="top" on all cells, never "middle".
                var iconImg = '<img src="' + src + '" alt="' + alt + '" width="' + sz + '" height="' + sz + '" border="0"' +
                    ' style="display:block;width:' + sz + 'px;height:' + sz + 'px;border:0;margin-top:0;mso-margin-top-alt:0pt;' +
                    (rr > 0 ? 'border-radius:' + rr + 'px;' : '') + '">';
                var iconLink = '<a href="' + href + '" target="_blank"' +
                    ' style="display:block;text-decoration:none;border:0;font-size:0;line-height:0;">' +
                    iconImg + '</a>';
                var iconWrap = '<table border="0" cellpadding="0" cellspacing="0"' +
                    ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:' + sz + 'px;">' +
                    '<tr><td align="center" valign="top" width="' + sz + '" height="' + sz + '"' +
                    ' style="width:' + sz + 'px;height:' + sz + 'px;vertical-align:top;font-size:0;line-height:0;mso-line-height-rule:exactly;padding:0;">' +
                    iconLink + '</td></tr></table>';
                return '<td align="center" valign="top" width="' + tdW + '" height="' + sz + '"' +
                    ' style="width:' + tdW + 'px;height:' + sz + 'px;vertical-align:top;padding:0 ' + half + 'px;' +
                    'font-size:0;line-height:0;mso-line-height-rule:exactly;">' +
                    iconWrap + '</td>';
            }).filter(Boolean).join('\n');

            if (cells) {
                // Double-table pattern: outer full-width td aligns content,
                // inner table holds the actual icon cells.
                // socAln is the icon-specific alignment (independent of text align).
                socialRow =
                    '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"' +
                    ' style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">' +
                    '<tr><td align="' + socAln + '" valign="top"' +
                    ' style="padding:' + socPT + 'px 0 ' + socPB + 'px 0;font-size:0;line-height:0;vertical-align:top;' +
                    'text-align:' + socAln + ';mso-line-height-rule:exactly;">' +
                    '<!--[if mso]><table border="0" cellpadding="0" cellspacing="0"><tr><![endif]-->' +
                    '<table role="presentation" border="0" cellpadding="0" cellspacing="0"' +
                    ' align="' + socAln + '" style="border-collapse:collapse;display:inline-table;">' +
                    '<tr>' + cells + '</tr>' +
                    '</table>' +
                    '<!--[if mso]></tr></table><![endif]-->' +
                    '</td></tr></table>';
            }
        }

        // ── Text content ─────────────────────────────────────────
        var textHTML = '';
        if (f.textEnabled !== false && f.text) {
            textHTML = this.sanitizeHTML(f.text.replace(/\n/g, '<br>'));
            textHTML = this.layoutWrap(textHTML, f.lw);
        }

        // ── Order: social above or below text ────────────────────
        var parts = [];
        if ((f.socialPosition || 'above') === 'above') {
            if (socialRow) parts.push(socialRow);
            if (textHTML) parts.push(textHTML);
        } else {
            if (textHTML) parts.push(textHTML);
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
    // Social icon lookup  — reads from ./sIcons/ folder via manifest
    //
    // HOW TO ADD NEW ICONS:
    //   1. Drop image files into ./sIcons/colored/  and  ./sIcons/white/
    //   2. Run:  python generate_sicons_manifest.py
    //   3. Reload the builder  — icons appear automatically
    // ─────────────────────────────────────────────────────────────────
    _socialIconSrcs(style) {
        const manifest = window._sIconsManifest || {};
        const variant = (style === 'white' || style === 'white-compat')
            ? 'white' : 'colored';
        const files = manifest[variant] || {};
        const base = './sIcons/' + variant + '/';
        const result = {};
        for (const [key, fname] of Object.entries(files)) {
            result[key] = base + fname;
        }
        return result;
    },


    // ─────────────────────────────────────────────────────────────────
    // BLOCK ROUTER
    // ─────────────────────────────────────────────────────────────────
    block(b) {
        var pre = '', post = '';
        if (b.hideInMso === true || b.hideInMso === 'mobile-only') {
            pre = '<!--[if !mso]><!-->';
            post = '<!--<![endif]-->';
        } else if (b.hideInMso === 'desktop-only') {
            pre = '<!--[if gte mso 9]><!-->';
            post = '<!--<![endif]-->';
        }
        var inner = this.blockInner(b);
        if (!inner) return '';
        return pre + inner + post;
    },

    blockInner(b) {
        switch (b.type) {
            case 'text': return this.htmlText(b);
            case 'image': return this.htmlImage(b);
            case 'two-images': return this.htmlTwoImages(b);
            case 'two-texts': return this.htmlTwoTexts(b);
            case 'text-image': return this.htmlTextImage(b);
            case 'text-2images': return this.htmlTextTwoImages(b);
            case 'button': return this.htmlButton(b);
            case 'table': return this.htmlTable(b);
            case 'divider': return this.htmlDivider(b);
            case 'spacer': return this.htmlSpacer(b);
            default: return '';
        }
    },

    // ─────────────────────────────────────────────────────────────────
    // TEXT BLOCK
    // All styles inline. sanitizeHTML inlines p-margins + formatting.
    // bgcolor attribute for legacy clients.
    // ─────────────────────────────────────────────────────────────────
    htmlText(block) {
        const g = State.get().global;
        const font = g.font;
        const lh = block.lineHeight || 1.65;
        const dir = block.direction || g.direction || 'ltr';
        const bg = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        const pt = block.paddingTop != null ? block.paddingTop : (block.padding != null ? block.padding : 25);
        const pr = block.paddingRight != null ? block.paddingRight : (block.padding != null ? block.padding : 25);
        const pb = block.paddingBottom != null ? block.paddingBottom : (block.padding != null ? block.padding : 25);
        const pl = block.paddingLeft != null ? block.paddingLeft : (block.padding != null ? block.padding : 25);
        const bdr = this.borderCSS(block.border);
        const align = block.align || 'left';
        const bgAttr = bg ? ' bgcolor="' + bg + '"' : '';
        const bgStyle = bg ? 'background-color:' + bg + ';' : '';

        var textContent = this.sanitizeHTML(block.content);
        textContent = this.layoutWrap(textContent, block.lw);

        return '<tr>\n' +
            '  <td dir="' + dir + '" align="' + align + '" valign="top"' + bgAttr + '\n' +
            '    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;font-size:' + block.size + 'px;color:' + block.color + ';text-align:' + align + ';line-height:' + lh + ';font-family:' + font + ';' + bgStyle + bdr + 'mso-line-height-rule:exactly;">\n' +
            '    ' + textContent + '\n' +
            '  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // IMAGE BLOCK
    // Width via style only (not attr) so Outlook doesn't force-scale.
    // Nested table for alignment — margin:auto on <img> fails in Outlook.
    // border + padding on the alignment table's <td>.
    // ─────────────────────────────────────────────────────────────────
    htmlImage(block) {
        const maxW = (State.get().images || {}).maxWidth || 600;
        const w = Math.min(block.width || 1, maxW);
        const h = block.height || 0;
        const align = block.align || 'center';
        const bdr = this.borderCSS(block.border);
        const pt = block.paddingTop != null ? block.paddingTop : 0;
        const pr = block.paddingRight != null ? block.paddingRight : 0;
        const pb = block.paddingBottom != null ? block.paddingBottom : 0;
        const pl = block.paddingLeft != null ? block.paddingLeft : 0;

        const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';
        const radius = block.borderRadius ? 'border-radius:' + block.borderRadius + 'px;' : '';

        // ALWAYS emit both width="" and height="" attrs + matching style values.
        // This is the only technique that prevents stretching when pasting into
        // Gmail Compose / Outlook Compose (which strip style= but honour HTML attrs).
        const hStyle = h > 0 ? 'height:' + h + 'px;' : 'height:auto;';
        const hAttr = h > 0 ? ' height="' + h + '"' : '';
        const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;' + hStyle + 'border:0;margin-top:0;mso-margin-top-alt:0pt;' + radius;
        const imgTag = '<img src="' + block.src + '" alt="' + (block.alt || '') + '" width="' + w + '"' + hAttr + ' border="0" class="em-img" style="' + imgStyle + '">';
        var content = block.link
            ? '<a href="' + block.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag + '</a>'
            : imgTag;
        // If layoutWrap already applied, skip double-wrap
        if (!block.lw || !block.lw.enabled) {
            content = '<table border="0" cellpadding="0" cellspacing="0"'
                + ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:100%;">'
                + '<tr><td align="' + align + '" valign="top"'
                + (h > 0 ? ' height="' + h + '"' : '')
                + ' style="vertical-align:top;font-size:0;line-height:0;mso-line-height-rule:exactly;'
                + (h > 0 ? 'height:' + h + 'px;' : '')
                + (pt || pr || pb || pl ? 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;' : 'padding:0;')
                + bdr + '">' + content + '</td></tr></table>';
        } else {
            content = this.layoutWrap(content, block.lw);
        }

        return '<tr>\n' +
            '  <td align="' + align + '" valign="top" style="padding:0;font-size:0;line-height:0;vertical-align:top;mso-line-height-rule:exactly;">\n' +
            '    ' + content + '\n' +
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
        const gap = typeof block.gap === 'number' ? block.gap : 20;
        const bdr = this.borderCSS(block.border);
        const pt = block.paddingTop != null ? block.paddingTop : 16;
        const pr = block.paddingRight != null ? block.paddingRight : 16;
        const pb = block.paddingBottom != null ? block.paddingBottom : 16;
        const pl = block.paddingLeft != null ? block.paddingLeft : 16;

        const makeImgCell = function (img, self) {
            const w = Math.max(1, img.width || 1);
            const h = img.height || 0;
            const a = img.align || 'center';
            const margin = a === 'center' ? '0 auto' : a === 'right' ? '0 0 0 auto' : '0';
            const radius = img.borderRadius ? 'border-radius:' + img.borderRadius + 'px;' : '';
            const hStyle = h > 0 ? 'height:' + h + 'px;' : 'height:auto;';
            const hAttr = h > 0 ? ' height="' + h + '"' : '';
            const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;' + hStyle + 'border:0;margin-top:0;mso-margin-top-alt:0pt;' + radius;
            const imgTag = '<img src="' + img.src + '" alt="' + (img.alt || '') + '" width="' + w + '"' + hAttr + ' border="0" class="em-img" style="' + imgStyle + '">';
            var inner = img.link
                ? '<a href="' + img.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag + '</a>'
                : imgTag;
            if (!img.lw || !img.lw.enabled) {
                inner = '<table border="0" cellpadding="0" cellspacing="0"'
                    + ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:100%;">'
                    + '<tr><td align="' + a + '" valign="top"'
                    + (h > 0 ? ' height="' + h + '"' : '')
                    + ' style="vertical-align:top;font-size:0;line-height:0;mso-line-height-rule:exactly;padding:0;'
                    + (h > 0 ? 'height:' + h + 'px;' : '')
                    + '">' + inner + '</td></tr></table>';
            } else {
                inner = self.layoutWrap(inner, img.lw);
            }
            // Nested alignment table — NOT a div
            //return '<td valign="top" width="50%" class="em-scell" style="vertical-align:top;font-size:0;line-height:0;">\n' +
            return '<td valign="top" class="em-scell" style="vertical-align:top;font-size:0;line-height:0;width:50%;">\n' +
                '        ' + inner + '\n' +
                '      </td>';

        };

        // Gap spacer column — reliable in all clients including Outlook
        /*
        const spacerTd = gap > 0
            ? '<td width="' + gap + '" style="width:' + gap + 'px;min-width:' + gap + 'px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>\n      '
            : '';
        */

        const spacerTd = gap > 0
            ? '<td width="' + gap + '" style="width:' + gap + 'px;font-size:0;line-height:0;mso-line-height-rule:exactly;">' +
            '<div style="width:' + gap + 'px;font-size:0;line-height:0;">&nbsp;</div>' +
            '</td>\n      '
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
        const g = State.get().global;
        const font = g.font;
        const gap = block.gap || 0;
        const c0 = block.columns[0];
        const c1 = block.columns[1];
        const outerBg = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        const bdr = this.borderCSS(block.border);
        const opT = block.outerPaddingTop != null ? block.outerPaddingTop : 16;
        const opR = block.outerPaddingRight != null ? block.outerPaddingRight : 16;
        const opB = block.outerPaddingBottom != null ? block.outerPaddingBottom : 16;
        const opL = block.outerPaddingLeft != null ? block.outerPaddingLeft : 16;

        // Column ratio: '50-50', '60-40', '40-60', '70-30', '30-70'
        var ratio = (block.colRatio || '50-50').split('-');
        var w0 = parseInt(ratio[0]) || 50;
        var w1 = parseInt(ratio[1]) || 50;

        const self = this;
        const colStyle = function (c, side, wPct) {
            const lh = c.lineHeight || 1.65;
            const dir = c.direction || 'ltr';
            const sz = c.size || 15;
            const col = c.color || '#334155';
            const bg = (c.backgroundColor && c.backgroundColor !== 'transparent') ? 'background-color:' + c.backgroundColor + ';' : '';
            const cpt = c.paddingTop != null ? c.paddingTop : 12;
            const cpr = (c.paddingRight != null ? c.paddingRight : 12) + (side === 'left' ? Math.round(gap / 2) : 0);
            const cpb = c.paddingBottom != null ? c.paddingBottom : 12;
            const cpl = (c.paddingLeft != null ? c.paddingLeft : 12) + (side === 'right' ? Math.round(gap / 2) : 0);
            const va = c.verticalAlign || 'top';
            return 'padding:' + cpt + 'px ' + cpr + 'px ' + cpb + 'px ' + cpl + 'px;font-family:' + font + ';font-size:' + sz + 'px;line-height:' + lh + ';color:' + col + ';text-align:' + c.align + ';direction:' + dir + ';vertical-align:' + va + ';mso-line-height-rule:exactly;' + bg;
        };

        const outerStyle = 'padding:' + opT + 'px ' + opR + 'px ' + opB + 'px ' + opL + 'px;font-size:0;line-height:0;' + (outerBg ? 'background-color:' + outerBg + ';' : '') + bdr;
        const outerBgAttr = outerBg ? ' bgcolor="' + outerBg + '"' : '';

        var c0html = self.layoutWrap(self.sanitizeHTML(c0.content), c0.lw);
        var c1html = self.layoutWrap(self.sanitizeHTML(c1.content), c1.lw);
        const cs0 = colStyle(c0, 'left', w0);
        const cs1 = colStyle(c1, 'right', w1);
        const ttValign = block.verticalAlign || 'top';

        // Wrap mode: one column floats, content flows around it
        if (block.wrap) {
            const wrapCol = block.wrapCol || 0;
            const wrapWidth = block.wrapWidth || 220;
            const wrapAlign = block.wrapAlign || 'left';
            const floatC = wrapCol === 0 ? c0 : c1;
            const floatHtml = wrapCol === 0 ? c0html : c1html;
            const floatSty = wrapCol === 0 ? cs0 : cs1;
            const flowC = wrapCol === 0 ? c1 : c0;
            const flowHtml = wrapCol === 0 ? c1html : c0html;
            const flowSty = wrapCol === 0 ? cs1 : cs0;
            return '<tr>\n' +
                '  <td align="' + (block.align || 'left') + '" valign="' + ttValign + '"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
                '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="' + wrapWidth + '"\n' +
                '      align="' + wrapAlign + '" style="float:' + wrapAlign + ';width:' + wrapWidth + 'px;">\n' +
                '      <tr><td style="' + floatSty + '" dir="' + (floatC.direction || 'ltr') + '">' + floatHtml + '</td></tr>\n' +
                '    </table>\n' +
                '    <div style="overflow:hidden;">' + flowHtml + '</div>\n' +
                '  </td>\n</tr>';
        }

        return '<tr>\n' +
            '  <td align="' + (block.align || 'left') + '" valign="' + ttValign + '"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
            '    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>\n' +
            '    <td width="' + w0 + '%" valign="' + (c0.verticalAlign || 'top') + '" style="' + cs0 + '" dir="' + (c0.direction || 'ltr') + '">' + c0html + '</td>\n' +
            '    <td width="' + w1 + '%" valign="' + (c1.verticalAlign || 'top') + '" style="' + cs1 + '" dir="' + (c1.direction || 'ltr') + '">' + c1html + '</td>\n' +
            '    </tr></table><![endif]-->\n' +
            '    <!--[if !mso]><!-->\n' +
            '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="em-stack">\n' +
            '      <tr>\n' +
            '        <td width="' + w0 + '%" valign="' + (c0.verticalAlign || 'top') + '" class="em-scell" dir="' + (c0.direction || 'ltr') + '" style="' + cs0 + '">' + c0html + '</td>\n' +
            '        <td width="' + w1 + '%" valign="' + (c1.verticalAlign || 'top') + '" class="em-scell" dir="' + (c1.direction || 'ltr') + '" style="' + cs1 + '">' + c1html + '</td>\n' +
            '      </tr>\n' +
            '    </table>\n' +
            '    <!--<![endif]-->\n' +
            '  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // TEXT + IMAGE BLOCK
    // ─────────────────────────────────────────────────────────────────
    htmlTextImage(block) {
        var g = State.get().global;
        var font = g.font;
        var orient = block.orientation || 'horizontal';
        var swapped = !!block.swapped;
        var tc = block.textCol || {};
        var ic = block.imgCol || {};
        var gap = block.gap != null ? block.gap : 20;
        var outerBg = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        var bdr = this.borderCSS(block.border);
        var opT = block.outerPaddingTop != null ? block.outerPaddingTop : 16;
        var opR = block.outerPaddingRight != null ? block.outerPaddingRight : 16;
        var opB = block.outerPaddingBottom != null ? block.outerPaddingBottom : 16;
        var opL = block.outerPaddingLeft != null ? block.outerPaddingLeft : 16;
        var outerStyle = 'padding:' + opT + 'px ' + opR + 'px ' + opB + 'px ' + opL + 'px;font-size:0;line-height:0;' + (outerBg ? 'background-color:' + outerBg + ';' : '') + bdr;
        var outerBgAttr = outerBg ? ' bgcolor="' + outerBg + '"' : '';
        var lh = tc.lineHeight || 1.65;
        var dir = tc.direction || 'ltr';
        var sz = tc.size || 15;
        var col = tc.color || '#334155';
        var tcBg = (tc.backgroundColor && tc.backgroundColor !== 'transparent') ? tc.backgroundColor : null;
        var cpt = tc.paddingTop != null ? tc.paddingTop : 12;
        var cpr = tc.paddingRight != null ? tc.paddingRight : 12;
        var cpb = tc.paddingBottom != null ? tc.paddingBottom : 12;
        var cpl = tc.paddingLeft != null ? tc.paddingLeft : 12;
        var tcStyle = 'padding:' + cpt + 'px ' + cpr + 'px ' + cpb + 'px ' + cpl + 'px;font-family:' + font + ';font-size:' + sz + 'px;line-height:' + lh + ';color:' + col + ';text-align:' + (tc.align || 'left') + ';direction:' + dir + ';vertical-align:top;mso-line-height-rule:exactly;' + (tcBg ? 'background-color:' + tcBg + ';' : '');
        var textHtml = this.layoutWrap(this.sanitizeHTML(tc.content || ''), tc.lw);
        var iw = Math.max(1, ic.width || 1);
        var ih = ic.height || 0;
        var ia = ic.align || 'center';
        var imr = ia === 'center' ? '0 auto' : ia === 'right' ? '0 0 0 auto' : '0';
        var rr = ic.borderRadius ? 'border-radius:' + ic.borderRadius + 'px;' : '';
        var hs = ih > 0 ? 'height:' + ih + 'px;' : 'height:auto;';
        var ha2 = ih > 0 ? ' height="' + ih + '"' : '';
        var imgSt = 'display:block;width:' + iw + 'px;max-width:100%;' + hs + 'border:0;margin-top:0;mso-margin-top-alt:0pt;' + rr;
        var imgTag2 = '<img src="' + (ic.src || '') + '" alt="' + (ic.alt || '') + '" width="' + iw + '"' + ha2 + ' border="0" class="em-img" style="' + imgSt + '">';
        var imgContent = ic.link ? '<a href="' + ic.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag2 + '</a>' : imgTag2;
        if (!ic.lw || !ic.lw.enabled) {
            imgContent = '<table border="0" cellpadding="0" cellspacing="0"'
                + ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:100%;">'
                + '<tr><td align="' + ia + '" valign="top"'
                + (ih > 0 ? ' height="' + ih + '"' : '')
                + ' style="vertical-align:top;font-size:0;line-height:0;mso-line-height-rule:exactly;padding:0;'
                + (ih > 0 ? 'height:' + ih + 'px;' : '')
                + '">' + imgContent + '</td></tr></table>';
        } else {
            imgContent = this.layoutWrap(imgContent, ic.lw);
        }
        var imgCellInner = imgContent;
        var icStyle = 'padding:8px;vertical-align:top;font-size:0;line-height:0;';
        if (orient === 'vertical') {
            var fst = swapped ? imgCellInner : textHtml;
            var snd = swapped ? textHtml : imgCellInner;
            var fstS = swapped ? icStyle : tcStyle;
            var sndS = swapped ? tcStyle : icStyle;
            var fstD = swapped ? ia : dir;
            var sndD = swapped ? dir : ia;
            var gapR = gap > 0 ? '<tr><td style="height:' + gap + 'px;font-size:' + gap + 'px;line-height:' + gap + 'px;mso-line-height-rule:exactly;">&nbsp;</td></tr>' : '';
            return '<tr>\n  <td align="left" valign="top"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
                '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
                '      <tr><td valign="top" dir="' + fstD + '" style="' + fstS + '">' + fst + '</td></tr>\n' +
                (gapR ? '      ' + gapR + '\n' : '') +
                '      <tr><td valign="top" dir="' + sndD + '" style="' + sndS + '">' + snd + '</td></tr>\n' +
                '    </table>\n  </td>\n</tr>';
        }
        var ratio = (block.colRatio || '50-50').split('-');
        var wA = parseInt(ratio[0]) || 50;
        var wB = parseInt(ratio[1]) || 50;
        var leftS = swapped ? icStyle : tcStyle;
        var rightS = swapped ? tcStyle : icStyle;
        var leftH = swapped ? imgCellInner : textHtml;
        var rightH = swapped ? textHtml : imgCellInner;
        var leftD = swapped ? ia : dir;
        var rightD = swapped ? dir : ia;
        var lA = swapped ? wB : wA;
        var lB = swapped ? wA : wB;
        var gapTd = gap > 0 ? '<td width="' + gap + '" style="width:' + gap + 'px;min-width:' + gap + 'px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>' : '';
        return '<tr>\n  <td align="left" valign="top"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
            '    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>\n' +
            '    <td width="' + lA + '%" valign="top" style="' + leftS + '" dir="' + leftD + '">' + leftH + '</td>\n' +
            (gap > 0 ? '    ' + gapTd + '\n' : '') +
            '    <td width="' + lB + '%" valign="top" style="' + rightS + '" dir="' + rightD + '">' + rightH + '</td>\n' +
            '    </tr></table><![endif]-->\n' +
            '    <!--[if !mso]><!-->\n' +
            '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="em-stack"><tr>\n' +
            '      <td width="' + lA + '%" valign="top" class="em-scell" dir="' + leftD + '" style="' + leftS + '">' + leftH + '</td>\n' +
            (gap > 0 ? '      ' + gapTd + '\n' : '') +
            '      <td width="' + lB + '%" valign="top" class="em-scell" dir="' + rightD + '" style="' + rightS + '">' + rightH + '</td>\n' +
            '    </tr></table>\n    <!--<![endif]-->\n  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // TEXT + 2 IMAGES BLOCK
    // Horizontal: [text col] | [img1 stacked above img2]
    // Vertical:   [text row] / [img1 | img2 side by side]
    // ─────────────────────────────────────────────────────────────────
    htmlTextTwoImages(block) {
        var g = State.get().global;
        var font = g.font;
        var orient = block.orientation || 'horizontal';
        var swapped = !!block.swapped;
        var tc = block.textCol || {};
        var im0 = (block.images && block.images[0]) || {};
        var im1 = (block.images && block.images[1]) || {};
        var gap = block.gap != null ? block.gap : 20;
        var imgGap = block.imgGap != null ? block.imgGap : 12;
        var outerBg = (block.backgroundColor && block.backgroundColor !== 'transparent') ? block.backgroundColor : null;
        var bdr = this.borderCSS(block.border);
        var opT = block.outerPaddingTop != null ? block.outerPaddingTop : 16;
        var opR = block.outerPaddingRight != null ? block.outerPaddingRight : 16;
        var opB = block.outerPaddingBottom != null ? block.outerPaddingBottom : 16;
        var opL = block.outerPaddingLeft != null ? block.outerPaddingLeft : 16;
        var outerStyle = 'padding:' + opT + 'px ' + opR + 'px ' + opB + 'px ' + opL + 'px;font-size:0;line-height:0;' + (outerBg ? 'background-color:' + outerBg + ';' : '') + bdr;
        var outerBgAttr = outerBg ? ' bgcolor="' + outerBg + '"' : '';
        var lh = tc.lineHeight || 1.65;
        var dir = tc.direction || 'ltr';
        var sz = tc.size || 15;
        var col = tc.color || '#334155';
        var tcBg = (tc.backgroundColor && tc.backgroundColor !== 'transparent') ? tc.backgroundColor : null;
        var cpt = tc.paddingTop != null ? tc.paddingTop : 12;
        var cpr = tc.paddingRight != null ? tc.paddingRight : 12;
        var cpb = tc.paddingBottom != null ? tc.paddingBottom : 12;
        var cpl = tc.paddingLeft != null ? tc.paddingLeft : 12;
        var tcStyle = 'padding:' + cpt + 'px ' + cpr + 'px ' + cpb + 'px ' + cpl + 'px;font-family:' + font + ';font-size:' + sz + 'px;line-height:' + lh + ';color:' + col + ';text-align:' + (tc.align || 'left') + ';direction:' + dir + ';vertical-align:top;mso-line-height-rule:exactly;' + (tcBg ? 'background-color:' + tcBg + ';' : '');
        var textHtml = this.layoutWrap(this.sanitizeHTML(tc.content || ''), tc.lw);
        var self2 = this;
        var makeImg2 = function (img) {
            var iw = Math.max(1, img.width || 1);
            var ih = img.height || 0;
            var ia = img.align || 'center';
            var mg = ia === 'center' ? '0 auto' : ia === 'right' ? '0 0 0 auto' : '0';
            var rr = img.borderRadius ? 'border-radius:' + img.borderRadius + 'px;' : '';
            var hs = ih > 0 ? 'height:' + ih + 'px;' : 'height:auto;';
            var ha = ih > 0 ? ' height="' + ih + '"' : '';
            var st = 'display:block;width:' + iw + 'px;max-width:100%;' + hs + 'border:0;margin-top:0;mso-margin-top-alt:0pt;' + rr;
            var tag = '<img src="' + (img.src || '') + '" alt="' + (img.alt || '') + '" width="' + iw + '"' + ha + ' border="0" class="em-img" style="' + st + '">';
            var inn = img.link ? '<a href="' + img.link + '" style="display:block;text-decoration:none;border:0;">' + tag + '</a>' : tag;
            if (!img.lw || !img.lw.enabled) {
                inn = '<table border="0" cellpadding="0" cellspacing="0"'
                    + ' style="border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0;width:100%;">'
                    + '<tr><td align="' + ia + '" valign="top"'
                    + (ih > 0 ? ' height="' + ih + '"' : '')
                    + ' style="vertical-align:top;font-size:0;line-height:0;mso-line-height-rule:exactly;padding:0;'
                    + (ih > 0 ? 'height:' + ih + 'px;' : '')
                    + '">' + inn + '</td></tr></table>';
            } else {
                inn = self2.layoutWrap(inn, img.lw);
            }
            return inn;
        };
        var img0H = makeImg2(im0);
        var img1H = makeImg2(im1);
        var igTd = imgGap > 0 ? '<td style="width:' + imgGap + 'px;min-width:' + imgGap + 'px;font-size:0;line-height:0;">&nbsp;</td>' : '';
        var igTr = imgGap > 0 ? '<tr><td style="height:' + imgGap + 'px;font-size:' + imgGap + 'px;line-height:' + imgGap + 'px;mso-line-height-rule:exactly;">&nbsp;</td></tr>' : '';
        var gapTr = gap > 0 ? '<tr><td style="height:' + gap + 'px;font-size:' + gap + 'px;line-height:' + gap + 'px;mso-line-height-rule:exactly;">&nbsp;</td></tr>' : '';
        var gapTd = gap > 0 ? '<td style="width:' + gap + 'px;min-width:' + gap + 'px;font-size:0;line-height:0;mso-line-height-rule:exactly;">&nbsp;</td>' : '';
        var icPad = 'padding:4px;vertical-align:top;font-size:0;line-height:0;';
        if (orient === 'vertical') {
            var imgRow =
                '<!--[if mso]><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>' +
                '<td width="50%" valign="top" style="' + icPad + '">' + img0H + '</td>' +
                (imgGap > 0 ? '<td style="width:' + imgGap + 'px;">&nbsp;</td>' : '') +
                '<td width="50%" valign="top" style="' + icPad + '">' + img1H + '</td>' +
                '</tr></table><![endif]-->' +
                '<!--[if !mso]><!-->' +
                '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>' +
                '<td width="50%" valign="top" class="em-scell" style="' + icPad + '">' + img0H + '</td>' +
                (imgGap > 0 ? igTd : '') +
                '<td width="50%" valign="top" class="em-scell" style="' + icPad + '">' + img1H + '</td>' +
                '</tr></table><!--<![endif]-->';
            var fst = swapped ? imgRow : textHtml;
            var snd = swapped ? textHtml : imgRow;
            var fstS = swapped ? 'vertical-align:top;font-size:0;line-height:0;' : tcStyle;
            var sndS = swapped ? tcStyle : 'vertical-align:top;font-size:0;line-height:0;';
            return '<tr>\n  <td align="left" valign="top"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
                '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">\n' +
                '      <tr><td valign="top" style="' + fstS + '">' + fst + '</td></tr>\n' +
                (gapTr ? '      ' + gapTr + '\n' : '') +
                '      <tr><td valign="top" style="' + sndS + '">' + snd + '</td></tr>\n' +
                '    </table>\n  </td>\n</tr>';
        }
        var imgColH =
            '<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">' +
            '<tr><td valign="top" style="' + icPad + '">' + img0H + '</td></tr>' +
            (igTr ? igTr : '') +
            '<tr><td valign="top" style="' + icPad + '">' + img1H + '</td></tr>' +
            '</table>';
        var ratio2 = (block.colRatio || '50-50').split('-');
        var wA = parseInt(ratio2[0]) || 50;
        var wB = parseInt(ratio2[1]) || 50;
        var leftS = swapped ? 'vertical-align:top;font-size:0;line-height:0;' : tcStyle;
        var rightS = swapped ? tcStyle : 'vertical-align:top;font-size:0;line-height:0;';
        var leftH = swapped ? imgColH : textHtml;
        var rightH = swapped ? textHtml : imgColH;
        var lA = swapped ? wB : wA;
        var lB = swapped ? wA : wB;
        return '<tr>\n  <td align="left" valign="top"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
            '    <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>\n' +
            '    <td width="' + lA + '%" valign="top" style="' + leftS + '">' + leftH + '</td>\n' +
            (gap > 0 ? '    ' + gapTd + '\n' : '') +
            '    <td width="' + lB + '%" valign="top" style="' + rightS + '">' + rightH + '</td>\n' +
            '    </tr></table><![endif]-->\n' +
            '    <!--[if !mso]><!-->\n' +
            '    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="em-stack"><tr>\n' +
            '      <td width="' + lA + '%" valign="top" class="em-scell" style="' + leftS + '">' + leftH + '</td>\n' +
            (gap > 0 ? '      ' + gapTd + '\n' : '') +
            '      <td width="' + lB + '%" valign="top" class="em-scell" style="' + rightS + '">' + rightH + '</td>\n' +
            '    </tr></table>\n    <!--<![endif]-->\n  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // BUTTON BLOCK
    // VML roundrect for Outlook — the only way to get a styled button
    // HTML <a> wrapped in <!--[if !mso]><!--> hidden from Outlook
    // ─────────────────────────────────────────────────────────────────
    htmlButton(block) {
        const s = State.get();
        const font = s.global.direction === 'rtl' ? s.global.arabicFont : s.global.font;
        const align = block.align || 'center';
        const bg = block.backgroundColor || '#2563eb';
        const tc = block.textColor || '#ffffff';
        const pad = block.padding || '14px 32px';
        const rad = block.borderRadius != null ? block.borderRadius : 8;
        const link = block.link || '#';
        const text = block.text || 'Click Here';

        // Estimate VML button width from padding + text length
        const padParts = (block.padding || '14px 32px').split(' ');
        const hPadPx = parseInt(padParts.length >= 2 ? padParts[1] : padParts[0]) || 32;
        const vmlH = parseInt(padParts[0]) * 2 + 24;
        const vmlW = Math.max(120, text.length * 9 + hPadPx * 2);
        const vml = s.fixes && s.fixes.outlook
            ? '<!--[if mso]>\n' +
            '        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"\n' +
            '          href="' + link + '" style="height:' + vmlH + 'px;v-text-anchor:middle;width:' + vmlW + 'px;" arcsize="' + Math.round(rad * 100 / (vmlH / 2)) + '%"\n' +
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
        const bdr = this.borderCSS(block.border);
        const bw = block.borderWidth != null ? block.borderWidth : 1;
        const bc = block.borderColor || '#e5e7eb';
        const cp = block.cellPadding != null ? block.cellPadding : 15;
        const cs = block.cellSpacing != null ? block.cellSpacing : 0;
        const fs = block.fontSize || 14;
        const lh = block.lineHeight || 1.6;
        const dir = block.direction || 'ltr';
        const aln = block.tableAlign || 'center';
        const pt = block.paddingTop != null ? block.paddingTop : 16;
        const pr = block.paddingRight != null ? block.paddingRight : 16;
        const pb = block.paddingBottom != null ? block.paddingBottom : 16;
        const pl = block.paddingLeft != null ? block.paddingLeft : 16;
        const font = State.get().global.font;

        let rows = '';
        let ci = 0;
        for (var r = 0; r < block.rows; r++) {
            rows += '<tr>';
            for (var c = 0; c < block.cols; c++) {
                const cell = block.cells[ci] || { content: '', align: 'center', bgColor: '#ffffff' };
                const colW = Math.round(100 / block.cols);
                const cBg = cell.bgColor || '#ffffff';
                rows += '<td width="' + colW + '%" valign="top" bgcolor="' + cBg + '" dir="' + dir + '"' +
                    ' style="padding:' + cp + 'px;border:' + bw + 'px solid ' + bc + ';background-color:' + cBg + ';' +
                    'text-align:' + cell.align + ';vertical-align:top;font-size:' + fs + 'px;font-family:' + font + ';' +
                    'line-height:' + lh + ';direction:' + dir + ';mso-line-height-rule:exactly;">' +
                    this.sanitizeHTML(cell.content) + '</td>';
                ci++;
            }
            rows += '</tr>';
        }

        const tblValign = block.verticalAlign || 'top';
        const outerStyle = 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;' + bdr;
        var _tblLW = (t) => this.layoutWrap(t, block.lw);

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

        var _inner = '<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="' + cs + '" style="border-collapse:collapse;width:100%;">' + rows + '</table>';
        return '<tr>\n' +
            '  <td align="' + aln + '" valign="' + tblValign + '" style="' + outerStyle + '">\n    ' + _tblLW(_inner) + '\n  </td>\n</tr>';
    },

    // ─────────────────────────────────────────────────────────────────
    // DIVIDER BLOCK
    // Single table — mso-line-height-rule + matching font-size/line-height/height
    // ensures Outlook renders the line at exactly the right height
    // ─────────────────────────────────────────────────────────────────
    htmlDivider(block) {
        const align = block.align || 'center';
        const h = block.height || 1;
        const col = block.color || '#e5e7eb';
        const sty = block.style || 'solid';
        const w = block.width || '100%';
        const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';
        const bdr = this.borderCSS(block.border);

        // mso-line-height-rule:exactly + font-size=height + line-height=height
        // — the triple lock that prevents Outlook from adding extra space around the line
        const lineTdStyle = 'border-top:' + h + 'px ' + sty + ' ' + col + ';height:' + h + 'px;font-size:' + h + 'px;line-height:' + h + 'px;mso-line-height-rule:exactly;';

        return '<tr>\n' +
            '  <td style="padding:10px 20px;font-size:0;line-height:0;mso-line-height-rule:exactly;' + bdr + '">\n' +
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
        const bdr = this.borderCSS(block.border);
        return '<tr>\n' +
            '  <td style="font-size:' + h + 'px;line-height:' + h + 'px;height:' + h + 'px;mso-line-height-rule:exactly;' + bdr + '">&nbsp;</td>\n</tr>';
    }

};
