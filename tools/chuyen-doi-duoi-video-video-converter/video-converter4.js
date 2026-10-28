document.addEventListener('DOMContentLoaded', async function() {
    const videoInput = document.getElementById('vconv-video-input');
    const videoName = document.getElementById('vconv-video-name');
    const iconVideo = document.getElementById('vconv-icon-video');
    
    const settingsBox = document.getElementById('vconv-settings');
    const formatSelect = document.getElementById('vconv-format-select');
    const qualitySelect = document.getElementById('vconv-quality-select');
    const qualityGroup = document.getElementById('vconv-quality-group');
    
    const btnStart = document.getElementById('vconv-btn-start');
    
    const statusBox = document.getElementById('vconv-status-box');
    const statusText = document.getElementById('vconv-status-text');
    const detailText = document.getElementById('vconv-detail-text');
    const progressFill = document.getElementById('vconv-progress-fill');

    let videoFile = null;
    let ffmpeg = null;

    // --- UX LOGIC ---
    formatSelect.addEventListener('change', () => {
        const format = formatSelect.value;
        if (format === 'gif') {
            qualitySelect.disabled = true;
            qualityGroup.style.opacity = '0.5';
        } else {
            qualitySelect.disabled = false;
            qualityGroup.style.opacity = '1';
        }
    });

    // --- UPLOAD VIDEO (Bỏ HTML5 Video Check để tương thích MKV, AVI) ---
    videoInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            iconVideo.innerText = "✅";
            videoName.innerText = videoFile.name;
            
            settingsBox.style.display = 'block';
            btnStart.disabled = false;
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER ---
    btnStart.addEventListener('click', async () => {
        if (!videoFile) return alert("Vui lòng tải Video lên trước!");

        const targetFormat = formatSelect.value;
        const targetQuality = qualitySelect.value;

        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo lõi FFmpeg Wasm...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-lime)"; 
        detailText.innerText = "";

        try {
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    log: true // Bật log để F12 dễ debug
                });
                
                // --- SỬ DỤNG HÀM TIẾN ĐỘ CHUẨN CỦA FFMPEG.WASM ---
                ffmpeg.setProgress(({ ratio }) => {
                    // ratio là số thực từ 0.0 đến 1.0 (VD: 0.45 tức là 45%)
                    let p = Math.round(ratio * 100);
                    
                    // Tránh lỗi hiển thị số âm hoặc > 100%
                    if (p < 0) p = 0;
                    if (p > 100) p = 100;
                    
                    // Chỉ cập nhật khi p > 2% để UI không bị giật lùi lúc khởi động
                    if (p > 2) {
                        progressFill.style.width = `${p}%`;
                        statusText.innerText = `Đang Chuyển Đổi: ${p}%`;
                    }
                    
                    if(targetQuality === 'copy' && targetFormat !== 'gif') {
                        detailText.innerText = "Chế độ Copy Stream: Quá trình này sẽ diễn ra cực kỳ nhanh!";
                    } else {
                        detailText.innerText = `Hệ thống đang Render... Vui lòng không đóng trình duyệt.`;
                    }
                });

                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp file vào bộ nhớ ảo...";
            const { fetchFile } = FFmpeg;

            const ext = videoFile.name.split('.').pop();
            const inputVid = `input.${ext}`;
            const outputName = `output.${targetFormat}`; 

            ffmpeg.FS('writeFile', inputVid, await fetchFile(videoFile));

            statusText.innerText = `Đang thiết lập Codec chuyển đổi sang ${targetFormat.toUpperCase()}...`;

            // --- BỘ XÂY DỰNG LỆNH FFMPEG THÔNG MINH ---
            let ffmpegArgs = ['-i', inputVid];

            if (targetFormat === 'gif') {
                // Tối ưu hóa GIF: Giảm FPS xuống 12 và scale chiều ngang tối đa 600px để tránh treo trình duyệt
                ffmpegArgs.push(
                    '-vf', 'fps=12,scale=600:-1:flags=lanczos',
                    '-c:v', 'gif'
                );
            } 
            else if (targetFormat === 'webm') {
                if (targetQuality === 'high') {
                    ffmpegArgs.push('-c:v', 'libvpx', '-crf', '10', '-b:v', '2M', '-c:a', 'libvorbis');
                } else if (targetQuality === 'copy') {
                    ffmpegArgs.push('-c', 'copy');
                } else {
                    ffmpegArgs.push('-c:v', 'libvpx', '-crf', '30', '-b:v', '1M', '-c:a', 'libvorbis');
                }
            } 
            else {
                // MP4, MKV, MOV, AVI (Sử dụng H264)
                if (targetQuality === 'copy') {
                    ffmpegArgs.push('-c', 'copy'); // Không encode lại, siêu tốc
                } else if (targetQuality === 'high') {
                    ffmpegArgs.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-c:a', 'aac');
                } else {
                    // Fast / Default
                    ffmpegArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24', '-c:a', 'aac');
                }
            }

            ffmpegArgs.push(outputName);

            // Bắt đầu chạy FFmpeg
            await ffmpeg.run(...ffmpegArgs);

            // Ép lên 100% khi chạy xong
            progressFill.style.width = `100%`;
            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            
            const data = ffmpeg.FS('readFile', outputName);
            
            if (data.length === 0) throw new Error("File xuất ra rỗng.");

            // Ánh xạ MIME type chuẩn
            const mimeTypes = {
                'mp4': 'video/mp4', 'mov': 'video/quicktime', 'mkv': 'video/x-matroska',
                'webm': 'video/webm', 'gif': 'image/gif', 'avi': 'video/x-msvideo'
            };

            const blob = new Blob([data.buffer], { type: mimeTypes[targetFormat] || 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Lấy tên gốc (bỏ đuôi cũ)
            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;
            
            a.download = `${baseName}_congcuviet.${targetFormat}`;
            a.click();
            URL.revokeObjectURL(url);

            // Dọn dẹp RAM
            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Xong! File ${targetFormat.toUpperCase()} đã được tải xuống.`;
            detailText.innerText = "Quá trình chuyển đổi diễn ra hoàn toàn trên thiết bị của bạn.";

        } catch (error) {
            console.error("Lỗi Chuyển Đổi Video:", error);
            statusText.innerText = "❌ Xảy ra sự cố.";
            detailText.innerText = "Lỗi thường do file không tương thích. Hãy thử tải lại trang hoặc F12 xem log.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
        }
    });
});