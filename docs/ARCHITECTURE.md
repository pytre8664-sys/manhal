# Architecture & System Design — منصة وصل التعليمية (Wasl Education Platform)

## 1. نظرة عامة (Overview)
منصة **وصل** التعليمية هي منصة رقمية متخصصة تهدف إلى ربط المدارس وأولياء الأمور بالمعلمين والكوادر التدريسية في **مدينة المكلا - حضرموت**.
تم تصميم الواجهة الأمامية كنظام تطبيق صفحة واحدة (Single Page Application - SPA) خفيف وعالي الكفاءة، يعمل بدون أي أطر عمل ثقيلة ويعتمد على معايير الويب القياسية (Vanilla JS, HTML5, CSS3, Tailwind CSS CDN).

---

## 2. الهيكل المعماري للنظام (System Architecture)

```
منصة وصل التعليمية (Wasl Education)
├── العرض والمحتوى (Presentation Layer)
│   ├── index.html                  # حاوية التطبيق الرئيسية، تحميل الخطوط وتكوين Tailwind
│   ├── css/theme.css               # متغيرات التصميم (Design Tokens) والانتقالات
│   └── views/*.html                # القوالب الفردية للشاشات (12 واجهة مستقلة)
│
├── المنطق والتوجيه (Application Logic)
│   ├── js/views.js                 # سجل الواجهات البرمجية المدمجة (window.WASL_VIEWS)
│   ├── js/router.js                # محرك التوجيه وإدارة دورة حياة الانتقال (WaslRouter)
│   └── js/interactions.js          # السلوكيات التفاعلية، الفلاتر، وتخزين الحالة (WaslInteractions)
│
├── الخادم المحلي السريع (Local Dev Server)
│   └── server.js                   # خادم Node.js نقي (Pure Node.js) مع دعم SPA Fallback
│
└── الاختبار والتحقق (Verification)
    └── js/test_suite.js            # حزمة فحص تكامل المسارات والانتقالات والنطاق الجغرافي
```

---

## 3. محرك التوجيه والانتقالات (WaslRouter)

يعمل محرك التوجيه `WaslRouter` على مبدأ الـ Client-Side Routing عبر الآلية التالية:
1. **الاستماع للأحداث (Event Delegation):**
   - يتم رصد النقرات عبر السمة `data-path="<route-id>"`.
   - عند النقر، يتم استدعاء `router.navigate(routeId)`.
2. **شريط التقدم البصري (Progress Indicator):**
   - ينشط العنصر `#page-progress-bar` في أعلى الشاشة أثناء بدء الانتقال.
3. **تحديث الحاوية (DOM Replacement):**
   - تُفرغ الحاوية `#view-container` ثم يُحقن محتوى الواجهة المستهدفة من `window.WASL_VIEWS[routeId].html`.
4. **تحديث العنوان وسجل المتصفح (Browser History):**
   - يتم تحديث `document.title` و `window.location.hash = `#/${routeId}`.
5. **إطلاق أحداث دورة الحياة:**
   - يطلق الحدث `wasl:transition-start` قبل التبديل.
   - يطلق الحدث `wasl:transition-end` بعد التبديل لتمكين `WaslInteractions` من ربط العناصر التفاعلية.

---

## 4. نظام إدارة السلوكيات التفاعلية (WaslInteractions)

يقوم `WaslInteractions` بإعادة ربط التفاعلات عند استقبال حدث `wasl:transition-end`:
- **البحث والتصفية:** فلاتر التخصصات والمراحل التعليمية في واجهة البحث `find-teachers`.
- **النماذج التفاعلية:** إرسال طلب تواصل، طلب معلم عاجل، نشر وظيفة شاغرة.
- **التنبيهات اللحظية:** إطلاق إشعارات Toast عند نجاح العمليات.
- **معالجة محددات DOM الآمنة:** استخدام دوال مساعدة تمنع أخطاء `DOMException` عند البحث بالنصوص العربية.

---

## 5. النطاق الجغرافي الصارم (Geographical Scope)
تم حصر نطاق المنصة بالكامل لمدينة **المكلا** وضواحيها (الديس، الشرج، فوه، روكب، بويش، المكلا القديمة).
يُمنع منعاً باتاً استيراد أو تضمين مدن أخرى حفاظاً على هوية المنصة وتركيزها المحلي.

