var BlackVertexSource = `
    uniform mat4 ModelViewProjection;
    
    attribute vec3 Position;

    uniform float Type;

    uniform float wallDist;

    varying vec3 Color;
    
    void main() {
        vec4 position = vec4(Position.x, Position.y, Position.z, 1.0);
        gl_Position = ModelViewProjection * position;
        vec3 p = vec3(gl_Position);
        
        if (Type == 1.0) {  
            float col;
            float col2;
            if (p.z <= 0.0) {
                col = 1.0;
            }
            else {
                float rev = (wallDist + 1.) - abs(p.z);
                col = (rev * rev) / 4.0;
            }

            Color = vec3(1.0 * col, 0.0, 0.0);
        }
       
        else if (Type == 2.0) {
            Color = vec3(1.0, 1.0, 0.0);
        }

        else if (Type == 3.0) {
            Color = vec3(0.0, 0.0, 1.0);
        }

        else {
            Color = vec3(0.0, 0.0, 0.0);
        }
    }
`;
var BlackFragmentSource = `
    precision highp float;

    varying vec3 Color;

    uniform float Type;

    void main() {
        float prevC = gl_FragColor.x + gl_FragColor.y + gl_FragColor.z;
        float newC = Color.x + Color.y + Color.z;

        if (Type != 0.0) {
            if (newC > prevC) {
                gl_FragColor = vec4(Color, 1.0);
            }
        }
        else {
            gl_FragColor = vec4(Color, 1.0);
        }
    }
`;
//////////  Global variables  //////////
// Cube
var speed = 0.05; // Cube movement and growth speed
var tallest = 2.0; // tallest cube height
var shortest = 0.5; // shortest cube height
var skinniest = 0.5; // skinniest cube height
var widest = 3.0; // widest cube height
var cubeScale = 0.5; // Cube length from middle
var dist = -4.5; // Distance from middle of cube to camera
var cubeModel; // Varying cube model variable
var trans = 0; // Cube X-change
var height = cubeScale; // Cube Y-change (Set to cube scale to move it out of the floor)

// Movement variables
var collision = false;
var upped = false;
var downed = false;
var widened = false;
var space = false;
var ableToLoadJump = true;
var jumping = false;
// variables for space bar press
let spaceHasBeenPressed = false;
let spacePressed = false;
let spacePressStartTime = null;
let spacePressDuration = 0;
let spacePressEndTime = 0;
var velocity = 0; // How the y-value of the cube is changing
var gravity = .00008; // How fast the cube falls
var maxHeight = 2.;
const keyStates = {
    w: false,
    a: false,
    s: false,
    d: false,
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    Enter: false,
}

// Wall
var maxWallWidth = 3.0;
var maxWallHeight = 1.5;
var wallDistance = -15.; // Distance from camera
var wallSpeed = 0.02;
var wallsPassed = 0; // Number of walls player has made it through

// Game variables
var level = 1;
var score = 0;

// Camera variables
var cameraX = 0.;
var cameraY = 1.;
var pan = 10.;
/////////////////////////////////////////////////



var Game = function(gl)
{
    this.pitch = 10.;
    this.yaw = 0;

    if (!collision && wallSpeed != 0.0) {
        randomWall(WallPositions, skinniest, shortest);
    }
    this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    this.road = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    this.tunnel1 = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    this.tunnel2 = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    gl.enable(gl.DEPTH_TEST);
}


document.addEventListener('keyup', (event) => {
    // Track the end time of space bar press and calculate duration
    if (event.which == 32) {
        if (spacePressed) {
            if (ableToLoadJump) {
                spaceHasBeenPressed = true;
            }
            else {
                spaceHasBeenPressed = false;
            }
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
        if (! jumping) {
            ableToLoadJump = true;
        }
        else {
            ableToLoadJump = false;
        }
    }

    else {
        const key = event.key;
    
        if (key in keyStates) {
            keyStates[key] = true;
        }
    }
});

// Function to check key states and perform actions
function checkKeyStates() {
    const { a, s, d, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } = keyStates;

    // // Check the state of all keys
    if (!collision) {
        if (a) {
        // Perform action when A is pressed
            if (checkCanMove(trans, 3., cubeScale, speed, 0)) {
                trans -= speed;
                cameraX -= speed;
                cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
            }
        }
        
        if (d) {
        // Perform action when D is pressed
            if (checkCanMove(trans, 3., cubeScale, speed, 1)) {
                trans += speed;
                cameraX += speed;
                cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));
            }
        }
        if (ArrowUp) {
            // Perform action when up is pressed
            if (Math.abs((CubePositions[10] - CubePositions[1]) * cubeScale) < tallest) {
                changeShape(CubePositions, topCube, speed, true);
            }
            upped = true;
            cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
        }
        
        if (ArrowDown) {
        // Perform action when down is pressed
            if ((Math.abs(CubePositions[10] - CubePositions[1]) * cubeScale) > shortest) {
                changeShape(CubePositions, topCube, speed, false);
            }
            downed = true;
            cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
        }
        
        if (ArrowLeft) {
        // Perform action when left is pressed
            if (checkCanMove(trans, 3., cubeScale, speed, 2)) {
                if (Math.abs((CubePositions[3] - CubePositions[0]) * cubeScale) < widest) {
                    changeShape(CubePositions, leftCube, speed, false);
                    changeShape(CubePositions, rightCube, speed, true);
                }
                widened = true;
                cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
            }
        }
        
        if (ArrowRight) {
        // Perform action when right is pressed
            if (Math.abs((CubePositions[3] - CubePositions[0]) * cubeScale) > shortest) {
                changeShape(CubePositions, leftCube, speed, true);
                changeShape(CubePositions, rightCube, speed, false);
            }
            widened = true;
            cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
        }
    }
}

function updateScore(cubePosition, wallPosition, wallSize) {
  const cubeVolume = cubeScale * 2.; // Assuming the cube has a volume of 1 in the z direction

  // Check if the cube collides with the wall
  if (collision) {
    return; // Perform Game Over Functions
  } 
  else {
    wallsPassed++;
    if (wallsPassed % 4 == 0) {
        level++;
        var scoreboardElement = document.getElementById('level');
        scoreboardElement.textContent = level;
    }
    score += cubeVolume; // Add cube's volume to the score
    var scoreboardElement = document.getElementById('score');
    scoreboardElement.textContent = score;
    return; // Return null to indicate no collision occurred
  }
}

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.DEPTH_TEST);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);
    var view;
    if (wallSpeed == 0.0) {
        var panDist = (dist) * Math.abs(pan / 3.5);
        if (pan <= 3.5 && pan > 3.25 && speed == 0.05) {
            pan = pan - (speed * 0.02);
        }
        else if (pan <= 3.25 && pan >= -3.25 && speed == 0.05) {
            pan = pan - (speed * 0.25);
        }
        else {
            speed = 0.0125;
            pan = pan + speed;
            if (pan >= 3.5) {
                pan = 3.5;
                speed = 0.05;
            }
        }
        xView = ((CubePositions[12] + CubePositions[21]) / 2.) + trans;
        yView = (CubePositions[13] + CubePositions[16]) / 2.;
        view = Matrix.lookAt(pan, 1.5, panDist, xView, yView, dist - 0.5, 0, 1, 0);  
    }  
    else {
        view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(cameraX, cameraY, 0.)).inverse();
    }
    var wallModel = Matrix.translate(0, 1.5, wallDistance).multiply(Matrix.scale(3., 1.5, 1.));
    var roadModel = Matrix.translate(0, -1.0, 0.).multiply(Matrix.scale(3., 1., 20.));
    var leftTunnel = Matrix.translate(-4., 1.5, 0.).multiply(Matrix.scale(1., 1.5, 20.));
    var rightTunnel = Matrix.translate(4., 1.5, 0.).multiply(Matrix.scale(1., 1.5, 20.));

    if (wallSpeed != 0.0) {
        wallDistance += wallSpeed;
        if (wallDistance > -6.0 && wallDistance < -3.0) {
            if (checkCollision(trans, height, cubeScale)) {
                wallSpeed = 0.0;
                collision = true;
            }
        }
        else if (wallDistance > -2.0 && !collision) {
            randomWall(WallPositions, skinniest, shortest);
            this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
            wallDistance = -15.;
        }
    }

    // The total height that the cube will reach with velocity
    // var velocity = Math.min(160, spacePressDuration) / 2000;
    
    
    // becomes true when space bar is released
    if (wallSpeed != 0.0) {
        if (spaceHasBeenPressed && ! jumping) {
            velocity = Math.min(160, spacePressDuration) / 2000;
            spaceHasBeenPressed = false;
            jumping = true;
        }
        
        if (jumping) {
            var currentTime = new Date().getTime();
            var elapsedTime = (currentTime - spacePressEndTime) / 10;
            velocity = velocity - gravity * elapsedTime;
            height += velocity;
            height = Math.max(0., height);
            height = Math.min(maxHeight, height);
            if (0 > velocity  && ! gravityHalved) {
                gravity *= .1;
                gravityHalved = true;
            }






            if (wallDistance > -6. && wallDistance < -3. && (CubePositions[14] * cubeScale) + height > (WallPositions[73] * 1.5) + 1.) {

                if (-5.98 < wallDistance && wallDistance < -5.90) {
                    updateScore();
                    // Update the current score if no collision but shape passes through
                    console.log("Score:", score);
                }
            }
            else {
                velocity = velocity - gravity * elapsedTime;
                height += velocity;
                height = Math.max(minHeight, height);
                height = Math.min(maxHeight, height);
            }
            if (height >= maxHeight) {
                velocity = 0;
            }
            // Change camera perspective on jump
            cameraY = Math.max(1.5, height + 1.5);
            if (height == 0.) {
                jumping = false;
            }
        }
    }
    cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(0.5, 0.5, 0.5));

    if (wallSpeed != 0.0) {
        wallDistance += wallSpeed;
        if (wallDistance > -6.0 && wallDistance < -3.0) {
            console.log(trans, height, cubeScale);
            if (checkCollision(trans, height, cubeScale)) {
                wallSpeed = 0.0;
                collision = true;
            }
        }
        else if (wallDistance > -2.0 && !collision) {
            randomWall(WallPositions, skinniest, shortest);
            this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
            wallDistance = -15.;
        }
    }

    // check for the key states constantly for smooth movement
    checkKeyStates();


    if (upped || downed || widened) {
        this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
        upped = false;
        downed = false;
        widened = false;
    }

    this.tunnel1.render(gl, leftTunnel, view, projection, 3.0);
    this.tunnel2.render(gl, rightTunnel, view, projection, 3.0);
    this.road.render(gl, roadModel, view, projection, 2.0);
    this.wall.render(gl, wallModel, view, projection, 1.0);
    if (cubeModel) {
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
    }
    else {
        cubeModel = Matrix.translate(0, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
        this.cubeMesh.render(gl, cubeModel, view, projection, 0.0);
    }
}