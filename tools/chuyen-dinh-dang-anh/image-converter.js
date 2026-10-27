document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('conv-file-input');
    
    const previewSection = document.getElementById('conv-preview-section');
    const previewGrid = document.getElementById('preview-grid');
    const fileCountText = document.getElementById('file-count');
    const btnClearAll = document.getElementById('btn-clear-all');
    
    const btnStartConvert = document.getElementById('btn-start-convert');
    const processStatus = document.getElementById('process-status');
    const statusText = document.getElementById('status-text');

    let selectedFiles = []; // Mảng chứa các file gốc
    const MAX_FILES = 30;

    // ---------------------------------------------------------
    // 1. XỬ LÝ SỰ KIỆN KÉO THẢ & CHỌN FILE
    // ---------------------------------------------------------
    
    // Click vào dropzone để mở hộp thoại chọn file
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = ''; // Reset input để chọn lại file cũ được
    });

    // Kéo thả
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
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        if (!files || files.length === 0) return;

        let newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        // Kiểm tra tổng số lượng file
        if (selectedFiles.length + newFiles.length > MAX_FILES) {
            alert(`Bạn chỉ được chọn tối đa ${MAX_FILES} ảnh cùng lúc!`);
            const allowedAmount = MAX_FILES - selectedFiles.length;
            newFiles = newFiles.slice(0, allowedAmount);
        }

        selectedFiles = selectedFiles.concat(newFiles);
        updatePreviewUI();
    }

    // ---------------------------------------------------------
    // 2. CẬP NHẬT GIAO DIỆN PREVIEW
    // ---------------------------------------------------------
    function updatePreviewUI() {
        if (selectedFiles.length === 0) {
            previewSection.style.display = 'none';
            return;
        }

        previewSection.style.display = 'block';
        fileCountText.innerText = selectedFiles.length;
        previewGrid.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            
            const thumbDiv = document.createElement('div');
            thumbDiv.className = 'thumb-item';
            thumbDiv.innerHTML = `
                <img src="${url}" alt="thumb">
                <button class="btn-remove-thumb" data-index="${index}">✕</button>
            `;
            previewGrid.appendChild(thumbDiv);
        });

        // Gắn sự kiện xóa cho từng ảnh nhỏ
        document.querySelectorAll('.btn-remove-thumb').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const idx = parseInt(this.getAttribute('data-index'));
                removeFile(idx);
            });
        });
    }

    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updatePreviewUI();
    }

    btnClearAll.addEventListener('click', () => {
        selectedFiles = [];
        updatePreviewUI();
    });

    // ---------------------------------------------------------
    // 3. LOGIC CHUYỂN ĐỔI & TẠO FILE ZIP
    // ---------------------------------------------------------
    
    // Hàm phụ: Load ảnh thành HTMLImageElement để vẽ lên canvas
    function loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(url); // Giải phóng bộ nhớ
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }

    btnStartConvert.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        // Lấy định dạng mong muốn
        const targetFormat = document.querySelector('input[name="target_format"]:checked').value;
        const extension = targetFormat.split('/')[1]; // VD: jpeg, png, webp

        // Khóa giao diện
        btnStartConvert.disabled = true;
        btnClearAll.style.pointerEvents = 'none';
        processStatus.style.display = 'flex';
        
        // Khởi tạo JSZip
        const zip = new JSZip();

        try {
            // Lặp qua từng file
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                statusText.innerText = `Đang xử lý: ${i + 1} / ${selectedFiles.length} ảnh...`;

                const img = await loadImage(file);
                
                // Tạo Canvas ảo
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // MẸO: Nếu chuyển sang JPEG (không hỗ trợ trong suốt), lấp nền trắng trước
                if (targetFormat === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                // Vẽ ảnh lên canvas
                ctx.drawImage(img, 0, 0);

                // Chuyển Canvas thành Blob
                const blob = await new Promise(resolve => canvas.toBlob(resolve, targetFormat, 0.92));

                // Đổi đuôi tên file gốc
                const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
                const newFileName = `${originalNameWithoutExt}_converted.${extension === 'jpeg' ? 'jpg' : extension}`;

                // Thêm vào Zip
                zip.file(newFileName, blob);
            }

            statusText.innerText = "Đang nén file ZIP...";

            // 4. Sinh file Zip và tự động tải xuống
            const zipBlob = await zip.generateAsync({ type: "blob" });
            
            const downloadUrl = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `Images_Converted_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(downloadUrl); // Giải phóng bộ nhớ

            // Hoàn thành
            statusText.innerText = "🎉 Hoàn tất! Đã tải file ZIP.";
            setTimeout(() => {
                processStatus.style.display = 'none';
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra trong quá trình chuyển đổi!");
            processStatus.style.display = 'none';
        } finally {
            // Mở khóa giao diện
            btnStartConvert.disabled = false;
            btnClearAll.style.pointerEvents = 'auto';
        }
    });
});