export const tintShader = `#version 300 es
precision mediump float;

uniform sampler2D u_graphic;
uniform vec3 U_color;

in vec2 v_uv;
out vec4 fragColor;


void main() {
  // Overlay original texture
  vec4 originalColor = texture(u_graphic, v_uv);
  fragColor = originalColor;
  if (originalColor.a > 0.) {
    fragColor = mix(originalColor, vec4(U_color, 1.), .5);
  }
  fragColor.rgb = fragColor.rgb * fragColor.a;
}
`;
