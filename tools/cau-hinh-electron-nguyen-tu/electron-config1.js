document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('elSearchInput');
    const suggestBox = document.getElementById('elSuggestBox');
    const resultArea = document.getElementById('eResultArea');
    const staticConfigArea = document.getElementById('staticConfigArea');
    
    // UI Elements Dynamic
    const elNameTitle = document.getElementById('elNameTitle');
    const elZBadge = document.getElementById('elZBadge');
    const configText = document.getElementById('configText');
    const orbitalDiagram = document.getElementById('orbitalDiagram');
    const bohrModel = document.getElementById('bohrModel');
    const ionStateLabel = document.getElementById('ionStateLabel');
    const eWarning = document.getElementById('eWarning');

    let elementsDB = [];
    let searchList = [];
    let currentElement = null;
    let currentElectrons = 0;

    // Bảng màu cho các Nhóm (Khớp với các tool trước)
    const colorMap = {
        "Phi kim": "#a6ff96", "Khí hiếm": "#c6e2ff", "Kim loại kiềm": "#ffb3ba",
        "Kim loại kiềm thổ": "#ffdfba", "Á kim": "#ffffba", "Kim loại yếu": "#baffc9",
        "Kim loại chuyển tiếp": "#f0c2e0", "Họ Lantan": "#e0bbe4", "Họ Actini": "#f4dbf9", "Chưa rõ": "#e0e0e0"
    };

    const nobleGases = {
        "[He]": "1s2", "[Ne]": "1s2 2s2 2p6", "[Ar]": "1s2 2s2 2p6 3s2 3p6", 
        "[Kr]": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6", 
        "[Xe]": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6", 
        "[Rn]": "1s2 2s2 2p6 3s2 3p6 4s2 3d10 4p6 5s2 4d10 5p6 6s2 4f14 5d10 6p6"
    };

    const subshellBoxes = { 's': 1, 'p': 3, 'd': 5, 'f': 7 };
    const maxE = { 's': 2, 'p': 6, 'd': 10, 'f': 14 };

    // ==========================================
    // 1. TẢI DATABASE BẢNG TUẦN HOÀN
    // ==========================================
    const basePath = '/wp-content/themes/bricks-child/tai-nguyen/';
    fetch(basePath + 'elements_db.json')
        .then(res => res.json())
        .then(data => {
            elementsDB = data;
            elementsDB.forEach(el => {
                searchList.push({
                    id: el.number, sym: el.symbol, name: el.name_en,
                    searchStr: `${el.symbol} ${el.name_en}`.toLowerCase()
                });
            });
            console.log("✅ Tải xong DB Cấu hình Electron!");
            
            // Tải xong thì gọi hàm render bảng tĩnh luôn
            renderStaticConfigArea();
        });

    // ==========================================
    // 2. AUTOCOMPLETE TÌM KIẾM
    // ==========================================
    searchInput.addEventListener('input', (e) => {
        let query = e.target.value.trim().toLowerCase();
        suggestBox.innerHTML = '';
        if (query.length < 1) { suggestBox.classList.add('hidden'); return; }

        let matches = searchList.filter(item => item.searchStr.includes(query)).slice(0, 10);
        if (matches.length > 0) {
            matches.forEach(item => {
                let li = document.createElement('li');
                li.innerHTML = `<span>${item.name}</span> <span class="dropdown-sym">${item.sym} (Z=${item.id})</span>`;
                li.addEventListener('mousedown', () => {
                    searchInput.value = item.name;
                    suggestBox.classList.add('hidden');
                    loadElementData(item.id);
                });
                suggestBox.appendChild(li);
            });
            suggestBox.classList.remove('hidden');
        } else {
            suggestBox.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target !== searchInput) suggestBox.classList.add('hidden');
    });

    // ==========================================
    // 3. XỬ LÝ LOGIC CẤU HÌNH ELECTRON
    // ==========================================
    const loadElementData = (z) => {
        currentElement = elementsDB.find(el => el.number === z);
        if (!currentElement) return;

        currentElectrons = currentElement.number;
        renderDynamicSection(currentElectrons);
        
        elNameTitle.innerText = `${currentElement.name_en} (${currentElement.symbol})`;
        elZBadge.innerText = `Z = ${currentElement.number}`;
        resultArea.classList.remove('hidden');
    };

    const parseConfig = (confStr) => {
        let expanded = confStr;
        Object.keys(nobleGases).forEach(ng => {
            if(expanded.includes(ng)) expanded = expanded.replace(ng, nobleGases[ng]);
        });

        let parts = expanded.trim().split(/\s+/);
        return parts.map(p => {
            let match = p.match(/^(\d)([spdf])(\d+)$/);
            if(match) return { n: parseInt(match[1]), l: match[2], e: parseInt(match[3]), raw: p };
            return null;
        }).filter(x => x !== null);
    };

    const calculateIonConfig = (targetE) => {
        let parsed = parseConfig(currentElement.electron_config);
        let diff = currentElement.number - targetE;

        if (diff > 0) {
            let lVal = {'s':0, 'p':1, 'd':2, 'f':3};
            for (let i = 0; i < diff; i++) {
                parsed.sort((a, b) => {
                    if (b.n !== a.n) return b.n - a.n;
                    return lVal[b.l] - lVal[a.l];
                });
                let outer = parsed.find(sub => sub.e > 0);
                if (outer) outer.e--;
            }
        } else if (diff < 0) {
            let added = 0;
            let lVal = {'s':0, 'p':1, 'd':2, 'f':3};
            parsed.sort((a, b) => {
                let nL_A = a.n + lVal[a.l]; let nL_B = b.n + lVal[b.l];
                if(nL_A !== nL_B) return nL_A - nL_B;
                return a.n - b.n;
            });
            while(added < Math.abs(diff)) {
                let notFull = parsed.find(sub => sub.e < maxE[sub.l]);
                if (notFull) { notFull.e++; added++; } else break;
            }
        }

        return parsed.filter(sub => sub.e > 0).sort((a,b) => {
            let lVal = {'s':0, 'p':1, 'd':2, 'f':3};
            if(a.n !== b.n) return a.n - b.n;
            return lVal[a.l] - lVal[b.l];
        });
    };

    const renderDynamicSection = (targetE) => {
        let activeConfigArray = calculateIonConfig(targetE);

        // A. Cập nhật Text Cấu hình
        let configHtml = activeConfigArray.map(sub => `${sub.n}${sub.l}<sup>${sub.e}</sup>`).join(' ');
        configText.innerHTML = configHtml || "<i>Trống</i>";

        // B. Cập nhật Label Ion
        let charge = currentElement.number - targetE;
        if (charge === 0) {
            ionStateLabel.innerText = "Trạng thái cơ bản";
            ionStateLabel.className = "ion-state-label";
            eWarning.classList.add('hidden');
        } else if (charge > 0) {
            ionStateLabel.innerText = `Cation ${currentElement.symbol} ${charge}+`;
            ionStateLabel.className = "ion-state-label active-ion";
            eWarning.innerText = `💡 Lưu ý: Kim loại lột electron ở lớp vỏ ngoài cùng (n lớn nhất) trước. Ví dụ Sắt mất e ở 4s trước rồi mới đến 3d.`;
            eWarning.classList.remove('hidden');
        } else {
            ionStateLabel.innerText = `Anion ${currentElement.symbol} ${Math.abs(charge)}-`;
            ionStateLabel.className = "ion-state-label active-ion";
            eWarning.classList.add('hidden');
        }

        // C. Vẽ Hộp Orbital (Hund's Rule)
        orbitalDiagram.innerHTML = '';
        activeConfigArray.forEach(sub => {
            let group = document.createElement('div');
            group.className = 'subshell-group';
            
            let label = document.createElement('div'); label.className = 'subshell-label'; label.innerText = `${sub.n}${sub.l}`;
            let wrapper = document.createElement('div'); wrapper.className = 'boxes-wrapper';

            let numBoxes = subshellBoxes[sub.l];
            let electrons = sub.e;
            
            let boxes = Array(numBoxes).fill('');
            for (let i = 0; i < numBoxes && electrons > 0; i++) { boxes[i] += '<span class="arrow-up">↑</span>'; electrons--; }
            for (let i = 0; i < numBoxes && electrons > 0; i++) { boxes[i] += '<span class="arrow-down">↓</span>'; electrons--; }

            boxes.forEach(b => {
                let boxDiv = document.createElement('div'); boxDiv.className = 'orbital-box'; boxDiv.innerHTML = b;
                wrapper.appendChild(boxDiv);
            });

            group.appendChild(wrapper); group.appendChild(label); orbitalDiagram.appendChild(group);
        });

        // D. Vẽ Mô hình Bohr
        drawBohrModel(activeConfigArray);
    };

    const drawBohrModel = (configArray) => {
        bohrModel.innerHTML = '';
        let nucleus = document.createElement('div'); nucleus.className = 'bohr-nucleus'; nucleus.innerText = currentElement.symbol;
        bohrModel.appendChild(nucleus);

        let shellsCount = [];
        configArray.forEach(sub => { let nIndex = sub.n - 1; shellsCount[nIndex] = (shellsCount[nIndex] || 0) + sub.e; });

        let durationBase = 5;
        shellsCount.forEach((eCount, index) => {
            if (!eCount) return;
            let radius = (index + 1) * 32; 
            let shellDiv = document.createElement('div'); shellDiv.className = 'bohr-shell bohr-shell-animate';
            shellDiv.style.width = `${radius * 2}px`; shellDiv.style.height = `${radius * 2}px`;
            shellDiv.style.animationDuration = `${durationBase + index * 3}s`;

            for (let i = 0; i < eCount; i++) {
                let angle = (360 / eCount) * i;
                let electron = document.createElement('div'); electron.className = 'bohr-electron';
                electron.style.transform = `rotate(${angle}deg) translateX(${radius}px)`;
                shellDiv.appendChild(electron);
            }
            bohrModel.appendChild(shellDiv);
        });
    };

    // Control Ion
    document.getElementById('btnRemoveE').addEventListener('click', () => { if (currentElectrons > 1) { currentElectrons--; renderDynamicSection(currentElectrons); } });
    document.getElementById('btnAddE').addEventListener('click', () => { if (currentElectrons < currentElement.number + 5) { currentElectrons++; renderDynamicSection(currentElectrons); } });
    document.getElementById('btnResetE').addEventListener('click', () => { if (currentElement) { currentElectrons = currentElement.number; renderDynamicSection(currentElectrons); } });

    // ==========================================
    // 4. RENDER BẢNG PHÂN LOẠI TĨNH Ở DƯỚI
    // ==========================================
    const renderStaticConfigArea = () => {
        const grouped = {};
        elementsDB.forEach(el => {
            if (!grouped[el.category]) grouped[el.category] = [];
            grouped[el.category].push(el);
        });

        let fullHtml = '';
        for (let cat in grouped) {
            let bgColor = colorMap[cat] || "#eee";
            
            // Xây dựng danh sách các Card Nguyên tố cho nhóm này
            let cardsHtml = grouped[cat].map(el => {
                // Biến đổi chuỗi [Ar] 3d6 4s2 thành [Ar] 3d<sup>6</sup> 4s<sup>2</sup>
                let htmlConfig = (el.electron_config || "").replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>');
                
                return `
                    <div class="e-mini-card" data-z="${el.number}">
                        <div class="e-mini-sym">${el.symbol}</div>
                        <div class="e-mini-info">
                            <span class="e-mini-name">${el.number}. ${el.name_en}</span>
                            <span class="e-mini-conf">${htmlConfig}</span>
                        </div>
                    </div>
                `;
            }).join('');

            fullHtml += `
                <div class="e-group-box">
                    <div class="e-group-header" style="background-color: ${bgColor}">
                        <span>${cat}</span>
                        <span style="background:#000; color:#fff; padding:2px 10px; border-radius:15px; font-size:0.9rem;">${grouped[cat].length}</span>
                    </div>
                    <div class="e-group-grid">${cardsHtml}</div>
                </div>
            `;
        }
        
        staticConfigArea.innerHTML = fullHtml;

        // Gắn sự kiện: Bấm vào thẻ tĩnh -> Lướt lên thẻ Động -> Chọn nguyên tố
        document.querySelectorAll('.e-mini-card').forEach(card => {
            card.addEventListener('click', () => {
                let z = parseInt(card.getAttribute('data-z'));
                loadElementData(z);
                // Cuộn mượt mà lên vị trí hiển thị cấu hình động
                document.querySelector('.e-neo-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    };
});