// + выложить на git
// + имена функций в одном стиле
// + убрать лишние console.log
// + где возможно - colorSet переделать на стили
// + уменьшить число магических чисел (нужны именованные константы)
// [- опционально - попробовать написать тесты: может подойти фреймворк jest]
// + сделать сохранение текущего прогресса используя localStorage
// + при перезагрузке страницы текущее состояние матрицы должно сохраняться
// + сделать кнопку рестарта на экране, должно работать по какой-то кнопке на клавиатуре - R
// - дочитать главу 2
// - установить nodejs, написать на нём консольный Hello world
// + поправить шрифты сообщений
// - ширина игрового поля при ресайзе должна уменьшаться (вместе с высотой) по ширине экрана

window.onload = function () {
    //initGrid();
    //directions();
    restoreGrid();
};

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const RESTART = 82;
const SIZE = 4;

let matrix = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
let container;
let play;
let cells;
let count_active = 0;

function getRnd24() {
    let value = Math.random();
    if (value < 0.5) return '2'
    else return '4';
}

function checkLoss() {
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            if (i > 0 && matrix[i][j] == matrix[i - 1][j]) return false;
            if (i < SIZE - 1 && matrix[i][j] == matrix[i + 1][j]) return false;
            if (j > 0 && matrix[i][j] == matrix[i][j - 1]) return false;
            if (j < SIZE - 1 && matrix[i][j] == matrix[i][j + 1]) return false;
        }
    }
    return true;
}

function showLoss() {
    document.getElementById('loss').style.display = "flex";
}

function getRndXY() {
    let x = Math.floor(Math.random() * SIZE);
    let y = Math.floor(Math.random() * SIZE);
    return [x, y];
}

function generateRandomCell() {
    let count_empty = SIZE * SIZE - count_active;
    if (count_empty == 0) {
        if (checkLoss()) showLoss();
    }
    else {
        let cnt = Math.floor(Math.random() * count_empty) + 1;
        while (cnt > 0) {
            for (let i = 0; i < SIZE; i++) {
                for (let j = 0; j < SIZE; j++) {
                    if (matrix[i][j] == '') cnt -= 1;
                    if (cnt == 0) {
                        matrix[i][j] = getRnd24();
                        count_active += 1
                        break;
                    }
                }
                if (cnt == 0) break;
            }
        }
    }
}

function initGrid() {
    if (localStorage.getItem('matrix') == null) {
        container = document.getElementsByClassName('grid-container');
        play = container[0].getElementsByClassName('grid-play');
        cells = play[0].getElementsByClassName('cell');
        matrix = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
        generateRandomCell();
        generateRandomCell();
        refreshGrid();
    }
}

function restoreGrid() {
    if (localStorage.getItem('matrix') !== null) {
        numbers = localStorage.getItem('matrix').split(',');
        for (let i = 0; i < SIZE; i++) {
            matrix[i] = numbers.slice(i * 4, (i + 1) * 4);
        }
        container = document.getElementsByClassName('grid-container');
        play = container[0].getElementsByClassName('grid-play');
        cells = play[0].getElementsByClassName('cell');
        refreshGrid();
    }
}

document.onkeydown = directions;

let direction_positions = {};
direction_positions[LEFT] = [0, -1, 0, SIZE, 1, SIZE];
direction_positions[UP] = [-1, 0, 1, SIZE, 0, SIZE];
direction_positions[RIGHT] = [0, 1, 0, SIZE, 0, SIZE - 1];
direction_positions[DOWN] = [1, 0, 0, SIZE - 1, 0, SIZE];


function directions(e) {
    e = e || window.Event;
    if ([LEFT, UP, RIGHT, DOWN].includes(e.keyCode)) {
        let [i_pos, j_pos, i_start, i_end, j_start, j_end] = direction_positions[e.keyCode];
        for (let iter = 0; iter < SIZE; iter++) {
            for (let i = i_start; i < i_end; i++) {
                for (let j = j_start; j < j_end; j++) {
                    if (iter == SIZE - 1) { // в последней итерации убираем пометки у слившихся ячеек
                        if (matrix[i + i_pos][j + j_pos].length > 7) {
                            matrix[i + i_pos][j + j_pos] = matrix[i + i_pos][j + j_pos].substr(7);
                        }
                    }
                    else if (matrix[i + i_pos][j + j_pos] == '') {
                        matrix[i + i_pos][j + j_pos] = matrix[i][j];
                        matrix[i][j] = '';
                    }
                    else if (matrix[i + i_pos][j + j_pos].length < 7 && matrix[i + i_pos][j + j_pos] == matrix[i][j]) {
                        matrix[i + i_pos][j + j_pos] = 'merged_' + 2 * matrix[i + i_pos][j + j_pos];
                        matrix[i][j] = '';
                    }

                }
            }
        }
        generateRandomCell();
        refreshGrid();
    }
    if (e.keyCode == RESTART) {
        restartGrid();
    }
}

function restartGrid() {
    localStorage.clear();
    document.getElementById('loss').style.display = 'none';
    document.getElementById('win').style.display = 'none';
    initGrid();
}

function refreshGrid() {
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
        document.getElementById('win').style.display = 'flex';
    }
}
