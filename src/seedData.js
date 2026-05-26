const questions = [
  // 1. Trắc nghiệm (Quiz)
  { gameType: 'Quiz', content: 'Thủ đô của Việt Nam là?', options: ['Hà Nội', 'Đà Nẵng', 'Huế', 'TP.HCM'], correct: 'Hà Nội' },
  { gameType: 'Quiz', content: '2 + 2 = ?', options: ['3', '4', '5', '6'], correct: '4' },
  
  // 2. Đúng/Sai (TrueFalse)
  { gameType: 'TrueFalse', content: 'Trái đất quay quanh mặt trời.', correct: 'True' },
  { gameType: 'TrueFalse', content: 'Cá sống trên cạn.', correct: 'False' },
  
  // 3. Từ xáo trộn (WordScramble)
  { gameType: 'WordScramble', content: 'APPLE', hint: 'Một loại trái cây' }, // Hệ thống sẽ dùng logic scramble để trộn chữ
  
  // 4. Đoán hình (PictureQuiz)
  { gameType: 'PictureQuiz', content: 'HÌNH ẢNH CON MÈO', actualName: 'Cat' },
  
  // 5. Tìm hình (FindMatch)
  { gameType: 'FindMatch', id: 'm1', content: 'Hình tam giác', targetId: 'm1' }
];