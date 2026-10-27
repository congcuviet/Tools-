document.addEventListener('DOMContentLoaded', function() {
    const uploadSection = document.getElementById('upload-section');
    const editorSection = document.getElementById('editor-section');
    const imageInput = document.getElementById('filter-image-input');
    
    const canvas = document.getElementById('filter-canvas');
    const ctx = canvas.getContext('2d');
    
    // Sliders
    const rangeBrightness = document.getElementById('range-brightness');
    const rangeContrast = document.getElementById('range-contrast');
    const rangeSaturate = document.getElementById('range-saturate');
    const rangeHue = document.getElementById('range-hue');
    const rangeBlur = document.getElementById('range-blur');

    // Val labels
    const valBrightness = document.getElementById('val-brightness');
    const valContrast = document.getElementById('val-contrast');
    const valSaturate = document.getElementById('val-saturate');
    const valHue = document.getElementById('val-hue');
    const valBlur = document.getElementById('val-blur');

    // Buttons
    const presetBtns = document.querySelectorAll('.preset-btn');
    const btnCompare = document.getElementById('btn-compare');
    const btnReset = document.getElementById('btn-reset');
    const btnChangeImg = document.getElementById('btn-change-img');
    const btnDownload = document.getElementById('btn-download');

    let originalImage = new Image();
    let originalFileName = "filtered-image";

    // Giá trị slider mặc định
    const DEFAULT_SETTINGS = {
        brightness: 100,
        contrast: 100,
        saturate: 100,
        hue: 0,
        blur: 0
    };

    let currentSettings = { ...DEFAULT_SETTINGS };

    // Cấu hình các bộ lọc mẫu (Presets)
    const PRESETS = {
        normal: { brightness: 100, contrast: 100, saturate: 100, hue: 0, blur: 0 },
        vintage: { brightness: 110, contrast: 85, saturate: 75, hue: 15, blur: 0 },
        bw: { brightness: 100, contrast: 120, saturate: 0, hue: 0, blur: 0 },
        sepia: { brightness: 90, contrast: 95, saturate: 60, hue: 35, blur: 0 },
        cold: { brightness: 105, contrast: 110, saturate: 110, hue: 190, blur: 0 },
        warm: { brightness: 110, contrast: 105, saturate: 120, hue: 345, blur: 0 },
        invert: { brightness: 100, contrast: 100, saturate: 100, hue: 180, blur: 0 } // Dùng Hue 180 độ để tạo hiệu ứng đảo màu ảo
    };

    // 1. Tải ảnh lên
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        originalFileName = file.name.split('.')[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            originalImage.onload = function() {
                // Set kích thước canvas bằng ảnh gốc để không mất chất lượng
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;

                uploadSection.style.display = 'none';
                editorSection.style.display = 'flex';

                resetFilters();
            };
            originalImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 2. Hàm vẽ ảnh lên Canvas với Filter CSS Context
    function applyFiltersToCanvas(isCompareOriginal = false) {
        if (!originalImage.src) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isCompareOriginal) {
            ctx.filter = 'none'; // Vẽ ảnh gốc không qua lọc
        } else {
            // Sử dụng thuộc tính ctx.filter mạnh mẽ của HTML5 Canvas
            ctx.filter = `
                brightness(${currentSettings.brightness}%)
                contrast(${currentSettings.contrast}%)
                saturate(${currentSettings.saturate}%)
                hue-rotate(${currentSettings.hue}deg)
                blur(${currentSettings.blur}px)
            `.trim();
        }

        ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

        // Cập nhật link tải
        if (!isCompareOriginal) {
            btnDownload.href = canvas.toDataURL('image/png');
            btnDownload.download = `${originalFileName}_filtered.png`;
        }
    }

    // 3. Cập nhật giao diện thanh trượt & số hiển thị
    function updateUIValues() {
        rangeBrightness.value = currentSettings.brightness;
        valBrightness.innerText = `${currentSettings.brightness}%`;

        rangeContrast.value = currentSettings.contrast;
        valContrast.innerText = `${currentSettings.contrast}%`;

        rangeSaturate.value = currentSettings.saturate;
        valSaturate.innerText = `${currentSettings.saturate}%`;

        rangeHue.value = currentSettings.hue;
        valHue.innerText = `${currentSettings.hue}°`;

        rangeBlur.value = currentSettings.blur;
        valBlur.innerText = `${currentSettings.blur}px`;
    }

    // Lắng nghe sự kiện trượt thanh Slider
    function onSliderChange() {
        currentSettings.brightness = rangeBrightness.value;
        currentSettings.contrast = rangeContrast.value;
        currentSettings.saturate = rangeSaturate.value;
        currentSettings.hue = rangeHue.value;
        currentSettings.blur = rangeBlur.value;

        updateUIValues();
        applyFiltersToCanvas();

        // Bỏ active của preset vì đã chỉnh tay
        presetBtns.forEach(b => b.classList.remove('active'));
    }

    [rangeBrightness, rangeContrast, rangeSaturate, rangeHue, rangeBlur].forEach(slider => {
        slider.addEventListener('input', onSliderChange);
    });

    // 4. Áp dụng Presets (Đã Fix lỗi gọi nhầm biến)
    presetBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            presetBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const presetKey = this.getAttribute('data-preset');
            
            // Fix lỗi ở đây: gọi PRESETS có chữ "S"
            currentSettings = { ...(PRESETS[presetKey] || DEFAULT_SETTINGS) };

            updateUIValues();
            applyFiltersToCanvas();
        });
    });

    // 5. Nút Reset
    function resetFilters() {
        currentSettings = { ...DEFAULT_SETTINGS };
        presetBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-preset="normal"]').classList.add('active');

        updateUIValues();
        applyFiltersToCanvas();
    }
    btnReset.addEventListener('click', resetFilters);

    // 6. Tính năng So sánh (Nhấn giữ để thấy Ảnh gốc)
    btnCompare.addEventListener('mousedown', () => applyFiltersToCanvas(true));
    btnCompare.addEventListener('mouseup', () => applyFiltersToCanvas(false));
    btnCompare.addEventListener('mouseleave', () => applyFiltersToCanvas(false));
    
    // Hỗ trợ cảm ứng trên điện thoại
    btnCompare.addEventListener('touchstart', (e) => { e.preventDefault(); applyFiltersToCanvas(true); });
    btnCompare.addEventListener('touchend', (e) => { e.preventDefault(); applyFiltersToCanvas(false); });

    // 7. Đổi ảnh khác
    btnChangeImg.addEventListener('click', () => {
        imageInput.click();
    });
});