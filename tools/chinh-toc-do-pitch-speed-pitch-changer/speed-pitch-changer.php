<div class="sp-soft-wrapper">
    <div class="sp-soft-header">
        <h2>⏱️ Tốc Độ & Cao Độ</h2>
        <p>Tạo hiệu ứng Nightcore (Nhanh, Cao) hoặc Slowed (Chậm, Trầm) cực dễ dàng.</p>
    </div>

    <!-- Khu vực Tải file -->
    <div class="sp-input-section" id="sp-upload-box">
        <input type="file" id="sp-file-input" accept="audio/*" hidden>
        <button class="sp-btn-upload" onclick="document.getElementById('sp-file-input').click()">
            📂 Chọn File Âm Thanh
        </button>
        <div id="sp-filename" class="sp-filename-display">Chưa có file nào được chọn...</div>
    </div>

    <!-- Khu vực Điều khiển (Ẩn cho đến khi có file) -->
    <div class="sp-controls-box" id="sp-workspace" style="display: none;">
        
        <!-- Thanh kéo Tốc độ / Pitch -->
        <div class="control-group">
            <div class="label-row">
                <span>Tốc độ & Pitch</span>
                <span id="sp-value-display">1.0x</span>
            </div>
            <input type="range" id="sp-slider" class="neo-slider" min="0.5" max="2.0" step="0.05" value="1.0">
            <div id="sp-effect-hint" class="sp-hint-box">👉 Chế độ: Bình thường</div>
        </div>

        <!-- Thanh nút bấm -->
        <div class="sp-action-bar">
            <button id="sp-btn-play" class="neo-btn-action">
                ▶️ Nghe Thử
            </button>
            <button id="sp-btn-download" class="neo-btn-primary">
                🚀 Xuất Audio (WAV)
            </button>
        </div>

        <!-- Trạng thái & Sóng âm -->
        <div class="sp-status-bar">
            <div class="sound-wave" id="sp-wave">
                <span></span><span></span><span></span><span></span><span></span>
            </div>
            <span id="sp-status-text">Sẵn sàng biến đổi...</span>
        </div>
        
    </div>
    
    <!-- Audio ẩn dùng để nghe thử -->
    <audio id="sp-audio-element" crossorigin="anonymous"></audio>
</div>