<div class="xpm-soft-wrapper">
  <div class="xpm-grid">
    <div class="xpm-card">
      <h3 class="xpm-card-title">🔢 Nhập giá trị cần đổi</h3>
      <label class="xpm-label" for="xpm-inp-value">Giá trị</label>
      <input type="text" id="xpm-inp-value" class="xpm-inp" inputmode="decimal" autocomplete="off" value="1">
      <label class="xpm-label" for="xpm-sel-unit">Đơn vị của giá trị vừa nhập</label>
      <select id="xpm-sel-unit" class="xpm-inp">
        <option value="percent" selected>Phần trăm (%)</option>
        <option value="ppm">ppm — phần triệu</option>
        <option value="ppb">ppb — phần tỷ</option>
        <option value="ppt">ppt — phần nghìn tỷ</option>
        <option value="ratio">Tỷ lệ thập phân (0,01 = 1%)</option>
      </select>
      <div class="xpm-chips">
        <button type="button" class="xpm-chip" data-xpm-set="1|percent">1%</button>
        <button type="button" class="xpm-chip" data-xpm-set="0.5|percent">0,5%</button>
        <button type="button" class="xpm-chip" data-xpm-set="500|ppm">500 ppm</button>
        <button type="button" class="xpm-chip" data-xpm-set="420|ppm">420 ppm (CO₂ khí quyển)</button>
        <button type="button" class="xpm-chip" data-xpm-set="35000|ppm">35.000 ppm (độ mặn nước biển)</button>
      </div>
      <p class="xpm-hint">ppm nghĩa là “phần triệu” (parts per million): 1 ppm = 1 phần trong 1.000.000 phần. Đơn vị này dùng khi hàm lượng rất nhỏ: clo trong nước hồ bơi, CO₂ trong không khí, độ mặn, dư lượng thuốc bảo vệ thực vật…</p>
    </div>
    <div>
      <p id="xpm-verdict" class="xpm-verdict"></p>
      <div class="xpm-card">
        <h3 class="xpm-card-title">🔁 Giá trị tương đương ở mọi đơn vị</h3>
        <table class="xpm-table">
          <tbody id="xpm-rows"></tbody>
        </table>
        <div class="xpm-actions">
          <button type="button" class="xpm-btn xpm-btn-main" id="xpm-btn-copy">📋 Sao chép kết quả</button>
        </div>
        <p class="xpm-note">Công thức gốc: <strong>1% = 10.000 ppm</strong> · 1 ppm = 1.000 ppb · 1 ppb = 1.000 ppt. Với dung dịch nước loãng, 1 ppm ≈ 1 mg/L.</p>
      </div>
    </div>
  </div>
  <div class="xpm-card">
    <details class="xpm-acc">
      <summary>📏 Bảng quy đổi nhanh thường gặp</summary>
      <table class="xpm-table">
        <thead><tr><th>Phần trăm (%)</th><th>ppm</th><th>Ghi chú thực tế</th></tr></thead>
        <tbody>
          <tr><td>100%</td><td class="xpm-num">1.000.000</td><td>Toàn phần</td></tr>
          <tr><td>10%</td><td class="xpm-num">100.000</td><td></td></tr>
          <tr><td>1%</td><td class="xpm-num">10.000</td><td></td></tr>
          <tr><td>0,1%</td><td class="xpm-num">1.000</td><td></td></tr>
          <tr><td>0,01%</td><td class="xpm-num">100</td><td></td></tr>
          <tr><td>0,001%</td><td class="xpm-num">10</td><td></td></tr>
          <tr><td>0,0001%</td><td class="xpm-num">1</td><td>1 ppm = một phần triệu</td></tr>
          <tr><td>0,042%</td><td class="xpm-num">420</td><td>Nồng độ CO₂ trong khí quyển (xấp xỉ)</td></tr>
          <tr><td>3,5%</td><td class="xpm-num">35.000</td><td>Độ mặn trung bình của nước biển</td></tr>
        </tbody>
      </table>
    </details>
    <details class="xpm-acc">
      <summary>📌 ppm, ppb, ppt là gì? Dùng khi nào?</summary>
      <p class="xpm-note">Khi hàm lượng một chất quá nhỏ, dùng phần trăm sẽ ra những số thập phân dài khó đọc (0,0001%). Người ta chuyển sang các đơn vị “phần …”: ppm (phần triệu, 10⁶), ppb (phần tỷ, 10⁹), ppt (phần nghìn tỷ, 10¹²). Ví dụ: clo dư trong nước hồ bơi chuẩn là 1–3 ppm; giới hạn chì trong nước uống khoảng 10 ppb. Lưu ý: “ppt” trong một số tài liệu cũng có thể là “parts per thousand” (phần nghìn) — hãy kiểm tra ngữ cảnh của tài liệu bạn đang đọc.</p>
    </details>
  </div>
</div>
