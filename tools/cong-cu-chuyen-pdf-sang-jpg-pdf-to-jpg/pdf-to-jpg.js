document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  function p2jParseRanges(str, total) {
    if (!str || !str.trim()) return { pages: null }; // null = all
    var parts = str.split(',');
    var set = {};
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i].trim();
      if (!p) continue;
      var m = p.match(/^(\d+)\s*(?:-\s*(\d+))?$/);
      if (!m) return { error: 'Khoảng "' + p + '" không đúng định dạng. Hãy nhập kiểu: 1-3, 5.' };
      var a = parseInt(m[1], 10);
      var b = m[2] ? parseInt(m[2], 10) : a;
      if (a < 1 || b < a) return { error: 'Khoảng "' + p + '" không hợp lệ.' };
      if (b > total) return { error: 'Khoảng "' + p + '" vượt quá số trang của file (file có ' + total + ' trang).' };
      for (var pg = a; pg <= b; pg++) set[pg] = true;
    }
    var pages = Object.keys(set).map(Number).sort(function (x, y) { return x - y; });
    return { pages: pages.length ? pages : null };
  }
  /* ===== PURE LOGIC END ===== */

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' KB';
    return (b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' MB';
  }
  function baseName(name) { return name.replace(/\.pdf$/i, ''); }

  var state = { name: '', buf: null, pages: 0 };
  var fmt = 'jpg';
  var outputs = []; // {url, name}

  if (typeof window.pdfjsLib === 'undefined') { $('p2j-lib-error').style.display = ''; return; }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  async function setFile(file) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      $('p2j-fileinfo').textContent = '⚠️ "' + file.name + '" không phải file PDF.';
      return;
    }
    try {
      var buf = await file.arrayBuffer();
      // NOTE: pdf.js TRANSFERS (detaches) the ArrayBuffer passed as data — always hand it a slice copy and keep the original.
      var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)), standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/' }).promise;
      state = { name: file.name, buf: buf, pages: doc.numPages };
      $('p2j-fileinfo').textContent = '📄 ' + file.name + ' · ' + fmtSize(file.size) + ' · ' + state.pages + ' trang';
      $('p2j-options').style.display = '';
      $('p2j-error').textContent = '';
    } catch (e) {
      $('p2j-fileinfo').textContent = '⚠️ Không đọc được "' + file.name + '" (file hỏng hoặc có mật khẩu mở).' + (e && e.message ? ' Chi tiết lỗi: ' + (e.name || 'Error') + ' — ' + e.message : '');
      $('p2j-options').style.display = 'none';
    }
  }

  $('p2j-file').addEventListener('change', function () { setFile(this.files[0]); this.value = ''; });
  var drop = $('p2j-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('p2j-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('p2j-over'); }); });
  drop.addEventListener('drop', function (e) { setFile(e.dataTransfer.files[0]); });
  document.querySelectorAll('[data-p2j-fmt]').forEach(function (b) {
    b.addEventListener('click', function () {
      fmt = b.getAttribute('data-p2j-fmt');
      document.querySelectorAll('[data-p2j-fmt]').forEach(function (x) { x.classList.remove('p2j-picked'); });
      b.classList.add('p2j-picked');
    });
  });

  function clearOutputs() {
    outputs.forEach(function (o) { URL.revokeObjectURL(o.url); });
    outputs = [];
    $('p2j-grid').innerHTML = '';
  }

  $('p2j-btn-convert').addEventListener('click', async function () {
    if (!state.buf) return;
    var parsed = p2jParseRanges($('p2j-inp-pages').value, state.pages);
    if (parsed.error) { $('p2j-error').textContent = '❌ ' + parsed.error; return; }
    var pageNums = parsed.pages || Array.from({ length: state.pages }, function (_, i) { return i + 1; });
    if (pageNums.length > 100) { $('p2j-error').textContent = '❌ Tối đa 100 trang mỗi lần chuyển — hãy chia nhỏ bằng ô trang (ví dụ 1-100 rồi 101-200).'; return; }
    $('p2j-error').textContent = '';
    var btn = $('p2j-btn-convert');
    btn.disabled = true;
    clearOutputs();
    $('p2j-result').style.display = 'none';
    var dpi = Number($('p2j-sel-dpi').value);
    var scale = dpi / 72;
    try {
      var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(state.buf.slice(0)), standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/' }).promise;
      for (var k = 0; k < pageNums.length; k++) {
        var n = pageNums[k];
        $('p2j-status').textContent = '⏳ Đang chuyển trang ' + n + ' (' + (k + 1) + '/' + pageNums.length + ')…';
        var page = await doc.getPage(n);
        var viewport = page.getViewport({ scale: scale });
        var canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        var cx = canvas.getContext('2d');
        cx.fillStyle = '#ffffff';
        cx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: cx, viewport: viewport }).promise;
        var blob = await new Promise(function (res) { canvas.toBlob(res, fmt === 'png' ? 'image/png' : 'image/jpeg', 0.92); });
        var url = URL.createObjectURL(blob);
        var outName = baseName(state.name) + '-trang-' + n + '.' + fmt;
        outputs.push({ url: url, name: outName });
        var card = document.createElement('div');
        card.className = 'p2j-thumb-card';
        var img = document.createElement('img');
        img.src = url; img.alt = 'Trang ' + n;
        var cap = document.createElement('p');
        cap.className = 'p2j-thumb-cap';
        cap.textContent = 'Trang ' + n + ' · ' + canvas.width + '×' + canvas.height + 'px · ' + fmtSize(blob.size);
        var a = document.createElement('a');
        a.className = 'p2j-dl'; a.href = url; a.setAttribute('download', outName);
        a.textContent = '⬇️ Tải trang ' + n;
        card.appendChild(img); card.appendChild(cap); card.appendChild(a);
        $('p2j-grid').appendChild(card);
      }
      $('p2j-verdict').textContent = 'Đã chuyển ' + outputs.length + ' trang của "' + state.name + '" thành ảnh ' + fmt.toUpperCase() + ' ở ' + dpi + ' DPI. Tải từng ảnh ở dưới hoặc bấm “Tải tất cả”.';
      $('p2j-result').style.display = '';
      $('p2j-status').textContent = '';
    } catch (e) {
      $('p2j-status').textContent = '❌ Chuyển đổi thất bại ở trang ' + (pageNums[k] || '?') + ' — file có thể bị hỏng.' + (e && e.message ? ' Chi tiết lỗi: ' + (e.name || 'Error') + ' — ' + e.message : '');
    }
    btn.disabled = false;
  });

  $('p2j-btn-all').addEventListener('click', function () {
    outputs.forEach(function (o, i) {
      setTimeout(function () {
        var a = document.createElement('a');
        a.href = o.url;
        a.setAttribute('download', o.name);
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 350);
    });
  });
});
