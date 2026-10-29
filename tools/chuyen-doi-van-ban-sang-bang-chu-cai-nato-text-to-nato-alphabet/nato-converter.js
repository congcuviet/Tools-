document.addEventListener('DOMContentLoaded', function() {
    
    // --- Khai báo DOM ---
    const inputText = document.getElementById('nato-input-text');
    const outputText = document.getElementById('nato-output-text');
    const btnClear = document.getElementById('nato-btn-clear');
    const btnCopy = document.getElementById('nato-btn-copy');
    const btnSpeak = document.getElementById('nato-btn-speak');
    const statusBadge = document.getElementById('nato-status');

    // --- Từ Điển NATO Phonetic Alphabet ---
    const natoDict = {
        'A': 'Alfa', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
        'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliett',
        'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
        'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
        'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
        'Z': 'Zulu', 
        '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', 
        '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine', '0': 'Zero'
    };

    // --- Xử lý Tiếng Việt có dấu ---
    function removeVietnameseTones(str) {
        return str.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }

    // --- Thuật toán Dịch (Real-time) ---
    function translateToNato() {
        let rawText = inputText.value;

        if (!rawText.trim()) {
            outputText.value = "";
            statusBadge.innerText = "Chờ nhập liệu...";
            statusBadge.classList.remove('active');
            // Nếu đang đọc mà xóa text -> Dừng đọc ngay
            window.speechSynthesis.cancel();
            btnSpeak.classList.remove('speaking');
            btnSpeak.innerText = '🔊 ĐỌC PHÁT ÂM';
            return;
        }

        // Bước 1: Xóa dấu Tiếng Việt & Chuyển thành in hoa
        let cleanText = removeVietnameseTones(rawText).toUpperCase();
        
        let translatedArray = [];

        // Bước 2: Duyệt từng ký tự
        for (let i = 0; i < cleanText.length; i++) {
            let char = cleanText[i];
            
            if (natoDict[char]) {
                // Nếu là chữ/số hợp lệ -> Dịch
                translatedArray.push(natoDict[char]);
            } else if (char === ' ' || char === '\n') {
                // Nếu là khoảng trắng / xuống dòng -> Thêm phân cách rõ ràng
                translatedArray.push('\n\n'); 
            } else {
                // Giữ nguyên các ký tự đặc biệt (chấm, phẩy, @, ...)
                translatedArray.push(char);
            }
        }

        // Render ra Output (Dọn dẹp khoảng trắng thừa giữa các cụm ký tự)
        let finalResult = translatedArray.join(' ').replace(/ \n\n /g, '\n\n');
        outputText.value = finalResult;

        statusBadge.innerText = "✅ Đã dịch xong";
        statusBadge.classList.add('active');
    }

    // --- Sự kiện Phát Âm (Text-to-Speech) ---
    function speakNato() {
        const textToRead = outputText.value;
        if (!textToRead) return;

        // Nếu đang đọc rồi thì ấn nút sẽ Dừng
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            btnSpeak.classList.remove('speaking');
            btnSpeak.innerText = '🔊 ĐỌC PHÁT ÂM';
            return;
        }

        // Khởi tạo giọng đọc
        const utterance = new SpeechSynthesisUtterance(textToRead);
        
        // Ưu tiên chọn giọng Tiếng Anh (English) để đọc chuẩn ngữ âm NATO
        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(voice => voice.lang.startsWith('en-'));
        if (enVoice) {
            utterance.voice = enVoice;
        }
        
        utterance.rate = 0.85; // Đọc chậm một chút cho dễ nghe
        utterance.pitch = 1;

        // Hiệu ứng UI khi bắt đầu và kết thúc
        utterance.onstart = () => {
            btnSpeak.classList.add('speaking');
            btnSpeak.innerText = '⏹️ DỪNG ĐỌC';
        };

        utterance.onend = () => {
            btnSpeak.classList.remove('speaking');
            btnSpeak.innerText = '🔊 ĐỌC PHÁT ÂM';
        };

        utterance.onerror = () => {
            btnSpeak.classList.remove('speaking');
            btnSpeak.innerText = '🔊 ĐỌC PHÁT ÂM';
        };

        window.speechSynthesis.speak(utterance);
    }

    // Load voices trước (Fix lỗi Chrome chưa load xong giọng đọc)
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

    // --- Lắng nghe sự kiện ---

    // Dịch ngay khi gõ phím
    inputText.addEventListener('input', translateToNato);

    // Nút Đọc phát âm
    btnSpeak.addEventListener('click', speakNato);

    // Nút Xóa trắng
    btnClear.addEventListener('click', () => {
        inputText.value = "";
        translateToNato();
        inputText.focus();
    });

    // Nút Copy
    btnCopy.addEventListener('click', async () => {
        if (!outputText.value) return;

        try {
            await navigator.clipboard.writeText(outputText.value);
            
            const originalText = btnCopy.innerText;
            const originalBg = btnCopy.style.background;
            const originalColor = btnCopy.style.color;
            
            btnCopy.innerText = '✅ ĐÃ COPY';
            btnCopy.style.background = 'var(--clr-green)';
            btnCopy.style.color = '#111';
            
            setTimeout(() => {
                btnCopy.innerText = originalText;
                btnCopy.style.background = originalBg;
                btnCopy.style.color = originalColor;
            }, 1500);
        } catch (err) {
            alert("Lỗi sao chép!");
        }
    });

});