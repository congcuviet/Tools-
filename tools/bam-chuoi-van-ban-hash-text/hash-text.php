<div class="hashc-soft-wrapper">
    <!-- Nạp thư viện CryptoJS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>

    <div class="hashc-soft-header">
        <h2>🔐 Máy Băm Văn Bản (Hash Text)</h2>
        <p>Tạo mã băm (Hash) an toàn thời gian thực. Hỗ trợ MD5, SHA-1, SHA-256, SHA-512. Dữ liệu xử lý 100% trên trình duyệt của bạn.</p>
    </div>

    <div class="hashc-body">
        <div class="hashc-main-layout">
            
            <!-- CỘT TRÁI: Nhập liệu -->
            <div class="hashc-col">
                <div class="hashc-card hashc-bg-yellow">
                    <h3 class="hashc-card-title">📥 Chuỗi Văn Bản (Input)</h3>
                    
                    <textarea id="hashc-input" class="hashc-textarea" placeholder="Nhập văn bản cần băm (Ví dụ: admin123, password...)"></textarea>
                    
                    <div class="hashc-options-group">
                        <label class="hashc-check-row">
                            <div class="hashc-switch-wrapper">
                                <input type="checkbox" id="hashc-opt-uppercase" class="hashc-checkbox">
                                <div class="hashc-switch"></div>
                            </div>
                            <span class="hashc-opt-text">Viết hoa mã băm (UPPERCASE)</span>
                        </label>
                    </div>

                    <button id="hashc-btn-clear" class="hashc-btn-action">
                        🧹 Xóa Trắng
                    </button>
                    
                    <div class="hashc-note-box">
                        💡 <b>Bảo mật tuyệt đối:</b> Công cụ này không gửi dữ liệu của bạn về bất kỳ máy chủ nào. Mọi phép toán Hash đều chạy bằng JavaScript trên máy của bạn.
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả Hash -->
            <div class="hashc-col">
                <div class="hashc-card hashc-bg-white">
                    <h3 class="hashc-card-title">🚀 Kết Quả (Output)</h3>
                    
                    <div class="hashc-results-list">
                        
                        <!-- MD5 -->
                        <div class="hashc-res-box hashc-bg-cyan">
                            <div class="hashc-res-header">
                                <span class="hashc-algo-name">MD5</span>
                                <span class="hashc-algo-desc">(128-bit)</span>
                            </div>
                            <div class="hashc-input-row">
                                <input type="text" id="hashc-out-md5" class="hashc-text-input" readonly placeholder="--">
                                <button class="hashc-btn-copy" data-target="hashc-out-md5">📋</button>
                            </div>
                        </div>

                        <!-- SHA-1 -->
                        <div class="hashc-res-box hashc-bg-pink">
                            <div class="hashc-res-header">
                                <span class="hashc-algo-name">SHA-1</span>
                                <span class="hashc-algo-desc">(160-bit)</span>
                            </div>
                            <div class="hashc-input-row">
                                <input type="text" id="hashc-out-sha1" class="hashc-text-input" readonly placeholder="--">
                                <button class="hashc-btn-copy" data-target="hashc-out-sha1">📋</button>
                            </div>
                        </div>

                        <!-- SHA-256 -->
                        <div class="hashc-res-box hashc-bg-green">
                            <div class="hashc-res-header">
                                <span class="hashc-algo-name">SHA-256</span>
                                <span class="hashc-algo-desc">(Thường dùng)</span>
                            </div>
                            <div class="hashc-input-row">
                                <input type="text" id="hashc-out-sha256" class="hashc-text-input" readonly placeholder="--">
                                <button class="hashc-btn-copy" data-target="hashc-out-sha256">📋</button>
                            </div>
                        </div>

                        <!-- SHA-512 -->
                        <div class="hashc-res-box hashc-bg-dark">
                            <div class="hashc-res-header">
                                <span class="hashc-algo-name" style="color: #fff;">SHA-512</span>
                                <span class="hashc-algo-desc" style="color: #aaa;">(Độ bảo mật cực cao)</span>
                            </div>
                            <div class="hashc-input-row">
                                <input type="text" id="hashc-out-sha512" class="hashc-text-input" readonly placeholder="--">
                                <button class="hashc-btn-copy" data-target="hashc-out-sha512">📋</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>