document.addEventListener('DOMContentLoaded', () => {
    const btnSender = document.getElementById('txqr-btn-sender');
    const btnReceiver = document.getElementById('txqr-btn-receiver');
    const viewSender = document.getElementById('txqr-sender-view');
    const viewReceiver = document.getElementById('txqr-receiver-view');
    
    const fileInput = document.getElementById('txqr-file-input');
    const fileNameTxt = document.getElementById('txqr-filename');
    const canvasSender = document.getElementById('txqr-canvas-sender');
    const ctxSender = canvasSender.getContext('2d');
    const senderStatus = document.getElementById('txqr-sender-status');
    const qrObj = new QRious({ element: canvasSender, size: 400, level: 'L' });
    
    const sliderFps = document.getElementById('txqr-set-fps');
    const sliderChunk = document.getElementById('txqr-set-chunk');
    const lblFps = document.getElementById('lbl-fps');
    const lblChunk = document.getElementById('lbl-chunk');
    
    const btnStartCam = document.getElementById('txqr-btn-start-cam');
    const videoEl = document.getElementById('txqr-video');
    const canvasReceiver = document.getElementById('txqr-canvas-receiver');
    const ctxReceiver = canvasReceiver.getContext('2d');
    const scannerFrame = document.getElementById('txqr-scanner-frame');
    const engineStatus = document.getElementById('txqr-engine-status');
    
    const sCapFps = document.getElementById('stat-cap-fps');
    const sDecFps = document.getElementById('stat-dec-fps');
    const sDropped = document.getElementById('stat-dropped');
    const sUseless = document.getElementById('stat-useless');
    const sGoodput = document.getElementById('stat-goodput');
    const sElapsed = document.getElementById('stat-elapsed');
    const sDecoded = document.getElementById('stat-decoded');
    const sPending = document.getElementById('stat-pending');
    const progressFill = document.getElementById('txqr-progress-fill');
    const sSession = document.getElementById('stat-session');
    const sLock = document.getElementById('stat-lock');

    let barcodeDetector = null;
    if ('BarcodeDetector' in window) {
        barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
        engineStatus.innerText = "Lõi quét: BarcodeDetector API (Siêu Tốc)";
        engineStatus.style.color = "var(--primary)";
    } else {
        engineStatus.innerText = "Lõi quét: jsQR Fallback (Tiêu chuẩn)";
        engineStatus.style.color = "var(--text-muted)";
    }

    btnSender.addEventListener('click', () => {
        btnSender.classList.add('active'); btnReceiver.classList.remove('active');
        viewSender.classList.add('active'); viewReceiver.classList.remove('active');
        stopReceiver();
    });
    btnReceiver.addEventListener('click', () => {
        btnReceiver.classList.add('active'); btnSender.classList.remove('active');
        viewReceiver.classList.add('active'); viewSender.classList.remove('active');
        stopSender(true);
    });

    sliderFps.addEventListener('input', (e) => lblFps.innerText = e.target.value);
    sliderChunk.addEventListener('input', (e) => lblChunk.innerText = e.target.value);

    // ==========================================
    // ULTILS BYTE & XOR
    // ==========================================
    function xorArrays(a, b) {
        let res = new Uint8Array(Math.max(a.length, b.length));
        for(let i=0; i<res.length; i++) res[i] = (a[i]||0) ^ (b[i]||0);
        return res;
    }
    
    function u8ToBase64(u8) {
        let binary = '';
        for (let i = 0; i < u8.length; i += 1024) {
            binary += String.fromCharCode.apply(null, u8.subarray(i, i + 1024));
        }
        return btoa(binary);
    }
    
    function base64ToU8(b64) {
        let binary = atob(b64);
        let res = new Uint8Array(binary.length);
        for(let i=0; i<binary.length; i++) res[i] = binary.charCodeAt(i);
        return res;
    }

    // ==========================================
    // LOGIC MÁY PHÁT (TRUYỀN FILE)
    // ==========================================
    let senderFileRaw = null; 
    let senderChunks = []; 
    let senderTotalBlocks = 0;
    let senderFilename = "";
    let senderFilesize = 0;
    
    let renderLoopId = null;
    let senderStartTime = 0;
    let lastDrawTime = 0;
    let packetGeneratedCount = 0;

    fileInput.addEventListener('change', async (e) => {
        if(e.target.files.length > 0) {
            const file = e.target.files[0];
            senderFilename = file.name;
            senderFilesize = file.size;
            fileNameTxt.innerText = senderFilename;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                senderFileRaw = new Uint8Array(event.target.result);
                prepareFountainBlocks();
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function prepareFountainBlocks() {
        const chunkSize = parseInt(sliderChunk.value);
        senderTotalBlocks = Math.ceil(senderFileRaw.length / chunkSize);
        senderChunks = [];
        
        for (let i = 0; i < senderTotalBlocks; i++) {
            let chunk = senderFileRaw.subarray(i * chunkSize, (i + 1) * chunkSize);
            senderChunks.push(chunk);
        }
        startFountainLoop();
    }

    function generateLTPacket() {
        let r = Math.random();
        let d = 1;
        if (r < 0.1) d = 1;         
        else if (r < 0.6) d = 2;    
        else if (r < 0.8) d = 3;    
        else if (r < 0.9) d = 4;    
        else d = Math.floor(Math.random() * (senderTotalBlocks / 2)) + 1;
        
        if (d > senderTotalBlocks) d = senderTotalBlocks;
        if (d < 1) d = 1;

        let indices = [];
        while(indices.length < d) {
            let idx = Math.floor(Math.random() * senderTotalBlocks);
            if(!indices.includes(idx)) indices.push(idx);
        }

        let mixedData = new Uint8Array();
        for(let idx of indices) {
            mixedData = xorArrays(mixedData, senderChunks[idx]);
        }

        let b64 = u8ToBase64(mixedData);
        let payload = `LT|${senderTotalBlocks}|${senderFilename}|${senderFilesize}|${indices.join(',')}|${b64}`;
        
        let chunkSize = parseInt(sliderChunk.value);
        let maxTheoreticalLength = Math.ceil(chunkSize * 1.35) + 300; 
        
        payload = payload.padEnd(maxTheoreticalLength, ' ');
        return payload;
    }

    function startFountainLoop() {
        stopSender();
        senderStatus.style.display = 'none'; 
        senderStartTime = Date.now();
        lastDrawTime = performance.now();
        packetGeneratedCount = 0;
        
        sSession.innerText = 'ĐANG TRUYỀN';
        
        function renderFrame(now) {
            const targetFps = parseInt(sliderFps.value);
            const frameInterval = 1000 / targetFps;
            const elapsedSinceLastDraw = now - lastDrawTime;

            if (elapsedSinceLastDraw >= frameInterval) {
                lastDrawTime = now - (elapsedSinceLastDraw % frameInterval);

                qrObj.value = generateLTPacket();
                packetGeneratedCount++;
                
                let elapsed = Math.floor((Date.now() - senderStartTime) / 1000);
                sElapsed.innerText = `${elapsed} s`;
                sDecoded.innerText = `${packetGeneratedCount} / ∞`; 
            }
            renderLoopId = requestAnimationFrame(renderFrame);
        }
        renderLoopId = requestAnimationFrame(renderFrame);
    }

    function stopSender(showOverlay = false) {
        if (renderLoopId) cancelAnimationFrame(renderLoopId);
        if (showOverlay) {
            senderStatus.style.display = 'flex';
            senderStatus.innerText = 'ĐÃ DỪNG TRUYỀN';
            sSession.innerText = '-';
        }
    }

    // ==========================================
    // LOGIC QUÉT FILE (RECEIVER)
    // ==========================================
    let isScanning = false;
    let isProcessingFrame = false;
    let rcvStartTime = 0;
    
    let decodedBlocks = {}; 
    let decodedCount = 0;
    let pendingPackets = []; 
    
    let rcvTotalBlocks = 0;
    let rcvFilename = "";
    let rcvFilesize = 0;
    
    let statFramesCount = 0; 
    let statDecodeCount = 0; 
    let statDropped = 0;
    let statUseless = 0;
    let bytesReceived = 0;
    let lastStatTime = 0;

    btnStartCam.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 } } });
            videoEl.srcObject = stream;
            videoEl.setAttribute("playsinline", true); 
            videoEl.play();
            
            requestAnimationFrame(tickScan);
            
            btnStartCam.style.display = 'none';
            videoEl.hidden = false;
            scannerFrame.hidden = false;
            isScanning = true;
            rcvStartTime = Date.now();
            lastStatTime = Date.now();
            
            decodedBlocks = {};
            decodedCount = 0;
            pendingPackets = [];
            rcvTotalBlocks = 0;
            
            statDecodeCount = 0; statDropped = 0; statUseless = 0; bytesReceived = 0;
            progressFill.style.width = `0%`;
            sSession.innerText = 'ĐANG QUÉT';
            sLock.innerText = 'ĐANG CHỜ';
            
        } catch (err) {
            alert("Lỗi Camera! Hãy kiểm tra quyền truy cập.");
        }
    });

    async function tickScan() {
        if (!isScanning) return;
        
        if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA && !isProcessingFrame) {
            isProcessingFrame = true;
            statFramesCount++; 
            
            if (barcodeDetector) {
                try {
                    const barcodes = await barcodeDetector.detect(videoEl);
                    if (barcodes.length > 0) {
                        let codeData = barcodes[0].rawValue;
                        if (codeData.startsWith('LT|')) {
                            statDecodeCount++;
                            sLock.innerText = 'ĐÃ KHÓA NÉT';
                            sLock.style.color = "var(--primary)";
                            processLTPacket(codeData);
                        } else {
                            statDropped++; sLock.innerText = 'ĐANG DÒ TÌM'; sLock.style.color = "var(--text-main)";
                        }
                    } else {
                        statDropped++; sLock.innerText = 'ĐANG DÒ TÌM'; sLock.style.color = "var(--text-main)";
                    }
                } catch (e) { statDropped++; }
            } else {
                canvasReceiver.width = videoEl.videoWidth;
                canvasReceiver.height = videoEl.videoHeight;
                ctxReceiver.drawImage(videoEl, 0, 0, canvasReceiver.width, canvasReceiver.height);
                
                let scanSize = Math.floor(Math.min(canvasReceiver.width, canvasReceiver.height) * 0.75);
                let scanX = Math.floor((canvasReceiver.width - scanSize) / 2);
                let scanY = Math.floor((canvasReceiver.height - scanSize) / 2);
                
                let imgData = ctxReceiver.getImageData(scanX, scanY, scanSize, scanSize);
                let code = jsQR(imgData.data, scanSize, scanSize, { inversionAttempts: "dontInvert" });
                
                if (code && code.data.startsWith('LT|')) {
                    statDecodeCount++;
                    sLock.innerText = 'ĐÃ KHÓA NÉT';
                    sLock.style.color = "var(--primary)";
                    processLTPacket(code.data);
                } else {
                    statDropped++; sLock.innerText = 'ĐANG DÒ TÌM'; sLock.style.color = "var(--text-main)";
                }
            }
            isProcessingFrame = false;
        }
        
        updateReceiverStats();
        requestAnimationFrame(tickScan);
    }

    function processLTPacket(dataStr) {
        const parts = dataStr.split('|');
        if (parts.length < 6) return;
        
        let total = parseInt(parts[1]);
        if (rcvTotalBlocks === 0) {
            rcvTotalBlocks = total;
            rcvFilename = parts[2];
            rcvFilesize = parseInt(parts[3]);
        }

        let indices = new Set(parts[4].split(',').map(Number));
        let data = base64ToU8(parts[5].trim()); 
        
        bytesReceived += data.length; 

        for (let idx of indices) {
            if (decodedBlocks[idx]) {
                data = xorArrays(data, decodedBlocks[idx]);
                indices.delete(idx);
            }
        }

        if (indices.size === 0) {
            statUseless++; 
        } else if (indices.size === 1) {
            let newIdx = Array.from(indices)[0];
            saveDecodedBlock(newIdx, data);
        } else {
            pendingPackets.push({ indices: indices, data: data });
        }
    }

    function saveDecodedBlock(idx, data) {
        if (decodedBlocks[idx]) return; 
        
        decodedBlocks[idx] = data;
        decodedCount++;

        let i = 0;
        while (i < pendingPackets.length) {
            let pkt = pendingPackets[i];
            
            if (pkt.indices.has(idx)) {
                pkt.data = xorArrays(pkt.data, data);
                pkt.indices.delete(idx);
            }
            
            if (pkt.indices.size === 1) {
                let newIdx = Array.from(pkt.indices)[0];
                pendingPackets.splice(i, 1);
                saveDecodedBlock(newIdx, pkt.data); 
                i = 0; 
            } else if (pkt.indices.size === 0) {
                pendingPackets.splice(i, 1);
            } else {
                i++;
            }
        }

        if (decodedCount === rcvTotalBlocks) assembleAndDownload();
    }

    function updateReceiverStats() {
        let now = Date.now();
        let diff = now - lastStatTime;
        
        if (diff >= 1000) {
            sCapFps.innerText = statFramesCount.toFixed(1);
            sDecFps.innerText = statDecodeCount.toFixed(1);
            sDropped.innerText = statDropped;
            sUseless.innerText = statUseless;
            
            let kbps = (bytesReceived / 1024) / (diff / 1000);
            sGoodput.innerText = `${kbps.toFixed(2)} KB/s`;
            
            statFramesCount = 0; statDecodeCount = 0; bytesReceived = 0;
            lastStatTime = now;
        }
        
        let elapsed = Math.floor((now - rcvStartTime) / 1000);
        sElapsed.innerText = `${elapsed} s`;
        sDecoded.innerText = `${decodedCount} / ${rcvTotalBlocks || '?'}`;
        sPending.innerText = pendingPackets.length;
        
        if (rcvTotalBlocks > 0) {
            progressFill.style.width = `${(decodedCount / rcvTotalBlocks) * 100}%`;
        }
    }

    function assembleAndDownload() {
        isScanning = false;
        scannerFrame.hidden = true;
        sSession.innerText = 'HOÀN TẤT';
        sSession.style.color = "var(--primary)";
        sLock.innerText = 'XONG';
        
        let fullFile = new Uint8Array(rcvFilesize);
        let offset = 0;
        
        for (let i = 0; i < rcvTotalBlocks; i++) {
            let chunk = decodedBlocks[i];
            if (offset + chunk.length > rcvFilesize) {
                fullFile.set(chunk.subarray(0, rcvFilesize - offset), offset);
            } else {
                fullFile.set(chunk, offset);
            }
            offset += chunk.length;
        }
        
        const blob = new Blob([fullFile]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = rcvFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert("🎉 Truyền file hoàn tất!");
    }

    function stopReceiver() {
        isScanning = false;
        if (videoEl && videoEl.srcObject) {
            videoEl.srcObject.getTracks().forEach(track => track.stop());
            videoEl.srcObject = null;
        }
    }
});