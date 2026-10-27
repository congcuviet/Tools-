document.addEventListener('DOMContentLoaded', async function() {
    const videoInput = document.getElementById('vapc-video-input');
    const videoName = document.getElementById('vapc-video-name');
    const iconVideo = document.getElementById('vapc-icon-video');
    
    const settingsBox = document.getElementById('vapc-settings');
    const videoPlayer = document.getElementById('vapc-player');
    
    const speedSlider = document.getElementById('vapc-speed-slider');
    const speedText = document.getElementById('vapc-speed-text');
    const quickBtns = document.querySelectorAll('.vapc-btn-quick');
    const pitchSelect = document.getElementById('vapc-pitch-select');
    
    const btnPreview = document.getElementById('vapc-btn-preview-audio');
    const btnStart = document.getElementById('vapc-btn-start');
    
    const statusBox = document.getElementById('vapc-status-box');
    const statusText = document.getElementById('vapc-status-text');
    const detailText = document.getElementById('vapc-detail-text');
    const progressFill = document.getElementById('vapc-progress-fill');

    let videoFile = null;
    let videoDuration = 0;
    let ffmpeg = null;
    let currentPreviewAudio = null; // Lưu file audio đang phát preview

    // --- MÔ PHỎNG TỐC ĐỘ BẰNG HTML5 VIDEO ---
    function updatePreviewSpeed(val) {
        speedText.innerText = parseFloat(val).toFixed(1);
        videoPlayer.playbackRate = parseFloat(val);
        // HTML5 tự động giữ nguyên Pitch khi đổi Speed. Để làm méo tiếng ta phải dùng FFmpeg
    }

    speedSlider.addEventListener('input', (e) => updatePreviewSpeed(e.target.value));

    quickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const val = e.target.getAttribute('data-val');
            speedSlider.value = val;
            updatePreviewSpeed(val);
        });
    });

    // UPLOAD VIDEO
    videoInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            iconVideo.innerText = "⏳";
            videoName.innerText = "Đang tải video...";
            
            const fileURL = URL.createObjectURL(videoFile);
            videoPlayer.src = fileURL;
            
            videoPlayer.onloadedmetadata = () => {
                videoDuration = videoPlayer.duration;
                iconVideo.innerText = "✅";
                videoName.innerText = videoFile.name;
                
                settingsBox.style.display = 'block';
                btnStart.disabled = false;
            };
        }
    });

    // --- LOGIC TẠO BẢN NGHE THỬ PITCH (5 GIÂY) BẰNG FFMPEG ---
    btnPreview.addEventListener('click', async () => {
        if (!videoFile) return;

        const speedVal = parseFloat(speedSlider.value);
        const pitchVal = parseFloat(pitchSelect.value);
        
        // Lấy đúng vị trí giây hiện tại trên trình phát video
        let currentPos = videoPlayer.currentTime; 

        videoPlayer.pause();
        if (currentPreviewAudio) {
            currentPreviewAudio.pause();
            currentPreviewAudio = null;
        }

        btnPreview.disabled = true;
        // Báo cho user biết hệ thống đang cắt từ giây nào để họ hiểu cơ chế
        btnPreview.innerText = `⏳ Đang render 8s từ mốc ${currentPos.toFixed(1)}s...`;

        try {
            if (!ffmpeg) {
                const { createFFmpeg } = FFmpeg;
                ffmpeg = createFFmpeg({ corePath: 'https://congcuviet.com/wp-content/themes/bricks-child/tai-nguyen/ffmpeg-core.js' });
                await ffmpeg.load();
            }

            const { fetchFile } = FFmpeg;
            const ext = videoFile.name.split('.').pop();
            const inputVid = `preview_in.${ext}`;
            const outputAud = `preview_out.mp3`; 

            ffmpeg.FS('writeFile', inputVid, await fetchFile(videoFile));

            let tempo = speedVal / pitchVal;
            let atempoStr = "";
            while (tempo > 2.0) { atempoStr += "atempo=2.0,"; tempo /= 2.0; }
            while (tempo < 0.5) { atempoStr += "atempo=0.5,"; tempo /= 0.5; }
            atempoStr += `atempo=${tempo}`;

            let audioFilter = `[0:a]aformat=sample_rates=44100,asetrate=44100*${pitchVal},${atempoStr}[aout]`;

            // TĂNG LÊN CẮT 8 GIÂY (-t 8) để khách thoải mái nghe
            await ffmpeg.run(
                '-ss', currentPos.toString(),
                '-t', '8',
                '-i', inputVid,
                '-vn',
                '-filter_complex', audioFilter,
                '-map', '[aout]',
                '-c:a', 'libmp3lame',
                outputAud
            );

            const data = ffmpeg.FS('readFile', outputAud);
            const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);

            currentPreviewAudio = new Audio(url);
            currentPreviewAudio.play();

            btnPreview.innerText = "🔊 Đang phát bản nghe thử...";
            btnPreview.style.background = "var(--clr-yellow)"; // Đổi màu để gây chú ý

            // Reset UI khi nghe xong
            currentPreviewAudio.onended = () => {
                btnPreview.innerText = "🎧 Nghe Thử Đoạn Khác (8 giây)";
                btnPreview.style.background = "var(--clr-mint)";
                btnPreview.disabled = false;
            };

            // Dọn dẹp
            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputAud);

        } catch (error) {
            console.error("Lỗi Preview Pitch:", error);
            btnPreview.innerText = "❌ Không tìm thấy âm thanh đoạn này. Hãy tua video!";
            btnPreview.style.background = "var(--clr-danger)";
            btnPreview.disabled = false;
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER FULL VIDEO ---
    btnStart.addEventListener('click', async () => {
        if (!videoFile) return alert("Vui lòng tải Video lên trước!");

        const speedVal = parseFloat(speedSlider.value);
        const pitchVal = parseFloat(pitchSelect.value);

        videoPlayer.pause();
        if (currentPreviewAudio) currentPreviewAudio.pause();

        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo FFmpeg Engine...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-hotpink)"; 
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
                                let expectedTotalTime = videoDuration / speedVal;
                                
                                let p = Math.round((currentTime / expectedTotalTime) * 100);
                                if (p > 100) p = 100;
                                
                                progressFill.style.width = `${p}%`;
                                statusText.innerText = `Đang Xử Lý & Encode Video: ${p}%`;
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

            statusText.innerText = `Đang thiết lập thuật toán Audio Pitch & Speed...`;

            let tempo = speedVal / pitchVal;
            let atempoStr = "";
            while (tempo > 2.0) { atempoStr += "atempo=2.0,"; tempo /= 2.0; }
            while (tempo < 0.5) { atempoStr += "atempo=0.5,"; tempo /= 0.5; }
            atempoStr += `atempo=${tempo}`;

            let ffmpegArgs = [];
            
            // --- TỐI ƯU HÓA: Chỉ đổi Tone, giữ tốc độ = 1x -> Copy hình ảnh ---
            if (speedVal === 1.0) {
                detailText.innerText = "Chế độ Copy Lossless hình ảnh đang được kích hoạt...";
                
                let audioFilter = `[0:a]aformat=sample_rates=44100,asetrate=44100*${pitchVal},${atempoStr}[aout]`;
                
                ffmpegArgs = [
                    '-i', inputVid,
                    '-filter_complex', audioFilter,
                    '-map', '0:v:0', 
                    '-map', '[aout]',
                    '-c:v', 'copy', 
                    '-c:a', 'aac',
                    outputName
                ];
            } else {
                detailText.innerText = "Đang Render lại toàn bộ hình ảnh và âm thanh theo tốc độ mới...";
                
                let filterComplex = `[0:v]setpts=${1/speedVal}*PTS[vout];[0:a]aformat=sample_rates=44100,asetrate=44100*${pitchVal},${atempoStr}[aout]`;
                
                ffmpegArgs = [
                    '-i', inputVid,
                    '-filter_complex', filterComplex,
                    '-map', '[vout]',
                    '-map', '[aout]',
                    '-c:v', 'libx264',
                    '-preset', 'ultrafast',
                    '-c:a', 'aac',
                    outputName
                ];
            }

            await ffmpeg.run(...ffmpegArgs);

            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            const data = ffmpeg.FS('readFile', outputName);
            
            if (data.length === 0) throw new Error("File xuất ra rỗng.");

            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;
            
            a.download = `${baseName}_S${speedVal}_P${pitchVal}_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Xong! Video đã được biến đổi thành công.`;
            detailText.innerText = "Chúc bạn có những tràng cười sảng khoái với video này!";
            progressFill.style.width = `100%`;

        } catch (error) {
            console.error("Lỗi Pitch Changer:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi xử lý video.";
            detailText.innerText = "Video gốc của bạn có thể không chứa luồng âm thanh. F12 để xem log.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
            btnPreview.disabled = false;
            btnPreview.innerText = "🎧 Render Nghe Thử Tone Giọng (5 giây)";
        }
    });
});