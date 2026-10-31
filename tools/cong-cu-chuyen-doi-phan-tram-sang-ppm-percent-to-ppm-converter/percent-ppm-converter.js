document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };

  /* ===== PURE LOGIC START ===== */
  // Every unit expressed as a fraction of the whole (1 = 100%).
  var XPM_TO_FRACTION = {
    percent: 0.01,
    ppm: 1e-6,
    ppb: 1e-9,
    ppt: 1e-12,
    ratio: 1
  };
  var XPM_LABELS = {
    percent: 'Phần trăm',
    ppm: 'ppm (phần triệu)',
    ppb: 'ppb (phần tỷ)',
    ppt: 'ppt (phần nghìn tỷ)',
    ratio: 'Tỷ lệ thập phân'
  };
  var XPM_SYMBOLS = { percent: '%', ppm: ' ppm', ppb: ' ppb', ppt: ' ppt', ratio: '' };

  function xpmConvert(value, fromUnit) {
    var frac = value * XPM_TO_FRACTION[fromUnit];
    var out = {};
    Object.keys(XPM_TO_FRACTION).forEach(function (u) { out[u] = frac / XPM_TO_FRACTION[u]; });
    return out;
  }
  /* ===== PURE LOGIC END ===== */

  function parseNum(el) {
    var s = (el.value || '').toString().trim();
    if (!s) return NaN;
    if (s.indexOf(',') >= 0) s = s.replace(/\./g, '').replace(',', '.');
    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    var n = parseFloat(s);
    return isNaN(n) ? NaN : n;
  }
  function fmt(v, unit) {
    if (!isFinite(v)) return '—';
    var abs = Math.abs(v);
    var s;
    if (abs !== 0 && (abs >= 1e15 || abs < 1e-6)) {
      s = v.toExponential(4).replace('.', ',');
    } else {
      var dec = abs >= 1000 ? 2 : (abs >= 1 ? 4 : 6);
      s = v.toLocaleString('vi-VN', { maximumFractionDigits: dec });
    }
    return s + (XPM_SYMBOLS[unit] || '');
  }

  function render() {
    var v = parseNum($('xpm-inp-value'));
    var unit = $('xpm-sel-unit').value;
    var rows = $('xpm-rows');
    if (isNaN(v)) {
      $('xpm-verdict').textContent = 'Nhập một số hợp lệ để xem kết quả quy đổi ngay.';
      rows.innerHTML = '';
      return null;
    }
    var all = xpmConvert(v, unit);
    var order = ['percent', 'ppm', 'ppb', 'ppt', 'ratio'];
    rows.innerHTML = order.map(function (u) {
      return '<tr' + (u === unit ? ' class="xpm-row-main"' : '') + '><td class="xpm-unit">' + XPM_LABELS[u] + '</td><td class="xpm-num">' + fmt(all[u], u) + '</td></tr>';
    }).join('');
    var other = unit === 'ppm' ? 'percent' : 'ppm';
    $('xpm-verdict').textContent = fmt(v, unit) + ' tương đương ' + fmt(all[other], other) + (other === 'ppm' ? ' (phần triệu)' : '') + '.';
    return { v: v, unit: unit, all: all };
  }

  ['xpm-inp-value', 'xpm-sel-unit'].forEach(function (id) {
    $(id).addEventListener('input', render);
    $(id).addEventListener('change', render);
  });
  document.querySelectorAll('[data-xpm-set]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var parts = chip.getAttribute('data-xpm-set').split('|');
      $('xpm-inp-value').value = Number(parts[0]).toLocaleString('vi-VN');
      $('xpm-sel-unit').value = parts[1];
      render();
    });
  });
  $('xpm-btn-copy').addEventListener('click', function () {
    var r = render();
    if (!r) return;
    var lines = ['Chuyển đổi ' + fmt(r.v, r.unit) + ' (' + XPM_LABELS[r.unit] + '):'];
    ['percent', 'ppm', 'ppb', 'ppt', 'ratio'].forEach(function (u) { lines.push('- ' + XPM_LABELS[u] + ': ' + fmt(r.all[u], u)); });
    lines.push('Tính tại CongCuViet');
    var text = lines.join('\n');
    function done() { $('xpm-btn-copy').textContent = '✅ Đã sao chép!'; setTimeout(function () { $('xpm-btn-copy').textContent = '📋 Sao chép kết quả'; }, 1800); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
  });

  render();
});
