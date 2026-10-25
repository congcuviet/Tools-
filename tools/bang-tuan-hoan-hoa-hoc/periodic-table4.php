<link rel="stylesheet" href="/wp-content/themes/bricks-child/periodic-table.css?v=<?php echo file_exists(get_stylesheet_directory() . '/periodic-table.css') ? filemtime(get_stylesheet_directory() . '/periodic-table.css') : '1.0'; ?>">

<div class="pt-neo-wrapper">
    <div class="pt-header">
        <h2>⚛️ Bảng Tuần Hoàn Các Nguyên Tố</h2>
        <p>Di chuột để xem tóm tắt. Click vào nguyên tố để tra cứu hợp chất và phương trình liên quan.</p>
    </div>

    <div class="pt-container">
        <!-- Chú thích màu sắc -->
        <div class="pt-legend">
            <span class="lg-item" style="background:#a6ff96;">Phi kim</span>
            <span class="lg-item" style="background:#c6e2ff;">Khí hiếm</span>
            <span class="lg-item" style="background:#ffb3ba;">Kim loại kiềm</span>
            <span class="lg-item" style="background:#ffdfba;">Kim loại kiềm thổ</span>
            <span class="lg-item" style="background:#ffffba;">Á kim</span>
            <span class="lg-item" style="background:#baffc9;">Kim loại yếu</span>
            <span class="lg-item" style="background:#f0c2e0;">Kim loại chuyển tiếp</span>
            <span class="lg-item" style="background:#e0bbe4;">Họ Lantan & Actini</span>
        </div>

        <!-- MÀN HÌNH LOADING -->
        <div id="ptLoader" class="pt-loader">
            <div class="pt-spinner"></div>
            <p>Đang tải dữ liệu Bảng tuần hoàn...</p>
        </div>

        <!-- KHU VỰC VẼ BẢNG TUẦN HOÀN -->
        <div id="periodicGrid" class="pt-grid hidden">
            <!-- JavaScript sẽ tự động vẽ Hàng, Cột và 118 nguyên tố vào đây -->
        </div>
    </div>

    <!-- POPUP HOVER (TOOLTIP) -->
    <div id="elTooltip" class="el-tooltip"></div>

    <!-- KHU VỰC HIỂN THỊ CHI TIẾT (RENDER KHI CLICK) -->
    <div id="elementDetailsArea" class="pt-details-area hidden">
        <!-- JS sẽ bơm HTML vào đây -->
    </div>
    
    <div id="toastPt">Đã copy!</div>
</div>

<script src="/wp-content/themes/bricks-child/periodic-table.js?v=<?php echo file_exists(get_stylesheet_directory() . '/periodic-table.js') ? filemtime(get_stylesheet_directory() . '/periodic-table.js') : '1.0'; ?>"></script>