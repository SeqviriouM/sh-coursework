graph = new ReactiveDict;
graph.set('threads', []);
graph.set('packing_threads', []);

Template.curse_work.helpers({
    threads: function () {
        return graph.get('threads');
    },
    packing_threads : function () {
        return graph.get('packing_threads');
    }
})


function output(input, output) {
    if (output) {
        $(output).append('<div>' + input + '</div>');   
    } else {
        $('.output').append('<div>' + input + '</div>');   
    }
}

function printMatr(input, title) {
    var result = '<h3 class="title">' + title + '</h3><table class="table table-striped table-hover"><tbody><tr><td></td>',
        N = input.length;

    for (var i = 1; i <= N; i++) {
        result += '<td><span style="color:#999;display:inline-block;transform:rotate(-45deg);padding-bottom:4px">' + i + '</span></td>';
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

function getAllPaths(tree) {
  var paths = [];

  for (var item in tree) {
    if (tree[item].start === true) {
        var current_vertex_paths = [];
        current_vertex_paths[0] = {
            top: item,
            way: new Array(item)
        }
        current_vertex_paths = addPath(current_vertex_paths, tree);
        paths = paths.concat(current_vertex_paths);
    }
  }

  output('Ways: ');
  for (var path in paths) {
    output(paths[path].way);
  }
}

function addPath(paths, tree) {
    var changed = false;
    var paths_length = paths.length; 
    for (var i = 0; i < paths_length; i++) {
        if (Object.keys(tree[paths[i].top].directions).length !== 0) {
            changed = true;
            if (Object.keys(tree[paths[i].top].directions).length > 1) {                
                paths[i].way.push(Object.keys(tree[paths[i].top].directions)[0]);
                for (var k = 1; k < Object.keys(tree[paths[i].top].directions).length; k++) {
                    var copied_path = jQuery.extend(true, {}, paths[i]);
                    copied_path.top = Object.keys(tree[paths[i].top].directions)[k];
                    copied_path.way[copied_path.way.length - 1] = Object.keys(tree[paths[i].top].directions)[k];
                    paths.push(copied_path);
                }
                paths[i].top = Object.keys(tree[paths[i].top].directions)[0];
            } else if (Object.keys(tree[paths[i].top].directions).length === 1) {
                paths[i].way.push(Object.keys(tree[paths[i].top].directions)[0]);
                paths[i].top = Object.keys(tree[paths[i].top].directions)[0];
            }
        }
    }

    if (changed) {
        return addPath(paths, tree);
    } else {
        return paths;
    }
}

function getThreads(tree, matr) {
    var copied_tree = $.extend(true, {}, tree),
        threads = [],
        end = false;

    while (!end) {
        end = true;
        for (var item in copied_tree) {
            if (!copied_tree[item].deleted) {
                end = false;
                var help_thread = {top: item, way: new Array(item), value: copied_tree[item].value, index: threads.length};
                help_thread = addThread(help_thread, copied_tree, matr);
                threads.push(help_thread);
                break;
            }
        }
    }

    getTimes(threads, copied_tree, matr)

    return threads;
}

function addThread(thread, tree, matr) {
    var previous_top = thread.top;

    var checkConnections = function (top, prev_top, tree, matr) {
        var change_vertices = matr[top-1].map(function (item, index) { return (item != 0) ? ++index : -1; });
        if (change_vertices.lenght !== 0) {
            change_vertices.forEach(function (item) {
                if ( item != -1 && (item) != previous_top && !tree[item].deleted) {
                    tree[item].value += parseInt(tree[item].directions[top]);    
                }
            })
        }
    }

    if (Object.keys(tree[thread.top].directions).length !== 0) {
        if (Object.keys(tree[thread.top].directions).length > 1) {
            var max_dir_value = 0,
                max_dir;
            for (var dir in tree[thread.top].directions) {
                if (parseInt(tree[thread.top].directions[dir]) > max_dir_value && !tree[dir].deleted) {
                    max_dir_value = parseInt(tree[thread.top].directions[dir]);
                    max_dir = dir;
                }
            }
            if (max_dir) {
                for (var dir in tree[thread.top].directions) {
                    if (dir !== max_dir) {
                        tree[dir].value += parseInt(tree[thread.top].directions[dir]);
                    }
                }
                tree[thread.top].deleted = true;
                thread.way.push(max_dir);
                thread.value += tree[max_dir].value;
                thread.top = max_dir;    
            } else {
                tree[thread.top].deleted = true;
                return thread;
            }
            
        } else if (Object.keys(tree[thread.top].directions).length === 1) {
            if (!tree[Object.keys(tree[thread.top].directions)[0]].deleted) {
                tree[thread.top].deleted = true;
                thread.way.push(Object.keys(tree[thread.top].directions)[0]);
                thread.value += tree[Object.keys(tree[thread.top].directions)[0]].value;
                thread.top = Object.keys(tree[thread.top].directions)[0];
            } else {
                tree[thread.top].deleted = true;
                return thread;
            }   
        }

        checkConnections(thread.top, previous_top, tree, matr);
        return addThread(thread, tree, matr);

    } else {
        tree[thread.top].deleted = true;
        return thread;
    }
}

function getTimes(threads, tree, matr) {
    for (thread in threads) {
        if (matr[threads[thread].way[0]-1].every(function (item) { return item === 0 })) {
            threads[thread].begin = 0;
            threads[thread].end = threads[thread].value;
        } else {
            var cur_top_weight = 0,
                cur_top_index;
            
            threads[thread].begin = 0;

            matr[threads[thread].way[0]-1].forEach(function (item, index) {
                if (parseInt(item) > cur_top_weight) {
                    cur_top_index = index;
                    cur_top_weight = item;
                }
            });

            while (cur_top_index !== false) {
                threads[thread].begin += tree[cur_top_index + 1].value;
                if (matr[cur_top_index].every(function (item) { return item === 0 })) {
                    cur_top_index = false;
                } else {
                    cur_top_weight = 0;
                    cur_top_index = 0;

                    matr[cur_top_index].forEach(function (item, index) {
                        if (parseInt(item) > cur_top_weight) {
                            cur_top_index = index;
                            cur_top_weight = item;
                        }
                    });
                }
            }
            threads[thread].end = threads[thread].begin + threads[thread].value
        }
    }
}

function connectionThreads(threads, tree, matr) {
    for (thread in threads) {
        threads[thread].way.forEach(function (item, index) {

        })
    }
}

function packingThreads(threads) {
    var times = [],
        packing_threads = [];

    threads.forEach(function (item, index) {
        times.push({ thread: item.index, begin: item.begin, end: item.end });
    });

    times.sort(function (a, b) {
        return a.begin - b.begin; 
    });

    times.forEach(function (item) {
        var flag = false;
        packing_threads.forEach(function (t) {
            if (item.begin >= t[t.length-1].end && !flag) {
                t.push(item);
                flag = true;
            }
        });
        if (!flag) {
            packing_threads.push(new Array(item));
        }
    })

    return packing_threads;
}

function processorsConnection(packing_threads, threads, tree) {
    var connections = [],
        processors = [];

    packing_threads.forEach(function (item) {
        var tops = [];
        item.forEach(function (t) {
            tops = tops.concat(threads[t.thread].way);
        })
        connections.push(tops);
    });

    connections.forEach(function (item) {
        var proc_connects = [];
        item.forEach(function (t) {
            for (i in tree[t].directions) {                
                connections.forEach(function (el, index) {
                    if (el.indexOf(i) !== -1) {
                        proc_connects.push(index); 
                    }
                });
            }
        })
        processors.push(proc_connects);
    });

    for (var i in processors) {
        processors[i] = processors[i].filter(function (el) {
            return el != i;
        });
        for (var j in processors[i]) {
            if (processors[processors[i][j]].indexOf(parseInt(i)) === -1) {
                processors[processors[i][j]].push(parseInt(i));
            }
        }
    }

    return processors;
}

function drawGraph(tree) {
    var container = $('#graph'),
        nodes = [],
        edges = [];

    for (var i in tree) {
        nodes.push( { data: { id: 'a' + i } } );
        for (var j in tree[i].directions) {
            edges.push( { data: { id: i+j, source: 'a' + i, target: 'a' + j } } );    
        }
    }

    var elements = {nodes: nodes, edges: edges};

    var cy = cytoscape({
        container: document.getElementById('graph'),
        style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'content': 'data(id)'
          })
        .selector('edge')
          .css({
            'target-arrow-shape': 'triangle',
            'width': 4,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd'
          })
        .selector('.highlighted')
          .css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }),
        elements: elements,
        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10
        }
    });
}

function drawProcessors(processors) {
    var nodes = [],
        edges = [];

    for (var i in processors) {
        nodes.push( { data: { id: 'p' + i } } );
        for (var j in processors[i]) {
            if (edges.every(function (item) {
                return (item.data.source != 'p' + processors[i][j] || item.data.target != 'p' + i); })) {
                edges.push( { data: { id: i+j, source: 'p' + i, target: 'p' + processors[i][j] } } );    
            }
        }
    }

    var elements = {nodes: nodes, edges: edges};

    var cy = cytoscape({
        container: document.getElementById('processors-graph'),
        style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'content': 'data(id)'
          })
        .selector('edge')
          .css({
            'width': 4,
            'line-color': '#ddd'
          })
        .selector('.highlighted')
          .css({
            'background-color': '#61bffc',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
          }),
        elements: elements,
        layout: {
            name: 'breadthfirst',
            directed: true,
            padding: 10
        }
    });
}

function calculate(tree) {
    var threads,
        packing_threads,
        matr = [],
        processors = [];

    drawGraph(tree);

    Object.keys(tree).forEach(function(currentValue, index, arr) {
        var current = tree[currentValue],
            row = [];

        arr.forEach(function(item) {
            row.push(current.directions[item] ? current.directions[item] : 0);
        });
        matr.push(row);
    });

    matr = _.zip.apply(_, matr);
    threads = getThreads(tree, matr);    
    graph.set('threads', threads);

    printMatr(matr, "Матрица следования: ");
    matr = _.zip.apply(_, matr);


    packing_threads = packingThreads(threads);
    graph.set('packing_threads', packing_threads);

    processors = processorsConnection(packing_threads, threads, tree);

    drawProcessors(processors);
    
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

    var new_tree = {
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
                7: '7&'
            }
        },
        3: {
            value: 8,
            start: true,
            directions: {
            }            
        },
        4: {
            value: 5,
            directions: {
            }
        },
        5: {
            value: 6,
            directions: {
            }
        },
        6: {
            value: 6,
            directions: {
            }            
        },
        7: {
            value: 1,
            directions: {
            }
        }
    }

    calculate(tree);
});
