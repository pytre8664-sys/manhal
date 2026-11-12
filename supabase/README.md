# إعداد Supabase ولوحة الإدارة | MANHAL admin setup

هذه الخطوات مرّة واحدة فقط، وتمكّنك من إضافة بيانات حقيقية تظهر في الموقع العام.

> **مهم:** لوحة الإدارة `/admin` لا تعمل إلا بعد ربط Supabase. بدون الربط يظهر الموقع العام ببيانات تجريبية موسومة بوضوح.

---

## 1) أنشئ مشروع Supabase

1. ادخلي إلى <https://supabase.com> وأنشئي مشروعًا جديدًا (مجاني).
2. من **Project Settings → API** انسخي:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) أنشئي الجداول وسياسات الأمان

1. افتحي **SQL Editor** في Supabase.
2. انسخي محتوى الملف [`schema.sql`](./schema.sql) والصقيه ثم اضغطي **Run**.
3. هذا ينشئ جداول `admins`, `teachers`, `requests`, `vacancies` مع سياسات RLS ودالة `is_admin()`.

## 3) أنشئي حسابك كصاحبة المنصة

1. من **Authentication → Users → Add user** أنشئي مستخدمًا بريدك وكلمة مرور قوية.
   - أو من صفحة `/admin` استخدمي **Sign up** أولًا إن فعّلتِ التسجيل، ثم عودي لهذه الخطوة.
2. انسخي `User UID` للحساب.
3. نفّذي في SQL Editor (استبدلي القيم):

```sql
insert into public.admins (user_id, email)
values ('ضعي-هنا-UID-الحساب', 'بريدك@example.com')
on conflict (user_id) do nothing;
```

الآن هذا الحساب فقط يستطيع القراءة/الكتابة في اللوحة، بفضل RLS.

## 4) أضيفي متغيرات البيئة محليًا

```bash
cp .env.example .env.local
```

ثم عدّلي `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

شغّلي الموقع:

```bash
npm run dev
```

ثم افتحي <http://localhost:3000/admin> وسجّلي الدخول بحساب المشرفة.

## 5) على GitHub Pages

أضيفي المتغيرين كـ **Repository secrets**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

من: **Settings → Secrets and variables → Actions → New repository secret**.

سير العمل `.github/workflows/deploy.yml` يبني الموقع بمتغير `NEXT_PUBLIC_BASE_PATH=/manhal` وينشر مجلد `out/` تلقائيًا عند كل دفع إلى `main`.

> متغيرات `NEXT_PUBLIC_*` تُضمَّن داخل ملفات JavaScript عند البناء، و`anon key` مفتاح عام مصمَّم للاستخدام في المتصفح؛ لذلك الأمان الحقيقي يأتي من سياسات RLS وليس من إخفاء المفتاح.

---

## بنية قاعدة البيانات

| الجدول | الغرض | قراءة عامة | كتابة |
|---|---|---|---|
| `teachers` | ملفات المعلمين | المنشور فقط (`published = true`) | المشرفة فقط |
| `requests` | الطلبات العاجلة/الوظائف/التواصل | لا | المشرفة فقط |
| `vacancies` | الوظائف | المنشور فقط | المشرفة فقط |
| `admins` | حسابات الإدارة | صاحب الحساب فقط | المشرفة فقط (SQL) |

## إدارة البيانات من اللوحة

من `/admin` بعد الدخول:

- **المعلمون:** إضافة/تعديل/حذف، تفعيل التوثيق (هوية/مؤهل/خبرة)، النشر أو الإخفاء.
- **الطلبات:** إضافة وتحديث الحالة (مفتوح/مراجعة/مقبول/مغلق).
- **الوظائف:** إضافة وتعديل والنشر.
- **نظرة عامة:** إحصاءات فورية.

كل تغيير يُحفظ مباشرة في Supabase ويظهر في الموقع العام بعد إعادة تحميل الصفحة (النشر يتطلب تحديث الصفحة فقط، وليس إعادة بناء، لأن القراءة تجري من Supabase وقت فتح الصفحة).

## ملاحظات أمان

- لا تضعي أبدًا `service_role key` في متغيرات `NEXT_PUBLIC_*`.
- شارة «موثّق» لا تُمنح إلا عند تفعيلها يدويًا بعد التحقق الفعلي.
- الدفع (إن أُضيف لاحقًا) لا يؤثر على ترتيب النتائج.
