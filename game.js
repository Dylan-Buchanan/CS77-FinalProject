var BlackVertexSource = `
    uniform mat4 ModelViewProjection;
    
    attribute vec3 Position;

    varying vec3 p;
    
    void main() {
        vec4 position = vec4(Position.x, Position.y, Position.z, 1.0);
        gl_Position = ModelViewProjection * position;
        p = vec3(gl_Position);
    }
`;
var BlackFragmentSource = `
    precision highp float;

    varying vec3 p;

    uniform float Type;

    vec3 color;

    void main() {

        if (Type == 1.0) {
            float col;
            float col2;
            if (p.z <= 0.0) {
                col = 1.0;
            }
            else {
                float rev = 6. - abs(p.z);
                col = (rev * rev) / 4.0;
            }

            col2 = sqrt(4.0 - abs(p.x)) / 2.0;

            color = vec3(1.0 * col * col2, 0.0, 0.0);
        }
        else {
            color = vec3(0.0, 0.0, 0.0);
        }

        gl_FragColor = vec4(color, 1.0);

    }
`;

var speed = 0.2;
var tallest = 4.0;
var shortest = 0.41;
var skinniest = 0.41;
var widest = 6.0;


var Game = function(gl)
{
    this.pitch = 10.;
    this.yaw = 0;

    this.wall = new ShadedTriangleMesh(gl, CubePositions2, CubeNormals2, CubeIndices2, BlackVertexSource, BlackFragmentSource);
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    gl.enable(gl.DEPTH_TEST);
}

var dist = -5.;
var cubeModel;
var trans = 0;
var height = 0;

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
    // Check if the pressed key is the one you're interested in
    if (event.key === 'a' || event.key === 'A') {
      // Perform an action when the Enter key is pressed
        console.log("Pressed");
        keyA = true;
        trans -= speed;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'd' || event.key === 'D') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          trans += speed;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'w' || event.key === 'W') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          height += speed;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 's' || event.key === 'S') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          height = Math.max(height -= speed, -1.5);
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowUp') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          if (Math.abs(CubePositions[1] - CubePositions[10]) < tallest) {
            changeShape(CubePositions, topCube, speed, true);
          }
          upped = true;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowDown') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          if (Math.abs(CubePositions[1] - CubePositions[10]) > shortest) {
            changeShape(CubePositions, topCube, speed, false);
          }
          downed = true;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowRight') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          if (Math.abs(CubePositions[3] - CubePositions[0]) > skinniest) {
            changeShape(CubePositions, leftCube, speed, true);
            changeShape(CubePositions, rightCube, speed, false);
          }
          widened = true;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (event.key === 'ArrowLeft') {
        // Perform an action when the Enter key is pressed
          console.log("Pressed");
          if (Math.abs(CubePositions[3] - CubePositions[0]) < widest) {
            changeShape(CubePositions, leftCube, speed, false);
            changeShape(CubePositions, rightCube, speed, true);
          }
          widened = true;
          cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }

    
});

var previousTime = performance.now();

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.DEPTH_TEST);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(0, 1.5, 0)).inverse();
    var wallModel = Matrix.translate(0, 1., -5).multiply(Matrix.scale(3., 1.5, 1.));

    if (upped || downed || widened) {
        this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
        upped = false;
        downed = false;
        widened = false;
    }

    if (cubeModel) {
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
    }
    else {
        cubeModel = Matrix.translate(0, 0, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
    }
    // this.wall.render(gl, wallModel, view, projection);
}