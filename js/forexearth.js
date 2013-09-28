var scene, camera, renderer, controls;
init();
animate();

function init() {
	if (Detector.webgl) {
    var container = document.getElementById('earth');
    document.body.appendChild(container);
		renderer = new THREE.WebGLRenderer();
    container.style.position = "absolute";
    container.width = 1224;
    container.height = 768;
    container.appendChild(renderer.domElement);
	} else {
		Detector.addGetWebGLMessage();
	}

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 2000);

	renderer.setClearColor(0x000000, 1);
	document.body.appendChild(renderer.domElement);

	var geometry = new THREE.SphereGeometry(500,50,50);
	var texture = THREE.ImageUtils.loadTexture('world.jpg');

	var material = new THREE.MeshBasicMaterial({map : texture});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	var light = new THREE.PointLight();
	scene.add(light);

	camera.position.z = 1000;

	controls = new THREE.TrackballControls(camera);
	controls.minDistance = 600;
	controls.maxDistance = 1500;
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
