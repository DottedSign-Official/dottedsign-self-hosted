export const initWebGL = (canvas) => {
  const gl = canvas.getContext("webgl", {
    preserveDrawingBuffer: true,
    premultipliedAlpha: false,
  });
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

  if (!gl) {
    throw "WebGL is not supported";
  }

  const positionBuffer = gl.createBuffer();
  const positions = [-1, 1, -1, -1, 1, 1, 1, -1];
  const draw2DPanel = (positionAttributeLocation) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const compileShader = (
    vertexShaderSource,
    fragmentShaderSource,
    attributesNames,
    uniformsNames,
  ) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "Vertex shader compilation error:",
        gl.getShaderInfoLog(vertexShader),
      );
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compilation error:",
        gl.getShaderInfoLog(fragmentShader),
      );
      return;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    const attributes = attributesNames.reduce(
      (prev, data) => ({
        ...prev,
        [data]: gl.getAttribLocation(program, data),
      }),
      {},
    );

    const uniforms = uniformsNames.reduce(
      (prev, data) => ({
        ...prev,
        [data]: gl.getUniformLocation(program, data),
      }),
      {},
    );

    const activate = () => gl.useProgram(program);

    return {
      activate,
      attributes,
      uniforms,
    };
  };

  const bindTexture = (image, textureLocation) => {
    const texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(textureLocation, 0);
  };

  return {
    gl,
    helpers: {
      draw2DPanel,
      compileShader,
      bindTexture,
    },
  };
};
