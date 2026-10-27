<div class="bst-soft-wrapper">
  <div class="bst-modebar">
    <button type="button" class="bst-chip bst-chip-active" data-bst-mode="even">⚖️ Chia đều</button>
    <button type="button" class="bst-chip" data-bst-mode="items">🧾 Chia theo món</button>
  </div>

  <!-- CHIA ĐỀU -->
  <section id="bst-sec-even">
    <div class="bst-grid">
      <div>
        <div class="bst-card">
          <h3 class="bst-card-title">🧾 Hóa đơn của nhóm</h3>
          <label class="bst-label" for="bst-even-total">Tổng tiền trên hóa đơn (đ)</label>
          <input type="text" id="bst-even-total" class="bst-inp bst-inp-big" value="1.200.000" inputmode="numeric">
          <label class="bst-label">Tiền tip / boa (%)</label>
          <div class="bst-chips">
            <button type="button" class="bst-chip" data-bst-tip="0">0%</button>
            <button type="button" class="bst-chip" data-bst-tip="5">5%</button>
            <button type="button" class="bst-chip bst-chip-active" data-bst-tip="10">10%</button>
            <button type="button" class="bst-chip" data-bst-tip="15">15%</button>
            <button type="button" class="bst-chip" data-bst-tip="20">20%</button>
          </div>
          <label class="bst-label" for="bst-even-tip-custom">Hoặc tự nhập % tip</label>
          <input type="text" id="bst-even-tip-custom" class="bst-inp" placeholder="Ví dụ: 12" inputmode="decimal">
          <label class="bst-label" for="bst-even-people">Số người chia</label>
          <input type="number" id="bst-even-people" class="bst-inp" value="4" min="1" max="100">
          <label class="bst-check">
            <input type="checkbox" id="bst-even-round">
            <span>Làm tròn lên tới nghìn cho dễ trả tiền mặt (1.000đ)</span>
          </label>
        </div>
      </div>
      <div>
        <div class="bst-hero">
          <div class="bst-hero-label">💸 MỖI NGƯỜI TRẢ</div>
          <div class="bst-hero-value" id="bst-even-hero">0đ</div>
          <p class="bst-hero-detail" id="bst-even-detail"></p>
          <button type="button" class="bst-btn bst-btn-soft" id="bst-even-copy">📋 Sao chép kết quả gửi nhóm chat</button>
        </div>
      </div>
    </div>
  </section>

  <!-- CHIA THEO MÓN -->
  <section id="bst-sec-items" style="display:none">
    <div class="bst-card">
      <h3 class="bst-card-title">👥 Ai đi ăn? (tối đa 12 người)</h3>
      <div id="bst-people"></div>
      <button type="button" class="bst-btn bst-btn-soft" id="bst-add-person">➕ Thêm người</button>
    </div>
    <div class="bst-card">
      <h3 class="bst-card-title">🍽️ Các món đã gọi</h3>
      <div id="bst-items"></div>
      <button type="button" class="bst-btn bst-btn-soft" id="bst-add-item">➕ Thêm món</button>
      <div class="bst-grid2">
        <div>
          <label class="bst-label" for="bst-items-tip">Tip chung (%) — chia theo tỉ lệ tiền món</label>
          <input type="text" id="bst-items-tip" class="bst-inp" value="10" inputmode="decimal">
        </div>
        <div>
          <label class="bst-label" for="bst-items-fee">Phí khác (đ): ship, phí phục vụ…</label>
          <input type="text" id="bst-items-fee" class="bst-inp" value="0" inputmode="numeric">
        </div>
      </div>
      <label class="bst-check">
        <input type="checkbox" id="bst-items-round">
        <span>Làm tròn số tiền từng người lên tới nghìn (1.000đ)</span>
      </label>
    </div>
    <div class="bst-card">
      <h3 class="bst-card-title">💸 Kết quả chia tiền</h3>
      <div class="bst-table-wrap">
        <table class="bst-table">
          <thead><tr><th>Người</th><th>Tiền món</th><th>Tip + phí</th><th>Phải trả</th></tr></thead>
          <tbody id="bst-items-body"></tbody>
        </table>
      </div>
      <p class="bst-summary" id="bst-items-summary"></p>
      <button type="button" class="bst-btn bst-btn-soft" id="bst-items-copy">📋 Sao chép kết quả gửi nhóm chat</button>
    </div>
  </section>

  <details class="bst-acc">
    <summary>💡 Mẹo chia tiền &amp; văn hóa tip ở Việt Nam</summary>
    <div class="bst-acc-body">
      <p><strong>Chia đều hay chia theo món?</strong> Bữa ăn chung, gọi món tập thể thì chia đều cho nhanh và vui vẻ. Khi có người ăn ít, uống riêng đồ đắt tiền (rượu, bia) hoặc đến muộn/về sớm, chia theo món sẽ công bằng hơn — bật chip “Chia cho” trên từng món để chọn đúng người dùng món đó.</p>
      <p><strong>Tip ở Việt Nam:</strong> không bắt buộc như ở Mỹ. Nhà hàng thường đã tính phí phục vụ 5% và VAT trong hóa đơn. Tiền boa thêm 5–10% là cách cảm ơn khi phục vụ tốt; quán ăn bình dân thì làm tròn tiền thừa là đủ lịch sự. Khi đi nước ngoài: Mỹ 15–20%, châu Âu 5–10% (có nơi đã gồm phí phục vụ), Nhật Bản không tip (có thể bị coi là thiếu tôn trọng).</p>
      <p><strong>Tip và phí khác trong chế độ theo món</strong> được phân bổ theo tỉ lệ tiền món của từng người: ai gọi nhiều hơn thì gánh phần tip/phí lớn hơn — cách chia phổ biến và được xem là công bằng nhất.</p>
      <p><strong>Gửi kết quả vào nhóm chat:</strong> dùng nút “Sao chép kết quả gửi nhóm chat” rồi dán vào Zalo/Messenger — mọi người thấy rõ phần của mình, tránh tranh cãi “tớ trả bao nhiêu nhỉ?”.</p>
    </div>
  </details>
</div>
