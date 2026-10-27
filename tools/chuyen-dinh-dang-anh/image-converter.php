<!-- Nhúng thư viện JSZip để đóng gói file ZIP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>

<div class="conv-soft-wrapper">
    <div class="conv-soft-header">
        <h2>🔄 Chuyển Định Dạng Ảnh Hàng Loạt</h2>
        <p>Kéo thả tối đa 30 ảnh. Chuyển đổi định dạng siêu tốc và tải về tất cả trong 1 file ZIP.</p>
    </div>

    <!-- Khu vực Cấu hình & Kéo thả -->
    <div class="conv-setup-section">
        
        <!-- Chọn định dạng đích -->
        <div class="format-selector">
            <label>🎯 Chuyển tất cả sang định dạng:</label>
            <div class="format-options">
                <label class="format-radio">
                    <input type="radio" name="target_format" value="image/jpeg" checked>
                    <span class="radio-btn">JPG / JPEG</span>
                </label>
                <label class="format-radio">
                    <input type="radio" name="target_format" value="image/png">
                    <span class="radio-btn">PNG</span>
                </label>
                <label class="format-radio">
                    <input type="radio" name="target_format" value="image/webp">
                    <span class="radio-btn">WEBP</span>
                </label>
            </div>
        </div>

        <!-- Vùng kéo thả (Dropzone) -->
        <div class="dropzone" id="dropzone">
            <span class="upload-icon">📂</span>
            <span class="upload-text">Kéo thả ảnh vào đây hoặc Click để chọn</span>
            <span class="upload-subtext">Tối đa 30 ảnh (JPG, PNG, WEBP)</span>
            <input type="file" id="conv-file-input" accept="image/png, image/jpeg, image/webp" multiple style="display: none;">
        </div>
    </div>

    <!-- Khu vực Hiển thị file đã chọn (Ẩn lúc đầu) -->
    <div class="conv-preview-section" id="conv-preview-section" style="display: none;">
        <div class="preview-header">
            <h3>Đã chọn: <span id="file-count">0</span>/30 ảnh</h3>
            <button id="btn-clear-all" class="action-btn-small">🗑️ Xóa hết</button>
        </div>
        
        <div class="preview-grid" id="preview-grid">
            <!-- JS sẽ tự đổ thumbnail các ảnh vào đây -->
        </div>

        <!-- Trạng thái xử lý -->
        <div class="process-status" id="process-status" style="display: none;">
            <div class="spinner"></div>
            <span id="status-text">Đang xử lý: 1 / 10 ảnh...</span>
        </div>

        <button id="btn-start-convert" class="btn-primary-soft">🚀 BẮT ĐẦU CHUYỂN ĐỔI & TẢI ZIP</button>
    </div>
</div>