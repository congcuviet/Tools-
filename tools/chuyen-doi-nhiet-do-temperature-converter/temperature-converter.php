<div class="tempc-soft-wrapper">
    <div class="tempc-soft-header">
        <h2>🌡️ Chuyển Đổi Nhiệt Độ</h2>
        <p>Tính toán và chuyển đổi thời gian thực giữa các thang đo Celsius, Fahrenheit, Kelvin và Rankine.</p>
    </div>

    <div class="tempc-body">
        <div class="tempc-main-layout">
            
            <!-- CỘT TRÁI: Nhập liệu (Input) -->
            <div class="tempc-col">
                <div class="tempc-card tempc-bg-yellow">
                    <h3 class="tempc-card-title">📥 Nhập Nhiệt Độ</h3>
                    
                    <div class="tempc-input-wrapper">
                        <input type="number" id="tempc-input-val" class="tempc-big-input" value="0" step="any" placeholder="VD: 37">
                        
                        <select id="tempc-input-unit" class="tempc-unit-select">
                            <option value="C" selected>Độ C (°C)</option>
                            <option value="F">Độ F (°F)</option>
                            <option value="K">Kelvin (K)</option>
                            <option value="R">Rankine (°R)</option>
                        </select>
                    </div>

                    <div class="tempc-presets">
                        <span class="tempc-preset-lbl">Thường dùng:</span>
                        <button class="tempc-btn-preset" data-val="0" data-unit="C">0°C (Đóng băng)</button>
                        <button class="tempc-btn-preset" data-val="37" data-unit="C">37°C (Cơ thể)</button>
                        <button class="tempc-btn-preset" data-val="100" data-unit="C">100°C (Nước sôi)</button>
                    </div>
                </div>
            </div>

            <!-- CỘT PHẢI: Kết quả đa kênh (Output) -->
            <div class="tempc-col">
                <div class="tempc-card tempc-bg-white">
                    <h3 class="tempc-card-title">🚀 Kết Quả (Chuyển đổi tức thì)</h3>
                    
                    <div class="tempc-results-grid">
                        
                        <!-- Celsius Box -->
                        <div class="tempc-res-box tempc-bg-green" id="tempc-box-C" style="display: none;">
                            <div class="tempc-res-header">Celsius (Độ C)</div>
                            <div class="tempc-res-value-row">
                                <span class="tempc-res-number" id="tempc-out-C">0</span>
                                <span class="tempc-res-symbol">°C</span>
                                <button class="tempc-btn-copy" data-target="tempc-out-C" title="Copy">📋</button>
                            </div>
                        </div>

                        <!-- Fahrenheit Box -->
                        <div class="tempc-res-box tempc-bg-pink" id="tempc-box-F">
                            <div class="tempc-res-header">Fahrenheit (Độ F)</div>
                            <div class="tempc-res-value-row">
                                <span class="tempc-res-number" id="tempc-out-F">32</span>
                                <span class="tempc-res-symbol">°F</span>
                                <button class="tempc-btn-copy" data-target="tempc-out-F" title="Copy">📋</button>
                            </div>
                        </div>

                        <!-- Kelvin Box -->
                        <div class="tempc-res-box tempc-bg-cyan" id="tempc-box-K">
                            <div class="tempc-res-header">Kelvin Tuyệt Đối (K)</div>
                            <div class="tempc-res-value-row">
                                <span class="tempc-res-number" id="tempc-out-K">273.15</span>
                                <span class="tempc-res-symbol">K</span>
                                <button class="tempc-btn-copy" data-target="tempc-out-K" title="Copy">📋</button>
                            </div>
                        </div>

                        <!-- Rankine Box -->
                        <div class="tempc-res-box tempc-bg-dark" id="tempc-box-R">
                            <div class="tempc-res-header">Rankine (°R)</div>
                            <div class="tempc-res-value-row">
                                <span class="tempc-res-number" id="tempc-out-R">491.67</span>
                                <span class="tempc-res-symbol">°R</span>
                                <button class="tempc-btn-copy" data-target="tempc-out-R" title="Copy">📋</button>
                            </div>
                        </div>

                    </div>
                    
                    <!-- Formula Note -->
                    <div class="tempc-formula-box">
                        <div class="tempc-formula-title">💡 Công thức chuẩn:</div>
                        <code id="tempc-formula-text">°F = (°C × 9/5) + 32</code>
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>