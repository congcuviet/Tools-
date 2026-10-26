<div class="vcut-soft-wrapper">
    <div class="vcut-soft-header">
        <h2>Cắt Video Nhanh</h2>
        <p>Chọn điểm bắt đầu và kết thúc để cắt lấy đoạn video bạn ưng ý nhất.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG TỪ HOST CỦA BẠN -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vcut-body">
        
        <!-- Khung Upload -->
        <div class="vcut-group">
            <div class="vcut-upload-box" onclick="document.getElementById('vcut-file-input').click()">
                <input type="file" id="vcut-file-input" hidden accept="video/*">
                <span class="vcut-icon">🎞️</span>
                <span id="vcut-filename" class="vcut-filename">Nhấp để tải video lên...</span>
            </div>
        </div>

        <!-- Trình Phát Video để canh thời gian (Ẩn lúc đầu) -->
        <div id="vcut-player-box" style="display: none;">
            <video id="vcut-player" controls preload="metadata"></video>
            
            <div class="vcut-time-controls">
                <!-- Cột Bắt Đầu -->
                <div class="vcut-time-col">
                    <label>⏱ Bắt đầu (giây)</label>
                    <input type="number" id="vcut-time-start" class="vcut-input" value="0" min="0" step="0.1">
                    <button class="vcut-btn-sm" id="vcut-btn-get-start">👇 Lấy mốc hiện tại</button>
                </div>
                
                <!-- Cột Kết Thúc -->
                <div class="vcut-time-col">
                    <label>⏱ Kết thúc (giây)</label>
                    <input type="number" id="vcut-time-end" class="vcut-input" value="0" min="0" step="0.1">
                    <button class="vcut-btn-sm" id="vcut-btn-get-end">👇 Lấy mốc hiện tại</button>
                </div>
            </div>

            <!-- Nút Xử Lý -->
            <button id="vcut-btn-cut" class="vcut-btn-primary">
                ✂️ Cắt & Xuất Video
            </button>
        </div>

        <!-- Trạng thái & Thanh Progress -->
        <div id="vcut-status-box" class="vcut-status-box" style="display: none;">
            <h4 id="vcut-status-text">Đang khởi động lõi Render...</h4>
            <div class="vcut-progress-bar">
                <div id="vcut-progress-fill" class="vcut-progress-fill"></div>
            </div>
        </div>
        
    </div>
</div>