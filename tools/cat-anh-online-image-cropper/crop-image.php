<!-- Nhúng thư viện Cropper.js -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>

<div class="crop-soft-wrapper">
    <div class="crop-soft-header">
        <h2>✂️ Cắt Ảnh Online</h2>
        <p>Giao diện dịu mắt. Hỗ trợ xoay, zoom và cắt ảnh theo nhiều tỷ lệ chuẩn.</p>
    </div>

    <!-- Khu vực Tải ảnh lên -->
    <div class="upload-section" id="upload-section">
        <label for="image-upload-input" class="upload-label">
            <span class="upload-icon">📂</span>
            <span class="upload-text">Nhấn để chọn ảnh từ máy của bạn</span>
            <input type="file" id="image-upload-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
        </label>
    </div>

    <!-- Khu vực Chỉnh sửa (Ẩn đi cho đến khi có ảnh) -->
    <div class="editor-section" id="editor-section" style="display: none;">
        
        <!-- Khung chứa Cropper -->
        <div class="cropper-box">
            <img id="image-to-crop" src="" alt="Ảnh cần cắt">
        </div>

        <!-- Bảng điều khiển tỷ lệ & thao tác -->
        <div class="crop-controls">
            <div class="control-group">
                <p>📐 Tỷ lệ khung cắt</p>
                <div class="ratio-buttons">
                    <button class="ratio-btn active" data-ratio="NaN">Tự do</button>
                    <button class="ratio-btn" data-ratio="1">1:1 (Vuông)</button>
                    <button class="ratio-btn" data-ratio="1.7777777777777777">16:9 (Ngang)</button>
                    <button class="ratio-btn" data-ratio="0.75">3:4 (Dọc)</button>
                </div>
            </div>

            <div class="control-group">
                <p>🔄 Xoay & Chỉnh</p>
                <div class="action-buttons">
                    <button class="action-btn" id="btn-rotate-left" title="Xoay trái">↺</button>
                    <button class="action-btn" id="btn-rotate-right" title="Xoay phải">↻</button>
                    <button class="action-btn" id="btn-reset" title="Đặt lại">🔄 Reset</button>
                    <button class="action-btn btn-change-img" id="btn-change-image" title="Đổi ảnh khác">📂 Đổi ảnh</button>
                </div>
            </div>
        </div>

        <!-- Nút Cắt Ảnh -->
        <button id="btn-do-crop" class="btn-primary-soft">✂️ XÁC NHẬN CẮT ẢNH</button>
    </div>

    <!-- Khu vực Kết quả (Ẩn đi cho đến khi cắt xong) -->
    <div class="result-section" id="result-section" style="display: none;">
        <h3 class="result-title">✨ Ảnh của bạn đã sẵn sàng!</h3>
        <div class="preview-box">
            <img id="cropped-preview" src="" alt="Ảnh đã cắt">
        </div>
        <div class="result-actions">
            <a id="btn-download" class="btn-primary-soft btn-download" download="cropped-image.png">⬇️ TẢI XUỐNG NGAY</a>
            <button id="btn-back-edit" class="action-btn" style="width: 100%; padding: 12px; margin-top: 10px;">🔙 Quay lại chỉnh sửa</button>
        </div>
    </div>
</div>