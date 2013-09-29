var scene, camera, renderer, controls;
var highs;
var lohi;

function init() {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer();
	} else {
		Detector.addGetWebGLMessage();
	}
	
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);
	camera.position.z = 400;

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.SphereGeometry(200,50, 50);
	var texture = THREE.ImageUtils.loadTexture('img/world.jpg');
	var material = new THREE.MeshBasicMaterial({map: texture, transparent: true, opacity: 0.8});
	var world = new THREE.Mesh(geometry, material);

	var geometry2 = new THREE.SphereGeometry(201, 50, 50);
	var material2 = new THREE.MeshPhongMaterial({color: 0xDDDDDD, transparent: true, opacity: 0.05});
	var ball = new THREE.Mesh(geometry2, material2);

	/*var light = new THREE.AmbientLight(0x0000FF);
	light.position.z = 2200;*/
	var light2 = new THREE.AmbientLight(0xAAAAFF);
	
	pivot = new THREE.Object3D();
	pivot.add(world);
	pivot.add(ball);
	pivot.add(lohi);
	pivot.add(highs);

	scene = new THREE.Scene();
	scene.add(pivot);
	scene.add(light2);

	controls = new THREE.TrackballControls(camera);
	controls.minDistance = 300;
	controls.maxDistance = 1000;
	controls.domElement = document.body;
	window.addEventListener('resize', onWindowResize, false);
}

function addLoHi(coords) {
	var geometry = new THREE.BufferGeometry();
	var particles = coords.length*2;
	geometry.attributes = {
		position: {
			itemSize: 3,
			array: new Float32Array(particles * 3)
		}
	}
	var positions = geometry.attributes.position.array;
	var count = 0;
	for (var i = 0; i < coords.length; i++) {
		var lat = coords[i].lat;
		var lon = coords[i].lon;
		var phi = (lat - 90) * Math.PI / 180;
		var theta = (180 - (lon)) * Math.PI / 180;
		var x = 200 * Math.sin(phi) * Math.cos(theta);
		var y = 200 * Math.cos(phi);
		var z = 200 * Math.sin(phi) * Math.sin(theta);
		positions[count] = x*1.1;
		positions[count + 1] = y*1.1;
		positions[count + 2] = z*1.1;
		positions[count + 3] = x*1.4;
		positions[count + 4] = y*1.4;
		positions[count + 5] = z*1.4;
		count += 6;
	}
	geometry.computeBoundingSphere();
        
        var material = new THREE.ParticleBasicMaterial({color: 0xFF0000, size: 4, depthWrite: true, depthTest: true, fog: false, transparent: true, opacity: 0.7});
        material.alphaTest = 0.7;
        return new THREE.ParticleSystem(geometry, material);

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

	for (var i = 0; i < coords.length; i++) {
		var lat = coords[i].lat;
		var lon = coords[i].lon;
		var phi = (lat - 90) * Math.PI / 180;
   		var theta = (180 - (lon)) * Math.PI / 180;
		var x = 200 * Math.sin(phi) * Math.cos(theta);
		var y = 200 * Math.cos(phi);
		var z = 200 * Math.sin(phi) * Math.sin(theta);
		positions[count] = x*1.2;
		positions[count + 1] = y*1.2;
		positions[count + 2] = z*1.2;
		positions[count + 3] = x*1.3;
		positions[count + 4] = y*1.3;
		positions[count + 5] = z*1.3;
		count += 6;
	}

	geometry.computeBoundingSphere();
	return new THREE.Line(geometry, new THREE.LineBasicMaterial({color: 0x00FF00}), THREE.LinePieces);
}

function animate () {
	requestAnimationFrame(animate);
	controls.update(1);
	renderer.render(scene, camera);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
