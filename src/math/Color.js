import { clamp } from "./MathUtils.js";

export class Color {
  constructor(r = 0xffffff, g, b) {
    // Defaults must not fill g/b before the hex check. A default of 1 made
    // Color(0xe85d4c) store the raw hex in r and clamp the frame to pink.
    if (g === undefined && b === undefined) this.setHex(r);
    else this.setRGB(r, g, b === undefined ? r : b);
  }

  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }

  setHex(hex) {
    hex = Math.floor(hex);
    this.r = ((hex >> 16) & 255) / 255;
    this.g = ((hex >> 8) & 255) / 255;
    this.b = (hex & 255) / 255;
    return this;
  }

  copy(c) {
    this.r = c.r;
    this.g = c.g;
    this.b = c.b;
    return this;
  }

  multiplyScalar(s) {
    this.r *= s;
    this.g *= s;
    this.b *= s;
    return this;
  }

  toArray(out = [], offset = 0) {
    out[offset] = this.r;
    out[offset + 1] = this.g;
    out[offset + 2] = this.b;
    return out;
  }

  getHex() {
    const r = clamp(Math.round(this.r * 255), 0, 255);
    const g = clamp(Math.round(this.g * 255), 0, 255);
    const b = clamp(Math.round(this.b * 255), 0, 255);
    return (r << 16) | (g << 8) | b;
  }
}
