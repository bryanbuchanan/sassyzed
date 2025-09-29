/* ---------- ERROR (ESLint: no-undef) ---------- */
console.log(notDefinedVar) // no-undef -> Error

/* ---------- WARNING (ESLint: no-unused-vars) ---------- */
const unused = 123 // Warning

/* ---------- WARNING (ESLint: eqeqeq) ---------- */
if ('5' == 5) { console.log('loose equality') } // Warning

/* ---------- INFO (deprecated API example) ---------- */
/**
 * @deprecated Use `newApi` instead
 */
function oldApi() { return 1 }
function newApi() { return 2 }
oldApi() // ESLint with `deprecated` rule plugin can mark this as Info

/* ---------- HINT / SUGGESTION (prefer-const, no-var) ---------- */
var count = 1 // ESLint: no-var -> Suggestion/Hint
let maybeConst = 2 // prefer-const -> Hint
maybeConst  3