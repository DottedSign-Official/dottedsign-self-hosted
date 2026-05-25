const attributes = ["a_position"];

const source = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const shader = {
  attributes,
  source,
};

export default shader;
