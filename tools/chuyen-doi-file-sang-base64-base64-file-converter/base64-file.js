document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const dropzone = document.getElementById('b64f-dropzone');
    const btnSelect = document.getElementById('b64f-btn-select');
    const fileInput = document.getElementById('b64f-file-input');
    
    const fileInfoBox = document.getElementById('b64f-file-info');
    const fileNameEl = document.getElementById('b64f-filename');
    const fileSizeEl = document.getElementById('b64f-filesize');
    const fileTypeEl = document.getElementById('b64f-filetype');
    const warningMsg = document.getElementById('b64f-warning-msg');
    
    const statusBadge = document.getElementById('b64f-status-badge');
    const emptyState = document.getElementById('b64f-empty-state');
    const loadingUI = document.getElementById('b64f-loading');
    const resultArea = document.getElementById('b64f-result-area');
    
    const outURI = document.getElementById('b64f-out-uri');
    const outRaw = document.getElementById('b64f-out-raw');
    
    const copyBtns = document.querySelectorAll('button[data-target]');

    // --- CÁC HÀM HỖ TRỢ ---
    
    // Chuyển đổi dung lượng (Bytes -> KB/MB)
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // --- HÀM XỬ LÝ ĐỌC FILE (CORE) ---
    function handleFile(file) {
        // Cập nhật thông tin file lên UI
        fileNameEl.innerText = file.name;
        fileSizeEl.innerText = formatBytes(file.size);
        fileTypeEl.innerText = file.type || 'unknown/binary';
        fileInfoBox.style.display = 'flex';

        // Cảnh báo nếu file lớn hơn 5MB (Base64 sẽ cực to, có thể làm lag textarea)
        if (file.size > 5 * 1024 * 1024) {
            warningMsg.style.display = 'block';
        } else {
            warningMsg.style.display = 'none';
        }

        // Đổi trạng thái sang Loading
        emptyState.style.display = 'none';
        resultArea.style.display = 'none';
        loadingUI.style.display = 'flex';
        
        statusBadge.innerText = "Đang xử lý...";
        statusBadge.className = "b64f-badge";

        // Bắt đầu đọc file bằng FileReader API (Hoàn toàn Offline)
        const reader = new FileReader();

        reader.onload = function(e) {
            // Kết quả trả về có dạng: data:image/png;base64,iVBORw0KGgo...
            const fullResult = e.target.result;
            
            // Bóc tách chuỗi
            const parts = fullResult.split(',');
            const uriScheme = parts[0] + ','; // Ví dụ: data:image/png;base64,
            const rawBase64 = parts[1];       // Chuỗi base64 thuần túy

            // Cập nhật lên Textarea
            outURI.value = fullResult;
            outRaw.value = rawBase64;

            // Đổi UI sang trạng thái Hoàn thành
            loadingUI.style.display = 'none';
            resultArea.style.display = 'flex';
            
            statusBadge.innerText = "✅ Đã mã hóa";
            statusBadge.className = "b64f-badge b64f-badge-success";
        };

        reader.onerror = function() {
            loadingUI.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerText = "❌ Đã xảy ra lỗi khi đọc file!";
            emptyState.style.color = "var(--clr-red)";
            statusBadge.innerText = "Lỗi đọc file";
        };

        // Kích hoạt việc đọc
        reader.readAsDataURL(file);
    }

    // --- LẮNG NGHE SỰ KIỆN DRAG & DROP ---
    btnSelect.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) handleFile(this.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    // --- SỰ KIỆN COPY ---
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const targetId = btn.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            
            if (!targetInput.value) return;

            try {
                await navigator.clipboard.writeText(targetInput.value);
                const originalText = btn.innerText;
                const originalBg = btn.style.background;
                const originalColor = btn.style.color;
                
                btn.innerText = '✅ ĐÃ COPY VÀO BỘ NHỚ TẠM';
                btn.style.background = 'var(--clr-green)';
                btn.style.color = '#111';
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = originalBg;
                    btn.style.color = originalColor;
                }, 2000);
            } catch (err) {
                alert("Lỗi sao chép!");
            }
        });
    });

});