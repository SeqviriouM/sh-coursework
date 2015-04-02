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
  var threads = [];

  for (var item in tree) {
    if (tree[item].start === true) {
        //vertexes.push(item);
        var help_threads = [];
        help_threads[0] = {
            top: item,
            way: new Array(item)
        }
        help_threads = addThread(help_threads, tree);
        threads = threads.concat(help_threads);
    }
  }

  output('Ways: ');
  for (var thread in threads) {
    output(threads[thread].way);
  }
}

function addThread(threads, tree) {
    var changed = false;
    var threads_length = threads.length; 
    for (var i = 0; i < threads_length; i++) {
        if (Object.keys(tree[threads[i].top].directions).length !== 0) {
            changed = true;
            if (Object.keys(tree[threads[i].top].directions).length > 1) {                
                threads[i].way.push(Object.keys(tree[threads[i].top].directions)[0]);
                for (var k = 1; k < Object.keys(tree[threads[i].top].directions).length; k++) {
                    //var help_thread = threads.slice(i,1);
                    var copied_thread = jQuery.extend(true, {}, threads[i]);
                    copied_thread.top = Object.keys(tree[threads[i].top].directions)[k];
                    copied_thread.way[copied_thread.way.length - 1] = Object.keys(tree[threads[i].top].directions)[k];
                    threads.push(copied_thread);
                }
                threads[i].top = Object.keys(tree[threads[i].top].directions)[0];
            } else if (Object.keys(tree[threads[i].top].directions).length === 1) {
                threads[i].way.push(Object.keys(tree[threads[i].top].directions)[0]);
                threads[i].top = Object.keys(tree[threads[i].top].directions)[0];
            }
        }
    }

    if (changed) {
        return addThread(threads, tree);
    } else {
        return threads;
    }
}

function calculate(tree) {
    getThreads(tree);
}





$(function () {

    var tree = {
        1: {
            value: 4,
            start: true,
            directions: {
                4: '5+',
                5: '4+',
                6: '2+',
                7: '7+'
            },
        },
        2: {
            value: 5,
            start: true,
            directions: {
                7: '7&',
                9: '3&'
            }
        },
        3: {
            value: 8,
            start: true,
            directions: {
                9: '3&'
            }            
        },
        4: {
            value: 5,
            directions: {
                11: '2+'
            }
        },
        5: {
            value: 6,
            directions: {
                11: '4+'
            }
        },
        6: {
            value: 6,
            directions: {
                11: '3&',
                12: '2+'
            }            
        },
        7: {
            value: 1,
            directions: {
                12: '1+'
            }
        }, 
        8: {
            value: 2,
            start: true,
            directions: {
                13: '2&'    
            }
        },
        9: {
            value: 3,
            directions: {
                13: '3&'
            }
        },
        10: {
            value: 4,
            start: true,
            directions: {
                14: 2
            }            
        },
        11: {
            value: 4,
            directions: {
                15: '1&',
                16: '3&'
            }            
        },
        12: {
            value: 5,
            directions: {
                17: 2
            }
        },
        13: {
            value: 4,
            directions: {
                18: 4
            },
        },
        14: {
            value: 3,
            directions: {
                19: '3&',
                20: '2&'
            }
        },
        15: {
            value: 6,
            directions: {
                21: '3+',
                22: '4+',
                23: '5+'
            }            
        },
        16: {
            value: 7,
            directions: {
            }
        },
        17: {
            value: 3,
            directions: {
            }
        },
        18: {
            value: 2,
            directions: {
            }
        },
        19: {
            value: 1,
            directions: {
                24: '3&',
                25: '5&',
                26: '1&'
            }
        },
        20: {
            value: 2,
            directions: {
            }
        },
        21: {
            value: 3,
            directions: {
                27: '3&',
                28: '1&'
            }            
        },
        22: {
            value: 4,
            directions: {
            }
        },
        23: {
            value: 5,
            directions: {
                29: '3+',
                30: '4+'
            }            
        },
        24: {
            value: 5,
            directions: {
                30: '5+'
            }
        },
        25: {
            value: 2,
            directions: {
            }
        },
        26: {
            value: 3,
            directions: {
            }
        },
        27: {
            value: 6,
            directions: {
            }
        },
        28: {
            value: 5,
            directions: {

            }
        },
        29: {
            value: 4,
            directions: {
            }
        },
        30: {
            value: 3,
            directions: {
            }
        }
    }

    calculate(tree);
    //compute(tree);

});