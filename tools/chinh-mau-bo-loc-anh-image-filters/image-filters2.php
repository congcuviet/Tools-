<div class="filter-soft-wrapper">
    <div class="filter-soft-header">
        <h2>🎨 Chỉnh Màu & Bộ Lọc Ảnh</h2>
        <p>Giao diện Pastel dịu mắt. Áp dụng bộ lọc mẫu hoặc tinh chỉnh các thông số màu sắc theo ý muốn.</p>
    </div>

    <!-- Khu vực Tải ảnh lên -->
    <div class="upload-section" id="upload-section">
        <label for="filter-image-input" class="upload-label">
            <span class="upload-icon">🖼️</span>
            <span class="upload-text">Nhấn để chọn ảnh cần chỉnh màu</span>
            <input type="file" id="filter-image-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
        </label>
    </div>

    <!-- Khu vực Bảng điều khiển (Ẩn khi chưa có ảnh) -->
    <div class="editor-section" id="editor-section" style="display: none;">
        
        <!-- Khung hiển thị ảnh Canvas -->
        <div class="canvas-container">
            <canvas id="filter-canvas"></canvas>
        </div>

        <!-- Thanh công cụ chỉnh sửa -->
        <div class="filter-controls-grid">
            
            <!-- Cột trái: Bộ lọc mẫu (Presets) -->
            <div class="control-box">
                <p class="box-title">🎭 Bộ lọc mẫu (Presets)</p>
                <div class="preset-buttons">
                    <button class="preset-btn active" data-preset="normal">Gốc</button>
                    <button class="preset-btn" data-preset="vintage">🎞️ Vintage</button>
                    <button class="preset-btn" data-preset="bw">🖤 Trắng đen</button>
                    <button class="preset-btn" data-preset="sepia">📜 Sepia</button>
                    <button class="preset-btn" data-preset="cold">❄️ Băng giá</button>
                    <button class="preset-btn" data-preset="warm">☀️ Ấm áp</button>
                    <button class="preset-btn" data-preset="invert">🔄 Đảo màu</button>
                </div>
            </div>

            <!-- Cột phải: Thanh trượt thông số -->
            <div class="control-box">
                <p class="box-title">🎛️ Tinh chỉnh thông số</p>
                <div class="sliders-list">
                    
                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Độ sáng (Brightness)</span>
                            <span id="val-brightness">100%</span>
                        </div>
                        <input type="range" id="range-brightness" min="0" max="200" value="100">
                    </div>

                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Độ tương phản (Contrast)</span>
                            <span id="val-contrast">100%</span>
                        </div>
                        <input type="range" id="range-contrast" min="0" max="200" value="100">
                    </div>

                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Độ bão hòa (Saturation)</span>
                            <span id="val-saturate">100%</span>
                        </div>
                        <input type="range" id="range-saturate" min="0" max="200" value="100">
                    </div>

                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Xoay tông màu (Hue)</span>
                            <span id="val-hue">0°</span>
                        </div>
                        <input type="range" id="range-hue" min="0" max="360" value="0">
                    </div>

                    <div class="slider-group">
                        <div class="slider-label">
                            <span>Độ mờ (Blur)</span>
                            <span id="val-blur">0px</span>
                        </div>
                        <input type="range" id="range-blur" min="0" max="10" value="0" step="0.5">
                    </div>

                </div>
            </div>

        </div>

        <!-- Cụm nút hành động -->
        <div class="action-bar">
            <button id="btn-compare" class="action-btn btn-compare">👁️ Nhấn giữ để xem Ảnh Gốc</button>
            <button id="btn-reset" class="action-btn">🔄 Reset</button>
            <button id="btn-change-img" class="action-btn btn-change">📂 Đổi ảnh khác</button>
            <a id="btn-download" class="btn-primary-soft" download="filtered-image.png">⬇️ TẢI ẢNH VỀ</a>
        </div>

    </div>
</div>