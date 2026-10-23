<div class="svd-soft-wrapper">
  <div class="svd-grid">
    <div class="svd-card">
      <h3 class="svd-card-title">🏦 Thông tin khoản gửi</h3>
      <label class="svd-label" for="svd-principal">Số tiền gửi (đ)</label>
      <input type="text" inputmode="numeric" id="svd-principal" class="svd-inp" value="100.000.000">
      <label class="svd-label" for="svd-rate">Lãi suất (%/năm)</label>
      <input type="text" inputmode="decimal" id="svd-rate" class="svd-inp" value="5">
      <label class="svd-label" for="svd-start">Ngày bắt đầu gửi</label>
      <input type="date" id="svd-start" class="svd-inp">
      <label class="svd-label">Kỳ hạn</label>
      <div class="svd-chips">
        <button type="button" class="svd-chip" data-svd-term="1">1 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="3">3 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="6">6 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="9">9 tháng</button>
        <button type="button" class="svd-chip svd-chip-active" data-svd-term="12">12 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="18">18 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="24">24 tháng</button>
        <button type="button" class="svd-chip" data-svd-term="36">36 tháng</button>
      </div>
      <label class="svd-label" for="svd-term">Hoặc tự nhập số tháng</label>
      <input type="number" id="svd-term" class="svd-inp" value="12" min="1" max="120">
      <label class="svd-label" for="svd-payout">Cách lĩnh lãi</label>
      <select id="svd-payout" class="svd-inp">
        <option value="cuoiky" selected>Cuối kỳ (phổ biến nhất)</option>
        <option value="hangthang">Hàng tháng</option>
        <option value="dau">Đầu kỳ (lĩnh lãi trước)</option>
      </select>
      <label class="svd-label" for="svd-periods">Số kỳ gửi liên tiếp — tái tục, lãi nhập gốc (chỉ áp dụng khi lĩnh lãi cuối kỳ)</label>
      <input type="number" id="svd-periods" class="svd-inp" value="1" min="1" max="10">
      <label class="svd-check"><input type="checkbox" id="svd-early-on"> Tính thêm kịch bản rút trước hạn</label>
      <div id="svd-early-fields" style="display:none">
        <label class="svd-label" for="svd-early-days">Số ngày đã gửi khi rút (ngày)</label>
        <input type="number" id="svd-early-days" class="svd-inp" value="90" min="1">
        <label class="svd-label" for="svd-early-rate">Lãi suất không kỳ hạn (%/năm) — thường 0,1%</label>
        <input type="text" inputmode="decimal" id="svd-early-rate" class="svd-inp" value="0,1">
      </div>
      <button type="button" id="svd-calc" class="svd-btn svd-btn-main svd-calc-btn">🧮 TÍNH LÃI TIẾT KIỆM</button>
      <div id="svd-error" class="svd-error" style="display:none"></div>
      <p class="svd-note">Lãi tính theo số ngày thực tế ÷ 365 như ngân hàng. Sau lần tính đầu tiên, kết quả tự cập nhật khi bạn sửa thông tin.</p>
    </div>
    <div>
      <div class="svd-card svd-placeholder" id="svd-placeholder">
        <div class="svd-ph-icon">🐷</div>
        <h3 class="svd-card-title">Kết quả sẽ hiện ở đây</h3>
        <p class="svd-note">Điền số tiền, lãi suất, kỳ hạn rồi bấm <strong>“TÍNH LÃI TIẾT KIỆM”</strong>. Bạn sẽ thấy:</p>
        <ul class="svd-ph-list">
          <li>💰 Tổng tiền nhận về khi đáo hạn (gốc + lãi)</li>
          <li>📅 Ngày đáo hạn chính xác theo lịch, số ngày gửi thực tế</li>
          <li>🔁 Bảng lãi nhập gốc nếu gửi tái tục nhiều kỳ</li>
          <li>⚠️ Nếu rút trước hạn thì mất bao nhiêu so với để đủ kỳ</li>
        </ul>
      </div>
      <div class="svd-card" id="svd-result" style="display:none">
        <p id="svd-verdict" class="svd-verdict"></p>
        <div class="svd-hero">
          <div class="svd-hero-num"><span id="svd-hero-num">0</span><span class="svd-hero-unit">đ</span></div>
          <div class="svd-hero-cap">TỔNG TIỀN NHẬN VỀ (GỐC + LÃI)</div>
        </div>
        <div class="svd-stats">
          <div class="svd-stat"><span class="svd-stat-val" id="svd-interest">—</span><span class="svd-stat-cap">Tổng tiền lãi</span></div>
          <div class="svd-stat"><span class="svd-stat-val" id="svd-per-month">—</span><span class="svd-stat-cap">Lãi trung bình mỗi tháng</span></div>
          <div class="svd-stat"><span class="svd-stat-val" id="svd-maturity">—</span><span class="svd-stat-cap">Ngày đáo hạn</span></div>
        </div>
        <p class="svd-note" id="svd-days"></p>
        <p class="svd-note" id="svd-payout-note"></p>
        <div id="svd-early-wrap" style="display:none">
          <h4 class="svd-sub-title">⚠️ Kịch bản rút trước hạn</h4>
          <p class="svd-note" id="svd-early-text"></p>
          <div class="svd-bar-row"><span class="svd-bar-label">Đủ kỳ</span><div class="svd-bar-track"><div class="svd-bar svd-bar-full" style="width:100%"></div></div><span class="svd-bar-amt" id="svd-full-amount"></span></div>
          <div class="svd-bar-row"><span class="svd-bar-label">Rút sớm</span><div class="svd-bar-track"><div class="svd-bar svd-bar-early" id="svd-bar-early" style="width:2%"></div></div><span class="svd-bar-amt" id="svd-early-amount"></span></div>
        </div>
        <div id="svd-schedule-wrap" style="display:none">
          <h4 class="svd-sub-title">🔁 Bảng tái tục (lãi nhập gốc)</h4>
          <div class="svd-table-scroll">
            <table class="svd-table">
              <thead><tr><th>Kỳ</th><th>Thời gian</th><th>Ngày</th><th>Gốc đầu kỳ</th><th>Lãi kỳ này</th><th>Gốc + lãi cuối kỳ</th></tr></thead>
              <tbody id="svd-schedule-body"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="svd-card">
    <details class="svd-acc">
      <summary>🏦 Ngân hàng tính lãi tiền gửi như thế nào?</summary>
      <p>Tiền lãi = Số tiền gửi × Lãi suất (%/năm) × Số ngày gửi thực tế ÷ 365. Số ngày thực tế được tính từ ngày gửi đến ngày đáo hạn theo lịch — vì vậy cùng kỳ hạn 6 tháng nhưng bắt đầu vào tháng khác nhau, số ngày có thể chênh 181–184 ngày và tiền lãi chênh theo. Công cụ này tính đúng theo ngày lịch từ ngày bạn chọn, thay vì lấy tròn 30 ngày/tháng như nhiều nơi ước lượng.</p>
    </details>
    <details class="svd-acc">
      <summary>⚠️ Rút tiền trước hạn bị tính lãi thế nào?</summary>
      <p>Nếu tất toán trước ngày đáo hạn, gần như toàn bộ khoản gửi (kể cả phần đã gửi đủ tháng) bị tính lại theo lãi suất không kỳ hạn rất thấp (thường khoảng 0,1%/năm) cho đúng số ngày đã gửi — đây là lý do rút sớm thường mất gần hết lãi như kịch bản công cụ minh họa. Một số ngân hàng có sản phẩm cho rút từng phần hoặc vay cầm sổ thế chấp sổ tiết kiệm với lãi vay thấp hơn phần lãi bị mất — nếu cần tiền gấp, hãy hỏi ngân hàng về hai cách này trước khi tất toán toàn bộ.</p>
    </details>
    <details class="svd-acc">
      <summary>💡 Mẹo gửi tiết kiệm hiệu quả</summary>
      <p>Chia khoản tiền thành 2–3 sổ với kỳ hạn lệch nhau (ví dụ 6, 12, 18 tháng): khi một sổ đáo hạn bạn có tiền dùng ngay, các sổ còn lại vẫn hưởng lãi cao, và tránh phải rút trước hạn toàn bộ. Khoản tiền nhàn rỗi dài hạn nên ưu tiên kỳ hạn 12–13 tháng vì đây thường là vùng lãi suất cao nhất trên biểu lãi của các ngân hàng. Khi đáo hạn, nếu chưa cần tiền, chọn tái tục gốc + lãi để hưởng lãi kép như bảng tái tục của công cụ.</p>
    </details>
  </div>
</div>
