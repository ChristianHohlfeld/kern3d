// src/math/MathUtils.js
var DEG2RAD = Math.PI / 180;
var RAD2DEG = 180 / Math.PI;
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// src/math/Color.js
var Color = class {
  constructor(r = 1, g = 1, b = 1) {
    this.r = 1;
    this.g = 1;
    this.b = 1;
    if (typeof r === "number" && g === void 0) this.setHex(r);
    else this.setRGB(r, g, b);
  }
  setRGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    return this;
  }
  setHex(hex) {
    hex = Math.floor(hex);
    this.r = (hex >> 16 & 255) / 255;
    this.g = (hex >> 8 & 255) / 255;
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
    return r << 16 | g << 8 | b;
  }
};

// src/math/Vector3.js
var Vector3 = class _Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }
  copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  clone() {
    return new _Vector3(this.x, this.y, this.z);
  }
  add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  addScaledVector(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    this.z += v.z * s;
    return this;
  }
  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  subVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  }
  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }
  divideScalar(s) {
    return this.multiplyScalar(1 / s);
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }
  cross(v) {
    return this.crossVectors(this, v);
  }
  crossVectors(a, b) {
    const ax = a.x, ay = a.y, az = a.z;
    const bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.lengthSq());
  }
  normalize() {
    const len = this.length();
    if (len > 1e-8) this.multiplyScalar(1 / len);
    return this;
  }
  lerp(v, t) {
    this.x += (v.x - this.x) * t;
    this.y += (v.y - this.y) * t;
    this.z += (v.z - this.z) * t;
    return this;
  }
  applyMatrix4(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
    this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
    this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
    return this;
  }
  transformDirection(m) {
    const x = this.x, y = this.y, z = this.z;
    const e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z;
    this.y = e[1] * x + e[5] * y + e[9] * z;
    this.z = e[2] * x + e[6] * y + e[10] * z;
    return this.normalize();
  }
  setFromMatrixPosition(m) {
    const e = m.elements;
    this.x = e[12];
    this.y = e[13];
    this.z = e[14];
    return this;
  }
  distanceTo(v) {
    return Math.sqrt(this.distanceToSquared(v));
  }
  distanceToSquared(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }
};

// src/math/Euler.js
var Euler = class {
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
};

// src/math/Quaternion.js
var Quaternion = class _Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
  set(x, y, z, w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }
  copy(q) {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }
  clone() {
    return new _Quaternion(this.x, this.y, this.z, this.w);
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  setFromEuler(euler) {
    const x = euler.x;
    const y = euler.y;
    const z = euler.z;
    const c1 = Math.cos(x / 2);
    const c2 = Math.cos(y / 2);
    const c3 = Math.cos(z / 2);
    const s1 = Math.sin(x / 2);
    const s2 = Math.sin(y / 2);
    const s3 = Math.sin(z / 2);
    this.x = s1 * c2 * c3 + c1 * s2 * s3;
    this.y = c1 * s2 * c3 - s1 * c2 * s3;
    this.z = c1 * c2 * s3 + s1 * s2 * c3;
    this.w = c1 * c2 * c3 - s1 * s2 * s3;
    return this;
  }
  setFromRotationMatrix(m) {
    const te = m.elements;
    const m11 = te[0], m12 = te[4], m13 = te[8];
    const m21 = te[1], m22 = te[5], m23 = te[9];
    const m31 = te[2], m32 = te[6], m33 = te[10];
    const trace = m11 + m22 + m33;
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1);
      this.w = 0.25 / s;
      this.x = (m32 - m23) * s;
      this.y = (m13 - m31) * s;
      this.z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      this.w = (m32 - m23) / s;
      this.x = 0.25 * s;
      this.y = (m12 + m21) / s;
      this.z = (m13 + m31) / s;
    } else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      this.w = (m13 - m31) / s;
      this.x = (m12 + m21) / s;
      this.y = 0.25 * s;
      this.z = (m23 + m32) / s;
    } else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      this.w = (m21 - m12) / s;
      this.x = (m13 + m31) / s;
      this.y = (m23 + m32) / s;
      this.z = 0.25 * s;
    }
    return this;
  }
  multiply(q) {
    return this.multiplyQuaternions(this, q);
  }
  multiplyQuaternions(a, b) {
    const qax = a.x, qay = a.y, qaz = a.z, qaw = a.w;
    const qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;
    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }
  normalize() {
    const len = Math.hypot(this.x, this.y, this.z, this.w);
    if (len === 0) return this.identity();
    const inv = 1 / len;
    this.x *= inv;
    this.y *= inv;
    this.z *= inv;
    this.w *= inv;
    return this;
  }
};

// src/math/Matrix4.js
var _x = new Vector3();
var _y = new Vector3();
var _z = new Vector3();
var Matrix4 = class _Matrix4 {
  constructor() {
    this.elements = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  }
  identity() {
    const e = this.elements;
    e[0] = 1;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;
    e[4] = 0;
    e[5] = 1;
    e[6] = 0;
    e[7] = 0;
    e[8] = 0;
    e[9] = 0;
    e[10] = 1;
    e[11] = 0;
    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;
    return this;
  }
  copy(m) {
    this.elements.set(m.elements);
    return this;
  }
  clone() {
    return new _Matrix4().copy(this);
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  multiplyMatrices(a, b) {
    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;
    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
    const a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
    const a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
    const a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
    const b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
    const b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
    const b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }
  compose(position, quaternion, scale) {
    const te = this.elements;
    const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;
    const sx = scale.x, sy = scale.y, sz = scale.z;
    te[0] = (1 - (yy + zz)) * sx;
    te[1] = (xy + wz) * sx;
    te[2] = (xz - wy) * sx;
    te[3] = 0;
    te[4] = (xy - wz) * sy;
    te[5] = (1 - (xx + zz)) * sy;
    te[6] = (yz + wx) * sy;
    te[7] = 0;
    te[8] = (xz + wy) * sz;
    te[9] = (yz - wx) * sz;
    te[10] = (1 - (xx + yy)) * sz;
    te[11] = 0;
    te[12] = position.x;
    te[13] = position.y;
    te[14] = position.z;
    te[15] = 1;
    return this;
  }
  // Camera/object basis looking at target. +Z points from target toward eye
  // (camera looks down its local -Z), matching the Three.js convention.
  lookAt(eye, target, up) {
    _z.subVectors(eye, target);
    if (_z.lengthSq() === 0) _z.z = 1;
    _z.normalize();
    _x.crossVectors(up, _z);
    if (_x.lengthSq() === 0) {
      if (Math.abs(up.z) === 1) _z.x += 1e-4;
      else _z.z += 1e-4;
      _z.normalize();
      _x.crossVectors(up, _z);
    }
    _x.normalize();
    _y.crossVectors(_z, _x);
    const te = this.elements;
    te[0] = _x.x;
    te[4] = _y.x;
    te[8] = _z.x;
    te[12] = eye.x;
    te[1] = _x.y;
    te[5] = _y.y;
    te[9] = _z.y;
    te[13] = eye.y;
    te[2] = _x.z;
    te[6] = _y.z;
    te[10] = _z.z;
    te[14] = eye.z;
    te[3] = 0;
    te[7] = 0;
    te[11] = 0;
    te[15] = 1;
    return this;
  }
  makePerspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    const te = this.elements;
    te[0] = f / aspect;
    te[1] = 0;
    te[2] = 0;
    te[3] = 0;
    te[4] = 0;
    te[5] = f;
    te[6] = 0;
    te[7] = 0;
    te[8] = 0;
    te[9] = 0;
    te[10] = (far + near) * nf;
    te[11] = -1;
    te[12] = 0;
    te[13] = 0;
    te[14] = 2 * far * near * nf;
    te[15] = 0;
    return this;
  }
  makeOrthographic(left, right, top, bottom, near, far) {
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (near - far);
    const te = this.elements;
    te[0] = 2 * w;
    te[1] = 0;
    te[2] = 0;
    te[3] = 0;
    te[4] = 0;
    te[5] = 2 * h;
    te[6] = 0;
    te[7] = 0;
    te[8] = 0;
    te[9] = 0;
    te[10] = 2 * p;
    te[11] = 0;
    te[12] = -(right + left) * w;
    te[13] = -(top + bottom) * h;
    te[14] = (near + far) * p;
    te[15] = 1;
    return this;
  }
  invert() {
    const te = this.elements;
    const n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3];
    const n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7];
    const n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11];
    const n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15];
    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0) return this.identity();
    const detInv = 1 / det;
    te[0] = t11 * detInv;
    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
    te[4] = t12 * detInv;
    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
    te[8] = t13 * detInv;
    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
    te[12] = t14 * detInv;
    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
    return this;
  }
  getNormalMatrix(out3) {
    const e = this.elements;
    const a11 = e[0], a12 = e[4], a13 = e[8];
    const a21 = e[1], a22 = e[5], a23 = e[9];
    const a31 = e[2], a32 = e[6], a33 = e[10];
    const det = a11 * (a22 * a33 - a23 * a32) - a12 * (a21 * a33 - a23 * a31) + a13 * (a21 * a32 - a22 * a31);
    const inv = det === 0 ? 0 : 1 / det;
    out3[0] = (a22 * a33 - a23 * a32) * inv;
    out3[1] = (a13 * a32 - a12 * a33) * inv;
    out3[2] = (a12 * a23 - a13 * a22) * inv;
    out3[3] = (a23 * a31 - a21 * a33) * inv;
    out3[4] = (a11 * a33 - a13 * a31) * inv;
    out3[5] = (a13 * a21 - a11 * a23) * inv;
    out3[6] = (a21 * a32 - a22 * a31) * inv;
    out3[7] = (a12 * a31 - a11 * a32) * inv;
    out3[8] = (a11 * a22 - a12 * a21) * inv;
    return out3;
  }
};

// src/core/Object3D.js
var _id = 0;
var Object3D = class {
  constructor() {
    this.id = _id++;
    this.name = "";
    this.parent = null;
    this.children = [];
    this.position = new Vector3();
    this.rotation = new Euler();
    this.quaternion = new Quaternion();
    this.scale = new Vector3(1, 1, 1);
    this.up = new Vector3(0, 1, 0);
    this.matrix = new Matrix4();
    this.matrixWorld = new Matrix4();
    this.matrixAutoUpdate = true;
    this.visible = true;
    this.castShadow = false;
    this.receiveShadow = false;
    this.userData = {};
  }
  add(object) {
    if (object.parent) object.parent.remove(object);
    object.parent = this;
    this.children.push(object);
    return this;
  }
  remove(object) {
    const i = this.children.indexOf(object);
    if (i !== -1) {
      object.parent = null;
      this.children.splice(i, 1);
    }
    return this;
  }
  traverse(callback) {
    callback(this);
    for (let i = 0; i < this.children.length; i++) this.children[i].traverse(callback);
  }
  updateMatrix() {
    this.quaternion.setFromEuler(this.rotation);
    this.matrix.compose(this.position, this.quaternion, this.scale);
  }
  updateMatrixWorld(force = false) {
    if (this.matrixAutoUpdate || force) this.updateMatrix();
    if (this.parent) this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
    else this.matrixWorld.copy(this.matrix);
    for (let i = 0; i < this.children.length; i++) this.children[i].updateMatrixWorld(force);
  }
  lookAt(x, y, z) {
    const target = x instanceof Vector3 ? x : _target.set(x, y, z);
    this.updateMatrix();
    _eye.setFromMatrixPosition(this.matrix);
    this.matrix.lookAt(_eye, target, this.up);
    this.quaternion.setFromRotationMatrix(this.matrix);
    this._eulerFromQuaternion();
  }
  _eulerFromQuaternion() {
    const q = this.quaternion;
    const sinr = 2 * (q.w * q.x + q.y * q.z);
    const cosr = 1 - 2 * (q.x * q.x + q.y * q.y);
    this.rotation.x = Math.atan2(sinr, cosr);
    const sinp = 2 * (q.w * q.y - q.z * q.x);
    this.rotation.y = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
    const siny = 2 * (q.w * q.z + q.x * q.y);
    const cosy = 1 - 2 * (q.y * q.y + q.z * q.z);
    this.rotation.z = Math.atan2(siny, cosy);
  }
};
var _target = new Vector3();
var _eye = new Vector3();
var Scene = class extends Object3D {
  constructor() {
    super();
    this.isScene = true;
    this.background = null;
    this.fog = null;
  }
};

// src/cameras/Cameras.js
var Camera = class extends Object3D {
  constructor() {
    super();
    this.isCamera = true;
    this.matrixWorldInverse = new Matrix4();
    this.projectionMatrix = new Matrix4();
  }
  updateMatrixWorld(force) {
    super.updateMatrixWorld(force);
    this.matrixWorldInverse.copy(this.matrixWorld).invert();
  }
};
var PerspectiveCamera = class extends Camera {
  constructor(fov = 50, aspect = 1, near = 0.1, far = 2e3) {
    super();
    this.isPerspectiveCamera = true;
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    this.projectionMatrix.makePerspective(this.fov * DEG2RAD, this.aspect, this.near, this.far);
  }
};
var OrthographicCamera = class extends Camera {
  constructor(left = -1, right = 1, top = 1, bottom = -1, near = 0.1, far = 2e3) {
    super();
    this.isOrthographicCamera = true;
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }
  updateProjectionMatrix() {
    this.projectionMatrix.makeOrthographic(this.left, this.right, this.top, this.bottom, this.near, this.far);
  }
};

// src/geometries/Geometries.js
var _gid = 0;
var BufferGeometry = class {
  constructor() {
    this.id = _gid++;
    this.attributes = {};
    this.index = null;
    this.groups = [];
    this.boundingSphere = null;
    this._gl = null;
    this.version = 0;
  }
  setAttribute(name, attribute) {
    this.attributes[name] = attribute;
    this.version++;
    return this;
  }
  setIndex(array) {
    this.index = array instanceof BufferAttribute ? array : new BufferAttribute(array, 1);
    this.version++;
    return this;
  }
  dispose() {
    this.version++;
    this._disposed = true;
  }
  computeVertexNormals() {
    const pos = this.attributes.position;
    if (!pos) return;
    const normals = new Float32Array(pos.array.length);
    const index = this.index ? this.index.array : null;
    const count = index ? index.length : pos.count;
    const p = pos.array;
    const ax = 0, ay = 1, az = 2;
    for (let i = 0; i < count; i += 3) {
      const ia = (index ? index[i] : i) * 3;
      const ib = (index ? index[i + 1] : i + 1) * 3;
      const ic = (index ? index[i + 2] : i + 2) * 3;
      const abx = p[ib] - p[ia], aby = p[ib + 1] - p[ia + 1], abz = p[ib + 2] - p[ia + 2];
      const acx = p[ic] - p[ia], acy = p[ic + 1] - p[ia + 1], acz = p[ic + 2] - p[ia + 2];
      const nx = aby * acz - abz * acy;
      const ny = abz * acx - abx * acz;
      const nz = abx * acy - aby * acx;
      normals[ia] += nx;
      normals[ia + 1] += ny;
      normals[ia + 2] += nz;
      normals[ib] += nx;
      normals[ib + 1] += ny;
      normals[ib + 2] += nz;
      normals[ic] += nx;
      normals[ic + 1] += ny;
      normals[ic + 2] += nz;
      void ax;
      void ay;
      void az;
    }
    for (let i = 0; i < normals.length; i += 3) {
      const x = normals[i], y = normals[i + 1], z = normals[i + 2];
      const len = Math.hypot(x, y, z) || 1;
      normals[i] = x / len;
      normals[i + 1] = y / len;
      normals[i + 2] = z / len;
    }
    this.setAttribute("normal", new BufferAttribute(normals, 3));
  }
};
var BufferAttribute = class {
  constructor(array, itemSize) {
    this.array = array;
    this.itemSize = itemSize;
    this.count = array.length / itemSize;
    this.needsUpdate = true;
  }
};
var BoxGeometry = class extends BufferGeometry {
  constructor(width = 1, height = 1, depth = 1) {
    super();
    const w = width / 2, h = height / 2, d = depth / 2;
    const positions = [];
    const normals = [];
    const uvs = [];
    const faces = [
      [0, 0, 1, -1, -1, 1, 1, 0, 0],
      [0, 0, -1, -1, -1, -1, -1, 0, 0],
      [0, 1, 0, -1, 1, -1, 0, 1, 0],
      [0, -1, 0, -1, -1, 1, 0, -1, 0],
      [1, 0, 0, 1, -1, 1, 1, 0, 0],
      [-1, 0, 0, -1, -1, -1, -1, 0, 0]
    ];
    const corners = [
      // +Z
      [[-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d], [0, 0, 1]],
      // -Z
      [[w, -h, -d], [-w, -h, -d], [-w, h, -d], [w, h, -d], [0, 0, -1]],
      // +Y
      [[-w, h, d], [w, h, d], [w, h, -d], [-w, h, -d], [0, 1, 0]],
      // -Y
      [[-w, -h, -d], [w, -h, -d], [w, -h, d], [-w, -h, d], [0, -1, 0]],
      // +X
      [[w, -h, d], [w, -h, -d], [w, h, -d], [w, h, d], [1, 0, 0]],
      // -X
      [[-w, -h, -d], [-w, -h, d], [-w, h, d], [-w, h, -d], [-1, 0, 0]]
    ];
    void faces;
    const indices = [];
    let offset = 0;
    for (const face of corners) {
      const n = face[4];
      const uv = [[0, 0], [1, 0], [1, 1], [0, 1]];
      for (let i = 0; i < 4; i++) {
        positions.push(face[i][0], face[i][1], face[i][2]);
        normals.push(n[0], n[1], n[2]);
        uvs.push(uv[i][0], uv[i][1]);
      }
      indices.push(offset, offset + 1, offset + 2, offset, offset + 2, offset + 3);
      offset += 4;
    }
    this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new Uint16Array(indices));
  }
};
var PlaneGeometry = class extends BufferGeometry {
  constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    super();
    const ws = Math.max(1, widthSegments);
    const hs = Math.max(1, heightSegments);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    for (let y = 0; y <= hs; y++) {
      for (let x = 0; x <= ws; x++) {
        const u = x / ws;
        const v = y / hs;
        positions.push(width * (u - 0.5), height * (v - 0.5), 0);
        normals.push(0, 0, 1);
        uvs.push(u, v);
      }
    }
    const row = ws + 1;
    for (let y = 0; y < hs; y++) {
      for (let x = 0; x < ws; x++) {
        const a = y * row + x;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        indices.push(a, b, d, a, d, c);
      }
    }
    const IndexArray = positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
    this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new IndexArray(indices));
  }
};
var SphereGeometry = class extends BufferGeometry {
  constructor(radius = 1, widthSegments = 32, heightSegments = 16) {
    super();
    const ws = Math.max(3, widthSegments);
    const hs = Math.max(2, heightSegments);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    for (let y = 0; y <= hs; y++) {
      const v = y / hs;
      const phi = v * Math.PI;
      for (let x = 0; x <= ws; x++) {
        const u = x / ws;
        const theta = u * Math.PI * 2;
        const nx = Math.sin(phi) * Math.cos(theta);
        const ny = Math.cos(phi);
        const nz = Math.sin(phi) * Math.sin(theta);
        normals.push(nx, ny, nz);
        positions.push(nx * radius, ny * radius, nz * radius);
        uvs.push(u, 1 - v);
      }
    }
    const row = ws + 1;
    for (let y = 0; y < hs; y++) {
      for (let x = 0; x < ws; x++) {
        const a = y * row + x;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        if (y !== 0) indices.push(a, c, b);
        if (y !== hs - 1) indices.push(b, c, d);
      }
    }
    const IndexArray = positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
    this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new IndexArray(indices));
  }
};
var TorusGeometry = class extends BufferGeometry {
  constructor(radius = 1, tube = 0.4, radialSegments = 16, tubularSegments = 48) {
    super();
    const rs = Math.max(3, radialSegments);
    const ts = Math.max(3, tubularSegments);
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    for (let j = 0; j <= rs; j++) {
      for (let i = 0; i <= ts; i++) {
        const u = i / ts * Math.PI * 2;
        const v = j / rs * Math.PI * 2;
        const cx = (radius + tube * Math.cos(v)) * Math.cos(u);
        const cy = tube * Math.sin(v);
        const cz = (radius + tube * Math.cos(v)) * Math.sin(u);
        const nx = Math.cos(v) * Math.cos(u);
        const ny = Math.sin(v);
        const nz = Math.cos(v) * Math.sin(u);
        positions.push(cx, cy, cz);
        normals.push(nx, ny, nz);
        uvs.push(i / ts, j / rs);
      }
    }
    const row = ts + 1;
    for (let j = 0; j < rs; j++) {
      for (let i = 0; i < ts; i++) {
        const a = j * row + i;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const IndexArray = positions.length / 3 > 65535 ? Uint32Array : Uint16Array;
    this.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
    this.setAttribute("normal", new BufferAttribute(new Float32Array(normals), 3));
    this.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));
    this.setIndex(new IndexArray(indices));
  }
};

// src/materials/Materials.js
var _mid = 0;
var Material = class {
  constructor() {
    this.id = _mid++;
    this.transparent = false;
    this.opacity = 1;
    this.side = 0;
    this.depthTest = true;
    this.depthWrite = true;
    this.wireframe = false;
    this.visible = true;
  }
};
var MeshBasicMaterial = class extends Material {
  constructor(params = {}) {
    super();
    this.isMeshBasicMaterial = true;
    this.type = "MeshBasicMaterial";
    this.color = new Color(params.color ?? 16777215);
    this.map = params.map ?? null;
    this.fog = params.fog !== false;
    Object.assign(this, pick(params, ["transparent", "opacity", "side", "wireframe", "depthWrite"]));
  }
};
var MeshPhongMaterial = class extends Material {
  constructor(params = {}) {
    super();
    this.isMeshPhongMaterial = true;
    this.type = "MeshPhongMaterial";
    this.color = new Color(params.color ?? 16777215);
    this.specular = new Color(params.specular ?? 1118481);
    this.emissive = new Color(params.emissive ?? 0);
    this.shininess = params.shininess ?? 30;
    this.map = params.map ?? null;
    this.fog = params.fog !== false;
    Object.assign(this, pick(params, ["transparent", "opacity", "side", "wireframe", "depthWrite"]));
  }
};
function pick(src, keys) {
  const out = {};
  for (const k of keys) if (src[k] !== void 0) out[k] = src[k];
  return out;
}

// src/lights/Lights.js
var Light = class extends Object3D {
  constructor(color = 16777215, intensity = 1) {
    super();
    this.isLight = true;
    this.color = new Color(color);
    this.intensity = intensity;
  }
};
var AmbientLight = class extends Light {
  constructor(color = 16777215, intensity = 1) {
    super(color, intensity);
    this.isAmbientLight = true;
  }
};
var DirectionalLight = class extends Light {
  constructor(color = 16777215, intensity = 1) {
    super(color, intensity);
    this.isDirectionalLight = true;
    this.target = new Object3D();
  }
};
var PointLight = class extends Light {
  constructor(color = 16777215, intensity = 1, distance = 0) {
    super(color, intensity);
    this.isPointLight = true;
    this.distance = distance;
  }
};

// src/objects/Mesh.js
var Mesh = class extends Object3D {
  constructor(geometry, material) {
    super();
    this.isMesh = true;
    this.geometry = geometry;
    this.material = material;
  }
};
var LineSegments = class extends Object3D {
  constructor(geometry, material) {
    super();
    this.isLineSegments = true;
    this.geometry = geometry;
    this.material = material;
  }
};

// src/renderers/shaders.js
var VERT = `#version 300 es
precision highp float;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
layout(location = 2) in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;
out vec3 vWorldPos;
out vec2 vUv;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalMatrix * normal;
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
var FRAG = `#version 300 es
precision highp float;

in vec3 vNormal;
in vec3 vWorldPos;
in vec2 vUv;

uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 emissiveColor;
uniform float shininess;
uniform float opacity;
uniform int shaded;
uniform int useMap;
uniform sampler2D map;

uniform vec3 ambient;
uniform vec3 cameraPosition;

uniform int numDir;
uniform vec3 dirDirections[4];
uniform vec3 dirColors[4];

uniform int numPoint;
uniform vec3 pointPositions[8];
uniform vec3 pointColors[8];
uniform float pointDistances[8];

uniform int useFog;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

out vec4 fragColor;

void main() {
  vec3 N = normalize(vNormal);
  vec3 albedo = diffuseColor;
  if (useMap == 1) albedo *= texture(map, vUv).rgb;

  vec3 color = emissiveColor;
  if (shaded == 0) {
    color += albedo;
  } else {
    vec3 V = normalize(cameraPosition - vWorldPos);
    color += albedo * ambient;
    for (int i = 0; i < 4; i++) {
      if (i >= numDir) break;
      vec3 L = normalize(-dirDirections[i]);
      float ndotl = max(dot(N, L), 0.0);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), shininess);
      color += albedo * dirColors[i] * ndotl + specularColor * dirColors[i] * spec * ndotl;
    }
    for (int i = 0; i < 8; i++) {
      if (i >= numPoint) break;
      vec3 toL = pointPositions[i] - vWorldPos;
      float dist = length(toL);
      vec3 L = toL / max(dist, 1e-4);
      float range = pointDistances[i];
      float atten = 1.0;
      if (range > 0.0) {
        float t = clamp(1.0 - dist / range, 0.0, 1.0);
        atten = t * t;
      } else {
        atten = 1.0 / (1.0 + dist * dist * 0.05);
      }
      float ndotl = max(dot(N, L), 0.0);
      vec3 H = normalize(L + V);
      float spec = pow(max(dot(N, H), 0.0), shininess);
      vec3 lc = pointColors[i] * atten;
      color += albedo * lc * ndotl + specularColor * lc * spec * ndotl;
    }
  }

  if (useFog == 1) {
    float fogFactor = clamp((fogFar - length(cameraPosition - vWorldPos)) / (fogFar - fogNear), 0.0, 1.0);
    color = mix(fogColor, color, fogFactor);
  }

  // Reinhard keeps Phong highlights from clipping the whole frame to white.
  color = max(color, 0.0);
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(1.0 / 2.2));
  fragColor = vec4(color, opacity);
}
`;
var LINE_VERT = `#version 300 es
precision highp float;
layout(location = 0) in vec3 position;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`;
var LINE_FRAG = `#version 300 es
precision highp float;
uniform vec3 diffuseColor;
uniform float opacity;
out vec4 fragColor;
void main() {
  vec3 lineColor = pow(max(diffuseColor, 0.0), vec3(1.0 / 2.2));
  fragColor = vec4(lineColor, opacity);
}
`;

// src/renderers/WebGLRenderer.js
var MAX_DIR = 4;
var MAX_POINT = 8;
var WebGLRenderer = class {
  constructor(params = {}) {
    const canvas = params.canvas || document.createElement("canvas");
    this.domElement = canvas;
    const gl = canvas.getContext("webgl2", {
      antialias: params.antialias !== false,
      alpha: params.alpha === true,
      depth: true,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance"
    });
    if (!gl) throw new Error("WebGL2 is not available");
    this.gl = gl;
    this.autoClear = true;
    this._clear = new Color(params.clearColor ?? 1118481);
    this._pixelRatio = 1;
    this._width = canvas.width || 300;
    this._height = canvas.height || 150;
    this._programs = /* @__PURE__ */ new Map();
    this._textures = /* @__PURE__ */ new WeakMap();
    this._modelView = new Matrix4();
    this._normal = new Float32Array(9);
    this._camPos = new Vector3();
    this._dir = new Vector3();
    this._lightPos = new Vector3();
    this._targetPos = new Vector3();
    this._tmpColor = new Color();
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    this._meshProgram = this._compile(VERT, FRAG);
    this._lineProgram = this._compile(LINE_VERT, LINE_FRAG);
    this.setSize(this._width, this._height, false);
  }
  setClearColor(color, alpha = 1) {
    if (typeof color === "number") this._clear.setHex(color);
    else this._clear.copy(color);
    this._clearAlpha = alpha;
  }
  setPixelRatio(ratio) {
    this._pixelRatio = ratio;
  }
  setSize(width, height, updateStyle = true) {
    this._width = width;
    this._height = height;
    const canvas = this.domElement;
    canvas.width = Math.floor(width * this._pixelRatio);
    canvas.height = Math.floor(height * this._pixelRatio);
    if (updateStyle) {
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
    }
    this.gl.viewport(0, 0, canvas.width, canvas.height);
  }
  getSize() {
    return { width: this._width, height: this._height };
  }
  render(scene, camera) {
    const gl = this.gl;
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    if (this.autoClear) {
      const c = scene.background || this._clear;
      gl.clearColor(c.r, c.g, c.b, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    const lights = { ambient: [0, 0, 0], dir: [], point: [] };
    const meshes = [];
    const lines = [];
    scene.traverse((obj) => {
      if (!obj.visible) return;
      if (obj.isAmbientLight) {
        lights.ambient[0] += obj.color.r * obj.intensity;
        lights.ambient[1] += obj.color.g * obj.intensity;
        lights.ambient[2] += obj.color.b * obj.intensity;
      } else if (obj.isDirectionalLight && lights.dir.length < MAX_DIR) {
        lights.dir.push(obj);
      } else if (obj.isPointLight && lights.point.length < MAX_POINT) {
        lights.point.push(obj);
      } else if (obj.isMesh && obj.material && obj.material.visible !== false) {
        meshes.push(obj);
      } else if (obj.isLineSegments && obj.material) {
        lines.push(obj);
      }
    });
    this._camPos.setFromMatrixPosition(camera.matrixWorld);
    this._drawMeshes(meshes, camera, scene, lights);
    this._drawLines(lines, camera);
  }
  _drawMeshes(meshes, camera, scene, lights) {
    const gl = this.gl;
    const prog = this._meshProgram;
    gl.useProgram(prog.program);
    gl.uniformMatrix4fv(prog.u.viewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(prog.u.projectionMatrix, false, camera.projectionMatrix.elements);
    gl.uniform3f(prog.u.cameraPosition, this._camPos.x, this._camPos.y, this._camPos.z);
    gl.uniform3fv(prog.u.ambient, lights.ambient);
    const dirDir = new Float32Array(MAX_DIR * 3);
    const dirCol = new Float32Array(MAX_DIR * 3);
    for (let i = 0; i < lights.dir.length; i++) {
      const light = lights.dir[i];
      this._lightPos.setFromMatrixPosition(light.matrixWorld);
      this._targetPos.setFromMatrixPosition(light.target.matrixWorld);
      this._dir.subVectors(this._targetPos, this._lightPos).normalize();
      dirDir[i * 3] = this._dir.x;
      dirDir[i * 3 + 1] = this._dir.y;
      dirDir[i * 3 + 2] = this._dir.z;
      dirCol[i * 3] = light.color.r * light.intensity;
      dirCol[i * 3 + 1] = light.color.g * light.intensity;
      dirCol[i * 3 + 2] = light.color.b * light.intensity;
    }
    gl.uniform1i(prog.u.numDir, lights.dir.length);
    gl.uniform3fv(prog.u.dirDirections, dirDir);
    gl.uniform3fv(prog.u.dirColors, dirCol);
    const pPos = new Float32Array(MAX_POINT * 3);
    const pCol = new Float32Array(MAX_POINT * 3);
    const pDist = new Float32Array(MAX_POINT);
    for (let i = 0; i < lights.point.length; i++) {
      const light = lights.point[i];
      this._lightPos.setFromMatrixPosition(light.matrixWorld);
      pPos[i * 3] = this._lightPos.x;
      pPos[i * 3 + 1] = this._lightPos.y;
      pPos[i * 3 + 2] = this._lightPos.z;
      pCol[i * 3] = light.color.r * light.intensity;
      pCol[i * 3 + 1] = light.color.g * light.intensity;
      pCol[i * 3 + 2] = light.color.b * light.intensity;
      pDist[i] = light.distance || 0;
    }
    gl.uniform1i(prog.u.numPoint, lights.point.length);
    gl.uniform3fv(prog.u.pointPositions, pPos);
    gl.uniform3fv(prog.u.pointColors, pCol);
    gl.uniform1fv(prog.u.pointDistances, pDist);
    const fog = scene.fog;
    gl.uniform1i(prog.u.useFog, fog ? 1 : 0);
    if (fog) {
      gl.uniform3f(prog.u.fogColor, fog.color.r, fog.color.g, fog.color.b);
      gl.uniform1f(prog.u.fogNear, fog.near);
      gl.uniform1f(prog.u.fogFar, fog.far);
    }
    for (let i = 0; i < meshes.length; i++) {
      const mesh = meshes[i];
      const mat = mesh.material;
      const geo = this._bindGeometry(mesh.geometry, prog);
      if (!geo) continue;
      gl.uniformMatrix4fv(prog.u.modelMatrix, false, mesh.matrixWorld.elements);
      this._modelView.multiplyMatrices(camera.matrixWorldInverse, mesh.matrixWorld);
      this._modelView.getNormalMatrix(this._normal);
      gl.uniformMatrix3fv(prog.u.normalMatrix, false, this._normal);
      const shaded = mat.isMeshPhongMaterial ? 1 : 0;
      gl.uniform1i(prog.u.shaded, shaded);
      gl.uniform3f(prog.u.diffuseColor, mat.color.r, mat.color.g, mat.color.b);
      if (shaded) {
        gl.uniform3f(prog.u.specularColor, mat.specular.r, mat.specular.g, mat.specular.b);
        gl.uniform3f(prog.u.emissiveColor, mat.emissive.r, mat.emissive.g, mat.emissive.b);
        gl.uniform1f(prog.u.shininess, Math.max(1, mat.shininess));
      } else {
        gl.uniform3f(prog.u.specularColor, 0, 0, 0);
        gl.uniform3f(prog.u.emissiveColor, 0, 0, 0);
        gl.uniform1f(prog.u.shininess, 1);
      }
      gl.uniform1f(prog.u.opacity, mat.opacity ?? 1);
      if (mat.map && mat.map.image) {
        const tex = this._getTexture(mat.map);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(prog.u.map, 0);
        gl.uniform1i(prog.u.useMap, 1);
      } else {
        gl.uniform1i(prog.u.useMap, 0);
      }
      if (mat.side === 2) gl.disable(gl.CULL_FACE);
      else {
        gl.enable(gl.CULL_FACE);
        gl.cullFace(mat.side === 1 ? gl.FRONT : gl.BACK);
      }
      gl.depthMask(mat.depthWrite !== false);
      if (mat.transparent) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        gl.disable(gl.BLEND);
      }
      const mode = mat.wireframe ? gl.LINE_STRIP : gl.TRIANGLES;
      if (geo.index) gl.drawElements(mode, geo.count, geo.indexType, 0);
      else gl.drawArrays(mode, 0, geo.count);
    }
  }
  _drawLines(lines, camera) {
    if (!lines.length) return;
    const gl = this.gl;
    const prog = this._lineProgram;
    gl.useProgram(prog.program);
    gl.uniformMatrix4fv(prog.u.viewMatrix, false, camera.matrixWorldInverse.elements);
    gl.uniformMatrix4fv(prog.u.projectionMatrix, false, camera.projectionMatrix.elements);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    for (const line of lines) {
      const geo = this._bindGeometry(line.geometry, prog, true);
      if (!geo) continue;
      gl.uniformMatrix4fv(prog.u.modelMatrix, false, line.matrixWorld.elements);
      const c = line.material.color;
      gl.uniform3f(prog.u.diffuseColor, c.r, c.g, c.b);
      gl.uniform1f(prog.u.opacity, line.material.opacity ?? 1);
      gl.drawArrays(gl.LINES, 0, geo.count);
    }
    gl.disable(gl.BLEND);
  }
  _bindGeometry(geometry, prog, lines = false) {
    const gl = this.gl;
    if (!geometry._gl || geometry._gl.version !== geometry.version) {
      if (geometry._gl) this._deleteGeometry(geometry);
      geometry._gl = this._uploadGeometry(geometry);
    }
    const cache = geometry._gl;
    gl.bindVertexArray(cache.vao);
    return { index: !!geometry.index, indexType: cache.indexType, count: cache.count };
  }
  _uploadGeometry(geometry) {
    const gl = this.gl;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffers = [];
    const bind = (name, loc) => {
      const attr = geometry.attributes[name];
      if (!attr || loc < 0) return;
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, attr.array, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, attr.itemSize, gl.FLOAT, false, 0, 0);
      buffers.push(buf);
    };
    bind("position", 0);
    bind("normal", 1);
    bind("uv", 2);
    let indexType = gl.UNSIGNED_SHORT;
    let count = geometry.attributes.position ? geometry.attributes.position.count : 0;
    if (geometry.index) {
      const ib = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.index.array, gl.STATIC_DRAW);
      buffers.push(ib);
      indexType = geometry.index.array instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
      count = geometry.index.count;
    }
    gl.bindVertexArray(null);
    return { vao, buffers, indexType, count, version: geometry.version };
  }
  _deleteGeometry(geometry) {
    const gl = this.gl;
    const cache = geometry._gl;
    if (!cache) return;
    for (const b of cache.buffers) gl.deleteBuffer(b);
    gl.deleteVertexArray(cache.vao);
    geometry._gl = null;
  }
  _getTexture(map) {
    const gl = this.gl;
    let tex = this._textures.get(map);
    if (tex) return tex;
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, map.image);
    gl.generateMipmap(gl.TEXTURE_2D);
    this._textures.set(map, tex);
    return tex;
  }
  _compile(vsSrc, fsSrc) {
    const gl = this.gl;
    const vs = this._shader(gl.VERTEX_SHADER, vsSrc);
    const fs = this._shader(gl.FRAGMENT_SHADER, fsSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "position");
    gl.bindAttribLocation(program, 1, "normal");
    gl.bindAttribLocation(program, 2, "uv");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "shader link failed");
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    const u = {};
    const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(program, i);
      const name = info.name.replace(/\[0\]$/, "");
      u[name] = gl.getUniformLocation(program, info.name);
    }
    return { program, u };
  }
  _shader(type, src) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log || "shader compile failed");
    }
    return shader;
  }
};
var Fog = class {
  constructor(color = 0, near = 1, far = 100) {
    this.color = new Color(color);
    this.near = near;
    this.far = far;
  }
};
var Texture = class {
  constructor(image) {
    this.image = image || null;
    this.needsUpdate = true;
  }
};

// src/controls/OrbitControls.js
var STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2 };
var OrbitControls = class {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new Vector3();
    this.enableDamping = true;
    this.dampingFactor = 0.08;
    this.minDistance = 0.5;
    this.maxDistance = 200;
    this.minPolar = 0.05;
    this.maxPolar = Math.PI - 0.05;
    this.enabled = true;
    this._spherical = { radius: 1, phi: 1, theta: 0 };
    this._sphericalDelta = { radius: 1, phi: 0, theta: 0 };
    this._pan = new Vector3();
    this._state = STATE.NONE;
    this._pointer = { x: 0, y: 0 };
    this._scale = 1;
    this._offset = new Vector3();
    this._onPointerDown = (e) => this._pointerDown(e);
    this._onPointerMove = (e) => this._pointerMove(e);
    this._onPointerUp = () => {
      this._state = STATE.NONE;
    };
    this._onWheel = (e) => this._wheel(e);
    this._onContext = (e) => e.preventDefault();
    domElement.addEventListener("pointerdown", this._onPointerDown);
    domElement.addEventListener("pointermove", this._onPointerMove);
    domElement.addEventListener("pointerup", this._onPointerUp);
    domElement.addEventListener("pointerleave", this._onPointerUp);
    domElement.addEventListener("wheel", this._onWheel, { passive: false });
    domElement.addEventListener("contextmenu", this._onContext);
    this.update();
  }
  update() {
    const offset = this._offset.copy(this.camera.position).sub(this.target);
    const spherical = this._spherical;
    spherical.radius = offset.length();
    spherical.theta = Math.atan2(offset.x, offset.z);
    spherical.phi = Math.acos(Math.min(1, Math.max(-1, offset.y / (spherical.radius || 1))));
    if (this.enableDamping) {
      spherical.theta += this._sphericalDelta.theta * this.dampingFactor;
      spherical.phi += this._sphericalDelta.phi * this.dampingFactor;
      this._sphericalDelta.theta *= 1 - this.dampingFactor;
      this._sphericalDelta.phi *= 1 - this.dampingFactor;
      this.target.addScaledVector(this._pan, this.dampingFactor);
      this._pan.multiplyScalar(1 - this.dampingFactor);
    } else {
      spherical.theta += this._sphericalDelta.theta;
      spherical.phi += this._sphericalDelta.phi;
      this._sphericalDelta.theta = 0;
      this._sphericalDelta.phi = 0;
      this.target.add(this._pan);
      this._pan.set(0, 0, 0);
    }
    spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, spherical.radius * this._scale));
    this._scale = 1;
    spherical.phi = Math.max(this.minPolar, Math.min(this.maxPolar, spherical.phi));
    const sinPhi = Math.sin(spherical.phi);
    offset.set(
      spherical.radius * sinPhi * Math.sin(spherical.theta),
      spherical.radius * Math.cos(spherical.phi),
      spherical.radius * sinPhi * Math.cos(spherical.theta)
    );
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
    return this;
  }
  dispose() {
    const el = this.domElement;
    el.removeEventListener("pointerdown", this._onPointerDown);
    el.removeEventListener("pointermove", this._onPointerMove);
    el.removeEventListener("pointerup", this._onPointerUp);
    el.removeEventListener("pointerleave", this._onPointerUp);
    el.removeEventListener("wheel", this._onWheel);
    el.removeEventListener("contextmenu", this._onContext);
  }
  _pointerDown(e) {
    if (!this.enabled) return;
    this.domElement.setPointerCapture?.(e.pointerId);
    this._pointer.x = e.clientX;
    this._pointer.y = e.clientY;
    this._state = e.button === 2 || e.shiftKey ? STATE.PAN : e.button === 1 ? STATE.DOLLY : STATE.ROTATE;
  }
  _pointerMove(e) {
    if (!this.enabled || this._state === STATE.NONE) return;
    const dx = e.clientX - this._pointer.x;
    const dy = e.clientY - this._pointer.y;
    this._pointer.x = e.clientX;
    this._pointer.y = e.clientY;
    if (this._state === STATE.ROTATE) {
      const h = this.domElement.clientHeight || 1;
      this._sphericalDelta.theta -= 2 * Math.PI * dx / h;
      this._sphericalDelta.phi -= 2 * Math.PI * dy / h;
    } else if (this._state === STATE.PAN) {
      this._panOffset(dx, dy);
    }
  }
  _panOffset(dx, dy) {
    const el = this.domElement;
    const targetDistance = this._offset.copy(this.camera.position).sub(this.target).length();
    const fov = (this.camera.fov || 50) * Math.PI / 180;
    const height = 2 * Math.tan(fov / 2) * targetDistance;
    const factor = height / (el.clientHeight || 1);
    const x = -dx * factor;
    const y = dy * factor;
    const te = this.camera.matrix.elements;
    this._pan.x += te[0] * x + te[4] * y;
    this._pan.y += te[1] * x + te[5] * y;
    this._pan.z += te[2] * x + te[6] * y;
  }
  _wheel(e) {
    if (!this.enabled) return;
    e.preventDefault();
    this._scale *= e.deltaY > 0 ? 1.08 : 0.92;
  }
};

// src/helpers/GridHelper.js
var GridHelper = class extends LineSegments {
  constructor(size = 10, divisions = 10, color1 = 4473924, color2 = 2236962) {
    const geometry = new BufferGeometry();
    const step = size / divisions;
    const half = size / 2;
    const vertices = [];
    const colors = [];
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    for (let i = 0; i <= divisions; i++) {
      const p = -half + i * step;
      const c = i === divisions / 2 ? c1 : c2;
      vertices.push(-half, 0, p, half, 0, p);
      vertices.push(p, 0, -half, p, 0, half);
      colors.push(...c, ...c, ...c, ...c);
    }
    geometry.setAttribute("position", new BufferAttribute(new Float32Array(vertices), 3));
    super(geometry, new MeshBasicMaterial({ color: color1 }));
    this.material.color.setRGB(c1[0], c1[1], c1[2]);
  }
};
function hexToRgb(hex) {
  return [(hex >> 16 & 255) / 255, (hex >> 8 & 255) / 255, (hex & 255) / 255];
}

// src/Kern.js
var REVISION = "0.1.1-core";
export {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Color,
  DirectionalLight,
  Euler,
  Fog,
  GridHelper,
  Light,
  LineSegments,
  Material,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Quaternion,
  REVISION,
  Scene,
  SphereGeometry,
  Texture,
  TorusGeometry,
  Vector3,
  WebGLRenderer
};
