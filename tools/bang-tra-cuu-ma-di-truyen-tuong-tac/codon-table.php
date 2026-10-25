<div class="codon-neo-wrapper">
    <div class="codon-neo-header">
        <h2>🧬 Bảng Tra Cứu Mã Di Truyền</h2>
        <p>Tra cứu xuôi/ngược 64 bộ ba (Codon) và phân tích tính chất hóa học của 20 loại Axit Amin.</p>
    </div>

    <!-- Hướng dẫn & Ghi chú màu -->
    <div class="codon-legend-box">
        <strong>🎨 Phân loại Axit Amin (Amino Acids):</strong>
        <div class="legend-grid">
            <span class="l-badge type-nonpolar">Không phân cực (Kỵ nước)</span>
            <span class="l-badge type-polar">Phân cực (Ưa nước)</span>
            <span class="l-badge type-acidic">Mang tính Axit (-)</span>
            <span class="l-badge type-basic">Mang tính Bazơ (+)</span>
            <span class="l-badge type-start">AUG (Mã mở đầu)</span>
            <span class="l-badge type-stop">STOP (Mã kết thúc)</span>
        </div>
    </div>

    <!-- Nút chuyển đổi Chế độ -->
    <div class="codon-mode-toggle">
        <label class="radio-neo radio-mode">
            <input type="radio" name="codon-mode" value="table" checked>
            <span class="neo-content">🔲 Bảng Tổng Hợp 64 Codon</span>
        </label>
        <label class="radio-neo radio-mode">
            <input type="radio" name="codon-mode" value="lookup">
            <span class="neo-content">🔍 Tra Cứu Nhanh (Xuôi / Ngược)</span>
        </label>
    </div>

    <!-- ================= CHẾ ĐỘ 1: BẢNG LƯỚI TƯƠNG TÁC ================= -->
    <div id="mode-table" class="mode-section active">
        <div class="codon-table-container">
            <div class="table-scroll-hint">👉 Cuộn ngang để xem toàn bộ bảng</div>
            <div class="table-responsive">
                <table class="codon-brutal-table" id="main-codon-table">
                    <!-- Javascript sẽ tự động vẽ 64 ô chuẩn SGK vào đây -->
                </table>
            </div>
        </div>
        
        <!-- Khối hiển thị chi tiết khi Hover/Click vào ô trong bảng -->
        <div id="hover-detail-box" class="hover-detail-box">
            <div class="hd-placeholder">Hãy chạm hoặc di chuột vào một Codon bất kỳ trên bảng để xem chi tiết!</div>
            <!-- Nội dung chi tiết sẽ hiện ở đây bằng JS -->
        </div>
    </div>

    <!-- ================= CHẾ ĐỘ 2: TRA CỨU NHANH ================= -->
    <div id="mode-lookup" class="mode-section" style="display: none;">
        <div class="lookup-grid">
            
            <!-- Tra Xuôi (BỘ BA -> AXIT AMIN) -->
            <div class="lookup-card">
                <h3>⏩ Tra Xuôi: Nhập Bộ Ba</h3>
                <div class="select-codon-grid">
                    <div class="c-group">
                        <label>Nu 1</label>
                        <select id="sel-nu1">
                            <option value="U">U</option><option value="C">C</option><option value="A">A</option><option value="G">G</option>
                        </select>
                    </div>
                    <div class="c-group">
                        <label>Nu 2</label>
                        <select id="sel-nu2">
                            <option value="U">U</option><option value="C">C</option><option value="A">A</option><option value="G">G</option>
                        </select>
                    </div>
                    <div class="c-group">
                        <label>Nu 3</label>
                        <select id="sel-nu3">
                            <option value="U">U</option><option value="C">C</option><option value="A">A</option><option value="G">G</option>
                        </select>
                    </div>
                </div>
                <button type="button" class="codon-neo-btn" id="btn-forward">Dịch Mã ⚡</button>
                
                <div class="quick-result" id="res-forward" style="display: none;">
                    <!-- JS In KQ -->
                </div>
            </div>

            <!-- Tra Ngược (AXIT AMIN -> BỘ BA) -->
            <div class="lookup-card">
                <h3>⏪ Tra Ngược: Chọn Axit Amin</h3>
                <div class="c-group">
                    <label>Axit Amin</label>
                    <select id="sel-aa">
                        <!-- JS Tự động điền 20 AA vào đây -->
                    </select>
                </div>
                <button type="button" class="codon-neo-btn" id="btn-reverse">Tìm Bộ Ba 🔍</button>
                
                <div class="quick-result" id="res-reverse" style="display: none;">
                    <!-- JS In KQ -->
                </div>
            </div>

        </div>
    </div>

</div>