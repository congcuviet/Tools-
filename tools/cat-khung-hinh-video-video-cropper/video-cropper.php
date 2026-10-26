<div class="vcrop-soft-wrapper">
    <div class="vcrop-soft-header">
        <h2>🔳 Cắt Khung Hình Video</h2>
        <p>Cắt xén video theo các tỷ lệ chuẩn (TikTok, Vuông, Ngang) và chọn chất lượng xuất ra siêu mượt.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG TỪ HOST CỦA BẠN -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vcrop-body">
        
        <!-- Khung Upload -->
        <div class="vcrop-group">
            <div class="vcrop-upload-box" onclick="document.getElementById('vcrop-file-input').click()">
                <input type="file" id="vcrop-file-input" hidden accept="video/*">
                <span class="vcrop-icon">✂️</span>
                <span id="vcrop-filename" class="vcrop-filename">Nhấp để tải video lên...</span>
            </div>
        </div>

        <!-- Trình Phát Video (Ẩn lúc đầu) -->
        <div id="vcrop-player-box" style="display: none; margin-bottom: 20px;">
            <video id="vcrop-player" controls preload="metadata"></video>
        </div>

        <!-- Khung Cài Đặt (Kích thước & Chất lượng) -->
        <div id="vcrop-settings" style="display: none;">
            <div class="vcrop-group">
                <label class="vcrop-label">🎯 Chọn Tỷ Lệ & Khung Hình Xuất Ra:</label>
                <div class="neo-select-wrapper">
                    <select id="vcrop-resolution" class="neo-select">
                        <optgroup label="📱 VIDEO DỌC (TikTok, Reels, Shorts)">
                            <option value="1080x1920">9:16 - Full HD 1080x1920 (Nét nhất)</option>
                            <option value="720x1280" selected>9:16 - HD 720x1280 (Nhẹ, tối ưu Web)</option>
                        </optgroup>
                        <optgroup label="🔲 VIDEO VUÔNG (Facebook, Instagram)">
                            <option value="1080x1080">1:1 - Full HD 1080x1080</option>
                            <option value="720x720">1:1 - HD 720x720</option>
                        </optgroup>
                        <optgroup label="📺 VIDEO NGANG (YouTube, Phim)">
                            <option value="1920x1080">16:9 - Full HD 1920x1080</option>
                            <option value="1280x720">16:9 - HD 1280x720</option>
                        </optgroup>
                    </select>
                </div>
            </div>

            <!-- TÍNH NĂNG MỚI: CHỌN CHẾ ĐỘ CẮT HOẶC VIỀN ĐEN -->
            <div class="vcrop-group">
                <label class="vcrop-label">🎨 Chọn Chế Độ Hiển Thị:</label>
                <div class="neo-select-wrapper">
                    <select id="vcrop-mode" class="neo-select">
                        <option value="crop" selected>✂️ Phóng to lấp đầy (Bị cắt xén 2 cạnh)</option>
                        <option value="pad">⬛ Thêm viền đen (Giữ nguyên toàn bộ video gốc)</option>
                    </select>
                </div>
                <p class="vcrop-hint-text">👉 <b>Phóng to:</b> Đẹp mắt nhưng có thể mất chi tiết ở 2 bên. <br> 👉 <b>Viền đen:</b> Giữ đủ 100% hình ảnh gốc nhưng sẽ xuất hiện mảng đen thừa.</p>
            </div>
        </div>

        <!-- Nút Xử Lý -->
        <button id="vcrop-btn-cut" class="vcrop-btn-primary" disabled>
            🚀 Xử Lý & Tải Xuống
        </button>

        <!-- Trạng thái & Thanh Progress -->
        <div id="vcrop-status-box" class="vcrop-status-box" style="display: none;">
            <h4 id="vcrop-status-text">Đang khởi động lõi Render...</h4>
            <div class="vcrop-progress-bar">
                <div id="vcrop-progress-fill" class="vcrop-progress-fill"></div>
            </div>
            <p id="vcrop-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
        </div>
        
    </div>
</div>