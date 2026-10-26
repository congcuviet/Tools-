<div class="censor-soft-wrapper">
    <div class="censor-soft-header">
        <h2>🙈 Che Mặt & Làm Mờ Ảnh</h2>
        <p>Bảo vệ quyền riêng tư. Hỗ trợ làm mờ, che ô vuông pixel, dán băng keo đen hoặc gắn Emoji.</p>
    </div>

    <!-- Khu vực Tải ảnh lên -->
    <div class="upload-section" id="upload-section">
        <label for="censor-image-input" class="upload-label">
            <span class="upload-icon">📸</span>
            <span class="upload-text">Nhấn để chọn ảnh cần che/làm mờ</span>
            <input type="file" id="censor-image-input" accept="image/png, image/jpeg, image/webp" style="display: none;">
        </label>
    </div>

    <!-- Khu vực Chỉnh sửa (Ẩn khi chưa có ảnh) -->
    <div class="editor-section" id="editor-section" style="display: none;">
        
        <!-- Khung vẽ Canvas -->
        <div class="canvas-container">
            <canvas id="censor-canvas"></canvas>
        </div>

        <!-- Bảng điều khiển -->
        <div class="censor-controls-box">
            
            <div class="control-grid">
                <!-- Chọn kiểu che -->
                <div class="control-item">
                    <p class="box-title">🎨 Chọn kiểu che (Censor Style)</p>
                    <div class="style-buttons">
                        <button class="style-btn active" data-style="blur">💧 Làm mờ (Blur)</button>
                        <button class="style-btn" data-style="pixel">🔲 Ô vuông (Pixel)</button>
                        <button class="style-btn" data-style="black">⬛ Che đen (Solid)</button>
                        <button class="style-btn" data-style="emoji">🤡 Dán Emoji</button>
                    </div>
                </div>

                <!-- Chỉnh kích thước cọ vẽ -->
                <div class="control-item">
                    <p class="box-title">🖌️ Kích thước cọ (Brush Size)</p>
                    <div class="slider-group">
                        <span id="val-brush">40px</span>
                        <input type="range" id="range-brush" class="soft-slider" min="10" max="150" value="40">
                    </div>
                    <p style="font-size: 0.85rem; color: #555; margin-top: 15px;">
                        💡 <em>Mẹo: Hãy vẽ lên ảnh để làm mờ. Nếu chọn Emoji, chỉ cần click chuột vào vị trí cần che.</em>
                    </p>
                </div>
            </div>

            <div class="separator"></div>

            <!-- Cụm nút hành động -->
            <div class="action-bar">
                <button id="btn-undo" class="action-btn" title="Quay lại thao tác trước">↩️ Undo</button>
                <button id="btn-reset" class="action-btn">🔄 Đặt lại</button>
                <button id="btn-change-img" class="action-btn btn-change">📂 Đổi ảnh</button>
                <a id="btn-download" class="btn-primary-soft" download="censored-image.png">⬇️ TẢI ẢNH VỀ</a>
            </div>

        </div>
    </div>
</div>