document.addEventListener('DOMContentLoaded', async function() {
    const fileInput = document.getElementById('ffconv-file-input');
    const filenameDisplay = document.getElementById('ffconv-filename');
    const formatSelect = document.getElementById('ffconv-format');
    const btnConvert = document.getElementById('ffconv-btn');
    
    const statusBox = document.getElementById('ffconv-status-box');
    const statusText = document.getElementById('ffconv-status-text');
    const progressFill = document.getElementById('ffconv-progress-fill');

    let audioFile = null;
    let ffmpeg = null;

    fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            audioFile = e.target.files[0];
            filenameDisplay.innerText = audioFile.name;
        }
    });

    btnConvert.addEventListener('click', async () => {
        if (!audioFile) return alert("Vui lòng chọn file âm thanh hoặc video cần chuyển đổi!");

        // Khóa UI
        btnConvert.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo FFmpeg Engine...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-mint)"; // Reset màu

        try {
            // Lấy độ dài Audio để tính %
            let totalAudioTime = 0;
            try {
                const tempAudio = new Audio(URL.createObjectURL(audioFile));
                await new Promise((res) => {
                    tempAudio.onloadedmetadata = res;
                    setTimeout(res, 2000); // Fallback nếu trình duyệt không tự đọc được đuôi lạ
                });
                totalAudioTime = tempAudio.duration || 0;
            } catch(e) {
                console.warn("Không đọc được metadata, thanh % có thể hiển thị dạng ước lượng.");
            }

            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({
                    corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js',
                    logger: ({ message }) => {
                        console.log(message);
                        
                        // Bóc tách thời gian để làm thanh progress (giống code cũ của bạn)
                        if (message.includes('time=') && totalAudioTime > 0) {
                            const match = message.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
                            if (match) {
                                const h = parseInt(match[1]);
                                const m = parseInt(match[2]);
                                const s = parseFloat(match[3]);
                                
                                const currentTime = (h * 3600) + (m * 60) + s;
                                let p = Math.round((currentTime / totalAudioTime) * 100);
                                if (p > 100) p = 100;
                                
                                progressFill.style.width = `${p}%`;
                                statusText.innerText = `Đang mã hóa: ${p}%`;
                            }
                        }
                    }
                });
                
                statusText.innerText = "Đang tải thư viện FFmpeg (chỉ tải lần đầu)...";
                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp file vào bộ nhớ...";
            const { fetchFile } = FFmpeg;

            // Xử lý tên và đuôi file
            const ext = audioFile.name.split('.').pop();
            const inputName = `input.${ext}`;
            const targetFormat = formatSelect.value;
            const outputName = `output.${targetFormat}`;

            ffmpeg.FS('writeFile', inputName, await fetchFile(audioFile));

            statusText.innerText = `Bắt đầu convert sang ${targetFormat.toUpperCase()}...`;

            // Thiết lập tham số dòng lệnh FFmpeg
            let ffmpegArgs = ['-i', inputName, '-vn']; // -vn: Loại bỏ Video nếu input là file MP4/Video
            
            // Nếu người dùng chọn chuẩn nén, ép xuất chất lượng cao nhất (320kbps)
            if (['mp3', 'm4a', 'ogg', 'aac'].includes(targetFormat)) {
                ffmpegArgs.push('-b:a', '320k');
            }
            
            ffmpegArgs.push(outputName);

            // Chạy lệnh Render
            await ffmpeg.run(...ffmpegArgs);

            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            const data = ffmpeg.FS('readFile', outputName);

            // Xác định MIME type chuẩn
            const mimeTypes = {
                'mp3': 'audio/mpeg',
                'wav': 'audio/wav',
                'flac': 'audio/flac',
                'ogg': 'audio/ogg',
                'm4a': 'audio/mp4',
                'aac': 'audio/aac'
            };

            let baseName = audioFile.name.substring(0, audioFile.name.lastIndexOf('.'));
            if (!baseName) baseName = audioFile.name;

            // Kích hoạt tải về
            const blob = new Blob([data.buffer], { type: mimeTypes[targetFormat] || 'audio/generic' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${baseName} + congcuviet.${targetFormat}`;
            a.click();
            URL.revokeObjectURL(url);

            // Dọn dẹp RAM
            ffmpeg.FS('unlink', inputName);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Xong! File ${targetFormat.toUpperCase()} đã được tải xuống.`;
            progressFill.style.width = `100%`;

        } catch (error) {
            console.error("Lỗi Convert:", error);
            statusText.innerText = "❌ Xảy ra sự cố (Có thể do file hỏng hoặc quá nặng). Xem thêm Console.";
            progressFill.style.background = "#ffadad"; // Đổi màu đỏ báo lỗi
        } finally {
            btnConvert.disabled = false;
        }
    });
});