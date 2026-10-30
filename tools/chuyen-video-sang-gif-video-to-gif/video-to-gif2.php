<div class="v2g-soft-wrapper">
    <div class="v2g-soft-header">
        <h2>🎞️ Chuyển Đổi Video ↔️ GIF</h2>
        <p>Cắt đoạn video ưng ý thành ảnh động GIF, hoặc chuyển GIF thành MP4 để dễ dàng đăng lên mạng xã hội.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="v2g-body">
        
        <div class="v2g-main-layout">
            
            <!-- CỘT TRÁI: Upload & Preview & Tiến Độ -->
            <div class="v2g-col">
                <div class="v2g-group" id="v2g-upload-group">
                    <div class="v2g-upload-box" id="v2g-box-video" onclick="document.getElementById('v2g-file-input').click()">
                        <input type="file" id="v2g-file-input" hidden accept="video/*, image/gif">
                        <span class="v2g-icon" id="v2g-icon-video">🔄</span>
                        <span id="v2g-file-name" class="v2g-filename">Nhấp tải Video hoặc GIF...</span>
                        <span id="v2g-file-size" class="v2g-filesize" style="display: none;"></span>
                    </div>
                </div>

                <!-- Khu vực Preview (Hiện khi có Video) -->
                <div id="v2g-preview-section" style="display: none; margin-bottom: 20px;">
                    <label class="v2g-label">👀 Xem Trước & Canh Khung Hình:</label>
                    <video id="v2g-player" controls preload="metadata" style="width: 100%; border-radius: 12px; border: 2px solid #111; background: #000;"></video>
                </div>

                <!-- Trạng thái & Thanh Progress -->
                <div id="v2g-status-box" class="v2g-status-box" style="display: none;">
                    <h4 id="v2g-status-text">Đang khởi động lõi Render...</h4>
                    <div class="v2g-progress-bar">
                        <div id="v2g-progress-fill" class="v2g-progress-fill"></div>
                    </div>
                    <p id="v2g-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
                </div>
            </div>

            <!-- CỘT PHẢI: Cài Đặt & Nút Bấm -->
            <div class="v2g-col" id="v2g-settings" style="display: none;">
                
                <div class="v2g-group">
                    <label class="v2g-label">⚙️ Chế Độ Hoạt Động:</label>
                    <div class="neo-select-wrapper">
                        <select id="v2g-mode-select" class="neo-select">
                            <option value="vid2gif" selected>🎬 Video ➡️ Ảnh động (GIF)</option>
                            <option value="gif2vid">🖼️ Ảnh động (GIF) ➡️ Video (MP4)</option>
                        </select>
                    </div>
                </div>

                <!-- TIMELINE CẮT NHANH (Chỉ hiện cho Video) -->
                <div id="v2g-trim-settings" style="background: #f1f3f5; border: 2px solid #111; padding: 15px; border-radius: 12px; margin-bottom: 20px;">
                    <label class="v2g-label" style="color: var(--clr-violet);">✂️ Chọn đoạn Video làm GIF:</label>
                    
                    <div class="v2g-control-row">
                        <span class="v2g-control-label">Bắt đầu (s):</span>
                        <div class="v2g-flex-input">
                            <input type="range" class="v2g-slider" id="v2g-trim-start" min="0" step="0.1" value="0">
                            <input type="number" class="v2g-input-num" id="v2g-num-start" min="0" step="0.1" value="0">
                        </div>
                    </div>

                    <div class="v2g-control-row" style="margin-top: 10px;">
                        <span class="v2g-control-label">Kết thúc (s):</span>
                        <div class="v2g-flex-input">
                            <input type="range" class="v2g-slider" id="v2g-trim-end" min="0" step="0.1" value="10">
                            <input type="number" class="v2g-input-num" id="v2g-num-end" min="0" step="0.1" value="10">
                        </div>
                    </div>
                    <p class="v2g-hint-text">💡 <b>Khuyên dùng:</b> Chỉ nên cắt từ 3 đến 10 giây để ảnh GIF mượt và dung lượng nhẹ.</p>
                </div>

                <!-- Cài đặt chuẩn GIF -->
                <div id="v2g-gif-settings">
                    <div class="v2g-group">
                        <label class="v2g-label">🎞️ Độ mượt (FPS):</label>
                        <div class="neo-select-wrapper">
                            <select id="v2g-fps-select" class="neo-select">
                                <option value="10">10 FPS (File siêu nhẹ - Hơi giật)</option>
                                <option value="15" selected>15 FPS (Cân bằng - Khuyên dùng)</option>
                                <option value="24">24 FPS (Rất mượt - File nặng)</option>
                            </select>
                        </div>
                    </div>

                    <div class="v2g-group">
                        <label class="v2g-label">📐 Kích thước ảnh ngang:</label>
                        <div class="neo-select-wrapper">
                            <select id="v2g-scale-select" class="neo-select">
                                <option value="320">320px (Nhỏ gọn - Làm Avatar/Icon)</option>
                                <option value="480" selected>480px (Tiêu chuẩn Meme - Tốt nhất)</option>
                                <option value="720">720px (Khổ lớn - File sẽ rất nặng)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div id="v2g-vid-settings" style="display: none;">
                    <p class="v2g-hint-text" style="background: var(--clr-mint);">✅ Hệ thống sẽ tự động ép kích thước chẵn và xuất chuẩn H.264 để đăng Tiktok, Facebook mượt mà.</p>
                </div>

                <button id="v2g-btn-start" class="v2g-btn-primary">
                    🚀 Render & Tải Xuống
                </button>
            </div>

        </div> 
        
    </div>
</div>