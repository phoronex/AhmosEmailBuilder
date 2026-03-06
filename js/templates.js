// ============================================================
// TEMPLATES
// ============================================================

const Templates = {

    'welcome': {
        name: 'Welcome',
        icon: 'fas fa-hand-wave',
        desc: 'Onboarding email',
        global: { width: 600, bgOuter: '#f1f5f9', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'ltr' },
        header: { text: 'Welcome to AHMOS!', align: 'center', textColor: '#ffffff', bg: '#2563eb', paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 'w1', type: 'text', content: '<p style="font-size:18px;color:#2563eb;font-weight:700;margin-bottom:12px;">Hello there! 👋</p><p>Thank you for joining us. We\'re excited to have you on board and can\'t wait to show you everything we have to offer.</p>', size: 16, color: '#334155', align: 'left', padding: 30, backgroundColor: 'transparent', hideInMso: false },
            { id: 'w2', type: 'two-images', images: [{ src: 'https://via.placeholder.com/270x160/3b82f6/ffffff?text=Feature+1', alt: 'Feature 1', link: '', width: 270, borderRadius: 6 }, { src: 'https://via.placeholder.com/270x160/10b981/ffffff?text=Feature+2', alt: 'Feature 2', link: '', width: 270, borderRadius: 6 }], gap: 20, align: 'center', hideInMso: false },
            { id: 'w3', type: 'text', content: '<p>Ready to get started? Click the button below to explore your new account.</p>', size: 16, color: '#334155', align: 'center', padding: 20, backgroundColor: 'transparent', hideInMso: false },
            { id: 'w4', type: 'button', text: 'Get Started →', link: 'https://example.com', backgroundColor: '#2563eb', textColor: '#ffffff', borderRadius: 6, padding: '14px 36px', align: 'center', hideInMso: false },
            { id: 'w5', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS. All rights reserved.\n123 Business Street, City, Country\ninfo@example.com | (123) 456-7890`, bg: '#1e293b', color: '#94a3b8', paddingTop: 30, paddingBottom: 30, paddingLeft: 30, paddingRight: 30, fontSize: 14, lineHeight: 1.6 }
    },

    'newsletter': {
        name: 'Newsletter',
        icon: 'fas fa-newspaper',
        desc: 'Monthly digest',
        global: { width: 620, bgOuter: '#f8fafc', bgInner: '#ffffff', font: "Georgia, 'Times New Roman', serif", direction: 'ltr' },
        header: { text: 'The Monthly Brief', align: 'left', textColor: '#ffffff', bg: '#0f172a', paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, logo: '' },
        blocks: [
            { id: 'nl1', type: 'text', content: '<p style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">MARCH 2025 • ISSUE #12</p><h2 style="font-size:26px;color:#0f172a;margin-bottom:16px;line-height:1.3;">What\'s Happening This Month</h2><p style="color:#475569;">Welcome to our latest newsletter. Here\'s a curated roundup of the most important updates, insights, and news you need to know.</p>', size: 16, color: '#334155', align: 'left', padding: 40, backgroundColor: 'transparent', hideInMso: false },
            { id: 'nl2', type: 'divider', height: 1, color: '#e2e8f0', style: 'solid', width: '100%' },
            { id: 'nl3', type: 'image', src: 'https://via.placeholder.com/620x280/0f172a/ffffff?text=Featured+Story', alt: 'Featured Story', width: 620, borderRadius: 0, link: '', align: 'center', hideInMso: false },
            { id: 'nl4', type: 'two-texts', columns: [{ content: '<h3 style="font-size:15px;color:#0f172a;margin-bottom:8px;">Industry Update</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">The latest trends are reshaping how teams work. Here\'s what you need to know about the changes ahead.</p>', align: 'left', backgroundColor: '#f8fafc' }, { content: '<h3 style="font-size:15px;color:#0f172a;margin-bottom:8px;">Product Spotlight</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">Our newest feature is live. Thousands of users are already seeing results with 40% faster workflows.</p>', align: 'left', backgroundColor: '#f8fafc' }], gap: 2, backgroundColor: '#f8fafc', hideInMso: false },
            { id: 'nl5', type: 'button', text: 'Read Full Issue', link: 'https://example.com', backgroundColor: '#0f172a', textColor: '#ffffff', borderRadius: 4, padding: '13px 32px', align: 'center', hideInMso: false },
            { id: 'nl6', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS. Sent to subscriber@example.com\nUnsubscribe | Manage Preferences | View Online`, bg: '#0f172a', color: '#64748b', paddingTop: 30, paddingBottom: 30, paddingLeft: 40, paddingRight: 40, fontSize: 12, lineHeight: 1.8 }
    },

    'promo': {
        name: 'Promotion',
        icon: 'fas fa-tags',
        desc: 'Sales & offers',
        global: { width: 600, bgOuter: '#fff7ed', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'ltr' },
        header: { text: '🔥 LIMITED TIME OFFER', align: 'center', textColor: '#ffffff', bg: '#ea580c', paddingTop: 30, paddingBottom: 30, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 'p1', type: 'text', content: '<p style="text-align:center;font-size:48px;font-weight:900;color:#ea580c;margin-bottom:4px;">50% OFF</p><p style="text-align:center;font-size:18px;color:#7c2d12;font-weight:600;">Everything in our store — this weekend only</p>', size: 16, color: '#334155', align: 'center', padding: 30, backgroundColor: '#fff7ed', hideInMso: false },
            { id: 'p2', type: 'image', src: 'https://via.placeholder.com/600x260/ea580c/ffffff?text=SALE+PRODUCTS', alt: 'Sale', width: 600, borderRadius: 0, link: '', align: 'center', hideInMso: false },
            { id: 'p3', type: 'text', content: '<p>Don\'t miss this incredible opportunity. Use code <strong style="color:#ea580c;background:#fff7ed;padding:2px 8px;border-radius:4px;">SAVE50</strong> at checkout to apply your discount.</p><p style="margin-top:12px;font-size:13px;color:#9a3412;">⏰ Expires Sunday midnight. Limited quantities available.</p>', size: 15, color: '#334155', align: 'center', padding: 25, backgroundColor: 'transparent', hideInMso: false },
            { id: 'p4', type: 'button', text: 'SHOP NOW — SAVE 50%', link: 'https://example.com/sale', backgroundColor: '#ea580c', textColor: '#ffffff', borderRadius: 4, padding: '16px 40px', align: 'center', hideInMso: false },
            { id: 'p5', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS Store. All rights reserved.\nOffer valid while supplies last. Cannot be combined with other offers.\nUnsubscribe from promotional emails`, bg: '#431407', color: '#a16207', paddingTop: 25, paddingBottom: 25, paddingLeft: 30, paddingRight: 30, fontSize: 12, lineHeight: 1.6 }
    },

    'transactional': {
        name: 'Transactional',
        icon: 'fas fa-receipt',
        desc: 'Order / confirmation',
        global: { width: 600, bgOuter: '#f9fafb', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'ltr' },
        header: { text: 'Order Confirmed ✓', align: 'center', textColor: '#ffffff', bg: '#059669', paddingTop: 30, paddingBottom: 30, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 't1', type: 'text', content: '<p>Hi <strong>John</strong>,</p><p style="margin-top:10px;">Your order has been confirmed and is being processed. Below is a summary of your purchase.</p>', size: 16, color: '#334155', align: 'left', padding: 30, backgroundColor: 'transparent', hideInMso: false },
            { id: 't2', type: 'table', rows: 4, cols: 3, cells: [
                { content: '<strong>Item</strong>', align: 'left', bgColor: '#f0fdf4' },
                { content: '<strong>Qty</strong>', align: 'center', bgColor: '#f0fdf4' },
                { content: '<strong>Price</strong>', align: 'right', bgColor: '#f0fdf4' },
                { content: 'Product Alpha', align: 'left', bgColor: '#ffffff' },
                { content: '2', align: 'center', bgColor: '#ffffff' },
                { content: '$49.99', align: 'right', bgColor: '#ffffff' },
                { content: 'Product Beta', align: 'left', bgColor: '#f9fafb' },
                { content: '1', align: 'center', bgColor: '#f9fafb' },
                { content: '$29.99', align: 'right', bgColor: '#f9fafb' },
                { content: '<strong>Total</strong>', align: 'left', bgColor: '#f0fdf4' },
                { content: '3', align: 'center', bgColor: '#f0fdf4' },
                { content: '<strong>$129.97</strong>', align: 'right', bgColor: '#f0fdf4' }
            ], borderWidth: 1, borderColor: '#d1fae5', cellPadding: 12, cellSpacing: 0, hideInMso: false },
            { id: 't3', type: 'text', content: '<p style="color:#6b7280;font-size:13px;">Estimated delivery: <strong style="color:#059669;">3-5 business days</strong><br>Order #: <strong>#ORD-2025-00847</strong></p>', size: 14, color: '#334155', align: 'left', padding: 25, backgroundColor: '#f0fdf4', hideInMso: false },
            { id: 't4', type: 'button', text: 'Track Your Order', link: 'https://example.com/track', backgroundColor: '#059669', textColor: '#ffffff', borderRadius: 6, padding: '13px 30px', align: 'center', hideInMso: false },
            { id: 't5', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS Shop. All rights reserved.\nThis is an automated confirmation. Please do not reply.\nSupport: support@example.com`, bg: '#1e293b', color: '#94a3b8', paddingTop: 25, paddingBottom: 25, paddingLeft: 30, paddingRight: 30, fontSize: 12, lineHeight: 1.6 }
    },

    'event': {
        name: 'Event Invite',
        icon: 'fas fa-calendar-alt',
        desc: 'Events & webinars',
        global: { width: 600, bgOuter: '#1e1b4b', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'ltr' },
        header: { text: "You're Invited!", align: 'center', textColor: '#ffffff', bg: '#4f46e5', paddingTop: 40, paddingBottom: 40, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 'e1', type: 'image', src: 'https://via.placeholder.com/600x240/4f46e5/ffffff?text=ANNUAL+SUMMIT+2025', alt: 'Event Banner', width: 600, borderRadius: 0, link: '', align: 'center', hideInMso: false },
            { id: 'e2', type: 'text', content: '<h2 style="text-align:center;color:#4f46e5;font-size:24px;margin-bottom:16px;">AHMOS Annual Summit 2025</h2><p style="text-align:center;color:#64748b;">Join us for a day of insights, networking, and innovation. Hear from industry leaders and connect with peers who are shaping the future.</p>', size: 16, color: '#334155', align: 'center', padding: 30, backgroundColor: 'transparent', hideInMso: false },
            { id: 'e3', type: 'table', rows: 1, cols: 3, cells: [
                { content: '<p style="text-align:center;color:#4f46e5;font-size:22px;font-weight:900;">Apr 15</p><p style="text-align:center;color:#64748b;font-size:12px;">DATE</p>', align: 'center', bgColor: '#f5f3ff' },
                { content: '<p style="text-align:center;color:#4f46e5;font-size:22px;font-weight:900;">9:00 AM</p><p style="text-align:center;color:#64748b;font-size:12px;">TIME (GST)</p>', align: 'center', bgColor: '#ede9fe' },
                { content: '<p style="text-align:center;color:#4f46e5;font-size:22px;font-weight:900;">Online</p><p style="text-align:center;color:#64748b;font-size:12px;">FORMAT</p>', align: 'center', bgColor: '#f5f3ff' }
            ], borderWidth: 0, borderColor: '#c4b5fd', cellPadding: 20, cellSpacing: 0, hideInMso: false },
            { id: 'e4', type: 'button', text: '→ Reserve My Spot', link: 'https://example.com/register', backgroundColor: '#4f46e5', textColor: '#ffffff', borderRadius: 6, padding: '15px 40px', align: 'center', hideInMso: false },
            { id: 'e5', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS Events. All rights reserved.\nYou received this because you're on our VIP list.\nUnsubscribe | Update Preferences`, bg: '#1e1b4b', color: '#6366f1', paddingTop: 25, paddingBottom: 25, paddingLeft: 30, paddingRight: 30, fontSize: 12, lineHeight: 1.6 }
    },

    'arabic': {
        name: 'Arabic RTL',
        icon: 'fas fa-globe',
        desc: 'Arabic / RTL layout',
        global: { width: 600, bgOuter: '#f1f5f9', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'rtl', arabicFont: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", arabicLineHeight: 1.9 },
        header: { text: 'مرحباً بكم في أهموس', align: 'center', textColor: '#ffffff', bg: '#059669', paddingTop: 35, paddingBottom: 35, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 'a1', type: 'text', content: '<p style="font-size:18px;color:#059669;font-weight:700;margin-bottom:12px;">عزيزي العميل،</p><p>شكراً لاختيارك خدماتنا. نحن ملتزمون بتقديم أفضل تجربة ممكنة لكم، ونتطلع إلى خدمتكم باستمرار.</p><ul style="margin:15px 0;padding-right:20px;"><li>دعم فني على مدار الساعة</li><li>خدمات سريعة وموثوقة</li><li>أسعار تنافسية</li><li>ضمان الجودة</li></ul>', size: 16, color: '#334155', align: 'right', padding: 30, backgroundColor: 'transparent', hideInMso: false },
            { id: 'a2', type: 'two-texts', columns: [{ content: '<p style="font-size:14px;"><strong>الدعم الفني</strong></p><p style="font-size:13px;margin-top:6px;">نحن متاحون 24/7 للإجابة على استفساراتكم وحل أي مشاكل تواجهونها.</p>', align: 'right', backgroundColor: '#f0fdf4' }, { content: '<p style="font-size:14px;"><strong>السرعة والدقة</strong></p><p style="font-size:13px;margin-top:6px;">نضمن لكم تقديم الخدمات في أسرع وقت ممكن وبأعلى معايير الجودة.</p>', align: 'right', backgroundColor: '#f0fdf4' }], gap: 2, backgroundColor: '#f0fdf4', hideInMso: false },
            { id: 'a3', type: 'button', text: 'تواصل معنا', link: 'https://example.com', backgroundColor: '#059669', textColor: '#ffffff', borderRadius: 6, padding: '14px 36px', align: 'center', hideInMso: false },
            { id: 'a4', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} أهموس. جميع الحقوق محفوظة.\nالرياض، المملكة العربية السعودية\nالبريد: info@example.com | الهاتف: 0112345678`, bg: '#1e293b', color: '#94a3b8', paddingTop: 30, paddingBottom: 30, paddingLeft: 30, paddingRight: 30, fontSize: 14, lineHeight: 1.8 }
    },

    'two-column': {
        name: 'Two Column',
        icon: 'fas fa-columns',
        desc: 'Grid layout',
        global: { width: 600, bgOuter: '#f1f5f9', bgInner: '#ffffff', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", direction: 'ltr' },
        header: { text: 'Product Updates', align: 'center', textColor: '#ffffff', bg: '#7c3aed', paddingTop: 35, paddingBottom: 35, paddingLeft: 30, paddingRight: 30, logo: '' },
        blocks: [
            { id: 'tc1', type: 'table', rows: 2, cols: 2, cells: [
                { content: '<p style="font-size:22px;margin:0 0 8px;">🚀</p><h3 style="color:#7c3aed;margin-bottom:8px;">New Features</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">Discover powerful new capabilities designed to boost your productivity by up to 40%.</p>', align: 'left', bgColor: '#ffffff' },
                { content: '<p style="font-size:22px;margin:0 0 8px;">⚡</p><h3 style="color:#7c3aed;margin-bottom:8px;">Performance</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">Experience 2x faster load times with our optimized infrastructure.</p>', align: 'left', bgColor: '#faf5ff' },
                { content: '<p style="font-size:22px;margin:0 0 8px;">🔒</p><h3 style="color:#7c3aed;margin-bottom:8px;">Security</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">Enhanced security measures including 2FA and end-to-end encryption.</p>', align: 'left', bgColor: '#faf5ff' },
                { content: '<p style="font-size:22px;margin:0 0 8px;">💬</p><h3 style="color:#7c3aed;margin-bottom:8px;">24/7 Support</h3><p style="font-size:13px;color:#64748b;line-height:1.7;">Our team is always here to help. Live chat, email, and phone support available.</p>', align: 'left', bgColor: '#ffffff' }
            ], borderWidth: 1, borderColor: '#ede9fe', cellPadding: 25, cellSpacing: 0, hideInMso: false },
            { id: 'tc2', type: 'button', text: 'See All Updates', link: 'https://example.com', backgroundColor: '#7c3aed', textColor: '#ffffff', borderRadius: 6, padding: '13px 32px', align: 'center', hideInMso: false },
            { id: 'tc3', type: 'spacer', height: 20, hideInMso: false }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS. All rights reserved.\nYou're receiving this because you subscribed to product updates.`, bg: '#1e293b', color: '#94a3b8', paddingTop: 25, paddingBottom: 25, paddingLeft: 30, paddingRight: 30, fontSize: 13, lineHeight: 1.6 }
    },

    'minimal': {
        name: 'Minimal Clean',
        icon: 'fas fa-feather',
        desc: 'Simple & elegant',
        global: { width: 560, bgOuter: '#ffffff', bgInner: '#ffffff', font: "Georgia, 'Times New Roman', serif", direction: 'ltr' },
        header: { text: 'AHMOS', align: 'left', textColor: '#0f172a', bg: '#ffffff', paddingTop: 30, paddingBottom: 10, paddingLeft: 40, paddingRight: 40, logo: '' },
        blocks: [
            { id: 'm1', type: 'divider', height: 2, color: '#0f172a', style: 'solid', width: '100%' },
            { id: 'm2', type: 'spacer', height: 30, hideInMso: false },
            { id: 'm3', type: 'text', content: '<h1 style="font-size:32px;color:#0f172a;font-weight:400;line-height:1.3;margin-bottom:20px;">A message worth your time.</h1><p style="color:#475569;line-height:1.9;font-size:16px;">We believe in the power of simple, clear communication. This message was crafted with care — to inform, to inspire, and to invite you to take the next step.</p>', size: 16, color: '#334155', align: 'left', padding: 40, backgroundColor: 'transparent', hideInMso: false },
            { id: 'm4', type: 'image', src: 'https://via.placeholder.com/560x200/f8fafc/334155?text=', alt: '', width: 560, borderRadius: 0, link: '', align: 'center', hideInMso: false },
            { id: 'm5', type: 'text', content: '<p style="color:#475569;line-height:1.9;">The details matter. The words matter. And so does your time. That\'s why we keep things focused on what\'s important — so you can act quickly and confidently.</p>', size: 16, color: '#334155', align: 'left', padding: 40, backgroundColor: 'transparent', hideInMso: false },
            { id: 'm6', type: 'text', content: '<p><a href="https://example.com" style="color:#0f172a;font-weight:700;text-decoration:underline;">Continue reading →</a></p>', size: 16, color: '#334155', align: 'left', padding: '0 40px 30px', backgroundColor: 'transparent', hideInMso: false },
            { id: 'm7', type: 'divider', height: 1, color: '#e2e8f0', style: 'solid', width: '100%' }
        ],
        footer: { text: `© ${new Date().getFullYear()} AHMOS\nUnsubscribe`, bg: '#ffffff', color: '#94a3b8', paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40, fontSize: 12, lineHeight: 1.6 }
    }
};

window.emailTemplates = Templates;
