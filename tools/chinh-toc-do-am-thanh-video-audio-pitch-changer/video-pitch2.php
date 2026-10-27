<div class="vapc-soft-wrapper">
    <div class="vapc-soft-header">
        <h2>🐿️ Đổi Tốc Độ & Tone Giọng</h2>
        <p>Tua nhanh/chậm video hoặc biến đổi giọng nói thành Chipmunk, Monster cực kỳ vui nhộn!</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vapc-body">
        
        <!-- Khung Upload -->
        <div class="vapc-group">
            <div class="vapc-upload-box" id="vapc-box-video" onclick="document.getElementById('vapc-video-input').click()">
                <input type="file" id="vapc-video-input" hidden accept="video/*">
                <span class="vapc-icon" id="vapc-icon-video">🎬</span>
                <span id="vapc-video-name" class="vapc-filename">Nhấp để tải Video...</span>
            </div>
        </div>

        <!-- Khu vực Cài Đặt (Ẩn lúc đầu) -->
        <div id="vapc-settings" style="display: none;">
            
            <!-- THÊM HƯỚNG DẪN Ở KHUNG VIDEO -->
            <div class="vapc-group">
                <label class="vapc-label">👀 Xem Trước Tốc Độ (Mặc định):</label>
                <div class="vapc-preview-container">
                    <video id="vapc-player" controls preload="metadata"></video>
                </div>
            </div>

            <div class="vapc-group">
                <label class="vapc-label">⏩ Chỉnh Tốc Độ Video (Speed):</label>
                <div class="vapc-val-display">Tốc độ: <span id="vapc-speed-text">1.0</span>x</div>
                <div class="vapc-timeline-wrapper">
                    <input type="range" id="vapc-speed-slider" class="vapc-slider" min="0.5" max="2.0" step="0.1" value="1.0">
                </div>
                <div class="vapc-quick-btns">
                    <button class="vapc-btn-quick" data-val="0.5">Slo-mo (0.5x)</button>
                    <button class="vapc-btn-quick" data-val="1.0">Gốc (1.0x)</button>
                    <button class="vapc-btn-quick" data-val="1.5">Nhanh (1.5x)</button>
                    <button class="vapc-btn-quick" data-val="2.0">Timelapse (2.0x)</button>
                </div>
            </div>

            <div class="vapc-group">
                <label class="vapc-label">🎤 Đổi Tone Giọng Nói (Pitch):</label>
                <div class="neo-select-wrapper">
                    <select id="vapc-pitch-select" class="neo-select">
                        <option value="2.0">👽 Giọng Người Ngoài Hành Tinh (Rất Cao)</option>
                        <option value="1.5">🐿️ Giọng Sóc Chuột / Chipmunk (Cao)</option>
                        <option value="1.0" selected>👤 Giọng Người Thật (Bình Thường - Mặc định)</option>
                        <option value="0.7">🐻 Giọng Gấu / Ồm ồm (Trầm)</option>
                        <option value="0.5">👹 Giọng Quái Vật / Demon (Rất Trầm)</option>
                    </select>
                </div>
                
                <!-- KHU VỰC NGHE THỬ CẬP NHẬT RÕ RÀNG HƠN -->
                <div style="background: #f1f3f5; border: 2px dashed #111; padding: 15px; border-radius: 12px; margin-top: 15px;">
                    <p style="margin: 0 0 10px 0; font-size: 0.9rem; font-weight: 700; color: #d90429;">
                        👉 Hướng dẫn: Hãy bấm phát video ở trên, dừng lại tại đoạn đang có tiếng người nói, sau đó bấm nút nghe thử bên dưới.
                    </p>
                    <button id="vapc-btn-preview-audio" class="vapc-btn-preview">
                        🎧 Nghe Thử Tone Giọng (8 giây)
                    </button>
                </div>
                
                <p class="vapc-hint-text">💡 <b>Mẹo xịn:</b> Nếu bạn CHỈ đổi Tone Giọng và giữ Tốc Độ là 1.0x, quá trình render sẽ diễn ra siêu tốc (Vì không cần encode lại hình ảnh).</p>
            </div>

            <!-- Nút Xử Lý -->
            <button id="vapc-btn-start" class="vapc-btn-primary">
                🚀 Render Video Hoàn Chỉnh & Tải Xuống
            </button>
        </div>

        <!-- Trạng thái & Thanh Progress -->
        <div id="vapc-status-box" class="vapc-status-box" style="display: none;">
            <h4 id="vapc-status-text">Đang khởi động lõi Render...</h4>
            <div class="vapc-progress-bar">
                <div id="vapc-progress-fill" class="vapc-progress-fill"></div>
            </div>
            <p id="vapc-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
        </div>
        
    </div>
</div>