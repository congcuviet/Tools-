<div class="ffconv-soft-wrapper">
    <div class="ffconv-soft-header">
        <h2>🔄 Đổi Đuôi Nhạc Đa Năng</h2>
        <p>Sử dụng lõi FFmpeg siêu tốc. Hỗ trợ MP3, WAV, FLAC, OGG, M4A, AAC hoàn toàn trên trình duyệt.</p>
    </div>

    <!-- NẠP THƯ VIỆN FFMPEG TỪ HOST CỦA BẠN -->
    <script src="/wp-content/themes/bricks-child/tai-nguyen/ffmpeg.min.js"></script>

    <div class="ffconv-body">
        
        <!-- Khung Upload -->
        <div class="ffconv-group">
            <label class="ffconv-label">1. Chọn File Âm Thanh hoặc Video</label>
            <div class="ffconv-upload-box" onclick="document.getElementById('ffconv-file-input').click()">
                <input type="file" id="ffconv-file-input" hidden accept="audio/*,video/*">
                <span class="ffconv-icon">📂</span>
                <span id="ffconv-filename" class="ffconv-filename">Nhấp để chọn file...</span>
            </div>
        </div>

        <!-- Khung Chọn Định Dạng -->
        <div class="ffconv-group">
            <label class="ffconv-label">2. Chọn Đuôi Xuất Ra</label>
            <div class="neo-select-wrapper">
                <select id="ffconv-format" class="neo-select">
                    <option value="mp3">MP3 (Phổ biến, nén tốt)</option>
                    <option value="wav">WAV (Chất lượng gốc, không nén)</option>
                    <option value="flac">FLAC (Lossless cao cấp)</option>
                    <option value="ogg">OGG (Chất lượng tốt cho Web/Game)</option>
                    <option value="m4a">M4A (Chuẩn Apple, dung lượng nhẹ)</option>
                    <option value="aac">AAC (Chuẩn âm thanh chất lượng cao)</option>
                </select>
            </div>
        </div>

        <!-- Nút Xử Lý -->
        <button id="ffconv-btn" class="ffconv-btn-primary">
            🚀 Bắt Đầu Chuyển Đổi
        </button>

        <!-- Trạng thái & Thanh Progress -->
        <div id="ffconv-status-box" class="ffconv-status-box" style="display: none;">
            <h4 id="ffconv-status-text">Đang khởi động lõi Render...</h4>
            <div class="ffconv-progress-bar">
                <div id="ffconv-progress-fill" class="ffconv-progress-fill"></div>
            </div>
        </div>
        
    </div>
</div>