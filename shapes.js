var CubePositions = [
  -1, -1,  1, 
   1, -1,  1,
   1,  1,  1,
  -1,  1,  1, 
  -1, -1, -1, // <- bl 15
  -1,  1, -1, // <- tl 18
   1,  1, -1, // <- tr 21
   1, -1, -1, // <- br 24
  -1,  1, -1,
  -1,  1,  1,
   1,  1,  1,
   1,  1, -1,
  -1, -1, -1,
   1, -1, -1,
   1, -1,  1,
  -1, -1,  1,
   1, -1, -1,
   1,  1, -1,
   1,  1,  1,
   1, -1,  1,
  -1, -1, -1,
  -1, -1,  1,
  -1,  1,  1,
  -1,  1, -1,
];

var CubeNormals = [
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
];

var CubeIndices = [
   0,  1,  2,  0,  2,  3,
   4,  5,  6,  4,  6,  7,
   8,  9, 10,  8, 10, 11,
  12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19,
  20, 21, 22, 20, 22, 23,
];

function resetCube() {
  CubePositions = [
  -1, -1,  1, 
   1, -1,  1,
   1,  1,  1,
  -1,  1,  1, 
  -1, -1, -1,
  -1,  1, -1,
   1,  1, -1,
   1, -1, -1,
  -1,  1, -1,
  -1,  1,  1,
   1,  1,  1,
   1,  1, -1,
  -1, -1, -1,
   1, -1, -1,
   1, -1,  1,
  -1, -1,  1,
   1, -1, -1,
   1,  1, -1,
   1,  1,  1,
   1, -1,  1,
  -1, -1, -1,
  -1, -1,  1,
  -1,  1,  1,
  -1,  1, -1,
  ]
}

// Hole Cube
var WallPositions = [
  // Top face
  -1,  2,  1,
   1,  2,  1,
   1,  2, -1,
  -1,  2, -1,

  // Bottom face
  -1, -1,  1,
  1, -1,  1,
  1, -1, -1,
  -1, -1, -1,

  // Right face
   1, -1,  1,
   1,  2,  1,
   1,  2, -1,
   1, -1, -1,

  // Left face
  -1, -1,  1,
  -1,  2,  1,
  -1,  2, -1,
  -1, -1, -1,

  // Inner Left
  -0.5, -0.5, 1,   //*16 * 3  <- bl
  -0.5, 0.5, 1,    //*17      <- tl
  -0.5, 0.5, -1,   //*18
  -0.5, -0.5, -1,  //*19

  // Inner Right
  0.5, -0.5, 1,    //*20      <- br
  0.5, 0.5, 1,     //*21      <- tr
  0.5, 0.5, -1,    //*22
  0.5, -0.5, -1,   //*23

  // Inner Bottom
  -0.5, -0.5, 1,   //*24
  -0.5, -0.5, -1,  //*25
  0.5, -0.5, -1,   //*26
  0.5, -0.5, 1,    //*27

  // Inner Top
  -0.5, 0.5, 1,    //*28
  -0.5, 0.5, -1,   //*29
  0.5, 0.5, -1,    //*30
  0.5, 0.5, 1,     //*31

  // Front Left
  -1, 2, 1,
  -0.5, 2, 1,   //*33
  -0.5, -1, 1,  //*34
  -1, -1, 1,

  // Front Right
  0.5, 2, 1,    //*36
  1, 2, 1,
  1, -1, 1,
  0.5, -1, 1,   //*39

  // Front Top
  -0.5, 2, 1,   //40
  0.5, 2, 1,    //41
  0.5, 0.5, 1,  //42
  -0.5, 0.5, 1, //43

  // Front Bottom
  -0.5, -1, 1,  //44
  0.5, -1, 1,   //45
  0.5, -0.5, 1, //46
  -0.5, -0.5, 1, //47
];

var WallNormals = [
  // Top face
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // Bottom face
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // Right face
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // Left face
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,

  // Inner Left
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,
  -1, 0, 0,

  // Inner Right
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,

  // Inner Bottom
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,
  0, -1, 0,

  // Inner Top
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,

  // Front Left
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // Front Right
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // Front Top
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,

  // Front Bottomm
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
];

var WallIndices = [
   0, 1, 2, 0, 2, 3,        // top
   4, 5, 6, 4, 6, 7,        // bottom
   8, 9, 10, 8, 10, 11,     // right
   12, 13, 14, 12, 14, 15,  // left
   16, 17, 18, 16, 18, 19,  // inner left
   20, 21, 22, 20, 22, 23,  // inner right
   24, 25, 26, 24, 26, 27,  // inner bottom
   28, 29, 30, 28, 30, 31,  // inner top
   32, 33, 34, 32, 34, 35,  // back left
   36, 37, 38, 36, 38, 39,
   40, 41, 42, 40, 42, 43,
   44, 45, 46, 44, 46, 47,
];

var RoadPositions = [
  -1, -1,  1,
  1, -1,  1,
  1, -1, -1,
  -1, -1, -1
];

var RoadNormals = [
  0, 1, 0,
  0, 1, 0,
  0, 1, 0,
  0, 1, 0
];

var RoadIndices = [
  0, 1, 2, 0, 2, 3
];

var LeftTunnelPositions = [
   // Left face
   -1, -1,  1,
   -1,  1,  1,
   -1,  1, -1,
   -1, -1, -1,
];

var LeftTunnelNormals = [
  1, 0, 0,
  1, 0, 0,
  1, 0, 0,
  1, 0, 0
];

var LeftTunnelIndices = [
  0, 1, 2, 0, 2, 3
];

var RightTunnelPositions = [
  // Right face
  1, -1,  1,
  1,  1,  1,
  1,  1, -1,
  1, -1, -1,
];

var RightTunnelNormals = [
 -1, 0, 0,
 -1, 0, 0,
 -1, 0, 0,
 -1, 0, 0
];

var RightTunnelIndices = [
 0, 1, 2, 0, 2, 3
];

