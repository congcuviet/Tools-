<link rel="stylesheet" href="color-converter.css?v=<?php echo file_exists('color-converter.css') ? filemtime('color-converter.css') : '1.0'; ?>">

<div class="tool-container">
    <h2 class="tool-title">Chuyển Đổi Mã Màu & Phối Màu 🎨</h2>
    
    <div class="main-layout">
        <!-- Cột Hiển thị & Bảng màu -->
        <div class="visual-panel">
            <div class="color-preview" id="colorPreview">
                <input type="color" id="nativeColorPicker" value="#ffb7b2" title="Bấm để chọn màu">
            </div>
            
            <!-- Bảng màu tự động sinh -->
            <div class="harmony-section">
                <h4>GỢI Ý PHỐI MÀU (HARMONIES)</h4>
                
                <div class="harmony-group">
                    <span class="harmony-label">Đơn sắc (Monochromatic)</span>
                    <div class="palette" id="palMono"></div>
                </div>
                
                <div class="harmony-group">
                    <span class="harmony-label">Tương đồng (Analogous)</span>
                    <div class="palette" id="palAnalog"></div>
                </div>
                
                <div class="harmony-group">
                    <span class="harmony-label">Bổ túc (Complementary)</span>
                    <div class="palette" id="palComp"></div>
                </div>
            </div>
        </div>

        <!-- Cột Nhập liệu & Chuyển đổi -->
        <div class="conversion-panel">
            <div class="input-card bg-hex">
                <label for="inpHex">HEX (Phổ biến trên Web)</label>
                <div class="input-wrapper">
                    <input type="text" id="inpHex" value="#FFB7B2" spellcheck="false">
                    <button class="btn-copy-color" data-target="inpHex">📋</button>
                </div>
            </div>

            <div class="input-card bg-rgb">
                <label for="inpRgb">RGB / RGBA (Màn hình kỹ thuật số)</label>
                <div class="input-wrapper">
                    <input type="text" id="inpRgb" value="rgb(255, 183, 178)" spellcheck="false">
                    <button class="btn-copy-color" data-target="inpRgb">📋</button>
                </div>
            </div>

            <div class="input-card bg-hsl">
                <label for="inpHsl">HSL (Dễ tinh chỉnh sắc độ)</label>
                <div class="input-wrapper">
                    <input type="text" id="inpHsl" value="hsl(4, 100%, 85%)" spellcheck="false">
                    <button class="btn-copy-color" data-target="inpHsl">📋</button>
                </div>
            </div>

            <div class="input-card bg-cmyk">
                <label for="inpCmyk">CMYK (Dùng trong In ấn)</label>
                <div class="input-wrapper">
                    <input type="text" id="inpCmyk" value="cmyk(0%, 28%, 30%, 0%)" spellcheck="false">
                    <button class="btn-copy-color" data-target="inpCmyk">📋</button>
                </div>
            </div>
            
            <!-- Trượt tinh chỉnh -->
            <div class="slider-panel">
                <div class="slider-group">
                    <label>Độ mờ (Alpha/Opacity): <span id="alphaVal">1.00</span></label>
                    <input type="range" id="inpAlpha" min="0" max="1" step="0.01" value="1" class="slider-brutal">
                </div>
            </div>
        </div>
    </div>

    <div id="toastColor">Đã copy mã màu!</div>
</div>

<script src="color-converter.js?v=<?php echo file_exists('color-converter.js') ? filemtime('color-converter.js') : '1.0'; ?>"></script>