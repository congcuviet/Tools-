document.addEventListener('DOMContentLoaded', async function() {
    const fileInput = document.getElementById('vcrop-file-input');
    const filenameDisplay = document.getElementById('vcrop-filename');
    
    const playerBox = document.getElementById('vcrop-player-box');
    const videoPlayer = document.getElementById('vcrop-player');
    const settingsBox = document.getElementById('vcrop-settings');
    const resolutionSelect = document.getElementById('vcrop-resolution');
    const modeSelect = document.getElementById('vcrop-mode'); // Bắt cài đặt chế độ hiển thị
    
    const btnCut = document.getElementById('vcrop-btn-cut');
    
    const statusBox = document.getElementById('vcrop-status-box');
    const statusText = document.getElementById('vcrop-status-text');
    const detailText = document.getElementById('vcrop-detail-text');
    const progressFill = document.getElementById('vcrop-progress-fill');

    let videoFile = null;
    let ffmpeg = null;
    let videoDuration = 0;

    // 1. Nạp file & Hiển thị UI
    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            filenameDisplay.innerText = videoFile.name;
            
            const fileURL = URL.createObjectURL(videoFile);
            videoPlayer.src = fileURL;
            
            playerBox.style.display = 'block';
            settingsBox.style.display = 'block';
            btnCut.disabled = false;

            videoPlayer.onloadedmetadata = () => {
                videoDuration = videoPlayer.duration;
            };
        }
    });

    // 2. Bắt đầu Render FFmpeg
    btnCut.addEventListener('click', async () => {
        if (!videoFile) return alert("Vui lòng tải video lên trước!");

        // Lấy thông số từ giao diện
        const [targetW, targetH] = resolutionSelect.value.split('x');
        const cropMode = modeSelect.value;

        // Khóa UI
        btnCut.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo FFmpeg Engine...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-sky)"; 
        detailText.innerText = "";

        try {
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    logger: ({ message }) => {
                        console.log(message);
                        
                        if (message.includes('time=')) {
                            const match = message.match(/time=\s*(\d{2}):(\d{2}):(\d+\.?\d*)/);
                            if (match && videoDuration > 0) {
                                const h = parseInt(match[1]);
                                const m = parseInt(match[2]);
                                const s = parseFloat(match[3]);
                                
                                const currentTime = (h * 3600) + (m * 60) + s;
                                let p = Math.round((currentTime / videoDuration) * 100);
                                if (p > 100) p = 100;
                                
                                progressFill.style.width = `${p}%`;
                                statusText.innerText = `Đang Xử Lý Video: ${p}%`;
                                detailText.innerText = `Đã render: ${currentTime.toFixed(1)}s / ${videoDuration.toFixed(1)}s`;
                            }
                        }
                    }
                });
                
                statusText.innerText = "Đang tải thư viện (chỉ tải lần đầu)...";
                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp file vào bộ nhớ...";
            const { fetchFile } = FFmpeg;

            const ext = videoFile.name.split('.').pop();
            const inputName = `input.${ext}`;
            const outputName = `output.mp4`;

            ffmpeg.FS('writeFile', inputName, await fetchFile(videoFile));

            statusText.innerText = `Bắt đầu xử lý khung hình về ${targetW}x${targetH}...`;

            // THUẬT TOÁN FILTER LINH HOẠT THEO SỰ LỰA CHỌN CỦA NGƯỜI DÙNG
            let filterStr = "";
            
            if (cropMode === 'crop') {
                // Phóng to lấp đầy (Bị cắt xén 2 cạnh)
                filterStr = `scale=${targetW}:${targetH}:force_original_aspect_ratio=increase,crop=${targetW}:${targetH}`;
            } else {
                // Thu nhỏ vừa khít và thêm viền đen (Pad black) ở khoảng trống
                filterStr = `scale=${targetW}:${targetH}:force_original_aspect_ratio=decrease,pad=${targetW}:${targetH}:(ow-iw)/2:(oh-ih)/2:black`;
            }

            await ffmpeg.run(
                '-i', inputName,
                '-vf', filterStr,
                '-c:v', 'libx264',
                '-preset', 'ultrafast',
                '-c:a', 'copy', // Giữ nguyên chất lượng âm thanh gốc cho nhanh
                outputName
            );

            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            const data = ffmpeg.FS('readFile', outputName);
            
            if (data.length === 0) {
                throw new Error("File xuất ra rỗng.");
            }

            // Kích hoạt tải về
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;
            
            a.download = `${baseName}_resized_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            // Dọn dẹp RAM
            ffmpeg.FS('unlink', inputName);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Xong! Video đã được xử lý và tải xuống thành công.`;
            detailText.innerText = "";
            progressFill.style.width = `100%`;

        } catch (error) {
            console.error("Lỗi Xử Lý Video:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi xử lý video.";
            detailText.innerText = "Có lỗi định dạng hoặc cấu hình FFmpeg. Vui lòng thử tải lại trang.";
            progressFill.style.background = "#ffadad";
        } finally {
            btnCut.disabled = false;
        }
    });
});