document.addEventListener('DOMContentLoaded', function () {

/* ===== PURE LOGIC START ===== */
function svdParseMoney(v) {
  var s = String(v).trim().replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  var n = parseFloat(s);
  return isNaN(n) ? NaN : n;
}
function svdParseISO(iso) {
  var p = String(iso).split('-');
  return { y: parseInt(p[0], 10), m: parseInt(p[1], 10), d: parseInt(p[2], 10) };
}
function svdToISO(y, m, d) {
  function z(n) { return (n < 10 ? '0' : '') + n; }
  return y + '-' + z(m) + '-' + z(d);
}
/* Cộng tháng theo lịch, kẹp ngày cuối tháng (31/1 + 1 tháng = 28/2) */
function svdAddMonths(iso, months) {
  var p = svdParseISO(iso);
  var total = (p.m - 1) + months;
  var y = p.y + Math.floor(total / 12);
  var m = (total % 12) + 1;
  var lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return svdToISO(y, m, Math.min(p.d, lastDay));
}
function svdDaysBetween(isoA, isoB) {
  var a = svdParseISO(isoA), b = svdParseISO(isoB);
  return Math.round((Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d)) / 86400000);
}
/* Lãi theo ngày thực tế / 365 — cách ngân hàng VN tính */
function svdInterest(principal, ratePct, days) {
  return principal * (ratePct / 100) * days / 365;
}
/* Trả lãi trước: lãi bị chiết khấu vì nhận tiền ngay từ đầu kỳ */
function svdPrepaidInterest(principal, ratePct, days) {
  var full = svdInterest(principal, ratePct, days);
  return full / (1 + (ratePct / 100) * days / 365);
}
/* Lịch tái tục: mỗi kỳ lãi nhập gốc, kỳ hạn và lãi suất giữ nguyên */
function svdSchedule(principal, ratePct, startISO, termMonths, periods) {
  var rows = [], p = principal, cur = startISO;
  for (var i = 0; i < periods; i++) {
    var end = svdAddMonths(cur, termMonths);
    var days = svdDaysBetween(cur, end);
    var interest = svdInterest(p, ratePct, days);
    rows.push({ start: cur, end: end, days: days, principal: p, interest: interest, total: p + interest });
    p = p + interest;
    cur = end;
  }
  return rows;
}
function svdFmtDate(iso) {
  var p = svdParseISO(iso);
  return p.d + '/' + p.m + '/' + p.y;
}
/* ===== PURE LOGIC END ===== */

  function $(id) { return document.getElementById(id); }
  function fmtMoney(n) { return Math.round(n).toLocaleString('vi-VN') + ' đ'; }
  function fmtNum(n, dec) { return n.toLocaleString('vi-VN', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  var calculatedOnce = false;

  var today = new Date();
  $('svd-start').value = svdToISO(today.getFullYear(), today.getMonth() + 1, today.getDate());

  document.querySelectorAll('[data-svd-term]').forEach(function (b) {
    b.addEventListener('click', function () {
      $('svd-term').value = b.getAttribute('data-svd-term');
      document.querySelectorAll('[data-svd-term]').forEach(function (x) { x.classList.toggle('svd-chip-active', x === b); });
      if (calculatedOnce) calculate();
    });
  });
  $('svd-term').addEventListener('input', function () {
    document.querySelectorAll('[data-svd-term]').forEach(function (x) {
      x.classList.toggle('svd-chip-active', x.getAttribute('data-svd-term') === $('svd-term').value);
    });
  });

  function calculate() {
    var P = svdParseMoney($('svd-principal').value);
    var rate = svdParseMoney($('svd-rate').value);
    var months = parseInt($('svd-term').value, 10);
    var start = $('svd-start').value;
    var payout = $('svd-payout').value;
    var periods = Math.min(10, Math.max(1, parseInt($('svd-periods').value, 10) || 1));
    if (!(P > 0)) return showError('Hãy nhập số tiền gửi lớn hơn 0.');
    if (!(rate > 0 && rate <= 30)) return showError('Lãi suất cần nằm trong khoảng 0–30%/năm. Kiểm tra lại nhé (nhập kiểu 5,2 cũng được).');
    if (!(months >= 1 && months <= 120)) return showError('Kỳ hạn cần từ 1 đến 120 tháng.');
    if (!start) return showError('Hãy chọn ngày bắt đầu gửi.');

    var rollover = (payout === 'cuoiky' && periods > 1);
    var rows = svdSchedule(P, rate, start, months, rollover ? periods : 1);
    var first = rows[0], last = rows[rows.length - 1];
    var maturity = last.end;
    var totalInterest = last.total - P;
    var totalDays = svdDaysBetween(start, maturity);

    var prepaidNote = '';
    if (payout === 'dau') {
      var pre = svdPrepaidInterest(P, rate, first.days);
      totalInterest = pre;
      prepaidNote = ' (lĩnh trước ' + fmtMoney(pre) + ' ngay ngày gửi — lãi trả trước luôn thấp hơn lãi cuối kỳ vì bạn nhận tiền sớm)';
    }
    var totalReceive = P + totalInterest;

    $('svd-verdict').textContent = 'Gửi ' + fmtMoney(P) + ' kỳ hạn ' + months + ' tháng với lãi suất ' + fmtNum(rate, 2).replace(/,?0+$/, '') + '%/năm, bạn nhận thêm ' + fmtMoney(totalInterest) + ' tiền lãi' + (rollover ? ' sau ' + periods + ' kỳ tái tục lãi nhập gốc' : '') + '.';
    $('svd-hero-num').textContent = fmtMoney(totalReceive).replace(' đ', '');
    $('svd-interest').textContent = fmtMoney(totalInterest);
    $('svd-per-month').textContent = fmtMoney(totalInterest / (totalDays / 30.4375));
    $('svd-maturity').textContent = svdFmtDate(maturity);
    $('svd-days').textContent = 'Tổng ' + totalDays.toLocaleString('vi-VN') + ' ngày • kỳ này ' + first.days + ' ngày' + prepaidNote;
    $('svd-payout-note').textContent =
      payout === 'cuoiky' ? 'Lĩnh lãi cuối kỳ: toàn bộ lãi nhận một lần khi đáo hạn.' :
      payout === 'dau' ? 'Lĩnh lãi đầu kỳ: nhận lãi ngay khi gửi, gốc nhận khi đáo hạn. Lãi đã chiết khấu nên thấp hơn cuối kỳ.' :
      'Lĩnh lãi hàng tháng: nhận trung bình ' + fmtMoney(totalInterest / Math.max(1, Math.round(totalDays / 30.4375))) + ' mỗi tháng, gốc nhận khi đáo hạn. Tổng lãi tương đương cuối kỳ.';

    /* Bảng tái tục */
    var tb = $('svd-schedule-body');
    tb.innerHTML = '';
    if (rollover) {
      $('svd-schedule-wrap').style.display = '';
      rows.forEach(function (r, i) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>Kỳ ' + (i + 1) + '</td><td>' + svdFmtDate(r.start) + ' → ' + svdFmtDate(r.end) + '</td><td>' + r.days + '</td><td>' + fmtMoney(r.principal) + '</td><td>' + fmtMoney(r.interest) + '</td><td>' + fmtMoney(r.total) + '</td>';
        tb.appendChild(tr);
      });
    } else $('svd-schedule-wrap').style.display = 'none';

    /* Kịch bản rút trước hạn */
    if ($('svd-early-on').checked) {
      var earlyDays = parseInt($('svd-early-days').value, 10);
      var demandRate = svdParseMoney($('svd-early-rate').value);
      if (!(earlyDays > 0)) earlyDays = Math.max(1, Math.floor(first.days / 2));
      if (isNaN(demandRate) || demandRate < 0) demandRate = 0.1;
      var earlyInterest = svdInterest(P, demandRate, earlyDays);
      var fullTermInterest = (payout === 'dau') ? totalInterest : svdInterest(P, rate, first.days);
      var lost = fullTermInterest - earlyInterest;
      $('svd-early-wrap').style.display = '';
      $('svd-early-text').textContent = 'Nếu rút sau ' + earlyDays + ' ngày: chỉ được hưởng lãi không kỳ hạn ' + fmtNum(demandRate, 2).replace(/,?0+$/, '') + '%/năm = ' + fmtMoney(earlyInterest) + ', mất khoảng ' + fmtMoney(lost) + ' so với để đủ kỳ.';
      var pct = Math.max(2, Math.min(100, fullTermInterest > 0 ? (earlyInterest / fullTermInterest) * 100 : 0));
      $('svd-bar-early').style.width = pct + '%';
      $('svd-early-amount').textContent = fmtMoney(earlyInterest);
      $('svd-full-amount').textContent = fmtMoney(fullTermInterest);
    } else $('svd-early-wrap').style.display = 'none';

    $('svd-error').style.display = 'none';
    var ph = $('svd-placeholder');
    if (ph) ph.style.display = 'none';
    $('svd-result').style.display = '';
  }
  function showError(msg) {
    $('svd-error').textContent = msg;
    $('svd-error').style.display = '';
    if (!calculatedOnce) $('svd-result').style.display = 'none';
  }
  $('svd-calc').addEventListener('click', function () { calculatedOnce = true; calculate(); });
  document.querySelectorAll('.svd-soft-wrapper input, .svd-soft-wrapper select').forEach(function (el) {
    el.addEventListener('input', function () { if (calculatedOnce) calculate(); });
    el.addEventListener('change', function () { if (calculatedOnce) calculate(); });
  });
  $('svd-early-on').addEventListener('change', function () {
    $('svd-early-fields').style.display = this.checked ? '' : 'none';
  });
});
