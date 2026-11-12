/**
 * منصة وصل التعليمية — أداة مزامنة القوالب الفردية مع سجل الواجهات المجمعة
 * Sync script between individual views/ and js/views.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const viewsDir = path.join(projectRoot, 'views');
const viewsJsPath = path.join(projectRoot, 'js', 'views.js');

const viewsJs = fs.readFileSync(viewsJsPath, 'utf8');
const match = viewsJs.match(/window\.WASL_VIEWS\s*=\s*(\{[\s\S]*\});/);

if (!match) {
  console.error('❌ يتعذر تحليل كائن window.WASL_VIEWS في ملف js/views.js');
  process.exit(1);
}

const obj = JSON.parse(match[1]);
let updatedCount = 0;

for (const key of Object.keys(obj)) {
  const filePath = path.join(viewsDir, `${key}.html`);
  if (fs.existsSync(filePath)) {
    obj[key].html = fs.readFileSync(filePath, 'utf8');
    updatedCount++;
  }
}

const header = `/**
 * منصة وصل التعليمية — سجل الواجهات الكاملة المجمعة (المكلا فقط)
 * يتيح التعديل والتخصيص البشري مع دعم المعاينة والانتقالات الفورية
 */
window.WASL_VIEWS = `;

fs.writeFileSync(viewsJsPath, header + JSON.stringify(obj, null, 2) + ';\n', 'utf8');
console.log(`✅ تم تحديث ومزامنة ${updatedCount} واجهة بنجاح إلى ملف js/views.js.`);
