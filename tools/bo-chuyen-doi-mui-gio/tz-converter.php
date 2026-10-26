<div class="tzc-neo-wrapper">
    <div class="tzc-neo-header">
        <h2>🌍 Bộ Chuyển Đổi Múi Giờ</h2>
        <p>Lên lịch họp quốc tế hay canh me giờ ra mắt game chưa bao giờ dễ dàng đến thế! Chuyển đổi chính xác thời gian giữa các quốc gia.</p>
    </div>

    <form id="tzc-form" class="tzc-neo-form">
        <!-- Thời gian gốc -->
        <div class="tzc-group">
            <label for="tzc-input-time">⏰ Thời gian muốn chuyển đổi (Ngày & Giờ)</label>
            <div class="input-time-box">
                <input type="datetime-local" id="tzc-input-time" class="neo-input" required>
                <button type="button" id="btn-set-now" class="tzc-btn-small">Hiện tại</button>
            </div>
        </div>

        <!-- Khung chọn Múi giờ -->
        <div class="tzc-zones-grid">
            <div class="tzc-group tz-box tz-source-box">
                <label>📍 Chuyển từ (Nơi gửi)</label>
                <select id="tzc-source" class="neo-select"></select>
            </div>
            
            <div class="tzc-swap-box">
                <button type="button" id="tzc-btn-swap" class="tzc-swap-btn" title="Hoán đổi múi giờ">🔄</button>
            </div>

            <div class="tzc-group tz-box tz-target-box">
                <label>🎯 Chuyển đến (Nơi nhận)</label>
                <select id="tzc-target" class="neo-select"></select>
            </div>
        </div>

        <button type="submit" class="tzc-neo-btn">CHUYỂN ĐỔI NGAY 🚀</button>
    </form>

    <!-- KẾT QUẢ -->
    <div id="tzc-result" class="tzc-neo-result" style="display: none;">
        <h3 class="result-title">🎉 KẾT QUẢ CHUYỂN ĐỔI</h3>
        
        <div class="result-cards">
            <!-- Nơi gửi -->
            <div class="res-card res-source">
                <div class="res-label">Thời gian gốc</div>
                <div class="res-time" id="res-time-source">00:00</div>
                <div class="res-date" id="res-date-source">Thứ..., DD/MM/YYYY</div>
                <div class="res-zone" id="res-zone-source">Khu vực</div>
            </div>
            
            <div class="res-arrow">➡️</div>
            
            <!-- Nơi nhận -->
            <div class="res-card res-target">
                <div class="res-label">Thời gian đích</div>
                <div class="res-time" id="res-time-target">00:00</div>
                <div class="res-date" id="res-date-target">Thứ..., DD/MM/YYYY</div>
                <div class="res-zone" id="res-zone-target">Khu vực</div>
            </div>
        </div>

        <div class="diff-box">
            <span id="res-diff-text">Chênh lệch: ... giờ</span>
        </div>
    </div>
</div>