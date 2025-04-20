let radio; // 用於選項的 radio 物件
let submitButton; // 按鈕
let resultText = ""; // 顯示結果的文字
let table; // 儲存 CSV 資料
let currentQuestion = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let wrongCount = 0; // 答錯題數
let isQuizFinished = false; // 測驗是否結束
let inputBox; // 用於填空題的文字框
let isFillInTheBlank = false; // 是否為填空題

function preload() {
  // 載入 CSV 檔案
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  // 產生一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  background("#fdf0d5");

  // 設定選項的 radio 物件
  radio = createRadio();
  radio.style('color', '#003049');
  radio.style('font-size', '20px');
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 20);

  // 設定文字框 (填空題)
  inputBox = createInput('');
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 20);
  inputBox.size(200);
  inputBox.hide(); // 預設隱藏

  // 設定按鈕
  submitButton = createButton('下一題');
  submitButton.position(windowWidth / 2 - 20, windowHeight / 2 + 100);
  submitButton.mousePressed(handleButtonClick);

  // 顯示第一題
  loadQuestion(currentQuestion);
}

function draw() {
  background("#fdf0d5");

  // 設定填充顏色
  fill("#669bbc");
  noStroke();

  // 計算矩形的位置和大小
  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 顯示題目或結果
  fill(0); // 黑色文字
  textSize(35);
  textAlign(CENTER, CENTER);

  if (!isQuizFinished) {
    // 顯示當前題目
    text(table.getString(currentQuestion, 'question'), windowWidth / 2, windowHeight / 2 - 50);
  } else {
    // 顯示測驗結果
    text(`測驗結束！`, windowWidth / 2, windowHeight / 2 - 100);
    text(`答對題數: ${correctCount}`, windowWidth / 2, windowHeight / 2 - 50);
    text(`答錯題數: ${wrongCount}`, windowWidth / 2, windowHeight / 2);
  }

  // 顯示結果文字
  textSize(25);
  text(resultText, windowWidth / 2, windowHeight / 2 + 150);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 20);
  submitButton.position(windowWidth / 2 - 20, windowHeight / 2 + 100);
}

function loadQuestion(index) {
  // 清空 radio 選項
  radio.html('');
  inputBox.hide(); // 預設隱藏文字框
  isFillInTheBlank = table.getString(index, 'type') === 'fill'; // 判斷是否為填空題

  if (isFillInTheBlank) {
    // 如果是填空題，顯示文字框
    inputBox.show();
  } else {
    // 如果是選擇題，顯示選項
    radio.option('1', table.getString(index, 'option1'));
    radio.option('2', table.getString(index, 'option2'));
    radio.option('3', table.getString(index, 'option3'));
    radio.option('4', table.getString(index, 'option4'));
  }

  // 清空結果文字
  resultText = "";
}

function handleButtonClick() {
  if (!isQuizFinished) {
    // 檢查答案
    checkAnswer();

    // 前往下一題或結束測驗
    if (currentQuestion < table.getRowCount() - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    } else {
      isQuizFinished = true;
      submitButton.html('再試一次');
    }
  } else {
    // 重新開始測驗
    resetQuiz();
  }
}

function checkAnswer() {
  let correctAnswer = table.getString(currentQuestion, 'correct');
  let answer;

  if (isFillInTheBlank) {
    // 如果是填空題，從文字框中取得答案
    answer = inputBox.value().trim();
    inputBox.value(''); // 清空文字框
  } else {
    // 如果是選擇題，從 radio 中取得答案
    answer = radio.value();
  }

  if (answer === correctAnswer) {
    resultText = "答對了";
    correctCount++;
  } else {
    resultText = "答錯了";
    wrongCount++;
  }
}

function resetQuiz() {
  // 重置測驗狀態
  currentQuestion = 0;
  correctCount = 0;
  wrongCount = 0;
  isQuizFinished = false;
  submitButton.html('下一題');
  loadQuestion(currentQuestion);
}
