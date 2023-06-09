

var ShadedTriangleMesh = function(gl, vertexPositions, vertexNormals, indices, vertexSource, fragmentSource) {
    this.indexCount = indices.length;
    this.positionVbo = createVertexBuffer(gl, vertexPositions);
    this.normalVbo = createVertexBuffer(gl, vertexNormals);
    this.indexIbo = createIndexBuffer(gl, indices);
    this.shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);
    // this.lightPosition = lightPosition;
}

ShadedTriangleMesh.prototype.render = function(gl, model, view, projection, type) {
    
    gl.useProgram(this.shaderProgram);
    
    gl.useProgram(this.shaderProgram);
    
    var modelViewProjection = projection.multiply(view).multiply(model);

    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "ModelViewProjection"), false, modelViewProjection.transpose().m); 
    
    var ModelView = view.multiply(model);
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "ModelView"), false, ModelView.transpose().m); 

    var NormalMatrix = ModelView.inverse().transpose();
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "NormalMatrix"), false, NormalMatrix.transpose().m); 

    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "Model"), false, model.transpose().m);

    gl.uniformMatrix4fv(gl.getUniformLocation(this.shaderProgram, "View"), false, view.transpose().m);


    // 0 = cube, 1 = wall, 2 = road
    gl.uniform1f(gl.getUniformLocation(this.shaderProgram, "Type"), type);
    
    // OpenGL setup beyond this point
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexIbo);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionVbo);
    var positionAttrib = gl.getAttribLocation(this.shaderProgram, "Position");
    if (positionAttrib >= 0) {
        gl.enableVertexAttribArray(positionAttrib);
        gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalVbo);
    var normalAttrib = gl.getAttribLocation(this.shaderProgram, "Normal");
    if (normalAttrib >= 0) {
        gl.enableVertexAttribArray(normalAttrib);
        gl.vertexAttribPointer(normalAttrib, 3, gl.FLOAT, false, 0, 0);
    }
    
    gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
}