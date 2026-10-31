document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const inputArea = document.getElementById('rtInputText');
    const timeDisplay = document.getElementById('rtTimeDisplay');
    const wordsDisplay = document.getElementById('rtWordsDisplay');
    const charsDisplay = document.getElementById('rtCharsDisplay');

    // Tốc độ đọc trung bình (Words Per Minute) - Chuẩn chung cho người trưởng thành
    const WPM = 200; 

    const calculateReadStats = () => {
        const text = inputArea.value;
        
        // 1. Tính số ký tự (Bao gồm cả dấu cách)
        const charCount = text.length;
        charsDisplay.textContent = charCount.toLocaleString('vi-VN');

        // 2. Tính số từ (Loại bỏ khoảng trắng thừa)
        const textTrimmed = text.trim();
        let wordCount = 0;
        if (textTrimmed.length > 0) {
            // Regex \s+ tách từ dựa trên 1 hoặc nhiều khoảng trắng, dấu xuống dòng
            wordCount = textTrimmed.split(/\s+/).length;
        }
        wordsDisplay.textContent = wordCount.toLocaleString('vi-VN');

        // 3. Tính thời gian đọc
        if (wordCount === 0) {
            timeDisplay.textContent = "00:00";
        } else {
            const totalSeconds = Math.ceil((wordCount / WPM) * 60);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            
            // Format hiển thị MM:SS (Có đệm số 0 ở đầu nếu < 10)
            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');
            
            timeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;
        }
    };

    // Lắng nghe sự kiện (Real-time update)
    if (inputArea) {
        inputArea.addEventListener('input', calculateReadStats);
    }
});