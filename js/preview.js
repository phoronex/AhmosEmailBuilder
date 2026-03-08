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
'  style="width:' + w + 'px;max-width:' + w + 'px;background-color:' + innerBg + ';margin:' + cMargin + ';" bgcolor="' + innerBg + '">\n\n' +

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
    // FOOTER
    // ─────────────────────────────────────────────────────────────────
    htmlFooter(f, font, dir) {
        const align  = f.align || 'center';
        const valign = f.verticalAlign || 'middle';
        const bg     = f.bg    || '#1e293b';
        const color  = f.color || '#94a3b8';
        const pt = f.paddingTop    || 30;
        const pr = f.paddingRight  || 30;
        const pb = f.paddingBottom || 30;
        const pl = f.paddingLeft   || 30;
        const fs = f.fontSize || 14;
        const lh = f.lineHeight || 1.6;

        return '<tr>\n' +
'  <td align="' + align + '" valign="' + valign + '" bgcolor="' + bg + '" dir="' + dir + '"\n' +
'    style="padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;text-align:' + align + ';background-color:' + bg + ';color:' + color + ';font-size:' + fs + 'px;font-family:' + font + ';line-height:' + lh + ';mso-line-height-rule:exactly;">\n' +
'    ' + this.sanitizeHTML(f.text.replace(/\n/g, '<br>')) + '\n' +
'  </td>\n</tr>';
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
        const w     = Math.min(block.width || 600, maxW);
        const align = block.align || 'center';
        const bdr   = this.borderCSS(block.border);
        const pt    = block.paddingTop    != null ? block.paddingTop    : 0;
        const pr    = block.paddingRight  != null ? block.paddingRight  : 0;
        const pb    = block.paddingBottom != null ? block.paddingBottom : 0;
        const pl    = block.paddingLeft   != null ? block.paddingLeft   : 0;

        // Outer td margin for alignment
        const margin = align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0';
        // border-radius: Outlook doesn't support it but other clients do
        const radius = block.borderRadius ? 'border-radius:' + block.borderRadius + 'px;' : '';

        // style-only width — NO width attr on <img>
        // width attr causes Outlook to lock the image to that pixel size ignoring container
        const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;height:auto;border:0;' + radius;
        const imgTag   = '<img src="' + block.src + '" alt="' + (block.alt || '') + '" border="0" class="em-img" style="' + imgStyle + '">';
        const content  = block.link
            ? '<a href="' + block.link + '" style="display:block;text-decoration:none;border:0;">' + imgTag + '</a>'
            : imgTag;

        const innerTdStyle = 'font-size:0;line-height:0;' + (pt||pr||pb||pl ? 'padding:' + pt + 'px ' + pr + 'px ' + pb + 'px ' + pl + 'px;' : 'padding:0;') + bdr;

        return '<tr>\n' +
'  <td align="' + align + '" style="padding:0;font-size:0;line-height:0;">\n' +
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
            const w      = img.width || 280;
            const a      = img.align || 'center';
            const margin = a === 'center' ? '0 auto' : a === 'right' ? '0 0 0 auto' : '0';
            const radius = img.borderRadius ? 'border-radius:' + img.borderRadius + 'px;' : '';
            // style-only width — prevents Outlook from locking pixel dimensions
            const imgStyle = 'display:block;width:' + w + 'px;max-width:100%;height:auto;border:0;' + radius;
            const imgTag   = '<img src="' + img.src + '" alt="' + (img.alt || '') + '" border="0" class="em-img" style="' + imgStyle + '">';
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

        return '<tr>\n' +
'  <td align="center" valign="top" style="' + outerTdStyle + '">\n' +
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

        return '<tr>\n' +
'  <td align="' + (block.align||'left') + '" valign="top"' + outerBgAttr + ' style="' + outerStyle + '">\n' +
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
        let rows   = '';
        let ci     = 0;

        for (var r = 0; r < block.rows; r++) {
            rows += '<tr>';
            for (var c = 0; c < block.cols; c++) {
                const cell  = block.cells[ci] || { content: '', align: 'center', bgColor: '#ffffff' };
                const colW  = Math.round(100 / block.cols);
                const cBg   = cell.bgColor || '#ffffff';
                rows += '<td width="' + colW + '%" valign="top" bgcolor="' + cBg + '" style="padding:' + cp + 'px;border:' + bw + 'px solid ' + bc + ';background-color:' + cBg + ';text-align:' + cell.align + ';vertical-align:top;font-size:14px;line-height:1.6;mso-line-height-rule:exactly;">' + this.sanitizeHTML(cell.content) + '</td>';
                ci++;
            }
            rows += '</tr>';
        }

        // Outer td carries block-level border — works in Outlook, unlike <div>
        return '<tr>\n' +
'  <td style="padding:16px;' + bdr + '">\n' +
'    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="' + cs + '" style="border-collapse:collapse;width:100%;">\n' +
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
