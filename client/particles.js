
let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
// details

let aspectRatio;
let currentRotation = [0, 1];
let currentScale = [0.1, 0.1];

// Vertex information

let vertexArray;
let vertexBuffer;
let vertexNumComponents;
let vertexCount;

// Rendering data shared with the
// scalers.

let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;

// Animation timing

let previousTime = 0.0;
let degreesPerSecond = 20.0;

window.addEventListener("load", startup, false);

function startup() {
  glCanvas = document.getElementById("wonder");
  gl = glCanvas.getContext("webgl");

  const shaderSet = [
    {
      type: gl.VERTEX_SHADER,
      id: "vertex-shader"
    },
    {
      type: gl.FRAGMENT_SHADER,
      id: "fragment-shader"
    }
  ];

  shaderProgram = buildShaderProgram(shaderSet);

  aspectRatio = glCanvas.width/glCanvas.height;
  currentRotation = [0, 1];
  //currentScale = [0.5, aspectRatio];
  currentScale = [0.1, 0.1];

  vertexArray = new Float32Array([
      -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5, -0.5, -0.5, -0.5
  ]);

  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  vertexNumComponents = 2;
  vertexCount = vertexArray.length/vertexNumComponents;

  currentAngle = 100.0;

  //gl_FragColor = vec4(0.0, 0.0, 1.0, alpha);


  animateScene();
}

function buildShaderProgram(shaderInfo) {
  let program = gl.createProgram();

  shaderInfo.forEach(function(desc) {
    let shader = compileShader(desc.id, desc.type);

    if (shader) {
      gl.attachShader(program, shader);
    }
  });

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking shader program:");
    console.log(gl.getProgramInfoLog(program));
  }

  return program;
}

function compileShader(id, type) {
  let code = document.getElementById(id).firstChild.nodeValue;
  let shader = gl.createShader(type);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function animateScene() {
  gl.viewport(1, 1, glCanvas.width, glCanvas.height);
  gl.clearColor(32.0, 32.0, 94.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let radians = currentAngle * Math.PI / 180.0;
  currentRotation[0] = Math.sin(radians);
  currentRotation[1] = Math.cos(radians);

  gl.useProgram(shaderProgram);

  uScalingFactor =
      gl.getUniformLocation(shaderProgram, "uScalingFactor");
  uGlobalColor =
      gl.getUniformLocation(shaderProgram, "uGlobalColor");
  uRotationVector =
      gl.getUniformLocation(shaderProgram, "uRotationVector");

  gl.uniform2fv(uScalingFactor, currentScale);
  gl.uniform2fv(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  aVertexPosition =
      gl.getAttribLocation(shaderProgram, "aVertexPosition");


  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

  window.requestAnimationFrame(function(currentTime) {
    let deltaAngle = ((currentTime - previousTime) / 1000.0)
          * degreesPerSecond;

    currentAngle = (currentAngle + deltaAngle) % 360;

    previousTime = currentTime;
    animateScene();
  });
}

