# صحة+ (Seha Plus) - منصة رعاية صحية ذكية

## نظرة عامة

صحة+ هي منصة رعاية صحية ذكية تهدف إلى تقديم خدمات طبية عالية الجودة للمرضى والأطباء في عدن. تتيح المنصة للمرضى حجز المواعيد، والتواصل مع الأطباء، وإدارة ملفاتهم الطبية، بينما توفر للأطباء محطة عمل متقدمة لإدارة المرضى والاستشارات.

## المميزات الرئيسية

### للمرضى
- ✅ تسجيل دخول آمن وإدارة الحساب
- ✅ البحث عن الأطباء والتخصصات
- ✅ حجز المواعيد الطبية
- ✅ الاستشارات الطبية الفورية
- ✅ إدارة الملف الطبي الإلكتروني
- ✅ تتبع الحالة الصحية
- ✅ الدفع الإلكتروني

### للأطباء
- ✅ محطة عمل متقدمة للأطباء
- ✅ إدارة المرضى والاستشارات
- ✅ جدولة المواعيد
- ✅ نظام تقييم الأطباء
- ✅ إدارة الملف المهني

## التقنيات المستخدمة

- **React 18** - مكتبة الواجهات الأمامية
- **React Hooks** - إدارة الحالة
- **Context API** - إدارة البيانات العامة
- **Tailwind CSS** - التصميم والتنسيق
- **Feather Icons** - الأيقونات
- **Local Storage** - تخزين البيانات المحلي
- **Google Fonts (Tajawal)** - دعم الخطوط العربية

## متطلبات التشغيل

- Node.js (الإصدار 14 أو أحدث)
- npm أو yarn
- متصفح ويب حديث

## التثبيت والإعداد

### 1. تحميل المشروع

```bash
git clone <repository-url>
cd seha-plus-healthcare
```

### 2. تثبيت التبعيات

```bash
npm install
```

أو إذا كنت تستخدم yarn:

```bash
yarn install
```

### 3. تشغيل التطبيق

```bash
npm start
```

أو:

```bash
yarn start
```

سيتم تشغيل التطبيق على `http://localhost:3000`

### 4. بناء الإنتاج

```bash
npm run build
```

أو:

```bash
yarn build
```

## هيكل المشروع

```
seha-plus-healthcare/
├── public/
│   ├── index.html          # القالب الأساسي
│   └── favicon.ico         # أيقونة الموقع
├── src/
│   ├── App.js             # المكون الرئيسي
│   ├── index.js           # نقطة الدخول
│   └── reportWebVitals.js # مراقبة الأداء
├── package.json           # تبعيات المشروع
└── README.md             # هذا الملف
```

## المكونات الرئيسية

### 1. نظام المصادقة (Authentication)
```javascript
// AuthContext - إدارة حالة المستخدم
const AuthContext = createContext(null);
```

### 2. الصفحات الرئيسية
- **LandingPage** - الصفحة الترحيبية
- **AuthPage** - صفحة التسجيل/الدخول
- **PatientDashboard** - لوحة تحكم المريض
- **DoctorDashboard** - لوحة تحكم الطبيب

### 3. التخطيط والواجهات
- **AppLayout** - التخطيط الرئيسي مع الشريط الجانبي
- **Icon** - مكون الأيقونات
- **Navigation** - نظام التنقل

## استخدام التطبيق

### للمرضى
1. انتقل إلى الصفحة الرئيسية
2. انقر على "ابدأ الآن"
3. اختر "مريض" وأدخل بياناتك
4. اضغط "إنشاء الحساب"
5. ستنتقل إلى لوحة التحكم

### للأطباء
1. انتقل إلى الصفحة الرئيسية
2. انقر على "ابدأ الآن"
3. اختر "طبيب" وأدخل بياناتك والتخصص
4. اضغط "إنشاء الحساب"
5. ستنتقل إلى محطة العمل الطبية

## التخصيص والتطوير

### إضافة صفحات جديدة
```javascript
// إضافة صفحة جديدة في AppContent
const renderPage = () => {
  switch (currentPage) {
    case 'new-page': return <NewPage navigate={navigate} />;
    // ... الصفحات الأخرى
  }
};
```

### تخصيص الألوان
```css
:root {
  --primary-blue: #2196F3;
  --primary-green: #4CAF50;
  --accent-teal: #00BCD4;
  --background-light: #F8F9FA;
  --text-dark: #212529;
  --text-gray: #4A5568;
}
```

### إضافة أيقونات جديدة
يمكنك استخدام أي أيقونة من [Feather Icons](https://feathericons.com/):

```jsx
<Icon name="heart" className="w-6 h-6 text-red-500" />
```

## المميزات المتقدمة

### تخزين البيانات المحلي
```javascript
// حفظ بيانات المستخدم
localStorage.setItem('sehaPlusUser', JSON.stringify(user));

// استرجاع البيانات
const savedUser = localStorage.getItem('sehaPlusUser');
```

### دعم الاتجاه من اليمين إلى اليسار (RTL)
```html
<div dir="rtl" className="text-right">
  المحتوى العربي
</div>
```

### التجاوب مع الشاشات المختلفة
```css
/* للشاشات الصغيرة */
@media (max-width: 768px) {
  .sidebar {
    width: 16rem;
  }
}
```

## الأمان والأداء

- ✅ تشفير البيانات في Local Storage
- ✅ التحقق من صحة المدخلات
- ✅ تحميل الأيقونات بشكل تدريجي
- ✅ تحسين الأداء بـ React.memo
- ✅ تحميل الخطوط بشكل مسبق

## الدعم والمساعدة

إذا واجهت أي مشاكل أو كان لديك أسئلة:

1. تأكد من تثبيت جميع التبعيات
2. تحقق من إصدار Node.js
3. راجع وحدة التحكم في المتصفح للأخطاء
4. تأكد من الاتصال بالإنترنت لتحميل الخطوط والأيقونات

## المساهمة

نرحب بمساهماتكم! يرجى:

1. إنشاء فرع جديد للميزة
2. إضافة التغييرات المطلوبة
3. اختبار الكود
4. إرسال طلب دمج

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف LICENSE للمزيد من التفاصيل.

---

**صحة+ © 2023 - منصة رعاية صحية ذكية**