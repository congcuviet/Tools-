document.addEventListener('DOMContentLoaded', async function() {
    const videoInput = document.getElementById('vflt-video-input');
    const videoName = document.getElementById('vflt-video-name');
    const iconVideo = document.getElementById('vflt-icon-video');
    
    const settingsBox = document.getElementById('vflt-settings');
    const previewSection = document.getElementById('vflt-preview-section');
    const videoPlayer = document.getElementById('vflt-player');
    const btnCompare = document.getElementById('vflt-btn-compare');
    
    // UI Cài Đặt
    const presetSelect = document.getElementById('vflt-preset-select');
    const brightSlider = document.getElementById('vflt-bright-slider');
    const contrastSlider = document.getElementById('vflt-contrast-slider');
    const satSlider = document.getElementById('vflt-sat-slider');
    const hueSlider = document.getElementById('vflt-hue-slider');
    
    const brightText = document.getElementById('vflt-bright-text');
    const contrastText = document.getElementById('vflt-contrast-text');
    const satText = document.getElementById('vflt-sat-text');
    const hueText = document.getElementById('vflt-hue-text');
    
    const btnReset = document.getElementById('vflt-btn-reset');
    const qualitySelect = document.getElementById('vflt-quality-select');

    const btnStart = document.getElementById('vflt-btn-start');
    const statusBox = document.getElementById('vflt-status-box');
    const statusText = document.getElementById('vflt-status-text');
    const detailText = document.getElementById('vflt-detail-text');
    const progressFill = document.getElementById('vflt-progress-fill');

    let videoFile = null;
    let ffmpeg = null;
    let videoDuration = 0;

    // --- CÔNG THỨC PRESETS ---
    // baseFilter: Dùng để phân biệt các filter đặc thù (trắng đen, sepia...)
    const presetRecipes = {
        'none': { b: 0, c: 0, s: 0, h: 0, base: 'none' },
        'cinematic': { b: -5, c: 25, s: -15, h: 0, base: 'none' },
        'vivid': { b: 5, c: 15, s: 40, h: 0, base: 'none' },
        'cyberpunk': { b: -10, c: 20, s: 60, h: 45, base: 'none' }, // Đẩy màu Hue 45 độ
        'vintage': { b: 10, c: -10, s: -20, h: 0, base: 'sepia' },
        'bw': { b: 0, c: 15, s: 0, h: 0, base: 'grayscale' },
        'negative': { b: 0, c: 0, s: 0, h: 0, base: 'negative' }
    };

    let currentBaseFilter = 'none';

    // --- CẬP NHẬT GIAO DIỆN PREVIEW ---
    function updatePreview() {
        let bVal = parseInt(brightSlider.value);
        let cVal = parseInt(contrastSlider.value);
        let sVal = parseInt(satSlider.value);
        let hVal = parseInt(hueSlider.value);

        // Hiển thị số liệu
        brightText.innerText = bVal > 0 ? `+${bVal}` : bVal;
        contrastText.innerText = cVal > 0 ? `+${cVal}` : cVal;
        satText.innerText = sVal > 0 ? `+${sVal}` : sVal;
        hueText.innerText = hVal;

        // Build chuỗi CSS Filter cho thẻ <video>
        let cssFilters = [];
        
        cssFilters.push(`brightness(${100 + bVal}%)`);
        cssFilters.push(`contrast(${100 + cVal}%)`);
        cssFilters.push(`saturate(${100 + sVal}%)`);
        if (hVal > 0) cssFilters.push(`hue-rotate(${hVal}deg)`);

        if (currentBaseFilter === 'grayscale') cssFilters.push(`grayscale(100%)`);
        if (currentBaseFilter === 'sepia') cssFilters.push(`sepia(100%)`);
        if (currentBaseFilter === 'negative') cssFilters.push(`invert(100%)`);

        videoPlayer.style.filter = cssFilters.join(' ');
    }

    // Khi chọn Preset từ Dropdown
    presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (presetRecipes[val]) {
            const recipe = presetRecipes[val];
            brightSlider.value = recipe.b;
            contrastSlider.value = recipe.c;
            satSlider.value = recipe.s;
            hueSlider.value = recipe.h;
            currentBaseFilter = recipe.base;
            updatePreview();
        }
    });

    // Khi người dùng kéo tay (Tự chỉnh)
    [brightSlider, contrastSlider, satSlider, hueSlider].forEach(el => {
        el.addEventListener('input', () => {
            presetSelect.value = 'custom'; // Chuyển sang chế độ Tùy chỉnh
            updatePreview();
        });
    });

    // Nút Reset
    btnReset.addEventListener('click', () => {
        presetSelect.value = 'none';
        currentBaseFilter = 'none';
        brightSlider.value = 0;
        contrastSlider.value = 0;
        satSlider.value = 0;
        hueSlider.value = 0;
        updatePreview();
    });

    // Tính năng so sánh giữ chuột
    btnCompare.addEventListener('mousedown', () => { videoPlayer.style.filter = 'none'; });
    btnCompare.addEventListener('mouseup', updatePreview);
    btnCompare.addEventListener('mouseleave', updatePreview);
    btnCompare.addEventListener('touchstart', (e) => { e.preventDefault(); videoPlayer.style.filter = 'none'; });
    btnCompare.addEventListener('touchend', (e) => { e.preventDefault(); updatePreview(); });

    // --- UPLOAD VIDEO ---
    videoInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            iconVideo.innerText = "✅";
            videoName.innerText = videoFile.name;
            document.getElementById('vflt-box-video').style.background = "var(--clr-slate)";
            
            videoPlayer.src = URL.createObjectURL(videoFile);
            videoPlayer.onloadedmetadata = () => {
                videoDuration = videoPlayer.duration;
                previewSection.style.display = 'block';
                settingsBox.style.display = 'block';
                btnStart.disabled = false;
                videoPlayer.play(); 
            };
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER ---
    btnStart.addEventListener('click', async () => {
        if (!videoFile) return;

        const bVal = parseInt(brightSlider.value);
        const cVal = parseInt(contrastSlider.value);
        const sVal = parseInt(satSlider.value);
        const hVal = parseInt(hueSlider.value);
        const quality = qualitySelect.value;
        
        videoPlayer.pause();
        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo thuật toán Wasm...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-emerald)"; 
        detailText.innerText = "";

        try {
            // HYBRID TRACKER CHUẨN ĐỂ FIX LỖI 100%
            let highestP = 0; 
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    logger: ({ message }) => {
                        console.log(message);
                        if (message.includes('time=')) {
                            const match = message.match(/time=\s*(\d{2}):(\d{2}):(\d+\.?\d*)/);
                            if (match && videoDuration > 0) {
                                const hTime = parseInt(match[1]);
                                const mTime = parseInt(match[2]);
                                const sTime = parseFloat(match[3]);
                                
                                const currentTime = (hTime * 3600) + (mTime * 60) + sTime;
                                let p = Math.round((currentTime / videoDuration) * 100);
                                
                                if (p > 100) p = 100;
                                if (p < 0) p = 0;
                                
                                if (p > highestP) {
                                    highestP = p;
                                    if (p > 2) {
                                        progressFill.style.width = `${p}%`;
                                        statusText.innerText = `Đang Áp Dụng Bộ Lọc Màu: ${p}%`;
                                    }
                                }
                            }
                        }
                    }
                });
                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp file vào bộ nhớ ảo...";
            const { fetchFile } = FFmpeg;
            
            const ext = videoFile.name.split('.').pop();
            const inputVid = `input.${ext}`;
            const outputName = `output.mp4`; 

            ffmpeg.FS('writeFile', inputVid, await fetchFile(videoFile));

            // THUẬT TOÁN FFMPEG COLOR GRADING ĐỈNH CAO
            let vfFilters = [];

            // 1. Áp dụng Base Filter (Nếu có)
            if (currentBaseFilter === 'grayscale') {
                vfFilters.push('colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3');
            } else if (currentBaseFilter === 'sepia') {
                vfFilters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
            } else if (currentBaseFilter === 'negative') {
                vfFilters.push('negate');
            }

            // 2. Cấu hình EQ (Sáng/Tương phản/Bão hòa)
            let eqB = bVal / 100; 
            let eqC = (100 + cVal) / 100;
            let eqS = (100 + sVal) / 100;
            
            vfFilters.push(`eq=brightness=${eqB}:contrast=${eqC}:saturation=${eqS}`);

            // 3. Xoay vòng màu (Hue Rotate)
            if (hVal > 0) {
                vfFilters.push(`hue=h=${hVal}`);
            }

            let filterComplex = vfFilters.join(',');

            let ffmpegArgs = [
                '-i', inputVid,
                '-vf', filterComplex,
                '-c:a', 'copy' // Copy âm thanh gốc
            ];

            // Tối ưu Encoder
            if (quality === 'high') {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '18');
            } else {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24');
            }
            
            // Cờ tối ưu chống treo 100% ảo
            ffmpegArgs.push('-movflags', '+faststart', outputName);

            statusText.innerText = `Bắt đầu thuật toán kết xuất khung hình...`;
            await ffmpeg.run(...ffmpegArgs);

            // XUẤT FILE
            progressFill.style.width = `100%`;
            statusText.innerText = "Hoàn tất! Đang đóng gói file MP4...";
            
            const data = ffmpeg.FS('readFile', outputName);
            if (data.length === 0) throw new Error("File xuất ra rỗng.");

            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;
            a.download = `${baseName}_color_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Tuyệt vời! Video chỉnh màu đã được xuất.`;
            detailText.innerText = "Kiểm tra thư mục tải xuống của bạn nhé!";

        } catch (error) {
            console.error("Lỗi Color Filter:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi render.";
            detailText.innerText = "Video gốc quá nặng khiến trình duyệt hết RAM, vui lòng thử lại với video ngắn hơn.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
        }
    });
});