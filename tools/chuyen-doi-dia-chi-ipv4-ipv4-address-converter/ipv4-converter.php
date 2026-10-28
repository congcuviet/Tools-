<div class="ip4v-soft-wrapper">
    <div class="ip4v-soft-header">
        <h2 id="ip4v-h1-title">🔄 Trình Chuyển Đổi Địa Chỉ IPv4</h2>
        <p id="ip4v-h1-desc">Chuyển đổi địa chỉ IPv4 sang định dạng Thập phân (Decimal), Thập lục phân (Hex), Nhị phân (Binary) và IPv6.</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ -->
    <script>
        (function(){
            // Bạn có thể mở rộng xử lý Title/SEO ở đây nếu nhúng vào nhiều URL khác nhau
        })();
    </script>

    <div class="ip4v-body">
        
        <!-- BỐ CỤC 2 CỘT -->
        <div class="ip4v-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="ip4v-col ip4v-col-left">
                
                <div class="ip4v-card ip4v-bg-yellow">
                    <div class="ip4v-flex-between" style="margin-bottom: 10px;">
                        <span class="ip4v-section-title">📥 Nhập địa chỉ IPv4</span>
                        <button id="ip4v-btn-clear" class="ip4v-btn-small">🧹 Xóa</button>
                    </div>
                    
                    <div class="ip4v-input-wrapper">
                        <input type="text" id="ip4v-input-ip" class="ip4v-input-huge" placeholder="Ví dụ: 192.168.1.1" autofocus autocomplete="off">
                        <button id="ip4v-btn-myip" class="ip4v-btn-myip" title="Lấy Public IP của bạn">📍 IP CỦA TÔI</button>
                    </div>

                    <div class="ip4v-quick-fills">
                        <span style="font-size: 0.85rem; font-weight: 900; color: #555;">⚡ Mẫu nhanh:</span>
                        <button class="ip4v-btn-chip" data-ip="8.8.8.8">8.8.8.8 (Google DNS)</button>
                        <button class="ip4v-btn-chip" data-ip="1.1.1.1">1.1.1.1 (Cloudflare)</button>
                        <button class="ip4v-btn-chip" data-ip="127.0.0.1">127.0.0.1 (Localhost)</button>
                    </div>
                    
                    <!-- Khung báo trạng thái (Lỗi/Hợp lệ) -->
                    <div id="ip4v-status-box" class="ip4v-status-box">Chờ nhập liệu...</div>
                </div>

                <div class="ip4v-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Hệ thống tự động sử dụng toán tử dịch bit (Bitwise Shift) để tính toán ra kết quả chuẩn xác 100% ngay trên trình duyệt của bạn (Client-side), đảm bảo tốc độ phản hồi tính bằng mili-giây.</p>
                </div>

            </div>

            <!-- CỘT PHẢI (OUTPUT LIST) -->
            <div class="ip4v-col ip4v-col-right">
                <div class="ip4v-card ip4v-bg-white" id="ip4v-output-card" style="opacity: 0.5; pointer-events: none;">
                    <div class="ip4v-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 20px;">
                        <span class="ip4v-section-title">🚀 Kết quả Chuyển đổi</span>
                    </div>
                    
                    <!-- Nhóm Output: Decimal -->
                    <div class="ip4v-result-group">
                        <label>Decimal (Cơ số 10):</label>
                        <div class="ip4v-input-group">
                            <input type="text" id="ip4v-out-decimal" class="ip4v-input-item" readonly>
                            <button class="ip4v-btn-copy-item" data-target="ip4v-out-decimal">📋 COPY</button>
                        </div>
                    </div>

                    <!-- Nhóm Output: Hexadecimal -->
                    <div class="ip4v-result-group">
                        <label>Hexadecimal (Cơ số 16):</label>
                        <div class="ip4v-input-group">
                            <input type="text" id="ip4v-out-hex" class="ip4v-input-item" readonly>
                            <button class="ip4v-btn-copy-item" data-target="ip4v-out-hex">📋 COPY</button>
                        </div>
                    </div>

                    <!-- Nhóm Output: Binary -->
                    <div class="ip4v-result-group">
                        <label>Binary (Nhị phân):</label>
                        <div class="ip4v-input-group">
                            <input type="text" id="ip4v-out-binary" class="ip4v-input-item" readonly>
                            <button class="ip4v-btn-copy-item" data-target="ip4v-out-binary">📋 COPY</button>
                        </div>
                    </div>

                    <!-- Nhóm Output: IPv6 Mapped -->
                    <div class="ip4v-result-group">
                        <label>IPv6 (Ánh xạ IPv4):</label>
                        <div class="ip4v-input-group">
                            <input type="text" id="ip4v-out-ipv6" class="ip4v-input-item" readonly>
                            <button class="ip4v-btn-copy-item" data-target="ip4v-out-ipv6">📋 COPY</button>
                        </div>
                    </div>

                    <!-- Nhóm Output: IPv6 Short -->
                    <div class="ip4v-result-group">
                        <label>IPv6 (Rút gọn / Short):</label>
                        <div class="ip4v-input-group">
                            <input type="text" id="ip4v-out-ipv6-short" class="ip4v-input-item" style="color: var(--clr-cyan); background: #111;" readonly>
                            <button class="ip4v-btn-copy-item" data-target="ip4v-out-ipv6-short">📋 COPY</button>
                        </div>
                    </div>

                </div>
            </div>

        </div> 
    </div>
</div>