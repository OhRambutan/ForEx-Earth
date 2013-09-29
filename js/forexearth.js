var scene, camera, renderer, controls;
var highs;

var Shaders = {
  'earth' : {
    uniforms: {
      'texture': { type: 't', value: null }
    },
    vertexShader: [
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        'vNormal = normalize( normalMatrix * normal );',
        'vUv = uv;',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D texture;',
      'varying vec3 vNormal;',
      'varying vec2 vUv;',
      'void main() {',
        'vec3 diffuse = texture2D( texture, vUv ).xyz;',
        'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );',
        'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );',
        'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );',
      '}'
    ].join('\n')
  },

  'atmosphere' : {
    uniforms: {},
    vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'vNormal = normalize( normalMatrix * normal );',
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vNormal;',
      'void main() {',
        'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
        'gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 ) * intensity;',
      '}'
    ].join('\n')
  }
};

var EARTH_RADIUS = 200;

function init() {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer();
	} else {
		Detector.addGetWebGLMessage();
	}
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
	camera.position.z = 1000;

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.SphereGeometry(EARTH_RADIUS, 40, 30);
	var texture = THREE.ImageUtils.loadTexture('img/world.jpg');
	shader = Shaders['earth'];
	uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    	uniforms['texture'].value = THREE.ImageUtils.loadTexture('img/world.jpg');

	
	material = new THREE.ShaderMaterial({

          uniforms: uniforms,
          vertexShader: shader.vertexShader,
          fragmentShader: shader.fragmentShader

        });

	var world = new THREE.Mesh(geometry, material);
	
	pivot = new THREE.Object3D();
	pivot.add(world);
	pivot.add(highs);

	scene = new THREE.Scene();
	scene.add(pivot);

	controls = new THREE.TrackballControls(camera);
	controls.minDistance = 200;
	controls.maxDistance = 1500;
	controls.domElement = document.body;
	window.addEventListener('resize', onWindowResize, false);
}

function addLines(coords) {
	var geometry = new THREE.BufferGeometry();
	var endpoints = coords.length * 2;
	geometry.attributes = {
		position: {
			itemSize: 3,
			array: new Float32Array(endpoints * 3)
		}
	}

	var positions = geometry.attributes.position.array;
	var count = 0;
	var SCALE = 0.0001;

	for (var i = 0; i < coords.length; i++) {
		var lat = coords[i].lat;
		var lon = coords[i].lon;
    positions = Float32Concat(positions, getCoords(lat, lon, 1.0));
    positions = Float32Concat(positions, getCoords(lat, lon, 1.5));
	}

	geometry.computeBoundingSphere();
	return new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x00FF00}), THREE.LinePieces);

}

function animate () {
	requestAnimationFrame(animate);
	controls.update(1);
	renderer.render(scene, camera);
};

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};

/**
 * offset = 1.0 sets the point on the surface of earth.
 *        = 2.0 sets the point EARTH_RADIUS away from surface of earth.
 *
 * returns a list [x, y, z]
 */
function getCoords(latitude, longitude, offset) {
  var phi = (latitude - 90) * Math.PI / 180;  
  var theta = (180 - longitude) * Math.PI / 180;

  var x = offset * EARTH_RADIUS * Math.sin(phi) * Math.cos(theta);
  var y = offset * EARTH_RADIUS * Math.cos(phi);
  var z = offset * EARTH_RADIUS * Math.sin(phi) * Math.sin(theta);

  return [x, y, z]
}

/**
 * Takes two points asTHREE.vector3, draws them on the scene
 */
function drawLine(pointA, pointB) {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(pointA);
  geometry.vertices.push(pointB);

  var material = new THREE.LineBasicMaterial({
    color: 0x0000ff
  });

  var line = new THREE.Line(geometry, material);
}

function Float32Concat(first, second) {
  var firstLength = first.length;
  var result = new Float32Array(firstLength + second.length);

  result.set(first);
  result.set(second, firstLength);

  return result;
}
