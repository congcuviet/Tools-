<div class="nato-soft-wrapper">
    <div class="nato-soft-header">
        <h2>🔤 Dịch Bảng Chữ Cái NATO</h2>
        <p>Chuyển đổi văn bản thành ngôn ngữ ngữ âm NATO (Alfa, Bravo, Charlie...). Công cụ hỗ trợ xử lý Tiếng Việt không dấu và phát âm giọng nói.</p>
    </div>

    <div class="nato-body">
        <div class="nato-main-layout">
            
            <!-- CỘT TRÁI: Đầu vào -->
            <div class="nato-col">
                <div class="nato-card nato-bg-yellow">
                    <h3 class="nato-card-title">📥 Văn Bản Gốc (Input)</h3>
                    
                    <div class="nato-group">
                        <textarea id="nato-input-text" class="nato-textarea" placeholder="Nhập văn bản cần đánh vần vào đây... (Ví dụ: Hello 123)" autofocus></textarea>
                    </div>

                    <button id="nato-btn-clear" class="nato-btn-action">
                        🧹 Xóa Trắng
                    </button>
                    
                    <!-- Bảng Cheat Sheet thu gọn -->
                    <div class="nato-cheat-sheet">
                        <div class="nato-cheat-title">💡 Bảng tra nhanh:</div>
                        <div class="nato-cheat-grid">
                            <span><b>A</b>lfa</span> <span><b>B</b>ravo</span> <span><b>C</b>harlie</span> 
                            <span><b>D</b>elta</span> <span><b>E</b>cho</span> <span><b>F</b>oxtrot</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả -->
            <div class="nato-col">
                <div class="nato-card nato-bg-white">
                    <div class="nato-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="nato-card-title" style="margin:0; border:none; padding:0;">🚀 Ngữ Âm NATO (Output)</h3>
                        <span class="nato-badge" id="nato-status">Chờ nhập liệu...</span>
                    </div>
                    
                    <div class="nato-group" style="flex: 1; display: flex; flex-direction: column;">
                        <textarea id="nato-output-text" class="nato-textarea nato-textarea-output" readonly placeholder="Kết quả chuyển đổi sẽ hiển thị ở đây..."></textarea>
                    </div>

                    <div class="nato-action-row">
                        <button class="nato-btn-small" id="nato-btn-copy">
                            📋 COPY KẾT QUẢ
                        </button>
                        <button class="nato-btn-main nato-bg-cyan" id="nato-btn-speak">
                            🔊 ĐỌC PHÁT ÂM
                        </button>
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>