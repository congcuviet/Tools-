document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  function j2pFit(imgW, imgH, mode, marginPt) {
    if (mode === 'fit') return { pageW: imgW, pageH: imgH, x: 0, y: 0, w: imgW, h: imgH };
    var pw = mode === 'a4' ? 595.28 : 612;
    var ph = mode === 'a4' ? 841.89 : 792;
    if (imgW > imgH && ph > pw) { var t = pw; pw = ph; ph = t; } // auto landscape
    var availW = pw - 2 * marginPt, availH = ph - 2 * marginPt;
    var s = Math.min(availW / imgW, availH / imgH);
    var w = imgW * s, h = imgH * s;
    return { pageW: pw, pageH: ph, x: (pw - w) / 2, y: (ph - h) / 2, w: w, h: h };
  }
  async function j2pBuildPdf(items, mode, marginPt, PDFLib) {
    var doc = await PDFLib.PDFDocument.create();
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var img = it.kind === 'png' ? await doc.embedPng(it.bytes) : await doc.embedJpg(it.bytes);
      var fit = j2pFit(img.width, img.height, mode, marginPt);
      var page = doc.addPage([fit.pageW, fit.pageH]);
      page.drawImage(img, { x: fit.x, y: fit.y, width: fit.w, height: fit.h });
    }
    return { bytes: await doc.save(), pages: items.length };
  }
  /* ===== PURE LOGIC END ===== */

  function fmtSize(b) {
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' KB';
    return (b / 1024 / 1024).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' MB';
  }

  var items = []; // {name, size, kind, bytes, thumbUrl}
  var lastUrl = null;

  if (typeof window.PDFLib === 'undefined') { $('j2p-lib-error').style.display = ''; return; }

  function renderList() {
    var list = $('j2p-list');
    list.innerHTML = '';
    items.forEach(function (it, idx) {
      var li = document.createElement('li');
      li.className = 'j2p-item';
      var img = document.createElement('img');
      img.className = 'j2p-thumb'; img.src = it.thumbUrl; img.alt = '';
      var name = document.createElement('span');
      name.className = 'j2p-name';
      name.textContent = (idx + 1) + '. ' + it.name + ' (' + fmtSize(it.size) + ')';
      li.appendChild(img); li.appendChild(name);
      [['↑', 'up'], ['↓', 'down'], ['✕', 'del']].forEach(function (cfg) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'j2p-ctl' + (cfg[1] === 'del' ? ' j2p-del' : '');
        b.textContent = cfg[0];
        b.setAttribute('data-j2p-act', cfg[1]);
        b.setAttribute('data-j2p-idx', idx);
        li.appendChild(b);
      });
      list.appendChild(li);
    });
    $('j2p-summary').textContent = items.length
      ? 'Đã chọn ' + items.length + ' ảnh → PDF sẽ có ' + items.length + ' trang.'
      : 'Chưa chọn ảnh nào — mỗi ảnh sẽ thành 1 trang PDF theo đúng thứ tự trong danh sách.';
    $('j2p-btn-build').disabled = !items.length;
  }

  async function addFiles(fileList) {
    var skipped = [];
    for (var i = 0; i < fileList.length; i++) {
      var f = fileList[i];
      var kind = /\.png$/i.test(f.name) || f.type === 'image/png' ? 'png' : (/\.jpe?g$/i.test(f.name) || f.type === 'image/jpeg' ? 'jpg' : null);
      if (!kind) { skipped.push(f.name); continue; }
      var buf = await f.arrayBuffer();
      items.push({ name: f.name, size: f.size, kind: kind, bytes: buf, thumbUrl: URL.createObjectURL(f) });
    }
    $('j2p-error').textContent = skipped.length ? '⚠️ Bỏ qua (không phải JPG/PNG): ' + skipped.join(', ') : '';
    renderList();
  }

  $('j2p-file').addEventListener('change', function () { addFiles(this.files); this.value = ''; });
  var drop = $('j2p-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('j2p-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('j2p-over'); }); });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
  $('j2p-list').addEventListener('click', function (e) {
    var b = e.target.closest('[data-j2p-act]');
    if (!b) return;
    var i = Number(b.getAttribute('data-j2p-idx'));
    var act = b.getAttribute('data-j2p-act');
    if (act === 'up' && i > 0) { var t = items[i - 1]; items[i - 1] = items[i]; items[i] = t; }
    if (act === 'down' && i < items.length - 1) { var t2 = items[i + 1]; items[i + 1] = items[i]; items[i] = t2; }
    if (act === 'del') { URL.revokeObjectURL(items[i].thumbUrl); items.splice(i, 1); }
    renderList();
  });

  $('j2p-btn-build').addEventListener('click', async function () {
    if (!items.length) return;
    var btn = $('j2p-btn-build');
    btn.disabled = true;
    $('j2p-status').textContent = '⏳ Đang tạo PDF…';
    try {
      var res = await j2pBuildPdf(items, $('j2p-sel-size').value, Number($('j2p-sel-margin').value), window.PDFLib);
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(new Blob([res.bytes], { type: 'application/pdf' }));
      $('j2p-download').href = lastUrl;
      $('j2p-verdict').textContent = 'Đã tạo PDF ' + res.pages + ' trang từ ' + items.length + ' ảnh (' + fmtSize(res.bytes.length) + '). Mỗi ảnh là một trang theo đúng thứ tự bạn sắp xếp.';
      $('j2p-result').style.display = '';
      $('j2p-status').textContent = '';
    } catch (e) {
      $('j2p-status').textContent = '❌ Tạo PDF thất bại — có ảnh bị lỗi, hãy thử xóa ảnh đó.';
    }
    btn.disabled = !items.length;
  });
});
