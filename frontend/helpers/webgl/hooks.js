import { useEffect, useState, useRef } from "react";

import { initWebGL } from "./core";
import shaders from "../../helpers/webgl/shaders";

export const useWebGLPanel = (image) => {
  const canvasRef = useRef(null);
  const [webGL, setWebGL] = useState(null);

  useEffect(() => {
    try {
      const canvas = canvasRef.current;
      const { gl, helpers } = initWebGL(canvas);
      const program = helpers.compileShader(
        shaders.vertexShader.source,
        shaders.fragmentShader.source,
        shaders.vertexShader.attributes,
        shaders.fragmentShader.uniforms,
      );

      program.activate();
      helpers.bindTexture(image, program.uniforms.u_texture);
      const { width, height } = image;
      canvas.width = width;
      canvas.height = height;
      gl.uniform2f(program.uniforms.u_resolution, width, height);
      gl.viewport(0, 0, width, height);
      setWebGL({ gl, helpers, program });
    } catch (e) {
      console.error(e);
    }
  }, [canvasRef, image]);

  const removeColors = ({ colors, threshold }) => {
    const normalizedColors = colors.map((color) =>
      color.map((value) => value / 255),
    );
    const flatColors = normalizedColors.flat();

    const { gl, helpers, program } = webGL;
    gl.uniform1i(program.uniforms.u_colorCount, normalizedColors.length);

    if (normalizedColors.length) {
      gl.uniform1f(program.uniforms.u_threshold, threshold / 255);
      gl.uniform3fv(program.uniforms.u_colors, flatColors);
    }

    helpers.draw2DPanel(program.attributes.position);
  };

  return { isSupported: !!webGL, removeColors, canvasRef };
};
