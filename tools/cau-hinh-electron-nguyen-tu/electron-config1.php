<div class="e-neo-wrapper">
    <div class="e-header">
        <h2>Bộ Tra Cứu Cấu Hình Electron 3D Bản Đầy Đủ</h2>
        <p>Mô phỏng quỹ đạo, quy tắc Hund và cấu hình Ion tự động.</p>
    </div>

    <!-- ========================================== -->
    <!-- PHẦN 1: KHU VỰC TRA CỨU VÀ TƯƠNG TÁC ĐỘNG   -->
    <!-- ========================================== -->
    <div class="e-search-section autocomplete-wrapper">
        <input type="text" id="elSearchInput" class="e-neo-input" placeholder="Gõ tên nguyên tố hoặc ký hiệu (VD: Sắt, Fe, Đồng)..." autocomplete="off">
        <ul id="elSuggestBox" class="autocomplete-dropdown hidden"></ul>
    </div>

    <div id="eResultArea" class="e-result-area hidden">
        <div class="e-main-grid">
            
            <!-- Cột trái: Mô hình Bohr CSS -->
            <div class="e-bohr-col">
                <h3 class="e-col-title">Mô Hình Vỏ Electron</h3>
                <div class="bohr-container" id="bohrModel">
                    <!-- JS vẽ vòng tròn quỹ đạo -->
                </div>
            </div>

            <!-- Cột phải: Cấu hình và Tính toán Ion -->
            <div class="e-config-col">
                <div class="e-title-bar">
                    <h3 id="elNameTitle">Sắt (Fe)</h3>
                    <div class="e-badges">
                        <span id="elZBadge" class="e-badge">Z = 26</span>
                    </div>
                </div>

                <!-- Control Panel: Tính Cation/Anion -->
                <div class="ion-controls">
                    <button class="e-btn-ion btn-minus" id="btnRemoveE" title="Bứt 1 Electron (Tạo Cation)">- e⁻</button>
                    <span id="ionStateLabel" class="ion-state-label">Trạng thái cơ bản</span>
                    <button class="e-btn-ion btn-plus" id="btnAddE" title="Nhận 1 Electron (Tạo Anion)">+ e⁻</button>
                    <button class="e-btn-ion btn-reset" id="btnResetE">↻ Reset</button>
                </div>

                <!-- Text Cấu Hình -->
                <div class="e-config-text-box">
                    <span class="e-config-label">Cấu hình:</span>
                    <div id="configText" class="e-config-string"></div>
                </div>

                <!-- Sơ đồ hộp Orbital (Quy tắc Hund) -->
                <div class="e-orbital-section">
                    <span class="e-config-label">Sơ đồ Orbital:</span>
                    <div class="orbital-container" id="orbitalDiagram">
                        <!-- JS vẽ hộp -->
                    </div>
                </div>
                
                <div class="e-warning hidden" id="eWarning"></div>
            </div>
        </div>
    </div>

    <hr class="neo-divider">

    <!-- ========================================== -->
    <!-- PHẦN 2: BẢNG PHÂN LOẠI TĨNH TOÀN BỘ 118 CHẤT -->
    <!-- ========================================== -->
    <div class="e-static-section">
        <h3 class="section-title">📚 Danh mục cấu hình Electron toàn phần</h3>
        <p style="margin-bottom: 20px; font-weight: 700; color: #555;">Click vào bất kỳ nguyên tố nào dưới đây để vẽ Sơ đồ quỹ đạo và tính Ion tự động ở phần trên.</p>
        
        <div id="staticConfigArea" class="static-config-area">
            <!-- JS sẽ chia nhóm và bơm các thẻ card nhỏ vào đây -->
        </div>
    </div>
</div>