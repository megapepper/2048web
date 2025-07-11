const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const RESTART = 82;
const SIZE = 4;


let count_active = 0;
let direction_positions = {};
direction_positions[LEFT] = [0, -1, 0, SIZE, 1, SIZE];
direction_positions[UP] = [-1, 0, 1, SIZE, 0, SIZE];
direction_positions[RIGHT] = [0, 1, 0, SIZE, 0, SIZE - 1];
direction_positions[DOWN] = [1, 0, 0, SIZE - 1, 0, SIZE];


function checkLoss(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (i > 0 && matrix[i][j] == matrix[i - 1][j]) return false;
            if (i < matrix.length - 1 && matrix[i][j] == matrix[i + 1][j]) return false;
            if (j > 0 && matrix[i][j] == matrix[i][j - 1]) return false;
            if (j < matrix[0].length - 1 && matrix[i][j] == matrix[i][j + 1]) return false;
        }
    }
    return true;
}


function getRnd24() {
    let value = Math.random();
    if (value < 0.5) return '2'
    else return '4';
}


function generateRandomCell(matrix) {
    let count_empty = SIZE * SIZE - count_active;
    if (count_empty == 0) {
        if (checkLoss(matrix)) showLoss();
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


function restoreMatrix(numbers) {
    let matrix = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
    for (let i = 0; i < SIZE; i++) {
        matrix[i] = numbers.slice(i * SIZE, (i + 1) * SIZE);
    }
    return matrix;
}


function moving(matrix, keyCode) {
    let [i_shift, j_shift, i_start, i_end, j_start, j_end] = direction_positions[keyCode];
    for (let iter = 0; iter < SIZE; iter++) {
        for (let i = i_start; i < i_end; i++) {
            for (let j = j_start; j < j_end; j++) {
                if (iter == SIZE - 1) { // в последней итерации убираем пометки у слившихся ячеек
                    if (matrix[i + i_shift][j + j_shift].length > 7) {
                        matrix[i + i_shift][j + j_shift] = matrix[i + i_shift][j + j_shift].substr(7);
                    }
                }
                else if (matrix[i + i_shift][j + j_shift] == '') {
                    matrix[i + i_shift][j + j_shift] = matrix[i][j];
                    matrix[i][j] = '';
                }
                else if (matrix[i + i_shift][j + j_shift].length < 7 && matrix[i + i_shift][j + j_shift] == matrix[i][j]) {
                    matrix[i + i_shift][j + j_shift] = 'merged_' + 2 * matrix[i + i_shift][j + j_shift];
                    matrix[i][j] = '';
                }
            }
        }
    }
    return matrix;
}


module.exports = { checkLoss, getRnd24, generateRandomCell, moving, restoreMatrix };
