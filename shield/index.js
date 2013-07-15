(function(THREE){

	var canvas;

	var camera, scene, renderer;

	var hemiLight, dirLight;

	var shieldL, shieldR, shieldV;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	init();
	animate();

	function init() {
		// add our canvas container
		canvas = document.createElement( 'div' );
		document.body.appendChild( canvas );

		// set our camera
		camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.z = 500;

		// scene
		scene = new THREE.Scene();

		// add a hemisphere (light & ground):
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.4 );
		//hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setRGB( 0,0,0 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );

		// add a directional light:
		dirLight = new THREE.DirectionalLight( 0xffeedd );
		dirLight.position.set( -100, 175, 100 );
		//dirLight.position.multiplyScalar( 50 );
		dirLight.intensity = 1.5;
		// make it cast a shadow:
		dirLight.castShadow = true;
		dirLight.shadowMapWidth = 2048;
		dirLight.shadowMapHeight = 2048;

		var d = 150;
		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;

		dirLight.shadowCameraNear = 1;
		dirLight.shadowCameraFar = 500;
		//dirLight.shadowBias = -0.0001;
		dirLight.shadowDarkness = 0.9;
		//dirLight.shadowCameraVisible = true;
		//dirLight.onlyShadow = true;
		scene.add( dirLight );

		// add ground surface plane:
		var groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
		var groundMat = new THREE.MeshLambertMaterial( { ambient: 0xffffff, color: 0xffffff } );
		groundMat.color.setHSL( 0.095, 0.1, 0.2 );

		var ground = new THREE.Mesh( groundGeo, groundMat );
		ground.rotation.x = -Math.PI/2;
		ground.position.y = -10;
		ground.receiveShadow = true;
		scene.add( ground );



		// add logo by loading our 3D model:
		var loader = new THREE.OBJMTLLoader();
		loader.addEventListener( 'load', function ( event ) {

			var object = event.content;
			// define parts of our model:
			shieldL = object.children[1];
			shieldR = object.children[0];
			shieldV = object.children[2];

			object.position.y = 0;

			// make sure all parts of the model cast & receive shadow:
			for (var i in object.children ) {
				var child = object.children[i];
				//console.log(child);
				child.castShadow = true;
				child.receiveShadow = true;
			}
			//console.log(object);
			scene.add( object );

		});
		loader.load( 'models/logo.obj', 'models/logo.mtl' );

		//RENDERER

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		canvas.appendChild( renderer.domElement );

		renderer.physicallyBasedShading = true;
		renderer.shadowMapEnabled = true;
		//renderer.shadowMapCullFace = THREE.CullFaceBack;

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	};

	function onDocumentMouseMove( event ) {
		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;
	};

	//

	function animate() {

		requestAnimationFrame( animate );
		animateLogo();
		render();

	}

	function render() {

		camera.position.x += ( mouseX - camera.position.x ) * .05;
		camera.position.y += ( - mouseY - camera.position.y ) * .05;

		camera.lookAt( scene.position );

		renderer.render( scene, camera );
	}

	// animate logo parts in sequence:
	var step = 0;
	function animateLogo(){

		if(typeof shieldL !== 'object' || typeof shieldR !== 'object' || typeof shieldV !== 'object' ){
			return;
		}
		
		step += 1;

		if(step < 100){
			shieldL.position.z += 1;
			shieldR.position.z -= 1;
		} else if (step < 460){
			shieldV.rotation.y += Math.PI /360 ;
		} else if (step < 560) {
			shieldL.position.z -= 1;
			shieldR.position.z += 1;
		} else if (step < 600) {
			// pause
		} else {
			step = 0;
		}
	}

}(THREE));