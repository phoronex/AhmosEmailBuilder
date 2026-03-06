// ============================================================
// PREVIEW — 100% Inline CSS Email Generator
// ============================================================

const Preview = {
    render() {
        const frame = document.getElementById('frame');
        if (!frame) return;

        const html = this.generateHTML();
        const doc = frame.contentDocument || frame.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        // Auto-resize iframe
        setTimeout(() => {
            try {
                const h = Math.max(
                    doc.body.scrollHeight,
                    doc.documentElement.scrollHeight
                );
                frame.style.height = (h + 20) + 'px';
            } catch(e) {}
            // Re-apply dark mode if active
            if (window._applyDarkMode) window._applyDarkMode();
        }, 150);
    },

    // ─────────────────────────────────────────────
    // FULL EMAIL HTML
    // ─────────────────────────────────────────────
    generateHTML() {
        const s = State.get();
        const g = s.global;
        const h = s.header;
        const f = s.footer;
        const isRTL = g.direction === 'rtl';
        const font = isRTL ? g.arabicFont : g.font;

        const blocksHTML = s.blocks.map(b => this.block(b)).join('\n');

        return `<!DOCTYPE html>
<html lang="${isRTL ? 'ar' : 'en'}" dir="${g.direction}" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<title>${h.text}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
* { margin:0; padding:0; }
body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
img { -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }
a img { border:none; }
p { margin:0 0 14px 0; }
p:last-child { margin-bottom:0; }
@media screen and (max-width:600px) {
  .email-wrap { width:100% !important; }
  .stack { display:block !important; width:100% !important; }
  .stack-cell { display:block !important; width:100% !important; padding:0 !important; margin-bottom:12px; }
  .mob-pad { padding:16px !important; }
  table[class="resp-table"] { width:100% !important; }
}
${s.fixes?.ios ? 'a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;}' : ''}
</style>
</head>
<body style="margin:0;padding:0;${g.bgOuter && g.bgOuter !== 'transparent' ? `background-color:${g.bgOuter};` : ''}font-family:${font};direction:${g.direction};" dir="${g.direction}" ${g.bgOuter && g.bgOuter !== 'transparent' ? `bgcolor="${g.bgOuter}"` : ''}>

<!-- Preheader spacer -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${g.bgOuter};">&#847;</div>

<!-- Full-width outer wrapper table — carries the outer background color in all clients -->
<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" ${g.bgOuter && g.bgOuter !== 'transparent' ? `bgcolor="${g.bgOuter}"` : ''} style="width:100%;${g.bgOuter && g.bgOuter !== 'transparent' ? `background-color:${g.bgOuter};` : ''}border-collapse:collapse;">
  <tr>
    <td align="center" valign="top" ${g.bgOuter && g.bgOuter !== 'transparent' ? `bgcolor="${g.bgOuter}"` : ''} style="${g.bgOuter && g.bgOuter !== 'transparent' ? `background-color:${g.bgOuter};` : ''}padding:20px 0;">

      <!--[if mso|IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${g.width}"><tr><td><![endif]-->

      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${g.width}" align="center" class="email-wrap" style="width:${g.width}px;max-width:${g.width}px;background-color:${g.bgInner};" bgcolor="${g.bgInner}">

    <!-- HEADER -->
    <tr>
      <td style="padding:${h.paddingTop}px ${h.paddingRight}px ${h.paddingBottom}px ${h.paddingLeft}px;text-align:${h.align};background-color:${h.bg};" bgcolor="${h.bg}">
        ${h.logo ? `<img src="${h.logo}" height="55" alt="Logo" style="display:block;${h.align === 'center' ? 'margin:0 auto 16px;' : h.align === 'right' ? 'margin:0 0 16px auto;' : 'margin:0 0 16px 0;'}border:0;">` : ''}
        ${h.text ? `<h1 style="margin:0;color:${h.textColor};font-weight:800;font-size:28px;font-family:${font};line-height:1.2;letter-spacing:-0.5px;">${h.text}</h1>` : ''}
      </td>
    </tr>

    <!-- BLOCKS -->
    ${blocksHTML}

    <!-- FOOTER -->
    <tr>
      <td dir="${g.direction}" style="padding:${f.paddingTop}px ${f.paddingRight}px ${f.paddingBottom}px ${f.paddingLeft}px;text-align:center;background-color:${f.bg};color:${f.color};font-size:${f.fontSize}px;font-family:${font};line-height:${f.lineHeight};" bgcolor="${f.bg}">
        ${f.text.replace(/\n/g, '<br>')}
      </td>
    </tr>

  </table>

      <!--[if mso|IE]></td></tr></table><![endif]-->

    </td>
  </tr>
</table>
</body>
</html>`;
    },

    // ─────────────────────────────────────────────
    // BLOCK ROUTER
    // ─────────────────────────────────────────────
    block(block) {
        // MSO/Outlook hide wrappers
        let pre = '', post = '';
        if (block.hideInMso === true) {
            pre = '<!--[if !mso]><!-->';
            post = '<!--<![endif]-->';
        } else if (block.hideInMso === 'mobile-only') {
            pre = '<!--[if !mso]><!-->';
            post = '<!--<![endif]-->';
        } else if (block.hideInMso === 'desktop-only') {
            pre = '<!--[if gte mso 9]><!-->';
            post = '<!--<![endif]-->';
        }

        const inner = this.blockInner(block);
        if (!inner) return '';
        return `${pre}${inner}${post}`;
    },

    blockInner(block) {
        switch (block.type) {
            case 'text':        return this.htmlText(block);
            case 'image':       return this.htmlImage(block);
            case 'two-images':  return this.htmlTwoImages(block);
            case 'two-texts':   return this.htmlTwoTexts(block);
            case 'button':      return this.htmlButton(block);
            case 'table':       return this.htmlTable(block);
            case 'divider':     return this.htmlDivider(block);
            case 'spacer':      return this.htmlSpacer(block);
            default: return '';
        }
    },

    // ─────────────────────────────────────────────
    // TEXT BLOCK
    // ─────────────────────────────────────────────
    htmlText(block) {
        const g    = State.get().global;
        const font = g.font;
        const lh   = block.lineHeight ?? 1.65;
        const dir  = block.direction  || g.direction || 'ltr';
        const ws   = block.whiteSpace || 'normal';
        const bg   = (block.backgroundColor && block.backgroundColor !== 'transparent') ? `background-color:${block.backgroundColor};` : '';
        const pt   = block.paddingTop    ?? block.padding ?? 25;
        const pr   = block.paddingRight  ?? block.padding ?? 25;
        const pb   = block.paddingBottom ?? block.padding ?? 25;
        const pl   = block.paddingLeft   ?? block.padding ?? 25;
        const bdr  = this.borderCSS(block.border);
        return `<tr>
      <td dir="${dir}" style="padding:${pt}px ${pr}px ${pb}px ${pl}px;font-size:${block.size}px;color:${block.color};text-align:${block.align};line-height:${lh};font-family:${font};${bg}white-space:${ws};${bdr}">
        ${block.content}
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // IMAGE BLOCK
    // ─────────────────────────────────────────────
    htmlImage(block) {
        const maxW = State.get().images.maxWidth || 600;
        const w = Math.min(block.width, maxW);
        const imgStyle = `display:block;max-width:100%;height:auto;border:0;${block.borderRadius ? `border-radius:${block.borderRadius}px;` : ''}`;
        const imgTag = `<img src="${block.src}" width="${w}" alt="${block.alt || ''}" style="${imgStyle}">`;
        const content = block.link ? `<a href="${block.link}" style="display:block;text-decoration:none;">${imgTag}</a>` : imgTag;
        const alignStyle = block.align === 'center' ? 'margin:0 auto;' : block.align === 'right' ? 'margin-left:auto;' : '';
        return `<tr>
      <td style="padding:0;line-height:0;font-size:0;text-align:${block.align};">
        <div style="${alignStyle}display:block;width:${w}px;max-width:100%;">${content}</div>
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // TWO IMAGES BLOCK
    // ─────────────────────────────────────────────
    htmlTwoImages(block) {
        const [img1, img2] = block.images;
        const gap = block.gap || 0;

        const makeImg = (img) => {
            const tag = `<img src="${img.src}" width="${img.width}" alt="${img.alt || ''}" style="display:block;max-width:100%;height:auto;border:0;${img.borderRadius ? `border-radius:${img.borderRadius}px;` : ''}">`;
            return img.link ? `<a href="${img.link}" style="display:block;">${tag}</a>` : tag;
        };

        return `<tr>
      <td style="padding:16px;">
        <!--[if mso]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td width="50%" align="center" style="padding-right:${Math.round(gap/2)}px;">
        <![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="stack">
          <tr>
            <td width="50%" align="center" valign="top" class="stack-cell" style="padding-right:${Math.round(gap/2)}px;">
              ${makeImg(img1)}
            </td>
            <td width="50%" align="center" valign="top" class="stack-cell" style="padding-left:${Math.round(gap/2)}px;">
              ${makeImg(img2)}
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // TWO TEXTS BLOCK
    // ─────────────────────────────────────────────
    htmlTwoTexts(block) {
        const g    = State.get().global;
        const font = g.font;
        const gap  = block.gap || 0;
        const [c0, c1] = block.columns;
        const outerBg  = (block.backgroundColor && block.backgroundColor !== 'transparent') ? `background-color:${block.backgroundColor};` : '';
        const bdr      = this.borderCSS(block.border);
        const opT = block.outerPaddingTop    ?? 16;
        const opR = block.outerPaddingRight  ?? 16;
        const opB = block.outerPaddingBottom ?? 16;
        const opL = block.outerPaddingLeft   ?? 16;

        const colStyle = (c, side) => {
            const lh  = c.lineHeight ?? 1.65;
            const dir = c.direction  || 'ltr';
            const sz  = c.size       || 15;
            const col = c.color      || '#334155';
            const bg  = (c.backgroundColor && c.backgroundColor !== 'transparent') ? `background-color:${c.backgroundColor};` : '';
            const pt  = c.paddingTop    ?? 12;
            const pr  = (c.paddingRight  ?? 12) + (side === 'left'  ? Math.round(gap/2) : 0);
            const pb  = c.paddingBottom ?? 12;
            const pl  = (c.paddingLeft   ?? 12) + (side === 'right' ? Math.round(gap/2) : 0);
            return `padding:${pt}px ${pr}px ${pb}px ${pl}px;font-family:${font};font-size:${sz}px;line-height:${lh};color:${col};text-align:${c.align};direction:${dir};${bg}`;
        };

        return `<tr>
      <td style="padding:${opT}px ${opR}px ${opB}px ${opL}px;${outerBg}${bdr}">
        <!--[if mso]><table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td width="50%" valign="top"><![endif]-->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="stack">
          <tr>
            <td width="50%" valign="top" class="stack-cell" dir="${c0.direction||'ltr'}" style="${colStyle(c0,'left')}">
              ${c0.content}
            </td>
            <td width="50%" valign="top" class="stack-cell" dir="${c1.direction||'ltr'}" style="${colStyle(c1,'right')}">
              ${c1.content}
            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // BUTTON BLOCK
    // ─────────────────────────────────────────────
    htmlButton(block) {
        const s = State.get();
        const font = s.global.direction === 'rtl' ? s.global.arabicFont : s.global.font;
        const alignMap = { left: 'left', center: 'center', right: 'right' };
        const tableAlign = alignMap[block.align] || 'center';

        // Outlook VML button
        const vml = s.fixes?.outlook ? `
        <!--[if mso]>
        <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${block.link}" style="height:44px;v-text-anchor:middle;width:180px;" arcsize="${block.borderRadius}%" stroke="f" fillcolor="${block.backgroundColor}">
          <w:anchorlock/>
          <center style="color:${block.textColor};font-family:${font};font-size:15px;font-weight:bold;">${block.text}</center>
        </v:roundrect>
        <![endif]-->` : '';

        const htmlBtn = `<!--[if !mso]><!--><a href="${block.link}" style="background-color:${block.backgroundColor};color:${block.textColor};display:inline-block;font-family:${font};font-size:15px;font-weight:bold;line-height:1;mso-padding-alt:0px;text-decoration:none;padding:${block.padding};border-radius:${block.borderRadius}px;">${block.text}</a><!--<![endif]-->`;

        return `<tr>
      <td style="padding:20px 30px;text-align:${block.align};">
        <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="${tableAlign}">
          <tr>
            <td>${vml}${htmlBtn}</td>
          </tr>
        </table>
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // TABLE BLOCK
    // ─────────────────────────────────────────────
    htmlTable(block) {
        let rows = '';
        let cellIndex = 0;

        for (let r = 0; r < block.rows; r++) {
            rows += '<tr>';
            for (let c = 0; c < block.cols; c++) {
                const cell = block.cells[cellIndex] || { content: '', align: 'center', bgColor: '#ffffff' };
                const w = Math.round(100 / block.cols);
                rows += `<td width="${w}%" style="padding:${block.cellPadding}px;border:${block.borderWidth}px solid ${block.borderColor};background-color:${cell.bgColor};text-align:${cell.align};vertical-align:top;font-size:14px;line-height:1.6;">${cell.content}</td>`;
                cellIndex++;
            }
            rows += '</tr>';
        }

        return `<tr>
      <td style="padding:16px;">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="${block.cellSpacing}" style="border-collapse:collapse;" class="resp-table">
          ${rows}
        </table>
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // DIVIDER BLOCK
    // ─────────────────────────────────────────────
    htmlDivider(block) {
        return `<tr>
      <td style="padding:10px 20px;text-align:center;">
        <table role="presentation" width="${block.width}" align="center" border="0" cellpadding="0" cellspacing="0">
          <tr><td style="border-top:${block.height}px ${block.style} ${block.color};font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
      </td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // SPACER BLOCK
    // ─────────────────────────────────────────────
    htmlSpacer(block) {
        return `<tr>
      <td style="font-size:${block.height}px;line-height:${block.height}px;height:${block.height}px;">&nbsp;</td>
    </tr>`;
    },

    // ─────────────────────────────────────────────
    // BORDER CSS HELPER
    // ─────────────────────────────────────────────
    borderCSS(border) {
        if (!border) return '';
        const { top=0, right=0, bottom=0, left=0, color='#e5e7eb', style='solid' } = border;
        if (!top && !right && !bottom && !left) return '';
        let css = '';
        if (top)    css += `border-top:${top}px ${style} ${color};`;
        if (right)  css += `border-right:${right}px ${style} ${color};`;
        if (bottom) css += `border-bottom:${bottom}px ${style} ${color};`;
        if (left)   css += `border-left:${left}px ${style} ${color};`;
        return css;
    }

};