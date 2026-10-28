<div class="omni-soft-wrapper">
    <!-- Nạp thư viện js-yaml siêu nhẹ qua CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>

    <!-- Header tự động thay đổi bằng JS hoặc PHP -->
    <div class="omni-soft-header">
        <h2 id="omni-h1-title">🔄 Chuyển đổi JSON sang YAML</h2>
        <p id="omni-h1-desc">Chuyển đổi cú pháp JSON sang định dạng YAML trực tuyến, hỗ trợ kiểm tra lỗi cú pháp (Linting) theo thời gian thực.</p>
    </div>

    <div class="omni-body">
        
        <!-- THANH ĐIỀU HƯỚNG / CHUYỂN ĐỔI CHẾ ĐỘ -->
        <div class="omni-toolbar">
            <button id="omni-btn-swap" class="omni-btn-swap" title="Đảo ngược định dạng (Hoán đổi 2 bên)">
                ⇌ ĐẢO CHIỀU (SWAP)
            </button>
            <button id="omni-btn-clear" class="omni-btn-clear">🧹 Xóa trắng</button>
        </div>

        <div class="omni-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="omni-col">
                <div class="omni-card omni-bg-yellow">
                    <div class="omni-flex-between" style="margin-bottom: 15px;">
                        <select id="omni-select-left" class="omni-select" disabled>
                            <option value="json" selected>JSON</option>
                            <option value="yaml">YAML</option>
                        </select>
                        <span class="omni-badge" id="omni-badge-left">Sẵn sàng</span>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="omni-input-left" class="omni-textarea" placeholder="Dán dữ liệu vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI (OUTPUT) -->
            <div class="omni-col">
                <div class="omni-card omni-bg-white">
                    <div class="omni-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <select id="omni-select-right" class="omni-select" disabled>
                            <option value="yaml" selected>YAML</option>
                            <option value="json">JSON</option>
                        </select>
                        <button class="omni-btn-copy" id="omni-btn-copy">📋 COPY KẾT QUẢ</button>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung báo lỗi sẽ hiện lên đè vào textarea nếu code sai cú pháp -->
                        <div class="omni-error-overlay" id="omni-error-box" style="display: none;">
                            <strong>⚠️ Lỗi Cú Pháp (Syntax Error):</strong>
                            <div id="omni-error-msg"></div>
                        </div>

                        <textarea id="omni-input-right" class="omni-textarea omni-textarea-output" readonly placeholder="Kết quả sẽ tự động hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>

        </div> 
    </div>
    
    <!-- Khung chú thích chung -->
    <div class="omni-info-box">
        <h4>💡 IT Note:</h4>
        <p>Thuật toán xử lý 100% bằng JavaScript ngay trên trình duyệt (Client-side). Dữ liệu cấu hình, API keys hoặc Secrets của bạn tuyệt đối an toàn và không bao giờ bị rò rỉ ra ngoài Internet.</p>
    </div>
</div>