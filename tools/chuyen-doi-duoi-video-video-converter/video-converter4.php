<div class="vconv-soft-wrapper">
    <div class="vconv-soft-header">
        <h2>🔄 Chuyển Đổi Định Dạng Video</h2>
        <p>Đổi đuôi video sang MP4, WEBM, MKV, MOV hoặc GIF. Xử lý 100% offline trên máy của bạn, bảo mật tuyệt đối.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vconv-body">
        
        <!-- Khung Upload -->
        <div class="vconv-group">
            <div class="vconv-upload-box" id="vconv-box-video" onclick="document.getElementById('vconv-video-input').click()">
                <input type="file" id="vconv-video-input" hidden accept="video/*">
                <span class="vconv-icon" id="vconv-icon-video">📁</span>
                <span id="vconv-video-name" class="vconv-filename">Nhấp để tải Video cần chuyển đổi...</span>
            </div>
        </div>

        <!-- Khu vực Cài Đặt (Ẩn lúc đầu) -->
        <div id="vconv-settings" style="display: none;">
            
            <div class="vconv-group">
                <label class="vconv-label">🎯 Chọn Định Dạng Xuất Ra:</label>
                <div class="neo-select-wrapper">
                    <select id="vconv-format-select" class="neo-select">
                        <option value="mp4" selected>MP4 (Chuẩn phổ biến nhất, tương thích mọi thiết bị)</option>
                        <option value="mov">MOV (Chuẩn của Apple / QuickTime)</option>
                        <option value="mkv">MKV (Hỗ trợ chất lượng cao, phụ đề)</option>
                        <option value="webm">WEBM (Tối ưu cho Website / HTML5)</option>
                        <option value="gif">GIF (Ảnh động không tiếng - Phù hợp video ngắn)</option>
                        <option value="avi">AVI (Định dạng cổ điển của Windows)</option>
                    </select>
                </div>
            </div>

            <div class="vconv-group" id="vconv-quality-group">
                <label class="vconv-label">⚙️ Chế Độ Chuyển Đổi (Mã Hóa):</label>
                <div class="neo-select-wrapper">
                    <select id="vconv-quality-select" class="neo-select">
                        <option value="fast" selected>⚡ Render Nhanh (Chất lượng khá, tốc độ cao)</option>
                        <option value="high">✨ Render Chất Lượng Cao (Sắc nét, file nặng hơn, hơi chậm)</option>
                        <option value="copy">🚀 Đổi Đuôi Siêu Tốc (Copy Stream - Không làm giảm chất lượng)</option>
                    </select>
                </div>
                <p class="vconv-hint-text">
                    💡 <b>Lưu ý chế độ Siêu Tốc:</b> Chỉ hoạt động nếu chuẩn nén gốc tương thích với đuôi mới (VD: H264 từ MKV sang MP4). Nếu bị lỗi, hãy chọn "Render Nhanh".
                </p>
            </div>

            <!-- Nút Xử Lý -->
            <button id="vconv-btn-start" class="vconv-btn-primary">
                🚀 Bắt Đầu Chuyển Đổi
            </button>
        </div>

        <!-- Trạng thái & Thanh Progress -->
        <div id="vconv-status-box" class="vconv-status-box" style="display: none;">
            <h4 id="vconv-status-text">Đang khởi động lõi Render...</h4>
            <div class="vconv-progress-bar">
                <div id="vconv-progress-fill" class="vconv-progress-fill"></div>
            </div>
            <p id="vconv-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
        </div>
        
    </div>
</div>