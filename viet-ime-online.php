<div class="ovi-soft-wrapper">

  <section class="ovi-card">
    <div class="ovi-controls">
      <div class="ovi-group">
        <span class="ovi-group-label">⌨️ Kiểu gõ</span>
        <button type="button" class="ovi-chip ovi-chip-active" data-ovi-method="telex">Telex</button>
        <button type="button" class="ovi-chip" data-ovi-method="vni">VNI</button>
        <button type="button" class="ovi-chip" data-ovi-method="off">Tắt</button>
      </div>
      <div class="ovi-group">
        <span class="ovi-group-label">🎯 Đặt dấu</span>
        <button type="button" class="ovi-chip ovi-chip-active" data-ovi-style="new">Kiểu mới (hòa, tùy)</button>
        <button type="button" class="ovi-chip" data-ovi-style="old">Kiểu cũ (hoà, tuỳ)</button>
      </div>
    </div>

    <textarea id="ovi-input" class="ovi-textarea" rows="9" placeholder="Bắt đầu gõ tại đây theo kiểu Telex hoặc VNI… Ví dụ gõ: Vieetj Nam quee huowng tooid depj laems!&#10;&#10;⚠️ Nhớ TẮT Unikey / bộ gõ tiếng Việt của máy trước khi gõ ở đây, nếu không dấu sẽ bị nhân đôi." aria-label="Ô soạn thảo tiếng Việt"></textarea>

    <div class="ovi-toolbar">
      <span id="ovi-count" class="ovi-count">0 ký tự · 0 từ</span>
      <span id="ovi-saved" class="ovi-saved"></span>
      <div class="ovi-actions">
        <button type="button" id="ovi-btn-sample" class="ovi-btn">✨ Chèn câu mẫu</button>
        <button type="button" id="ovi-btn-copy" class="ovi-btn">📋 Sao chép</button>
        <button type="button" id="ovi-btn-download" class="ovi-btn">⬇️ Tải .txt</button>
        <button type="button" id="ovi-btn-clear" class="ovi-btn ovi-btn-danger">🧹 Xóa hết</button>
      </div>
    </div>
  </section>

  <details class="ovi-accordion">
    <summary>📖 Bảng phím gõ nhanh &amp; lưu ý</summary>
    <div class="ovi-acc-body">
      <div class="ovi-tables">
        <table class="ovi-table">
          <caption>Telex</caption>
          <tr><td>s / f / r / x / j</td><td>sắc / huyền / hỏi / ngã / nặng</td></tr>
          <tr><td>aa / ee / oo</td><td>â / ê / ô</td></tr>
          <tr><td>aw / ow / uw</td><td>ă / ơ / ư</td></tr>
          <tr><td>dd</td><td>đ</td></tr>
          <tr><td>z</td><td>xóa toàn bộ dấu của từ</td></tr>
        </table>
        <table class="ovi-table">
          <caption>VNI</caption>
          <tr><td>1 / 2 / 3 / 4 / 5</td><td>sắc / huyền / hỏi / ngã / nặng</td></tr>
          <tr><td>6</td><td>dấu mũ: â ê ô</td></tr>
          <tr><td>7</td><td>dấu móc: ơ ư</td></tr>
          <tr><td>8</td><td>dấu trăng: ă</td></tr>
          <tr><td>9</td><td>đ</td></tr>
          <tr><td>0</td><td>xóa toàn bộ dấu của từ</td></tr>
        </table>
      </div>
      <p><strong>Mẹo dùng:</strong> gõ lại chính phím dấu vừa gõ để bỏ dấu đó (ví dụ Telex gõ "ass" sẽ thành "as"). Muốn gõ số ngay sau một từ trong chế độ VNI, hãy gõ dấu cách trước vì các phím số trong VNI là phím dấu. Văn bản được <strong>lưu nháp tự động</strong> ngay trên trình duyệt của bạn — lỡ đóng trang, mở lại vẫn còn nguyên.</p>
      <p><strong>Đặt dấu:</strong> công cụ đặt dấu thanh theo quy tắc chính tả phổ biến, có cả hai kiểu mới (hòa, tùy, toán) và kiểu cũ (hoà, tuỳ, tóan) để bạn chọn. Một số ít từ ngoại lệ không theo quy tắc chung của tiếng Việt có thể được đặt dấu khác với cách viết quen thuộc.</p>
    </div>
  </details>

</div>
