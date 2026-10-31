document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  var pwcSTOP = {};
  ('là và của các một những trong cho với được không có người này đó khi đã từ để vào ra trên dưới tại vì như thì mà ở sự việc làm được hơn nữa cũng chỉ còn lại sau trước nếu thì bởi giữa sau khi đến đi về theo năm tháng ngày'.split(' ')).forEach(function (w) { pwcSTOP[w] = true; });
  function pwcWordsOf(text) {
    var m = text.match(/[\p{L}\p{N}]+/gu);
    return m || [];
  }
  function pwcAnalyze(pageTexts) {
    var totalWords = 0, totalChars = 0, totalCharsNs = 0;
    var freq = {};
    var perPage = pageTexts.map(function (t, i) {
      var words = pwcWordsOf(t);
      totalWords += words.length;
      totalChars += t.length;
      totalCharsNs += t.replace(/\s/g, '').length;
      words.forEach(function (w) {
        var lw = w.toLowerCase();
        if (lw.length >= 2 && !pwcSTOP[lw] && !/^\d+$/.test(lw)) freq[lw] = (freq[lw] || 0) + 1;
      });
      return { page: i + 1, words: words.length, chars: t.length };
    });
    var top = Object.keys(freq).map(function (w) { return { word: w, count: freq[w] }; })
      .sort(function (a, b) { return b.count - a.count || (a.word < b.word ? -1 : 1); })
      .slice(0, 15);
    return {
      totalWords: totalWords,
      totalChars: totalChars,
      totalCharsNs: totalCharsNs,
      pages: pageTexts.length,
      perPage: perPage,
      top: top,
      avgPerPage: pageTexts.length ? totalWords / pageTexts.length : 0,
      readMinutes: totalWords / 200
    };
  }
  function pwcPageText(items) {
    var lines = [], cur = null;
    items.forEach(function (it) {
      if (!it.str) return;
      if (cur === null || Math.abs(it.y - cur.y) > 2) { cur = { y: it.y, parts: [it.str] }; lines.push(cur); }
      else cur.parts.push(it.str);
    });
    return lines.map(function (l) { return l.parts.join(' '); }).join('\n');
  }
  /* ===== PURE LOGIC END ===== */

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' KB';
    return (b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' MB';
  }
  function fmtMinutes(m) {
    if (m < 1) return Math.max(1, Math.round(m * 60)) + ' giây';
    if (m < 60) return Math.round(m) + ' phút';
    return Math.floor(m / 60) + ' giờ ' + Math.round(m % 60) + ' phút';
  }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  if (typeof window.pdfjsLib === 'undefined') { $('pwc-lib-error').style.display = ''; return; }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  async function setFile(file) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      $('pwc-fileinfo').textContent = '⚠️ "' + file.name + '" không phải file PDF.';
      return;
    }
    $('pwc-result').style.display = 'none';
    try {
      var buf = await file.arrayBuffer();
      $('pwc-fileinfo').textContent = '📄 ' + file.name + ' · ' + fmtSize(file.size);
      // pdf.js detaches the buffer passed as data — hand it a slice copy.
      var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)), standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/' }).promise;
      var pageTexts = [];
      for (var n = 1; n <= doc.numPages; n++) {
        $('pwc-status').textContent = '⏳ Đang đếm trang ' + n + '/' + doc.numPages + '…';
        var page = await doc.getPage(n);
        var tc = await page.getTextContent();
        var items = tc.items.map(function (it) { return { str: it.str, y: it.transform[5] }; });
        pageTexts.push(pwcPageText(items));
      }
      var a = pwcAnalyze(pageTexts);
      var vi = function (x) { return x.toLocaleString('vi-VN'); };
      $('pwc-out-words').textContent = vi(a.totalWords);
      $('pwc-out-chars').textContent = vi(a.totalChars);
      $('pwc-out-chars-ns').textContent = vi(a.totalCharsNs);
      $('pwc-out-pages').textContent = vi(a.pages);
      $('pwc-out-avg').textContent = vi(Math.round(a.avgPerPage));
      $('pwc-out-read').textContent = a.totalWords ? fmtMinutes(a.readMinutes) : '0 phút';
      $('pwc-verdict').textContent = a.totalWords === 0
        ? 'File "' + file.name + '" có ' + a.pages + ' trang nhưng không có lớp chữ nào (nhiều khả năng là PDF scan dạng ảnh) — cần OCR mới đếm được.'
        : 'File "' + file.name + '" có tổng cộng ' + vi(a.totalWords) + ' từ trong ' + a.pages + ' trang — trung bình ' + vi(Math.round(a.avgPerPage)) + ' từ/trang, đọc hết khoảng ' + fmtMinutes(a.readMinutes) + '.';
      var max = a.top.length ? a.top[0].count : 1;
      $('pwc-topwords').innerHTML = a.top.length ? a.top.map(function (t) {
        return '<div class="pwc-kw"><span class="pwc-kw-word">' + esc(t.word) + '</span><span class="pwc-kw-bar"><span class="pwc-kw-fill" style="display:block;width:' + Math.max(4, Math.round(t.count / max * 100)) + '%"></span></span><span class="pwc-kw-count">' + vi(t.count) + '</span></div>';
      }).join('') : '<p class="pwc-note">Không có từ khóa nổi bật.</p>';
      $('pwc-tbody').innerHTML = a.perPage.map(function (r) {
        return '<tr><td>Trang ' + r.page + '</td><td>' + vi(r.words) + '</td><td>' + vi(r.chars) + '</td></tr>';
      }).join('');
      $('pwc-result').style.display = '';
      $('pwc-status').textContent = '';
    } catch (e) {
      $('pwc-fileinfo').textContent = '⚠️ Không đọc được "' + file.name + '" (file hỏng hoặc có mật khẩu mở).' + (e && e.message ? ' Chi tiết lỗi: ' + (e.name || 'Error') + ' — ' + e.message : '');
      $('pwc-status').textContent = '';
    }
  }

  $('pwc-file').addEventListener('change', function () { setFile(this.files[0]); this.value = ''; });
  var drop = $('pwc-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('pwc-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('pwc-over'); }); });
  drop.addEventListener('drop', function (e) { setFile(e.dataTransfer.files[0]); });
});
