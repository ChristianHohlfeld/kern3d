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
    const { x, y, z, w } = q;
    if (order === "XYZ") {
      const sinp = 2 * (w * y - z * x);
      this.y = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
      if (Math.abs(sinp) < 0.999999) {
        this.x = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
        this.z = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
      } else {
        this.x = Math.atan2(2 * (w * x - y * z), 1 - 2 * (x * x + z * z));
        this.z = 0;
      }
    }
    return this;
  }
}
