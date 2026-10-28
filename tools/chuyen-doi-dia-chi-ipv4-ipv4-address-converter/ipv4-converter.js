document.addEventListener('DOMContentLoaded', function() {
    
    // --- KHAI BÁO DOM ---
    const inputIp = document.getElementById('ip4v-input-ip');
    const btnMyIp = document.getElementById('ip4v-btn-myip');
    const chipButtons = document.querySelectorAll('.ip4v-btn-chip');
    const btnClear = document.getElementById('ip4v-btn-clear');
    const statusBox = document.getElementById('ip4v-status-box');
    
    const outputCard = document.getElementById('ip4v-output-card');
    
    // Các ô Output
    const outDecimal = document.getElementById('ip4v-out-decimal');
    const outHex = document.getElementById('ip4v-out-hex');
    const outBinary = document.getElementById('ip4v-out-binary');
    const outIpv6 = document.getElementById('ip4v-out-ipv6');
    const outIpv6Short = document.getElementById('ip4v-out-ipv6-short');

    // Nút copy
    const copyButtons = document.querySelectorAll('.ip4v-btn-copy-item');

    // --- 0. LẤY IP PUBLIC CỦA TÔI ---
    btnMyIp.addEventListener('click', async () => {
        const originalText = btnMyIp.innerText;
        btnMyIp.innerText = '⏳...';
        btnMyIp.style.pointerEvents = 'none';

        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) throw new Error("Mạng lỗi");
            const data = await response.json();
            
            inputIp.value = data.ip;
            convertIP();
        } catch (error) {
            alert("Không thể lấy IP hiện tại. Vui lòng tắt chặn quảng cáo (Adblocker).");
        } finally {
            btnMyIp.innerText = '📍 IP CỦA TÔI';
            btnMyIp.style.pointerEvents = 'auto';
        }
    });

    // --- 1. NÚT ĐIỀN NHANH ---
    chipButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            inputIp.value = this.getAttribute('data-ip');
            convertIP();
        });
    });

    // --- 2. HÀM KIỂM TRA IP ---
    function isValidIp(ip) {
        // Biểu thức chính quy (Regex) bắt chính xác 4 cụm số từ 0-255
        const regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return regex.test(ip);
    }

    // --- 3. HÀM CHUYỂN ĐỔI CỐT LÕI ---
    function convertIP() {
        let rawIp = inputIp.value.trim();
        
        if (!rawIp) {
            outputCard.style.opacity = '0.5';
            outputCard.style.pointerEvents = 'none';
            statusBox.innerText = "Chờ nhập liệu...";
            statusBox.className = "ip4v-status-box";
            clearOutputs();
            return;
        }

        if (!isValidIp(rawIp)) {
            outputCard.style.opacity = '0.5';
            outputCard.style.pointerEvents = 'none';
            statusBox.innerText = "❌ Địa chỉ IP không hợp lệ!";
            statusBox.className = "ip4v-status-box error";
            clearOutputs();
            return;
        }

        try {
            // Tách IP thành 4 cụm số (Octets)
            const octets = rawIp.split('.').map(Number);
            
            // 1. Chuyển sang Decimal (Thập phân)
            // (a * 256^3) + (b * 256^2) + (c * 256) + d
            const decimalVal = (octets[0] * 16777216) + (octets[1] * 65536) + (octets[2] * 256) + octets[3];
            outDecimal.value = decimalVal;

            // 2. Chuyển sang Hexadecimal (Thập lục phân)
            // Lấy giá trị decimal ép sang hệ 16, pad thêm 0 cho đủ 8 ký tự
            outHex.value = "0x" + decimalVal.toString(16).padStart(8, '0');

            // 3. Chuyển sang Binary (Nhị phân)
            // Lấy từng cụm số ép sang hệ 2, pad đủ 8 bit, ghép lại bằng dấu chấm
            outBinary.value = octets.map(n => n.toString(2).padStart(8, '0')).join('.');

            // 4. Tính toán cho IPv6
            // Chia 4 octets thành 2 cụm Hex
            const hexPart1 = octets[0].toString(16).padStart(2, '0') + octets[1].toString(16).padStart(2, '0');
            const hexPart2 = octets[2].toString(16).padStart(2, '0') + octets[3].toString(16).padStart(2, '0');
            
            // IPv6 Expanded (Ánh xạ đầy đủ)
            outIpv6.value = `0000:0000:0000:0000:0000:ffff:${hexPart1}:${hexPart2}`;

            // IPv6 Short (Dọn dẹp các số 0 vô nghĩa ở đầu mỗi cụm)
            // parseInt(string, 16).toString(16) là mẹo cực nhanh để bỏ số 0 ở đầu (ví dụ: '0101' -> '101')
            const shortHex1 = parseInt(hexPart1, 16).toString(16);
            const shortHex2 = parseInt(hexPart2, 16).toString(16);
            outIpv6Short.value = `::ffff:${shortHex1}:${shortHex2}`;

            // Bật sáng giao diện
            outputCard.style.opacity = '1';
            outputCard.style.pointerEvents = 'auto';
            statusBox.innerText = "✅ Chuyển đổi thành công!";
            statusBox.className = "ip4v-status-box active";

        } catch (error) {
            statusBox.innerText = "❌ Đã xảy ra lỗi khi tính toán!";
            statusBox.className = "ip4v-status-box error";
        }
    }

    function clearOutputs() {
        outDecimal.value = "";
        outHex.value = "";
        outBinary.value = "";
        outIpv6.value = "";
        outIpv6Short.value = "";
    }

    // --- 4. LẮNG NGHE SỰ KIỆN GÕ & XÓA ---
    inputIp.addEventListener('input', convertIP);

    btnClear.addEventListener('click', () => {
        inputIp.value = "";
        convertIP();
        inputIp.focus();
    });

    // --- 5. HỆ THỐNG NÚT COPY ĐỘC LẬP TỪNG DÒNG ---
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            // Lấy ID của ô Input cần copy thông qua data-target
            const targetId = this.getAttribute('data-target');
            const inputElement = document.getElementById(targetId);
            
            if (!inputElement.value) return;

            try {
                await navigator.clipboard.writeText(inputElement.value);
                
                // Hiệu ứng copy thành công
                const originalText = this.innerText;
                const originalBg = this.style.background;
                
                this.innerText = '✅ ĐÃ COPY';
                this.style.background = 'var(--clr-green)';
                this.style.color = '#111';
                
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.background = originalBg;
                    this.style.color = 'var(--clr-cyan)';
                }, 1500);
            } catch (err) {
                alert("Trình duyệt không hỗ trợ copy tự động!");
            }
        });
    });

    // Mồi chạy file cache
    if(inputIp.value) convertIP();
});