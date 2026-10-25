<div class="clock-neo-wrapper">
    <div class="clock-neo-header">
        <h2>🌍 Giờ Thế Giới & Múi Giờ</h2>
        <p>Theo dõi giờ thực tế các thành phố trên toàn cầu. Tự động cập nhật 100% bằng Javascript không cần API!</p>
    </div>

    <!-- KHU VỰC GIỜ ĐỊA PHƯƠNG (VIỆT NAM) -->
    <div class="local-clock-card">
        <div class="local-info">
            <span class="local-badge">📍 VỊ TRÍ CỦA BẠN</span>
            <h3 id="local-timezone-name">Giờ Địa Phương</h3>
            <p id="local-date-text">Đang tải ngày...</p>
        </div>
        <div class="local-time-display" id="local-time-text">00:00:00</div>
    </div>

    <!-- BẢNG ĐIỀU KHIỂN THÊM THÀNH PHỐ -->
    <div class="clock-controls">
        <div class="clock-group">
            <label for="city-select">➕ Thêm thành phố muốn theo dõi:</label>
            <div class="add-city-row">
                <select id="city-select" class="neo-select">
                    <optgroup label="Châu Á & Đông Nam Á">
                        <option value="Asia/Tokyo|🇯🇵 Tokyo (Nhật Bản)">🇯🇵 Tokyo, Nhật Bản (UTC+9)</option>
                        <option value="Asia/Seoul|🇰🇷 Seoul (Hàn Quốc)">🇰🇷 Seoul, Hàn Quốc (UTC+9)</option>
                        <option value="Asia/Bangkok|🇹🇭 Bangkok (Thái Lan)">🇹🇭 Bangkok, Thái Lan (UTC+7)</option>
                        <option value="Asia/Singapore|🇸🇬 Singapore">🇸🇬 Singapore (UTC+8)</option>
                        <option value="Asia/Shanghai|🇨🇳 Bắc Kinh (Trung Quốc)">🇨🇳 Bắc Kinh, Trung Quốc (UTC+8)</option>
                        <option value="Asia/Dubai|🇦🇪 Dubai (UAE)">🇦🇪 Dubai, UAE (UTC+4)</option>
                    </optgroup>
                    <optgroup label="Châu Âu">
                        <option value="Europe/London|🇬🇧 London (Anh)">🇬🇧 London, Anh (UTC+0/+1)</option>
                        <option value="Europe/Paris|🇫🇷 Paris (Pháp)">🇫🇷 Paris, Pháp (UTC+1/+2)</option>
                        <option value="Europe/Berlin|🇩🇪 Berlin (Đức)">🇩🇪 Berlin, Đức (UTC+1/+2)</option>
                        <option value="Europe/Moscow|🇷🇺 Moscow (Nga)">🇷🇺 Moscow, Nga (UTC+3)</option>
                    </optgroup>
                    <optgroup label="Châu Mỹ">
                        <option value="America/New_York|🇺🇸 New York (Mỹ)">🇺🇸 New York, Mỹ (UTC-5/-4)</option>
                        <option value="America/Los_Angeles|🇺🇸 Los Angeles (Mỹ)">🇺🇸 Los Angeles, Mỹ (UTC-8/-7)</option>
                        <option value="America/Toronto|🇨🇦 Toronto (Canada)">🇨🇦 Toronto, Canada (UTC-5/-4)</option>
                    </optgroup>
                    <optgroup label="Châu Úc">
                        <option value="Australia/Sydney|🇦🇺 Sydney (Úc)">🇦🇺 Sydney, Úc (UTC+10/+11)</option>
                    </optgroup>
                </select>
                <button id="add-city-btn" class="clock-neo-btn">THÊM VÀO 🚀</button>
            </div>
        </div>
    </div>

    <!-- LƯỚI DANH SÁCH GIỜ THẾ GIỚI -->
    <div class="clock-grid" id="clock-grid">
        <!-- JS sẽ đổ các Card thành phố vào đây -->
    </div>
</div>