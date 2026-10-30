document.addEventListener('DOMContentLoaded', async function() {
    const fileInput = document.getElementById('v2g-file-input');
    const fileNameTxt = document.getElementById('v2g-file-name');
    const fileSizeTxt = document.getElementById('v2g-file-size');
    const iconFile = document.getElementById('v2g-icon-video');
    
    const settingsBox = document.getElementById('v2g-settings');
    const previewSection = document.getElementById('v2g-preview-section');
    const videoPlayer = document.getElementById('v2g-player');
    const modeSelect = document.getElementById('v2g-mode-select');
    
    const trimSettings = document.getElementById('v2g-trim-settings');
    const sliderStart = document.getElementById('v2g-trim-start');
    const numStart = document.getElementById('v2g-num-start');
    const sliderEnd = document.getElementById('v2g-trim-end');
    const numEnd = document.getElementById('v2g-num-end');

    const gifSettings = document.getElementById('v2g-gif-settings');
    const vidSettings = document.getElementById('v2g-vid-settings');
    const fpsSelect = document.getElementById('v2g-fps-select');
    const scaleSelect = document.getElementById('v2g-scale-select');

    const btnStart = document.getElementById('v2g-btn-start');
    const statusBox = document.getElementById('v2g-status-box');
    const statusText = document.getElementById('v2g-status-text');
    const detailText = document.getElementById('v2g-detail-text');
    const progressFill = document.getElementById('v2g-progress-fill');

    let currentFile = null;
    let videoDuration = 0;
    let ffmpeg = null;
    let isVideoMode = true;

    // --- ĐỒNG BỘ SLIDER CẮT & TUA VIDEO ---
    function syncTrimInputs() {
        let start = parseFloat(sliderStart.value);
        let end = parseFloat(sliderEnd.value);
        
        if (start >= end) start = end - 0.5;
        if (start < 0) start = 0;
        
        sliderStart.value = start;
        numStart.value = start.toFixed(1);
        sliderEnd.value = end;
        numEnd.value = end.toFixed(1);
    }

    sliderStart.addEventListener('input', (e) => {
        syncTrimInputs();
        if (isVideoMode) videoPlayer.currentTime = parseFloat(e.target.value);
    });
    numStart.addEventListener('input', (e) => {
        sliderStart.value = e.target.value;
        syncTrimInputs();
        if (isVideoMode) videoPlayer.currentTime = parseFloat(e.target.value);
    });

    sliderEnd.addEventListener('input', (e) => {
        syncTrimInputs();
        if (isVideoMode) videoPlayer.currentTime = parseFloat(e.target.value);
    });
    numEnd.addEventListener('input', (e) => {
        sliderEnd.value = e.target.value;
        syncTrimInputs();
        if (isVideoMode) videoPlayer.currentTime = parseFloat(e.target.value);
    });

    // --- UX UI SWITCHER ---
    function toggleSettingsByMode(mode) {
        if (mode === 'vid2gif') {
            gifSettings.style.display = 'block';
            vidSettings.style.display = 'none';
            if (isVideoMode) {
                trimSettings.style.display = 'block';
                previewSection.style.display = 'block';
            }
        } else {
            gifSettings.style.display = 'none';
            vidSettings.style.display = 'block';
            trimSettings.style.display = 'none';
            previewSection.style.display = 'none';
        }
    }

    modeSelect.addEventListener('change', (e) => toggleSettingsByMode(e.target.value));

    // --- UPLOAD & AUTO-DETECT FILE ---
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            currentFile = e.target.files[0];
            iconFile.innerText = "✅";
            fileNameTxt.innerText = currentFile.name;
            
            let sizeMB = (currentFile.size / (1024 * 1024)).toFixed(2);
            fileSizeTxt.innerText = `${sizeMB} MB`;
            fileSizeTxt.style.display = "inline-block";

            // Nhận diện File
            if (currentFile.type === 'image/gif') {
                isVideoMode = false;
                modeSelect.value = 'gif2vid';
                toggleSettingsByMode('gif2vid');
                settingsBox.style.display = 'block';
                btnStart.disabled = false;
            } else {
                isVideoMode = true;
                modeSelect.value = 'vid2gif';
                
                // Nạp video để lấy Timeline
                videoPlayer.src = URL.createObjectURL(currentFile);
                videoPlayer.onloadedmetadata = () => {
                    videoDuration = videoPlayer.duration;
                    sliderStart.max = videoDuration;
                    sliderEnd.max = videoDuration;
                    
                    // Tự động gợi ý cắt 10 giây đầu
                    let defaultEnd = videoDuration > 10 ? 10 : videoDuration;
                    sliderEnd.value = defaultEnd;
                    numEnd.value = defaultEnd.toFixed(1);
                    
                    toggleSettingsByMode('vid2gif');
                    settingsBox.style.display = 'block';
                    btnStart.disabled = false;
                };
            }
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER ---
    btnStart.addEventListener('click', async () => {
        if (!currentFile) return;

        const mode = modeSelect.value;
        const targetFPS = fpsSelect.value;
        const targetScale = scaleSelect.value;
        
        let tStart = parseFloat(sliderStart.value);
        let tEnd = parseFloat(sliderEnd.value);
        let duration = tEnd - tStart;

        if (isVideoMode) videoPlayer.pause();
        
        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo lõi FFmpeg Wasm...";
        progressFill.style.width = `2%`;
        progressFill.style.background = (mode === 'vid2gif') ? "var(--clr-violet)" : "var(--clr-mint)"; 
        detailText.innerText = "";

        try {
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    log: true 
                });
                
                // TRACKING PROGRESS CHUẨN
                ffmpeg.setProgress(({ ratio }) => {
                    let p = Math.round(ratio * 100);
                    if (p < 0) p = 0;
                    if (p > 100) p = 100;
                    if (p > 2) {
                        progressFill.style.width = `${p}%`;
                        statusText.innerText = `Đang Xử Lý: ${p}%`;
                    }
                    detailText.innerText = `Hệ thống đang render đồ họa. Vui lòng không đóng tab!`;
                });

                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp dữ liệu vào bộ nhớ ảo...";
            const { fetchFile } = FFmpeg;

            const ext = currentFile.name.split('.').pop();
            const inputName = `input.${ext}`;
            let outputName = "";
            let ffmpegArgs = [];

            ffmpeg.FS('writeFile', inputName, await fetchFile(currentFile));

            if (mode === 'vid2gif') {
                outputName = `output.gif`;
                statusText.innerText = `Đang trích xuất và tối ưu ${duration.toFixed(1)} giây sang GIF...`;
                
                let scaleStr = targetScale === "-1" ? "-1:-1" : `${targetScale}:-1`;
                
                // Thuật toán: -ss cắt siêu tốc trước input, -t ấn định thời gian xuất
                ffmpegArgs = [
                    '-ss', tStart.toString(),
                    '-t', duration.toString(),
                    '-i', inputName,
                    '-vf', `fps=${targetFPS},scale=${scaleStr}:flags=lanczos`,
                    '-c:v', 'gif',
                    outputName
                ];
            } else {
                outputName = `output.mp4`;
                statusText.innerText = `Đang mã hóa GIF chuẩn H.264...`;

                ffmpegArgs = [
                    '-i', inputName,
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
                    outputName
                ];
            }

            await ffmpeg.run(...ffmpegArgs);

            progressFill.style.width = `100%`;
            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            
            const data = ffmpeg.FS('readFile', outputName);
            if (data.length === 0) throw new Error("File xuất ra rỗng.");

            const mimeType = (mode === 'vid2gif') ? 'image/gif' : 'video/mp4';
            const blob = new Blob([data.buffer], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.'));
            if (!baseName) baseName = currentFile.name;
            
            const targetExt = (mode === 'vid2gif') ? 'gif' : 'mp4';
            a.download = `${baseName}_congcuviet.${targetExt}`;
            a.click();
            URL.revokeObjectURL(url);

            ffmpeg.FS('unlink', inputName);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Tuyệt vời! File ${targetExt.toUpperCase()} đã tải xuống thành công.`;
            detailText.innerText = "Quá trình hoàn tất 100% Offline trên thiết bị của bạn.";

        } catch (error) {
            console.error("Lỗi Convert:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi render.";
            detailText.innerText = "Vui lòng tải lại trang hoặc nhấn F12 để xem mã lỗi chi tiết.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
        }
    });
});