document.addEventListener('DOMContentLoaded', function() {
    const audioInput = document.getElementById('neo-audio-input');
    const fileNameDisplay = document.getElementById('neo-file-name-display');
    const workspace = document.getElementById('neo-workspace');
    
    const timeStart = document.getElementById('neo-time-start');
    const timeEnd = document.getElementById('neo-time-end');
    const timeDuration = document.getElementById('neo-time-duration');
    
    const btnPlay = document.getElementById('neo-btn-play');
    const btnCut = document.getElementById('neo-btn-cut');
    
    const loadingUI = document.getElementById('neo-audio-loading');
    const waveformContainer = document.getElementById('neo-waveform');

    let wavesurfer = null;
    let wsRegions = null;
    let activeRegion = null;
    let originalAudioBuffer = null;
    let currentFileName = 'audio';

    function formatTimeDisplay(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const ms = Math.floor((seconds % 1) * 10).toString();
        return `${m}:${s}.${ms}`;
    }

    function updateRegionInfo() {
        if (!activeRegion) return;
        timeStart.innerText = formatTimeDisplay(activeRegion.start);
        timeEnd.innerText = formatTimeDisplay(activeRegion.end);
        timeDuration.innerText = formatTimeDisplay(activeRegion.end - activeRegion.start);
    }

    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        currentFileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        fileNameDisplay.innerText = file.name;
        
        // Hiện khung làm việc nhưng ẨN sóng âm, HIỆN Loading
        workspace.style.display = 'block';
        loadingUI.style.display = 'block';
        waveformContainer.style.opacity = '0'; // Tạm che khu vực sóng âm đi cho đẹp

        // SỬ DỤNG KỸ THUẬT YIELDING: Buộc trình duyệt nghỉ 100ms để kịp vẽ cái thông báo Loading lên màn hình
        setTimeout(async () => {
            try {
                if (!wavesurfer) {
                    wavesurfer = WaveSurfer.create({
                        container: '#neo-waveform',
                        waveColor: '#ced4da',
                        progressColor: '#3a86ff',
                        cursorColor: '#ff006e',
                        barWidth: 2,
                        barRadius: 2,
                        height: 120
                    });

                    wsRegions = wavesurfer.registerPlugin(WaveSurfer.Regions.create());

                    wsRegions.on('region-updated', (region) => {
                        activeRegion = region;
                        updateRegionInfo();
                    });

                    wsRegions.on('region-in', (region) => { activeRegion = region; });
                    wsRegions.on('region-out', (region) => {
                        if (wavesurfer.isPlaying()) region.play();
                    });

                    // Sự kiện này chạy khi sóng âm ĐÃ ĐƯỢC GIẢI MÃ XONG
                    wavesurfer.on('decode', () => {
                        // Tắt Loading, hiện lại sóng âm
                        loadingUI.style.display = 'none';
                        waveformContainer.style.opacity = '1';

                        wsRegions.clearRegions();
                        const duration = wavesurfer.getDuration();
                        
                        activeRegion = wsRegions.addRegion({
                            start: 0,
                            end: Math.min(10, duration * 0.3),
                            color: 'rgba(255, 0, 110, 0.2)',
                            drag: true,
                            resize: true,
                        });
                        updateRegionInfo();
                    });
                }

                // Chạy song song 2 luồng giải mã (Cho Canvas và cho bộ đệm File)
                const fileUrl = URL.createObjectURL(file);
                wavesurfer.load(fileUrl); // Nạp cho Canvas vẽ sóng

                const arrayBuffer = await file.arrayBuffer();
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                originalAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer); // Nạp cho RAM để lát nữa Cắt

            } catch (err) {
                console.error(err);
                loadingUI.innerText = "❌ Lỗi: File âm thanh quá lớn hoặc định dạng không được hỗ trợ!";
                loadingUI.style.background = "#ff006e";
                loadingUI.style.color = "#fff";
            }
        }, 100);
    });

    btnPlay.addEventListener('click', () => {
        if (activeRegion) activeRegion.play();
    });

    btnCut.addEventListener('click', async () => {
        if (!activeRegion || !originalAudioBuffer) return;
        
        btnCut.disabled = true;
        const originalText = btnCut.innerText;
        btnCut.innerText = "⏳ Đang xử lý...";

        try {
            const startSec = activeRegion.start;
            const endSec = activeRegion.end;
            const rate = originalAudioBuffer.sampleRate;
            const channels = originalAudioBuffer.numberOfChannels;
            
            const startOffset = Math.floor(startSec * rate);
            const endOffset = Math.floor(endSec * rate);
            const frameCount = endOffset - startOffset;

            const offlineCtx = new OfflineAudioContext(channels, frameCount, rate);
            const source = offlineCtx.createBufferSource();
            source.buffer = originalAudioBuffer;
            
            source.connect(offlineCtx.destination);
            source.start(0, startSec, endSec - startSec);

            const renderedBuffer = await offlineCtx.startRendering();
            const wavBlob = audioBufferToWav(renderedBuffer);
            
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentFileName} + congcuviet(cut).wav`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert("🎉 Đã cắt thành công! File WAV đã được tải xuống.");
        } catch (err) {
            console.error(err);
            alert("❌ Có lỗi xảy ra trong quá trình xử lý âm thanh.");
        } finally {
            btnCut.disabled = false;
            btnCut.innerText = originalText;
        }
    });

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