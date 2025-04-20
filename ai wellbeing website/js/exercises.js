// Enhanced Cognitive Exercises
const exerciseTypes = {
    memory: {
        title: "Memory Match",
        description: "Match pairs of cards to test your memory",
        levels: [
            { pairs: 4, timeLimit: 60 },
            { pairs: 6, timeLimit: 90 },
            { pairs: 8, timeLimit: 120 },
            { pairs: 12, timeLimit: 180 }
        ],
        icons: ['🌟', '🎈', '🎭', '🎪', '🎨', '🎯', '🎲', '🎱', '🎸', '🎮', '🎨', '🎭'],
        generate: (level) => {
            const pairs = exerciseTypes.memory.icons.slice(0, level.pairs);
            return {
                cards: [...pairs, ...pairs].sort(() => Math.random() - 0.5),
                timeLimit: level.timeLimit
            };
        }
    },
    math: {
        title: "Math Challenge",
        description: "Solve mathematical problems against the clock",
        levels: [
            { operations: ['+'], maxNum: 20 },
            { operations: ['+', '-'], maxNum: 50 },
            { operations: ['+', '-', '*'], maxNum: 100 },
            { operations: ['+', '-', '*', '/'], maxNum: 100 }
        ],
        generate: (level) => {
            const op = level.operations[Math.floor(Math.random() * level.operations.length)];
            let num1 = Math.floor(Math.random() * level.maxNum) + 1;
            let num2 = Math.floor(Math.random() * level.maxNum) + 1;
            
            // Ensure division problems have whole number answers
            if (op === '/') {
                num2 = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * (Math.floor(Math.random() * 10) + 1);
            }

            return { num1, num2, operator: op };
        }
    },
    sequence: {
        title: "Number Sequence",
        description: "Find the pattern and complete the sequence",
        levels: [
            { length: 4, operations: ['add'] },
            { length: 5, operations: ['add', 'multiply'] },
            { length: 6, operations: ['add', 'multiply', 'power'] },
            { length: 7, operations: ['add', 'multiply', 'power', 'fibonacci'] }
        ],
        generate: (level) => {
            const op = level.operations[Math.floor(Math.random() * level.operations.length)];
            let sequence = [];
            
            switch(op) {
                case 'add':
                    const diff = Math.floor(Math.random() * 5) + 2;
                    sequence = Array(level.length).fill(0).map((_, i) => i * diff);
                    break;
                case 'multiply':
                    const factor = Math.floor(Math.random() * 3) + 2;
                    sequence = Array(level.length).fill(0).map((_, i) => Math.pow(factor, i));
                    break;
                case 'power':
                    sequence = Array(level.length).fill(0).map((_, i) => Math.pow(i + 1, 2));
                    break;
                case 'fibonacci':
                    sequence = [1, 1];
                    for(let i = 2; i < level.length; i++) {
                        sequence.push(sequence[i-1] + sequence[i-2]);
                    }
                    break;
            }
            
            const answer = sequence[sequence.length - 1];
            sequence[sequence.length - 1] = '?';
            
            return { sequence, answer };
        }
    },
    word: {
        title: "Word Scramble",
        description: "Unscramble the letters to find the word",
        levels: [
            { minLength: 3, maxLength: 4, category: 'basic' },
            { minLength: 4, maxLength: 6, category: 'intermediate' },
            { minLength: 6, maxLength: 8, category: 'advanced' },
            { minLength: 8, maxLength: 10, category: 'expert' }
        ],
        wordLists: {
            basic: ['CAT', 'DOG', 'RUN', 'JUMP', 'PLAY'],
            intermediate: ['MOTHER', 'FATHER', 'SCHOOL', 'FRIEND', 'HAPPY'],
            advanced: ['EXERCISE', 'LEARNING', 'COMPUTER', 'KNOWLEDGE'],
            expert: ['CHALLENGE', 'EDUCATION', 'EXPERIENCE', 'DEVELOPMENT']
        },
        generate: (level) => {
            const words = exerciseTypes.word.wordLists[level.category];
            const word = words[Math.floor(Math.random() * words.length)];
            const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
            return { word, scrambled };
        }
    },
    puzzle: {
        title: "Pattern Recognition",
        description: "Complete the visual pattern sequence",
        levels: [
            { patterns: ['🔵⭐', '🔺🔻', '◼️◻️'], length: 4 },
            { patterns: ['🔵⭐🔶', '🔺🔻🔷', '◼️◻️💠'], length: 5 },
            { patterns: ['🔵⭐🔶💫', '🔺🔻🔷🔴', '◼️◻️💠🔘'], length: 6 },
            { patterns: ['🔵⭐🔶💫✨', '🔺🔻🔷🔴🔮', '◼️◻️💠🔘🎯'], length: 7 }
        ],
        generate: (level) => {
            const pattern = level.patterns[Math.floor(Math.random() * level.patterns.length)];
            const sequence = pattern.repeat(Math.floor(level.length / pattern.length));
            const answer = pattern[0];
            return { sequence: sequence + '❓', answer };
        }
    }
};

let currentExercise = null;
let completedExercises = 0;

function startExercise(type) {
    currentExercise = type;
    const content = document.getElementById('exercise-content');
    
    switch(type) {
        case 'memory': setupMemoryGame(content); break;
        case 'math': setupMathChallenge(content); break;
        case 'puzzle': setupPatternPuzzle(content); break;
        case 'word': setupWordScramble(content); break;
    }
    
    document.getElementById('exercise-modal').style.display = 'block';
}

function setupMemoryGame(content) {
    matchedPairs = 0;
    const symbols = ['🌟', '🎈', '🎨', '🎮', '🎲', '🎸', '📚', '🎭'];
    const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    content.innerHTML = `
        <div class="memory-grid">
            ${cards.map((symbol, index) => `
                <div class="memory-card" data-index="${index}" data-symbol="${symbol}" onclick="handleMemoryCard(${index})">
                    <div class="card-inner">
                        <div class="card-front">?</div>
                        <div class="card-back">${symbol}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function handleMemoryCard(index) {
    const cards = document.querySelectorAll('.memory-card');
    const card = cards[index];
    
    if (!card.classList.contains('matched') && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        checkForMatch();
    }
}

function checkForMatch() {
    const flippedCards = document.querySelectorAll('.memory-card.flipped:not(.matched)');
    
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            if (matchedPairs === 8) {
                setTimeout(() => {
                    completeExercise();
                    showNotification('Memory Game Completed!', 'success');
                }, 500);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
    }
}

function setupMathChallenge(content) {
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    
    content.innerHTML = `
        <div class="math-challenge">
            <h3 class="math-question">${num1} ${operator} ${num2} = ?</h3>
            <input type="number" id="math-answer" class="math-input">
            <button class="btn primary" onclick="checkMathAnswer(${num1}, ${num2}, '${operator}')">Check Answer</button>
        </div>
    `;
}

function checkMathAnswer(num1, num2, operator) {
    const userAnswer = parseInt(document.getElementById('math-answer').value);
    let correctAnswer;
    
    switch(operator) {
        case '+': correctAnswer = num1 + num2; break;
        case '-': correctAnswer = num1 - num2; break;
        case '*': correctAnswer = num1 * num2; break;
    }
    
    if (userAnswer === correctAnswer) {
        completeExercise();
        showNotification('Correct Answer!', 'success');
    } else {
        showNotification('Try again!', 'error');
    }
}

function setupPatternPuzzle(content) {
    const shapes = ['🔵', '🔴', '🟡', '⚫'];
    currentPattern = Array(4).fill().map(() => shapes[Math.floor(Math.random() * shapes.length)]);
    
    content.innerHTML = `
        <div class="pattern-puzzle">
            <div class="pattern-sequence">${currentPattern.join(' ')} ?</div>
            <div class="pattern-options">
                ${shapes.map(shape => `
                    <button class="pattern-button" onclick="checkPattern('${shape}')">${shape}</button>
                `).join('')}
            </div>
        </div>
    `;
}

function checkPattern(answer) {
    if (answer === currentPattern[currentPattern.length - 1]) {
        completeExercise();
        showNotification('Pattern Completed!', 'success');
    } else {
        showNotification('Try again!', 'error');
    }
}

function setupWordScramble(content) {
    const words = ['PYTHON', 'JAVASCRIPT', 'CODING', 'COMPUTER', 'PROGRAM'];
    currentWord = words[Math.floor(Math.random() * words.length)];
    const scrambled = currentWord.split('').sort(() => Math.random() - 0.5).join('');
    
    content.innerHTML = `
        <div class="word-scramble">
            <h3>Unscramble: ${scrambled}</h3>
            <input type="text" id="word-answer" class="word-input" maxlength="${currentWord.length}">
            <button class="btn primary" onclick="checkWord()">Check Word</button>
        </div>
    `;
}

function checkWord() {
    const answer = document.getElementById('word-answer').value.toUpperCase();
    if (answer === currentWord) {
        completeExercise();
        showNotification('Word Unscrambled!', 'success');
    } else {
        showNotification('Try again!', 'error');
    }
}

function completeExercise() {
    const count = parseInt(document.getElementById('exercise-count').textContent.split('/')[0]) + 1;
    document.getElementById('exercise-count').textContent = `${count}/4 completed`;
    document.getElementById('cognitive-progress').style.width = `${(count/4)*100}%`;
    closeModal('exercise-modal');
    checkAchievements();
}