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

function randomWall(meshpos, cubeMinWidth, cubeMinHeight) {
    var firstSideLR = Math.random();
    var firstSideTB = Math.random();
    var left;
    var right;
    var top;
    var bottom;
    if (firstSideLR < 0.5) {
        left = Math.max((Math.random() - 0.5) * 2.0, -0.5);
        right = Math.min(0.5, Math.max(left - cubeMinWidth, (Math.random() - 0.5) * 2.0));
    }
    else {
        right = Math.min((Math.random() - 0.5) * 2.0, 0.5);
        left = Math.max(-0.5, Math.min(right + cubeMinWidth, (Math.random() - 0.5) * 2.0));
    }

    if (firstSideTB < 0.5) {
        top = Math.min((Math.random() - 0.5) * 2.0, 0.5);
        bottom = Math.max(-0.5, Math.min(top + cubeMinHeight, (Math.random() - 0.5) * 2.0));
    }
    else {
        bottom = Math.max((Math.random() - 0.5) * 2.0, -0.5);
        top = Math.min(0.5, Math.max(bottom - cubeMinHeight, (Math.random() - 0.5) * 2.0));
    }

    changeShape(meshpos, leftWall, left, true);
    changeShape(meshpos, rightWall, right, true);
    changeShape(meshpos, topWall, top, true);
    changeShape(meshpos, bottomWall, bottom, true);
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

var leftWall = [
    48, 51, 54, 57, 72, 
    75, 84, 87, 99, 102, 
    120, 129, 132, 141,
]

var rightWall = [
    60, 63, 66, 69, 78,
    81, 90, 93, 108, 117,
    123, 126, 135, 138,
]

var topWall = [
    52, 55, 64, 67, 85,
    88, 91, 94, 127, 130,
]

var bottomWall = [
    49, 58, 61, 70, 73,
    76, 79, 82, 139, 142,
]