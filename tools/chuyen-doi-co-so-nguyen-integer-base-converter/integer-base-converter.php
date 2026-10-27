<div class="ibasec-soft-wrapper">
    <div class="ibasec-soft-header">
        <h2>🔢 Chuyển Đổi Cơ Số Nguyên (Base Converter)</h2>
        <p>Chuyển đổi tức thì giữa các hệ cơ số (Nhị phân, Bát phân, Thập phân, Thập lục phân...). Hỗ trợ số siêu lớn (BigInt) không giới hạn độ dài.</p>
    </div>

    <div class="ibasec-body">
        <div class="ibasec-main-layout">
            
            <!-- CỘT TRÁI: Nhập liệu (Input) -->
            <div class="ibasec-col">
                <div class="ibasec-card ibasec-bg-yellow">
                    <h3 class="ibasec-card-title">📥 Đầu vào (Input)</h3>
                    
                    <div class="ibasec-group">
                        <label class="ibasec-label">Cơ số nguồn (Base):</label>
                        <select id="ibasec-input-base" class="ibasec-select">
                            <option value="2">Hệ Nhị phân - Binary (Base 2)</option>
                            <option value="8">Hệ Bát phân - Octal (Base 8)</option>
                            <option value="10" selected>Hệ Thập phân - Decimal (Base 10)</option>
                            <option value="16">Hệ Thập lục phân - Hexadecimal (Base 16)</option>
                            <option value="custom">Tùy chỉnh (2 - 36)...</option>
                        </select>
                        <input type="number" id="ibasec-custom-input-base" class="ibasec-num-input" value="36" min="2" max="36" style="display:none; margin-top:10px;" placeholder="Nhập cơ số 2-36">
                    </div>

                    <div class="ibasec-group">
                        <label class="ibasec-label">Số nguyên (Integer):</label>
                        <textarea id="ibasec-input-number" class="ibasec-textarea" placeholder="Nhập số cần chuyển đổi (VD: 1024, FF, 1010)"></textarea>
                    </div>

                    <div id="ibasec-error-msg" class="ibasec-error-msg" style="display: none;">
                        ⚠️ Số nhập vào chứa ký tự không hợp lệ cho cơ số này!
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả (Output) -->
            <div class="ibasec-col">
                <div class="ibasec-card ibasec-bg-white">
                    <h3 class="ibasec-card-title">🚀 Kết quả (Output)</h3>
                    
                    <div class="ibasec-results-list">
                        
                        <!-- Hệ 10 -->
                        <div class="ibasec-result-item">
                            <label class="ibasec-badge ibasec-badge-dec">Thập phân (10)</label>
                            <div class="ibasec-input-row">
                                <input type="text" id="ibasec-out-10" class="ibasec-text-input" readonly>
                                <button class="ibasec-btn-copy" data-target="ibasec-out-10">📋</button>
                            </div>
                        </div>

                        <!-- Hệ 16 -->
                        <div class="ibasec-result-item">
                            <label class="ibasec-badge ibasec-badge-hex">Hex (16)</label>
                            <div class="ibasec-input-row">
                                <input type="text" id="ibasec-out-16" class="ibasec-text-input" readonly>
                                <button class="ibasec-btn-copy" data-target="ibasec-out-16">📋</button>
                            </div>
                        </div>

                        <!-- Hệ 8 -->
                        <div class="ibasec-result-item">
                            <label class="ibasec-badge ibasec-badge-oct">Bát phân (8)</label>
                            <div class="ibasec-input-row">
                                <input type="text" id="ibasec-out-8" class="ibasec-text-input" readonly>
                                <button class="ibasec-btn-copy" data-target="ibasec-out-8">📋</button>
                            </div>
                        </div>

                        <!-- Hệ 2 -->
                        <div class="ibasec-result-item">
                            <label class="ibasec-badge ibasec-badge-bin">Nhị phân (2)</label>
                            <div class="ibasec-input-row">
                                <input type="text" id="ibasec-out-2" class="ibasec-text-input" readonly>
                                <button class="ibasec-btn-copy" data-target="ibasec-out-2">📋</button>
                            </div>
                        </div>

                        <!-- Tùy chỉnh Output -->
                        <div class="ibasec-result-item ibasec-custom-output">
                            <div class="ibasec-flex-between">
                                <label class="ibasec-badge ibasec-badge-custom">Cơ số khác:</label>
                                <input type="number" id="ibasec-custom-output-base" class="ibasec-num-input-small" value="32" min="2" max="36" title="Chọn cơ số đầu ra">
                            </div>
                            <div class="ibasec-input-row" style="margin-top: 5px;">
                                <input type="text" id="ibasec-out-custom" class="ibasec-text-input" readonly>
                                <button class="ibasec-btn-copy" data-target="ibasec-out-custom">📋</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>