// ===== Global State =====
let config = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    app: {
        name: "أوقاتي",
        minVersion: "1.0.0",
        forceUpdate: false,
        updateMessage: "تحديث جديد متوفر!",
        downloadUrl: ""
    },
    maintenance: {
        enabled: false,
        message: "التطبيق تحت الصيانة"
    },
    features: {
        voiceRoomsEnabled: true,
        tribesEnabled: true,
        quizEnabled: true,
        askMeEnabled: true,
        tasbihEnabled: true,
        qiblaEnabled: true,
        adhkarEnabled: true
    },
    quickAccess: [
        { id: "tasbih", name: "المسبحة", icon: "📿", color: "#DC143C", route: "/tasbih", enabled: true, order: 1 },
        { id: "qibla", name: "القبلة", icon: "🧭", color: "#00FF41", route: "/qibla", enabled: true, order: 2 }
    ],
    announcements: [],
    dailyTip: {
        emoji: "📿",
        text: "من قال سبحان الله وبحمده مائة مرة حُطّت خطاياه"
    },
    links: {
        privacyPolicy: "",
        termsOfService: "",
        contactEmail: ""
    }
};

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    setupNavigation();
    updateDashboard();
});

// ===== Load Config =====
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (response.ok) {
            config = await response.json();
            populateAllFields();
            updateDashboard();
            showToast('✅ تم تحميل الإعدادات');
        }
    } catch (e) {
        console.log('Using default config');
        populateAllFields();
    }
}

// ===== Populate All Fields =====
function populateAllFields() {
    // Maintenance
    document.getElementById('maintenance-enabled').checked = config.maintenance?.enabled || false;
    document.getElementById('maintenance-message').value = config.maintenance?.message || '';
    document.getElementById('force-update').checked = config.app?.forceUpdate || false;
    document.getElementById('min-version').value = config.app?.minVersion || '1.0.0';
    document.getElementById('update-message').value = config.app?.updateMessage || '';
    document.getElementById('download-url').value = config.app?.downloadUrl || '';

    // Features
    const features = config.features || {};
    document.getElementById('feature-voiceRooms').checked = features.voiceRoomsEnabled !== false;
    document.getElementById('feature-tribes').checked = features.tribesEnabled !== false;
    document.getElementById('feature-quiz').checked = features.quizEnabled !== false;
    document.getElementById('feature-askMe').checked = features.askMeEnabled !== false;
    document.getElementById('feature-tasbih').checked = features.tasbihEnabled !== false;
    document.getElementById('feature-qibla').checked = features.qiblaEnabled !== false;
    document.getElementById('feature-adhkar').checked = features.adhkarEnabled !== false;

    // Daily Tip
    document.getElementById('tip-emoji').value = config.dailyTip?.emoji || '📿';
    document.getElementById('tip-text').value = config.dailyTip?.text || '';

    // Settings
    document.getElementById('app-name').value = config.app?.name || 'أوقاتي';
    document.getElementById('current-version').value = config.version || '1.0.0';
    document.getElementById('privacy-url').value = config.links?.privacyPolicy || '';
    document.getElementById('terms-url').value = config.links?.termsOfService || '';
    document.getElementById('support-email').value = config.links?.contactEmail || '';

    // Lists
    renderQuickAccessList();
    renderAnnouncementsList();
}

// ===== Update Dashboard Stats =====
function updateDashboard() {
    document.getElementById('app-version').textContent = config.version || '1.0.0';

    const maintenanceOn = config.maintenance?.enabled;
    document.getElementById('maintenance-status').textContent = maintenanceOn ? 'صيانة' : 'يعمل';
    document.getElementById('maintenance-indicator').textContent = maintenanceOn ? '🔧' : '✅';

    const features = config.features || {};
    const enabledCount = Object.values(features).filter(v => v === true).length;
    document.getElementById('features-count').textContent = enabledCount;

    const activeAnnouncements = (config.announcements || []).filter(a => a.active).length;
    document.getElementById('announcements-count').textContent = activeAnnouncements;
}

// ===== Navigation =====
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            showPage(page);
        });
    });
}

function showPage(pageName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });

    // Show page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `page-${pageName}`);
    });
}

// ===== Quick Access List =====
function renderQuickAccessList() {
    const list = document.getElementById('quickaccess-list');
    const items = config.quickAccess || [];

    list.innerHTML = items.map((item, index) => `
        <div class="list-item" data-id="${item.id}">
            <div class="item-icon" style="background: ${item.color}20; color: ${item.color}">${item.icon}</div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-details">الترتيب: ${item.order} | ${item.enabled ? '✅ مفعل' : '❌ معطل'}</div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editQuickAccess(${index})">✏️</button>
                <button class="btn-delete" onclick="deleteQuickAccess(${index})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addQuickAccess() {
    openModal('إضافة زر وصول سريع', `
        <div class="form-group">
            <label>المعرف (بالإنجليزية)</label>
            <input type="text" id="qa-id" placeholder="new_feature">
        </div>
        <div class="form-group">
            <label>الاسم</label>
            <input type="text" id="qa-name" placeholder="ميزة جديدة">
        </div>
        <div class="form-group">
            <label>الأيقونة (إيموجي)</label>
            <input type="text" id="qa-icon" placeholder="⭐">
        </div>
        <div class="form-group">
            <label>اللون</label>
            <input type="color" id="qa-color" value="#DC143C">
        </div>
        <div class="form-group">
            <label>المسار</label>
            <input type="text" id="qa-route" placeholder="/new">
        </div>
        <div class="form-group">
            <label>الترتيب</label>
            <input type="number" id="qa-order" value="${(config.quickAccess?.length || 0) + 1}">
        </div>
    `, () => {
        const newItem = {
            id: document.getElementById('qa-id').value,
            name: document.getElementById('qa-name').value,
            icon: document.getElementById('qa-icon').value,
            color: document.getElementById('qa-color').value,
            route: document.getElementById('qa-route').value,
            order: parseInt(document.getElementById('qa-order').value),
            enabled: true
        };
        config.quickAccess = config.quickAccess || [];
        config.quickAccess.push(newItem);
        renderQuickAccessList();
        closeModal();
        showToast('✅ تمت الإضافة');
    });
}

function editQuickAccess(index) {
    const item = config.quickAccess[index];
    openModal('تعديل زر وصول سريع', `
        <div class="form-group">
            <label>الاسم</label>
            <input type="text" id="qa-name" value="${item.name}">
        </div>
        <div class="form-group">
            <label>الأيقونة (إيموجي)</label>
            <input type="text" id="qa-icon" value="${item.icon}">
        </div>
        <div class="form-group">
            <label>اللون</label>
            <input type="color" id="qa-color" value="${item.color}">
        </div>
        <div class="form-group">
            <label>الترتيب</label>
            <input type="number" id="qa-order" value="${item.order}">
        </div>
        <div class="toggle-row">
            <span>مفعل</span>
            <label class="toggle">
                <input type="checkbox" id="qa-enabled" ${item.enabled ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
    `, () => {
        config.quickAccess[index] = {
            ...item,
            name: document.getElementById('qa-name').value,
            icon: document.getElementById('qa-icon').value,
            color: document.getElementById('qa-color').value,
            order: parseInt(document.getElementById('qa-order').value),
            enabled: document.getElementById('qa-enabled').checked
        };
        renderQuickAccessList();
        closeModal();
        showToast('✅ تم الحفظ');
    });
}

function deleteQuickAccess(index) {
    if (confirm('هل أنت متأكد من الحذف؟')) {
        config.quickAccess.splice(index, 1);
        renderQuickAccessList();
        showToast('🗑️ تم الحذف');
    }
}

// ===== Announcements List =====
function renderAnnouncementsList() {
    const list = document.getElementById('announcements-list');
    const items = config.announcements || [];

    if (items.length === 0) {
        list.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">لا توجد إعلانات</p>';
        return;
    }

    list.innerHTML = items.map((item, index) => `
        <div class="list-item">
            <div class="item-icon" style="background: #FFD70020; color: #FFD700">📢</div>
            <div class="item-info">
                <div class="item-name">${item.title}</div>
                <div class="item-details">${item.active ? '✅ نشط' : '❌ غير نشط'}</div>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editAnnouncement(${index})">✏️</button>
                <button class="btn-delete" onclick="deleteAnnouncement(${index})">🗑️</button>
            </div>
        </div>
    `).join('');
}

function addAnnouncement() {
    openModal('إضافة إعلان', `
        <div class="form-group">
            <label>العنوان</label>
            <input type="text" id="ann-title" placeholder="عنوان الإعلان">
        </div>
        <div class="form-group">
            <label>الرسالة</label>
            <textarea id="ann-message" placeholder="محتوى الإعلان..."></textarea>
        </div>
        <div class="form-group">
            <label>النوع</label>
            <select id="ann-type">
                <option value="info">معلومة</option>
                <option value="warning">تنبيه</option>
                <option value="success">نجاح</option>
            </select>
        </div>
        <div class="toggle-row">
            <span>يمكن إغلاقه</span>
            <label class="toggle">
                <input type="checkbox" id="ann-dismissible" checked>
                <span class="slider"></span>
            </label>
        </div>
    `, () => {
        const newAnn = {
            id: 'ann_' + Date.now(),
            title: document.getElementById('ann-title').value,
            message: document.getElementById('ann-message').value,
            type: document.getElementById('ann-type').value,
            dismissible: document.getElementById('ann-dismissible').checked,
            showOnce: true,
            active: true
        };
        config.announcements = config.announcements || [];
        config.announcements.push(newAnn);
        renderAnnouncementsList();
        updateDashboard();
        closeModal();
        showToast('✅ تمت الإضافة');
    });
}

function editAnnouncement(index) {
    const item = config.announcements[index];
    openModal('تعديل إعلان', `
        <div class="form-group">
            <label>العنوان</label>
            <input type="text" id="ann-title" value="${item.title}">
        </div>
        <div class="form-group">
            <label>الرسالة</label>
            <textarea id="ann-message">${item.message}</textarea>
        </div>
        <div class="toggle-row">
            <span>نشط</span>
            <label class="toggle">
                <input type="checkbox" id="ann-active" ${item.active ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        </div>
    `, () => {
        config.announcements[index] = {
            ...item,
            title: document.getElementById('ann-title').value,
            message: document.getElementById('ann-message').value,
            active: document.getElementById('ann-active').checked
        };
        renderAnnouncementsList();
        updateDashboard();
        closeModal();
        showToast('✅ تم الحفظ');
    });
}

function deleteAnnouncement(index) {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
        config.announcements.splice(index, 1);
        renderAnnouncementsList();
        updateDashboard();
        showToast('🗑️ تم الحذف');
    }
}

// ===== Modal =====
function openModal(title, bodyHTML, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = bodyHTML;
    document.getElementById('modal-confirm').onclick = onConfirm;
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// ===== Toast =====
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== Save Config =====
function saveConfig() {
    // Collect all data
    config.lastUpdated = new Date().toISOString();

    // Maintenance
    config.maintenance = {
        enabled: document.getElementById('maintenance-enabled').checked,
        message: document.getElementById('maintenance-message').value
    };

    // App
    config.app = {
        ...config.app,
        forceUpdate: document.getElementById('force-update').checked,
        minVersion: document.getElementById('min-version').value,
        updateMessage: document.getElementById('update-message').value,
        downloadUrl: document.getElementById('download-url').value,
        name: document.getElementById('app-name').value
    };

    config.version = document.getElementById('current-version').value;

    // Features
    config.features = {
        voiceRoomsEnabled: document.getElementById('feature-voiceRooms').checked,
        tribesEnabled: document.getElementById('feature-tribes').checked,
        quizEnabled: document.getElementById('feature-quiz').checked,
        askMeEnabled: document.getElementById('feature-askMe').checked,
        tasbihEnabled: document.getElementById('feature-tasbih').checked,
        qiblaEnabled: document.getElementById('feature-qibla').checked,
        adhkarEnabled: document.getElementById('feature-adhkar').checked
    };

    // Daily Tip
    config.dailyTip = {
        emoji: document.getElementById('tip-emoji').value,
        text: document.getElementById('tip-text').value
    };

    // Links
    config.links = {
        privacyPolicy: document.getElementById('privacy-url').value,
        termsOfService: document.getElementById('terms-url').value,
        contactEmail: document.getElementById('support-email').value
    };

    // Download as JSON
    downloadConfig();
    updateDashboard();
    showToast('✅ تم حفظ الإعدادات - قم برفع config.json إلى GitHub');
}

function downloadConfig() {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'config.json';
    a.click();
    URL.revokeObjectURL(url);
}

// ===== Quick Actions =====
function toggleMaintenance() {
    const checkbox = document.getElementById('maintenance-enabled');
    checkbox.checked = !checkbox.checked;
    showPage('maintenance');
    showToast('⚠️ لا تنسَ حفظ التغييرات');
}
