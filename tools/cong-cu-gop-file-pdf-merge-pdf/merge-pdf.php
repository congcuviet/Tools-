<div class="mpd-soft-wrapper">
  <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
  <div class="mpd-lib-error" id="mpd-lib-error" style="display:none">⚠️ Không tải được thư viện xử lý PDF. Hãy kiểm tra kết nối mạng rồi tải lại trang. File của bạn không bị gửi đi đâu cả.</div>
  <div class="mpd-card">
    <h3 class="mpd-card-title">📎 Chọn các file PDF cần gộp</h3>
    <label class="mpd-drop" id="mpd-drop" for="mpd-file">
      <span class="mpd-drop-icon">📄</span>
      <span class="mpd-drop-text">Bấm để chọn file PDF, hoặc kéo & thả file vào đây</span>
      <span class="mpd-drop-sub">Chọn được nhiều file cùng lúc · File xử lý 100% ngay trong trình duyệt, không tải lên máy chủ</span>
    </label>
    <input type="file" id="mpd-file" class="mpd-file-hidden" accept="application/pdf,.pdf" multiple>
    <ul class="mpd-list" id="mpd-list"></ul>
    <p class="mpd-summary" id="mpd-summary">Chưa có file nào. Hãy chọn ít nhất 2 file PDF để gộp.</p>
    <div class="mpd-actions">
      <button type="button" class="mpd-btn mpd-btn-main" id="mpd-btn-merge" disabled>🔗 GỘP CÁC FILE PDF</button>
      <button type="button" class="mpd-btn mpd-btn-soft" id="mpd-btn-clear" disabled>🗑️ Xóa danh sách</button>
    </div>
    <p class="mpd-status" id="mpd-status"></p>
  </div>
  <div class="mpd-card mpd-result" id="mpd-result" style="display:none">
    <p class="mpd-verdict" id="mpd-verdict"></p>
    <div class="mpd-stats">
      <div class="mpd-stat"><span class="mpd-stat-cap">📄 Tổng số trang</span><span class="mpd-stat-val" id="mpd-out-pages">0</span></div>
      <div class="mpd-stat"><span class="mpd-stat-cap">💾 Dung lượng file gộp</span><span class="mpd-stat-val" id="mpd-out-size">0</span></div>
      <div class="mpd-stat"><span class="mpd-stat-cap">🗂️ Số file đã gộp</span><span class="mpd-stat-val" id="mpd-out-files">0</span></div>
    </div>
    <a class="mpd-btn mpd-btn-main mpd-download" id="mpd-download" href="#" download="gop-file-pdf-congcu-viet.pdf">⬇️ TẢI FILE PDF ĐÃ GỘP</a>
    <p class="mpd-note">Thứ tự trang trong file kết quả đúng theo thứ tự danh sách ở trên. Nếu cần đổi thứ tự, dùng nút ↑ ↓ trong danh sách rồi gộp lại.</p>
  </div>
  <div class="mpd-card">
    <details class="mpd-acc">
      <summary>📌 Lưu ý khi gộp PDF</summary>
      <p class="mpd-note">File có mật khẩu mở (user password) sẽ không đọc được — hãy gỡ mật khẩu trước. File đặt quyền hạn chế (owner password) vẫn gộp được nhưng quyền hạn chế có thể không giữ nguyên sau khi gộp. Dung lượng quá lớn (hàng trăm MB) có thể làm trình duyệt chậm — nên chia nhỏ nếu gặp tình trạng này. Mọi thao tác diễn ra trên máy của bạn: file không rời khỏi trình duyệt.</p>
    </details>
  </div>
</div>
