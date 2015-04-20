function pretty(input) {
    return JSON.stringify(input, null, '\t');
}

function pp(input) {
    console.log(pretty(input));
}

function copy(input) {
    return JSON.parse(JSON.stringify(input));
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
