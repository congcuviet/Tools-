document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('neo-dropzone');
    const fileInput = document.getElementById('neo-file-input');
    const previewImg = document.getElementById('neo-preview-img');
    const dropContent = document.querySelector('.neo-drop-content');
    
    const resultArea = document.getElementById('neo-result-area');
    const uriOutput = document.getElementById('neo-uri-output');
    const rawOutput = document.getElementById('neo-raw-output');
    const fileNameDisplay = document.getElementById('neo-file-name');
    const fileSizeDisplay = document.getElementById('neo-file-size');
    const btnReset = document.getElementById('neo-btn-reset');
    const copyBtns = document.querySelectorAll('.neo-btn-copy');

    // Hàm format dung lượng (Bytes to KB/MB)
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Hàm xử lý file ảnh
    function processFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Vui lòng chỉ chọn file hình ảnh (PNG, JPG, WEBP, SVG...)');
            return;
        }

        // Cảnh báo nếu file lớn hơn 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert('Lưu ý: File ảnh lớn hơn 2MB sẽ tạo ra chuỗi Base64 cực kỳ dài, có thể làm lag trình duyệt nếu nhúng trực tiếp vào CSS/HTML.');
        }

        const reader = new FileReader();
        
        reader.onload = function(e) {
            const dataUri = e.target.result;
            // Tách phần Raw Base64 (bỏ đoạn "data:image/png;base64,")
            const rawBase64 = dataUri.split(',')[1];
            
            // Tính toán dung lượng xấp xỉ của chuỗi Base64 (1 ký tự = 1 byte)
            const base64Size = formatBytes(dataUri.length);

            // Cập nhật giao diện
            fileNameDisplay.innerText = `Tên file: ${file.name}`;
            fileSizeDisplay.innerText = `Dung lượng Base64: ~${base64Size}`;
            uriOutput.value = dataUri;
            rawOutput.value = rawBase64;

            previewImg.src = dataUri;
            previewImg.style.display = 'block';
            dropContent.style.opacity = '0'; // Ẩn chữ đi để nhường chỗ cho ảnh
            
            resultArea.style.display = 'block';
            
            // Cuộn xuống khu vực kết quả
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };

        reader.readAsDataURL(file); // Bắt đầu đọc file sang Base64
    }

    // Sự kiện kéo thả
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            processFile(e.dataTransfer.files[0]);
        }
    });

    // Sự kiện click chọn file
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            processFile(e.target.files[0]);
        }
    });

    // Cài đặt nút Copy
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const textarea = document.getElementById(targetId);
            
            textarea.select();
            document.execCommand('copy'); // Dùng execCommand để tương thích trình duyệt tốt hơn
            
            // Hiệu ứng copy thành công
            const originalText = btn.innerText;
            btn.innerText = '✔️ Đã chép';
            btn.classList.add('copied');
            
            setTimeout(() => {
                btn.innerText = originalText;
                btn.classList.remove('copied');
            }, 2000);
        });
    });

    // Nút làm mới
    btnReset.addEventListener('click', () => {
        fileInput.value = '';
        uriOutput.value = '';
        rawOutput.value = '';
        previewImg.src = '';
        previewImg.style.display = 'none';
        dropContent.style.opacity = '1';
        resultArea.style.display = 'none';
    });
});