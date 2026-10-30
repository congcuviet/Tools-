<div class="uni-soft-wrapper">
    <div class="uni-soft-header">
        <h2>🔣 Máy Dịch Unicode (Text to Unicode)</h2>
        <p>Chuyển đổi qua lại giữa Văn bản thuần (Plain Text) và Mã Unicode (\uXXXX). Hỗ trợ chuẩn xác Tiếng Việt và các biểu tượng Emoji.</p>
    </div>

    <div class="uni-body">
        
        <!-- Chuyển đổi chế độ (Tabs) -->
        <div class="uni-mode-selector">
            <label class="uni-mode-btn">
                <input type="radio" name="uni-mode" value="encode" checked>
                <div class="uni-mode-content uni-bg-yellow">
                    <span class="uni-mode-icon">🅰️➡️🔣</span>
                    <span class="uni-mode-text">CHỮ SANG UNICODE</span>
                </div>
            </label>
            <label class="uni-mode-btn">
                <input type="radio" name="uni-mode" value="decode">
                <div class="uni-mode-content uni-bg-cyan">
                    <span class="uni-mode-icon">🔣➡️🅰️</span>
                    <span class="uni-mode-text">UNICODE SANG CHỮ</span>
                </div>
            </label>
        </div>

        <div class="uni-main-layout">
            
            <!-- CỘT TRÁI: Đầu vào (Input) -->
            <div class="uni-col">
                <div class="uni-card" id="uni-card-input">
                    <div class="uni-flex-between" style="margin-bottom: 15px;">
                        <h3 class="uni-card-title" style="margin: 0; border: none; padding: 0;">📥 Đầu Vào (Input)</h3>
                        <button id="uni-btn-clear" class="uni-btn-small">🧹 Xóa trắng</button>
                    </div>
                    
                    <div class="uni-group" style="flex: 1; display: flex; flex-direction: column;">
                        <label class="uni-label" id="uni-lbl-input">Văn bản thuần (Text):</label>
                        <textarea id="uni-input-text" class="uni-textarea" placeholder="Nhập văn bản vào đây... (Ví dụ: Xin chào 🚀)" autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- Nút Hoán Đổi (Swap) -->
            <div class="uni-swap-zone">
                <button id="uni-btn-swap" class="uni-btn-swap" title="Hoán đổi Input và Output">⇌</button>
            </div>

            <!-- CỘT PHẢI: Kết quả (Output) -->
            <div class="uni-col">
                <div class="uni-card uni-bg-white">
                    <div class="uni-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="uni-card-title" style="margin: 0; border: none; padding: 0;">🚀 Kết Quả (Output)</h3>
                        <span class="uni-badge" id="uni-status-badge">Sẵn sàng</span>
                    </div>
                    
                    <div class="uni-group" style="flex: 1; display: flex; flex-direction: column;">
                        <label class="uni-label" id="uni-lbl-output">Mã Unicode (\uXXXX):</label>
                        <textarea id="uni-output-text" class="uni-textarea uni-textarea-output" readonly placeholder="Kết quả sẽ tự động hiển thị ở đây..."></textarea>
                    </div>

                    <button class="uni-btn-main" id="uni-btn-copy">
                        📋 COPY KẾT QUẢ
                    </button>
                </div>
                
                <div class="uni-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Unicode escape sequence thường có định dạng chuẩn là <code>\uXXXX</code>. Đối với các biểu tượng Emoji hoặc ký tự đặc biệt, Javascript sẽ lưu dưới dạng cặp mã Surrogate Pairs (Ví dụ: <code>\uD83D\uDE80</code> cho icon 🚀).</p>
                </div>
            </div>

        </div> 
    </div>
</div>