document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  // Merges an array of PDF ArrayBuffers into one document.
  // PDFLib is injected so this can be tested in Node with the real pdf-lib.
  async function mpdMergeBuffers(buffers, PDFLib) {
    var merged = await PDFLib.PDFDocument.create();
    var pages = 0;
    for (var i = 0; i < buffers.length; i++) {
      var src = await PDFLib.PDFDocument.load(buffers[i], { ignoreEncryption: true });
      var copied = await merged.copyPages(src, src.getPageIndices());
      copied.forEach(function (p) { merged.addPage(p); });
      pages += copied.length;
    }
    var bytes = await merged.save();
    return { bytes: bytes, pages: pages };
  }
  function mpdCountPages(buffer, PDFLib) {
    return PDFLib.PDFDocument.load(buffer, { ignoreEncryption: true }).then(function (doc) { return doc.getPageCount(); });
  }
  /* ===== PURE LOGIC END ===== */

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' KB';
    return (b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' MB';
  }

  var items = []; // {name, size, pages, buffer, ok, err}
  var lastUrl = null;

  if (typeof window.PDFLib === 'undefined') {
    $('mpd-lib-error').style.display = '';
    $('mpd-btn-merge').disabled = true;
    return;
  }

  function renderList() {
    var ul = $('mpd-list');
    ul.innerHTML = '';
    items.forEach(function (it, idx) {
      var li = document.createElement('li');
      li.className = 'mpd-item' + (it.ok ? '' : ' mpd-bad');
      li.innerHTML = '<div class="mpd-item-main"><div class="mpd-item-name"></div><div class="mpd-item-meta"></div></div>' +
        '<button type="button" class="mpd-item-btn" data-mpd-act="up" title="Lên">↑</button>' +
        '<button type="button" class="mpd-item-btn" data-mpd-act="down" title="Xuống">↓</button>' +
        '<button type="button" class="mpd-item-btn" data-mpd-act="del" title="Xóa">✕</button>';
      li.querySelector('.mpd-item-name').textContent = (idx + 1) + '. ' + it.name;
      li.querySelector('.mpd-item-meta').textContent = it.ok
        ? fmtSize(it.size) + ' · ' + it.pages + ' trang'
        : '⚠️ ' + it.err;
      var btns = li.querySelectorAll('[data-mpd-act]');
      btns[0].disabled = idx === 0;
      btns[1].disabled = idx === items.length - 1;
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          var act = b.getAttribute('data-mpd-act');
          if (act === 'del') items.splice(idx, 1);
          else if (act === 'up' && idx > 0) { var t = items[idx - 1]; items[idx - 1] = items[idx]; items[idx] = t; }
          else if (act === 'down' && idx < items.length - 1) { var t2 = items[idx + 1]; items[idx + 1] = items[idx]; items[idx] = t2; }
          renderList();
        });
      });
      ul.appendChild(li);
    });
    var okItems = items.filter(function (i) { return i.ok; });
    var totalPages = okItems.reduce(function (s, i) { return s + i.pages; }, 0);
    var totalSize = okItems.reduce(function (s, i) { return s + i.size; }, 0);
    $('mpd-summary').textContent = items.length === 0
      ? 'Chưa có file nào. Hãy chọn ít nhất 2 file PDF để gộp.'
      : okItems.length + ' file hợp lệ · tổng ' + totalPages + ' trang · ' + fmtSize(totalSize) + (items.length > okItems.length ? ' · ' + (items.length - okItems.length) + ' file lỗi (sẽ bỏ qua)' : '');
    $('mpd-btn-merge').disabled = okItems.length < 2;
    $('mpd-btn-clear').disabled = items.length === 0;
  }

  async function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList || []);
    for (var f of files) {
      if (!/\.pdf$/i.test(f.name) && f.type !== 'application/pdf') {
        items.push({ name: f.name, size: f.size, pages: 0, buffer: null, ok: false, err: 'Không phải file PDF' });
        continue;
      }
      try {
        var buf = await f.arrayBuffer();
        var pages = await mpdCountPages(buf, window.PDFLib);
        items.push({ name: f.name, size: f.size, pages: pages, buffer: buf, ok: true, err: '' });
      } catch (e) {
        items.push({ name: f.name, size: f.size, pages: 0, buffer: null, ok: false, err: 'Không đọc được (file hỏng hoặc có mật khẩu mở)' });
      }
      renderList();
    }
  }

  $('mpd-file').addEventListener('change', function () { addFiles(this.files); this.value = ''; });
  var drop = $('mpd-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('mpd-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('mpd-over'); }); });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
  $('mpd-btn-clear').addEventListener('click', function () { items = []; $('mpd-result').style.display = 'none'; renderList(); });

  $('mpd-btn-merge').addEventListener('click', async function () {
    var okItems = items.filter(function (i) { return i.ok; });
    if (okItems.length < 2) return;
    var btn = $('mpd-btn-merge');
    btn.disabled = true;
    $('mpd-status').textContent = '⏳ Đang gộp ' + okItems.length + ' file…';
    try {
      var res = await mpdMergeBuffers(okItems.map(function (i) { return i.buffer; }), window.PDFLib);
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(new Blob([res.bytes], { type: 'application/pdf' }));
      var a = $('mpd-download');
      a.href = lastUrl;
      $('mpd-out-pages').textContent = res.pages.toLocaleString('vi-VN');
      $('mpd-out-size').textContent = fmtSize(res.bytes.length);
      $('mpd-out-files').textContent = okItems.length;
      $('mpd-verdict').textContent = 'Đã gộp xong ' + okItems.length + ' file thành 1 file PDF gồm ' + res.pages + ' trang (' + fmtSize(res.bytes.length) + '). Bấm nút bên dưới để tải về.';
      $('mpd-result').style.display = '';
      $('mpd-status').textContent = '';
    } catch (e) {
      $('mpd-status').textContent = '❌ Gộp thất bại: một file trong danh sách có thể bị hỏng hoặc có mật khẩu. Hãy thử bỏ file đó ra.';
    }
    btn.disabled = items.filter(function (i) { return i.ok; }).length < 2;
  });

  renderList();
});
