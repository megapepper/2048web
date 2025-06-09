// - выложить на git
// + имена функций в одном стиле
// + убрать лишние console.log
// - где возможно - colorSet переделать на стили
// - уменьшить число магических чисел (нужны именованные константы)
// - опционально - попробовать написать тесты: может подойти фреймворк jest
// - сделать сохранение текущего прогресса используя localStorage
// - при перезагрузке страницы текущее состояние матрицы должно сохраняться
// - сделать кнопку рестарта на экране, должно работать по какой-то кнопке на клавиатуре - R
// - дочитать главу 2
// - установить nodejs, написать на нём консольный Hello world
// - поправить шрифты сообщений
// - ширина игрового поля при ресайзе должна уменьшаться (вместе с высотой) по ширине экрана

window.onload = function () {
    initGrid();
    directions();
};

const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
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
            if (i > 0 && matrix[i][j] == matrix[i-1][j]) return false;
            if (i < SIZE-1 && matrix[i][j] == matrix[i+1][j]) return false;
            if (j > 0 && matrix[i][j] == matrix[i][j-1]) return false;
            if (j < SIZE-1 && matrix[i][j] == matrix[i][j+1]) return false;
        }
    }
    return true;
}

function showLoss() {
    document.getElementById('loss').style.display= "flex"; 
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
                    if (cnt == 0){
                        let cell = cells[i * SIZE + j];
                        matrix[i][j] = getRnd24()
                        cell.getElementsByClassName('inner')[0].innerHTML = matrix[i][j];
                        colorSet(matrix[i][j], cell);
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
    container = document.getElementsByClassName('grid-container');
    play = container[0].getElementsByClassName('grid-play');
    cells = play[0].getElementsByClassName('cell');
    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            let gridItem = document.createElement('div');
            gridItem.classList.add('inner');
            gridItem.textContent = matrix[i][j];
            cells[i * SIZE + j].appendChild(gridItem);
        }
    }
    let val1 = getRnd24();
    let val2 = getRnd24();
    let coords1 = getRndXY();
    let coords2 = getRndXY();
    while (coords1.every((value, index) => value === coords2[index])) {  // координаты должны отличаться
        coords2 = getRndXY();
    }

    matrix[coords1[0]][coords1[1]] = val1;
    let cell1 = cells[coords1[0] * SIZE + coords1[1]];
    cell1.getElementsByClassName('inner')[0].innerHTML = val1;
    colorSet(val1, cell1);

    matrix[coords2[0]][coords2[1]] = val2;
    let cell2 = cells[coords2[0] * SIZE + coords2[1]];
    cell2.getElementsByClassName('inner')[0].innerHTML = val2;
    colorSet(val2, cell2);

    count_active = 2;
}

document.onkeydown = directions;

function directions(e) {
    e = e || window.Event;
    if ([LEFT,UP,RIGHT,DOWN].includes(e.keyCode)) {
        if (e.keyCode == LEFT) {
            for (let iter = 0; iter < SIZE; iter++) {
                for (let i = 0; i < SIZE; i++) {
                    for (let j = 1; j < SIZE; j++) {
                        if (iter == SIZE - 1) { // в последней итерации убираем пометки у слившихся ячеек
                            if (matrix[i][j-1].length > 7) {
                                matrix[i][j-1] = matrix[i][j-1].substr(7);
                            }
                        }
                        else if (matrix[i][j-1] == '') {
                            matrix[i][j-1] = matrix[i][j];
                            matrix[i][j] = '';
                        }
                        else if (matrix[i][j-1].length < 7 && matrix[i][j-1] == matrix[i][j]) {
                            matrix[i][j-1] = 'merged_' + 2 * matrix[i][j-1];
                            matrix[i][j] = '';
                        }

                    }
                }
            }
        }
        else if (e.keyCode == UP) {
            for (let iter = 0; iter < SIZE; iter++) {
                for (let j = 0; j < SIZE; j++) {
                    for (let i = 1; i < SIZE; i++) {
                        if (iter == SIZE - 1) { 
                            if (matrix[i - 1][j].length > 7) {
                                matrix[i - 1][j] = matrix[i - 1][j].substr(7);
                            }
                        }
                        else if (matrix[i - 1][j] == '') {
                            matrix[i - 1][j] = matrix[i][j];
                            matrix[i][j] = '';
                        }
                        else if (matrix[i - 1][j].length < 7 && matrix[i - 1][j] == matrix[i][j]) {
                            matrix[i - 1][j] = 'merged_' + 2 * matrix[i - 1][j];
                            matrix[i][j] = '';
                        }
                    }
                }
            }
        }
        else if (e.keyCode == RIGHT){
            for (let iter = 0; iter < SIZE; iter++) {
                for (let i = 0; i < SIZE; i++) {
                    for (let j = SIZE-2; j >=0; j--) {
                        if (iter == SIZE - 1) {
                            if (matrix[i][j+1].length > 7) {
                                matrix[i][j+1] = matrix[i][j+1].substr(7);
                            }
                        }
                        else if (matrix[i][j+1] == '') {
                            matrix[i][j+1] = matrix[i][j];
                            matrix[i][j] = '';
                        }
                        else if (matrix[i][j+1].length < 7 && matrix[i][j+1] == matrix[i][j]) {
                            matrix[i][j+1] = 'merged_' + 2 * matrix[i][j+1];
                            matrix[i][j] = '';
                        }

                    }
                }
            }
        }
        else if (e.keyCode == DOWN) {
            for (let iter = 0; iter < SIZE; iter++) {
                for (let j = 0; j < SIZE; j++) {
                    for (let i = SIZE-2; i >=0; i--) {
                        if (iter == SIZE - 1) {  
                            if (matrix[i+1][j].length > 7) {
                                matrix[i + 1][j] = matrix[i + 1][j].substr(7);
                            }
                        }
                        else if (matrix[i + 1][j] == '') {
                            matrix[i + 1][j] = matrix[i][j];
                            matrix[i][j] = '';
                        }
                        else if (matrix[i + 1][j].length < 7 && matrix[i + 1][j] == matrix[i][j]) {
                            matrix[i + 1][j] = 'merged_' + 2 * matrix[i + 1][j];
                            matrix[i][j] = '';
                        }

                    }
                }
            }
        }
    
        refreshGrid();
        generateRandomCell();
    }
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
}

function colorSet(value, tile) {
    switch (value) {
        case '': tile.style.background = '#cdc0b4'; tile.style.color = '#766e65'; break;
        case '2': tile.style.background = '#fbfced'; tile.style.color = '#766e65'; break;
        case '4': tile.style.background = '#ecefc6'; tile.style.color = '#766e65'; break;
        case '8': tile.style.background = '#ffb296'; tile.style.color = '#766e65'; break;
        case '16': tile.style.background = '#ff7373'; tile.style.color = '#fbfced'; break;
        case '32': tile.style.background = '#f6546a'; tile.style.color = '#fbfced'; break;
        case '64': tile.style.background = '#8b0000'; tile.style.color = '#fbfced'; break;
        case '128': tile.style.background = '#794044'; tile.style.color = '#fbfced';
            tile.style.fontSize = '50px'; break;
        case '256': tile.style.background = '#31698a'; tile.style.color = '#fbfced';
            tile.style.fontSize = '50px'; break;
        case '512': tile.style.background = '#297A76'; tile.style.color = '#fbfced';
            tile.style.fontSize = '50px'; break;
        case '1024': tile.style.background = '#2D8A68'; tile.style.color = '#fbfced';
            tile.style.fontSize = '40px'; break;
        case '2048': tile.style.background = '#1C9F4E'; tile.style.color = '#fbfced';
            tile.style.fontSize = '40px';
            document.getElementById('win').style.display= 'flex'; break;
        case '4096': tile.style.background = '#468499'; tile.style.color = '#fbfced';
            tile.style.fontSize = '40px'; break;
        case '8192': tile.style.background = '#0E2F44'; tile.style.color = '#fbfced';
            tile.style.fontSize = '40px'; break;
    }
}