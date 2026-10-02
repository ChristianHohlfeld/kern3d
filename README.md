# kern3d

Minimaler 3D-Kern für den Browser. Die öffentliche API folgt dem Three.js-Subset (`Scene`, `PerspectiveCamera`, `Mesh`, `WebGLRenderer`, …). Der Code ist eine eigene Implementierung, kein Fork von Three.js, keine Abhängigkeiten.

Revision `0.1.0`. Einbinden wie Three.js, über jsDelivr.

## CDN, ES-Module

```html
<script type="importmap">
{
  "imports": {
    "kern3d": "https://cdn.jsdelivr.net/gh/ChristianHohlfeld/kern3d@0.1.0/dist/kern3d.module.js"
  }
}
</script>
<script type="module">
  import * as THREE from "kern3d";

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(3, 2, 5);

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const sun = new THREE.DirectionalLight(0xffffff, 1);
  sun.position.set(4, 8, 2);
  scene.add(sun);

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshPhongMaterial({ color: 0xe85d4c, shininess: 40 }),
  );
  scene.add(mesh);

  renderer.setSize(innerWidth, innerHeight);
  renderer.render(scene, camera);
</script>
```

Direkt, ohne Import-Map:

```js
import * as THREE from "https://cdn.jsdelivr.net/gh/ChristianHohlfeld/kern3d@0.1.0/dist/kern3d.module.js";
```

## CDN, Script-Tag

```html
<script src="https://cdn.jsdelivr.net/gh/ChristianHohlfeld/kern3d@0.1.0/dist/kern3d.js"></script>
<script>
  const scene = new KERN.Scene();
  const camera = new KERN.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
  const renderer = new KERN.WebGLRenderer({ antialias: true });
</script>
```

`@main` zeigt immer auf den letzten Stand, `@0.1.0` ist fest. jsDelivr braucht nach dem ersten Push kurz, bis der Link live ist.

## Lokal

```bash
python3 -m http.server 8080
```

`http://localhost:8080/examples/` nutzt die Quellmodule. `examples/cdn.html` nutzt den CDN-Link. `file://` geht nicht.

## API

Dieselben Namen wie bei Three.js, soweit der Kern sie hat:

- Math: `Vector3`, `Euler`, `Quaternion`, `Matrix4`, `Color`
- Graph: `Object3D`, `Scene`
- Kameras: `PerspectiveCamera`, `OrthographicCamera`
- Geometrie: `BufferGeometry`, `BufferAttribute`, `BoxGeometry`, `PlaneGeometry`, `SphereGeometry`, `TorusGeometry`
- Material: `MeshBasicMaterial`, `MeshPhongMaterial`
- Licht: `AmbientLight`, `DirectionalLight` (max 4), `PointLight` (max 8)
- Renderer: `WebGLRenderer`, `Fog`, `Texture`
- `Mesh`, `LineSegments`, `OrbitControls`, `GridHelper`

Rotationen in Bogenmaß, Farben als Hex (`0xff8844`) oder `Color`. Eigene Shader und Keyframe-Animationen gibt es nicht. Transformiert wird im eigenen `requestAnimationFrame`.

Nicht enthalten: Loader, Postprocessing, Schatten, PBR, Audio, Physik, npm-Pflicht.

## Lizenz

MIT. Die Form der API ist von Three.js inspiriert (mrdoob, MIT). Dieser Quelltext enthält keinen Three.js-Code.
