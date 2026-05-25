import { GL_UNIFORMS_ARRAY_SIZE_MAX } from "../../constant";

const uniforms = [
  "u_texture",
  "u_resolution",
  "u_threshold",
  "u_colorCount",
  "u_colors",
];

const source = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;

uniform float u_threshold;
uniform int u_colorCount;
uniform vec3 u_colors[${GL_UNIFORMS_ARRAY_SIZE_MAX}];

vec3 rgbToYuv(vec3 color) {
    vec3 yuv;
    yuv.x = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
    yuv.y = -0.14713 * color.r - 0.28886 * color.g + 0.436 * color.b;
    yuv.z = 0.615 * color.r - 0.51499 * color.g - 0.10001 * color.b;
    return yuv;
}

float calculateDistance(vec3 color1, vec3 color2) {
    vec3 yuv1 = rgbToYuv(color1);
    vec3 yuv2 = rgbToYuv(color2);
    return distance(yuv1, yuv2);
}

void main() {
    vec2 texCoord = gl_FragCoord.xy / u_resolution;
    vec4 texColor = texture2D(u_texture, texCoord);

    for (int i = 0; i < ${GL_UNIFORMS_ARRAY_SIZE_MAX}; i++) {

    if (i >= u_colorCount) {
        break;
    }

    vec3 color = u_colors[i];

    float distance = calculateDistance(texColor.rgb, color);

    if (distance < u_threshold) {
        texColor.a = 0.0;
        break;
    }
    }

    gl_FragColor = texColor;
}
`;

const shader = {
  uniforms,
  source,
};

export default shader;
