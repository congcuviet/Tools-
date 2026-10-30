document.addEventListener('DOMContentLoaded', function() {
    const uploadSection = document.getElementById('upload-section');
    const editorSection = document.getElementById('editor-section');
    const svgInput = document.getElementById('svg-upload-input');
    
    const previewOriginal = document.getElementById('preview-original');
    const previewConverted = document.getElementById('preview-converted');
    
    const btnConvert = document.getElementById('btn-convert');
    const btnDownload = document.getElementById('btn-download');
    const btnChangeImg = document.getElementById('btn-change-img');

    let originalSvgContent = "";

    // 1. Tải file SVG
    svgInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            originalSvgContent = event.target.result;
            previewOriginal.innerHTML = originalSvgContent;
            uploadSection.style.display = 'none';
            editorSection.style.display = 'block';
            btnDownload.style.display = 'none';
        };
        reader.readAsText(file);
    });

    // 2. Chuyển đổi (Dùng Paper.js)
    btnConvert.addEventListener('click', function() {
        // Khởi tạo Paper.js project trên canvas ẩn
        const canvas = document.createElement('canvas');
        paper.setup(canvas);

        // Import SVG
        paper.project.importSVG(originalSvgContent, function(item) {
            // Duyệt qua tất cả các item trong file
            item.getItems({ class: paper.Path }).forEach(path => {
                if (path.strokeWidth > 0 && path.strokeColor) {
                    // Phép màu nằm ở đây: biến Stroke thành Outline Path
                    const outline = path.toPathItem();
                    outline.fillColor = path.strokeColor;
                    outline.strokeColor = null;
                    path.replaceWith(outline);
                }
            });

            // Export ra SVG String
            const resultSvg = item.exportSVG({ asString: true });
            previewConverted.innerHTML = resultSvg;
            
            // Tạo file tải về
            const blob = new Blob([resultSvg], {type: "image/svg+xml"});
            btnDownload.href = URL.createObjectURL(blob);
            btnDownload.style.display = 'block';
            
            // Dọn dẹp
            paper.project.clear();
        });
    });

    btnChangeImg.addEventListener('click', () => {
        svgInput.click();
    });
});