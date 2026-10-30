document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const inpHex = document.getElementById('inpHex');
    const inpRgb = document.getElementById('inpRgb');
    const inpHsl = document.getElementById('inpHsl');
    const inpCmyk = document.getElementById('inpCmyk');
    const inpAlpha = document.getElementById('inpAlpha');
    const alphaVal = document.getElementById('alphaVal');
    
    const colorPreview = document.getElementById('colorPreview');
    const nativeColorPicker = document.getElementById('nativeColorPicker');
    const toast = document.getElementById('toastColor');

    const palMono = document.getElementById('palMono');
    const palAnalog = document.getElementById('palAnalog');
    const palComp = document.getElementById('palComp');

    // Trạng thái màu trung tâm (đóng vai trò như "Nguồn sự thật" - Source of Truth)
    let state = { r: 255, g: 183, b: 178, a: 1 };

    // --- CÁC HÀM TOÁN HỌC CHUYỂN ĐỔI MÀU SẮC ---

    // 1. RGB -> HEX
    function rgbToHex(r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
    }

    // 2. HEX -> RGB
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
        let num = parseInt(hex, 16);
        return { r: num >> 16, g: (num >> 8) & 255, b: num & 255 };
    }

    // 3. RGB -> HSL
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    // 4. HSL -> RGB
    function hslToRgb(h, s, l) {
        let r, g, b;
        h /= 360; s /= 100; l /= 100;
        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    }

    // 5. RGB -> CMYK
    function rgbToCmyk(r, g, b) {
        let c = 1 - (r / 255);
        let m = 1 - (g / 255);
        let y = 1 - (b / 255);
        let k = Math.min(c, Math.min(m, y));
        
        if (k == 1) return { c: 0, m: 0, y: 0, k: 100 };
        
        c = Math.round(((c - k) / (1 - k)) * 100);
        m = Math.round(((m - k) / (1 - k)) * 100);
        y = Math.round(((y - k) / (1 - k)) * 100);
        k = Math.round(k * 100);
        
        return { c, m, y, k };
    }

    // 6. CMYK -> RGB
    function cmykToRgb(c, m, y, k) {
        c /= 100; m /= 100; y /= 100; k /= 100;
        let r = Math.round(255 * (1 - c) * (1 - k));
        let g = Math.round(255 * (1 - m) * (1 - k));
        let b = Math.round(255 * (1 - y) * (1 - k));
        return { r, g, b };
    }


    // --- HÀM RENDER (Cập nhật giao diện từ State) ---
    function updateUI(source) {
        let { r, g, b, a } = state;

        // Định dạng Alpha
        let alphaStr = (a === 1) ? "" : `, ${a}`;
        
        // Tính toán các hệ khác
        let hex = rgbToHex(r, g, b);
        let hsl = rgbToHsl(r, g, b);
        let cmyk = rgbToCmyk(r, g, b);

        // Cập nhật ô nhập liệu (bỏ qua ô đang được gõ để không làm nhảy con trỏ chuột)
        if (source !== 'hex') inpHex.value = hex;
        if (source !== 'rgb') inpRgb.value = (a === 1) ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
        if (source !== 'hsl') inpHsl.value = (a === 1) ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})`;
        if (source !== 'cmyk') inpCmyk.value = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
        
        // Cập nhật khối Preview & Picker
        colorPreview.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
        nativeColorPicker.value = hex;

        // Sinh bảng màu Harmonies
        generateHarmonies(hsl.h, hsl.s, hsl.l);
    }

    // --- SINH BẢNG MÀU THÔNG MINH ---
    function generateHarmonies(h, s, l) {
        // Đơn sắc (Thay đổi Lightness)
        renderPalette(palMono, [
            {h, s, l: Math.max(0, l - 40)},
            {h, s, l: Math.max(0, l - 20)},
            {h, s, l},
            {h, s, l: Math.min(100, l + 20)},
            {h, s, l: Math.min(100, l + 40)}
        ]);

        // Tương đồng (Thay đổi Hue +- 30 độ)
        renderPalette(palAnalog, [
            {h: (h - 60 + 360) % 360, s, l},
            {h: (h - 30 + 360) % 360, s, l},
            {h, s, l},
            {h: (h + 30) % 360, s, l},
            {h: (h + 60) % 360, s, l}
        ]);

        // Bổ túc (Đối diện 180 độ + lân cận)
        let compH = (h + 180) % 360;
        renderPalette(palComp, [
            {h, s, l: Math.max(0, l - 20)},
            {h, s, l},
            {h: compH, s, l},
            {h: compH, s, l: Math.min(100, l + 20)}
        ]);
    }

    function renderPalette(container, colorsHsl) {
        container.innerHTML = '';
        colorsHsl.forEach(item => {
            let rgb = hslToRgb(item.h, item.s, item.l);
            let hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            
            let swatch = document.createElement('div');
            swatch.className = 'swatch';
            swatch.style.backgroundColor = hex;
            swatch.setAttribute('data-color', hex);
            
            swatch.addEventListener('click', function() {
                copyToClipboard(this.getAttribute('data-color'));
            });
            
            container.appendChild(swatch);
        });
    }

    // --- XỬ LÝ SỰ KIỆN GÕ TỪ BÀN PHÍM ---

    // Xử lý HEX
    inpHex.addEventListener('input', function(e) {
        let val = e.target.value.trim();
        if (/^#?[0-9A-Fa-f]{3,6}$/.test(val)) {
            let rgb = hexToRgb(val);
            if (rgb) {
                state.r = rgb.r; state.g = rgb.g; state.b = rgb.b;
                updateUI('hex');
            }
        }
    });

    // Xử lý RGB (Hỗ trợ regex bóc tách số thông minh)
    inpRgb.addEventListener('input', function(e) {
        let val = e.target.value;
        // Tìm tất cả các con số trong chuỗi
        let matches = val.match(/\d+(\.\d+)?/g);
        if (matches && matches.length >= 3) {
            state.r = Math.min(255, Math.max(0, parseInt(matches[0])));
            state.g = Math.min(255, Math.max(0, parseInt(matches[1])));
            state.b = Math.min(255, Math.max(0, parseInt(matches[2])));
            if (matches[3]) {
                state.a = Math.min(1, Math.max(0, parseFloat(matches[3])));
                inpAlpha.value = state.a;
                alphaVal.innerText = state.a.toFixed(2);
            }
            updateUI('rgb');
        }
    });

    // Xử lý HSL
    inpHsl.addEventListener('input', function(e) {
        let val = e.target.value;
        let matches = val.match(/\d+(\.\d+)?/g);
        if (matches && matches.length >= 3) {
            let h = parseInt(matches[0]) % 360;
            let s = Math.min(100, Math.max(0, parseInt(matches[1])));
            let l = Math.min(100, Math.max(0, parseInt(matches[2])));
            
            let rgb = hslToRgb(h, s, l);
            state.r = rgb.r; state.g = rgb.g; state.b = rgb.b;
            updateUI('hsl');
        }
    });

    // Xử lý CMYK
    inpCmyk.addEventListener('input', function(e) {
        let val = e.target.value;
        let matches = val.match(/\d+/g);
        if (matches && matches.length >= 4) {
            let c = Math.min(100, Math.max(0, parseInt(matches[0])));
            let m = Math.min(100, Math.max(0, parseInt(matches[1])));
            let y = Math.min(100, Math.max(0, parseInt(matches[2])));
            let k = Math.min(100, Math.max(0, parseInt(matches[3])));
            
            let rgb = cmykToRgb(c, m, y, k);
            state.r = rgb.r; state.g = rgb.g; state.b = rgb.b;
            updateUI('cmyk');
        }
    });

    // Xử lý Alpha (Kéo thanh trượt)
    inpAlpha.addEventListener('input', function(e) {
        state.a = parseFloat(e.target.value);
        alphaVal.innerText = state.a.toFixed(2);
        updateUI('alpha'); // Cập nhật tất cả trừ slider
    });

    // Xử lý Color Picker hệ thống
    nativeColorPicker.addEventListener('input', function(e) {
        let rgb = hexToRgb(e.target.value);
        state.r = rgb.r; state.g = rgb.g; state.b = rgb.b;
        updateUI('picker');
    });

    // --- COPY FUNCTION ---
    function copyToClipboard(text) {
        const copyHandler = function(e) {
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        };
        document.addEventListener('copy', copyHandler);
        try {
            document.execCommand('copy');
            showToast("Đã copy: " + text);
        } catch (err) {
            console.error("Lỗi copy");
        } finally {
            document.removeEventListener('copy', copyHandler);
        }
    }

    document.querySelectorAll('.btn-copy-color').forEach(btn => {
        btn.addEventListener('click', function() {
            let targetId = this.getAttribute('data-target');
            let text = document.getElementById(targetId).value;
            copyToClipboard(text);
        });
    });

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add("show");
        setTimeout(function() { toast.classList.remove("show"); }, 2500);
    }
});