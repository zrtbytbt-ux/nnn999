// تحميل الإعدادات من config.json
let config = {};

// تحميل الإعدادات عند فتح الصفحة
window.addEventListener('DOMContentLoaded', loadConfig);

// تحديث المعاينة عند تغيير القيم
document.addEventListener('DOMContentLoaded', () => {
    const appName = document.getElementById('appName');
    const appVersion = document.getElementById('appVersion');
    const appLogo = document.getElementById('appLogo');

    if (appName) appName.addEventListener('input', updatePreview);
    if (appVersion) appVersion.addEventListener('input', updatePreview);
    if (appLogo) appLogo.addEventListener('input', updateLogoPreview);
});

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();

        // تحديث الحقول
        if (config.app) {
            document.getElementById('appName').value = config.app.name || '';
            document.getElementById('appVersion').value = config.app.version || '';
            document.getElementById('appLogo').value = config.app.logo_url || '';
        }

        if (config.features) {
            document.getElementById('maintenanceMode').checked = config.features.maintenance_mode || false;
            document.getElementById('forceUpdate').checked = config.features.force_update || false;
            document.getElementById('minVersion').value = config.features.min_version || '';
        }

        // تحديث المعاينة
        updatePreview();
        updateLogoPreview();

        // تحديث وقت آخر تحديث
        if (config.app && config.app.last_updated) {
            const date = new Date(config.app.last_updated);
            document.getElementById('lastUpdate').textContent = date.toLocaleString('ar-EG');
        }

        showToast('تم تحميل الإعدادات بنجاح', 'success');
    } catch (error) {
        console.error('Error loading config:', error);
        showToast('فشل تحميل الإعدادات', 'error');
    }
}

function updatePreview() {
    const appName = document.getElementById('appName').value;
    const appVersion = document.getElementById('appVersion').value;

    document.getElementById('previewName').textContent = appName || 'أوقاتي';
    document.getElementById('previewVersion').textContent = `الإصدار: ${appVersion || '1.0.0'}`;
}

function updateLogoPreview() {
    const logoUrl = document.getElementById('appLogo').value;
    const placeholderUrl = 'https://via.placeholder.com/512x512.png?text=أوقاتي';

    const finalUrl = logoUrl || placeholderUrl;

    document.getElementById('logoPreview').src = finalUrl;
    document.getElementById('previewLogo').src = finalUrl;

    // التعامل مع حالة فشل تحميل الصورة
    document.getElementById('logoPreview').onerror = function () {
        this.src = placeholderUrl;
    };
    document.getElementById('previewLogo').onerror = function () {
        this.src = placeholderUrl;
    };
}

async function saveConfig() {
    try {
        // جمع البيانات من النموذج
        const updatedConfig = {
            app: {
                name: document.getElementById('appName').value,
                version: document.getElementById('appVersion').value,
                logo_url: document.getElementById('appLogo').value,
                last_updated: new Date().toISOString()
            },
            features: {
                maintenance_mode: document.getElementById('maintenanceMode').checked,
                force_update: document.getElementById('forceUpdate').checked,
                min_version: document.getElementById('minVersion').value
            }
        };

        // عرض البيانات في الكونسول (للتطوير)
        console.log('Updated Config:', JSON.stringify(updatedConfig, null, 2));

        // في بيئة الإنتاج، ستحتاج لحفظ هذا في ملف config.json
        // هنا سنعرض رسالة للمستخدم
        showInstructions(updatedConfig);

        // تحديث وقت آخر تحديث
        const now = new Date();
        document.getElementById('lastUpdate').textContent = now.toLocaleString('ar-EG');

        showToast('تم حفظ التغييرات! اتبع التعليمات أدناه', 'success');
    } catch (error) {
        console.error('Error saving config:', error);
        showToast('فشل حفظ الإعدادات', 'error');
    }
}

function showInstructions(config) {
    // إنشاء نافذة منبثقة بالتعليمات
    const instructions = `
┌─────────────────────────────────────────┐
│   تعليمات حفظ الإعدادات               │
└─────────────────────────────────────────┘

1. انسخ الكود التالي:

${JSON.stringify(config, null, 2)}

2. استبدل محتوى ملف config.json بالكود المنسوخ

3. ارفع الملف المحدث على GitHub:
   git add config.json
   git commit -m "Update app config"
   git push origin main

4. سيتم تحديث التطبيق تلقائياً لجميع المستخدمين!
    `;

    console.log(instructions);

    // نسخ للحافظة
    const configText = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(configText).then(() => {
        alert('✅ تم نسخ الإعدادات للحافظة!\n\nالآن:\n1. افتح ملف config.json\n2. الصق المحتوى المنسوخ\n3. احفظ واعمل commit و push على GitHub');
    }).catch(() => {
        alert('⚠️ لم نتمكن من النسخ التلقائي.\n\nانسخ الكود من Console يدوياً.');
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// تحديث الحالة كل 30 ثانية
setInterval(() => {
    const statusText = document.querySelector('.status-text');
    const statusDot = document.querySelector('.status-dot');

    // محاكاة فحص الاتصال
    const isOnline = navigator.onLine;
    statusText.textContent = isOnline ? 'متصل' : 'غير متصل';
    statusDot.style.background = isOnline ? '#10b981' : '#f59e0b';
}, 30000);
