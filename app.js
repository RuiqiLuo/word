// app.js

let words = JSON.parse(localStorage.getItem('words')) || [];
let reviewedWords = JSON.parse(localStorage.getItem('reviewedWords')) || {};
let isWordListVisible = false;
let isReviewVisible = false;

function addWord() {
    const word = document.getElementById('word').value.trim().toLowerCase();
    const meaning = document.getElementById('meaning').value.trim();
    const existingWord = words.find(w => w.word === word);

    if (word && meaning) {
        if (existingWord) {
            existingWord.errorFrequency += 1;
            alert('单词更新成功！');
        } else {
            words.push({ word, meaning, errorFrequency: 1, timestamp: new Date().toISOString() });
            alert('单词添加成功！');
        }
        localStorage.setItem('words', JSON.stringify(words));
        document.getElementById('word').value = '';
        document.getElementById('meaning').value = '';
        updateWordList();
    } else {
        alert('请输入单词和词义！');
    }
}

function toggleWordList() {
    isWordListVisible = !isWordListVisible;
    const wordList = document.getElementById('wordList');
    const toggleListButton = document.getElementById('toggleListButton');
    const sortOption = document.getElementById('sortOption');
    const reviewButton = document.getElementById('reviewButton');
    const backButton = document.getElementById('backButton');
    const addWordSection = document.getElementById('addWordSection');

    if (isWordListVisible) {
        toggleListButton.textContent = '隐藏单词列表';
        wordList.style.display = 'block';
        sortOption.style.display = 'block';
        addWordSection.style.display = 'none';
        reviewButton.style.display = 'block';
        backButton.style.display = 'block';
    } else {
        toggleListButton.textContent = '显示单词列表';
        wordList.style.display = 'none';
        sortOption.style.display = 'none';
        addWordSection.style.display = 'block';
        reviewButton.style.display = 'none';
        backButton.style.display = 'none';
    }
}

function sortWords() {
    const sortOption = document.getElementById('sortOption').value;
    let sortedWords = [...words];

    if (sortOption === 'alphabetical') {
        sortedWords.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortOption === 'frequency') {
        sortedWords.sort((a, b) => b.errorFrequency - a.errorFrequency);
    }

    const wordListUl = document.getElementById('wordList').querySelector('ul');
    wordListUl.innerHTML = '';
    sortedWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = `${word.word} - ${word.meaning} (错误次数: ${word.errorFrequency})`;
        wordListUl.appendChild(li);
    });
}

function updateWordList() {
    const wordListUl = document.getElementById('wordList').querySelector('ul');
    wordListUl.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = `${word.word} - ${word.meaning} (错误次数: ${word.errorFrequency})`;
        wordListUl.appendChild(li);
    });
}

function generateReviewDates() {
    isReviewVisible = !isReviewVisible;
    const reviewList = document.getElementById('reviewList');
    const reviewButton = document.getElementById('reviewButton');
    const backButton = document.getElementById('backButton');
    const addWordSection = document.getElementById('addWordSection');

    if (isReviewVisible) {
        reviewButton.textContent = '隐藏复习单词';
        addWordSection.style.display = 'none';
        reviewList.style.display = 'block';
        backButton.style.display = 'block';
    } else {
        reviewButton.textContent = '复习单词';
        addWordSection.style.display = 'block';
        reviewList.style.display = 'none';
        backButton.style.display = 'none';
    }
    displayReviewWords();
}

function displayReviewWords() {
    const reviewListUl = document.getElementById('reviewList').querySelector('ul');
    reviewListUl.innerHTML = '';
    const reviewDates = getReviewDates();

    reviewDates.forEach(date => {
        const filteredWords = words.filter(word =>
            !reviewedWords[word.word] &&
            new Date(word.timestamp) <= new Date(date)
        );

        if (filteredWords.length > 0) {
            const li = document.createElement('li');
            li.textContent = `${date}: `;
            reviewListUl.appendChild(li);
            filteredWords.forEach(word => {
                const span = document.createElement('span');
                span.textContent = `${word.word} `;
                const button = document.createElement('button');
                button.textContent = '已掌握';
                button.onclick = () => markAsMastered(word.word);
                span.appendChild(button);
                reviewListUl.appendChild(span);
            });
        }
    });
}

function getReviewDates() {
    const now = new Date();
    const reviewDates = [];
    const intervals = [1, 2, 4, 7, 15, 30, 60, 90, 180, 365];
    intervals.forEach(days => {
        const reviewDate = new Date(now);
        reviewDate.setDate(now.getDate() - days);
        const dateStr = reviewDate.toISOString().split('T')[0];
        if (!reviewDates.includes(dateStr)) {
            reviewDates.push(dateStr);
        }
    });
    return reviewDates;
}

function markAsMastered(word) {
    reviewedWords[word] = true;
    localStorage.setItem('reviewedWords', JSON.stringify(reviewedWords));
    displayReviewWords();
}

function goBack() {
    if (isReviewVisible) {
        document.getElementById('reviewList').style.display = 'none';
        document.getElementById('addWordSection').style.display = 'block';
        document.getElementById('reviewButton').textContent = '复习单词';
        document.getElementById('backButton').style.display = 'none';
        isReviewVisible = false;
    } else if (isWordListVisible) {
        document.getElementById('wordList').style.display = 'none';
        document.getElementById('addWordSection').style.display = 'block';
        document.getElementById('toggleListButton').textContent = '显示单词列表';
        document.getElementById('backButton').style.display = 'none';
        isWordListVisible = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateWordList();
});