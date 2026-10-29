<div class="txtbin-soft-wrapper">
    <div class="txtbin-soft-header">
        <h2>0️⃣1️⃣ Máy Dịch Nhị Phân (Text to Binary)</h2>
        <p>Chuyển đổi qua lại giữa Văn bản thuần (Plain Text) và Mã nhị phân (0 và 1). Hỗ trợ chuẩn UTF-8 an toàn với Tiếng Việt và Emoji.</p>
    </div>

    <div class="txtbin-body">
        
        <!-- Chuyển đổi chế độ (Tabs) -->
        <div class="txtbin-mode-selector">
            <label class="txtbin-mode-btn">
                <input type="radio" name="txtbin-mode" value="encode" checked>
                <div class="txtbin-mode-content txtbin-bg-yellow">
                    <span class="txtbin-mode-icon">🅰️➡️🔟</span>
                    <span class="txtbin-mode-text">CHỮ SANG NHỊ PHÂN</span>
                </div>
            </label>
            <label class="txtbin-mode-btn">
                <input type="radio" name="txtbin-mode" value="decode">
                <div class="txtbin-mode-content txtbin-bg-cyan">
                    <span class="txtbin-mode-icon">🔟➡️🅰️</span>
                    <span class="txtbin-mode-text">NHỊ PHÂN SANG CHỮ</span>
                </div>
            </label>
        </div>

        <div class="txtbin-main-layout">
            
            <!-- CỘT TRÁI: Đầu vào (Input) -->
            <div class="txtbin-col">
                <div class="txtbin-card" id="txtbin-card-input">
                    <div class="txtbin-flex-between" style="margin-bottom: 15px;">
                        <h3 class="txtbin-card-title" style="margin: 0; border: none; padding: 0;">📥 Đầu Vào (Input)</h3>
                        <button id="txtbin-btn-clear" class="txtbin-btn-small">🧹 Xóa trắng</button>
                    </div>
                    
                    <div class="txtbin-group" style="flex: 1; display: flex; flex-direction: column;">
                        <label class="txtbin-label" id="txtbin-lbl-input">Văn bản thuần (Text):</label>
                        <textarea id="txtbin-input-text" class="txtbin-textarea" placeholder="Nhập chữ vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- Nút Hoán Đổi (Swap) -->
            <div class="txtbin-swap-zone">
                <button id="txtbin-btn-swap" class="txtbin-btn-swap" title="Hoán đổi Input và Output">⇌</button>
            </div>

            <!-- CỘT PHẢI: Kết quả (Output) -->
            <div class="txtbin-col">
                <div class="txtbin-card txtbin-bg-white">
                    <div class="txtbin-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="txtbin-card-title" style="margin: 0; border: none; padding: 0;">🚀 Kết Quả (Output)</h3>
                        <span class="txtbin-badge" id="txtbin-status-badge">Sẵn sàng</span>
                    </div>
                    
                    <div class="txtbin-group" style="flex: 1; display: flex; flex-direction: column;">
                        <label class="txtbin-label" id="txtbin-lbl-output">Mã nhị phân (Binary):</label>
                        <textarea id="txtbin-output-text" class="txtbin-textarea txtbin-textarea-output" readonly placeholder="Kết quả sẽ tự động nhảy vào đây..."></textarea>
                    </div>

                    <button class="txtbin-btn-main" id="txtbin-btn-copy">
                        📋 COPY KẾT QUẢ
                    </button>
                </div>
                
                <div class="txtbin-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Mỗi ký tự thông thường (ASCII) được biểu diễn bằng <b>8 bit</b> (1 byte) gồm các số 0 và 1. Các ký tự Tiếng Việt hoặc Emoji cần tới <b>16-32 bit</b> (2-4 byte) do sử dụng bảng mã UTF-8.</p>
                </div>
            </div>

        </div> 
    </div>
</div>