<div class="p2j-soft-wrapper">
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"></script>
  <div class="p2j-lib-error" id="p2j-lib-error" style="display:none">⚠️ Không tải được thư viện đọc PDF. Hãy kiểm tra kết nối mạng rồi tải lại trang. File của bạn không bị gửi đi đâu cả.</div>
  <div class="p2j-card">
    <h3 class="p2j-card-title">🖼️ Chọn file PDF cần chuyển thành ảnh</h3>
    <label class="p2j-drop" id="p2j-drop" for="p2j-file">
      <span class="p2j-drop-icon">📄</span>
      <span class="p2j-drop-text">Bấm để chọn 1 file PDF, hoặc kéo & thả file vào đây</span>
      <span class="p2j-drop-sub">Mỗi trang PDF sẽ thành 1 ảnh — xử lý 100% trong trình duyệt, không tải lên máy chủ</span>
    </label>
    <input type="file" id="p2j-file" class="p2j-file-hidden" accept="application/pdf,.pdf">
    <p class="p2j-fileinfo" id="p2j-fileinfo">Chưa chọn file nào.</p>
    <div id="p2j-options" style="display:none">
      <div class="p2j-row2">
        <div>
          <label class="p2j-label" for="p2j-inp-pages">Trang cần chuyển (để trống = mọi trang)</label>
          <input type="text" id="p2j-inp-pages" class="p2j-inp" autocomplete="off" placeholder="Ví dụ: 1-3, 5">
        </div>
        <div>
          <label class="p2j-label" for="p2j-sel-dpi">Độ nét (DPI)</label>
          <select id="p2j-sel-dpi" class="p2j-inp">
            <option value="150">150 DPI — nhẹ, đủ xem & đăng web</option>
            <option value="200" selected>200 DPI — cân bằng</option>
            <option value="300">300 DPI — nét để in</option>
          </select>
        </div>
      </div>
      <label class="p2j-label">Định dạng ảnh</label>
      <div class="p2j-fmt-row">
        <button type="button" class="p2j-fmt p2j-picked" data-p2j-fmt="jpg">JPG (nhẹ, phổ biến)</button>
        <button type="button" class="p2j-fmt" data-p2j-fmt="png">PNG (nét nhất, nặng hơn)</button>
      </div>
      <p class="p2j-error" id="p2j-error"></p>
      <button type="button" class="p2j-btn p2j-btn-main" id="p2j-btn-convert">🖼️ CHUYỂN THÀNH ẢNH</button>
      <p class="p2j-status" id="p2j-status"></p>
    </div>
  </div>
  <div class="p2j-card" id="p2j-result" style="display:none">
    <p class="p2j-verdict" id="p2j-verdict"></p>
    <button type="button" class="p2j-btn p2j-btn-main" id="p2j-btn-all">⬇️ TẢI TẤT CẢ ẢNH</button>
    <div class="p2j-grid" id="p2j-grid"></div>
    <p class="p2j-note">Nút “Tải tất cả” sẽ tải lần lượt từng ảnh — trình duyệt có thể hỏi cho phép tải nhiều file, hãy bấm Đồng ý. File gốc của bạn không bị thay đổi.</p>
  </div>
</div>
