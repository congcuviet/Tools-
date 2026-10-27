<div class="listc-soft-wrapper">
    <div class="listc-soft-header">
        <h2>🔄 Trình Chuyển Đổi Danh Sách</h2>
        <p>Biến đổi tức thì các danh sách văn bản thành mảng JSON, chuỗi SQL, thẻ HTML hoặc các định dạng tùy chỉnh.</p>
    </div>

    <div class="listc-body">
        <div class="listc-main-layout">
            
            <!-- CỘT TRÁI: Nhập liệu & Bộ lọc -->
            <div class="listc-col">
                <div class="listc-card listc-bg-cyan">
                    <h3 class="listc-card-title">📥 Đầu Vào (Input)</h3>
                    
                    <textarea id="listc-input" class="listc-textarea" placeholder="Nhập danh sách vào đây...&#10;Dòng 1&#10;Dòng 2&#10;Dòng 3"></textarea>
                    
                    <div class="listc-options-grid">
                        <div class="listc-group">
                            <label class="listc-label">Tách các mục bằng:</label>
                            <select id="listc-split-by" class="listc-select">
                                <option value="newline" selected>Xuống dòng (Enter)</option>
                                <option value="comma">Dấu phẩy (,)</option>
                                <option value="semicolon">Dấu chấm phẩy (;)</option>
                                <option value="space">Khoảng trắng (Space)</option>
                            </select>
                        </div>
                    </div>

                    <h4 class="listc-sub-title">⚙️ Bộ lọc (Modifiers):</h4>
                    <div class="listc-checkbox-group">
                        <label class="listc-check-row">
                            <input type="checkbox" id="listc-mod-trim" checked>
                            <span class="listc-check-box"></span>
                            Xóa khoảng trắng thừa (Trim)
                        </label>
                        <label class="listc-check-row">
                            <input type="checkbox" id="listc-mod-empty" checked>
                            <span class="listc-check-box"></span>
                            Bỏ qua các dòng trống
                        </label>
                        <label class="listc-check-row">
                            <input type="checkbox" id="listc-mod-unique">
                            <span class="listc-check-box"></span>
                            Loại bỏ giá trị trùng lặp
                        </label>
                        <label class="listc-check-row">
                            <input type="checkbox" id="listc-mod-sort">
                            <span class="listc-check-box"></span>
                            Sắp xếp (A - Z)
                        </label>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả & Định dạng -->
            <div class="listc-col">
                <div class="listc-card listc-bg-white">
                    <h3 class="listc-card-title">🚀 Đầu Ra (Output)</h3>
                    
                    <div class="listc-group">
                        <label class="listc-label">Định dạng xuất (Format):</label>
                        <select id="listc-format" class="listc-select listc-select-highlight">
                            <option value="comma">Dấu phẩy + Khoảng trắng (a, b, c)</option>
                            <option value="json">Mảng JSON (["a", "b"])</option>
                            <option value="sql">SQL IN Clause ('a', 'b')</option>
                            <option value="html">HTML List (&lt;ul&gt;&lt;li&gt;)</option>
                            <option value="custom">Tùy chỉnh Nâng cao...</option>
                        </select>
                    </div>

                    <!-- Khung Tùy Chỉnh (Ẩn/Hiện) -->
                    <div id="listc-custom-panel" class="listc-custom-panel" style="display: none;">
                        <div class="listc-custom-row">
                            <div class="listc-custom-item">
                                <label>Tiền tố (Prefix)</label>
                                <input type="text" id="listc-custom-prefix" class="listc-text-input" placeholder="VD: [">
                            </div>
                            <div class="listc-custom-item">
                                <label>Hậu tố (Suffix)</label>
                                <input type="text" id="listc-custom-suffix" class="listc-text-input" placeholder="VD: ]">
                            </div>
                            <div class="listc-custom-item">
                                <label>Nối bằng (Join)</label>
                                <input type="text" id="listc-custom-join" class="listc-text-input" placeholder="VD: ,">
                            </div>
                        </div>
                    </div>

                    <textarea id="listc-output" class="listc-textarea listc-textarea-output" readonly placeholder="Kết quả sẽ hiển thị ở đây..."></textarea>
                    
                    <div class="listc-info-row">
                        <span id="listc-item-count" class="listc-badge">Tổng: 0 mục</span>
                        <button id="listc-btn-copy" class="listc-btn-copy">📋 Copy Kết Quả</button>
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>