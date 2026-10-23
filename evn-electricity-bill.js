document.addEventListener('DOMContentLoaded', function () {

    /* ===== PURE LOGIC START ===== */
    var EVB_BOUNDS = [50, 100, 200, 300, 400];
    var EVB_PRICES = [1984, 2050, 2380, 2998, 3350, 3460];
    var EVB_COLORS = ['#a2d2ff', '#95d5b2', '#fdfd96', '#ffd6a5', '#ffafcc', '#ff8fa3'];
    function evbCompute(kwh, households, vatRate) {
        var h = Math.max(1, households || 1);
        var rows = [], subtotal = 0, maxTier = 0;
        for (var i = 0; i < 6; i++) {
            var lo = (i === 0 ? 0 : EVB_BOUNDS[i - 1]) * h;
            var hi = i < 5 ? EVB_BOUNDS[i] * h : Infinity;
            var used = Math.max(0, Math.min(kwh, hi) - lo);
            var amount = used * EVB_PRICES[i];
            if (used > 0) maxTier = i + 1;
            subtotal += amount;
            rows.push({ tier: i + 1, lo: lo, hi: hi, used: used, price: EVB_PRICES[i], amount: amount });
        }
        var vat = subtotal * vatRate;
        var total = subtotal + vat;
        return {
            rows: rows, subtotal: subtotal, vat: vat, total: total,
            maxTier: maxTier, avg: kwh > 0 ? total / kwh : 0
        };
    }
    /* ===== PURE LOGIC END ===== */

    function $(id) { return document.getElementById(id); }
    function fmt(n) { return Math.round(n).toLocaleString('vi-VN'); }
    function fmtKwh(n) { return (Math.round(n * 10) / 10).toLocaleString('vi-VN'); }

    var calculated = false;
    var lastRes = null, lastKwh = 0, lastVat = 0.08;

    function readKwh() {
        if ($('evb-mode-meter').checked) {
            var o = parseFloat($('evb-inp-old').value) || 0;
            var n = parseFloat($('evb-inp-new').value) || 0;
            return Math.max(0, n - o);
        }
        return Math.max(0, parseFloat($('evb-inp-kwh').value) || 0);
    }

    function render() {
        var kwh = readKwh();
        var households = Math.max(1, parseInt($('evb-inp-households').value, 10) || 1);
        var vatRate = parseFloat($('evb-sel-vat').value) || 0.08;
        var res = evbCompute(kwh, households, vatRate);
        lastRes = res; lastKwh = kwh; lastVat = vatRate;

        $('evb-out-total').textContent = fmt(res.total);
        $('evb-out-subtotal').textContent = fmt(res.subtotal);
        $('evb-out-vat').textContent = fmt(res.vat);
        $('evb-out-avg').textContent = fmt(res.avg);

        var tip;
        if (res.maxTier <= 2) tip = 'Nhà bạn dùng điện khá tiết kiệm — phần lớn điện vẫn nằm ở 2 bậc rẻ nhất, cứ giữ nếp này nhé.';
        else if (res.maxTier === 3) tip = 'Mức dùng phổ biến của hộ gia đình. Muốn giảm thêm, để ý các thiết bị chạy nền như bình nóng lạnh, tủ lạnh cũ.';
        else if (res.maxTier === 4) tip = 'Điện đã chạm bậc 4 (2.998đ/kWh) — mỗi số điện dùng thêm từ giờ đắt hơn hẳn các số đầu tháng, điều hòa là thủ phạm thường gặp nhất.';
        else tip = 'Cảnh báo: điện đã vào bậc ' + res.maxTier + ' với giá ' + fmt(EVB_PRICES[res.maxTier - 1]) + 'đ/kWh. Phần điện ở các bậc cao này là phần khiến hóa đơn "nhảy" mạnh nhất.';
        $('evb-verdict').innerHTML = 'Tháng này nhà bạn dùng <strong>' + fmtKwh(kwh) + ' kWh</strong> — tiền điện phải trả <strong>' + fmt(res.total) + 'đ</strong> (đã gồm VAT ' + Math.round(vatRate * 100) + '%), giá trung bình <strong>' + fmt(res.avg) + 'đ/kWh</strong>, bậc cao nhất chạm tới là <strong>bậc ' + (res.maxTier || 1) + '</strong>. ' + tip;

        var pills = '';
        if (households > 1) pills += '<span class="evb-pill">Đang tính cho <strong>' + households + ' hộ</strong> dùng chung công tơ — định mức mỗi bậc đã nhân ' + households + '</span>';
        if (kwh >= 10) {
            var saved = res.total - evbCompute(kwh * 0.9, households, vatRate).total;
            if (saved > 0) pills += '<span class="evb-pill">💡 Nếu giảm được <strong>10%</strong> lượng điện (xuống ' + fmtKwh(kwh * 0.9) + ' kWh), bạn tiết kiệm khoảng <strong>' + fmt(saved) + 'đ</strong> tháng này</span>';
        }
        $('evb-pills').innerHTML = pills;

        var bars = '';
        res.rows.forEach(function (r) {
            if (r.used <= 0) return;
            var pct = kwh > 0 ? Math.max(3, r.used / kwh * 100) : 0;
            var range = r.hi === Infinity ? ('trên ' + fmtKwh(r.lo)) : (fmtKwh(r.lo) + '–' + fmtKwh(r.hi));
            bars += '<div class="evb-tier-row">' +
                '<div class="evb-tier-head"><strong>Bậc ' + r.tier + '</strong><span>' + range + ' kWh</span></div>' +
                '<div class="evb-tier-track"><div class="evb-tier-fill" style="width:' + pct + '%;background:' + EVB_COLORS[r.tier - 1] + '"></div></div>' +
                '<div class="evb-tier-calc">' + fmtKwh(r.used) + ' kWh × ' + fmt(r.price) + 'đ = <strong>' + fmt(r.amount) + 'đ</strong></div>' +
                '</div>';
        });
        if (!bars) bars = '<p class="evb-bar-note">Chưa có điện tiêu thụ nên chưa chia bậc được.</p>';
        $('evb-tier-bars').innerHTML = bars;
    }

    function calculate() {
        calculated = true;
        render();
        var box = $('evb-results');
        box.style.display = '';
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    $('evb-btn-calc').addEventListener('click', calculate);

    ['evb-mode-kwh', 'evb-mode-meter'].forEach(function (id) {
        $(id).addEventListener('change', function () {
            var meter = $('evb-mode-meter').checked;
            $('evb-kwh-wrap').style.display = meter ? 'none' : '';
            $('evb-meter-wrap').style.display = meter ? '' : 'none';
            if (calculated) render();
        });
    });

    ['evb-inp-kwh', 'evb-inp-old', 'evb-inp-new', 'evb-inp-households', 'evb-sel-vat'].forEach(function (id) {
        var el = $(id);
        if (!el) return;
        el.addEventListener('input', function () { if (calculated) render(); });
        el.addEventListener('change', function () { if (calculated) render(); });
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); calculate(); } });
    });

    function buildText() {
        if (!lastRes) return '';
        var r = lastRes;
        var lines = [
            'KẾT QUẢ TÍNH TIỀN ĐIỆN SINH HOẠT BẬC THANG EVN — CongCuViet.com',
            'Điện tiêu thụ: ' + fmtKwh(lastKwh) + ' kWh',
            '— — —'
        ];
        r.rows.forEach(function (row) {
            if (row.used > 0) lines.push('Bậc ' + row.tier + ': ' + fmtKwh(row.used) + ' kWh × ' + fmt(row.price) + 'đ = ' + fmt(row.amount) + 'đ');
        });
        lines.push('— — —');
        lines.push('Tiền điện trước VAT: ' + fmt(r.subtotal) + 'đ');
        lines.push('VAT (' + Math.round(lastVat * 100) + '%): ' + fmt(r.vat) + 'đ');
        lines.push('TỔNG PHẢI TRẢ: ' + fmt(r.total) + 'đ');
        lines.push('— — —');
        lines.push('Tính tại congcuviet.com theo biểu giá Quyết định 1279/QĐ-BCT, mang tính tham khảo.');
        return lines.join('\n');
    }

    $('evb-btn-copy').addEventListener('click', function () {
        var btn = this;
        function done() { btn.textContent = '✅ Đã sao chép!'; setTimeout(function () { btn.textContent = '📋 Sao chép kết quả'; }, 2000); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(buildText()).then(done, done);
        } else {
            var ta = document.createElement('textarea');
            ta.value = buildText(); document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); } catch (e) {}
            document.body.removeChild(ta); done();
        }
    });

    $('evb-btn-download').addEventListener('click', function () {
        var blob = new Blob([buildText()], { type: 'text/plain;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'CongCuViet_Tinh_Tien_Dien_EVN.txt';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
    });
});
