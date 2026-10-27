document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('sp-file-input');
    const filenameDisplay = document.getElementById('sp-filename');
    const workspace = document.getElementById('sp-workspace');
    
    const slider = document.getElementById('sp-slider');
    const valueDisplay = document.getElementById('sp-value-display');
    const hintBox = document.getElementById('sp-effect-hint');
    
    const btnPlay = document.getElementById('sp-btn-play');
    const btnDownload = document.getElementById('sp-btn-download');
    
    const audioElement = document.getElementById('sp-audio-element');
    const waveAnim = document.getElementById('sp-wave');
    const statusText = document.getElementById('sp-status-text');

    let currentFile = null;

    // Ép HTML5 Audio không được giữ nguyên pitch khi đổi tốc độ (Rất quan trọng)
    audioElement.preservesPitch = false;
    audioElement.mozPreservesPitch = false;
    audioElement.webkitPreservesPitch = false;

    // 1. Cập nhật UI khi chọn file
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            currentFile = file;
            filenameDisplay.innerText = file.name;
            workspace.style.display = 'block';
            
            // Nạp file vào Audio HTML5
            audioElement.src = URL.createObjectURL(file);
            
            // Reset các thông số
            slider.value = 1.0;
            updateSliderInfo(1.0);
            
            btnPlay.innerHTML = "▶️ Nghe Thử";
            waveAnim.classList.remove('playing');
        }
    });

    // Hàm cập nhật chữ hiển thị tùy vào mức độ kéo
    function updateSliderInfo(value) {
        valueDisplay.innerText = value.toFixed(2) + 'x';
        audioElement.playbackRate = value; // Cập nhật tốc độ nghe thử real-time
        
        if (value == 1.0) {
            hintBox.innerHTML = "👉 Chế độ: <b>Bình thường</b>";
            hintBox.style.background = "#f8f9fa";
        } else if (value < 1.0) {
            hintBox.innerHTML = "👉 Chế độ: <b>Slowed (Chậm & Trầm giọng)</b> 🐢";
            hintBox.style.background = "#e0fbfc";
        } else {
            hintBox.innerHTML = "👉 Chế độ: <b>Nightcore (Nhanh & Cao giọng)</b> 🐿️";
            hintBox.style.background = "#ffe5ec";
        }
    }

    // 2. Lắng nghe thanh kéo
    slider.addEventListener('input', function() {
        const val = parseFloat(this.value);
        updateSliderInfo(val);
    });

    // 3. Nút Nghe Thử
    btnPlay.addEventListener('click', function() {
        if (!currentFile) return;

        if (audioElement.paused) {
            audioElement.play();
            btnPlay.innerHTML = "⏸ Tạm Dừng";
            waveAnim.classList.add('playing');
            statusText.innerText = "Đang phát preview...";
        } else {
            audioElement.pause();
            btnPlay.innerHTML = "▶️ Tiếp Tục";
            waveAnim.classList.remove('playing');
            statusText.innerText = "Đã tạm dừng";
        }
    });

    // Tự động tắt sóng âm khi kết thúc
    audioElement.addEventListener('ended', () => {
        btnPlay.innerHTML = "▶️ Nghe Thử";
        waveAnim.classList.remove('playing');
        statusText.innerText = "Sẵn sàng biến đổi";
    });

    // 4. Nút Xuất & Tải Xuống (Render OfflineAudioContext)
    btnDownload.addEventListener('click', async function() {
        if (!currentFile) return;

        const speedRate = parseFloat(slider.value);
        
        // Khóa UI
        btnDownload.disabled = true;
        btnPlay.disabled = true;
        statusText.innerText = "⏳ Đang kết xuất âm thanh (Chờ xíu nhé)...";
        waveAnim.classList.add('playing');

        try {
            const arrayBuffer = await currentFile.arrayBuffer();
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

            // Tính toán độ dài mới của Audio sau khi bị thay đổi tốc độ
            const newLength = Math.ceil(audioBuffer.length / speedRate);
            
            const offlineCtx = new OfflineAudioContext(
                audioBuffer.numberOfChannels,
                newLength,
                audioBuffer.sampleRate
            );

            const source = offlineCtx.createBufferSource();
            source.buffer = audioBuffer;
            
            // Đây là chìa khóa: Đổi playbackRate sẽ nén/dãn sóng âm -> Đổi Pitch + Speed
            source.playbackRate.value = speedRate; 

            source.connect(offlineCtx.destination);
            source.start(0);

            // Bắt đầu render
            const renderedBuffer = await offlineCtx.startRendering();
            
            // Chuyển sang WAV
            const wavBlob = audioBufferToWav(renderedBuffer);
            const url = URL.createObjectURL(wavBlob);
            
            // Tạo link tải
            const a = document.createElement('a');
            a.href = url;
            const originalName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || currentFile.name;
            const suffix = speedRate > 1 ? 'nightcore' : (speedRate < 1 ? 'slowed' : 'edited');
            
            a.download = `${originalName}-${suffix}.wav`;
            a.click();
            URL.revokeObjectURL(url);

            statusText.innerText = "🎉 Hoàn tất xuất file!";
        } catch (error) {
            console.error(error);
            statusText.innerText = "❌ Lỗi xử lý âm thanh!";
            alert("Có lỗi xảy ra. File của bạn có thể quá nặng hoặc bị lỗi định dạng.");
        } finally {
            btnDownload.disabled = false;
            btnPlay.disabled = false;
            if (audioElement.paused) {
                waveAnim.classList.remove('playing');
            }
        }
    });

    // Hàm tiêu chuẩn: Chuyển AudioBuffer sang file WAV
    function audioBufferToWav(buffer) {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const outBuffer = new ArrayBuffer(length);
        const view = new DataView(outBuffer);
        const channels = [];
        let offset = 0;
        let pos = 0;

        function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
        function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

        setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157); 
        setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
        setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan); 
        setUint16(numOfChan * 2); setUint16(16); 

        setUint32(0x61746164); setUint32(length - pos - 4); 

        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }
        return new Blob([outBuffer], { type: "audio/wav" });
    }
});