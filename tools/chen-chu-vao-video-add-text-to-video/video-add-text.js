document.addEventListener('DOMContentLoaded', async function() {
    const videoInput = document.getElementById('vtxt-video-input');
    const videoName = document.getElementById('vtxt-video-name');
    const iconVideo = document.getElementById('vtxt-icon-video');
    
    const workspace = document.getElementById('vtxt-workspace');
    const videoContainer = document.getElementById('vtxt-video-container');
    const videoPlayer = document.getElementById('vtxt-player');
    const selectorsWrapper = document.getElementById('vtxt-selectors-wrapper');
    
    const settingsBox = document.getElementById('vtxt-settings');
    const tasksListEl = document.getElementById('vtxt-tasks-list');
    const btnAdd = document.getElementById('vtxt-btn-add');
    const qualitySelect = document.getElementById('vtxt-quality-select');

    const btnStart = document.getElementById('vtxt-btn-start');
    const statusBox = document.getElementById('vtxt-status-box');
    const statusText = document.getElementById('vtxt-status-text');
    const detailText = document.getElementById('vtxt-detail-text');
    const progressFill = document.getElementById('vtxt-progress-fill');

    let videoFile = null;
    let ffmpeg = null;
    let videoNativeWidth = 0; 
    let videoNativeHeight = 0;
    let videoDuration = 0;

    // --- QUẢN LÝ TÁC VỤ (TASKS) ---
    let tasks = []; 
    let activeTaskId = null;

    // Hàm tạo ảnh PNG siêu nét từ Text (Canvas)
    function createTextPNG(text, color) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const fontSize = 120; // Size lớn để nét
            ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
            const metrics = ctx.measureText(text);
            
            canvas.width = metrics.width + 40; 
            canvas.height = fontSize * 1.5; 
            
            ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = color;
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 20, canvas.height / 2);
            
            canvas.toBlob(blob => resolve(blob), 'image/png');
        });
    }

    async function createNewTask() {
        const id = Date.now().toString();
        const start = Math.floor(videoPlayer.currentTime);
        const end = Math.min(Math.floor(videoDuration), start + 5); 
        
        let newTask = {
            id: id,
            text: 'Chữ của bạn',
            color: '#ffffff',
            size_pct: 30, // Chữ chiếm 30% bề ngang video
            x_pct: 35, y_pct: 40, // Nằm giữa giữa
            start: start,
            end: end,
            blobUrl: null
        };
        
        // Vẽ ảnh PNG
        const blob = await createTextPNG(newTask.text, newTask.color);
        newTask.blobUrl = URL.createObjectURL(blob);
        
        tasks.push(newTask);
        activeTaskId = id;
        
        renderTasksUI();
        renderWorkspaceText();
        videoPlayer.currentTime = start; 
    }

    btnAdd.addEventListener('click', () => {
        if (!videoFile) return;
        videoPlayer.pause();
        createNewTask();
    });

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        if (activeTaskId === id) activeTaskId = null;
        renderTasksUI();
        renderWorkspaceText();
    }

    // --- RENDER GIAO DIỆN TASK CARDS ---
    function renderTasksUI() {
        tasksListEl.innerHTML = '';
        if (tasks.length === 0) {
            tasksListEl.innerHTML = '<p style="text-align:center; color:#555; font-size:0.9rem;">Chưa có chữ nào. Bấm Thêm chữ mới!</p>';
            return;
        }

        tasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = `vtxt-task-card ${task.id === activeTaskId ? 'active-card' : ''}`;
            card.onclick = (e) => {
                if (!e.target.closest('input') && !e.target.closest('button')) {
                    activeTaskId = task.id;
                    videoPlayer.currentTime = task.start; 
                    videoPlayer.pause();
                    renderTasksUI();
                    renderWorkspaceText();
                    updateVisibility();
                }
            };

            card.innerHTML = `
                <div class="vtxt-task-header">
                    <span>Văn bản #${index + 1}</span>
                    <button class="vtxt-task-del" onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('delTextTask', {detail: '${task.id}'}))">Xóa</button>
                </div>
                <input type="text" class="vtxt-input-text" value="${task.text}" oninput="document.dispatchEvent(new CustomEvent('updTextTask', {detail: {id: '${task.id}', key: 'text', val: this.value}}))">
                
                <div class="vtxt-flex-between">
                    <div class="vtxt-time-row">
                        <div class="vtxt-time-input">Từ: <input type="number" step="0.1" min="0" value="${task.start}" onchange="document.dispatchEvent(new CustomEvent('updTextTask', {detail: {id: '${task.id}', key: 'start', val: this.value}}))">s</div>
                        <div class="vtxt-time-input">Đến: <input type="number" step="0.1" min="0" value="${task.end}" onchange="document.dispatchEvent(new CustomEvent('updTextTask', {detail: {id: '${task.id}', key: 'end', val: this.value}}))">s</div>
                    </div>
                    <input type="color" class="vtxt-color-picker" value="${task.color}" onchange="document.dispatchEvent(new CustomEvent('updTextTask', {detail: {id: '${task.id}', key: 'color', val: this.value}}))">
                </div>
                
                <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                    <span style="font-size:0.85rem; font-weight:bold;">Độ lớn:</span>
                    <input type="range" style="flex:1" min="10" max="90" value="${task.size_pct}" oninput="document.dispatchEvent(new CustomEvent('updTextTask', {detail: {id: '${task.id}', key: 'size_pct', val: this.value}}))">
                </div>
            `;
            tasksListEl.appendChild(card);
        });
    }

    document.addEventListener('delTextTask', (e) => deleteTask(e.detail));
    document.addEventListener('updTextTask', async (e) => {
        const { id, key, val } = e.detail;
        const task = tasks.find(t => t.id === id);
        if(task) {
            task[key] = (key==='start'||key==='end'||key==='size_pct') ? parseFloat(val) : val;
            
            // Nếu đổi Text hoặc Màu, phải vẽ lại ảnh PNG
            if(key==='text' || key==='color') {
                const blob = await createTextPNG(task.text, task.color);
                task.blobUrl = URL.createObjectURL(blob);
            }
            
            if(key==='start' || key==='end') updateVisibility();
            
            renderWorkspaceText(); // Cập nhật ngay trên video
        }
    });

    // --- RENDER ẢNH CHỮ LÊN WORKSPACE (VIDEO) ---
    function renderWorkspaceText() {
        selectorsWrapper.innerHTML = '';
        tasks.forEach((task) => {
            const img = document.createElement('img');
            img.className = `vtxt-text-element ${task.id === activeTaskId ? 'active-sel' : ''}`;
            img.id = `txt-${task.id}`;
            img.setAttribute('data-id', task.id);
            img.src = task.blobUrl;
            
            img.style.left = `${task.x_pct}%`;
            img.style.top = `${task.y_pct}%`;
            img.style.width = `${task.size_pct}%`; 
            
            selectorsWrapper.appendChild(img);
        });
        updateVisibility();
    }

    function updateVisibility() {
        const t = videoPlayer.currentTime;
        tasks.forEach(task => {
            const el = document.getElementById(`txt-${task.id}`);
            if (el) {
                if (t >= task.start && t <= task.end) el.style.display = 'block';
                else el.style.display = 'none';
            }
        });
    }

    videoPlayer.addEventListener('timeupdate', updateVisibility);

    // ==========================================
    // LOGIC KÉO THẢ TỌA ĐỘ
    // ==========================================
    let isDragging = false;
    let dragStartX, dragStartY, initLeft, initTop;

    videoContainer.addEventListener('mousedown', (e) => {
        const selNode = e.target.closest('.vtxt-text-element');
        if (!selNode) return;
        
        const taskId = selNode.getAttribute('data-id');
        if (activeTaskId !== taskId) {
            activeTaskId = taskId;
            renderTasksUI();
            renderWorkspaceText();
        }

        const el = document.getElementById(`txt-${taskId}`);
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initLeft = el.offsetLeft;
        initTop = el.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeTaskId || !isDragging) return;
        const el = document.getElementById(`txt-${activeTaskId}`);
        const task = tasks.find(t => t.id === activeTaskId);
        const rect = videoContainer.getBoundingClientRect();

        let dx = e.clientX - dragStartX;
        let dy = e.clientY - dragStartY;

        let newLeft = initLeft + dx;
        let newTop = initTop + dy;
        
        // Không cho chữ bay hẳn ra ngoài
        if (newLeft < -el.offsetWidth/2) newLeft = -el.offsetWidth/2;
        if (newTop < -el.offsetHeight/2) newTop = -el.offsetHeight/2;
        if (newLeft > rect.width - el.offsetWidth/2) newLeft = rect.width - el.offsetWidth/2;
        if (newTop > rect.height - el.offsetHeight/2) newTop = rect.height - el.offsetHeight/2;
        
        task.x_pct = (newLeft / rect.width) * 100;
        task.y_pct = (newTop / rect.height) * 100;
        
        el.style.left = `${task.x_pct}%`;
        el.style.top = `${task.y_pct}%`;
    });

    document.addEventListener('mouseup', () => { isDragging = false; });

    // --- UPLOAD VIDEO ---
    videoInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            iconVideo.innerText = "✅";
            videoName.innerText = videoFile.name;
            
            videoPlayer.src = URL.createObjectURL(videoFile);
            videoPlayer.onloadedmetadata = () => {
                videoNativeWidth = videoPlayer.videoWidth; 
                videoNativeHeight = videoPlayer.videoHeight;
                videoDuration = videoPlayer.duration;
                
                workspace.style.display = 'block';
                settingsBox.style.display = 'block';
                btnStart.disabled = false;
                
                tasks = [];
                tasksListEl.innerHTML = '<p style="text-align:center; color:#555;">Sẵn sàng! Hãy Thêm chữ mới.</p>';
            };
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER ---
    btnStart.addEventListener('click', async () => {
        if (!videoFile) return;
        if (tasks.length === 0) return alert("Bạn chưa thêm dòng chữ nào!");

        const quality = qualitySelect.value;
        
        videoPlayer.pause();
        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo thuật toán (Wasm)...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-purple)"; 
        detailText.innerText = "";

        try {
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
                                        statusText.innerText = `Đang Render Timeline: ${p}%`;
                                    }
                                }
                            }
                        }
                    }
                });
                await ffmpeg.load();
            }

            statusText.innerText = "Đang nạp Video và Ảnh chữ vào RAM...";
            const { fetchFile } = FFmpeg;
            
            const ext = videoFile.name.split('.').pop();
            const inputVid = `video.${ext}`;
            const outputName = `output.mp4`; 

            ffmpeg.FS('writeFile', inputVid, await fetchFile(videoFile));

            let ffmpegArgs = [ '-i', inputVid ];
            
            // Nạp từng file ảnh PNG (được gen từ Canvas) vào FFmpeg
            for (let i = 0; i < tasks.length; i++) {
                // Phải fetchBlob từ blobUrl
                const response = await fetch(tasks[i].blobUrl);
                const blob = await response.blob();
                
                const txtImgName = `txt_${i}.png`;
                ffmpegArgs.push('-i', txtImgName);
                ffmpeg.FS('writeFile', txtImgName, await fetchFile(blob));
            }

            // BUILD FILTER_COMPLEX MA THUẬT
            let filterComplex = "";
            let currentStream = "[0:v]";

            tasks.forEach((task, index) => {
                let imgInputIndex = index + 1; // 0 là video, 1 là ảnh 1, 2 là ảnh 2...
                let scaledTxt = `[scaled_${index}]`;
                
                // Quy đổi Tọa độ ra Pixel thực của Video
                let w = Math.round((task.size_pct / 100) * videoNativeWidth);
                let x = Math.round((task.x_pct / 100) * videoNativeWidth);
                let y = Math.round((task.y_pct / 100) * videoNativeHeight);

                // Scale ảnh chữ chuẩn size
                filterComplex += `[${imgInputIndex}:v]scale=${w}:-1${scaledTxt};`;
                
                let nextStream = `[v${index}]`;
                let outStream = (index === tasks.length - 1) ? "[vout]" : nextStream;

                // Ghép đè theo Timeline enable='between...'
                filterComplex += `${currentStream}${scaledTxt}overlay=x=${x}:y=${y}:enable='between(t,${task.start},${task.end})'${outStream};`;
                currentStream = outStream;
            });

            if (filterComplex.endsWith(';')) filterComplex = filterComplex.slice(0, -1);
            
            ffmpegArgs.push('-filter_complex', filterComplex);
            ffmpegArgs.push('-map', '[vout]', '-map', '0:a?', '-c:a', 'copy');

            // Encode Video
            if (quality === 'high') {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '18');
            } else {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24');
            }
            
            // Chống kẹt 100%
            ffmpegArgs.push('-movflags', '+faststart', outputName);

            statusText.innerText = `Đang bắt đầu thuật toán ghép nhiều luồng...`;
            await ffmpeg.run(...ffmpegArgs);

            // Xuất File
            progressFill.style.width = `100%`;
            statusText.innerText = "Hoàn tất! Đang đóng gói file...";
            
            const data = ffmpeg.FS('readFile', outputName);
            if (data.length === 0) throw new Error("File xuất ra rỗng.");

            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            let baseName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
            if (!baseName) baseName = videoFile.name;
            a.download = `${baseName}_text_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            // Dọn RAM
            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputName);
            for (let i = 0; i < tasks.length; i++) {
                ffmpeg.FS('unlink', `txt_${i}.png`);
            }

            statusText.innerText = `🎉 Tuyệt vời! Video đã được chèn chữ xong.`;
            detailText.innerText = "Sản phẩm của bạn đã sẵn sàng chia sẻ.";

        } catch (error) {
            console.error("Lỗi Add Text:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi render.";
            detailText.innerText = "Có thể trình duyệt hết RAM do nhiều ảnh quá. Hãy F12 kiểm tra Log.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
        }
    });
});