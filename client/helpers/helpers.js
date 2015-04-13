function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function output(input, output) {
    if (output) {
        $(output).append('<div>' + input + '</div>');   
    } else {
        $('.output').append('<div>' + input + '</div>');   
    }
}

function copy(input) {
    return JSON.parse(JSON.stringify(input));
}

function printMatr(input, title) {
    var result = '<h3 class="title">' + title + '</h3><table class="table table-hover"><tbody><tr><td></td>',
        N = input.length;

    for (var i = 1; i <= N; i++) {
        result += '<td><span style="color:#999;display:inline-block;transform:rotate(-45deg);padding-bottom:4px">' + i + '</span></td>';
        // if (i < 10) {
        //     result += '  ';
        // }
    }

    result += '</tr>'

    input.forEach(function (row, i) {
        result += '<tr><td><span style="color:#999">' + (i+1) + '</span></td>   ';
        if (i < 9) {
            result += '  ';
        }
        row.forEach(function (el) {
            result += '<td>' + el + '</td>';
        });
        result += '</tr>';
    });

    result += '</tbody></table>'

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
