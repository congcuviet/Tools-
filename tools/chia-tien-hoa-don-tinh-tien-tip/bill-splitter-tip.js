document.addEventListener('DOMContentLoaded', function () {

/* ===== PURE LOGIC START ===== */
function bstRoundUp(x, step) { return Math.ceil(x / step) * step; }
function bstSplitEven(total, tipPct, people) {
  var tipTotal = Math.round(total * tipPct / 100);
  var grand = total + tipTotal;
  return {
    tipTotal: tipTotal, grand: grand,
    perBase: total / people, perTip: tipTotal / people, perTotal: grand / people
  };
}
/* Chia theo món: items = [{price, qty, shared: [personIndex,...]}]
   tip và phí khác phân bổ tỉ lệ theo tiền món của mỗi người (ai không ăn món nào thì chia đều phần tip/phí theo đầu người nếu tổng tiền món = 0). */
function bstSplitItems(peopleCount, items, tipPct, fee) {
  var subs = [];
  for (var i = 0; i < peopleCount; i++) subs.push(0);
  var subTotal = 0, ignored = 0;
  items.forEach(function (it) {
    var amount = (it.price || 0) * (it.qty || 0);
    if (amount <= 0 || !it.shared || !it.shared.length) { if (amount > 0) ignored++; return; }
    var each = amount / it.shared.length;
    it.shared.forEach(function (p) { if (p >= 0 && p < peopleCount) subs[p] += each; });
    subTotal += amount;
  });
  var tipTotal = Math.round(subTotal * tipPct / 100);
  var grand = subTotal + tipTotal + (fee || 0);
  var extras = tipTotal + (fee || 0);
  var rows = subs.map(function (sub, idx) {
    var extraShare = subTotal > 0 ? extras * (sub / subTotal) : (peopleCount ? extras / peopleCount : 0);
    return { sub: sub, extra: extraShare, total: sub + extraShare };
  });
  /* Làm tròn từng người tới đồng và hiệu chỉnh để tổng khớp tuyệt đối */
  var rounded = rows.map(function (r) { return Math.round(r.total); });
  var diff = Math.round(grand) - rounded.reduce(function (a, b) { return a + b; }, 0);
  if (diff !== 0 && rounded.length) {
    var maxIdx = 0;
    rounded.forEach(function (v, i) { if (v > rounded[maxIdx]) maxIdx = i; });
    rounded[maxIdx] += diff;
  }
  rows.forEach(function (r, i) { r.totalRounded = rounded[i]; });
  return { subTotal: subTotal, tipTotal: tipTotal, fee: fee || 0, grand: grand, rows: rows, ignored: ignored };
}
/* ===== PURE LOGIC END ===== */

  function $(id) { return document.getElementById(id); }
  function fmt(n) { return Math.round(n).toLocaleString('vi-VN'); }
  function money(n) { return fmt(n) + 'đ'; }
  function parseMoney(str) {
    var v = parseFloat(String(str).replace(/[^\d]/g, ''));
    return isNaN(v) ? 0 : v;
  }
  function liveMoney(inp) {
    inp.addEventListener('input', function () {
      var raw = inp.value.replace(/[^\d]/g, '');
      if (raw) inp.value = parseInt(raw, 10).toLocaleString('vi-VN');
      onAnyChange();
    });
  }

  /* ================= CHẾ ĐỘ ================= */
  var mode = 'even';
  document.querySelectorAll('[data-bst-mode]').forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-bst-mode');
      document.querySelectorAll('[data-bst-mode]').forEach(function (x) { x.classList.toggle('bst-chip-active', x === b); });
      $('bst-sec-even').style.display = mode === 'even' ? '' : 'none';
      $('bst-sec-items').style.display = mode === 'items' ? '' : 'none';
    });
  });

  /* ================= CHIA ĐỀU ================= */
  var evenTipPct = 10;
  document.querySelectorAll('[data-bst-tip]').forEach(function (b) {
    b.addEventListener('click', function () {
      evenTipPct = parseFloat(b.getAttribute('data-bst-tip'));
      $('bst-even-tip-custom').value = '';
      document.querySelectorAll('[data-bst-tip]').forEach(function (x) { x.classList.toggle('bst-chip-active', x === b); });
      calcEven();
    });
  });
  $('bst-even-tip-custom').addEventListener('input', function () {
    document.querySelectorAll('[data-bst-tip]').forEach(function (x) { x.classList.remove('bst-chip-active'); });
    calcEven();
  });
  function currentEvenTip() {
    var c = parseFloat($('bst-even-tip-custom').value.replace(',', '.'));
    return isNaN(c) ? evenTipPct : c;
  }
  $('bst-even-people').addEventListener('input', calcEven);
  $('bst-even-round').addEventListener('change', calcEven);
  liveMoney($('bst-even-total'));
  function calcEven() {
    var total = parseMoney($('bst-even-total').value);
    var people = Math.max(1, parseInt($('bst-even-people').value, 10) || 1);
    var tipPct = currentEvenTip();
    var r = bstSplitEven(total, tipPct, people);
    var perRounded = Math.round(r.perTotal);
    var note = '';
    if ($('bst-even-round').checked) {
      perRounded = bstRoundUp(r.perTotal, 1000);
      var extra = perRounded * people - r.grand;
      note = 'Đã làm tròn lên ' + money(perRounded) + '/người' + (extra > 0 ? ' — dư ' + money(extra) + ' so với hóa đơn (coi như tip thêm).' : '.');
    }
    $('bst-even-hero').textContent = money(perRounded);
    $('bst-even-detail').innerHTML =
      'Mỗi người: tiền món <strong>' + money(r.perBase) + '</strong> + tip <strong>' + money(r.perTip) + '</strong>.<br>' +
      'Tổng hóa đơn <strong>' + money(total) + '</strong> + tip ' + fmt(tipPct) + '% (<strong>' + money(r.tipTotal) + '</strong>) = <strong>' + money(r.grand) + '</strong> cho ' + people + ' người.' +
      (note ? '<br>' + note : '');
    $('bst-even-copy').setAttribute('data-text',
      'Chia tiền hóa đơn (chia đều):\nTổng: ' + money(total) + ' + tip ' + fmt(tipPct) + '% (' + money(r.tipTotal) + ') = ' + money(r.grand) + '\n👉 Mỗi người (' + people + ' người): ' + money(perRounded));
  }
  $('bst-even-copy').addEventListener('click', function () { copyText(this); });

  /* ================= CHIA THEO MÓN ================= */
  var people = ['Người 1', 'Người 2', 'Người 3', 'Người 4'];
  var items = [
    { name: 'Set lẩu hải sản', price: 500000, qty: 1, shared: [0, 1, 2, 3] },
    { name: 'Bia (tháp)', price: 200000, qty: 1, shared: [0, 1] }
  ];
  function renderPeople() {
    var wrap = $('bst-people');
    wrap.innerHTML = '';
    people.forEach(function (name, i) {
      var row = document.createElement('div');
      row.className = 'bst-person-row';
      row.innerHTML = '<input type="text" class="bst-inp bst-person-name" value="' + name.replace(/"/g, '&quot;') + '" aria-label="Tên người ' + (i + 1) + '">' +
        (people.length > 1 ? '<button type="button" class="bst-mini-btn" data-del-person="' + i + '" title="Xóa người này">✕</button>' : '');
      wrap.appendChild(row);
    });
    wrap.querySelectorAll('.bst-person-name').forEach(function (inp, i) {
      inp.addEventListener('input', function () { people[i] = inp.value; renderItemsSharers(); calcItems(); });
    });
    wrap.querySelectorAll('[data-del-person]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-del-person'), 10);
        people.splice(idx, 1);
        items.forEach(function (it) { it.shared = it.shared.filter(function (p) { return p !== idx; }).map(function (p) { return p > idx ? p - 1 : p; }); });
        renderPeople(); renderItems(); calcItems();
      });
    });
  }
  $('bst-add-person').addEventListener('click', function () {
    if (people.length >= 12) return;
    people.push('Người ' + (people.length + 1));
    renderPeople(); renderItems(); calcItems();
  });
  function renderItems() {
    var wrap = $('bst-items');
    wrap.innerHTML = '';
    items.forEach(function (it, ii) {
      var card = document.createElement('div');
      card.className = 'bst-item-card';
      card.innerHTML =
        '<div class="bst-item-main">' +
          '<input type="text" class="bst-inp" data-it="name" value="' + it.name.replace(/"/g, '&quot;') + '" placeholder="Tên món" aria-label="Tên món">' +
          '<input type="text" class="bst-inp bst-inp-money" data-it="price" value="' + fmt(it.price) + '" inputmode="numeric" aria-label="Đơn giá">' +
          '<input type="number" class="bst-inp bst-inp-qty" data-it="qty" value="' + it.qty + '" min="0" max="99" aria-label="Số lượng">' +
          '<button type="button" class="bst-mini-btn" data-del-item="' + ii + '" title="Xóa món">✕</button>' +
        '</div>' +
        '<div class="bst-item-share"><span>Chia cho:</span><span class="bst-share-chips" data-share-for="' + ii + '"></span></div>';
      wrap.appendChild(card);
      card.querySelectorAll('[data-it]').forEach(function (inp) {
        inp.addEventListener('input', function () {
          var k = inp.getAttribute('data-it');
          if (k === 'name') it.name = inp.value;
          else if (k === 'price') { it.price = parseMoney(inp.value); inp.value = it.price ? fmt(it.price) : ''; }
          else if (k === 'qty') it.qty = Math.max(0, parseInt(inp.value, 10) || 0);
          calcItems();
        });
      });
      card.querySelector('[data-del-item]').addEventListener('click', function () {
        items.splice(ii, 1); renderItems(); calcItems();
      });
    });
    renderItemsSharers();
  }
  function renderItemsSharers() {
    document.querySelectorAll('[data-share-for]').forEach(function (holder) {
      var ii = parseInt(holder.getAttribute('data-share-for'), 10);
      holder.innerHTML = '';
      people.forEach(function (name, pi) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'bst-share-chip' + (items[ii].shared.indexOf(pi) >= 0 ? ' bst-share-on' : '');
        chip.textContent = name || ('Người ' + (pi + 1));
        chip.addEventListener('click', function () {
          var at = items[ii].shared.indexOf(pi);
          if (at >= 0) items[ii].shared.splice(at, 1); else items[ii].shared.push(pi);
          renderItemsSharers(); calcItems();
        });
        holder.appendChild(chip);
      });
    });
  }
  $('bst-add-item').addEventListener('click', function () {
    items.push({ name: '', price: 0, qty: 1, shared: people.map(function (_, i) { return i; }) });
    renderItems(); calcItems();
  });
  $('bst-items-tip').addEventListener('input', calcItems);
  $('bst-items-round').addEventListener('change', calcItems);
  liveMoney($('bst-items-fee'));

  function calcItems() {
    var tipPct = parseFloat($('bst-items-tip').value.replace(',', '.')) || 0;
    var fee = parseMoney($('bst-items-fee').value);
    var r = bstSplitItems(people.length, items, tipPct, fee);
    var roundUp = $('bst-items-round').checked;
    var tb = $('bst-items-body');
    tb.innerHTML = '';
    var summaryLines = [];
    r.rows.forEach(function (row, i) {
      var displayTotal = roundUp ? bstRoundUp(row.totalRounded, 1000) : row.totalRounded;
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><strong>' + (people[i] || ('Người ' + (i + 1))).replace(/</g, '&lt;') + '</strong></td><td>' + money(row.sub) + '</td><td>' + money(row.extra) + '</td><td><strong>' + money(displayTotal) + '</strong></td>';
      tb.appendChild(tr);
      summaryLines.push('• ' + (people[i] || ('Người ' + (i + 1))) + ': ' + money(displayTotal));
    });
    $('bst-items-summary').innerHTML =
      'Tổng tiền món <strong>' + money(r.subTotal) + '</strong> + tip ' + fmt(tipPct) + '% (<strong>' + money(r.tipTotal) + '</strong>)' +
      (r.fee ? ' + phí khác <strong>' + money(r.fee) + '</strong>' : '') +
      ' = <strong>' + money(r.grand) + '</strong>.' +
      (roundUp ? ' Số tiền từng người đã làm tròn lên tới nghìn — tổng thu thực tế có thể dư một chút so với hóa đơn.' : '') +
      (r.ignored ? '<br>⚠️ Có ' + r.ignored + ' món chưa chọn người chia hoặc chưa nhập giá — chưa được tính.' : '');
    $('bst-items-copy').setAttribute('data-text',
      'Chia tiền theo món:\nTổng: ' + money(r.grand) + ' (món ' + money(r.subTotal) + ' + tip ' + money(r.tipTotal) + (r.fee ? ' + phí ' + money(r.fee) : '') + ')\n' + summaryLines.join('\n'));
  }
  $('bst-items-copy').addEventListener('click', function () { copyText(this); });

  function copyText(btn) {
    var text = btn.getAttribute('data-text') || '';
    function done() { var old = btn.textContent; btn.textContent = '✅ Đã sao chép!'; setTimeout(function () { btn.textContent = old; }, 1600); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove(); done();
    }
  }
  function onAnyChange() { if (mode === 'even') calcEven(); }

  renderPeople();
  renderItems();
  calcEven();
  calcItems();
});
