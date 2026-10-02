import { Vector3 } from "../math/Vector3.js";
import { Euler } from "../math/Euler.js";
import { Quaternion } from "../math/Quaternion.js";
import { Matrix4 } from "../math/Matrix4.js";

let _id = 0;

export class Object3D {
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
    // updateMatrix() rebuilds the quaternion from Euler. The extraction has to
    // round-trip or the next render throws away lookAt and the orbit drifts.
    this.rotation.setFromQuaternion(this.quaternion);
  }
}

const _target = new Vector3();
const _eye = new Vector3();

export class Scene extends Object3D {
  constructor() {
    super();
    this.isScene = true;
    this.background = null;
    this.fog = null;
  }
}
