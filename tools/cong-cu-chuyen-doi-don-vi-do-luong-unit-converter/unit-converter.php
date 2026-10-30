<link rel="stylesheet" href="unit-converter.css?v=<?php echo file_exists('unit-converter.css') ? filemtime('unit-converter.css') : '1.0'; ?>">

<div class="unitconv-container">
    <h2 class="unitconv-title">Chuyển Đổi Đơn Vị Đo Lường 📏</h2>
    <p class="unitconv-desc">Chuyển đổi tức thì giữa các đơn vị phổ biến. Hỗ trợ Chiều dài, Diện tích, Khối lượng, Thể tích và Vận tốc.</p>

    <!-- Tabs danh mục -->
    <div class="unitconv-tabs" id="unitconvTabs">
        <button class="unitconv-tab active" data-type="length">Chiều dài</button>
        <button class="unitconv-tab" data-type="area">Diện tích</button>
        <button class="unitconv-tab" data-type="mass">Khối lượng</button>
        <button class="unitconv-tab" data-type="volume">Thể tích</button>
        <button class="unitconv-tab" data-type="speed">Vận tốc</button>
    </div>

    <!-- Khu vực nhập liệu -->
    <div class="unitconv-workspace">
        <div class="unitconv-box">
            <label class="unitconv-label" for="unitconvInput1">Từ:</label>
            <div class="unitconv-input-group">
                <input type="text" id="unitconvInput1" class="unitconv-input" placeholder="0" inputmode="decimal" autocomplete="off">
                <select id="unitconvSelect1" class="unitconv-select"></select>
            </div>
        </div>

        <div class="unitconv-swap-icon" id="unitconvSwapBtn" title="Hoán đổi">⇄</div>

        <div class="unitconv-box">
            <label class="unitconv-label" for="unitconvInput2">Sang:</label>
            <div class="unitconv-input-group">
                <input type="text" id="unitconvInput2" class="unitconv-input" placeholder="0" inputmode="decimal" autocomplete="off">
                <select id="unitconvSelect2" class="unitconv-select"></select>
            </div>
        </div>
    </div>
    
    <div class="unitconv-footer">
        <div class="unitconv-formula" id="unitconvFormula">Công thức: 1 Mét = 100 Centimét</div>
        <button type="button" class="unitconv-btn-copy" id="unitconvCopyBtn">COPY KẾT QUẢ 📋</button>
    </div>

    <div id="unitconvToast">Đã copy dữ liệu!</div>
</div>

<script src="unit-converter.js?v=<?php echo file_exists('unit-converter.js') ? filemtime('unit-converter.js') : '1.0'; ?>"></script>