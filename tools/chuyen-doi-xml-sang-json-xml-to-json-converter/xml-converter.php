<div class="xmlc-soft-wrapper">
    <!-- Nạp thư viện X2JS chuyên xử lý XML <-> JSON -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/x2js/1.2.0/xml2json.min.js"></script>

    <div class="xmlc-soft-header">
        <h2 id="xmlc-h1-title">🔄 Đang tải...</h2>
        <p id="xmlc-h1-desc">Vui lòng chờ trong giây lát...</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Khắc phục triệt để hiện tượng chớp/nhảy chữ -->
    <script>
        (function(){
            var url = decodeURIComponent(window.location.href).toLowerCase();
            var title = document.getElementById('xmlc-h1-title');
            var desc = document.getElementById('xmlc-h1-desc');
            
            if(url.includes('xml-to-json') || url.includes('xml-sang-json')) {
                title.innerText = '🔄 Chuyển đổi XML sang JSON';
                desc.innerText = 'Dịch dữ liệu từ định dạng thẻ XML sang cấu trúc JSON chuẩn xác, siêu tốc.';
            } else if (url.includes('json-to-xml') || url.includes('json-sang-xml')) {
                title.innerText = '🔄 Chuyển đổi JSON sang XML';
                desc.innerText = 'Biến đổi cấu hình JSON thành các thẻ XML trực tuyến.';
            } else {
                title.innerText = '🔄 Chuyển đổi XML sang JSON';
                desc.innerText = 'Công cụ chuyển đổi cấu trúc dữ liệu 2 chiều giữa XML và JSON.';
            }
        })();
    </script>

    <div class="xmlc-body">
        
        <!-- THANH ĐIỀU HƯỚNG -->
        <div class="xmlc-toolbar">
            <button id="xmlc-btn-swap" class="xmlc-btn-swap" title="Đảo ngược định dạng (Hoán đổi 2 bên)">
                ⇌ ĐẢO CHIỀU (SWAP)
            </button>
            <button id="xmlc-btn-clear" class="xmlc-btn-clear">🧹 Xóa trắng</button>
        </div>

        <div class="xmlc-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="xmlc-col">
                <div class="xmlc-card xmlc-bg-yellow">
                    <div class="xmlc-flex-between" style="margin-bottom: 15px;">
                        <select id="xmlc-select-left" class="xmlc-select" disabled>
                            <option value="xml">XML</option>
                            <option value="json" selected>JSON</option>
                        </select>
                        <span class="xmlc-badge" id="xmlc-badge-left">Sẵn sàng</span>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="xmlc-input-left" class="xmlc-textarea" placeholder="Dán dữ liệu vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI (OUTPUT) -->
            <div class="xmlc-col">
                <div class="xmlc-card xmlc-bg-white">
                    <div class="xmlc-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <select id="xmlc-select-right" class="xmlc-select" disabled>
                            <option value="json">JSON</option>
                            <option value="xml" selected>XML</option>
                        </select>
                        <button class="xmlc-btn-copy" id="xmlc-btn-copy">📋 COPY KẾT QUẢ</button>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung báo lỗi -->
                        <div class="xmlc-error-overlay" id="xmlc-error-box" style="display: none;">
                            <strong>⚠️ Lỗi Cú Pháp (Syntax Error):</strong>
                            <div id="xmlc-error-msg"></div>
                        </div>

                        <textarea id="xmlc-input-right" class="xmlc-textarea xmlc-textarea-output" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>