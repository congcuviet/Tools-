document.addEventListener('DOMContentLoaded', function () {

/* ===== PURE LOGIC START ===== */
/* Bộ máy gõ tiếng Việt: chuyển chuỗi phím thô (raw) của MỘT từ thành chữ có dấu.
   letters: {b: chữ gốc thường, q: 0=thường 1=mũ 2=trăng 3=móc 4=gạch(đ), up: viết hoa, lit: ký tự nguyên văn (số VNI ở đầu từ...)} */
var OVI_TONED = {
  'a': 'áàảãạ', 'ă': 'ắằẳẵặ', 'â': 'ấầẩẫậ',
  'e': 'éèẻẽẹ', 'ê': 'ếềểễệ', 'i': 'íìỉĩị',
  'o': 'óòỏõọ', 'ô': 'ốồổỗộ', 'ơ': 'ớờởỡợ',
  'u': 'úùủũụ', 'ư': 'ứừửữự', 'y': 'ýỳỷỹỵ'
};
var OVI_QUALITY = {
  a: { 0: 'a', 1: 'â', 2: 'ă' },
  e: { 0: 'e', 1: 'ê' },
  o: { 0: 'o', 1: 'ô', 3: 'ơ' },
  u: { 0: 'u', 3: 'ư' },
  d: { 0: 'd', 4: 'đ' }
};
var OVI_VOWELS = 'aeiouy';
function oviIsVowel(l) { return !l.lit && OVI_VOWELS.indexOf(l.b) >= 0; }

function oviRenderWord(letters, tone, oldStyle) {
  if (!letters.length) return '';
  /* Cụm nguyên âm: từ nguyên âm đầu tiên tới nguyên âm cuối cùng */
  var vi = [];
  for (var i = 0; i < letters.length; i++) if (oviIsVowel(letters[i])) vi.push(i);
  var target = -1;
  if (tone && vi.length) {
    var cluster = vi.slice();
    /* u sau q là âm đệm (quà, quốc) — trừ khi nó là nguyên âm duy nhất */
    if (letters[0].b === 'q' && letters[1] && letters[1].b === 'u' && cluster.length > 1 && cluster[0] === 1) cluster.shift();
    /* i của "gi" là phụ âm khi còn nguyên âm khác phía sau (giêng, giữ); "gì" thì i là nguyên âm chính */
    if (letters[0].b === 'g' && letters[1] && letters[1].b === 'i' && cluster.length > 1 && cluster[0] === 1) cluster.shift();
    var clusterStr = cluster.map(function (ix) { return letters[ix].b; }).join('');
    var marked = cluster.filter(function (ix) { return letters[ix].q === 1 || letters[ix].q === 2 || letters[ix].q === 3; });
    var hasFinal = cluster.length && (cluster[cluster.length - 1] < letters.length - 1);
    if (marked.length) target = marked[marked.length - 1];
    else if (clusterStr === 'oa' || clusterStr === 'oe') target = hasFinal ? (oldStyle ? cluster[0] : cluster[cluster.length - 1]) : (oldStyle ? cluster[cluster.length - 1] : cluster[0]);
    else if (clusterStr === 'uy') target = hasFinal ? cluster[cluster.length - 1] : (oldStyle ? cluster[cluster.length - 1] : cluster[0]);
    else if (cluster.length >= 3) target = cluster[1];
    else if (hasFinal) target = cluster[cluster.length - 1];
    else target = cluster[0];
  }
  var out = '';
  for (var j = 0; j < letters.length; j++) {
    var l = letters[j], ch;
    if (l.lit) ch = l.b;
    else {
      var qc = (OVI_QUALITY[l.b] && OVI_QUALITY[l.b][l.q]) || l.b;
      ch = (j === target && tone) ? OVI_TONED[qc].charAt(tone - 1) : qc;
      if (l.up) ch = ch.toUpperCase();
    }
    out += ch;
  }
  return out.normalize('NFC');
}

var OVI_TELEX_TONES = { s: 1, f: 2, r: 3, x: 4, j: 5 };
function oviTelexLetters(raw) {
  var letters = [], tone = 0, prevLetterKey = false;
  function hasVowel() { return letters.some(oviIsVowel); }
  function last() { return letters[letters.length - 1]; }
  for (var i = 0; i < raw.length; i++) {
    var ch = raw[i], lc = ch.toLowerCase(), up = ch !== lc;
    if (OVI_TELEX_TONES[lc] && hasVowel()) {
      var t = OVI_TELEX_TONES[lc];
      if (tone === t) { tone = 0; letters.push({ b: lc, q: 0, up: up }); }
      else tone = t;
      continue;
    }
    if (lc === 'z' && (tone || letters.some(function (l) { return l.q === 1 || l.q === 2 || l.q === 3; }))) {
      tone = 0;
      letters.forEach(function (l) { if (l.q !== 4) l.q = 0; });
      continue;
    }
    if (lc === 'w') {
      var L = last();
      if (prevLetterKey && L && !L.lit && L.q === 0 && (L.b === 'a' || L.b === 'o' || L.b === 'u')) {
        L.q = (L.b === 'a') ? 2 : 3;
        if (L.b === 'o') { /* uow -> ươ: móc luôn u đứng ngay trước o */
          var P = letters[letters.length - 2];
          if (P && !P.lit && P.b === 'u' && P.q === 0) P.q = 3;
        }
        continue;
      }
      if (!letters.length || !oviIsVowel(last())) {
        letters.push({ b: 'u', q: 3, up: up }); prevLetterKey = true; continue;
      }
      letters.push({ b: 'w', q: 0, up: up }); prevLetterKey = true; continue;
    }
    if ((lc === 'a' || lc === 'e' || lc === 'o') && prevLetterKey && last() && !last().lit && last().b === lc && last().q === 0) {
      last().q = 1; continue;
    }
    if (lc === 'd' && prevLetterKey && last() && !last().lit && last().b === 'd' && last().q === 0) {
      last().q = 4; continue;
    }
    letters.push({ b: lc, q: 0, up: up });
    prevLetterKey = true;
  }
  return { letters: letters, tone: tone };
}

function oviVniLetters(raw) {
  var letters = [], tone = 0, pending = [];
  function hasRealLetter() { return letters.some(function (l) { return !l.lit; }); }
  function applyQuality(op) {
    var targets = { '6': 'aeo', '7': 'uo', '8': 'a', '9': 'd' };
    var qv = { '6': 1, '7': 3, '8': 2, '9': 4 };
    for (var i = letters.length - 1; i >= 0; i--) {
      var l = letters[i];
      if (!l.lit && l.q === 0 && targets[op].indexOf(l.b) >= 0) { l.q = qv[op]; return true; }
    }
    return false;
  }
  for (var i = 0; i < raw.length; i++) {
    var ch = raw[i], lc = ch.toLowerCase(), up = ch !== lc;
    if (ch >= '0' && ch <= '9') {
      if (!hasRealLetter()) { letters.push({ b: ch, q: 0, up: false, lit: true }); continue; }
      if (ch >= '1' && ch <= '5') {
        var t = parseInt(ch, 10);
        if (tone === t) { tone = 0; letters.push({ b: ch, q: 0, up: false, lit: true }); }
        else tone = t;
        continue;
      }
      if (ch === '0') {
        tone = 0;
        letters.forEach(function (l) { if (l.q !== 4) l.q = 0; });
        continue;
      }
      if (!applyQuality(ch)) pending.push(ch);
      continue;
    }
    var nl = { b: lc, q: 0, up: up };
    letters.push(nl);
    if (pending.length) {
      var rest = [];
      pending.forEach(function (op) {
        var targets = { '6': 'aeo', '7': 'uo', '8': 'a', '9': 'd' };
        var qv = { '6': 1, '7': 3, '8': 2, '9': 4 };
        if (nl.q === 0 && targets[op].indexOf(nl.b) >= 0) nl.q = qv[op]; else rest.push(op);
      });
      pending = rest;
    }
  }
  return { letters: letters, tone: tone };
}

function oviTransformWord(raw, method, oldStyle) {
  if (!raw) return '';
  var r = method === 'vni' ? oviVniLetters(raw) : oviTelexLetters(raw);
  return oviRenderWord(r.letters, r.tone, !!oldStyle);
}
/* ===== PURE LOGIC END ===== */

  function $(id) { return document.getElementById(id); }
  var inputEl = $('ovi-input'), countEl = $('ovi-count'), savedEl = $('ovi-saved');
  var state = { method: 'telex', oldStyle: false, segStart: 0, raw: '', segLen: 0 };

  try {
    state.method = localStorage.getItem('ovi-method') || 'telex';
    state.oldStyle = localStorage.getItem('ovi-style') === 'old';
    var draft = localStorage.getItem('ovi-draft');
    if (draft) inputEl.value = draft;
  } catch (e) {}

  function syncChips() {
    document.querySelectorAll('[data-ovi-method]').forEach(function (b) {
      b.classList.toggle('ovi-chip-active', b.getAttribute('data-ovi-method') === state.method);
    });
    document.querySelectorAll('[data-ovi-style]').forEach(function (b) {
      b.classList.toggle('ovi-chip-active', (b.getAttribute('data-ovi-style') === 'old') === state.oldStyle);
    });
  }
  function savePrefs() {
    try {
      localStorage.setItem('ovi-method', state.method);
      localStorage.setItem('ovi-style', state.oldStyle ? 'old' : 'new');
    } catch (e) {}
  }
  var saveTimer = null;
  function afterChange() {
    var v = inputEl.value;
    var words = v.trim() ? v.trim().split(/\s+/).length : 0;
    countEl.textContent = v.length + ' ký tự · ' + words + ' từ';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem('ovi-draft', v); } catch (e) {}
      savedEl.textContent = '💾 Đã lưu nháp tự động trên máy này';
    }, 500);
  }
  function lockSegment() { state.raw = ''; state.segLen = 0; state.segStart = inputEl.selectionStart || 0; }

  function replaceSegment(rendered) {
    var v = inputEl.value;
    var start = state.segStart, end = start + state.segLen;
    inputEl.value = v.slice(0, start) + rendered + v.slice(end);
    state.segLen = rendered.length;
    var caret = start + rendered.length;
    inputEl.setSelectionRange(caret, caret);
    afterChange();
  }
  function insertBoundary(ch) {
    var v = inputEl.value;
    var s = inputEl.selectionStart || 0, e = inputEl.selectionEnd || 0;
    inputEl.value = v.slice(0, s) + ch + v.slice(e);
    inputEl.setSelectionRange(s + ch.length, s + ch.length);
    lockSegment(); state.segStart = s + ch.length;
    afterChange();
  }

  inputEl.addEventListener('keydown', function (e) {
    if (state.method === 'off' || e.ctrlKey || e.metaKey || e.altKey) return;
    var key = e.key;
    if (key === 'Backspace') {
      if (state.raw.length > 0 && (inputEl.selectionStart || 0) === state.segStart + state.segLen && inputEl.selectionStart === inputEl.selectionEnd) {
        e.preventDefault();
        state.raw = state.raw.slice(0, -1);
        replaceSegment(oviTransformWord(state.raw, state.method, state.oldStyle));
      } else lockSegment();
      return;
    }
    if (key === 'Enter') { e.preventDefault(); insertBoundary('\n'); return; }
    if (key.length !== 1) { lockSegment(); return; }
    var isWordChar = state.method === 'vni' ? /[a-zA-Z0-9]/.test(key) : /[a-zA-Z]/.test(key);
    if (!isWordChar) { e.preventDefault(); insertBoundary(key); return; }
    e.preventDefault();
    var s = inputEl.selectionStart || 0, en = inputEl.selectionEnd || 0;
    if (s !== en || s !== state.segStart + state.segLen) { state.segStart = s; state.raw = ''; state.segLen = 0; if (s !== en) { inputEl.value = inputEl.value.slice(0, s) + inputEl.value.slice(en); inputEl.setSelectionRange(s, s); } }
    state.raw += key;
    replaceSegment(oviTransformWord(state.raw, state.method, state.oldStyle));
  });
  inputEl.addEventListener('click', lockSegment);
  inputEl.addEventListener('input', function () { if (state.method === 'off') afterChange(); });

  document.querySelectorAll('[data-ovi-method]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.method = b.getAttribute('data-ovi-method');
      savePrefs(); syncChips(); lockSegment(); inputEl.focus();
    });
  });
  document.querySelectorAll('[data-ovi-style]').forEach(function (b) {
    b.addEventListener('click', function () {
      state.oldStyle = b.getAttribute('data-ovi-style') === 'old';
      savePrefs(); syncChips(); inputEl.focus();
    });
  });
  $('ovi-btn-copy').addEventListener('click', function () {
    var btn = this;
    function done() { btn.textContent = '✅ Đã sao chép!'; setTimeout(function () { btn.textContent = '📋 Sao chép'; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(inputEl.value).then(done, done);
    else { inputEl.select(); document.execCommand('copy'); done(); }
    lockSegment();
  });
  $('ovi-btn-download').addEventListener('click', function () {
    var blob = new Blob([inputEl.value], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'van-ban-tieng-viet-congcuviet.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  });
  $('ovi-btn-clear').addEventListener('click', function () {
    inputEl.value = ''; lockSegment(); afterChange(); inputEl.focus();
  });
  $('ovi-btn-sample').addEventListener('click', function () {
    var sample = 'Công Cụ Việt — gõ tiếng Việt thật dễ, chẳng cần cài thêm phần mềm! ';
    var v = inputEl.value;
    var s = inputEl.selectionStart || v.length;
    if (s > 0 && !/\s/.test(v.charAt(s - 1))) sample = ' ' + sample;
    inputEl.value = v.slice(0, s) + sample + v.slice(s);
    inputEl.setSelectionRange(s + sample.length, s + sample.length);
    lockSegment(); state.segStart = s + sample.length;
    afterChange(); inputEl.focus();
  });

  syncChips();
  afterChange();
});
