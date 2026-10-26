document.addEventListener('DOMContentLoaded', function() {
    // Các khu vực giao diện
    const uploadSection = document.getElementById('upload-section');
    const editorSection = document.getElementById('editor-section');
    const resultSection = document.getElementById('result-section');
    
    // Nút và Input
    const imageInput = document.getElementById('image-upload-input');
    const btnChangeImage = document.getElementById('btn-change-image');
    const imageToCrop = document.getElementById('image-to-crop');
    const btnDoCrop = document.getElementById('btn-do-crop');
    
    // Kết quả
    const croppedPreview = document.getElementById('cropped-preview');
    const btnDownload = document.getElementById('btn-download');
    const btnBackEdit = document.getElementById('btn-back-edit');

    // Các nút điều khiển
    const ratioBtns = document.querySelectorAll('.ratio-btn');
    const btnRotateLeft = document.getElementById('btn-rotate-left');
    const btnRotateRight = document.getElementById('btn-rotate-right');
    const btnReset = document.getElementById('btn-reset');

    let cropper = null;
    let originalFileName = "image";

    // 1. Xử lý khi tải ảnh lên
    function handleImageUpload(event) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            
            // Lưu lại tên file gốc để khi tải xuống giữ nguyên tên (thêm hậu tố)
            originalFileName = file.name.split('.')[0];
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Đưa ảnh vào thẻ img
                imageToCrop.src = e.target.result;
                
                // Chuyển đổi giao diện
                uploadSection.style.display = 'none';
                resultSection.style.display = 'none';
                editorSection.style.display = 'flex';
                
                // Khởi tạo thư viện Cropper.js
                initCropper();
            };
            reader.readAsDataURL(file);
        }
    }

    imageInput.addEventListener('change', handleImageUpload);

    // Xử lý nút Đổi ảnh (nằm trong phần edit)
    btnChangeImage.addEventListener('click', () => {
        imageInput.click(); 
    });

    // 2. Khởi tạo & Cấu hình Cropper
    function initCropper() {
        // Nếu đã có cropper trước đó thì huỷ đi để tạo mới
        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(imageToCrop, {
            viewMode: 1, // Restrict the crop box to not exceed the size of the canvas.
            dragMode: 'move', // Cho phép kéo cả bức ảnh
            aspectRatio: NaN, // Mặc định là cắt tự do
            autoCropArea: 0.9, // Vùng cắt chiếm 90% ban đầu
            restore: false,
            guides: true, // Hiện lưới toạ độ
            center: true,
            highlight: false,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
        });

        // Reset lại nút Tỷ lệ về "Tự do"
        ratioBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-ratio="NaN"]').classList.add('active');
    }

    // 3. Xử lý các nút Công cụ (Tỷ lệ, Xoay)
    ratioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!cropper) return;
            
            // Update UI
            ratioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Set tỷ lệ cho Cropper
            const ratioValue = parseFloat(this.getAttribute('data-ratio'));
            cropper.setAspectRatio(ratioValue);
        });
    });

    btnRotateLeft.addEventListener('click', () => {
        if (cropper) cropper.rotate(-90);
    });

    btnRotateRight.addEventListener('click', () => {
        if (cropper) cropper.rotate(90);
    });

    btnReset.addEventListener('click', () => {
        if (cropper) cropper.reset();
    });

    // 4. Xử lý Cắt ảnh
    btnDoCrop.addEventListener('click', () => {
        if (!cropper) return;

        // Lấy canvas sau khi cắt (Xuất ra chất lượng cao)
        const canvas = cropper.getCroppedCanvas({
            imageSmoothingEnabled: true,
            imageSmoothingQuality: 'high',
        });

        if (canvas) {
            // Chuyển canvas thành URL ảnh Base64
            const croppedDataUrl = canvas.toDataURL('image/png');
            
            // Hiển thị ảnh kết quả
            croppedPreview.src = croppedDataUrl;
            
            // Gắn link cho nút Tải xuống
            btnDownload.href = croppedDataUrl;
            btnDownload.download = `${originalFileName}_cropped.png`;
            
            // Chuyển giao diện sang màn Kết quả
            editorSection.style.display = 'none';
            resultSection.style.display = 'block';
        }
    });

    // 5. Nút Quay lại chỉnh sửa (nếu cắt chưa ưng ý)
    btnBackEdit.addEventListener('click', () => {
        resultSection.style.display = 'none';
        editorSection.style.display = 'flex';
    });
});