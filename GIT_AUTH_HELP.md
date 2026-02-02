# 🔐 حل مشكلة كلمة السر

## المشكلة:
Git يطلب كلمة سر عند `git push`

## ✅ الحل:

### الطريقة 1: استخدم Token بدلاً من كلمة السر (موصى به)

#### 1. أنشئ Personal Access Token:
https://github.com/settings/tokens

- اضغط **"Generate new token (classic)"**
- **Note:** `Git Push Access`
- **Scopes:** اختر ✅ **`repo`** (للوصول للـ repositories)
- اضغط **"Generate token"**
- **انسخ الـ Token!** (مثال: `ghp_abc123...`)

#### 2. عند طلب كلمة السر:
- **Username:** اسم حسابك على GitHub
- **Password:** الصق الـ Token (ليس كلمة السر الحقيقية!)

---

### الطريقة 2: استخدم SSH بدلاً من HTTPS

#### 1. تغيير الـ remote:
```bash
cd C:\Users\user\Music\jos\test7\feature-control-server
git remote set-url origin git@github.com:zrtbytbt-ux/nnn999.git
git push -u origin main
```

**ملاحظة:** يحتاج SSH key مسبقاً

---

### الطريقة 3: حفظ credentials (مؤقت)

```bash
git config --global credential.helper store
```

ثم أدخل Username و Token مرة واحدة، وسيحفظها Git

---

## 🎯 الخيار الأسهل:

استخدم **Personal Access Token** كما في الطريقة 1!

**بعد إنشاء الـ Token، شغّل:**
```bash
git push -u origin main
```

**عند الطلب:**
- Username: `zrtbytbt-ux`
- Password: `الصق الـ Token هنا`

✅ سيعمل!
