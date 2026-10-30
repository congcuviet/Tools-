<!-- Nhúng thư viện Paper.js để tính toán hình học vector -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.17/paper-full.min.js"></script>

<div class="s2f-soft-wrapper">
    <div class="s2f-soft-header">
        <h2>🔗 SVG Stroke to Fill</h2>
        <p>Biến các nét vẽ (Strokes) thành các khối hình (Fills). Giúp giữ nguyên độ dày khi phóng to/thu nhỏ.</p>
    </div>

    <div class="upload-section" id="upload-section">
        <label for="svg-upload-input" class="upload-label">
            <span class="upload-icon">🔗</span>
            <span class="upload-text">Chọn file .SVG của bạn</span>
            <input type="file" id="svg-upload-input" accept=".svg" style="display: none;">
        </label>
    </div>

    <div class="editor-section" id="editor-section" style="display: none;">
        <div class="preview-grid">
            <div class="preview-box">
                <p class="box-title">Ảnh Gốc (Stroke)</p>
                <div id="preview-original" class="canvas-bg"></div>
            </div>
            <div class="preview-box">
                <p class="box-title">Sau khi chuyển (Fill)</p>
                <div id="preview-converted" class="canvas-bg"></div>
            </div>
        </div>

        <div class="action-bar">
            <button id="btn-convert" class="btn-primary-soft">✨ CHUYỂN ĐỔI NGAY</button>
            <button id="btn-change-img" class="action-btn">📂 Chọn file khác</button>
            <a id="btn-download" class="btn-success-soft" download="converted-fill.svg" style="display: none;">⬇️ TẢI FILE SVG</a>
        </div>
    </div>
</div>