# منهل | MANHAL

منصة تعليمية عربية **RTL** تربط **المدارس** و**أولياء الأمور** بـ**المعلمين والمعلمات**:
بحث مرتب حسب المطابقة، نشر وظائف، طلب معلم عاجل، ملفات مهنية موثّقة، ولوحات تحكم لكل دور.

**الموقع المباشر:** <https://pytre8664-sys.github.io/manhal/>

> نسخة **Next.js 15** (App Router + TypeScript) مع تصدير ثابت (`output: "export"`) وقاعدة بيانات **Supabase** اختيارية. عند عدم ربط Supabase يعمل الموقع ببيانات تجريبية موسومة بوضوح.

---

## المزايا

- **عربي RTL افتراضيًا** مع تبديل كامل إلى الإنجليزية LTR.
- نظام تصميم موحّد وفق `docs/DESIGN.md`: لون أساسي `#6D28D9`، خطوط Plus Jakarta Sans + IBM Plex Sans Arabic.
- بحث وفلاتر وترتيب، ملفات معلمين، طلب عاجل، نشر وظائف.
- لوحات تحكم للمدرسة وولي الأمر والمعلم.
- **لوحة إدارة خاصة بصاحبة المنصة** على `/admin` لإضافة بيانات حقيقية وإدارتها.
- شارة «موثّق» لا تظهر إلا عند تفعيل التوثيق فعليًا، والدفع لا يرفع الترتيب.
- وصولية: تخطي للمحتوى، تسميات ARIA، تنقل بلوحة المفاتيح، حالات فارغة واضحة.

---

## التشغيل محليًا

```bash
npm install
npm run dev
```

ثم افتح: <http://localhost:3000>

### أوامر أخرى

```bash
npm run typecheck   # فحص TypeScript
npm run build       # بناء وتصدير ثابت إلى out/
```

---

## ربط Supabase ولوحة الإدارة

1. راجعي الدليل الكامل: [`supabase/README.md`](./supabase/README.md).
2. انسخي `.env.example` إلى `.env.local` وأضيفي:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. نفّذي [`supabase/schema.sql`](./supabase/schema.sql) في SQL Editor.
4. أضيفي حسابك إلى جدول `admins`.
5. افتحي `/admin` وسجّلي الدخول.

بدون هذه المتغيرات يظهر الموقع العام ببيانات تجريبية، وتظهر في `/admin` شاشة إعداد توضّح المطلوب.

---

## النشر على GitHub Pages

- المستودع: `pytre8664-sys/manhal`
- سير العمل: `.github/workflows/deploy.yml`
- يُبنى الموقع بـ `NEXT_PUBLIC_BASE_PATH=/manhal` ويُنشر مجلد `out/` تلقائيًا عند كل دفع إلى `main`.
- أضيفي `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` كـ Repository secrets.
- لتفعيل هذا النمط: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

أي تغيير في بيانات Supabase يظهر في الموقع مباشرة بعد تحديث الصفحة؛ لا حاجة لإعادة البناء.

---

## بنية المشروع

```
app/
  (site)/            صفحات الموقع العام (RTL + لوحات الأدوار)
  admin/             لوحة إدارة صاحبة المنصة (محميّة)
  layout.tsx         الجذر: الخطوط، اللغة، التوست
components/          Header, Footer, TeacherCard, DashShell, Icon, Providers
lib/
  i18n.ts            قاموس الترجمة + مفاتيح اللوحة
  data.ts            البيانات التجريبية (موسومة)
  store.ts           قراءة/كتابة Supabase
  supabase.ts        عميل Supabase
  paths.ts           دعم basePath على GitHub Pages
supabase/
  schema.sql         الجداول + RLS + دالة is_admin()
  README.md          خطوات الإعداد
docs/                DESIGN.md و UX-STUDY.md
legacy/              نسخة HTML الثابتة السابقة (مرجع فقط، غير منشورة)
```

---

## ملاحظات

- البيانات التجريبية في `lib/data.ts` **ليست بيانات أشخاص حقيقيين** وتظهر مع تنبيه «بيانات تجريبية».
- مفاتيح `NEXT_PUBLIC_*` تُضمَّن وقت البناء؛ استخدمي `anon key` فقط، والأمان عبر سياسات RLS. لا تضعي `service_role` أبدًا.
- التصميم والدراسة: [`docs/DESIGN.md`](./docs/DESIGN.md) و [`docs/UX-STUDY.md`](./docs/UX-STUDY.md).
