<div class="vflt-soft-wrapper">
    <div class="vflt-soft-header">
        <h2>🎨 Chỉnh Màu Video (Color Grading Pro)</h2>
        <p>Áp dụng các bộ lọc điện ảnh có sẵn hoặc tự do sáng tạo màu sắc riêng cho video của bạn.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vflt-body">
        
        <div class="vflt-main-layout">
            
            <!-- CỘT TRÁI: Upload & Preview -->
            <div class="vflt-col">
                <div class="vflt-group">
                    <div class="vflt-upload-box" id="vflt-box-video" onclick="document.getElementById('vflt-video-input').click()">
                        <input type="file" id="vflt-video-input" hidden accept="video/*">
                        <span class="vflt-icon" id="vflt-icon-video">🎬</span>
                        <span id="vflt-video-name" class="vflt-filename">Nhấp để tải Video cần chỉnh màu...</span>
                    </div>
                </div>

                <div id="vflt-preview-section" style="display: none; margin-bottom: 20px;">
                    <div class="vflt-flex-between" style="margin-bottom: 10px;">
                        <label class="vflt-label" style="margin: 0;">👀 Xem Trước (Real-time):</label>
                        <button id="vflt-btn-compare" class="vflt-btn-compare">Đè chuột để xem Gốc</button>
                    </div>
                    
                    <div class="vflt-video-container">
                        <video id="vflt-player" controls preload="metadata" loop></video>
                    </div>
                </div>

                <!-- Progress Box -->
                <div id="vflt-status-box" class="vflt-status-box" style="display: none;">
                    <h4 id="vflt-status-text">Đang khởi động lõi Render...</h4>
                    <div class="vflt-progress-bar">
                        <div id="vflt-progress-fill" class="vflt-progress-fill"></div>
                    </div>
                    <p id="vflt-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
                </div>
            </div>

            <!-- CỘT PHẢI: Cài Đặt Bộ Lọc -->
            <div class="vflt-col" id="vflt-settings" style="display: none;">
                
                <div class="vflt-group">
                    <label class="vflt-label">🪄 Chọn Bộ Lọc (Presets):</label>
                    <div class="neo-select-wrapper">
                        <select id="vflt-preset-select" class="neo-select">
                            <option value="none" selected>Không dùng (Bản gốc)</option>
                            <option value="cinematic">🍿 Điện Ảnh (Cinematic - Tương phản cao)</option>
                            <option value="vivid">🌸 Rực Rỡ (Vivid - Tươi tắn)</option>
                            <option value="cyberpunk">🌃 Cyberpunk (Neon Ảo diệu)</option>
                            <option value="vintage">🕰️ Hoài Cổ (Vintage Sepia)</option>
                            <option value="bw">🖤 Đen Trắng (Grayscale)</option>
                            <option value="negative">👻 Âm Bản (Negative)</option>
                            <option value="custom" hidden>🛠️ Tùy Chỉnh (Custom)</option>
                        </select>
                    </div>
                </div>

                <div class="vflt-adjust-box">
                    
                    <div class="vflt-control-row">
                        <div class="vflt-flex-between">
                            <label class="vflt-control-label">☀️ Độ Sáng (Brightness):</label>
                            <span class="vflt-val-text"><span id="vflt-bright-text">0</span></span>
                        </div>
                        <input type="range" id="vflt-bright-slider" class="vflt-slider" min="-100" max="100" step="1" value="0">
                    </div>

                    <div class="vflt-control-row">
                        <div class="vflt-flex-between">
                            <label class="vflt-control-label">🌗 Tương Phản (Contrast):</label>
                            <span class="vflt-val-text"><span id="vflt-contrast-text">0</span></span>
                        </div>
                        <input type="range" id="vflt-contrast-slider" class="vflt-slider" min="-100" max="100" step="1" value="0">
                    </div>

                    <div class="vflt-control-row">
                        <div class="vflt-flex-between">
                            <label class="vflt-control-label">🌈 Độ Bão Hòa (Saturation):</label>
                            <span class="vflt-val-text"><span id="vflt-sat-text">0</span></span>
                        </div>
                        <input type="range" id="vflt-sat-slider" class="vflt-slider" min="-100" max="100" step="1" value="0">
                    </div>
                    
                    <div class="vflt-control-row">
                        <div class="vflt-flex-between">
                            <label class="vflt-control-label">🎨 Đổi Tone Màu (Hue Rotate):</label>
                            <span class="vflt-val-text"><span id="vflt-hue-text">0</span>°</span>
                        </div>
                        <input type="range" id="vflt-hue-slider" class="vflt-slider vflt-slider-hue" min="0" max="360" step="1" value="0">
                    </div>
                    
                    <button id="vflt-btn-reset" class="vflt-btn-reset">↺ Khôi Phục Gốc (Reset)</button>
                </div>

                <div class="vflt-group" style="margin-top: 15px;">
                    <label class="vflt-label">⚙️ Chất lượng xuất Video:</label>
                    <div class="neo-select-wrapper">
                        <select id="vflt-quality-select" class="neo-select">
                            <option value="fast" selected>⚡ Render Nhanh (Chất lượng khá, tối ưu MXH)</option>
                            <option value="high">💎 Sắc Nét (Giữ tối đa chất lượng gốc, file nặng hơn)</option>
                        </select>
                    </div>
                </div>

                <button id="vflt-btn-start" class="vflt-btn-primary">
                    🚀 Áp Dụng & Render Video
                </button>
            </div>

        </div> 
    </div>
</div>