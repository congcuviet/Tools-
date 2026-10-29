<div class="romanc-soft-wrapper">
    <div class="romanc-soft-header">
        <h2>🏛️ Chuyển Đổi Số La Mã</h2>
        <p>Công cụ dịch ngược xuôi giữa Số thường (Arabic) và Số La Mã (Roman) chuẩn xác. Hỗ trợ tiêu chuẩn từ 1 đến 3999.</p>
    </div>

    <div class="romanc-body">
        <div class="romanc-main-layout">
            
            <!-- CỘT TRÁI: Số Thường (Arabic) -->
            <div class="romanc-col">
                <div class="romanc-card romanc-bg-yellow">
                    <div class="romanc-card-header">
                        <h3 class="romanc-card-title">🔢 Số Thường (1 - 3999)</h3>
                        <button class="romanc-btn-copy" id="romanc-copy-arabic" title="Sao chép số thường">📋 Copy</button>
                    </div>
                    
                    <div class="romanc-input-wrapper">
                        <input type="number" id="romanc-input-arabic" class="romanc-big-input" placeholder="VD: 1987" min="1" max="3999">
                    </div>

                    <div id="romanc-error-arabic" class="romanc-error-msg" style="display: none;">
                        ⚠️ Số La Mã chuẩn chỉ hỗ trợ từ 1 đến 3999!
                    </div>
                </div>
            </div>

            <!-- NÚT ĐẢO CHIỀU ẢO (Trang trí trên PC) -->
            <div class="romanc-sync-icon">
                <span>⇋</span>
            </div>

            <!-- CỘT PHẢI: Số La Mã (Roman) -->
            <div class="romanc-col">
                <div class="romanc-card romanc-bg-white">
                    <div class="romanc-card-header">
                        <h3 class="romanc-card-title">🏛️ Số La Mã (Roman)</h3>
                        <button class="romanc-btn-copy" id="romanc-copy-roman" title="Sao chép số La Mã">📋 Copy</button>
                    </div>
                    
                    <div class="romanc-input-wrapper">
                        <input type="text" id="romanc-input-roman" class="romanc-big-input" placeholder="VD: MCMLXXXVII" style="text-transform: uppercase;">
                    </div>

                    <div id="romanc-error-roman" class="romanc-error-msg" style="display: none;">
                        ⚠️ Ký tự La Mã không hợp lệ (Sai cấu trúc)!
                    </div>
                </div>
            </div>

        </div> 
        
        <!-- Bảng tra cứu nhanh -->
        <div class="romanc-cheat-sheet">
            <h4>💡 Bảng Tra Cứu Nhanh</h4>
            <div class="romanc-badges-list">
                <span class="romanc-badge">I = 1</span>
                <span class="romanc-badge">V = 5</span>
                <span class="romanc-badge">X = 10</span>
                <span class="romanc-badge">L = 50</span>
                <span class="romanc-badge">C = 100</span>
                <span class="romanc-badge">D = 500</span>
                <span class="romanc-badge">M = 1000</span>
            </div>
        </div>
    </div>
</div>