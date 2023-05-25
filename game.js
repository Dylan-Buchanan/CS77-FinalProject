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

    void main() {

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

        vec3 color = vec3(1.0 * col * col2, 0.0, 0.0);

        gl_FragColor = vec4(color, 1.0);

    }
`;

var Game = function(gl)
{
    this.pitch = 0;
    this.yaw = 0;

    this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions2, CubeNormals2, CubeIndices2, BlackVertexSource, BlackFragmentSource);
    // this.cubeMesh = new ShadedTriangleMesh(gl, CubePositions, CubeNormals, CubeIndices, BlackVertexSource, BlackFragmentSource);
    
    gl.enable(gl.DEPTH_TEST);
}

Game.prototype.render = function(gl, w, h)
{
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.DEPTH_TEST);
    
    var projection = Matrix.perspective(45, w/h, 0.1, 100);    
    var view = Matrix.rotate(-this.yaw, 0, 1, 0).multiply(Matrix.rotate(-this.pitch, 1, 0, 0)).multiply(Matrix.translate(0, 0, 0)).inverse();
    var cubeModel = Matrix.translate(0, 0, -5.0).multiply(Matrix.scale(3.0, 1.5, 1.0));
    // var cubeModel2 = Matrix.translate(0, 0, 0).multiply(Matrix.scale(0.5, 0.5, 0.5));

    this.cubeMesh.render(gl, cubeModel, view, projection);
}