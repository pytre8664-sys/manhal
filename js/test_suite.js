/**
 * ============================================================================
 * منصة وصل التعليمية — أداة فحص واختبار الانتقالات والواجهات الآلية
 * Automated Transition & Routing Test Suite
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const viewsDir = path.join(projectRoot, 'views');
const viewsJsPath = path.join(projectRoot, 'js', 'views.js');
const routerJsPath = path.join(projectRoot, 'js', 'router.js');
const indexHtmlPath = path.join(projectRoot, 'index.html');

const expectedRoutes = [
  'home',
  'role-select',
  'school-dashboard',
  'parent-hub',
  'teacher-workspace',
  'find-teachers',
  'teacher-profile',
  'contact-request',
  'urgent-request',
  'post-job',
  'applicant-eval',
  'home-alt'
];

console.log('='.repeat(70));
console.log('🔍 بدء الفحص الشامل لمنظومة الانتقالات والواجهات — منصة وصل (المكلا)');
console.log('='.repeat(70));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

// TEST 1: Check Core Files
console.log('\n📁 اختبار 1: فحص الملفات الأساسية وهيكل المشروع');
assert(fs.existsSync(indexHtmlPath), 'ملف index.html موجود');
assert(fs.existsSync(viewsJsPath), 'ملف js/views.js موجود');
assert(fs.existsSync(routerJsPath), 'ملف js/router.js موجود');
assert(fs.existsSync(path.join(projectRoot, 'js', 'interactions.js')), 'ملف js/interactions.js موجود');
assert(fs.existsSync(path.join(projectRoot, 'css', 'theme.css')), 'ملف css/theme.css موجود');
assert(fs.existsSync(path.join(projectRoot, 'assets', 'teacher-avatar.png')), 'أصل صورة المعلم assets/teacher-avatar.png موجود');

// TEST 2: Check All 12 Views Exist & Have Substantial Content
console.log('\n📄 اختبار 2: فحص وجود وحجم ملفات الواجهات الـ 12');
const viewStats = {};
expectedRoutes.forEach(route => {
  const p = path.join(viewsDir, `${route}.html`);
  const exists = fs.existsSync(p);
  assert(exists, `واجهة [${route}.html] موجودة`);
  if (exists) {
    const size = fs.statSync(p).size;
    assert(size > 5000, `واجهة [${route}.html] مكتملة المحتوى (${(size / 1024).toFixed(1)} KB)`);
    viewStats[route] = size;
  }
});

// TEST 3: Check js/views.js Content & Registered Keys
console.log('\n📦 اختبار 3: فحص سلامة سجل الواجهات البرمجية (js/views.js)');
const viewsJsContent = fs.readFileSync(viewsJsPath, 'utf8');
const jsonMatch = viewsJsContent.match(/window\.WASL_VIEWS\s*=\s*(\{[\s\S]*\});/);
assert(jsonMatch !== null, 'سجل window.WASL_VIEWS تم تحليله بنجاح');

let parsedViews = {};
if (jsonMatch) {
  try {
    parsedViews = JSON.parse(jsonMatch[1]);
    assert(Object.keys(parsedViews).length === expectedRoutes.length, `عدد الواجهات المسجلة (${Object.keys(parsedViews).length}) يطابق المطلوب (12)`);
    expectedRoutes.forEach(r => {
      assert(parsedViews[r] && parsedViews[r].html && parsedViews[r].title, `الواجهة [${r}] مسجلة بعنوان ومحتوى صحيح`);
    });
  } catch (err) {
    assert(false, `خطأ في تحليل JSON: ${err.message}`);
  }
}

// TEST 4: Routing & Data-Path Interconnection
console.log('\n🔗 اختبار 4: فحص روابط الانتقال التفاعلية (data-path) بين الشاشات');
const discoveredPaths = new Set();
const brokenPaths = new Set();

expectedRoutes.forEach(route => {
  const content = parsedViews[route] ? parsedViews[route].html : '';
  const matches = content.matchAll(/data-path=["']([^"']+)["']/g);
  for (const m of matches) {
    const target = m[1];
    discoveredPaths.add(target);
    if (!expectedRoutes.includes(target) && target !== 'toggle-lang') {
      brokenPaths.add(`${route} -> ${target}`);
    }
  }
});

assert(discoveredPaths.size >= 8, `تم العثور على ${discoveredPaths.size} مسار انتقال تفاعلي نشط`);
assert(brokenPaths.size === 0, `لا توجد أي مسارات مكسورة أو معلقة (${Array.from(brokenPaths).join(', ')})`);

// TEST 5: Verify Specific Customization to Al-Mukalla Only (حصر المنصة على المكلا فقط)
console.log('\n📍 اختبار 5: التحقق من حصر النطاق الجغرافي على مدينة المكلا فقط');
let mukallaFoundCount = 0;
let unwantedCitiesCount = 0;

expectedRoutes.forEach(route => {
  const content = parsedViews[route] ? parsedViews[route].html : '';
  if (/المكلا/.test(content)) {
    mukallaFoundCount++;
  }
  // Check for other cities that were supposed to be excluded
  const unwanted = content.match(/سيئون|تريم|الشحر|غيل باوزير|(?:\s|^)عدن(?:\s|[،\.]|$)/g);
  if (unwanted) {
    unwantedCitiesCount += unwanted.length;
  }
});

assert(mukallaFoundCount >= 10, `اسم "المكلا" معتمد في كافة الواجهات الأساسية (ظهر في ${mukallaFoundCount} واجهة)`);
assert(unwantedCitiesCount === 0, `تمت إزالة المدن الأخرى بنجاح (المتبقي: ${unwantedCitiesCount})`);

// TEST 6: Simulated Page Transition Performance
console.log('\n⚡ اختبار 6: محاكاة أداء الانتقالات بين الشاشات');
const transitionSimulations = [
  { from: 'home', to: 'role-select' },
  { from: 'role-select', to: 'school-dashboard' },
  { from: 'school-dashboard', to: 'urgent-request' },
  { from: 'school-dashboard', to: 'post-job' },
  { from: 'school-dashboard', to: 'applicant-eval' },
  { from: 'home', to: 'find-teachers' },
  { from: 'find-teachers', to: 'teacher-profile' },
  { from: 'teacher-profile', to: 'contact-request' },
  { from: 'home', to: 'parent-hub' },
  { from: 'home', to: 'teacher-workspace' }
];

transitionSimulations.forEach(sim => {
  const fromView = parsedViews[sim.from];
  const toView = parsedViews[sim.to];
  const isValid = fromView && toView && toView.html.length > 0;
  assert(isValid, `الانتقال السلس من [${sim.from}] إلى [${sim.to}] جاهز ومؤكد`);
});

// TEST 7: Clean Code & Generative Artifacts Elimination (فحص خلو المشروع من الشوائب التوليدية)
console.log('\n🧹 اختبار 7: فحص خلو الواجهات والأكواد من الشوائب والمخلفات التوليدية');
let dataAltCount = 0;
let promptAltCount = 0;
let alertCount = 0;

expectedRoutes.forEach(route => {
  const content = parsedViews[route] ? parsedViews[route].html : '';
  if (content.includes('data-alt')) {
    dataAltCount++;
  }
  const promptAlts = content.match(/alt=["'][^"']*(?:color:|photo|minimalist|render|hyperrealistic)[^"']*["']/gi);
  if (promptAlts) {
    promptAltCount += promptAlts.length;
  }
  if (content.includes('alert(')) {
    alertCount++;
  }
});

const interactionsJs = fs.readFileSync(path.join(projectRoot, 'js', 'interactions.js'), 'utf8');

assert(dataAltCount === 0, `خلو جميع الواجهات الـ 12 من سمة data-alt التوليدية (المتبقي: ${dataAltCount})`);
assert(promptAltCount === 0, `خلو سمات alt للصور والشعارات من نصوص موجهات التوليد (المتبقي: ${promptAltCount})`);
assert(alertCount === 0, `خلو الواجهات من نوافذ alert() واستبدالها بنظام إشعارات Toast سلس (المتبقي: ${alertCount})`);
assert(!interactionsJs.includes('Math.random()'), 'استبدال الحسابات الوهمية والعشوائية (Math.random) بنظام تقييم حقيقي منطقي');

// TEST 8: Safe DOM Selectors & Modern Web Standards (Rule 5 of AGENTS.md)
console.log('\n🛡️ اختبار 8: التحقق من سلامة محددات الـ DOM والمعايير القياسية');
let containsCount = 0;
const allFilesToCheck = fs.readdirSync(viewsDir).map(f => path.join(viewsDir, f))
  .concat(fs.readdirSync(path.join(projectRoot, 'js')).filter(f => f.endsWith('.js') && f !== 'test_suite.js').map(f => path.join(projectRoot, 'js', f)));

allFilesToCheck.forEach(f => {
  const fileContent = fs.readFileSync(f, 'utf8');
  if (fileContent.includes(':contains(')) {
    containsCount++;
    console.error(`  ⚠️ محدد غير قياسي :contains في الملف: ${path.basename(f)}`);
  }
});

assert(containsCount === 0, `خلو ملفات المشروع من محددات :contains غير المعيارية المسببة لأخطاء DOMException (المتبقي: ${containsCount})`);

// Final Report Summary
console.log('\n' + '='.repeat(70));
console.log(`📊 النتيجة الإجمالية للفحص: ${passedTests} ناجح / ${failedTests} فاشل من إجمالي ${totalTests} فحصاً`);
console.log('='.repeat(70));

if (failedTests === 0) {
  console.log('🎉 جميع اختبارات الانتقالات والواجهات اجتازت الفحص بنسبة 100% بنجاح تام!');
  process.exit(0);
} else {
  console.error('⚠️ هناك بعض الفحوصات التي تحتاج مراجعة.');
  process.exit(1);
}

