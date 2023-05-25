var BlackVertexSource = `
    uniform mat4 ModelViewProjection;
    
    attribute vec3 Position;
    
    // TODO: Implement a simple GLSL vertex shader that applies the ModelViewProjection
    //       matrix to the vertex Position.
    //       Note that Position is a 3 element vector; you need to extend it by one element (1.0)
    //       You can extend a vector 'V' by doing vec4(V, 1.0)
    //       Store the result of the multiplication in gl_Position
    void main() {

// ################ Edit your code below
        vec4 position = vec4(Position.x, Position.y, Position.z, 1.0);
        gl_Position = ModelViewProjection * position;
        
// ################

    }
`;
var BlackFragmentSource = `
    precision highp float;
    
    // TODO: Implement a simple GLSL fragment shader that assigns a black color to gl_FragColor
    //       Colors are vectors with 4 components (red, green, blue, alpha).
    //       Components are in 0-1 range.
    void main() {

// ################ Edit your code below
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
// ################

    }
`;

var speed = 0.02;
var skinniest = 0.4;

function moveRight()
{
    CubePositions[3] += speed;
    CubePositions[6] += speed;
    CubePositions[18] += speed;
    CubePositions[21] += speed;
    CubePositions[30] += speed;
    CubePositions[33] += speed;
    CubePositions[39] += speed;
    CubePositions[42] += speed;
    CubePositions[48] += speed;
    CubePositions[51] += speed;
    CubePositions[54] += speed;
    CubePositions[57] += speed;
}

function moveUp()
{
    if (CubePositions[7] < 4) {
        CubePositions[7] += speed;
        CubePositions[10] += speed;
        CubePositions[16] += speed;
        CubePositions[19] += speed;
        CubePositions[25] += speed;
        CubePositions[28] += speed;
        CubePositions[31] += speed;
        CubePositions[34] += speed;
        CubePositions[52] += speed;
        CubePositions[55] += speed;
        CubePositions[67] += speed;
        CubePositions[70] += speed;
    }
}

function moveDown()
{
    if (CubePositions[7] > skinniest) {
        CubePositions[7] -= speed;
        CubePositions[10] -= speed;
        CubePositions[16] -= speed;
        CubePositions[19] -= speed;
        CubePositions[25] -= speed;
        CubePositions[28] -= speed;
        CubePositions[31] -= speed;
        CubePositions[34] -= speed;
        CubePositions[52] -= speed;
        CubePositions[55] -= speed;
        CubePositions[67] -= speed;
        CubePositions[70] -= speed;
    }
}

function moveLeft()
{
    console.log("here");
    CubePositions[0] -= speed;
    CubePositions[9] -= speed;
    CubePositions[12] -= speed;
    CubePositions[15] -= speed;
    CubePositions[24] -= speed;
    CubePositions[27] -= speed;
    CubePositions[36] -= speed;
    CubePositions[45] -= speed;
    CubePositions[60] -= speed;
    CubePositions[63] -= speed;
    CubePositions[66] -= speed;
    CubePositions[69] -= speed;
}

function moveSkinny() 
{
    if (CubePositions[3] - CubePositions[0] > skinniest) {
        CubePositions[0] += speed;
        CubePositions[9] += speed;
        CubePositions[12] += speed;
        CubePositions[15] += speed;
        CubePositions[24] += speed;
        CubePositions[27] += speed;
        CubePositions[36] += speed;
        CubePositions[45] += speed;
        CubePositions[60] += speed;
        CubePositions[63] += speed;
        CubePositions[66] += speed;
        CubePositions[69] += speed;
    }
}


var Game = function(gl)
{
    this.pitch = 20;
    this.yaw = 0;
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    gl.enable(gl.DEPTH_TEST);
}

var cubeModel;
var trans = 0;
var height = -1.5;

var upped = false;
var downed = false;
var widened = false;

const keyStates = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
}

document.addEventListener('keyup', (event) => {
    const key = event.key;
  
    if (key in keyStates) {
        keyStates[key] = false;
        // checkKeyStates();
    }
});


document.addEventListener('keydown', (event) => {

    const key = event.key;
    console.log(key);
  
    if (key in keyStates) {
        keyStates[key] = true;
        // checkKeyStates();
    }
});

// Function to check key states and perform actions
function checkKeyStates() {
    const { w, a, s, d, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } = keyStates;
    
    // Check the state of all keys
    if (w) {
      // Perform action when W is pressed
        height += speed;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (a) {
      // Perform action when A is pressed
        trans -= speed;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (s) {
      // Perform action when S is pressed
        height = Math.max(height -= speed, -1.5);
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (d) {
      // Perform action when D is pressed
        trans += speed;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (ArrowUp) {
        // Perform action when up is pressed
        console.log("Here");
        moveUp();
        upped = true;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowDown) {
    // Perform action when down is pressed
        moveDown();
        downed = true;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowLeft) {
        console.log("Here 3");
    // Perform action when left is pressed
        moveLeft();
        widened = true;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowRight) {
    // Perform action when right is pressed
        moveSkinny();
        widened = true;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }

  }

var previousTime = performance.now();

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(0, 0, 5)).inverse();
    var rotation = Matrix.rotate(Date.now()/25, 0, 1, 0);

    // check for the key states constantly for smooth movement
    checkKeyStates();

    if (upped || downed || widened) {
        this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
        upped = false;
        downed = false;
        widened = false;
    }

    if (cubeModel) {
        this.cubeMesh.render(gl, cubeModel, view, projection);
    }
    else {
        cubeModel = Matrix.translate(0, -1.5, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
        this.cubeMesh.render(gl, cubeModel, view, projection);
    }
}