var BlackVertexSource = `
    uniform mat4 ModelViewProjection;
    attribute vec3 Position;
    attribute vec3 Normal;

    varying vec3 Color;
    varying float DistanceToLight;

    uniform mat4 ModelView;
    uniform mat4 NormalMatrix;
    uniform mat4 View;
    uniform mat4 Model;

    uniform float Type;

    const vec3 LightPosition = vec3(0.0, 1.0, -2.0);
    const vec3 LightIntensity = vec3(20.0);

    void main() {

        
        if (Type == 1.0) { 
            Color = vec3(1.0, 0.6, 0.0);
        }
        else if (Type == 2.0) {
            Color = vec3(.6, 0.0, 1.0);
        }
        else if (Type == 3.0) {
            Color = vec3(.7, 0.0, 1.0);
        }
        else {
            Color = vec3(.7, 0., .7);
        }
        vec3 ka = Color;
        vec3 kd = 0.7 * Color;

        vec4 position = vec4(Position.x, Position.y, Position.z, 1.0);

        gl_Position = ModelViewProjection * position;

        mat3 normalMatrix = mat3(NormalMatrix);

        vec3 newPosition = vec3(ModelView * position);

        vec3 normal = normalize(normalMatrix * Normal);
        
        vec3 LightDirection = normalize(vec3(View * vec4(LightPosition, 1.0)) - newPosition);

        float DiffuseFactor = max(dot(normal, LightDirection), -1.0);

        float Distance = 0.;

        if (Type == 3.0) {
            Distance = length(LightPosition - vec3(Model * vec4(Position, 1.0))) / Position.z;
            if (Distance > 20.86) {
                Color = vec3(0., 0., 0.);
                ka = Color;
                kd = 0.7 * Color;
            }
        }

        else if (Type == 2.0) {
            Distance = length(LightPosition - vec3(Model * vec4(Position, 1.0))) / Position.z;
            if (Distance < -15.) {
                Color = vec3(0.1, 0.1, 0.);
                ka = Color;
                kd = 0.7 * Color;
            }
        }

        else {
            Distance = length(LightPosition - vec3(Model * vec4(Position, 1.0)));
        }

        vec3 SurfaceColor = LightIntensity / (Distance * Distance);

        vec3 DiffuseColor = ka + SurfaceColor * DiffuseFactor;

        Color = kd * max(DiffuseColor, 0.1);

        if (gl_Position.z < -1.) {
            Color = vec3(0., 0., 0.);
        }
    }
`;

var BlackFragmentSource = `
    precision highp float;

    varying vec3 Color;
    
    void main() {
        gl_FragColor = vec4(Color, 1.0);
    }
`;


//////////  Global variables  //////////
var DylEllMode = 0; // 0 = Dylan 1 = Ellis
// Cube
var speed = 0.05; // Cube movement and growth speed
const tallest = 2.0; // tallest cube height
const shortest = 0.5; // shortest cube height
const skinniest = 0.5; // skinniest cube height
const widest = 3.0; // widest cube height
const cubeScale = 0.5; // Cube length from middle
const dist = -4.5; // Distance from middle of cube to camera
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
var spaceLength;
var ellisTime;
var velocity = 0; // How the y-value of the cube is changing
var gravity = .00008; // How fast the cube falls
const lowerGravVal = 0.01;
var lowerGrav = false;
const maxHeight = 3.;
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
const maxWallWidth = 3.0;
const maxWallHeight = 1.5;
var startingWallDistance = -15.;
var wallDistance = startingWallDistance; // Distance from camera
var wallSpeed = 0.1;
var wallsPassed = 0; // Number of walls player has made it through

// Game variables
var level = 1;
const wallsPerLevel = 4;
var score = 0;
var scored = false;
var reset = false;
var playing = false;

// Camera variables
var cameraX = 0.;
var cameraY = 1.;
var pan = maxWallWidth;
/////////////////////////////////////////////////

var Game = function(gl)
{
    this.pitch = 10.;
    this.yaw = 0;

    if (!collision) {
        randomWall(WallPositions, skinniest, shortest);
    }
    this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    this.road = new ShadedTriangleMesh(gl, RoadPositions, RoadNormals, RoadIndices, BlackVertexSource, BlackFragmentSource);
    this.tunnel1 = new ShadedTriangleMesh(gl, LeftTunnelPositions, LeftTunnelNormals, LeftTunnelIndices, BlackVertexSource, BlackFragmentSource);
    this.tunnel2 = new ShadedTriangleMesh(gl, RightTunnelPositions, RightTunnelNormals, RightTunnelIndices, BlackVertexSource, BlackFragmentSource);
    gl.enable(gl.DEPTH_TEST);
}

function restartGame() {
    if (!playing) {
        var scoreboardDiv = document.createElement('div');
        scoreboardDiv.className = 'scoreboard';
        scoreboardDiv.innerHTML = `
            <p class="info">Score:</p>
            <p class="info" id="score" style="color: yellow; left: 20%">0</p>
            <p class="info" style="left: 42%;">Level:</p>
            <p class="info" id="level" style="color: rgb(0, 255, 0); left: 57%">1</p>
        `;
        
        document.body.appendChild(scoreboardDiv);
    }

    if (playing) {
        var audio = document.getElementById("gameSong");
        audio.currentTime = 0;
        audio.play();
    }

    resetCube();
    randomWall(WallPositions, skinniest, shortest);
    trans = 0; // Cube X-change
    height = cubeScale; // Cube Y-change (Set to cube scale to move it out of the floor)
    speed = 0.05;

    // Computer Based Variables (processing speed)
    if (DylEllMode == 0) {
        gravity = .000008; // How fast the cube falls
        wallSpeed = .01;
        spaceLength = 2;
        ellisTime = 4000;
    }
    else {
        gravity = .00008;
        wallSpeed = .05;
        wallSpeed = .05;
        spaceLength = 1;
        ellisTime = 2000;
    }

    // Movement variables
    collision = false;
    upped = true;
    downed = true;
    widened = true;
    space = false;
    ableToLoadJump = true;
    jumping = false;
    // variables for space bar press
    spaceHasBeenPressed = false;
    spacePressed = false;
    spacePressStartTime = null;
    spacePressDuration = 0;
    spacePressEndTime = 0;
    velocity = 0; // How the y-value of the cube is changing
    lowerGrav = false;
    for (key in keyStates) {
        keyStates[key] = false;
    }

    // Wall
    startingWallDistance = -15.;
    wallDistance = startingWallDistance; // Distance from camera
    wallsPassed = 0; // Number of walls player has made it through

    // Game variables
    level = 1;
    score = 0;
    scored = false;
    var scoreboardElement = document.getElementById('level');
    scoreboardElement.textContent = level;
    var scoreboardElement1 = document.getElementById('score');
    scoreboardElement1.textContent = score;
    reset = true;
    playing = true;

    // Camera variables
    cameraX = 0.;
    cameraY = 1.;
    pan = 10.;
}


document.addEventListener('keyup', (event) => {
    // Track the end time of space bar press and calculate duration
    if (event.which == 32) {
        if (spacePressed) {
            if (ableToLoadJump) {
                spaceHasBeenPressed = true;
                const end = Date.now()
                spacePressEndTime = end;
                spacePressDuration = spacePressEndTime - spacePressStartTime;
            }
            else {
                spaceHasBeenPressed = false;
            }
            spacePressed = false;
            space = false;
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
    const { a, d, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter } = keyStates;

    // // Check the state of all keys
    if (!collision && playing) {
        if (a) {
        // Perform action when A is pressed
            if (checkCanMove(trans, maxWallWidth, cubeScale, speed, 0)) {
                trans -= speed;
                cameraX -= speed;
                cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
            }
        }
        
        if (d) {
        // Perform action when D is pressed
            if (checkCanMove(trans, maxWallWidth, cubeScale, speed, 1)) {
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
    if (Enter) {
        restartGame();
    }
}

function updateScore() {
    // Check if the cube collides with the wall
    if (collision) {
        // Perform Game Over Functions
        var audio = document.getElementById("gameSong");
        var splat = document.getElementById("splat");
        audio.pause();
        audio.currentTime = 0;
        splat.currentTime = 0;
        splat.play();

        var enter = document.createElement('div');
        enter.className = 'controls';
        enter.style = 'top: 10%; left: calc(50vw - 150px); width: 300px;';
        enter.innerHTML = '<p class="info" style="color: black; left: 8%; top: -42%;font-size: 30px;">Press Enter to Start</p>';
        document.body.appendChild(enter);
    } 
    else {
        wallsPassed++;
        // Change the level and wall speed based on the number of walls passed
        if (wallsPassed % wallsPerLevel == 0) {
            level++;
            wallSpeed *= 2.0;
            startingWallDistance -= level * 5.;
            var scoreboardElement = document.getElementById('level');
            scoreboardElement.textContent = level;

            var lvl = document.getElementById("nextlevel");
            lvl.currentTime = 0;
            lvl.play();
        }
        var cubeVolume = ((CubePositions[21] - CubePositions[12]) ) * ((CubePositions[16] - CubePositions[13]) ) * cubeScale;
        var holeVolume = ((WallPositions[63] - WallPositions[51]) ) * ((WallPositions[52] - WallPositions[49]) ) * maxWallHeight * maxWallWidth;
        var scoreInc = Math.min(100, Math.ceil((cubeVolume / holeVolume) * 100));
        score += scoreInc;
        if (scoreInc > 80.) {
            var tight = document.getElementById("tight");
            tight.currentTime = 0;
            tight.play();
        }

        // Update the score
        var scoreboardElement = document.getElementById('score');
        scoreboardElement.textContent = score;
        scored = true;

        var pass = document.getElementById("ding");
        pass.currentTime = 0;
        pass.play();
    }
}

var camHolder = 2. * cubeScale;
var why = 0;

Game.prototype.render = function(gl, w, h)
{
    // gl initialization
    gl.clearColor(.2, 0., .3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Model space intialization
    var projection = Matrix.perspective(45, w/h, 0.1, 100);
    var view;

    // Models 
    var wallModel = Matrix.translate(0, maxWallHeight, wallDistance).multiply(Matrix.scale(maxWallWidth, maxWallHeight, 1.));
    // var roadModel = Matrix.translate(0., 1., 0.).multiply(Matrix.scale(maxWallWidth, 1., 20.));
    var roadModel = new Matrix();
    var leftTunnel = Matrix.translate(-maxWallWidth + 1, 2 * maxWallHeight, 0.).multiply(Matrix.scale(1., 2 * maxWallHeight, 20.));
    // var leftTunnel = new Matrix();
    var rightTunnel = Matrix.translate(maxWallWidth - 1, 2 * maxWallHeight, 0.).multiply(Matrix.scale(1., 2 * maxWallHeight, 20.));


    if (playing) {
        // Cutscene
        if (collision) {
            var panDist = (dist) * Math.abs(pan / 3.5);
            if (pan <= maxWallWidth && pan > (maxWallWidth * 0.9) && speed == 0.05) {
                pan = pan - (speed * 0.02);
            }
            else if (pan <= (maxWallWidth * 0.9)  && pan >= (-maxWallWidth * 0.9) && speed == 0.05) {
                pan = pan - (speed * 0.25);
            }
            else {
                if (speed == 0.05) {
                    speed = speed / 4.0;
                }
                pan = pan + speed;
                if (pan >= maxWallWidth) {
                    pan = maxWallWidth;
                    speed = 0.05;
                }
            }
            xView = ((CubePositions[12] + CubePositions[21]) / 2.) + trans;
            yView = (CubePositions[13] + CubePositions[16]) / 2. + height;
            view = Matrix.lookAt(pan, 1.5, panDist, xView, yView, dist - 0.5, 0, 1, 0);  
        }  
        else {
            view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(cameraX, cameraY, 0.)).inverse();
        }

        // Move wall and check for collision
        if (!collision) {
            wallDistance += wallSpeed;
            if (wallDistance > (dist - 1.5) && wallDistance < (dist + 1.5)) {
                if (checkCollision(trans, height, cubeScale, maxWallWidth, maxWallHeight)) {
                    wallSpeed = 0.0;
                    collision = true;
                    updateScore();
                }
            }
        }

        // When the wall is behind the player generate a new wall
        if (wallDistance > (dist + 1.) && !collision) {
            randomWall(WallPositions, skinniest, shortest);
            this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
            wallDistance = startingWallDistance;
            scored = false;
        }

        // Handle jumping
        if (!collision) {
            if (spaceHasBeenPressed && !jumping) {
                // Initial velocity based on length of space press
                velocity = Math.min(160, spacePressDuration / spaceLength) / ellisTime;
                spaceHasBeenPressed = false;
                jumping = true;
            }
            
            // While in air
            if (jumping) {
                // How long have you been in the air
                var currentTime = new Date().getTime();
                var elapsedTime = (currentTime - spacePressEndTime) / 10;
                // If player reaches the peak of the jump lower gravity so player can guide the cube into the hole
                if (0 > velocity  && ! lowerGrav) {
                    gravity *= lowerGravVal;
                    lowerGrav = true;
                }

                // If the player has entered the hole try to update the score
                if (wallDistance > (dist - 1.5) && wallDistance < (dist + 1.5) && (CubePositions[14] * cubeScale) + height > (WallPositions[73] * 1.5) + 1.) {
                    if ((CubePositions[14] * cubeScale) + height > (WallPositions[73] * 1.5) + 1.) {
                        if ((dist - 1.48) < wallDistance && !scored) {
                            // Update the current score if no collision but shape passes through
                            updateScore();
                        }
                        velocity = velocity - gravity * elapsedTime;
                        height += velocity;
                        // Can not go below cubeScale and above maxHeight

                        // Smoothly jump over wall
                        height = Math.max(height,  (WallPositions[73] * 1.5) + 2.);
                        camHolder = height;
                    }
                    
                }
                // Otherwise change velocity based on gravity (else statement prevents collision on bottom of hole)
                else {
                    velocity = velocity - gravity * elapsedTime;
                    height += velocity;
                    // Can not go below cubeScale and above maxHeight
                    height = Math.min(Math.max(cubeScale, height), maxHeight);
                }

                // If player hits the peak then stop moving upwards
                if (height >= maxHeight) {
                    velocity = 0;
                }
                // Change camera perspective on jump
                cameraY = Math.max(2. * cubeScale, height);

                // If you hit the ground
                if (height == cubeScale) {
                    // cameraY = Math.max(2. * cubeScale, height);
                    velocity = 0;
                    gravity *= (1 / lowerGravVal);
                    lowerGrav = false;
                    jumping = false;
                    ableToLoadJump = true;
                }
            }
            // Update cube
            cubeModel = Matrix.translate(trans, height, dist).multiply(Matrix.scale(cubeScale, cubeScale, cubeScale));
        }

        // Check for the key states constantly for smooth movement
        checkKeyStates();

        if (reset) {
            this.wall = new ShadedTriangleMesh(gl, WallPositions, WallNormals, WallIndices, BlackVertexSource, BlackFragmentSource);
            reset = false;
        }

        // When cube positions change update
        if (upped || downed || widened) {
            this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
            upped = false;
            downed = false;
            widened = false;
        }
    }
    else {
        // Check for the key states constantly for smooth movement
        checkKeyStates();

        // Camera based on time
        var time = new Date().getTime();
        time /= 3000.;
        var panDist = Math.cos(time) * (dist / 2);
        pan = Math.sin(time) * (maxWallWidth * 0.9);
        xView = ((CubePositions[12] + CubePositions[21]) / 2.) + trans;
        yView = (CubePositions[13] + CubePositions[16]) / 2. + height;
        view = Matrix.lookAt(pan, 1.5, panDist, xView, yView, dist - 0.5, 0, 1, 0);  
    }

    // Render shapes
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