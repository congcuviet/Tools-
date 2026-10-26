document.addEventListener('DOMContentLoaded', function() {
    const uploadSection = document.getElementById('upload-section');
    const editorSection = document.getElementById('editor-section');
    const imageInput = document.getElementById('censor-image-input');
    
    // Canvas chính để user vẽ lên và tải về
    const canvas = document.getElementById('censor-canvas');
    const ctx = canvas.getContext('2d');
    
    // Canvas ảo ẩn ở hậu trường để chứa các dữ liệu (Ảnh gốc, Ảnh làm mờ, Ảnh Pixel)
    const originalCanvas = document.createElement('canvas');
    const blurCanvas = document.createElement('canvas');
    const pixelCanvas = document.createElement('canvas');

    // Nút điều khiển
    const styleBtns = document.querySelectorAll('.style-btn');
    const rangeBrush = document.getElementById('range-brush');
    const valBrush = document.getElementById('val-brush');
    const btnUndo = document.getElementById('btn-undo');
    const btnReset = document.getElementById('btn-reset');
    const btnChangeImg = document.getElementById('btn-change-img');
    const btnDownload = document.getElementById('btn-download');

    // State Variables
    let originalFileName = "censored-image";
    let currentStyle = 'blur';
    let brushSize = parseInt(rangeBrush.value);
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Danh sách Emoji ngẫu nhiên để gắn
    const emojis = ['🤡', '😎', '😂', '👽', '🙈', '😡', '💩', '🥸', '🎃', '🤐'];

    // Lịch sử (Dùng để Undo)
    let historyStack = [];

    // ---------------------------------------------------------
    // 1. XỬ LÝ ẢNH & KHỞI TẠO CÁC LỚP CANVAS ẢO
    // ---------------------------------------------------------
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name.split('.')[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Đặt kích thước thật của ảnh cho Canvas
                const w = img.width;
                const h = img.height;
                
                canvas.width = w; canvas.height = h;
                originalCanvas.width = w; originalCanvas.height = h;
                blurCanvas.width = w; blurCanvas.height = h;
                pixelCanvas.width = w; pixelCanvas.height = h;

                // 1. Vẽ ảnh gốc vào main canvas
                ctx.drawImage(img, 0, 0, w, h);
                originalCanvas.getContext('2d').drawImage(img, 0, 0, w, h);

                // 2. Chuẩn bị lớp Blur ảo
                const bCtx = blurCanvas.getContext('2d');
                bCtx.filter = 'blur(15px)'; // Độ mờ mặc định
                bCtx.drawImage(img, 0, 0, w, h);

                // 3. Chuẩn bị lớp Pixel ảo
                const pCtx = pixelCanvas.getContext('2d');
                const scale = 0.03; // Càng nhỏ ô pixel càng bự
                pCtx.imageSmoothingEnabled = false; // Tắt làm mịn để tạo hột pixel
                // Vẽ thu nhỏ xíu
                pCtx.drawImage(img, 0, 0, w * scale, h * scale);
                // Kéo giãn ra lại kích thước cũ
                pCtx.drawImage(pixelCanvas, 0, 0, w * scale, h * scale, 0, 0, w, h);

                // Lưu trạng thái đầu tiên cho Undo
                saveHistory();

                uploadSection.style.display = 'none';
                editorSection.style.display = 'flex';
                updateDownloadLink();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // ---------------------------------------------------------
    // 2. LOGIC VẼ VÀ LÀM MỜ LÊN CANVAS CHÍNH
    // ---------------------------------------------------------

    // Lấy tọa độ chuột chính xác dựa theo scale của canvas trên màn hình
    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        // Tính tỷ lệ giữa kích thước thật của ảnh và kích thước hiển thị trên màn hình
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX = e.clientX;
        let clientY = e.clientY;

        // Xử lý touch trên điện thoại
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // Hàm áp dụng Style che mặt (Cắt dán lớp ảo lên lớp chính tại tọa độ chuột)
    function applyBrush(cx, cy) {
        if (currentStyle === 'emoji') return; // Emoji xử lý riêng theo click

        ctx.save();
        ctx.beginPath();
        // Cọ vẽ hình tròn
        ctx.arc(cx, cy, brushSize, 0, Math.PI * 2);
        ctx.clip();

        if (currentStyle === 'blur') {
            ctx.drawImage(blurCanvas, 0, 0);
        } else if (currentStyle === 'pixel') {
            ctx.drawImage(pixelCanvas, 0, 0);
        } else if (currentStyle === 'black') {
            ctx.fillStyle = '#111';
            ctx.fill();
        }
        ctx.restore();
    }

    // Thuật toán nội suy: lấp đầy khoảng trống khi chuột di chuyển quá nhanh
    function interpolateDraw(x1, y1, x2, y2) {
        const distance = Math.hypot(x2 - x1, y2 - y1);
        const steps = Math.max(1, distance / (brushSize / 4));
        for (let i = 0; i <= steps; i++) {
            const currentX = x1 + (x2 - x1) * (i / steps);
            const currentY = y1 + (y2 - y1) * (i / steps);
            applyBrush(currentX, currentY);
        }
    }

    // --- SỰ KIỆN CHUỘT / CẢM ỨNG ---
    function startDrawing(e) {
        e.preventDefault();
        isDrawing = true;
        saveHistory(); // Lưu state trước khi vẽ nét mới

        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;

        if (currentStyle === 'emoji') {
            // Nếu là emoji, chỉ in 1 cái tại chỗ click
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            ctx.font = `${brushSize * 2.5}px Arial`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(randomEmoji, lastX, lastY);
        } else {
            applyBrush(lastX, lastY);
        }
    }

    function draw(e) {
        if (!isDrawing || currentStyle === 'emoji') return;
        e.preventDefault();

        const coords = getCoordinates(e);
        interpolateDraw(lastX, lastY, coords.x, coords.y);
        
        lastX = coords.x;
        lastY = coords.y;
    }

    function stopDrawing() {
        if (isDrawing) {
            isDrawing = false;
            updateDownloadLink();
        }
    }

    // Bắt sự kiện PC
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Bắt sự kiện Mobile
    canvas.addEventListener('touchstart', startDrawing, {passive: false});
    canvas.addEventListener('touchmove', draw, {passive: false});
    canvas.addEventListener('touchend', stopDrawing);

    // ---------------------------------------------------------
    // 3. UI CONTROLS (NÚT BẤM & THANH TRƯỢT)
    // ---------------------------------------------------------
    styleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            styleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentStyle = this.getAttribute('data-style');
        });
    });

    rangeBrush.addEventListener('input', function() {
        brushSize = parseInt(this.value);
        valBrush.innerText = `${brushSize}px`;
    });

    // ---------------------------------------------------------
    // 4. LỊCH SỬ UNDO & XUẤT ẢNH
    // ---------------------------------------------------------
    function saveHistory() {
        // Chỉ lưu tối đa 10 thao tác gần nhất để tránh nặng ram máy
        if (historyStack.length > 10) historyStack.shift();
        historyStack.push(canvas.toDataURL('image/png'));
    }

    btnUndo.addEventListener('click', () => {
        if (historyStack.length > 0) {
            const previousState = historyStack.pop();
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                updateDownloadLink();
            };
            img.src = previousState;
        }
    });

    btnReset.addEventListener('click', () => {
        if (!confirm("Bạn có chắc muốn xóa mọi hiệu ứng che mặt và làm lại từ đầu?")) return;
        saveHistory();
        ctx.drawImage(originalCanvas, 0, 0); // Vẽ lại ảnh gốc chưa chỉnh sửa
        updateDownloadLink();
    });

    function updateDownloadLink() {
        btnDownload.href = canvas.toDataURL('image/png', 0.95);
        btnDownload.download = `${originalFileName}_censored.png`;
    }

    btnChangeImg.addEventListener('click', () => {
        imageInput.click();
    });
});