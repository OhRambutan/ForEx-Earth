var scene, camera, renderer, controls;
init();
animate();

function init() {
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer();
	} else {
		Detector.addGetWebGLMessage();
	}
	
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.SphereGeometry(500,50,50);
	var texture = THREE.ImageUtils.loadTexture('img/world.jpg');

	var material = new THREE.MeshBasicMaterial({map : texture});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 1000;

	controls = new THREE.TrackballControls(camera);
	controls.domElement = document.body;
	window.addEventListener('resize', onWindowResize, false);
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
