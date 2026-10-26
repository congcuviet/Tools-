document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('tzc-form');
    const inputTime = document.getElementById('tzc-input-time');
    const btnSetNow = document.getElementById('btn-set-now');
    const selectSource = document.getElementById('tzc-source');
    const selectTarget = document.getElementById('tzc-target');
    const btnSwap = document.getElementById('tzc-btn-swap');
    const resultBox = document.getElementById('tzc-result');

    // Mảng Data Múi Giờ Phổ Biến
    const TIMEZONES = [
        { zone: "Asia/Ho_Chi_Minh", name: "🇻🇳 Việt Nam (UTC+7)" },
        { zone: "Asia/Tokyo", name: "🇯🇵 Tokyo, Nhật Bản (UTC+9)" },
        { zone: "Asia/Seoul", name: "🇰🇷 Seoul, Hàn Quốc (UTC+9)" },
        { zone: "Asia/Bangkok", name: "🇹🇭 Bangkok, Thái Lan (UTC+7)" },
        { zone: "Asia/Singapore", name: "🇸🇬 Singapore (UTC+8)" },
        { zone: "Asia/Shanghai", name: "🇨🇳 Bắc Kinh (UTC+8)" },
        { zone: "Asia/Dubai", name: "🇦🇪 Dubai, UAE (UTC+4)" },
        { zone: "Europe/London", name: "🇬🇧 London, Anh" },
        { zone: "Europe/Paris", name: "🇫🇷 Paris, Pháp" },
        { zone: "Europe/Berlin", name: "🇩🇪 Berlin, Đức" },
        { zone: "Europe/Moscow", name: "🇷🇺 Moscow, Nga" },
        { zone: "America/New_York", name: "🇺🇸 New York, Mỹ" },
        { zone: "America/Los_Angeles", name: "🇺🇸 Los Angeles, Mỹ" },
        { zone: "America/Toronto", name: "🇨🇦 Toronto, Canada" },
        { zone: "Australia/Sydney", name: "🇦🇺 Sydney, Úc" },
        { zone: "UTC", name: "🌐 Giờ Chuẩn Quốc Tế (UTC)" }
    ];

    // Khởi tạo Option cho Select
    function populateSelects() {
        let optionsHTML = '';
        TIMEZONES.forEach(tz => {
            optionsHTML += `<option value="${tz.zone}">${tz.name}</option>`;
        });
        selectSource.innerHTML = optionsHTML;
        selectTarget.innerHTML = optionsHTML;

        // Auto detect Local Timezone
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Thử tìm xem có trong list không, nếu có thì set mặc định
        const userZoneExists = TIMEZONES.some(t => t.zone === userTz);
        if (userZoneExists) {
            selectSource.value = userTz;
        } else {
            selectSource.value = "Asia/Ho_Chi_Minh"; // Default VN
        }
        
        selectTarget.value = "America/New_York"; // Default Target
    }

    populateSelects();

    // Set "Hôm nay / Hiện tại"
    function setNow() {
        const now = new Date();
        // Format ISO string YYYY-MM-DDTHH:mm cho datetime-local
        // Phải bù trừ offset để toISOString() lấy đúng giờ máy tính
        const tzOffset = now.getTimezoneOffset() * 60000; 
        const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
        inputTime.value = localISOTime;
    }
    setNow();
    btnSetNow.addEventListener('click', setNow);

    // Tính năng Nút Hoán Đổi (Swap)
    btnSwap.addEventListener('click', () => {
        const temp = selectSource.value;
        selectSource.value = selectTarget.value;
        selectTarget.value = temp;
        
        // Nảy animation nhẹ
        btnSwap.style.transform = 'scale(0.8)';
        setTimeout(() => btnSwap.style.transform = 'none', 100);
    });

    // Hàm tiện ích hiển thị kết quả
    function getTzNameByValue(val) {
        const found = TIMEZONES.find(t => t.zone === val);
        return found ? found.name : val;
    }

    function formatOutputDate(dateObj) {
        return dateObj.toLocaleDateString('vi-VN', {
            weekday: 'long', 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit'
        });
    }

    function formatOutputTime(dateObj) {
        return dateObj.toLocaleTimeString('vi-VN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // --- LOGIC XỬ LÝ CHUYỂN ĐỔI CHÍNH ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!inputTime.value) return;

        const tzSource = selectSource.value;
        const tzTarget = selectTarget.value;

        // 1. Tạo một dummy Date từ input của người dùng (Giữ nguyên YYYY-MM-DD HH:mm)
        // Lưu ý: JS sẽ tự hiểu chuỗi này theo giờ Local của máy tính, 
        // nhưng chúng ta chỉ cần dùng nó làm cái "khung" để chứa ngày/tháng/năm/giờ/phút.
        const dummyDate = new Date(inputTime.value);

        // 2. Tìm chênh lệch (Offset) giữa Nơi gửi và Nơi nhận
        // Thủ thuật: Format dummyDate sang chuỗi ở 2 múi giờ, rồi parse lại để lấy chênh lệch giờ
        const strSource = dummyDate.toLocaleString('en-US', { timeZone: tzSource });
        const strTarget = dummyDate.toLocaleString('en-US', { timeZone: tzTarget });
        
        const d1 = new Date(strSource);
        const d2 = new Date(strTarget);
        
        // Khoảng cách giờ giữa Múi giờ Đích và Múi giờ Nguồn
        // Ví dụ: Target là +9, Source là +7 => diff = +2
        const diffHours = (d2.getTime() - d1.getTime()) / (1000 * 60 * 60);

        // 3. Tính Thời gian đích thực tế 
        // = Thời gian gốc + Khoảng cách chênh lệch
        const targetTimeObj = new Date(dummyDate.getTime() + diffHours * 3600000);

        // --- ĐỔ DỮ LIỆU LÊN GIAO DIỆN ---
        
        // Source Card
        document.getElementById('res-time-source').innerText = formatOutputTime(dummyDate);
        document.getElementById('res-date-source').innerText = formatOutputDate(dummyDate);
        document.getElementById('res-zone-source').innerText = getTzNameByValue(tzSource);

        // Target Card
        document.getElementById('res-time-target').innerText = formatOutputTime(targetTimeObj);
        document.getElementById('res-date-target').innerText = formatOutputDate(targetTimeObj);
        document.getElementById('res-zone-target').innerText = getTzNameByValue(tzTarget);

        // Diff Text
        const diffText = document.getElementById('res-diff-text');
        if (diffHours === 0) {
            diffText.innerText = "Hai khu vực đang có CÙNG MÚI GIỜ";
        } else if (diffHours > 0) {
            diffText.innerText = `Nơi nhận đi TRƯỚC Nơi gửi ${diffHours} tiếng`;
        } else {
            diffText.innerText = `Nơi nhận đi SAU Nơi gửi ${Math.abs(diffHours)} tiếng`;
        }

        // Hiện kết quả với Animation
        resultBox.style.display = 'flex';
        resultBox.classList.remove('active');
        void resultBox.offsetWidth; // Trigger reflow
        resultBox.classList.add('active');
        
        setTimeout(() => { resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
    });
});