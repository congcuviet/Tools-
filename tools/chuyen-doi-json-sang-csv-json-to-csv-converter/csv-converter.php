<div class="csvc-soft-wrapper">
    <!-- Nạp thư viện PapaParse chuyên xử lý CSV -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.4.1/papaparse.min.js"></script>

    <div class="csvc-soft-header">
        <h2 id="csvc-h1-title">🔄 Đang tải...</h2>
        <p id="csvc-h1-desc">Vui lòng chờ trong giây lát...</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ ngay từ giây đầu tiên -->
    <script>
        (function(){
            var url = decodeURIComponent(window.location.href).toLowerCase();
            var title = document.getElementById('csvc-h1-title');
            var desc = document.getElementById('csvc-h1-desc');
            
            if(url.includes('csv-to-json') || url.includes('csv-sang-json')) {
                title.innerText = '🔄 Chuyển đổi CSV sang JSON';
                desc.innerText = 'Dịch dữ liệu bảng tính CSV thành mảng đối tượng JSON chuẩn xác, tự động nhận diện tiêu đề.';
            } else if (url.includes('json-to-csv') || url.includes('json-sang-csv')) {
                title.innerText = '🔄 Chuyển đổi JSON sang CSV';
                desc.innerText = 'Biến đổi mảng dữ liệu JSON thành bảng tính CSV để mở bằng Excel.';
            } else {
                title.innerText = '🔄 Chuyển đổi JSON sang CSV';
                desc.innerText = 'Công cụ chuyển đổi cấu trúc dữ liệu 2 chiều giữa JSON và CSV.';
            }
        })();
    </script>

    <div class="csvc-body">
        
        <!-- THANH ĐIỀU HƯỚNG -->
        <div class="csvc-toolbar">
            <button id="csvc-btn-swap" class="csvc-btn-swap" title="Đảo ngược định dạng (Hoán đổi 2 bên)">
                ⇌ ĐẢO CHIỀU (SWAP)
            </button>
            <button id="csvc-btn-clear" class="csvc-btn-clear">🧹 Xóa trắng</button>
        </div>

        <div class="csvc-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="csvc-col">
                <div class="csvc-card csvc-bg-yellow">
                    <div class="csvc-flex-between" style="margin-bottom: 15px;">
                        <select id="csvc-select-left" class="csvc-select" disabled>
                            <option value="json" selected>JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                        <span class="csvc-badge" id="csvc-badge-left">Sẵn sàng</span>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="csvc-input-left" class="csvc-textarea" placeholder="Dán dữ liệu vào đây..." autofocus></textarea>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI (OUTPUT) -->
            <div class="csvc-col">
                <div class="csvc-card csvc-bg-white">
                    <div class="csvc-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <select id="csvc-select-right" class="csvc-select" disabled>
                            <option value="csv" selected>CSV</option>
                            <option value="json">JSON</option>
                        </select>
                        <button class="csvc-btn-copy" id="csvc-btn-copy">📋 COPY KẾT QUẢ</button>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung báo lỗi -->
                        <div class="csvc-error-overlay" id="csvc-error-box" style="display: none;">
                            <strong>⚠️ Lỗi Cú Pháp (Syntax Error):</strong>
                            <div id="csvc-error-msg"></div>
                        </div>

                        <textarea id="csvc-input-right" class="csvc-textarea csvc-textarea-output" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>

        </div> 
    </div>

    <div class="csvc-info-box">
        <h4>💡 IT Note:</h4>
        <p>Thuật toán tích hợp <b>PapaParse</b> giúp tự động nhận diện dấu phân cách (phẩy hoặc chấm phẩy) và tự động ép kiểu dữ liệu (chuyển số, boolean từ CSV về đúng định dạng chuẩn của JSON).</p>
    </div>
</div>