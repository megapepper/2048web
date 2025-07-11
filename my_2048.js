window.onload = function () {
    initGrid();
    restoreGrid();
};

document.onkeydown = directions;


function initGrid() {
    if (localStorage.getItem('matrix') == null) {
        container = document.getElementsByClassName('grid-container');
        play = container[0].getElementsByClassName('grid-play');
        cells = play[0].getElementsByClassName('cell');
        matrix = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
        generateRandomCell(matrix);
        generateRandomCell(matrix);
        refreshGrid(matrix);
    }
}


function restoreGrid() {
    if (localStorage.getItem('matrix') !== null) {
        numbers = localStorage.getItem('matrix').split(',');
        matrix = restoreMatrix(numbers);
        container = document.getElementsByClassName('grid-container');
        play = container[0].getElementsByClassName('grid-play');
        cells = play[0].getElementsByClassName('cell');
        refreshGrid(matrix);
    }
}


function restartGrid() {
    localStorage.clear();
    document.getElementById('loss').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    initGrid();
}


function refreshGrid(matrix) {
    let cnt = 0;
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let cell = cells[i * SIZE + j];
            cell.getElementsByClassName('inner')[0].innerHTML = matrix[i][j];
            colorSet(matrix[i][j], cell);
            if (matrix[i][j] != '') cnt += 1;
        }
    }
    count_active = cnt;
    localStorage.setItem('matrix', matrix);
}


function directions(e) {
    e = e || window.Event;
    if ([LEFT, UP, RIGHT, DOWN].includes(e.keyCode)) {
        matrix = moving(matrix, e.keyCode);
        generateRandomCell(matrix);
        refreshGrid(matrix);
    }
    if (e.keyCode == RESTART) {
        restartGrid();
    }
}


function showLoss() {
    document.getElementById('loss').style.display = "flex";
}

function showWin() {
    document.getElementById('win').style.display = 'flex';
}


function colorSet(value, tile) {
    switch (value) {
        case '': tile.style.background = '#cdc0b4'; break;
        case '2': tile.style.background = '#fbfced'; break;
        case '4': tile.style.background = '#ecefc6'; break;
        case '8': tile.style.background = '#ffb296'; break;
        case '16': tile.style.background = '#ff7373'; break;
        case '32': tile.style.background = '#f6546a'; break;
        case '64': tile.style.background = '#8b0000'; break;
        case '128': tile.style.background = '#794044'; break;
        case '256': tile.style.background = '#31698a'; break;
        case '512': tile.style.background = '#297A76'; break;
        case '1024': tile.style.background = '#2D8A68'; break;
        case '2048': tile.style.background = '#1C9F4E'; break;
        case '4096': tile.style.background = '#468499'; break;
        case '8192': tile.style.background = '#0E2F44'; break;
    }
    if (['', '2', '4', '8'].includes(value)) {
        tile.style.color = '#766e65';
    }
    else {
        tile.style.color = '#fbfced';
    }
    if (['1024', '2048']) {
        tile.style.fontSize = '40px';
    }
    if (value == '2048') {
        showWin();
    }
}
