function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function output(input) {
    $('.output').append('<p>' + input + '</p>');
}

function copy(input) {
    return JSON.parse(JSON.stringify(input));
}

function printMatr(input, title) {
    var result = '<h3 class="title">' + title + '</h3>       ',
        N = input.length;

    for (var i = 1; i <= N; i++) {
        result += '<span style="color:#999;display:inline-block;transform:rotate(-45deg);padding-bottom:4px">' + i + '</span>          ';
        if (i < 10) {
            result += '  ';
        }
    }

    result += '<br>'

    input.forEach(function (row, i) {
        result += '<span style="color:#999">' + (i+1) + '</span>   ';
        if (i < 9) {
            result += '  ';
        }
        row.forEach(function (el) {
            result += el + '   ';
            if (el < 10) {
                result += '         ';
            } 
            if (el.length == 2) {
                result += '       ';
            }
            if (el.length == 3) {
                result += '      ';
            }
        });
        result += '<br>';
    });

    output(result);
}

function logicSum(a,b) {
    if (a == 0 || a == 1) {
        return b;
    }
    if (b == 0 || b == 1) { 
        return a;
    }

    return (a + b);
}

function logicMultiplication(a,b) {
    if (a == 0 || b == 0) {
        return 0;
    }
    if (a == 1) { 
        return b;
    }
    if (b == 1) {
        return a;
    }

    return (a + b);
}


function compute(tree) {

    /*

    Расчет матрицы следования

    */

    var N = Object.keys(tree).length;
    
    var matr = [];

    for (var i = 1; i <= N; i++) {
        var current = tree[i],
            row = [],
            conditionState = true;

        for (var j = 0; j < N; j++) {
            if (current[j + 1]) {
                if (current.condition) {
                    row[j] = conditionState ? (i + 'T') : (i + 'F');
                    conditionState = false;
                } else {
                    row[j] = 1;
                }
            } else {
                row[j] = 0;
            }
        }

        matr.push(row);
    }

    matr = _.zip.apply(_, matr);

    printMatr(matr, "Матрица следования: ");

    matr = _.zip.apply(_, matr);
    /*

    Расчет матрицы следования с указанием весов

    */

    var values = [];
    for (var i = 1; i <= N; i++) {
        values.push(tree[i].value);
    }
    matr.push(values);
    
    // Траспонирование матрицы
    matr = _.zip.apply(_, matr);
    
    printMatr(matr, "Матрица следования с указанием весов: ");

    /* 

    Расчет матрицы следования с указанием транзитивных связей
    
    */

    // Извлечение последнего столбца(столбца с весами элементов)
    matr = _.zip.apply(_, matr);
    matr.pop();  
    matr = _.zip.apply(_, matr);

    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (matr[i][j] != 0) {
                for (k = 0; k < j; k++) {
                    matr[i][k] = logicSum(logicMultiplication(matr[j][k], matr[i][j]), matr[i][k]);
                }
            }
        }
    }

    printMatr(matr, "Матрица следования с транзитивными связями: ");

}

function getThreads(tree) {
  var vertexes = [];

  for (var item in tree) {
    output(tree[item]);
    if (tree[item].start === true) {
        vertexes.push(tree[item]);
    }
  }

  output(vertexes);
}

function addThread() {

}

function calculate(tree) {
    getThreads(tree);
}





$(function () {

    var tree = {
        1: {
            value: 4,
            start: true,
            4: '5+',
            5: '4+',
            6: '2+',
            7: '7+'
        },
        2: {
            value: 5,
            start: true,
            7: '7&',
            9: '3&'
        },
        3: {
            value: 8,
            start: true,
            9: '3&'
        },
        4: {
            value: 5,
            11: '2+'
        },
        5: {
            value: 6,
            11: '4+'
        },
        6: {
            value: 6,
            11: '3&',
            12: '2+'
        },
        7: {
            value: 1,
            12: '1+'
        }, 
        8: {
            value: 2,
            start: true,
            13: '2&'
        },
        9: {
            value: 3,
            13: '3&'
        },
        10: {
            value: 4,
            start: true,
            14: 2
        },
        11: {
            value: 4,
            15: '1&',
            16: '3&'
        },
        12: {
            value: 5,
            17: 2
        },
        13: {
            value: 4,
            18: 4
        },
        14: {
            value: 3,
            19: '3&',
            20: '2&'
        },
        15: {
            value: 6,
            21: '3+',
            22: '4+',
            23: '5+'
        },
        16: {
            value: 7
        },
        17: {
            value: 3
        },
        18: {
            value: 2
        },
        19: {
            value: 1,
            24: '3&',
            25: '5&',
            26: '1&'
        },
        20: {
            value: 2
        },
        21: {
            value: 3,
            27: '3&',
            28: '1&'
        },
        22: {
            value: 4
        },
        23: {
            value: 5,
            29: '3+',
            30: '4+'
        },
        24: {
            value: 5,
            30: '5+'
        },
        25: {
            value: 2
        },
        26: {
            value: 3
        },
        27: {
            value: 6
        },
        28: {
            value: 5
        },
        29: {
            value: 4
        },
        30: {
            value: 3
        }
    }

    calculate(tree);
    //compute(tree);

});