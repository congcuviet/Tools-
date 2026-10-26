document.addEventListener('DOMContentLoaded', async function() {
    const videoInput = document.getElementById('vblur-video-input');
    const videoName = document.getElementById('vblur-video-name');
    const iconVideo = document.getElementById('vblur-icon-video');
    
    const workspace = document.getElementById('vblur-workspace');
    const videoContainer = document.getElementById('vblur-video-container');
    const videoPlayer = document.getElementById('vblur-player');
    const selectorsWrapper = document.getElementById('vblur-selectors-wrapper');
    
    const settingsBox = document.getElementById('vblur-settings');
    const tasksListEl = document.getElementById('vblur-tasks-list');
    const btnAdd = document.getElementById('vblur-btn-add');
    const qualitySelect = document.getElementById('vblur-quality-select');

    const btnStart = document.getElementById('vblur-btn-start');
    const statusBox = document.getElementById('vblur-status-box');
    const statusText = document.getElementById('vblur-status-text');
    const detailText = document.getElementById('vblur-detail-text');
    const progressFill = document.getElementById('vblur-progress-fill');

    let videoFile = null;
    let ffmpeg = null;
    let videoNativeWidth = 0; 
    let videoNativeHeight = 0;
    let videoDuration = 0;

    // --- HỆ THỐNG QUẢN LÝ TÁC VỤ (TASKS) ---
    // Mỗi task lưu tỷ lệ phần trăm (0-100) để chống vỡ khung khi Resize trình duyệt
    let tasks = []; 
    let activeTaskId = null;

    function createNewTask() {
        const id = Date.now().toString();
        const start = Math.floor(videoPlayer.currentTime);
        const end = Math.min(Math.floor(videoDuration), start + 5); // Mặc định che 5 giây
        
        tasks.push({
            id: id,
            x_pct: 10, y_pct: 10, w_pct: 20, h_pct: 15, // Kích thước mặc định
            start: start,
            end: end,
            type: 'delogo',
            intensity: 15
        });
        
        activeTaskId = id;
        renderTasksUI();
        renderSelectors();
        
        // Tua video đến chỗ bắt đầu của Task mới để khách thấy ngay khung đỏ
        videoPlayer.currentTime = start; 
    }

    // Nút Thêm mới
    btnAdd.addEventListener('click', () => {
        if (!videoFile) return;
        videoPlayer.pause();
        createNewTask();
    });

    // Xóa Task
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        if (activeTaskId === id) activeTaskId = null;
        renderTasksUI();
        renderSelectors();
    }

    // --- RENDER GIAO DIỆN CỘT PHẢI (TASK CARDS) ---
    function renderTasksUI() {
        tasksListEl.innerHTML = '';
        if (tasks.length === 0) {
            tasksListEl.innerHTML = '<p style="text-align:center; color:#555; font-size:0.9rem;">Chưa có vùng che nào. Bấm Thêm vùng mới!</p>';
            return;
        }

        tasks.forEach((task, index) => {
            const card = document.createElement('div');
            card.className = `vblur-task-card ${task.id === activeTaskId ? 'active-card' : ''}`;
            card.onclick = (e) => {
                // Đổi active
                if (!e.target.closest('input') && !e.target.closest('select') && !e.target.closest('button')) {
                    activeTaskId = task.id;
                    videoPlayer.currentTime = task.start; // Tua video tới đây
                    videoPlayer.pause();
                    renderTasksUI();
                    renderSelectors();
                    updateSelectorsVisibility();
                }
            };

            card.innerHTML = `
                <div class="vblur-task-header">
                    <span>Vùng che #${index + 1}</span>
                    <button class="vblur-task-del" onclick="event.stopPropagation(); document.dispatchEvent(new CustomEvent('delTask', {detail: '${task.id}'}))">Xóa</button>
                </div>
                <div class="vblur-time-row">
                    <div class="vblur-time-input">Từ: <input type="number" step="0.1" min="0" value="${task.start}" onchange="document.dispatchEvent(new CustomEvent('updTask', {detail: {id: '${task.id}', key: 'start', val: this.value}}))">s</div>
                    <div class="vblur-time-input">Đến: <input type="number" step="0.1" min="0" value="${task.end}" onchange="document.dispatchEvent(new CustomEvent('updTask', {detail: {id: '${task.id}', key: 'end', val: this.value}}))">s</div>
                </div>
                <div class="neo-select-wrapper" style="margin-bottom: 10px;">
                    <select class="neo-select" onchange="document.dispatchEvent(new CustomEvent('updTask', {detail: {id: '${task.id}', key: 'type', val: this.value}}))">
                        <option value="delogo" ${task.type==='delogo'?'selected':''}>✨ Xóa Logo (Nội suy)</option>
                        <option value="boxblur" ${task.type==='boxblur'?'selected':''}>🌫️ Mờ đục (Boxblur)</option>
                        <option value="pixelate" ${task.type==='pixelate'?'selected':''}>🔲 Che mặt (Pixel)</option>
                    </select>
                </div>
                ${task.type !== 'delogo' ? `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:0.85rem; font-weight:bold;">Mờ:</span>
                    <input type="range" style="flex:1" min="5" max="50" value="${task.intensity}" onchange="document.dispatchEvent(new CustomEvent('updTask', {detail: {id: '${task.id}', key: 'intensity', val: this.value}}))">
                </div>
                ` : ''}
            `;
            tasksListEl.appendChild(card);
        });
    }

    // Lắng nghe sự kiện sửa/xóa từ UI nội bộ
    document.addEventListener('delTask', (e) => deleteTask(e.detail));
    document.addEventListener('updTask', (e) => {
        const { id, key, val } = e.detail;
        const task = tasks.find(t => t.id === id);
        if(task) {
            task[key] = (key==='start'||key==='end'||key==='intensity') ? parseFloat(val) : val;
            if(key==='start' || key==='end') updateSelectorsVisibility();
            if(key==='type') renderTasksUI(); // Render lại để ẩn/hiện thanh cường độ
        }
    });

    // --- RENDER GIAO DIỆN CỘT TRÁI (KHUNG KÉO THẢ) ---
    function renderSelectors() {
        selectorsWrapper.innerHTML = '';
        tasks.forEach((task, index) => {
            const sel = document.createElement('div');
            sel.className = `vblur-selector ${task.id === activeTaskId ? 'active-sel' : ''}`;
            sel.id = `sel-${task.id}`;
            sel.setAttribute('data-id', task.id);
            
            sel.style.left = `${task.x_pct}%`;
            sel.style.top = `${task.y_pct}%`;
            sel.style.width = `${task.w_pct}%`;
            sel.style.height = `${task.h_pct}%`;

            sel.innerHTML = `
                <span class="vblur-selector-text">#${index + 1}</span>
                <div class="vblur-resizer"></div>
            `;
            selectorsWrapper.appendChild(sel);
        });
        updateSelectorsVisibility();
    }

    // ẨN HIỆN KHUNG ĐỎ THEO TIMELINE VIDEO
    function updateSelectorsVisibility() {
        const t = videoPlayer.currentTime;
        tasks.forEach(task => {
            const el = document.getElementById(`sel-${task.id}`);
            if (el) {
                if (t >= task.start && t <= task.end) {
                    el.style.display = 'flex';
                } else {
                    el.style.display = 'none';
                }
            }
        });
    }

    videoPlayer.addEventListener('timeupdate', updateSelectorsVisibility);

    // ==========================================
    // LOGIC KÉO THẢ (DRAG & RESIZE) DÙNG PERCENTAGE %
    // ==========================================
    let isDragging = false;
    let isResizing = false;
    let dragStartX, dragStartY, initLeft, initTop, initWidth, initHeight;

    videoContainer.addEventListener('mousedown', (e) => {
        const selNode = e.target.closest('.vblur-selector');
        if (!selNode) return;
        
        const taskId = selNode.getAttribute('data-id');
        
        // Đổi active
        if (activeTaskId !== taskId) {
            activeTaskId = taskId;
            renderTasksUI();
            renderSelectors(); // Quét lại class active
        }

        const el = document.getElementById(`sel-${taskId}`);
        if (e.target.classList.contains('vblur-resizer')) {
            isResizing = true;
        } else {
            isDragging = true;
        }

        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initLeft = el.offsetLeft;
        initTop = el.offsetTop;
        initWidth = el.offsetWidth;
        initHeight = el.offsetHeight;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeTaskId || (!isDragging && !isResizing)) return;
        const el = document.getElementById(`sel-${activeTaskId}`);
        const task = tasks.find(t => t.id === activeTaskId);
        const rect = videoContainer.getBoundingClientRect();

        let dx = e.clientX - dragStartX;
        let dy = e.clientY - dragStartY;

        if (isDragging) {
            let newLeft = initLeft + dx;
            let newTop = initTop + dy;
            
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + initWidth > rect.width) newLeft = rect.width - initWidth;
            if (newTop + initHeight > rect.height) newTop = rect.height - initHeight;
            
            task.x_pct = (newLeft / rect.width) * 100;
            task.y_pct = (newTop / rect.height) * 100;
            
            el.style.left = `${task.x_pct}%`;
            el.style.top = `${task.y_pct}%`;

        } else if (isResizing) {
            let newW = initWidth + dx;
            let newH = initHeight + dy;
            
            if (newW < 20) newW = 20; // Min size
            if (newH < 20) newH = 20;
            if (initLeft + newW > rect.width) newW = rect.width - initLeft;
            if (initTop + newH > rect.height) newH = rect.height - initTop;

            task.w_pct = (newW / rect.width) * 100;
            task.h_pct = (newH / rect.height) * 100;
            
            el.style.width = `${task.w_pct}%`;
            el.style.height = `${task.h_pct}%`;
        }
    });

    document.addEventListener('mouseup', () => { isDragging = false; isResizing = false; });

    // --- UPLOAD VIDEO ---
    videoInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            videoFile = e.target.files[0];
            iconVideo.innerText = "✅";
            videoName.innerText = videoFile.name;
            document.getElementById('vblur-box-video').style.background = "var(--clr-blue)";
            document.getElementById('vblur-box-video').style.color = "#fff";
            
            videoPlayer.src = URL.createObjectURL(videoFile);
            videoPlayer.onloadedmetadata = () => {
                videoNativeWidth = videoPlayer.videoWidth; 
                videoNativeHeight = videoPlayer.videoHeight;
                videoDuration = videoPlayer.duration;
                
                workspace.style.display = 'block';
                settingsBox.style.display = 'block';
                btnStart.disabled = false;
                
                // Reset Tasks khi tải video mới
                tasks = [];
                createNewTask();
            };
        }
    });

    // --- BẮT ĐẦU FFMPEG RENDER ---
    btnStart.addEventListener('click', async () => {
        if (!videoFile) return;
        if (tasks.length === 0) return alert("Bạn chưa tạo Vùng che nào!");

        const quality = qualitySelect.value;
        
        videoPlayer.pause();
        btnStart.disabled = true;
        statusBox.style.display = 'block';
        statusText.innerText = "Đang khởi tạo thuật toán (Wasm)...";
        progressFill.style.width = `2%`;
        progressFill.style.background = "var(--clr-crimson)"; 
        detailText.innerText = "";

        try {
            // HYBRID TRACKER CHUẨN
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

            statusText.innerText = "Đang nạp file vào RAM...";
            const { fetchFile } = FFmpeg;
            const ext = videoFile.name.split('.').pop();
            const inputVid = `input.${ext}`;
            const outputName = `output.mp4`; 

            ffmpeg.FS('writeFile', inputVid, await fetchFile(videoFile));

            // THUẬT TOÁN SINH LỆNH FILTER_COMPLEX ĐA TIMELINE SIÊU CẤP
            let filterComplex = "";
            let currentStream = "[0:v]";

            tasks.forEach((task, index) => {
                // Ánh xạ % sang Pixel thực
                let x = Math.round((task.x_pct / 100) * videoNativeWidth);
                let y = Math.round((task.y_pct / 100) * videoNativeHeight);
                let w = Math.round((task.w_pct / 100) * videoNativeWidth);
                let h = Math.round((task.h_pct / 100) * videoNativeHeight);

                // Validation an toàn
                if (x < 0) x = 0; if (y < 0) y = 0;
                if (w < 2) w = 2; if (h < 2) h = 2;
                if (x + w > videoNativeWidth) w = videoNativeWidth - x - 1;
                if (y + h > videoNativeHeight) h = videoNativeHeight - y - 1;

                let nextStream = `[v${index}]`;
                let isLast = (index === tasks.length - 1);
                let outStream = isLast ? "[vout]" : nextStream;

                if (task.type === 'delogo') {
                    filterComplex += `${currentStream}delogo=x=${x}:y=${y}:w=${w}:h=${h}:enable='between(t,${task.start},${task.end})'${outStream};`;
                    currentStream = outStream;
                } else {
                    // Boxblur & Pixelate phải tách luồng (split) để xử lý crop -> rồi dán đè lên (overlay) theo enable
                    let bgStream = `[bg${index}]`;
                    let fgStream = `[fg${index}]`;
                    let blurStream = `[blur${index}]`;

                    filterComplex += `${currentStream}split=2${bgStream}${fgStream};`;

                    if (task.type === 'boxblur') {
                        filterComplex += `${fgStream}crop=${w}:${h}:${x}:${y},boxblur=${task.intensity}:1${blurStream};`;
                    } else if (task.type === 'pixelate') {
                        filterComplex += `${fgStream}crop=${w}:${h}:${x}:${y},scale=iw/${task.intensity}:-1,scale=${w}:${h}:flags=neighbor${blurStream};`;
                    }

                    filterComplex += `${bgStream}${blurStream}overlay=${x}:${y}:enable='between(t,${task.start},${task.end})'${outStream};`;
                    currentStream = outStream;
                }
            });

            // Xóa dấu chấm phẩy cuối cùng
            if (filterComplex.endsWith(';')) filterComplex = filterComplex.slice(0, -1);
            
            let ffmpegArgs = [ 
                '-i', inputVid, 
                '-filter_complex', filterComplex, 
                '-map', '[vout]',
                '-map', '0:a?',
                '-c:a', 'copy' 
            ];

            if (quality === 'high') {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'fast', '-crf', '18');
            } else {
                ffmpegArgs.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '24');
            }
            
            // Cờ chống kẹt 100%
            ffmpegArgs.push('-movflags', '+faststart', outputName);

            statusText.innerText = `Đang bắt đầu thuật toán AI...`;
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
            a.download = `${baseName}_blurred_congcuviet.mp4`;
            a.click();
            URL.revokeObjectURL(url);

            ffmpeg.FS('unlink', inputVid);
            ffmpeg.FS('unlink', outputName);

            statusText.innerText = `🎉 Tuyệt vời! Video đã được xử lý xong.`;
            detailText.innerText = "Xem phần tải về xem video đã tải về hoàn thành chưa bạn nhé";

        } catch (error) {
            console.error("Lỗi Blur Video:", error);
            statusText.innerText = "❌ Xảy ra sự cố khi render.";
            detailText.innerText = "Có thể RAM của bạn đã bị tràn. Hãy F12 để kiểm tra Log.";
            progressFill.style.background = "var(--clr-danger)";
        } finally {
            btnStart.disabled = false;
        }
    });
});