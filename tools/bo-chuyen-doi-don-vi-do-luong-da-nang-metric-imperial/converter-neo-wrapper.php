<div class="converter-neo-wrapper">
    <div class="converter-neo-header">
        <h2>🔄 Bộ Chuyển Đổi Đa Năng</h2>
        <p>Hỗ trợ đa đơn vị, nhập phép tính phân số (VD: 1 1/2) và các chuẩn chuyên ngành.</p>
    </div>

    <!-- Tabs Chuyên Mục -->
    <div class="converter-tabs" id="tabContainer">
        <!-- JS sẽ render Tabs vào đây -->
    </div>

    <!-- Khu Vực Nhập Liệu -->
    <div class="converter-input-area">
        <input type="text" id="inputValue" class="neo-input-text" placeholder="Nhập số (VD: 1.5) hoặc phân số (VD: 3 1/2)..." value="1">
        <select id="sourceUnit" class="neo-select-unit">
            <!-- JS sẽ render Dropdown vào đây -->
        </select>
    </div>

    <!-- Mẹo UX -->
    <div class="converter-info">
        💡 <b>Mẹo:</b> Bấm nút <b>🔄 Đảo chiều</b> trên thẻ kết quả bên dưới để đưa đơn vị đó lên làm Đơn vị gốc.
    </div>

    <!-- Khu Vực Hiển Thị Đồng Loạt (Card Grid) -->
    <div class="converter-results" id="resultsContainer">
        <!-- JS sẽ render các thẻ (Cards) vào đây -->
    </div>

    <div id="toastConverter">Đã copy!</div>
</div>