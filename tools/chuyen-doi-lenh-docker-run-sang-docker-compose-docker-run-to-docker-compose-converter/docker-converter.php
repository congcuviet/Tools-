<div class="dock-soft-wrapper">
    <div class="dock-soft-header">
        <h2 id="dock-h1-title">🐳 Docker Run to Docker Compose</h2>
        <p id="dock-h1-desc">Chuyển đổi các câu lệnh CLI <code>docker run</code> phức tạp thành file <code>docker-compose.yml</code> chuẩn xác.</p>
    </div>

    <!-- 🚀 INLINE SCRIPT: Chống nhảy chữ -->
    <script>
        (function(){
            // Khu vực mở rộng cấu hình SEO
        })();
    </script>

    <div class="dock-body">
        
        <!-- BỐ CỤC 2 CỘT -->
        <div class="dock-main-layout">
            
            <!-- CỘT TRÁI (INPUT) -->
            <div class="dock-col dock-col-left">
                
                <div class="dock-card dock-bg-yellow">
                    <div class="dock-flex-between" style="margin-bottom: 10px;">
                        <span class="dock-section-title">📥 Nhập lệnh Docker Run</span>
                        <button id="dock-btn-clear" class="dock-btn-small">🧹 Xóa</button>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <textarea id="dock-input-cmd" class="dock-textarea" placeholder="Vd: docker run -d -p 8080:80 --name my-nginx nginx:latest" autofocus></textarea>
                    </div>

                    <div class="dock-quick-fills">
                        <span style="font-size: 0.85rem; font-weight: 900; color: #555;">⚡ Mẫu nhanh:</span>
                        <button class="dock-btn-chip" data-cmd="docker run -d -p 80:80 --name web_server --restart always nginx:alpine">Nginx</button>
                        <button class="dock-btn-chip" data-cmd="docker run -d --name mysql_db -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secret -v mysql_data:/var/lib/mysql mysql:8.0">MySQL</button>
                    </div>
                    
                    <button id="dock-btn-convert" class="dock-btn-action">🚀 CHUYỂN ĐỔI (CONVERT)</button>
                </div>

                <div class="dock-info-box">
                    <h4>💡 IT Note:</h4>
                    <p>Thuật toán tự động nhận diện các cờ phổ biến như <code>-p / --publish</code> (Ports), <code>-v / --volume</code> (Volumes), <code>-e / --env</code> (Environment), <code>--network</code>, v.v. Nó cũng xử lý trơn tru các câu lệnh có chứa dấu gạch chéo <code>\</code> để xuống dòng.</p>
                </div>

            </div>

            <!-- CỘT PHẢI (OUTPUT) -->
            <div class="dock-col dock-col-right">
                <div class="dock-card dock-bg-white">
                    <div class="dock-flex-between" style="border-bottom: 2px dashed #111; padding-bottom: 10px; margin-bottom: 15px;">
                        <span class="dock-section-title">📄 docker-compose.yml</span>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span class="dock-badge" id="dock-status-badge">Sẵn sàng</span>
                            <button class="dock-btn-copy" id="dock-btn-copy">📋 COPY MÃ YAML</button>
                        </div>
                    </div>
                    
                    <div style="position: relative; flex: 1; display: flex; flex-direction: column;">
                        <!-- Khung báo lỗi -->
                        <div class="dock-error-overlay" id="dock-error-box" style="display: none;">
                            <strong>⚠️ Lỗi Cú Pháp (Syntax Error):</strong>
                            <div id="dock-error-msg"></div>
                        </div>

                        <textarea id="dock-output-yaml" class="dock-textarea dock-textarea-output" readonly placeholder="Kết quả file docker-compose.yml sẽ hiển thị ở đây..."></textarea>
                    </div>
                </div>
            </div>

        </div> 
    </div>
</div>