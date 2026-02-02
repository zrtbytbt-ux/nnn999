# 📋 خطوات الرفع على GitHub ثم Netlify

## ✅ تم الانتهاء من:
- [x] إعداد Git Repository
- [x] إضافة جميع الملفات
- [x] عمل Commit
- [x] تسمية الـ branch إلى `main`

---

## 🔄 الخطوات المتبقية:

### 1️⃣ **أنشئ Repository على GitHub**

افتح: https://github.com/new

- **Repository name:** `feature-control-server`
- **Description:** Remote feature control for mobile app
- **Visibility:** Public أو Private (اختر ما تريد)
- **❌ لا تضف:** README, .gitignore, license (موجودين بالفعل)
- اضغط **"Create repository"**

---

### 2️⃣ **اربط المشروع بـ GitHub**

بعد إنشاء الـ repository، انسخ الأوامر التالية وشغّلها:

```bash
cd C:\Users\user\Music\jos\test7\feature-control-server

git remote add origin https://github.com/YOUR_USERNAME/feature-control-server.git

git push -u origin main
```

**استبدل `YOUR_USERNAME` باسم حسابك على GitHub**

---

### 3️⃣ **أنشئ GitHub Gist**

اذهب إلى: https://gist.github.com

- **Filename:** `config.json`
- **Content:**
```json
{
  "password": "admin123",
  "features": {
    "voiceRooms": true,
    "tribes": true,
    "adhkar": true,
    "quizzes": true
  },
  "lastUpdated": "2026-02-02T19:58:33+03:00"
}
```
- اختر **"Create secret gist"**
- **انسخ الـ Gist ID** من الرابط (مثال: `abc123def456`)

---

### 4️⃣ **أنشئ GitHub Token**

اذهب إلى: https://github.com/settings/tokens

1. اضغط **"Generate new token"** → **"Generate new token (classic)"**
2. **Note:** `Feature Control Server`
3. **Scopes:** اختر ✅ **`gist`** فقط
4. اضغط **"Generate token"**
5. **انسخ الـ Token فوراً!** (مثال: `ghp_abc123...`)

---

### 5️⃣ **انشر على Netlify**

1. اذهب إلى: https://app.netlify.com
2. اضغط **"Add new site"** → **"Import an existing project"**
3. اختر **"Deploy with GitHub"**
4. اختر repository: `feature-control-server`
5. **Build settings:**
   - Build command: (فارغ)
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
6. اضغط **"Deploy site"**

---

### 6️⃣ **أضف Environment Variables على Netlify**

بعد نشر الموقع:

1. اذهب إلى **Site settings** → **Environment variables**
2. أضف:

| Key | Value |
|-----|-------|
| `GITHUB_TOKEN` | الـ Token الذي أنشأته |
| `GIST_ID` | الـ Gist ID |
| `ADMIN_PASSWORD` | `admin123` (أو غيّرها) |

3. اضغط **Save**
4. اذهب لـ **Deploys** → **"Trigger deploy"** → **"Clear cache and deploy site"**

---

### 7️⃣ **اختبر الموقع**

افتح: `https://your-site-name.netlify.app`

- سجّل دخول بكلمة السر: `admin123`
- جرّب تعطيل أي قسم
- اضغط **حفظ التغييرات**
- ✅ يجب أن يعمل!

---

### 8️⃣ **أعطني الرابط**

بعد نجاح كل شيء، أعطني:
- ✅ رابط موقع Netlify
- ✅ رابط GitHub Repository

وسأحدّث الكود بالرابط الصحيح! 🚀

---

## 📞 إذا واجهت مشكلة:

اسألني في أي خطوة! كل شيء موثق في:
- **DEPLOY_GUIDE.md** - دليل مفصل
- **README.md** - التوثيق الكامل

**حظاً موفقاً! 🎉**
