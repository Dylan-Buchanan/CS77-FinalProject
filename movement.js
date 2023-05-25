function changeShape(meshpos, pos, amt, dir)
{
    // 0 = wide, 1 = shrink, 2 = tall, 3 = short
    if (dir) {
        for (var i = 0; i < pos.length; i++) {
            meshpos[pos[i]] += amt;
        }
    }
    else {
        for (var i = 0; i < pos.length; i++) {
            meshpos[pos[i]] -= amt;
        }
    }
}

var rightCube = [
    3, 6, 18, 21, 30,
    33, 39, 42, 48, 51,
    54, 57,
];

var leftCube = [
    0, 9, 12, 15, 24, 27,
    36, 45, 60, 63, 66,
    69,
]

var topCube = [
    7, 10, 16, 19, 25,
    28, 31, 34, 52, 55,
    67, 70,
]