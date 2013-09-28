if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {

  var years = ['1990','1995','2000'];
  var container = document.getElementById('globe');
  var globe = new DAT.Globe(container);
  console.log(globe);

  TWEEN.start();

  globe.createPoints();
  globe.animate();
}
