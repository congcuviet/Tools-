<div class="txqr-wrapper">
    <script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>

    <div class="txqr-header">
        <h2>CÔNG CỤ VIỆT - Chuyển File Bằng QR</h2>
        <p>Truyền dữ liệu ngoại tuyến tốc độ cao (Fountain Codes).</p>
    </div>

    <div class="txqr-body">
        
        <div class="txqr-controls">
            <button id="txqr-btn-sender" class="txqr-btn active">📡 TRUYỀN FILE</button>
            <button id="txqr-btn-receiver" class="txqr-btn">👁️ QUÉT FILE</button>
        </div>

        <div class="txqr-main-layout">
            
            <div class="txqr-workspace">
                
                <!-- GIAO DIỆN TRUYỀN FILE -->
                <div id="txqr-sender-view" class="txqr-view active">
                    <div class="txqr-overclock-panel">
                        <div class="txqr-slider-group">
                            <label>Tốc độ truyền (FPS): <span id="lbl-fps" class="txqr-text-primary">40</span></label>
                            <input type="range" id="txqr-set-fps" min="10" max="60" value="40">
                        </div>
                        <div class="txqr-slider-group">
                            <label>Dung lượng/Khối: <span id="lbl-chunk" class="txqr-text-primary">150</span> B</label>
                            <input type="range" id="txqr-set-chunk" min="50" max="500" step="10" value="150">
                        </div>
                        <p class="txqr-hint-text">💡 Thông số mặc định (40 FPS / 150B) là mức tối ưu cho hầu hết camera hiện nay.</p>
                    </div>

                    <div class="txqr-upload-box" onclick="document.getElementById('txqr-file-input').click()">
                        <input type="file" id="txqr-file-input" hidden>
                        <span style="font-size: 2.2rem; margin-bottom: 5px;">📄</span>
                        <span id="txqr-filename">Nhấp chọn File cần truyền...</span>
                    </div>
                    
                    <div class="txqr-qr-container">
                        <canvas id="txqr-canvas-sender" width="400" height="400" style="width: 100%; max-width: 350px;"></canvas>
                        <div id="txqr-sender-status" class="txqr-overlay-status">CHỜ FILE...</div>
                    </div>
                </div>

                <!-- GIAO DIỆN QUÉT FILE -->
                <div id="txqr-receiver-view" class="txqr-view">
                    <button id="txqr-btn-start-cam" class="txqr-btn-action">📸 MỞ CAMERA ĐỂ QUÉT FILE</button>
                    <div id="txqr-engine-status" class="txqr-engine-status"></div>
                    
                    <div class="txqr-video-container">
                        <video id="txqr-video" playsinline hidden></video>
                        <canvas id="txqr-canvas-receiver" hidden></canvas>
                        <div id="txqr-scanner-frame" class="txqr-scanner-frame" hidden></div>
                    </div>
                </div>

            </div>

            <!-- BẢNG THÔNG SỐ -->
            <div class="txqr-stats-panel">
                <div class="txqr-stat-grid">
                    <div class="txqr-stat-item"><div class="txqr-stat-label">CHỤP (FPS)</div><div class="txqr-stat-val" id="stat-cap-fps">0.0</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">GIẢI MÃ (FPS)</div><div class="txqr-stat-val val-primary" id="stat-dec-fps">0.0</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">BỎ QUA (DROPPED)</div><div class="txqr-stat-val" id="stat-dropped">0</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">VÔ ÍCH (USELESS)</div><div class="txqr-stat-val" id="stat-useless">0</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">TỐC ĐỘ (GOODPUT)</div><div class="txqr-stat-val val-primary" id="stat-goodput">0.0 KB/s</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">THỜI GIAN</div><div class="txqr-stat-val" id="stat-elapsed">0 s</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">ĐÃ BÓC TÁCH</div><div class="txqr-stat-val" id="stat-decoded">0 / 0</div></div>
                    <div class="txqr-stat-item"><div class="txqr-stat-label">ĐANG CHỜ GIẢI MÃ</div><div class="txqr-stat-val" id="stat-pending">0</div></div>
                </div>
                
                <div id="txqr-progress-bar" class="txqr-progress-bar">
                    <div id="txqr-progress-fill" class="txqr-progress-fill"></div>
                </div>
                
                <div style="display:flex; justify-content: space-between; margin-top: 15px;">
                    <div class="txqr-stat-item"><div class="txqr-stat-label">TRẠNG THÁI</div><div class="txqr-stat-val" id="stat-session" style="font-size: 1rem;">-</div></div>
                    <div class="txqr-stat-item" style="text-align: right;"><div class="txqr-stat-label">CAMERA</div><div class="txqr-stat-val" id="stat-lock" style="font-size: 1rem;">-</div></div>
                </div>
            </div>

        </div> 
    </div>
</div>