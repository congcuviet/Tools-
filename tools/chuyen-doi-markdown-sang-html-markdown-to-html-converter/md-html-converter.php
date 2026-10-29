<div class="mdhc-soft-wrapper">
    <!-- Nạp thư viện Marked.js (MD sang HTML) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/4.3.0/marked.min.js"></script>
    <!-- Nạp thư viện Turndown.js (HTML sang MD) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.2/turndown.js"></script>

    <div class="mdhc-soft-header">
        <h2 id="mdhc-h1-title">🔄 Đang tải...</h2>
        <p id="mdhc-h1-desc">Vui lòng chờ trong giây lát...</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ -->
    <script>
        (function(){
            var url = decodeURIComponent(window.location.href).toLowerCase();
            var title = document.getElementById('mdhc-h1-title');
            var desc = document.getElementById('mdhc-h1-desc');
            
            if(url.includes('html-to-markdown') || url.includes('html-sang-markdown')) {
                title.innerText = '🔄 Chuyển đổi HTML sang Markdown';
                desc.innerText = 'Dịch ngược mã HTML thành cú pháp Markdown chuẩn chỉ, dễ đọc.';
            } else {
                title.innerText = '🔄 Chuyển đổi Markdown sang HTML';
                desc.innerText = 'Trình biên dịch cú pháp Markdown sang mã HTML trực tuyến, hỗ trợ xem trước (Live Preview).';
            }
        })();
    </script>

    <div class="mdhc-body">
        
        <!-- THANH ĐIỀU HƯỚNG -->
        <div class="mdhc-toolbar">
            <button id="mdhc-btn-swap" class="mdhc-btn-swap" title="Đảo ngược định dạng (Hoán đổi 2 bên)">
                ⇌ ĐẢO CHIỀU (SWAP)
            </button>
            <button id="mdhc-btn-clear" class="mdhc-btn-clear">🧹 Xóa trắng</button>
        </div>

        <div class="mdhc-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="mdhc-col">
                <div class="mdhc-card mdhc-bg-yellow">
                    <div class="mdhc-flex-between" style="margin-bottom: 15px;">
                        <select id="mdhc-select-left" class="mdhc-select" disabled>
                            <option value="markdown" selected>Markdown</option>
                            <option value="html">HTML</option>
                        </select>
                        <span class="mdhc-badge" id="mdhc-badge-left">Sẵn sàng</span>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="mdhc-input-left" class="mdhc-textarea" placeholder="Nhập văn bản vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI (OUTPUT & PREVIEW) -->
            <div class="mdhc-col">
                <div class="mdhc-card mdhc-bg-white">
                    <div class="mdhc-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <select id="mdhc-select-right" class="mdhc-select" disabled>
                            <option value="html" selected>HTML</option>
                            <option value="markdown">Markdown</option>
                        </select>
                        
                        <!-- Nhóm Nút Chuyển Tab & Copy -->
                        <div class="mdhc-action-group">
                            <button class="mdhc-btn-tab active" id="mdhc-tab-code">💻 Mã Nguồn</button>
                            <button class="mdhc-btn-tab" id="mdhc-tab-preview" style="display: none;">👁️ Xem Trước</button>
                            <button class="mdhc-btn-copy" id="mdhc-btn-copy">📋 COPY</button>
                        </div>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung Code thô -->
                        <textarea id="mdhc-input-right" class="mdhc-textarea mdhc-textarea-output" readonly placeholder="Kết quả mã nguồn sẽ hiển thị ở đây..."></textarea>
                        
                        <!-- Khung Live Preview (Mặc định ẩn) -->
                        <div id="mdhc-preview-box" class="mdhc-preview-content" style="display: none;"></div>
                    </div>
                </div>
            </div>

        </div> 
    </div>

    <div class="mdhc-info-box">
        <h4>💡 IT Note:</h4>
        <p>Hỗ trợ đầy đủ các thẻ Markdown tiêu chuẩn (Tiêu đề, In đậm, In nghiêng, Danh sách, Bảng, Khối mã code, Blockquote). Kết quả dịch được tối ưu hóa siêu sạch, không chứa các thẻ rác.</p>
    </div>
</div>