<div class="pwc-soft-wrapper">
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"></script>
  <div class="pwc-lib-error" id="pwc-lib-error" style="display:none">⚠️ Không tải được thư viện đọc PDF. Hãy kiểm tra kết nối mạng rồi tải lại trang. File của bạn không bị gửi đi đâu cả.</div>
  <div class="pwc-card">
    <h3 class="pwc-card-title">🔢 Chọn file PDF cần đếm từ</h3>
    <label class="pwc-drop" id="pwc-drop" for="pwc-file">
      <span class="pwc-drop-icon">📄</span>
      <span class="pwc-drop-text">Bấm để chọn 1 file PDF, hoặc kéo & thả file vào đây</span>
      <span class="pwc-drop-sub">Đếm tự động ngay khi chọn file — 100% trong trình duyệt, không tải lên máy chủ</span>
    </label>
    <input type="file" id="pwc-file" class="pwc-file-hidden" accept="application/pdf,.pdf">
    <p class="pwc-fileinfo" id="pwc-fileinfo">Chưa chọn file nào.</p>
    <p class="pwc-status" id="pwc-status"></p>
  </div>
  <div class="pwc-card" id="pwc-result" style="display:none">
    <p class="pwc-verdict" id="pwc-verdict"></p>
    <div class="pwc-stats">
      <div class="pwc-stat pwc-hero"><span class="pwc-stat-cap">🔤 Tổng số từ</span><span class="pwc-stat-val" id="pwc-out-words">0</span></div>
      <div class="pwc-stat"><span class="pwc-stat-cap">🔡 Ký tự (có dấu cách)</span><span class="pwc-stat-val" id="pwc-out-chars">0</span></div>
      <div class="pwc-stat"><span class="pwc-stat-cap">🔡 Ký tự (không dấu cách)</span><span class="pwc-stat-val" id="pwc-out-chars-ns">0</span></div>
      <div class="pwc-stat"><span class="pwc-stat-cap">📄 Số trang</span><span class="pwc-stat-val" id="pwc-out-pages">0</span></div>
      <div class="pwc-stat"><span class="pwc-stat-cap">📊 Từ trung bình / trang</span><span class="pwc-stat-val" id="pwc-out-avg">0</span></div>
      <div class="pwc-stat"><span class="pwc-stat-cap">📖 Thời gian đọc (~200 từ/phút)</span><span class="pwc-stat-val" id="pwc-out-read">0</span></div>
    </div>
    <h4 class="pwc-sub">🏆 Từ khóa xuất hiện nhiều nhất</h4>
    <div id="pwc-topwords"></div>
    <details class="pwc-acc">
      <summary>📑 Chi tiết từng trang</summary>
      <div class="pwc-tablewrap">
        <table class="pwc-table">
          <thead><tr><th>Trang</th><th>Số từ</th><th>Ký tự</th></tr></thead>
          <tbody id="pwc-tbody"></tbody>
        </table>
      </div>
    </details>
    <p class="pwc-note">Số liệu chỉ tính lớp chữ có sẵn trong PDF. File scan dạng ảnh sẽ cho kết quả 0 từ — trường hợp đó cần OCR. Cần lấy toàn bộ văn bản ra? Dùng <a href="/cong-cu/cong-cu-pdf-sang-van-ban-pdf-to-text-extractor/">Công cụ PDF sang văn bản</a>.</p>
  </div>
</div>
