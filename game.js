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

var speed = 0.2;
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

var keyA = false;

document.addEventListener('keyup', (event) => {
    if (event.key === 'a' || event.key === 'A') {
        keyA = false;
        console.log(keyA);
    }
});

document.addEventListener('keydown', (event) => {

      // w and a
    if (event.key === 'w' && keyA == true)  {
        // Perform an action when the Enter key is pressed
        console.log(keyA);
        console.log("Pressed");
        height += speed;
        trans -= speed;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    // w and d
    // w and left
    // w and right
    // w and up
    // w and down

    // a and s
    // a and up
    // a and down
    // a and left
    // a and right

    // d and s
    // d and up
    // d and down
    // d and left 
    // d and right

    // s and up
    // s and left
    // s and right
    // s and down

    // up and left
    // up and right
    
    // left and down

    // right and down

    // Check if the pressed key is the one you're interested in
    if (event.key === 'a' || event.key === 'A') {
      // Perform an action when the Enter key is pressed
        console.log("Pressed");
        keyA = true;
        trans -= speed;
        cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'd' || event.key === 'D') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          trans += speed;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'w' || event.key === 'W') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          height += speed;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 's' || event.key === 'S') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          height = Math.max(height -= speed, -1.5);
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowUp') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          moveUp();
          upped = true;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowDown') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          moveDown();
          downed = true;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowRight') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          moveSkinny();
          widened = true;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowLeft') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          moveLeft();
          widened = true;
          cubeModel = Matrix.translate(trans, height, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }

    
});

var previousTime = performance.now();

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(0, 0, 5)).inverse();
    var rotation = Matrix.rotate(Date.now()/25, 0, 1, 0);

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