<div class="rt-neo-wrapper">
    <div class="rt-header">
        <h2>⏱️ Ước Tính Thời Gian Đọc</h2>
        <p>Nhập hoặc dán đoạn văn bản của bạn vào bên dưới để hệ thống tự động phân tích số lượng từ và tính toán thời gian đọc trung bình.</p>
    </div>

    <!-- KHU VỰC NHẬP LIỆU -->
    <div class="rt-input-section">
        <label>Nội dung văn bản</label>
        <textarea id="rtInputText" class="rt-textarea" rows="8" placeholder="Nhập hoặc dán đoạn văn bản của bạn vào đây (Hệ thống sẽ tính toán ngay lập tức)..."></textarea>
    </div>

    <!-- KHU VỰC KẾT QUẢ REAL-TIME -->
    <div class="rt-result-section">
        
        <div class="rt-stat-box bg-mint">
            <span class="rt-stat-label">THỜI GIAN ĐỌC (200 WPM)</span>
            <span class="rt-stat-value text-dark" id="rtTimeDisplay">00:00</span>
        </div>
        
        <div class="rt-stat-box bg-powder">
            <span class="rt-stat-label">TỔNG SỐ TỪ</span>
            <span class="rt-stat-value" id="rtWordsDisplay">0</span>
        </div>
        
        <div class="rt-stat-box bg-mustard">
            <span class="rt-stat-label">TỔNG SỐ KÝ TỰ</span>
            <span class="rt-stat-value" id="rtCharsDisplay">0</span>
        </div>

    </div>
</div>