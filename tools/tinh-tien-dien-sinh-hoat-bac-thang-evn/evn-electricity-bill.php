<div class="evb-soft-wrapper">
    <div class="evb-form-card">
        <h3 class="evb-form-title">⚡ Tháng này nhà bạn dùng bao nhiêu điện?</h3>

        <div class="evb-radio-row">
            <label class="evb-radio"><input type="radio" name="evb-mode" id="evb-mode-kwh" value="kwh" checked> Nhập số kWh</label>
            <label class="evb-radio"><input type="radio" name="evb-mode" id="evb-mode-meter" value="meter"> Nhập chỉ số công tơ</label>
        </div>

        <div class="evb-field" id="evb-kwh-wrap">
            <label for="evb-inp-kwh">🔌 Tổng số điện tiêu thụ (kWh)</label>
            <input type="number" id="evb-inp-kwh" min="0" max="100000" step="1" value="250">
            <small class="evb-hint">Chính là số "kWh" / số điện ghi trên hóa đơn hoặc app EVN của nhà bạn.</small>
        </div>

        <div id="evb-meter-wrap" style="display:none">
            <div class="evb-meter-grid">
                <div class="evb-field">
                    <label for="evb-inp-old">Chỉ số cũ</label>
                    <input type="number" id="evb-inp-old" min="0" step="1" value="1250">
                </div>
                <div class="evb-field">
                    <label for="evb-inp-new">Chỉ số mới</label>
                    <input type="number" id="evb-inp-new" min="0" step="1" value="1500">
                </div>
            </div>
            <small class="evb-hint">Điện tiêu thụ = chỉ số mới − chỉ số cũ. Hai số này có trên hóa đơn điện tháng trước và tháng này.</small>
        </div>

        <div class="evb-form-grid">
            <div class="evb-field">
                <label for="evb-inp-households">🏠 Số hộ dùng chung 1 công tơ</label>
                <input type="number" id="evb-inp-households" min="1" max="50" step="1" value="1">
                <small class="evb-hint">Nhiều hộ chung công tơ thì định mức mỗi bậc được nhân lên theo số hộ.</small>
            </div>
            <div class="evb-field">
                <label for="evb-sel-vat">🧾 Thuế VAT</label>
                <select id="evb-sel-vat">
                    <option value="0.08" selected>8% — đang áp dụng hiện nay</option>
                    <option value="0.10">10% — mức thông thường</option>
                </select>
                <small class="evb-hint">Điện đang được giảm VAT còn 8% theo chính sách hiện hành.</small>
            </div>
        </div>

        <button type="button" class="evb-btn-calc" id="evb-btn-calc">⚡ Tính tiền điện ngay</button>
        <p class="evb-form-note">Kết quả chi tiết theo từng bậc thang sẽ hiện ngay bên dưới. Sau khi tính, bạn cứ sửa số — kết quả tự cập nhật, không cần bấm lại.</p>
    </div>

    <div class="evb-results" id="evb-results" style="display:none">
        <div class="evb-verdict" id="evb-verdict"></div>

        <div class="evb-stat evb-stat-main">
            <span class="evb-stat-label">💵 Tổng tiền điện phải trả (đã gồm VAT)</span>
            <span class="evb-stat-line"><span class="evb-stat-value" id="evb-out-total">0</span> <span class="evb-stat-unit">đ</span></span>
        </div>
        <div class="evb-substats">
            <div class="evb-stat">
                <span class="evb-stat-label">Tiền điện trước VAT</span>
                <span class="evb-stat-line"><span class="evb-stat-value" id="evb-out-subtotal">0</span> <span class="evb-stat-unit">đ</span></span>
            </div>
            <div class="evb-stat">
                <span class="evb-stat-label">Thuế VAT</span>
                <span class="evb-stat-line"><span class="evb-stat-value" id="evb-out-vat">0</span> <span class="evb-stat-unit">đ</span></span>
            </div>
            <div class="evb-stat">
                <span class="evb-stat-label">Giá trung bình mỗi kWh</span>
                <span class="evb-stat-line"><span class="evb-stat-value" id="evb-out-avg">0</span> <span class="evb-stat-unit">đ/kWh</span></span>
            </div>
        </div>
        <div class="evb-pills" id="evb-pills"></div>

        <div class="evb-viz-card">
            <h3>🪜 Điện của bạn được chia vào các bậc nào?</h3>
            <div id="evb-tier-bars"></div>
            <p class="evb-bar-note">Mỗi bậc chỉ tính cho phần điện nằm trong bậc đó — dùng càng nhiều, phần điện vượt sang bậc cao càng đắt. Đây là lý do hóa đơn tăng nhanh hơn mức dùng điện.</p>
        </div>

        <div class="evb-actions">
            <button type="button" class="evb-btn" id="evb-btn-copy">📋 Sao chép kết quả</button>
            <button type="button" class="evb-btn evb-btn-alt" id="evb-btn-download">⬇️ Tải kết quả (.txt)</button>
        </div>
    </div>

    <details class="evb-acc">
        <summary>📋 Bảng giá điện sinh hoạt hiện hành &amp; căn cứ tính</summary>
        <div class="evb-acc-body">
            <table class="evb-table">
                <thead>
                    <tr><th>Bậc</th><th>Mức tiêu thụ (cho 1 hộ)</th><th>Đơn giá (chưa VAT)</th></tr>
                </thead>
                <tbody>
                    <tr><td>Bậc 1</td><td>0 – 50 kWh</td><td class="evb-num">1.984đ/kWh</td></tr>
                    <tr><td>Bậc 2</td><td>51 – 100 kWh</td><td class="evb-num">2.050đ/kWh</td></tr>
                    <tr><td>Bậc 3</td><td>101 – 200 kWh</td><td class="evb-num">2.380đ/kWh</td></tr>
                    <tr><td>Bậc 4</td><td>201 – 300 kWh</td><td class="evb-num">2.998đ/kWh</td></tr>
                    <tr><td>Bậc 5</td><td>301 – 400 kWh</td><td class="evb-num">3.350đ/kWh</td></tr>
                    <tr><td>Bậc 6</td><td>Trên 400 kWh</td><td class="evb-num">3.460đ/kWh</td></tr>
                </tbody>
            </table>
            <ul class="evb-legal">
                <li>Biểu giá bán lẻ điện sinh hoạt 6 bậc theo <strong>Quyết định 1279/QĐ-BCT</strong> ngày 09/5/2025 của Bộ Công Thương, áp dụng từ 10/5/2025; giá bán lẻ điện bình quân 2.204,07đ/kWh.</li>
                <li>Tiền điện = tổng tiền từng bậc (số kWh trong bậc × đơn giá bậc) cộng thuế VAT. Điện sinh hoạt đang áp VAT 8% theo chính sách giảm thuế hiện hành (trước đó là 10%).</li>
                <li>Trường hợp nhiều hộ dùng chung một công tơ, định mức (số kWh) của mỗi bậc được nhân với số hộ dùng chung.</li>
                <li><strong>Lưu ý sắp tới:</strong> Quyết định 14/2025/QĐ-TTg đã duyệt cơ cấu biểu giá mới rút gọn còn 5 bậc (0–100, 101–200, 201–400, 401–700, trên 700 kWh) nhưng <strong>chưa áp dụng thực tế</strong> — hóa đơn hiện vẫn tính theo 6 bậc ở trên. Công cụ sẽ cập nhật ngay khi biểu giá mới có hiệu lực áp dụng.</li>
                <li>Kết quả là ước tính theo biểu giá chuẩn cho kỳ 1 tháng; hóa đơn thực tế có thể chênh lệch nhỏ do số ngày ghi chỉ số khác 30 ngày hoặc làm tròn của đơn vị điện lực.</li>
            </ul>
        </div>
    </details>
</div>
