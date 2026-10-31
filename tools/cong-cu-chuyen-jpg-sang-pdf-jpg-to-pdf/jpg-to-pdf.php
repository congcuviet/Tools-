<div class="j2p-soft-wrapper">
  <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
  <div class="j2p-lib-error" id="j2p-lib-error" style="display:none">⚠️ Không tải được thư viện xử lý PDF. Hãy kiểm tra kết nối mạng rồi tải lại trang. File của bạn không bị gửi đi đâu cả.</div>
  <div class="j2p-card">
    <h3 class="j2p-card-title">🖼️ Chọn ảnh JPG / PNG cần ghép thành PDF</h3>
    <label class="j2p-drop" id="j2p-drop" for="j2p-file">
      <span class="j2p-drop-icon">🖼️</span>
      <span class="j2p-drop-text">Bấm để chọn nhiều ảnh, hoặc kéo & thả ảnh vào đây</span>
      <span class="j2p-drop-sub">Hỗ trợ JPG và PNG — ảnh xử lý 100% trong trình duyệt, không tải lên máy chủ</span>
    </label>
    <input type="file" id="j2p-file" class="j2p-file-hidden" accept="image/jpeg,image/png,.jpg,.jpeg,.png" multiple>
    <ul class="j2p-list" id="j2p-list"></ul>
    <p class="j2p-summary" id="j2p-summary">Chưa chọn ảnh nào — mỗi ảnh sẽ thành 1 trang PDF theo đúng thứ tự trong danh sách.</p>
    <label class="j2p-label" for="j2p-sel-size">Khổ trang PDF</label>
    <select id="j2p-sel-size" class="j2p-inp">
      <option value="fit" selected>Vừa theo ảnh (trang to bằng ảnh)</option>
      <option value="a4">A4 (210 × 297 mm)</option>
      <option value="letter">Letter (216 × 279 mm)</option>
    </select>
    <label class="j2p-label" for="j2p-sel-margin">Lề trắng quanh ảnh (chỉ áp dụng với A4 / Letter)</label>
    <select id="j2p-sel-margin" class="j2p-inp">
      <option value="0">Không lề</option>
      <option value="28" selected>10 mm</option>
      <option value="57">20 mm</option>
    </select>
    <p class="j2p-error" id="j2p-error"></p>
    <button type="button" class="j2p-btn j2p-btn-main" id="j2p-btn-build" disabled>📕 TẠO FILE PDF</button>
    <p class="j2p-status" id="j2p-status"></p>
  </div>
  <div class="j2p-card" id="j2p-result" style="display:none">
    <p class="j2p-verdict" id="j2p-verdict"></p>
    <a class="j2p-btn j2p-btn-main" id="j2p-download" href="#" download="anh-sang-pdf-congcu-viet.pdf">⬇️ TẢI FILE PDF</a>
    <p class="j2p-note">Ảnh JPG được nhúng nguyên chất lượng gốc vào PDF (không nén lại). Cần gộp thêm file PDF khác? Xem <a href="/cong-cu/cong-cu-gop-file-pdf-merge-pdf/">Công cụ gộp file PDF</a>.</p>
  </div>
</div>
