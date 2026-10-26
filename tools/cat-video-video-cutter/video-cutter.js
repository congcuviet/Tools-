document.addEventListener('DOMContentLoaded', async function() {
    const fileInput = document.getElementById('vcut-file-input');
    const filenameDisplay = document.getElementById('vcut-filename');
    const playerBox = document.getElementById('vcut-player-box');
    const videoPlayer = document.getElementById('vcut-player');
    
    const inputStart = document.getElementById('vcut-time-start');
    const inputEnd = document.getElementById('vcut-time-end');
    const btnGetStart = document.getElementById('vcut-btn-get-start');
    const btnGetEnd = document.getElementById('vcut-btn-get-end');
    
    const btnCut = document.getElementById('vcut-btn-cut');
    
    const statusBox = document.getElementById('vcut-status-box');
    const statusText = document.getElementById('vcut-status-text');
    const progressFill = document.getElementById('vcut-progress-fill');

    let videoFile = null;
    let ffmpeg = null;

    // 1. Lắng nghe chọn file & nạp vào Video Player
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            filenameDisplay.innerText = videoFile.name;
            
            const fileURL = URL.createObjectURL(videoFile);
            videoPlayer.src = fileURL;
            playerBox.style.display = 'block';

            // Khi video load xong meta, tự động set mốc End bằng độ dài video
            videoPlayer.onloadedmetadata = () => {
                inputStart.value = 0;
                inputEnd.value = videoPlayer.duration.toFixed(1);
            };
        }
    });

    // 2. Lấy mốc thời gian từ video
    btnGetStart.addEventListener('click', () => {
        inputStart.value = videoPlayer.currentTime.toFixed(1);
    });
    btnGetEnd.addEventListener('click', () => {
        inputEnd.value = videoPlayer.currentTime.toFixed(1);
    });

    // 3. Tiến hành Cắt Video
    btnCut.addEventListener('click', async () => {
        if (!videoFile) return alert("Vui lòng tải video lên trước!");

        const startTime = parseFloat(inputStart.value);
        const endTime = parseFloat(inputEnd.value);
        const duration = endTime - startTime;

        if (startTime < 0 || endTime <= startTime) {
            return alert("Thời gian không hợp lệ. Mốc kết thúc phải lớn hơn mốc bắt đầu!");
        }

        // Khóa UI
        btnCut.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo FFmpeg Engine...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-mint)"; 

        try {
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    logger: ({ message }) => {
                        console.log(message);
                        
                        // REGEX MỚI BẮT CHUẨN MỌI ĐỊNH DẠNG SỐ THẬP PHÂN CỦA FFMPEG
                        if (message.includes('time=')) {
                            const match = message.match(/time=\s*(\d{2}):(\d{2}):(\d+\.?\d*)/);
                            if (match) {
                                const h = parseInt(match[1]);
                                const m = parseInt(match[2]);
                                const s = parseFloat(match[3]);
                                
                                // Trong cắt video, thời gian log ra bắt đầu từ 0 và chạy đến "duration"
                                const currentTime = (h * 3600) + (m * 60) + s;
                                let p = Math.round((currentTime / duration) * 100);
                                if (p > 100) p = 100;
                                
                                progressFill.style.width = `${p}%`;
                                statusText.innerText = `Đang cắt Video: ${p}% (Đã render ${currentTime.toFixed(1)}s / ${duration.toFixed(1)}s)`;
                            }
                        }
                    }
                });
                
                statusText.innerText = "Đang tải thư viện đồ họa (chỉ tải lần đầu)...";
                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp file vào bộ nhớ...";
            const { fetchFile } = FFmpeg;

            const ext = videoFile.name.split('.').pop();
            const inputName = `input.${ext}`;
            const outputName = `output.mp4`; // Ép ra MP4 cho chuẩn web

            ffmpeg.FS('writeFile', inputName, await fetchFile(videoFile));

            statusText.innerText = "Đang bắt đầu cắt... Vui lòng không đóng tab.";

            // LỆNH RENDER: Cắt chuẩn xác khung hình (encode lại siêu nhanh với ultrafast)
            await ffmpeg.run(
                '-ss', startTime.toString(),
                '-t', duration.toString(),
                '-i', inputName,
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-c:a', 'aac',
                outputName
            );

            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            const data = ffmpeg.FS('readFile', outputName);

            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;

            // Kích hoạt tải về
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName}_cut_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            // Dọn dẹp RAM
            ffmpeg.FS('unlink', inputName);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Xong! Video đã được cắt và tải xuống thành công.`;
            progressFill.style.width = `100%`;

        } catch (error) {
            console.error("Lỗi Cắt Video:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi xử lý video. Xem thêm F12 (Console).";
            progressFill.style.background = "#ffadad";
        } finally {
            btnCut.disabled = false;
        }
    });
});