<div class="vtxt-soft-wrapper">
    <div class="vtxt-soft-header">
        <h2>✍️ Chèn Chữ Vào Video (Timeline Pro)</h2>
        <p>Thêm nhiều dòng văn bản xuất hiện theo thời gian. Hoàn hảo để làm phụ đề, chú thích hoặc đánh dấu bản quyền.</p>
    </div>

    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="vtxt-body">
        <div class="vtxt-main-layout">
            
            <!-- CỘT TRÁI: Video & Workspace Kéo Thả -->
            <div class="vtxt-col">
                <div class="vtxt-group" id="vtxt-upload-group">
                    <div class="vtxt-upload-box" id="vtxt-box-video" onclick="document.getElementById('vtxt-video-input').click()">
                        <input type="file" id="vtxt-video-input" hidden accept="video/*">
                        <span class="vtxt-icon" id="vtxt-icon-video">🎬</span>
                        <span id="vtxt-video-name" class="vtxt-filename">Nhấp để tải Video lên...</span>
                    </div>
                </div>

                <div id="vtxt-workspace" style="display: none; margin-bottom: 20px;">
                    <label class="vtxt-label">👀 Màn hình làm việc (Kéo thả chữ trực tiếp):</label>
                    <div id="vtxt-video-container" class="vtxt-video-container">
                        <video id="vtxt-player" controls preload="metadata"></video>
                        <!-- Các ảnh Chữ (PNG) sẽ được JS chèn vào đây để kéo thả -->
                        <div id="vtxt-selectors-wrapper"></div>
                    </div>
                    <p class="vtxt-hint-text">💡 <b>Cơ chế:</b> Chữ chỉ hiện lên trên video khi thanh thời gian nằm trong khoảng "Từ giây A đến giây B" mà bạn đã cài đặt.</p>
                </div>

                <div id="vtxt-status-box" class="vtxt-status-box" style="display: none;">
                    <h4 id="vtxt-status-text">Đang khởi động lõi Render...</h4>
                    <div class="vtxt-progress-bar">
                        <div id="vtxt-progress-fill" class="vtxt-progress-fill"></div>
                    </div>
                    <p id="vtxt-detail-text" style="margin-top:10px; font-weight:700; font-size:0.9rem;"></p>
                </div>
            </div>

            <!-- CỘT PHẢI: Quản lý Timeline Tác Vụ -->
            <div class="vtxt-col" id="vtxt-settings" style="display: none;">
                
                <div class="vtxt-group">
                    <div class="vtxt-flex-between">
                        <label class="vtxt-label" style="margin:0;">📝 Danh sách Văn bản:</label>
                        <button id="vtxt-btn-add" class="vtxt-btn-add">➕ Thêm chữ mới</button>
                    </div>
                </div>

                <!-- Nơi chứa các Card Cài đặt Chữ -->
                <div id="vtxt-tasks-list" class="vtxt-tasks-list"></div>

                <div class="vtxt-group" style="margin-top: 20px;">
                    <label class="vtxt-label">⚙️ Chất lượng xuất Video:</label>
                    <div class="neo-select-wrapper">
                        <select id="vtxt-quality-select" class="neo-select">
                            <option value="fast" selected>⚡ Render Nhanh (Chất lượng khá, tối ưu MXH)</option>
                            <option value="high">💎 Sắc Nét (Giữ tối đa chất lượng gốc, file nặng hơn)</option>
                        </select>
                    </div>
                </div>

                <button id="vtxt-btn-start" class="vtxt-btn-primary">
                    🚀 Render & Tải Xuống
                </button>
            </div>

        </div> 
    </div>
</div>