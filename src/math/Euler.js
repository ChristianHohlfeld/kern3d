export class Euler {
  constructor(x = 0, y = 0, z = 0, order = "XYZ") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.order = order;
  }

  set(x, y, z, order) {
    this.x = x;
    this.y = y;
    this.z = z;
    if (order) this.order = order;
    return this;
  }

  copy(e) {
    this.x = e.x;
    this.y = e.y;
    this.z = e.z;
    this.order = e.order;
    return this;
  }

  setFromQuaternion(q, order = this.order) {
    this.order = order;
    const x = q.x, y = q.y, z = q.z, w = q.w;
    const sqx = x * x, sqy = y * y, sqz = z * z, sqw = w * w;
    // XYZ, same extraction as Three.js. The previous formula flipped z and rolled the camera.
    if (order === "XYZ") {
      this.x = Math.atan2(2 * (x * w - y * z), sqw - sqx - sqy + sqz);
      const sinp = Math.min(1, Math.max(-1, 2 * (x * z + y * w)));
      this.y = Math.asin(sinp);
      this.z = Math.atan2(2 * (z * w - x * y), sqw + sqx - sqy - sqz);
    }
    return this;
  }
}
