document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  function rpoMove(order, idx, dir) {
    var j = idx + dir;
    if (idx < 0 || idx >= order.length || j < 0 || j >= order.length) return order.slice();
    var o = order.slice();
    var t = o[idx]; o[idx] = o[j]; o[j] = t;
    return o;
  }
  function rpoReverse(order) { return order.slice().reverse(); }
  async function rpoBuildBuffer(buffer, order, PDFLib) {
    var src = await PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true });
    var out = await PDFLib.PDFDocument.create();
    var pages = await out.copyPages(src, order.map(function (p) { return p - 1; }));
    pages.forEach(function (p) { out.addPage(p); });
    return await out.save();
  }
  /* ===== PURE LOGIC END ===== */

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' KB';
    return (b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' MB';
  }

  var state = { name: '', buf: null, order: [], thumbs: {} };
  var lastUrl = null;
  var dragIdx = null;

  if (typeof window.PDFLib === 'undefined' || typeof window.pdfjsLib === 'undefined') { $('rpo-lib-error').style.display = ''; return; }
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

  function renderGrid() {
    var grid = $('rpo-grid');
    grid.innerHTML = '';
    state.order.forEach(function (origPage, idx) {
      var card = document.createElement('div');
      card.className = 'rpo-page';
      card.draggable = true;
      card.setAttribute('data-idx', idx);
      var cv = state.thumbs[origPage];
      if (cv) card.appendChild(cv);
      var label = document.createElement('span');
      label.className = 'rpo-page-label';
      label.textContent = 'Trang gốc ' + origPage;
      card.appendChild(label);
      var pos = document.createElement('span');
      pos.className = 'rpo-page-pos';
      pos.textContent = '→ vị trí mới: ' + (idx + 1);
      card.appendChild(pos);
      var moves = document.createElement('div');
      moves.className = 'rpo-moves';
      var bl = document.createElement('button');
      bl.type = 'button'; bl.className = 'rpo-move'; bl.textContent = '◀'; bl.disabled = idx === 0;
      bl.setAttribute('aria-label', 'Chuyển trang gốc ' + origPage + ' sang trái');
      bl.addEventListener('click', function () { state.order = rpoMove(state.order, idx, -1); renderGrid(); });
      var br = document.createElement('button');
      br.type = 'button'; br.className = 'rpo-move'; br.textContent = '▶'; br.disabled = idx === state.order.length - 1;
      br.setAttribute('aria-label', 'Chuyển trang gốc ' + origPage + ' sang phải');
      br.addEventListener('click', function () { state.order = rpoMove(state.order, idx, 1); renderGrid(); });
      moves.appendChild(bl); moves.appendChild(br);
      card.appendChild(moves);
      card.addEventListener('dragstart', function (e) { dragIdx = idx; card.classList.add('rpo-dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(idx)); } catch (err) { } });
      card.addEventListener('dragend', function () { card.classList.remove('rpo-dragging'); });
      card.addEventListener('dragover', function (e) { e.preventDefault(); });
      card.addEventListener('drop', function (e) {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx) return;
        var item = state.order.splice(dragIdx, 1)[0];
        state.order.splice(idx, 0, item);
        dragIdx = null;
        renderGrid();
      });
      grid.appendChild(card);
    });
  }

  async function setFile(file) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      $('rpo-fileinfo').textContent = '⚠️ "' + file.name + '" không phải file PDF.';
      return;
    }
    $('rpo-work').style.display = 'none';
    $('rpo-result').style.display = 'none';
    try {
      var buf = await file.arrayBuffer();
      // pdf.js detaches the buffer passed as data — hand it a slice copy and keep the original.
      var doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf.slice(0)), standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/' }).promise;
      if (doc.numPages > 100) {
        $('rpo-fileinfo').textContent = '⚠️ File "' + file.name + '" có ' + doc.numPages + ' trang — công cụ hỗ trợ tối đa 100 trang mỗi lần.';
        return;
      }
      state = { name: file.name, buf: buf, order: [], thumbs: {} };
      for (var n = 1; n <= doc.numPages; n++) {
        $('rpo-status').textContent = '⏳ Đang tạo ảnh xem trước trang ' + n + '/' + doc.numPages + '…';
        var page = await doc.getPage(n);
        var base = page.getViewport({ scale: 1 });
        var targetW = 150;
        var viewport = page.getViewport({ scale: targetW / base.width });
        var canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
        state.thumbs[n] = canvas;
        state.order.push(n);
      }
      $('rpo-fileinfo').textContent = '📄 ' + file.name + ' · ' + fmtSize(file.size) + ' · ' + doc.numPages + ' trang';
      $('rpo-status').textContent = '';
      renderGrid();
      $('rpo-work').style.display = '';
    } catch (e) {
      $('rpo-fileinfo').textContent = '⚠️ Không đọc được "' + file.name + '" (file hỏng hoặc có mật khẩu mở).' + (e && e.message ? ' Chi tiết lỗi: ' + (e.name || 'Error') + ' — ' + e.message : '');
      $('rpo-status').textContent = '';
    }
  }

  $('rpo-file').addEventListener('change', function () { setFile(this.files[0]); this.value = ''; });
  var drop = $('rpo-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('rpo-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('rpo-over'); }); });
  drop.addEventListener('drop', function (e) { setFile(e.dataTransfer.files[0]); });
  $('rpo-btn-reverse').addEventListener('click', function () { state.order = rpoReverse(state.order); renderGrid(); });
  $('rpo-btn-reset').addEventListener('click', function () {
    state.order = state.order.slice().sort(function (a, b) { return a - b; });
    renderGrid();
  });
  $('rpo-btn-build').addEventListener('click', async function () {
    $('rpo-error').textContent = '';
    try {
      var bytes = await rpoBuildBuffer(state.buf.slice(0), state.order, window.PDFLib);
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      $('rpo-download').href = lastUrl;
      $('rpo-verdict').textContent = 'Đã tạo file PDF mới từ "' + state.name + '" với thứ tự trang đã sắp xếp — ' + state.order.length + ' trang.';
      $('rpo-order-line').textContent = 'Thứ tự mới (theo số trang gốc): ' + state.order.join(' → ');
      $('rpo-result').style.display = '';
    } catch (e) {
      $('rpo-error').textContent = '❌ Tạo file thất bại.' + (e && e.message ? ' Chi tiết lỗi: ' + (e.name || 'Error') + ' — ' + e.message : '');
    }
  });
});
