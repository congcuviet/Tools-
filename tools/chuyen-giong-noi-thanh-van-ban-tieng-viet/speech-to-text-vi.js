document.addEventListener('DOMContentLoaded', function () {

/* ===== PURE LOGIC START ===== */
/* Lệnh dấu câu bằng giọng nói: khớp theo cụm âm tiết (tiếng Việt tách từ bằng khoảng trắng) */
var STT_PHRASES = [
  [['xuống', 'dòng'], '\n'],
  [['chấm', 'phẩy'], ';'],
  [['chấm', 'hỏi'], '?'],
  [['chấm', 'than'], '!'],
  [['dấu', 'chấm'], '.'],
  [['dấu', 'phẩy'], ','],
  [['dấu', 'hỏi'], '?'],
  [['dấu', 'than'], '!'],
  [['hai', 'chấm'], ':'],
  [['mở', 'ngoặc'], '('],
  [['đóng', 'ngoặc'], ')']
];
var STT_SINGLE = { 'chấm': '.', 'phẩy': ',' };
function sttStripToken(tok) { return tok.replace(/[.,!?;:]+$/, ''); }
function sttApplyCommands(text) {
  var raw = String(text).split(/\s+/).filter(function (t) { return t !== ''; });
  var out = ''; /* chuỗi kết quả */
  function pushWord(w) {
    if (out === '' || /\n$/.test(out) || /\($/.test(out)) out += w;
    else out += ' ' + w;
  }
  function pushPunct(p) {
    if (p === '\n') { out = out.replace(/\s+$/, '') + '\n'; return; }
    if (p === '(') { out = (out === '' || /\n$/.test(out)) ? out + '(' : out + ' ('; return; }
    out = out.replace(/\s+$/, '') + p;
  }
  var i = 0;
  while (i < raw.length) {
    var matched = false;
    for (var k = 0; k < STT_PHRASES.length; k++) {
      var ph = STT_PHRASES[k][0];
      if (i + ph.length <= raw.length) {
        var okm = true;
        for (var j = 0; j < ph.length; j++) {
          if (sttStripToken(raw[i + j]).toLowerCase() !== ph[j]) { okm = false; break; }
        }
        if (okm) { pushPunct(STT_PHRASES[k][1]); i += ph.length; matched = true; break; }
      }
    }
    if (matched) continue;
    var single = STT_SINGLE[sttStripToken(raw[i]).toLowerCase()];
    if (single) { pushPunct(single); i++; continue; }
    pushWord(raw[i]); i++;
  }
  return out;
}
/* Chuẩn hóa: bỏ khoảng trắng thừa, khoảng trắng trước dấu câu, viết hoa đầu câu */
function sttTidy(text) {
  var s = String(text);
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\s+([,.!?;:%\)])/g, '$1');
  s = s.replace(/([.!?])(?=[A-Za-zÀ-ỹ])/g, '$1 ');
  s = s.replace(/\(\s+/g, '(');
  s = s.replace(/([.!?]\s+|\n\s*|^\s*)([a-zà-ỹ])/g, function (m, pre, ch) { return pre + ch.toUpperCase(); });
  return s;
}
function sttCountWords(text) {
  var m = String(text).trim().match(/\S+/g);
  return m ? m.length : 0;
}
/* ===== PURE LOGIC END ===== */

  function $(id) { return document.getElementById(id); }
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var rec = null, wantListening = false, committed = '', netErrCount = 0;
  var timerInt = null, elapsedBase = 0, listenStart = 0, sessionWords = 0;

  function saveState() {
    try {
      localStorage.setItem('stt-state', JSON.stringify({
        text: $('stt-text').value,
        lang: $('stt-lang').value,
        commands: $('stt-commands').checked,
        tidy: $('stt-tidy').checked
      }));
    } catch (e) {}
  }
  function fmtTime(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }
  function syncStats() {
    var t = $('stt-text').value;
    $('stt-words').textContent = sttCountWords(t).toLocaleString('vi-VN') + ' từ';
    $('stt-chars').textContent = t.length.toLocaleString('vi-VN') + ' ký tự';
    var el = elapsedBase + (wantListening && listenStart ? Math.floor((Date.now() - listenStart) / 1000) : 0);
    $('stt-time').textContent = fmtTime(el);
  }
  function setStatus(mode, msg) {
    var dot = $('stt-status-dot'), txt = $('stt-status');
    dot.className = 'stt-dot stt-dot-' + mode;
    txt.textContent = msg;
  }
  function showHelp(kind) {
    document.querySelectorAll('.stt-help').forEach(function (el) { el.style.display = 'none'; });
    if (kind) { var el = $('stt-help-' + kind); if (el) el.style.display = ''; }
  }

  function finalizeSegment(rawText) {
    var seg = rawText.trim();
    if (!seg) return;
    if ($('stt-commands').checked) seg = sttApplyCommands(seg);
    if ($('stt-tidy').checked) seg = sttTidy(seg);
    if (committed && !/[\s(\n]$/.test(committed) && !/^\n/.test(seg)) committed += ' ';
    committed += seg;
    if ($('stt-tidy').checked) committed = sttTidy(committed);
    sessionWords += sttCountWords(seg);
    $('stt-session').textContent = sessionWords.toLocaleString('vi-VN') + ' từ trong phiên này';
    var ta = $('stt-text');
    ta.value = committed;
    ta.scrollTop = ta.scrollHeight;
    syncStats(); saveState();
  }

  function startListening() {
    if (!SR || wantListening) return;
    showHelp('');
    rec = new SR();
    rec.lang = $('stt-lang').value;
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = function (ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var res = ev.results[i];
        if (res.isFinal) finalizeSegment(res[0].transcript);
        else interim += res[0].transcript;
      }
      $('stt-interim').textContent = interim ? ('Đang nghe: ' + interim) : '';
    };
    rec.onerror = function (ev) {
      if (ev.error === 'not-allowed' || ev.error === 'service-not-allowed') {
        wantListening = false;
        setStatus('off', 'Bị chặn quyền micro');
        showHelp('mic');
      } else if (ev.error === 'network') {
        netErrCount++;
        if (netErrCount >= 3) {
          wantListening = false;
          setStatus('off', 'Lỗi mạng — đã dừng');
          showHelp('network');
        }
      } else if (ev.error === 'audio-capture') {
        wantListening = false;
        setStatus('off', 'Không tìm thấy micro');
        showHelp('mic');
      }
    };
    rec.onend = function () {
      $('stt-interim').textContent = '';
      if (wantListening) {
        try { rec.start(); } catch (e) {}
      } else {
        stopUi();
      }
    };
    wantListening = true;
    netErrCount = 0;
    listenStart = Date.now();
    try { rec.start(); } catch (e) {}
    $('stt-mic').classList.add('stt-listening');
    $('stt-mic-label').textContent = '⏹ DỪNG LẠI';
    setStatus('on', 'Đang nghe… bạn nói đi');
    timerInt = setInterval(syncStats, 1000);
  }
  function stopUi() {
    if (listenStart) elapsedBase += Math.floor((Date.now() - listenStart) / 1000);
    listenStart = 0;
    clearInterval(timerInt);
    $('stt-mic').classList.remove('stt-listening');
    $('stt-mic-label').textContent = '🎤 BẮT ĐẦU NÓI';
    setStatus('off', 'Đã dừng');
    syncStats();
  }
  function stopListening() {
    wantListening = false;
    if (rec) { try { rec.stop(); } catch (e) {} }
    stopUi();
  }

  /* ---------- Sự kiện ---------- */
  $('stt-mic').addEventListener('click', function () {
    if (wantListening) stopListening(); else startListening();
  });
  $('stt-text').addEventListener('input', function () {
    committed = this.value;
    syncStats(); saveState();
  });
  $('stt-copy').addEventListener('click', function () {
    var t = $('stt-text').value;
    function done() { $('stt-copy').textContent = '✅ Đã chép!'; setTimeout(function () { $('stt-copy').textContent = '📋 Sao chép'; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done).catch(function () {});
    else { $('stt-text').select(); try { document.execCommand('copy'); done(); } catch (e) {} }
  });
  $('stt-download').addEventListener('click', function () {
    var blob = new Blob([$('stt-text').value], { type: 'text/plain;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'giong-noi-thanh-van-ban-CongCuViet.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  });
  $('stt-clear').addEventListener('click', function () {
    committed = ''; sessionWords = 0;
    $('stt-session').textContent = '0 từ trong phiên này';
    $('stt-text').value = '';
    syncStats(); saveState();
  });
  ['stt-lang', 'stt-commands', 'stt-tidy'].forEach(function (id) {
    $(id).addEventListener('change', saveState);
  });

  /* ---------- Khởi tạo ---------- */
  try {
    var s = JSON.parse(localStorage.getItem('stt-state') || 'null');
    if (s) {
      if (s.text) { $('stt-text').value = s.text; committed = s.text; }
      if (s.lang) $('stt-lang').value = s.lang;
      $('stt-commands').checked = s.commands !== false;
      $('stt-tidy').checked = s.tidy !== false;
    }
  } catch (e) {}
  if (!SR) {
    $('stt-unsupported').style.display = '';
    $('stt-mic').disabled = true;
    setStatus('off', 'Trình duyệt chưa hỗ trợ nhận dạng giọng nói');
  }
  syncStats();
});
