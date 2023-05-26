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
       
        else if (Type == 2.0) {
            color = vec3(1.0, 0.0, 0.0);
        }

        else {
            color = vec3(0.0, 0.0, 0.0);
        }

        gl_FragColor = vec4(color, 1.0);

    }
`;

var speed = 0.05;
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
    this.road = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    gl.enable(gl.DEPTH_TEST);
}

var dist = -4.5;
var cubeModel;
var trans = 0;
var height = 0.;

var upped = false;
var downed = false;
var widened = false;
var space = false;

const keyStates = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
}

// variables for space bar press
let spaceHasBeenPressed = false;
let spacePressed = false;
let spacePressStartTime = null;
let spacePressDuration = 0;
let spacePressEndTime = 0;


document.addEventListener('keyup', (event) => {
    // Track the end time of space bar press and calculate duration
    if (event.which == 32) {
        if (spacePressed) {
            spaceHasBeenPressed = true;
            spacePressed = false;
            const end = Date.now()
            spacePressEndTime = end;
            spacePressDuration = spacePressEndTime - spacePressStartTime;
            space = false;
            console.log("Space bar press duration:", spacePressDuration, "ms");
        }
    }

    else {
        const key = event.key;
       
        if (key in keyStates) {
            keyStates[key] = false;
        }
    }
});


document.addEventListener('keydown', (event) => {

    // Track the start time of the space bar being pressed down
    if (event.which == 32) {
        if (!spacePressed) {
          spacePressed = true;
          const start = Date.now();
          spacePressStartTime = start;
        }
        // var space1 = "space";
        space = true;
    }

    else {
        const key = event.key;
    
        if (key in keyStates) {
            keyStates[key] = true;
        }
    }
});

var cameraX = 0.;

// Function to check key states and perform actions
function checkKeyStates() {
    const { w, a, s, d, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } = keyStates;
    

    if (space) {
        // console.log("space bar duration", spaceBarDuration);
    }

    // Check the state of all keys
    if (w) {
      // Perform action when W is pressed
        height += speed;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (a) {
      // Perform action when A is pressed
        trans -= speed;
        cameraX -= speed;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (s) {
      // Perform action when S is pressed
        height = Math.max(height -= speed, -1.5);
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    
    if (d) {
      // Perform action when D is pressed
        trans += speed;
        cameraX += speed;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
    if (ArrowUp) {
        // Perform action when up is pressed
        if (Math.abs(CubePositions[10] - CubePositions[1]) < tallest) {
            changeShape(CubePositions, topCube, speed, true);
        }
        upped = true;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowDown) {
    // Perform action when down is pressed
        if (Math.abs(CubePositions[10] - CubePositions[1]) > shortest) {
            changeShape(CubePositions, topCube, speed, false);
        }
        downed = true;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowLeft) {
    // Perform action when left is pressed
        if (Math.abs(CubePositions[3] - CubePositions[0]) < widest) {
            changeShape(CubePositions, leftCube, speed, false);
            changeShape(CubePositions, rightCube, speed, true);
        }
        widened = true;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }
      
    if (ArrowRight) {
    // Perform action when right is pressed
        if (Math.abs(CubePositions[3] - CubePositions[0]) > shortest) {
            changeShape(CubePositions, leftCube, speed, true);
            changeShape(CubePositions, rightCube, speed, false);
        }
        widened = true;
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
    }


}

let score = 0;

function updateScore(cubePosition, wallPosition, wallSize) {
  const cubeVolume = 1; // Assuming the cube has a volume of 1 in the z direction

  // Check if the cube collides with the wall
  if (
    cubePosition.x < wallPosition.x + wallSize.width &&
    cubePosition.x + cubeVolume > wallPosition.x &&
    cubePosition.y < wallPosition.y + wallSize.height &&
    cubePosition.y + cubeVolume > wallPosition.y
  ) {
    return score; // Return the score when collision occurs
  } 
  else {
    score += cubeVolume; // Add cube's volume to the score
    return null; // Return null to indicate no collision occurred
  }
}

var maxHeight = 2;
var minHeight = 0;
var velocity;
var gravity = .001;
var fall = false;

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.DEPTH_TEST);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(cameraX, 1.5, 0)).inverse();
    var wallModel = Matrix.translate(0, 1., -5).multiply(Matrix.scale(3., 1.5, 1.));
    var roadModel = Matrix.translate(0, 0, 0).multiply(Matrix.scale(1.5, 1, 20));

    // The total height that the cube will reach with velocity
    var velocity = Math.min(160, spacePressDuration) / 2000;
    var bouncing = false;
    var jumpInProgress = false;

    
    
    // becomes true when space bar is released
    if (spaceHasBeenPressed) {
    3
        var currentTime = new Date().getTime();
        var elapsedTime = (currentTime - spacePressEndTime) / 10;

        if (height >= maxHeight)
        {
            velocity = Math.abs(velocity);
            fall = true;
            bouncing = true;
        }
        else if (height <= minHeight && fall) {
            height = minHeight;
            velocity = 0;
            fall = false;
            bouncing = false;
            jumpInProgress = false;
            canJump = true;
        }
        else if (! fall); {
            velocity = velocity - gravity * elapsedTime;

        }

        height += velocity;
        height = Math.max(minHeight, height);
        height = Math.min(maxHeight, height);
        cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));

        jumpInProgress = true;
       
    }

    

    // check for the key states constantly for smooth movement
    checkKeyStates();


    if (upped || downed || widened) {
        this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
        upped = false;
        downed = false;
        widened = false;
    }

    if (cubeModel) {
        this.road.render(gl, roadModel, view, projection, 2.0);
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
    }
    else {
        cubeModel = Matrix.translate(0, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
        this.road.render(gl, roadModel, view, projection, 2.0);
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
        
    }
    // this.wall.render(gl, wallModel, view, projection);
}