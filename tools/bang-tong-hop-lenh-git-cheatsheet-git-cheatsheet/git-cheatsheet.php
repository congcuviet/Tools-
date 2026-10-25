<div class="gitc-soft-wrapper">
    <div class="gitc-soft-header">
        <h2 id="gitc-h1-title">🐙 Bảng Tra Cứu Lệnh Git (Cheatsheet)</h2>
        <p id="gitc-h1-desc">Tổng hợp các câu lệnh Git thần thánh nhất. Hỗ trợ tìm kiếm thời gian thực và copy nhanh.</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ -->
    <script>
        (function(){
            // Khu vực mở rộng cấu hình SEO
        })();
    </script>

    <div class="gitc-body">
        
        <!-- THANH TÌM KIẾM -->
        <div class="gitc-search-wrapper">
            <input type="text" id="gitc-search-input" class="gitc-search-input" placeholder="🔍 Tìm kiếm lệnh (Vd: commit, branch, stash...)" autofocus autocomplete="off">
            <button id="gitc-btn-clear" class="gitc-btn-clear">🧹 Xóa</button>
        </div>

        <!-- KHUNG CHỨA CHEATSHEET (Sẽ được Render bằng JS) -->
        <div id="gitc-container" class="gitc-grid-layout">
            <!-- Loading State -->
            <div style="text-align: center; padding: 40px; font-weight: bold; font-size: 1.2rem;">
                ⏳ Đang tải dữ liệu Git...
            </div>
        </div>
        
        <!-- Thông báo khi tìm kiếm không có kết quả -->
        <div id="gitc-no-result" class="gitc-no-result" style="display: none;">
            ⚠️ Không tìm thấy câu lệnh nào phù hợp với từ khóa của bạn.
        </div>

    </div>

    <div class="gitc-info-box">
        <h4>💡 Mẹo sử dụng:</h4>
        <p>Bạn không cần gõ chính xác câu lệnh. Hệ thống hỗ trợ tìm kiếm bằng cả tiếng Việt không dấu (ví dụ: gõ "xoa nhanh" để tìm lệnh xóa branch) hoặc tìm trực tiếp theo cờ (ví dụ: gõ "-am").</p>
    </div>
</div>