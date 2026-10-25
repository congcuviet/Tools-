<div class="punnett-neo-wrapper">
    <div class="punnett-neo-header">
        <h2>🧬 Bảng Lai Di Truyền Punnett</h2>
        <p>Nhập kiểu gen của Bố và Mẹ để mô phỏng sự phân ly độc lập, tính toán tỷ lệ kiểu gen và kiểu hình thế hệ con.</p>
    </div>

    <form id="punnett-form" class="punnett-neo-form">
        <!-- Khu vực nhập Kiểu gen -->
        <div class="punnett-form-grid">
            <div class="punnett-group">
                <label for="parent1">Kiểu gen P1 (Bố/Mẹ 1)</label>
                <input type="text" id="parent1" required maxlength="4" placeholder="VD: Aa hoặc AaBb">
            </div>
            <div class="punnett-group">
                <label for="parent2">Kiểu gen P2 (Bố/Mẹ 2)</label>
                <input type="text" id="parent2" required maxlength="4" placeholder="VD: Aa hoặc aabb">
            </div>
        </div>

        <div class="punnett-quick-actions">
            <p><strong>💡 Gợi ý nhanh (Bấm để điền):</strong></p>
            <div class="quick-btn-group">
                <button type="button" class="quick-btn" data-p1="Aa" data-p2="Aa">Lai 1 tính trạng (Aa x Aa)</button>
                <button type="button" class="quick-btn" data-p1="AaBb" data-p2="AaBb">Lai 2 tính trạng (AaBb x AaBb)</button>
                <button type="button" class="quick-btn" data-p1="Aa" data-p2="aa">Lai phân tích (Aa x aa)</button>
            </div>
        </div>

        <div id="punnett-error" class="punnett-error-alert" style="display: none;">
            ⚠️ Kiểu gen không hợp lệ! Vui lòng nhập 2 chữ cái (1 gen) hoặc 4 chữ cái (2 gen) giống nhau ở cả hai P.
        </div>

        <button type="submit" class="punnett-neo-btn">Tạo Bảng Lai 🔬</button>
    </form>

    <!-- Kết quả -->
    <div id="punnett-result" class="punnett-neo-result" style="display: none;">
        
        <!-- Bảng Punnett -->
        <div class="punnett-table-container">
            <h3 class="result-title">Khung Lưới Punnett (F1)</h3>
            <div class="table-scroll">
                <table id="punnett-grid" class="punnett-brutal-table">
                    <!-- JS sẽ sinh HTML bảng vào đây -->
                </table>
            </div>
        </div>

        <!-- Thống kê tỷ lệ -->
        <div class="punnett-stats-grid">
            <div class="stat-box box-genotype">
                <h4>🧬 Tỷ lệ Kiểu gen (Genotypes)</h4>
                <ul id="res-genotypes" class="stat-list">
                    <!-- JS -->
                </ul>
            </div>
            <div class="stat-box box-phenotype">
                <h4>👀 Tỷ lệ Kiểu hình (Phenotypes)</h4>
                <ul id="res-phenotypes" class="stat-list">
                    <!-- JS -->
                </ul>
                <small class="note-pheno">*Giả định chữ in hoa là tính trạng trội hoàn toàn.</small>
            </div>
        </div>

    </div>
</div>