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

var Game = function(gl)
{
    this.pitch = 0;
    this.yaw = 0;
    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    
    gl.enable(gl.DEPTH_TEST);
}

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(0, 0, 5)).inverse();
    var rotation = Matrix.rotate(Date.now()/25, 0, 1, 0);
    var cubeModel = Matrix.translate(-1.8, 0, 0).multiply(rotation);
    var sphereModel = Matrix.translate(1.8, 0, 0).multiply(rotation).multiply(Matrix.scale(1.2, 1.2, 1.2));

    this.cubeMesh.render(gl, cubeModel, view, projection);
}