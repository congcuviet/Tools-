document.addEventListener('DOMContentLoaded', function() {
    // UI Elements Giờ địa phương
    const localTimeText = document.getElementById('local-time-text');
    const localDateText = document.getElementById('local-date-text');
    const localTimezoneName = document.getElementById('local-timezone-name');
    
    // UI Controls
    const citySelect = document.getElementById('city-select');
    const addCityBtn = document.getElementById('add-city-btn');
    const clockGrid = document.getElementById('clock-grid');

    // Mặc định các thành phố ban đầu (nếu chưa có trong localStorage)
    const DEFAULT_CITIES = [
        { zone: 'Asia/Tokyo', name: '🇯🇵 Tokyo (Nhật Bản)' },
        { zone: 'Europe/London', name: '🇬🇧 London (Anh)' },
        { zone: 'America/New_York', name: '🇺🇸 New York (Mỹ)' }
    ];

    // Lấy danh sách từ LocalStorage hoặc gán mặc định
    let trackedCities = JSON.parse(localStorage.getItem('tracked_cities')) || DEFAULT_CITIES;

    // -------------------------------------------------------------
    // 1. CẬP NHẬT GIỜ ĐỊA PHƯƠNG
    // -------------------------------------------------------------
    function updateLocalClock() {
        const now = new Date();

        // Format Giờ (HH:mm:ss)
        const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false });
        localTimeText.innerText = timeStr;

        // Format Ngày
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        localDateText.innerText = now.toLocaleDateString('vi-VN', options);

        // Tên múi giờ người dùng
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        localTimezoneName.innerText = `Giờ Địa Phương (${userTz})`;
    }

    // -------------------------------------------------------------
    // 2. CẬP NHẬT LƯỚI THÀNH PHỐ THẾ GIỚI
    // -------------------------------------------------------------
    function updateWorldClocks() {
        const now = new Date();
        clockGrid.innerHTML = '';

        trackedCities.forEach((city, index) => {
            try {
                // Lấy giờ hiện tại của thành phố theo Múi Giờ IANA
                const cityTimeStr = now.toLocaleTimeString('en-US', {
                    timeZone: city.zone,
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                // Lấy Ngày
                const cityDateStr = now.toLocaleDateString('vi-VN', {
                    timeZone: city.zone,
                    weekday: 'short',
                    month: 'numeric',
                    day: 'numeric'
                });

                // Lấy Giờ (0-23) để xác định Ngày hay Đêm
                const hourInCity = parseInt(now.toLocaleTimeString('en-US', {
                    timeZone: city.zone,
                    hour12: false,
                    hour: '2-digit'
                }));

                const isNight = hourInCity < 6 || hourInCity >= 18; // Ban đêm từ 18h tới 6h sáng

                // Tính chênh lệch giờ so với giờ máy tính hiện tại
                const localOffset = -now.getTimezoneOffset() / 60; // Offset máy tính (giờ)
                
                // Tạo ngày ảo để đo offset thành phố
                const cityDateObj = new Date(now.toLocaleString('en-US', { timeZone: city.zone }));
                const localDateObj = new Date(now.toLocaleString('en-US'));
                const diffHours = Math.round((cityDateObj - localDateObj) / (1000 * 60 * 60));

                let diffText = '';
                if (diffHours === 0) diffText = 'Cùng giờ với bạn';
                else if (diffHours > 0) diffText = `Sớm hơn ${diffHours} giờ`;
                else diffText = `Chậm hơn ${Math.abs(diffHours)} giờ`;

                // --- TẠO CARD HTML ---
                const card = document.createElement('div');
                card.className = `city-card ${isNight ? 'is-night' : ''}`;
                card.innerHTML = `
                    <div class="card-top">
                        <h4 class="city-title">${city.name}</h4>
                        <button class="btn-remove" data-index="${index}" title="Xóa thành phố">✕</button>
                    </div>
                    <div>
                        <div class="city-time">${cityTimeStr}</div>
                        <div class="city-date">${cityDateStr}</div>
                    </div>
                    <div class="card-bottom">
                        <span class="daynight-icon">${isNight ? '🌙 Ban đêm' : '☀️ Ban ngày'}</span>
                        <span class="diff-tag">${diffText}</span>
                    </div>
                `;

                clockGrid.appendChild(card);
            } catch (e) {
                console.error(`Lỗi múi giờ: ${city.zone}`, e);
            }
        });

        // Gắn sự kiện Xóa
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                removeCity(idx);
            });
        });
    }

    // -------------------------------------------------------------
    // 3. THÊM / XÓA THÀNH PHỐ
    // -------------------------------------------------------------
    addCityBtn.addEventListener('click', function() {
        const val = citySelect.value;
        if (!val) return;

        const [zone, name] = val.split('|');

        // Kiểm tra xem đã trùng chưa
        const exists = trackedCities.some(c => c.zone === zone);
        if (exists) {
            alert('Thành phố này đã có trong danh sách!');
            return;
        }

        trackedCities.push({ zone, name });
        saveAndRefresh();
    });

    function removeCity(index) {
        trackedCities.splice(index, 1);
        saveAndRefresh();
    }

    function saveAndRefresh() {
        localStorage.setItem('tracked_cities', JSON.stringify(trackedCities));
        updateWorldClocks();
    }

    // -------------------------------------------------------------
    // 4. KHỞI CHẠY VÒNG LẶP REAL-TIME (1 giây / lần)
    // -------------------------------------------------------------
    updateLocalClock();
    updateWorldClocks();

    setInterval(() => {
        updateLocalClock();
        updateWorldClocks();
    }, 1000);
});