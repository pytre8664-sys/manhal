const fs = require("fs");
let a = fs.readFileSync("legacy/js/i18n.js", "utf8");
a = a.replace(
  "const I18N = {",
  "export const I18N: Record<string, Record<string, string>> = {"
);
fs.writeFileSync("lib/i18n-data.ts", a);

let b = fs.readFileSync("legacy/js/data.js", "utf8");
b = b.replace(
  /^export const /gm,
  "export const "
);
b = b.replace(
  /^const (SUBJECTS|GRADES|DISTRICTS|MODES|TEACHERS|REQUESTS|TEACHER_REQUESTS|NOTIFICATIONS)/gm,
  "export const $1"
);
b = b.replace(
  /^const (SUBJ|GRADE|DIST)\b/gm,
  "export const $1"
);
b = b.replace(/^const MODE_LABEL/gm, "export const MODE_LABEL");
fs.writeFileSync("lib/data.ts", b);
console.log("i18n", a.length, "data", b.length);
