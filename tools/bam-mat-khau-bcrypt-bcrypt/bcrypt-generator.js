document.addEventListener('DOMContentLoaded', function() {
    
    // Đảm bảo thư viện đã load
    if (typeof dcodeIO === 'undefined' || !dcodeIO.bcrypt) {
        alert("Lỗi: Không thể tải thư viện BcryptJS. Vui lòng kiểm tra kết nối mạng!");
        return;
    }

    const bcrypt = dcodeIO.bcrypt;

    // --- Khai báo DOM ---
    const genPwd = document.getElementById('bcryp-gen-pwd');
    const genRounds = document.getElementById('bcryp-gen-rounds');
    const genSlider = document.getElementById('bcryp-gen-slider');
    const btnGen = document.getElementById('bcryp-btn-generate');
    const genResult = document.getElementById('bcryp-gen-result');
    const btnCopyGen = document.getElementById('bcryp-btn-copy-gen');

    const verPwd = document.getElementById('bcryp-ver-pwd');
    const verHash = document.getElementById('bcryp-ver-hash');
    const btnVerify = document.getElementById('bcryp-btn-verify');
    
    const verStatusBox = document.getElementById('bcryp-ver-status');
    const verStatusIcon = document.getElementById('bcryp-status-icon');
    const verStatusText = document.getElementById('bcryp-status-text');

    // --- Đồng bộ Slider và Input Rounds ---
    genSlider.addEventListener('input', function() {
        genRounds.value = this.value;
    });

    genRounds.addEventListener('input', function() {
        let val = parseInt(this.value);
        if (isNaN(val) || val < 4) val = 4;
        if (val > 14) val = 14; // Giới hạn max 14 để trình duyệt không bị treo (freeze)
        genSlider.value = val;
    });

    // --- CHỨC NĂNG 1: TẠO MÃ BĂM (GENERATE) ---
    btnGen.addEventListener('click', () => {
        const password = genPwd.value;
        const rounds = parseInt(genRounds.value) || 10;

        if (password === "") {
            alert("Vui lòng nhập mật khẩu cần băm!");
            return;
        }

        // Đổi UI sang trạng thái Đang xử lý
        btnGen.disabled = true;
        btnGen.innerText = "⏳ Đang tính toán (Vui lòng đợi)...";
        genResult.value = "";

        // Dùng Async (Bất đồng bộ) để trình duyệt không bị đơ
        setTimeout(() => {
            bcrypt.genSalt(rounds, function(err, salt) {
                if (err) {
                    alert("Lỗi tạo Salt!");
                    resetGenBtn();
                    return;
                }
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        alert("Lỗi băm mật khẩu!");
                    } else {
                        genResult.value = hash;
                        
                        // Nếu bên Verify đang trống, tự động ném pass & hash sang đó để test tiện lợi
                        if (!verPwd.value && !verHash.value) {
                            verPwd.value = password;
                            verHash.value = hash;
                        }
                    }
                    resetGenBtn();
                });
            });
        }, 50); // Delay nhẹ để UI kịp update
    });

    function resetGenBtn() {
        btnGen.disabled = false;
        btnGen.innerText = "🚀 Băm Mật Khẩu";
    }

    // Nút Copy
    btnCopyGen.addEventListener('click', async () => {
        if (!genResult.value) return;
        try {
            await navigator.clipboard.writeText(genResult.value);
            const originalText = btnCopyGen.innerText;
            btnCopyGen.innerText = '✅ Đã Copy';
            btnCopyGen.style.background = 'var(--clr-green)';
            
            setTimeout(() => {
                btnCopyGen.innerText = originalText;
                btnCopyGen.style.background = '#fff';
            }, 1500);
        } catch (err) {
            alert("Lỗi sao chép!");
        }
    });

    // --- CHỨC NĂNG 2: KIỂM TRA MÃ BĂM (VERIFY) ---
    btnVerify.addEventListener('click', () => {
        const password = verPwd.value;
        const hash = verHash.value.trim();

        if (password === "" || hash === "") {
            alert("Vui lòng nhập đủ mật khẩu và mã băm cần kiểm tra!");
            return;
        }

        // Đổi UI sang trạng thái Loading
        btnVerify.disabled = true;
        btnVerify.innerText = "⏳ Đang so khớp...";
        
        verStatusBox.style.display = 'flex';
        verStatusBox.className = 'bcryp-status-box bcryp-status-loading';
        verStatusIcon.innerText = "⏳";
        verStatusText.innerText = "Đang xử lý...";

        // Dùng Async để so sánh
        setTimeout(() => {
            bcrypt.compare(password, hash, function(err, res) {
                btnVerify.disabled = false;
                btnVerify.innerText = "⚖️ Kiểm Tra Khớp (Compare)";

                if (err) {
                    verStatusBox.className = 'bcryp-status-box bcryp-status-fail';
                    verStatusIcon.innerText = "❌";
                    verStatusText.innerText = "Mã Hash không hợp lệ!";
                    return;
                }

                if (res === true) {
                    // Match!
                    verStatusBox.className = 'bcryp-status-box bcryp-status-match';
                    verStatusIcon.innerText = "✅";
                    verStatusText.innerText = "TRÙNG KHỚP! (MATCHED)";
                } else {
                    // Mismatch!
                    verStatusBox.className = 'bcryp-status-box bcryp-status-fail';
                    verStatusIcon.innerText = "❌";
                    verStatusText.innerText = "SAI MẬT KHẨU! (NOT MATCH)";
                }
            });
        }, 50);
    });

});