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
    resetWall();
    cubeMinWidth = cubeMinWidth;
    cubeMinHeight = cubeMinHeight;

    var left = Math.random() * (2. - cubeMinWidth) - 0.5;
    var minX = (1. - left - cubeMinWidth) * -1.;
    var right = Math.random() * (0.5 - minX) + minX;

    var bottom = Math.random() * (2. - cubeMinHeight) - 0.5;
    var minY = (1. - bottom - cubeMinHeight) * -1.;
    var top = Math.random() * (0.5 - minY) + minY;

    changeShape(meshpos, leftWall, left, true);
    changeShape(meshpos, rightWall, right, true);
    changeShape(meshpos, topWall, top, true);
    changeShape(meshpos, bottomWall, bottom, true);
}

function resetWall() {
    for (var i = 0; i < leftWall.length; i++) {
        WallPositions[leftWall[i]] = -0.5;
    }

    for (var i = 0; i < rightWall.length; i++) {
        WallPositions[rightWall[i]] = 0.5;
    }

    for (var i = 0; i < topWall.length; i++) {
        WallPositions[topWall[i]] = 0.5;
    }

    for (var i = 0; i < bottomWall.length; i++) {
        WallPositions[bottomWall[i]] = -0.5;
    }
}

var checkCollision = function(xChange, yChange, scale) {
    var ctlx = (CubePositions[15] * scale) + xChange;
    var ctrx = (CubePositions[18] * scale) + xChange;
    var cbly = (CubePositions[13] * scale) + yChange;
    var ctly = (CubePositions[16] * scale) + yChange;

    var wtlx = WallPositions[51] * 3.;
    var wtrx = WallPositions[63] * 3.;
    var wbly = (WallPositions[49] * 1.5) + 1.5;
    var wtly = (WallPositions[52] * 1.5) + 1.5;

    if (wtlx > ctlx || wtrx < ctrx) {
        return true;
    }
    if (wbly > cbly || wtly < ctly) {
        return true;
    }
    return false;
}

var checkCanMove = function(xChange, maxX, scale, speed, input) {
    // 0 = left, 1 = right, 2 = grow
    var xDist = (Math.abs(CubePositions[12]) + Math.abs(CubePositions[21])) * scale / 2.;
    if (input == 0 || input == 2) {
        if (((CubePositions[12] + xChange - speed)) <= -1 * maxX - xDist) {
            return false;
        }
    }
    else {
        if (((CubePositions[21] + xChange + speed)) >= maxX + xDist) {
            return false;
        }
    }
    return true;
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