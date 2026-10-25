<div class="bcryp-soft-wrapper">
    <!-- Nạp thư viện BcryptJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"></script>

    <div class="bcryp-soft-header">
        <h2>🛡️ Mã Hóa & Kiểm Tra Bcrypt</h2>
        <p>Tạo mã băm Bcrypt siêu bảo mật (có Salt) và kiểm tra tính hợp lệ của mật khẩu. Xử lý 100% trên trình duyệt.</p>
    </div>

    <div class="bcryp-body">
        <div class="bcryp-main-layout">
            
            <!-- CỘT TRÁI: TẠO MÃ BĂM (GENERATE) -->
            <div class="bcryp-col">
                <div class="bcryp-card bcryp-bg-yellow">
                    <h3 class="bcryp-card-title">🔐 Tạo Mã Bcrypt (Encrypt)</h3>
                    
                    <div class="bcryp-group">
                        <label class="bcryp-label">Nhập mật khẩu (Password):</label>
                        <input type="text" id="bcryp-gen-pwd" class="bcryp-input" placeholder="VD: p@ssw0rd123">
                    </div>

                    <div class="bcryp-group">
                        <div class="bcryp-flex-between">
                            <label class="bcryp-label">Độ phức tạp (Rounds/Cost):</label>
                            <input type="number" id="bcryp-gen-rounds" class="bcryp-num-input" value="10" min="4" max="14">
                        </div>
                        <input type="range" id="bcryp-gen-slider" class="bcryp-range" min="4" max="14" value="10">
                        <span class="bcryp-hint">Khuyên dùng: 10 - 12. Số càng cao càng bảo mật nhưng máy tính sẽ mất nhiều thời gian hơn để xử lý.</span>
                    </div>

                    <button id="bcryp-btn-generate" class="bcryp-btn-main">
                        🚀 Băm Mật Khẩu
                    </button>

                    <div class="bcryp-result-box" style="margin-top: 15px;">
                        <label class="bcryp-label">Kết quả (Bcrypt Hash):</label>
                        <div class="bcryp-input-row">
                            <textarea id="bcryp-gen-result" class="bcryp-textarea-res" readonly placeholder="Mã băm sẽ xuất hiện ở đây..."></textarea>
                        </div>
                        <button class="bcryp-btn-copy" id="bcryp-btn-copy-gen">📋 Copy Kết Quả</button>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: KIỂM TRA MÃ BĂM (VERIFY) -->
            <div class="bcryp-col">
                <div class="bcryp-card bcryp-bg-white">
                    <h3 class="bcryp-card-title">🔍 Kiểm Tra Mật Khẩu (Verify)</h3>
                    
                    <div class="bcryp-group">
                        <label class="bcryp-label">Nhập mật khẩu cần thử:</label>
                        <input type="text" id="bcryp-ver-pwd" class="bcryp-input" placeholder="Nhập mật khẩu gốc...">
                    </div>

                    <div class="bcryp-group">
                        <label class="bcryp-label">Nhập mã băm (Bcrypt Hash):</label>
                        <textarea id="bcryp-ver-hash" class="bcryp-textarea" placeholder="VD: $2a$10$Xm5G..."></textarea>
                    </div>

                    <button id="bcryp-btn-verify" class="bcryp-btn-main bcryp-bg-cyan">
                        ⚖️ Kiểm Tra Khớp (Compare)
                    </button>

                    <!-- Khung kết quả kiểm tra -->
                    <div id="bcryp-ver-status" class="bcryp-status-box" style="display: none;">
                        <div class="bcryp-status-icon" id="bcryp-status-icon">❓</div>
                        <div class="bcryp-status-text" id="bcryp-status-text">Đang chờ...</div>
                    </div>
                    
                </div>
                
                <!-- Hộp thông tin -->
                <div class="bcryp-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Bcrypt bao gồm cả <b>Thuật toán</b>, <b>Cost (Rounds)</b> và <b>Salt</b> ngay bên trong chuỗi kết quả (VD: <code>$2a$10$salt_hash</code>). Do đó, bạn không cần phải lưu Salt ở một cột riêng biệt trong Database!</p>
                </div>
            </div>

        </div> 
    </div>
</div>