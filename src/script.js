document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const gridContainer = document.getElementById('game-grid');
    const toggleWordsBtn = document.getElementById('toggle-words-btn');
    const wordListOverlay = document.getElementById('word-list-overlay');
    const wordListElement = document.getElementById('word-list');
    const closeOverlayBtn = document.getElementById('close-overlay-btn');
    const congratsScreen = document.getElementById('congrats-screen');
    const playAgainBtn = document.getElementById('play-again-btn');
    const sizeDialog = document.getElementById('size-dialog');
    const sizeButtons = document.querySelectorAll('.size-btn');
    const changeSizeBtn = document.getElementById('change-size-btn');

    // --- EVENT LISTENERS ---
    toggleWordsBtn.addEventListener('click', () => {
        wordListOverlay.classList.toggle('hidden');
    });

    closeOverlayBtn.addEventListener('click', () => {
        wordListOverlay.classList.add('hidden');
    });

    // Size selection handler
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Size button clicked');
            const size = parseInt(btn.dataset.size);
            console.log('Adding hidden class to dialog');
            sizeDialog.classList.add('hidden');
            console.log('Dialog classes after add:', sizeDialog.classList);
            console.log('Initializing game with size:', size);
            initGame(size);
        });
    });

    // --- GAME CONFIG & STATE ---
    const allWords = [
        'BAG', 'BAT', 'BED', 'BIG', 'BUD', 'BUG',
        'CAN', 'CAP', 'CAT', 'COB', 'CUP',
        'DAD', 'DIP', 'DOG',
        'FAN', 'FIN', 'FOG', 'FUN',
        'HAT', 'HEN', 'HOP', 'HOT',
        'LOG',
        'MAN', 'MAP', 'MOM', 'MOP', 'MUG',
        'NUT', 'NOAH',
        'PEN', 'PIG', 'POD',
        'RED', 'RUN',
        'SIP', 'SIT', 'SUN',
        'TAN', 'TOP', 'TOKI',
        'VAN',
        'WET', 'WIG',
        'ZIP'
    ];
    const GRID_SIZE = 6;
    let wordsToFind = [];
    let foundWords = [];
    let grid = [];
    let currentSelection = []; // { letter, row, col, element }

    // --- INITIALIZATION ---
    function initGame(size = GRID_SIZE) {
        // Reset state
        wordsToFind = [];
        foundWords = [];
        currentSelection = [];
        grid = Array.from({ length: size }, () => Array(size).fill(''));

        document.documentElement.style.setProperty('--grid-size', size);
        gridContainer.innerHTML = '';
        congratsScreen.classList.add('hidden');
        wordListOverlay.classList.add('hidden');

        // Select and place words
        selectWordsForPuzzle(size);
        placeWordsInGrid(size);
        fillEmptyCells(size);

        // Render everything
        renderGrid(size);
        renderWordList();
    }

    // --- WORD SELECTION & PLACEMENT ---
    function selectWordsForPuzzle(size) {
        let availableWords = [...allWords];
        const wordCount = Math.max(3, Math.floor(size * 0.6));
        for (let i = 0; i < wordCount; i++) {
            if (availableWords.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            wordsToFind.push(availableWords.splice(randomIndex, 1)[0]);
        }
        wordsToFind.sort((a, b) => b.length - a.length); // Place longest words first
    }

    function placeWordsInGrid(size) {
        const directions = [
            { r: 0, c: 1 },  // Horizontal
            { r: 1, c: 0 },  // Vertical
            { r: 1, c: 1 },  // Diagonal down-right
            { r: 1, c: -1 }  // Diagonal down-left
        ];

        for (const word of wordsToFind) {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * size);
                const startCol = Math.floor(Math.random() * size);

                if (canPlaceWord(word, startRow, startCol, dir, size)) {
                    for (let i = 0; i < word.length; i++) {
                        const row = startRow + i * dir.r;
                        const col = startCol + i * dir.c;
                        if (row >= 0 && row < size && col >= 0 && col < size) {
                            grid[row][col] = word[i];
                        }
                    }
                    placed = true;
                }
                attempts++;
            }
        }
    }

    function canPlaceWord(word, startRow, startCol, dir, size) {
        for (let i = 0; i < word.length; i++) {
            const row = startRow + i * dir.r;
            const col = startCol + i * dir.c;
            if (
                row < 0 || row >= size ||
                col < 0 || col >= size ||
                (grid[row][col] !== '' && grid[row][col] !== word[i])
            ) {
                return false;
            }
        }
        return true;
    }

    function fillEmptyCells(size) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }
    }

    // --- RENDERING ---
    function renderGrid(size) {
        gridContainer.innerHTML = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.classList.add('letter-cell');
                cell.textContent = grid[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener('click', handleLetterClick);
                gridContainer.appendChild(cell);
            }
        }
    }

    function renderWordList() {
        wordListElement.innerHTML = '';
        for (const word of wordsToFind.sort()) {
            const li = document.createElement('li');
            li.textContent = word;
            if (foundWords.includes(word)) {
                li.classList.add('found-word');
            }
            wordListElement.appendChild(li);
        }
    }

    // --- INTERACTION & GAME LOGIC ---
    function handleLetterClick(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const letter = grid[row][col];

        // Ignore clicks on already found letters
        if (cell.classList.contains('found')) return;

        const selectionIndex = currentSelection.findIndex(s => s.row === row && s.col === col);

        if (selectionIndex > -1) {
            // If it's the last letter, unselect it
            if (selectionIndex === currentSelection.length - 1) {
                currentSelection.pop();
            }
        } else {
            const isAdjacent = isAdjacentToLastSelection(row, col);
            if (currentSelection.length === 0 || isAdjacent) {
                currentSelection.push({ letter, row, col, element: cell });
            } else {
                // Not adjacent, start a new selection
                clearSelection();
                currentSelection.push({ letter, row, col, element: cell });
            }
        }

        updateSelectionUI();
        checkWord();
    }

    function isAdjacentToLastSelection(row, col) {
        if (currentSelection.length === 0) return true;
        const last = currentSelection[currentSelection.length - 1];
        return Math.abs(last.row - row) <= 1 && Math.abs(last.col - col) <= 1;
    }

    function updateSelectionUI() {
        // First, clear all 'selected' classes
        document.querySelectorAll('.letter-cell.selected').forEach(el => el.classList.remove('selected'));
        // Then, add 'selected' class to current selection
        currentSelection.forEach(sel => sel.element.classList.add('selected'));
    }

    function checkWord() {
        const selectedWord = currentSelection.map(s => s.letter).join('');

        const wordFound = wordsToFind.find(w => w === selectedWord && !foundWords.includes(w));

        if (wordFound) {
            foundWords.push(wordFound);
            currentSelection.forEach(sel => {
                sel.element.classList.remove('selected');
                sel.element.classList.add('found');
            });
            clearSelection();
            renderWordList();
            checkWinCondition();
        }
    }

    function clearSelection() {
        updateSelectionUI(); // clears the UI
        currentSelection = [];
    }

    function checkWinCondition() {
        if (foundWords.length === wordsToFind.length) {
            setTimeout(() => congratsScreen.classList.remove('hidden'), 500);
        }
    }

    // --- EVENT LISTENERS ---
    toggleWordsBtn.addEventListener('click', () => {
        wordListOverlay.classList.remove('hidden');
    });

    closeOverlayBtn.addEventListener('click', () => {
        wordListOverlay.classList.add('hidden');
    });

    playAgainBtn.addEventListener('click', () => {
        initGame();
    });

    changeSizeBtn.addEventListener('click', () => {
        sizeDialog.classList.remove('hidden');
    });

    // --- START THE GAME ---
    initGame();
});
