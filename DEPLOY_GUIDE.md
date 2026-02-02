# 🚀 دليل النشر الكامل - GitHub Gist Solution

## 📋 الخطوة 1: إنشاء GitHub Gist

### 1. اذهب إلى GitHub Gist:
https://gist.github.com

### 2. أنشئ Gist جديد:
- **اسم الملف:** `config.json`
- **المحتوى:**
```json
{
  "password": "admin123",
  "features": {
    "voiceRooms": true,
    "tribes": true,
    "adhkar": true,
    "quizzes": true
  },
  "lastUpdated": "2026-02-02T19:52:36+03:00"
}
```
- اضغط **"Create secret gist"** أو **"Create public gist"** (سري أفضل)

### 3. انسخ الـ Gist ID:
- من الرابط: `gist.github.com/USERNAME/abc123def456`
- الـ ID هو: `abc123def456`

---

## 🔑 الخطوة 2: إنشاء GitHub Token

### 1. اذهب إلى:
https://github.com/settings/tokens

### 2. اضغط **"Generate new token"** → **"Generate new token (classic)"**

### 3. املأ البيانات:
- **Note:** `Feature Control Server`
- **Expiration:** No expiration (أو حسب رغبتك)
- **Scopes:** ✅ اختر **`gist`** فقط

### 4. اضغط **"Generate token"**

### 5. انسخ الـ Token فوراً (لن تراه مرة أخرى!)
- مثال: `ghp_abc123def456ghi789...`

---

## 📦 الخطوة 3: رفع المشروع على GitHub

```bash
cd C:\Users\user\Music\jos\test7\feature-control-server
git init
git add .
git commit -m "Feature control server with GitHub Gist"
git branch -M main
```

### أنشئ Repository على GitHub:
1. اذهب إلى: https://github.com/new
2. اسم الـ repo: `feature-control-server`
3. اجعله Public أو Private
4. اضغط **Create repository**

### اربط واعمل Push:
```bash
git remote add origin https://github.com/YOUR_USERNAME/feature-control-server.git
git push -u origin main
```

---

## 🌐 الخطوة 4: النشر على Netlify

### 1. اذهب إلى:
https://app.netlify.com

### 2. اضغط **"Add new site"** → **"Import an existing project"**

### 3. اختر **GitHub** واختر repository: `feature-control-server`

### 4. **Build settings** (اتركها كما هي):
- Build command: (فارغ)
- Publish directory: `public`
- Functions directory: `netlify/functions`

### 5. اضغط **"Deploy site"**

---

## ⚙️ الخطوة 5: إعداد Environment Variables على Netlify

### بعد نشر الموقع:

1. اذهب إلى **Site settings** → **Environment variables**

2. أضف المتغيرات التالية:

| Variable | Value |
|----------|-------|
| `GITHUB_TOKEN` | الـ token الذي أنشأته (ghp_...) |
| `GIST_ID` | الـ Gist ID الذي نسخته |
| `ADMIN_PASSWORD` | كلمة السر (admin123 أو غيّرها) |

3. اضغط **"Save"**

4. **مهم:** اذهب إلى **Deploys** → اضغط **"Trigger deploy"** → **"Clear cache and deploy site"**

---

## ✅ الخطوة 6: الاختبار

### 1. افتح موقعك:
```
https://your-site-name.netlify.app
```

### 2. سجّل دخول بكلمة السر: `admin123`

### 3. جرّب تعطيل قسم وحفظ التغييرات

### 4. اختبر الـ API:
```bash
curl https://your-site-name.netlify.app/api/get-features
```

يجب أن يعيد:
```json
{
  "features": {
    "voiceRooms": true,
    "tribes": true,
    "adhkar": true,
    "quizzes": true
  },
  "lastUpdated": "...",
  "source": "github-gist"
}
```

---

## 🎨 الخطوة 7: ربط التطبيق

### في Flutter:

```dart
import 'remote_feature_control.dart';

// في initState أو عند بدء التطبيق:
final features = await RemoteFeatureControl.getFeatures();

// استخدمها:
if (features['voiceRooms'] == true) {
  // أظهر الغرف الصوتية
}
```

### لا تنسَ تعديل الـ URL في `remote_feature_control.dart`:
```dart
static const String baseUrl = 'https://your-site-name.netlify.app';
```

---

## 🔐 تغيير كلمة السر

### الطريقة 1: من Netlify
1. **Site settings** → **Environment variables**
2. عدّل `ADMIN_PASSWORD`
3. **Trigger deploy**

### الطريقة 2: من GitHub Gist
1. افتح الـ Gist
2. عدّل `password` في `config.json`
3. اضغط **Update**

---

## 🎯 ملاحظات مهمة

- ✅ **الـ Token آمن**: لن يظهر في الكود، محفوظ في Netlify فقط
- ✅ **التعديلات فورية**: أي تغيير من لوحة التحكم يحفظ في Gist مباشرة
- ✅ **احتياطي Fallback**: إذا فشل Gist، يستخدم القيم الافتراضية
- ⚠️ **احفظ الـ Token**: لن تستطيع رؤيته مرة أخرى على GitHub

---

## 🎉 جاهز!

الآن لديك:
- 🌐 سيرفر على Netlify
- 🎛️ لوحة تحكم تعمل بالكامل
- 💾 قاعدة بيانات على GitHub Gist
- 📱 تطبيق متصل بالسيرفر

**استمتع! 🚀**
