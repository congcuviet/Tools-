<div class="mimet-soft-wrapper">
    <div class="mimet-soft-header">
        <h2>🗂️ Trình Tra Cứu Loại MIME (MIME Types)</h2>
        <p>Tìm kiếm nhanh Content-Type cho các phần mở rộng tệp tin (File extensions) và ngược lại. Phục vụ cấu hình Server, HTTP Headers và API.</p>
    </div>

    <div class="mimet-body">
        <div class="mimet-main-layout">
            
            <!-- CỘT TRÁI: Tìm kiếm -->
            <div class="mimet-col mimet-col-left">
                <div class="mimet-card mimet-bg-yellow">
                    <h3 class="mimet-card-title">🔍 Nhập Từ Khóa</h3>
                    
                    <div class="mimet-group">
                        <label class="mimet-label">Đuôi file hoặc MIME Type:</label>
                        <div class="mimet-search-wrapper">
                            <span class="mimet-search-icon">🔎</span>
                            <input type="text" id="mimet-input-search" class="mimet-input" placeholder="Ví dụ: json, pdf, image/png..." autofocus>
                        </div>
                    </div>

                    <button id="mimet-btn-clear" class="mimet-btn-action">
                        🧹 Xóa Trắng
                    </button>
                    
                    <div class="mimet-info-box" style="margin-top: 20px;">
                        <h4>💡 Mẹo tìm kiếm:</h4>
                        <ul class="mimet-tips-list">
                            <li>Gõ <b>đuôi file</b> (vd: <code>.mp4</code>, <code>zip</code>) để lấy mã MIME Type chuẩn xác.</li>
                            <li>Gõ <b>MIME Type</b> (vd: <code>audio/</code>, <code>text/html</code>) để xem tất cả các đuôi file thuộc nhóm đó.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả tra cứu -->
            <div class="mimet-col mimet-col-right">
                <div class="mimet-card mimet-bg-white">
                    <div class="mimet-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <h3 class="mimet-card-title" style="margin: 0; border: none; padding: 0;">🚀 Kết Quả Tra Cứu</h3>
                        <span class="mimet-badge" id="mimet-status-badge">Đang hiển thị tất cả</span>
                    </div>
                    
                    <!-- Bảng danh sách kết quả -->
                    <div class="mimet-table-wrapper">
                        <table class="mimet-table">
                            <thead>
                                <tr>
                                    <th width="30%">Đuôi File (Ext)</th>
                                    <th width="70%">Loại MIME (MIME Type)</th>
                                </tr>
                            </thead>
                            <tbody id="mimet-results-body">
                                <!-- Dữ liệu sẽ được render bằng JS -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State khi không tìm thấy -->
                    <div class="mimet-empty-state" id="mimet-empty-state" style="display: none;">
                        <div style="font-size: 3rem; margin-bottom: 10px;">🤷‍♂️</div>
                        Không tìm thấy loại MIME nào khớp với từ khóa của bạn.
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>