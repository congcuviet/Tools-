<div class="emnorm-soft-wrapper">
    <div class="emnorm-soft-header">
        <h2>📧 Trình Chuẩn Hóa Data Email</h2>
        <p>Bóc tách, làm sạch, chuẩn hóa và lọc trùng lặp hàng loạt địa chỉ Email từ văn bản lộn xộn. Xử lý 100% Offline cực nhanh.</p>
    </div>

    <div class="emnorm-body">
        <div class="emnorm-main-layout">
            
            <!-- CỘT TRÁI: Đầu vào & Tùy chọn -->
            <div class="emnorm-col">
                <div class="emnorm-card emnorm-bg-yellow">
                    <div class="emnorm-flex-between" style="margin-bottom: 15px;">
                        <h3 class="emnorm-card-title" style="margin: 0; border: none; padding: 0;">📥 Văn bản gốc (Raw Data)</h3>
                        <button id="emnorm-btn-clear" class="emnorm-btn-small">🧹 Xóa</button>
                    </div>
                    
                    <div class="emnorm-group">
                        <textarea id="emnorm-input-text" class="emnorm-textarea" placeholder="Dán đoạn văn bản, danh sách chứa các email lộn xộn vào đây..." autofocus></textarea>
                    </div>

                    <div class="emnorm-divider"></div>

                    <h3 class="emnorm-card-title" style="font-size: 1rem; border: none; margin-bottom: 10px;">⚙️ Bộ lọc (Filters):</h3>
                    
                    <div class="emnorm-options-box">
                        <label class="emnorm-check-row">
                            <input type="checkbox" id="emnorm-opt-lower" class="emnorm-checkbox" checked>
                            <span class="emnorm-check-ui"></span>
                            Chuyển thành chữ thường (Lowercase)
                        </label>
                        <label class="emnorm-check-row">
                            <input type="checkbox" id="emnorm-opt-dupes" class="emnorm-checkbox" checked>
                            <span class="emnorm-check-ui"></span>
                            Xóa Email trùng lặp (Deduplicate)
                        </label>
                        <label class="emnorm-check-row" title="Ví dụ: user+ads@gmail.com -> user@gmail.com">
                            <input type="checkbox" id="emnorm-opt-tags" class="emnorm-checkbox" checked>
                            <span class="emnorm-check-ui"></span>
                            Xóa thẻ Alias (+tag)
                        </label>
                        <label class="emnorm-check-row" title="Ví dụ: n.g.u.y.e.n@gmail.com -> nguyen@gmail.com">
                            <input type="checkbox" id="emnorm-opt-dots" class="emnorm-checkbox" checked>
                            <span class="emnorm-check-ui"></span>
                            Xóa dấu chấm (.) trong local-part Gmail
                        </label>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả -->
            <div class="emnorm-col">
                <div class="emnorm-card emnorm-bg-white">
                    <div class="emnorm-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="emnorm-card-title" style="margin: 0; border: none; padding: 0;">🚀 Danh Sách Email Sạch</h3>
                        <span class="emnorm-badge" id="emnorm-badge-status">Sẵn sàng</span>
                    </div>
                    
                    <!-- Thống kê -->
                    <div class="emnorm-stats-row">
                        <div class="emnorm-stat-box emnorm-stat-valid">
                            <span class="emnorm-stat-num" id="emnorm-count-valid">0</span>
                            <span class="emnorm-stat-lbl">Hợp lệ</span>
                        </div>
                        <div class="emnorm-stat-box emnorm-stat-dupes">
                            <span class="emnorm-stat-num" id="emnorm-count-dupes">0</span>
                            <span class="emnorm-stat-lbl">Trùng lặp</span>
                        </div>
                        <div class="emnorm-stat-box emnorm-stat-invalid">
                            <span class="emnorm-stat-num" id="emnorm-count-invalid">0</span>
                            <span class="emnorm-stat-lbl">Lỗi (Rác)</span>
                        </div>
                    </div>

                    <div class="emnorm-group" style="flex: 1; display: flex; flex-direction: column;">
                        <textarea id="emnorm-output-text" class="emnorm-textarea emnorm-textarea-output" readonly placeholder="Danh sách email chuẩn hóa sẽ hiển thị ở đây (Mỗi email 1 dòng)..."></textarea>
                    </div>

                    <div class="emnorm-action-row">
                        <button class="emnorm-btn-main" id="emnorm-btn-copy">
                            📋 COPY DANH SÁCH
                        </button>
                        <button class="emnorm-btn-secondary" id="emnorm-btn-dl" title="Tải file .txt">
                            💾 TẢI .TXT
                        </button>
                    </div>
                </div>
                
                <div class="emnorm-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Gmail bỏ qua dấu chấm <code>.</code> và các chuỗi đứng sau dấu cộng <code>+</code> trong tên người dùng. Việc dọn dẹp các ký tự này giúp bạn nhận diện chính xác 1 khách hàng dù họ cố tình dùng nhiều biến thể email khác nhau để đăng ký.</p>
                </div>
            </div>

        </div> 
    </div>
</div>