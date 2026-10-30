<div class="stt-soft-wrapper">
  <div id="stt-unsupported" class="stt-alert" style="display:none">
    ⚠️ Trình duyệt này chưa hỗ trợ nhận dạng giọng nói. Bạn hãy mở trang bằng <strong>Google Chrome</strong> hoặc <strong>Microsoft Edge</strong> (máy tính hoặc Android) để nói và chép chữ. Trong lúc đó, ô soạn thảo bên dưới vẫn gõ tay bình thường được.
  </div>
  <div class="stt-grid">
    <div class="stt-card stt-main-card">
      <div class="stt-mic-row">
        <button type="button" id="stt-mic" class="stt-mic-btn"><span id="stt-mic-label">🎤 BẮT ĐẦU NÓI</span></button>
        <div class="stt-status-wrap">
          <span id="stt-status-dot" class="stt-dot stt-dot-off"></span>
          <span id="stt-status" class="stt-status">Sẵn sàng — bấm nút rồi nói tiếng Việt</span>
          <span class="stt-session" id="stt-session">0 từ trong phiên này</span>
        </div>
      </div>
      <div id="stt-interim" class="stt-interim"></div>
      <div id="stt-help-mic" class="stt-help" style="display:none">
        🔒 <strong>Chưa có quyền dùng micro.</strong> Hãy bấm vào biểu tượng ổ khóa/micro trên thanh địa chỉ của trình duyệt → cho phép Micro cho trang congcuviet.com → tải lại trang và bấm “Bắt đầu nói” lần nữa. Cũng kiểm tra máy đã cắm micro/tai nghe chưa nhé.
      </div>
      <div id="stt-help-network" class="stt-help" style="display:none">
        🌐 <strong>Mất kết nối tới dịch vụ nhận dạng.</strong> Tính năng này cần internet (âm thanh được trình duyệt gửi lên máy chủ của hãng trình duyệt để chép chữ). Kiểm tra mạng rồi thử lại.
      </div>
      <label class="stt-label" for="stt-text">Văn bản của bạn (gõ tay để sửa thoải mái — bản nháp tự lưu trên máy này)</label>
      <textarea id="stt-text" class="stt-inp stt-textarea" rows="11" placeholder="Nhấn 🎤 BẮT ĐẦU NÓI rồi đọc — chữ sẽ tự chạy vào đây…"></textarea>
      <div class="stt-stats">
        <span id="stt-words">0 từ</span><span class="stt-dot-sep">•</span>
        <span id="stt-chars">0 ký tự</span><span class="stt-dot-sep">•</span>
        <span>⏱ <span id="stt-time">00:00</span></span>
      </div>
      <div class="stt-btn-row">
        <button type="button" class="stt-btn stt-btn-main" id="stt-copy">📋 Sao chép</button>
        <button type="button" class="stt-btn stt-btn-soft" id="stt-download">⬇️ Tải file .txt</button>
        <button type="button" class="stt-btn stt-btn-soft" id="stt-clear">🗑️ Xóa hết</button>
      </div>
    </div>
    <div>
      <div class="stt-card">
        <h3 class="stt-card-title">⚙️ Cài đặt</h3>
        <label class="stt-label" for="stt-lang">Ngôn ngữ giọng nói</label>
        <select id="stt-lang" class="stt-inp">
          <option value="vi-VN" selected>Tiếng Việt</option>
          <option value="en-US">English (US)</option>
        </select>
        <label class="stt-check"><input type="checkbox" id="stt-commands" checked> Lệnh dấu câu bằng giọng nói (nói “chấm”, “phẩy”, “xuống dòng”…)</label>
        <label class="stt-check"><input type="checkbox" id="stt-tidy" checked> Tự viết hoa đầu câu & chuẩn khoảng cách</label>
        <p class="stt-note">Riêng tư: công cụ chạy ngay trong trình duyệt của bạn, không cần tài khoản. Trên Chrome/Edge, âm thanh được gửi tới máy chủ của Google/Microsoft để nhận dạng — đừng đọc thông tin nhạy cảm như mật khẩu, số thẻ.</p>
      </div>
      <div class="stt-card">
        <h3 class="stt-card-title">🗣️ Lệnh nói dấu câu</h3>
        <table class="stt-table">
          <tr><td>“chấm” / “dấu chấm”</td><td>.</td></tr>
          <tr><td>“phẩy” / “dấu phẩy”</td><td>,</td></tr>
          <tr><td>“chấm hỏi”</td><td>?</td></tr>
          <tr><td>“chấm than”</td><td>!</td></tr>
          <tr><td>“hai chấm”</td><td>:</td></tr>
          <tr><td>“chấm phẩy”</td><td>;</td></tr>
          <tr><td>“mở ngoặc” / “đóng ngoặc”</td><td>( )</td></tr>
          <tr><td>“xuống dòng”</td><td>↵ đoạn mới</td></tr>
        </table>
        <p class="stt-note">Cần dùng đúng chữ “chấm/phẩy” trong văn bản (ví dụ “chấm bài”) thì tắt “Lệnh dấu câu” trong Cài đặt trước khi nói.</p>
      </div>
      <div class="stt-card">
        <h3 class="stt-card-title">💡 Mẹo chép chữ chuẩn</h3>
        <ul class="stt-tips">
          <li>Nói rõ ràng, tốc độ vừa phải, gần micro hoặc dùng tai nghe có mic.</li>
          <li>Đọc theo từng câu ngắn; ngắt quãng tự nhiên để máy kịp chốt câu.</li>
          <li>Chỗ ồn ào dễ sai chữ — tìm góc yên tĩnh sẽ chuẩn hơn hẳn.</li>
          <li> Chrome trên Android cũng dùng được — hợp để ghi chú khi đi đường (nhớ đảm bảo an toàn).</li>
        </ul>
      </div>
    </div>
  </div>
</div>
