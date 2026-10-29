<div class="tomlc-soft-wrapper">
    <!-- Nạp JS-YAML qua thẻ script thông thường -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>

    <!-- Header tự động thay đổi bằng JS -->
    <div class="tomlc-soft-header">
        <h2 id="tomlc-h1-title">🔄 Chuyển đổi JSON sang TOML</h2>
        <p id="tomlc-h1-desc">Chuyển đổi cú pháp giữa JSON, YAML và TOML trực tuyến. Hỗ trợ bắt lỗi cú pháp (Linting) theo thời gian thực.</p>
    </div>

    <div class="tomlc-body">
        
        <!-- THANH ĐIỀU HƯỚNG / CHUYỂN ĐỔI CHẾ ĐỘ -->
        <div class="tomlc-toolbar">
            <button id="tomlc-btn-swap" class="tomlc-btn-swap" title="Đảo ngược định dạng (Hoán đổi 2 bên)">
                ⇌ ĐẢO CHIỀU (SWAP)
            </button>
            <button id="tomlc-btn-clear" class="tomlc-btn-clear">🧹 Xóa trắng</button>
        </div>

        <div class="tomlc-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="tomlc-col">
                <div class="tomlc-card tomlc-bg-yellow">
                    <div class="tomlc-flex-between" style="margin-bottom: 15px;">
                        <select id="tomlc-select-left" class="tomlc-select" disabled>
                            <option value="json" selected>JSON</option>
                            <option value="yaml">YAML</option>
                            <option value="toml">TOML</option>
                        </select>
                        <span class="tomlc-badge" id="tomlc-badge-left">Sẵn sàng</span>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="tomlc-input-left" class="tomlc-textarea" placeholder="Dán dữ liệu cấu hình vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI (OUTPUT) -->
            <div class="tomlc-col">
                <div class="tomlc-card tomlc-bg-white">
                    <div class="tomlc-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <select id="tomlc-select-right" class="tomlc-select" disabled>
                            <option value="json">JSON</option>
                            <option value="yaml">YAML</option>
                            <option value="toml" selected>TOML</option>
                        </select>
                        <button class="tomlc-btn-copy" id="tomlc-btn-copy">📋 COPY KẾT QUẢ</button>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung báo lỗi overlay -->
                        <div class="tomlc-error-overlay" id="tomlc-error-box" style="display: none;">
                            <strong>⚠️ Lỗi Cú Pháp (Syntax Error):</strong>
                            <div id="tomlc-error-msg"></div>
                        </div>

                        <textarea id="tomlc-input-right" class="tomlc-textarea tomlc-textarea-output" readonly placeholder="Kết quả sẽ tự động hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>

        </div> 
    </div>
    
    <div class="tomlc-info-box">
        <h4>💡 IT Note:</h4>
        <p>Thuật toán xử lý 100% Offline trên trình duyệt (Client-side) kết hợp module <code>smol-toml</code>. Đảm bảo cấu hình, API keys, hoặc Secrets của bạn tuyệt đối không bị rò rỉ.</p>
    </div>
</div>