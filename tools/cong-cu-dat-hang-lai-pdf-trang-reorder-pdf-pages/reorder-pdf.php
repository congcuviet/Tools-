<div class="rpo-soft-wrapper">
  <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"></script>
  <div class="rpo-lib-error" id="rpo-lib-error" style="display:none">⚠️ Không tải được thư viện xử lý PDF. Hãy kiểm tra kết nối mạng rồi tải lại trang. File của bạn không bị gửi đi đâu cả.</div>
  <div class="rpo-card">
    <h3 class="rpo-card-title">🔀 Chọn file PDF cần sắp xếp lại trang</h3>
    <label class="rpo-drop" id="rpo-drop" for="rpo-file">
      <span class="rpo-drop-icon">📄</span>
      <span class="rpo-drop-text">Bấm để chọn 1 file PDF, hoặc kéo & thả file vào đây</span>
      <span class="rpo-drop-sub">Tối đa 100 trang — xử lý 100% trong trình duyệt, không tải lên máy chủ</span>
    </label>
    <input type="file" id="rpo-file" class="rpo-file-hidden" accept="application/pdf,.pdf">
    <p class="rpo-fileinfo" id="rpo-fileinfo">Chưa chọn file nào.</p>
    <p class="rpo-status" id="rpo-status"></p>
    <div id="rpo-work" style="display:none">
      <div class="rpo-toolbar">
        <button type="button" class="rpo-btn" id="rpo-btn-reverse">🔃 Đảo ngược thứ tự</button>
        <button type="button" class="rpo-btn" id="rpo-btn-reset">↩️ Về thứ tự gốc</button>
      </div>
      <p class="rpo-hint">Dùng nút ◀ ▶ trên từng thẻ để đổi vị trí trang, hoặc kéo-thả thẻ trang. Nhãn trên thẻ là số trang gốc.</p>
      <div class="rpo-grid" id="rpo-grid"></div>
      <p class="rpo-error" id="rpo-error"></p>
      <button type="button" class="rpo-btn rpo-btn-main" id="rpo-btn-build">💾 TẠO FILE PDF THEO THỨ TỰ MỚI</button>
    </div>
  </div>
  <div class="rpo-card" id="rpo-result" style="display:none">
    <p class="rpo-verdict" id="rpo-verdict"></p>
    <p class="rpo-order-line" id="rpo-order-line"></p>
    <a class="rpo-btn rpo-btn-main" id="rpo-download" href="#" download="pdf-da-sap-xep-congcu-viet.pdf">⬇️ TẢI FILE PDF ĐÃ SẮP XẾP</a>
  </div>
</div>
