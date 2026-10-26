<div class="neo-trimmer-wrapper">
    <div class="neo-trimmer-header">
        <h2>✂️ Cắt Nhạc Chuyên Nghiệp</h2>
        <p>Chọn đoạn nhạc yêu thích và cắt trực tiếp trên trình duyệt.</p>
    </div>

    <!-- Tải thư viện Wavesurfer.js v7 từ CDN -->
    <script src="https://unpkg.com/wavesurfer.js@7.7.3/dist/wavesurfer.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7.7.3/dist/plugins/regions.min.js"></script>

    <div class="neo-trimmer-body">
        <div class="neo-upload-box" id="neo-upload-box">
            <input type="file" id="neo-audio-input" accept="audio/mp3, audio/wav, audio/mpeg, audio/ogg" hidden>
            <button class="neo-btn-primary" onclick="document.getElementById('neo-audio-input').click()">📂 Chọn File Âm Thanh</button>
            <span id="neo-file-name-display" class="neo-file-name">Chưa có file nào được chọn...</span>
        </div>

        <div id="neo-workspace" style="display: none;">
            <div class="neo-hint-text">👉 <strong>Kéo hai đầu vùng sáng</strong> để chọn đoạn nhạc muốn cắt.</div>
            
            <!-- MÀN HÌNH LOADING MỚI THÊM -->
            <div id="neo-audio-loading" class="neo-audio-loading" style="display: none;">
                ⏳ Đang nạp và giải mã sóng âm. Tool đang giải mã âm thanh, file nặng sẽ làm quá trình này lâu hơn. 
            </div>
            
            <div class="neo-waveform-container" id="neo-waveform"></div>
            
            <div class="neo-time-info">
                <span>Bắt đầu: <b id="neo-time-start">00:00.0</b></span>
                <span>Độ dài: <b id="neo-time-duration">00:00.0</b></span>
                <span>Kết thúc: <b id="neo-time-end">00:00.0</b></span>
            </div>

            <div class="neo-controls">
                <button id="neo-btn-play" class="neo-btn-secondary">▶️ Nghe Thử Đoạn Chọn</button>
                <button id="neo-btn-cut" class="neo-btn-action">✂️ Cắt & Tải Xuống (WAV)</button>
            </div>
        </div>
    </div>
</div>