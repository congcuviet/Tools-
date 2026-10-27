<div class="neo-base64-wrapper">
    <div class="neo-base64-header">
        <h2>🖼️ Chuyển Ảnh sang Base64</h2>
        <p>Mã hóa hình ảnh thành chuỗi Base64 trực tiếp trên trình duyệt</p>
    </div>

    <!-- Khu vực Kéo thả / Chọn ảnh -->
    <div class="neo-dropzone" id="neo-dropzone">
        <div class="neo-drop-content">
            <span class="neo-drop-icon">📂</span>
            <h3>Kéo thả ảnh vào đây</h3>
            <p>hoặc</p>
            <button class="neo-btn-sm" onclick="document.getElementById('neo-file-input').click()">Tải ảnh lên</button>
            <input type="file" id="neo-file-input" accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif" hidden>
        </div>
        <img id="neo-preview-img" class="neo-preview-img" style="display: none;" alt="Preview">
    </div>

    <!-- Khu vực Hiển thị Thông số & Kết quả -->
    <div id="neo-result-area" class="neo-result-area" style="display: none;">
        <div class="neo-info-bar">
            <span id="neo-file-name">Tên file: ---</span>
            <span id="neo-file-size">Dung lượng Base64: ---</span>
        </div>

        <div class="neo-code-group">
            <label>1. Định dạng Data URI (Dùng cho thẻ &lt;img&gt; hoặc CSS):</label>
            <div class="neo-textarea-wrap">
                <textarea id="neo-uri-output" readonly></textarea>
                <button class="neo-btn-copy" data-target="neo-uri-output">📋 Copy</button>
            </div>
        </div>

        <div class="neo-code-group">
            <label>2. Định dạng Raw Base64 (Dùng cho API/JSON):</label>
            <div class="neo-textarea-wrap">
                <textarea id="neo-raw-output" readonly></textarea>
                <button class="neo-btn-copy" data-target="neo-raw-output">📋 Copy</button>
            </div>
        </div>

        <button id="neo-btn-reset" class="neo-btn-reset">🔄 Làm mới</button>
    </div>
</div>