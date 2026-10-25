<div class="rgxc-soft-wrapper">
    <div class="rgxc-soft-header">
        <h2 id="rgxc-h1-title">🪄 Bảng Tra Cứu Regex (Regular Expressions)</h2>
        <p id="rgxc-h1-desc">Tổng hợp toàn bộ cú pháp Biểu thức chính quy trong JavaScript. Hỗ trợ tìm kiếm thời gian thực.</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ -->
    <script>
        (function(){
            // Mở rộng cấu hình SEO ở đây
        })();
    </script>

    <div class="rgxc-body">
        
        <!-- THANH TÌM KIẾM -->
        <div class="rgxc-search-wrapper">
            <input type="text" id="rgxc-search-input" class="rgxc-search-input" placeholder="🔍 Tìm kiếm cú pháp (Vd: số, chữ, khoảng trắng, lookahead...)" autofocus autocomplete="off">
            <button id="rgxc-btn-clear" class="rgxc-btn-clear">🧹 Xóa</button>
        </div>

        <!-- KHUNG CHỨA CHEATSHEET (Sẽ được Render bằng JS) -->
        <div id="rgxc-container" class="rgxc-grid-layout">
            <div style="text-align: center; padding: 40px; font-weight: bold; font-size: 1.2rem;">
                ⏳ Đang tải dữ liệu Regex...
            </div>
        </div>
        
        <!-- Thông báo khi tìm kiếm không có kết quả -->
        <div id="rgxc-no-result" class="rgxc-no-result" style="display: none;">
            ⚠️ Không tìm thấy cú pháp Regex nào phù hợp với từ khóa của bạn.
        </div>

    </div>

    <div class="rgxc-info-box">
        <h4>💡 IT Note (Các thành phần đã được nâng cấp so với bản gốc):</h4>
        <p>Mình đã bổ sung thêm <b>Flags (Cờ)</b>, <b>Lazy Match (Khớp lười biếng)</b> và <b>Named Groups (Nhóm định danh)</b> - những kiến thức rất quan trọng trong JS ES6+ mà nhiều bảng Cheatsheet cũ thường bỏ sót.</p>
    </div>
</div>