<div class="vblur-soft-wrapper">
    <div class="vblur-soft-header">
        <h2>🌫️ Che Mờ Video Đa Điểm (Timeline Pro)</h2>
        <p>Thêm nhiều vùng che mờ ở các thời điểm khác nhau. Hoàn hảo để che logo xuất hiện ngắt quãng, che khuôn mặt hoặc biển số xe.</p>
    </div>

    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vblur-body">
        <div class="vblur-main-layout">
            
            <!-- CỘT TRÁI: Video & Workspace -->
            <div class="vblur-col">
                <div class="vblur-group" id="vblur-upload-group">
                    <div class="vblur-upload-box" id="vblur-box-video" onclick="document.getElementById('vblur-video-input').click()">
                        <input type="file" id="vblur-video-input" hidden accept="video/*">
                        <span class="vblur-icon" id="vblur-icon-video">📥</span>
                        <span id="vblur-video-name" class="vblur-filename">Nhấp để tải Video cần xử lý...</span>
                    </div>
                </div>

                <div id="vblur-workspace" style="display: none; margin-bottom: 20px;">
                    <label class="vblur-label">👀 Màn hình làm việc (Kéo thả khung đỏ):</label>
                    <div id="vblur-video-container" class="vblur-video-container">
                        <video id="vblur-player" muted loop controls preload="metadata"></video>
                        <!-- Các khung chọn (Selector) sẽ được JS sinh ra tại đây -->
                        <div id="vblur-selectors-wrapper"></div>
                    </div>
                    <p class="vblur-hint-text">💡 <b>Cơ chế:</b> Khung đỏ chỉ hiện lên trên video khi thanh thời gian nằm trong khoảng giây bạn đã cài đặt bên phải.</p>
                </div>

                <div id="vblur-status-box" class="vblur-status-box" style="display: none;">
                    <h4 id="vblur-status-text">Đang khởi động lõi Render...</h4>
                    <div class="vblur-progress-bar">
                        <div id="vblur-progress-fill" class="vblur-progress-fill"></div>
                    </div>
                    <p id="vblur-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
                </div>
            </div>

            <!-- CỘT PHẢI: Quản lý Timeline Tác Vụ -->
            <div class="vblur-col" id="vblur-settings" style="display: none;">
                
                <div class="vblur-group">
                    <div class="vblur-flex-between">
                        <label class="vblur-label" style="margin:0;">⏱️ Danh sách Vùng che:</label>
                        <button id="vblur-btn-add" class="vblur-btn-add">➕ Thêm vùng mới</button>
                    </div>
                </div>

                <!-- Nơi chứa các Card Tác vụ -->
                <div id="vblur-tasks-list" class="vblur-tasks-list"></div>

                <div class="vblur-group" style="margin-top: 20px;">
                    <label class="vblur-label">⚙️ Chất lượng xuất Video:</label>
                    <div class="neo-select-wrapper">
                        <select id="vblur-quality-select" class="neo-select">
                            <option value="fast" selected>⚡ Render Nhanh (Chất lượng khá, tối ưu MXH)</option>
                            <option value="high">💎 Sắc Nét (Giữ tối đa chất lượng gốc)</option>
                        </select>
                    </div>
                </div>

                <button id="vblur-btn-start" class="vblur-btn-primary">
                    🚀 Render & Tải Xuống
                </button>
            </div>

        </div> 
    </div>
</div>