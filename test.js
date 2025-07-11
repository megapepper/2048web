const { checkLoss, getRnd24, generateRandomCell, moving, restoreMatrix, LEFT, RIGHT, UP, DOWN } = jest.requireActual('./funcs');

const { toBeOneOf } = require('jest-extended');
expect.extend({ toBeOneOf });


test('Test 0 get random initial value 2 or 4', () => {
    expect(getRnd24()).toBeOneOf(['2', '4']);
});

test('Test 1.1 check game is not lost', () => {
    expect(checkLoss(Array.from({ length: 2 }, () => Array(2).fill('2')))).toBe(false);
});

let matrix1 = [
    ['2', '4'],
    ['4', '2']
];

test('Test 1.2 check game is lost', () => {
    expect(checkLoss(matrix1)).toBe(true);
});


function countNonZeroElements(arr2D) {
    let nonZeroCount = 0;
    for (let i = 0; i < arr2D.length; i++) {
        for (let j = 0; j < arr2D[i].length; j++) {
            if (arr2D[i][j] !== '') {
                nonZeroCount++;
            }
        }
    }
    return nonZeroCount;
}

let matrix2 = Array.from({ length: 4 }, () => Array(4).fill(''));
generateRandomCell(matrix2);

test('Test 2 generate random cell', () => {
    expect(countNonZeroElements(matrix2)).toBe(1);
});

let matrix31 = [
    ['2', '', '4', ''],
    ['', '', '4', ''],
    ['2', '', '', ''],
    ['', '', '', '']
];
let matrix3up = [
    ['4', '', '8', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
];

test('Test 3.1 move up', () => {
    expect(moving(matrix31, 38)).toStrictEqual(matrix3up);
});

let matrix32 = [
    ['', '', '4', ''],
    ['8', '', '4', ''],
    ['', '', '', ''],
    ['16', '', '', '16']
];
let matrix3left = [
    ['4', '', '', ''],
    ['8', '4', '', ''],
    ['', '', '', ''],
    ['32', '', '', '']
];

test('Test 3.2 move left', () => {
    expect(moving(matrix32, 37)).toStrictEqual(matrix3left);
});

let matrix33 = [
    ['', '', '4', ''],
    ['8', '', '4', ''],
    ['', '', '4', ''],
    ['16', '', '4', '16']
];
let matrix3down = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['8', '', '8', ''],
    ['16', '', '8', '16']
];

test('Test 3.3 move down', () => {
    expect(moving(matrix33, 40)).toStrictEqual(matrix3down);
});

let matrix34 = [
    ['', '4', '', '2'],
    ['8', '', '', ''],
    ['', '', '', ''],
    ['16', '', '', '']
];
let matrix3right = [
    ['', '', '4', '2'],
    ['', '', '', '8'],
    ['', '', '', ''],
    ['', '', '', '16']
];

test('Test 3.4 move down', () => {
    expect(moving(matrix34, 39)).toStrictEqual(matrix3right);
});


let numbers = ['16', '8', '', '', '4', '', '2', '', '2', '', '', '', '8', '', '', ''];
let matrix4 = [
    ['16', '8', '', ''],
    ['4', '', '2', ''],
    ['2', '', '', ''],
    ['8', '', '', '']
];

test('Test 4 restore matrix', () => {
    expect(restoreMatrix(numbers)).toStrictEqual(matrix4);
});