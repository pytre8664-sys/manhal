-- ============================================================
-- MANHAL | منهل — Supabase schema
-- Run this in Supabase → SQL Editor (once).
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- 1) ADMINS (owner accounts)
-- ============================================================
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- ============================================================
-- 2) TEACHERS
-- ============================================================
create table if not exists public.teachers (
  id text primary key,
  name text not null,
  name_en text,
  subject text not null,
  grades text[] not null default '{}',
  district text not null,
  mode text not null default 'both',      -- inperson | online | both
  experience integer not null default 0,
  price integer not null default 0,
  rating numeric(2,1) not null default 0,
  reviews integer not null default 0,
  verified_identity boolean not null default false,
  verified_qualification boolean not null default false,
  verified_experience boolean not null default false,
  availability text not null default 'booked', -- instant | partial | booked
  match integer not null default 0,
  bio text,
  bio_en text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teachers_published_idx on public.teachers (published);
create index if not exists teachers_subject_idx on public.teachers (subject);
create index if not exists teachers_district_idx on public.teachers (district);

-- ============================================================
-- 3) REQUESTS (urgent / contact / job request)
-- ============================================================
create table if not exists public.requests (
  id text primary key,
  title text not null,
  type text not null default 'urgent',    -- urgent | job | contact
  status text not null default 'open',    -- open | review | accepted | closed
  date date not null default current_date,
  applicants integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists requests_status_idx on public.requests (status);

-- ============================================================
-- 4) VACANCIES
-- ============================================================
create table if not exists public.vacancies (
  id text primary key,
  title text not null,
  subject text not null,
  grade text not null,
  district text not null,
  type text not null default 'full',      -- full | part
  salary text,
  deadline date,
  description text,
  requirements text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- 5) updated_at trigger
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists teachers_touch on public.teachers;
create trigger teachers_touch before update on public.teachers
for each row execute function public.touch_updated_at();

drop trigger if exists requests_touch on public.requests;
create trigger requests_touch before update on public.requests
for each row execute function public.touch_updated_at();

drop trigger if exists vacancies_touch on public.vacancies;
create trigger vacancies_touch before update on public.vacancies
for each row execute function public.touch_updated_at();

-- ============================================================
-- 6) RLS
-- ============================================================
alter table public.admins enable row level security;
alter table public.teachers enable row level security;
alter table public.requests enable row level security;
alter table public.vacancies enable row level security;

-- admins: a user can read their own row (needed for the admin check)
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- teachers: public can read published only; admins full access
drop policy if exists "teachers public read" on public.teachers;
create policy "teachers public read" on public.teachers
  for select to anon, authenticated
  using (published = true);

drop policy if exists "teachers admin read all" on public.teachers;
create policy "teachers admin read all" on public.teachers
  for select to authenticated
  using (public.is_admin());

drop policy if exists "teachers admin write" on public.teachers;
create policy "teachers admin write" on public.teachers
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- requests: admins only
drop policy if exists "requests admin all" on public.requests;
create policy "requests admin all" on public.requests
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- vacancies: public reads published; admins full access
drop policy if exists "vacancies public read" on public.vacancies;
create policy "vacancies public read" on public.vacancies
  for select to anon, authenticated
  using (published = true);

drop policy if exists "vacancies admin all" on public.vacancies;
create policy "vacancies admin all" on public.vacancies
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 7) OPTIONAL: seed demo teachers (same as the demo data)
--    Remove if you want to start empty.
-- ============================================================
insert into public.teachers
  (id, name, name_en, subject, grades, district, mode, experience, price, rating, reviews,
   verified_identity, verified_qualification, verified_experience, availability, match, bio, bio_en, published)
values
  ('t1','أ. سارة بامطرف','Sara Bamatraf','math','{middle,secondary}','mukalla','both',9,4500,4.9,38,
   true,true,true,'instant',96,
   'معلمة رياضيات بخبرة تسع سنوات في المرحلة المتوسطة والثانوية، متخصصة في تبسيط الجبر والهندسة وبناء أساس قوي للطلاب.',
   'Mathematics teacher with nine years of experience in middle and secondary school, specialising in simplifying algebra and geometry.', true),
  ('t2','أ. أحمد بن سلمان','Ahmed bin Salman','physics','{secondary}','mukalla','inperson',12,5500,4.8,27,
   true,true,false,'partial',91,
   'مدرس فيزياء للمرحلة الثانوية، خبرة في تدريس المنهج اليمني والدولي، وتركيز على حل المسائل والتجارب العملية.',
   'Secondary physics teacher with experience in Yemeni and international curricula, focused on problem solving and practical experiments.', true),
  ('t3','أ. نورة العولقي','Noura Al-Awlaki','english','{primary,middle}','shihr','both',6,3500,4.9,44,
   true,true,true,'instant',94,
   'معلمة لغة إنجليزية متخصصة في المهارات الأساسية للمرحلة الابتدائية والمتوسطة، مع أنشطة تفاعلية ومتابعة أسبوعية.',
   'English teacher focused on core skills for primary and middle school, with interactive activities and weekly follow-up.', true),
  ('t4','أ. خالد الحبشي','Khalid Al-Habashi','ict','{middle,secondary}','mukalla','online',7,4000,4.7,19,
   true,false,false,'partial',87,
   'مدرّس حاسوب وبرمجة، يقدّم دروسًا عن بُعد في الأساسيات والبرمجة بلغة بايثون ومهارات الحاسب.',
   'Computer science and programming tutor offering online lessons in fundamentals and Python.', true),
  ('t5','أ. مريم باوزير','Maryam Bawazir','arabic','{primary,middle}','seiyun','inperson',11,3800,5.0,52,
   true,true,true,'instant',93,
   'معلمة لغة عربية بخبرة أحد عشر عامًا، متخصصة في القراءة والكتابة والإملاء وتأسيس الطلاب في المرحلة الابتدائية.',
   'Arabic teacher with eleven years of experience in reading, writing and foundational literacy for primary students.', true),
  ('t6','أ. عبدالله بن حفيظ','Abdullah bin Hafiz','chemistry','{secondary}','tarim','both',15,6000,4.8,31,
   true,true,true,'booked',84,
   'مدرس كيمياء للمرحلة الثانوية بخبرة خمسة عشر عامًا، مع متابعة نتائج الطلاب وتدريبات على أسئلة الاختبارات.',
   'Secondary chemistry teacher with fifteen years of experience, including exam practice and student progress tracking.', true),
  ('t7','أ. هند السقاف','Hind Al-Saqqaf','science','{primary,middle}','mukalla','both',5,3200,4.6,16,
   true,false,false,'instant',90,
   'معلمة علوم للمرحلة الابتدائية والمتوسطة، تعتمد الشرح المبسّط والأنشطة العملية لتقريب المفاهيم العلمية.',
   'Science teacher for primary and middle school, using simple explanations and hands-on activities.', true),
  ('t8','أ. ياسر بن عمر','Yasser bin Omar','social','{middle,secondary}','ghayl','inperson',8,3600,4.5,12,
   true,true,false,'partial',81,
   'مدرس دراسات اجتماعية وتاريخ، يهتم بربط المنهج بالسياق المحلي وتنمية مهارات التحليل لدى الطلاب.',
   'Social studies and history teacher who connects the curriculum to local context and builds analytical skills.', true)
on conflict (id) do nothing;
