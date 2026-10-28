<div class="b64f-soft-wrapper">
    <div class="b64f-soft-header">
        <h2>📁 Chuyển Đổi File Sang Base64</h2>
        <p>Mã hóa hình ảnh, tài liệu (PDF, DOCX), font chữ thành chuỗi Base64 để nhúng trực tiếp vào HTML/CSS hoặc gửi qua API.</p>
    </div>

    <!-- Cảnh báo bảo mật -->
    <div class="b64f-alert-box">
        <span class="b64f-alert-icon">🛡️</span>
        <div class="b64f-alert-content">
            <strong>BẢO MẬT & TỐC ĐỘ:</strong> 
            File của bạn KHÔNG bị tải lên bất kỳ máy chủ nào. Thuật toán của chúng tôi xử lý chuyển đổi trực tiếp trên thanh RAM trình duyệt của bạn!
        </div>
    </div>

    <div class="b64f-body">
        <div class="b64f-main-layout">
            
            <!-- CỘT TRÁI: Khu vực Upload -->
            <div class="b64f-col">
                <div class="b64f-card b64f-bg-yellow">
                    <h3 class="b64f-card-title">📥 Chọn File (Tối đa 5MB)</h3>
                    
                    <!-- Khung kéo thả -->
                    <div class="b64f-dropzone" id="b64f-dropzone">
                        <div class="b64f-drop-icon">📂</div>
                        <div class="b64f-drop-text">Kéo thả file vào đây<br>hoặc</div>
                        <button class="b64f-btn-select" id="b64f-btn-select">📁 Duyệt File Lên</button>
                        <input type="file" id="b64f-file-input" style="display: none;">
                    </div>
                    
                    <!-- Thông tin file đã chọn -->
                    <div class="b64f-file-info" id="b64f-file-info" style="display: none;">
                        <div class="b64f-info-row">
                            <span class="b64f-lbl">Tên file:</span>
                            <b id="b64f-filename">--</b>
                        </div>
                        <div class="b64f-info-row">
                            <span class="b64f-lbl">Kích thước:</span>
                            <b id="b64f-filesize">--</b>
                        </div>
                        <div class="b64f-info-row">
                            <span class="b64f-lbl">Định dạng (MIME):</span>
                            <b id="b64f-filetype" class="b64f-text-cyan">--</b>
                        </div>
                    </div>

                    <div class="b64f-warning-msg" id="b64f-warning-msg" style="display: none;">
                        ⚠️ Trình duyệt có thể bị lag khi render chuỗi Base64 của file quá lớn!
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả Base64 -->
            <div class="b64f-col">
                <div class="b64f-card b64f-bg-white" id="b64f-result-card">
                    <div class="b64f-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="b64f-card-title" style="margin:0; border:none; padding:0;">🚀 Kết Quả Base64</h3>
                        <span class="b64f-badge" id="b64f-status-badge">Chờ chọn file...</span>
                    </div>
                    
                    <!-- Khung Loading -->
                    <div class="b64f-loading" id="b64f-loading" style="display: none;">
                        <div class="b64f-spinner"></div>
                        <div>Đang mã hóa file...</div>
                    </div>

                    <!-- Khung Kết quả -->
                    <div class="b64f-result-area" id="b64f-result-area" style="display: none;">
                        
                        <div class="b64f-group">
                            <label class="b64f-label">1. Chuỗi Data URI (Dùng cho thẻ HTML/CSS):</label>
                            <textarea id="b64f-out-uri" class="b64f-textarea" readonly></textarea>
                            <button class="b64f-btn-action" data-target="b64f-out-uri">
                                📋 COPY KÈM TIỀN TỐ (DATA:MIME...)
                            </button>
                        </div>

                        <div class="b64f-divider"></div>

                        <div class="b64f-group">
                            <label class="b64f-label">2. Chuỗi Base64 Thuần (Dùng cho API/JSON):</label>
                            <textarea id="b64f-out-raw" class="b64f-textarea" readonly></textarea>
                            <button class="b64f-btn-main" data-target="b64f-out-raw">
                                📋 COPY BASE64 THUẦN (RAW)
                            </button>
                        </div>

                    </div>

                    <!-- Empty State -->
                    <div class="b64f-empty-state" id="b64f-empty-state">
                        Vui lòng upload một file để xem chuỗi mã hóa.
                    </div>

                </div>
            </div>

        </div> 
    </div>
</div>