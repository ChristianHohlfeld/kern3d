import { Vector3 } from "../math/Vector3.js";

const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2 };

// Same gesture map as Three.js OrbitControls r128, which Voxel Shaper uses:
// left drag orbits, right drag or shift-drag pans, wheel dollies. No damping
// by default, so the camera follows the pointer instead of lagging behind it.
export class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.target = new Vector3();
    this.enableDamping = false;
    this.dampingFactor = 0.05;
    this.rotateSpeed = 1;
    this.panSpeed = 1;
    this.zoomSpeed = 1;
    this.minDistance = 0.5;
    this.maxDistance = 200;
    this.minPolar = 0.01;
    this.maxPolar = Math.PI - 0.01;
    this.enabled = true;

    this._spherical = { radius: 1, phi: 1, theta: 0 };
    this._delta = { radius: 0, phi: 0, theta: 0 };
    this._pan = new Vector3();
    this._state = STATE.NONE;
    this._pointer = { x: 0, y: 0 };
    this._pointers = new Map();
    this._scale = 1;

    this._offset = new Vector3();
    this._panRight = new Vector3();
    this._panUp = new Vector3();

    this._onPointerDown = (e) => this._pointerDown(e);
    this._onPointerMove = (e) => this._pointerMove(e);
    this._onPointerUp = (e) => this._pointerUp(e);
    this._onWheel = (e) => this._wheel(e);
    this._onContext = (e) => e.preventDefault();

    domElement.style.touchAction = "none";
    domElement.addEventListener("pointerdown", this._onPointerDown);
    domElement.addEventListener("wheel", this._onWheel, { passive: false });
    domElement.addEventListener("contextmenu", this._onContext);
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerUp);
    this.update();
  }

  update() {
    const offset = this._offset.copy(this.camera.position).sub(this.target);
    const spherical = this._spherical;
    spherical.radius = Math.max(offset.length(), 1e-6);
    spherical.theta = Math.atan2(offset.x, offset.z);
    spherical.phi = Math.acos(Math.min(1, Math.max(-1, offset.y / spherical.radius)));

    const damp = this.enableDamping ? this.dampingFactor : 1;
    spherical.theta += this._delta.theta * damp;
    spherical.phi += this._delta.phi * damp;
    this._delta.theta *= 1 - damp;
    this._delta.phi *= 1 - damp;
    this.target.addScaledVector(this._pan, damp);
    this._pan.multiplyScalar(1 - damp);

    spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, spherical.radius * this._scale));
    this._scale = 1;
    spherical.phi = Math.max(this.minPolar, Math.min(this.maxPolar, spherical.phi));

    const sinPhi = Math.sin(spherical.phi);
    offset.set(
      spherical.radius * sinPhi * Math.sin(spherical.theta),
      spherical.radius * Math.cos(spherical.phi),
      spherical.radius * sinPhi * Math.cos(spherical.theta),
    );
    this.camera.position.copy(this.target).add(offset);
    this.camera.lookAt(this.target);
    return this;
  }

  dispose() {
    const el = this.domElement;
    el.removeEventListener("pointerdown", this._onPointerDown);
    el.removeEventListener("wheel", this._onWheel);
    el.removeEventListener("contextmenu", this._onContext);
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerUp);
  }

  _pointerDown(e) {
    if (!this.enabled) return;
    this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.domElement.setPointerCapture?.(e.pointerId);
    this._pointer.x = e.clientX;
    this._pointer.y = e.clientY;
    if (this._pointers.size >= 2) this._state = STATE.DOLLY;
    else this._state = e.button === 2 || e.shiftKey || e.button === 1 ? STATE.PAN : STATE.ROTATE;
  }

  _pointerMove(e) {
    if (!this.enabled || !this._pointers.has(e.pointerId)) return;
    const prev = this._pointers.get(e.pointerId);
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    prev.x = e.clientX;
    prev.y = e.clientY;
    if (this._pointers.size >= 2) {
      this._pinch();
      return;
    }
    if (this._state === STATE.ROTATE) {
      const h = this.domElement.clientHeight || window.innerHeight || 1;
      this._delta.theta -= (2 * Math.PI * dx * this.rotateSpeed) / h;
      this._delta.phi -= (2 * Math.PI * dy * this.rotateSpeed) / h;
    } else if (this._state === STATE.PAN) {
      this._panBy(dx, dy);
    }
  }

  _pointerUp(e) {
    this._pointers.delete(e.pointerId);
    if (this._pointers.size < 2) this._pinchDist = 0;
    if (this._pointers.size === 0) this._state = STATE.NONE;
    else this._state = STATE.DOLLY;
  }

  _pinch() {
    const pts = [...this._pointers.values()];
    if (pts.length < 2) return;
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    if (this._pinchDist) {
      const ratio = this._pinchDist / Math.max(dist, 1);
      this._scale *= ratio ** this.zoomSpeed;
    }
    this._pinchDist = dist;
  }

  _panBy(dx, dy) {
    const el = this.domElement;
    const targetDistance = this._offset.copy(this.camera.position).sub(this.target).length();
    const fov = ((this.camera.fov || 50) * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * targetDistance;
    const factor = (height / (el.clientHeight || 1)) * this.panSpeed;
    const x = -dx * factor;
    const y = dy * factor;
    this.camera.updateMatrix();
    const te = this.camera.matrix.elements;
    // Column-major camera basis, same as Three.js pan.
    this._pan.x += te[0] * x + te[4] * y;
    this._pan.y += te[1] * x + te[5] * y;
    this._pan.z += te[2] * x + te[6] * y;
  }

  _wheel(e) {
    if (!this.enabled) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY) * this.zoomSpeed;
    this._scale *= delta > 0 ? 1.08 : 0.92;
  }
}
