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

	var geometry = new THREE.SphereGeometry(200,40,30);
	var texture = THREE.ImageUtils.loadTexture('img/world.jpg');
	//var material = new THREE.MeshBasicMaterial({map : texture});
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


	/*for (var i = 0; i < coords.length; i++) {
		var x = Math.floor(coords[i].X * SCALE);
		var y = Math.floor(coords[i].Y * SCALE);
		var z = Math.floor(coords[i].Z * SCALE);
		console.log(x);
		console.log(y);
		console.log(z);
		positions[count] = 0;
		positions[count + 1] = 0;
		positions[count + 2] = 0;
		positions[count + 3] = x;
		positions[count + 4] = y;
		positions[count + 5] = z;
		count += 6;
	}*/
	var lat = 0;
	var lon = 0; 
	for (var i = 0; i < 90; i++) {
		var phi = (lat) * Math.PI / 180;
    		var theta = (lon + i) * Math.PI / 180;
		var x = 400 * Math.sin(phi) * Math.cos(theta);
		var y = 400 * Math.cos(phi);
		var z = 400 * Math.sin(phi) * Math.sin(theta);
		console.log(x);
		console.log(y);
		console.log(z);
		positions[count] = 0;
		positions[count + 1] = 0;
		positions[count + 2] = 0;
		positions[count + 3] = x;
		positions[count + 4] = y;
		positions[count + 5] = z;
		count += 6;
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
}
