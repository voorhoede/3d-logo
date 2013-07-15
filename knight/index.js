(function(){

	var RED = {};

	var container, stats;

	var camera, scene, renderer;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;


	init();
	animate();


	function init() {

		container = document.createElement( 'div' );
		container.className = container.className += ' canvas';
		// create canvas
		document.body.appendChild( container );

		// add the camera
		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
		camera.position.z = 100;

		// scene = DOM Document equivalent
		scene = new THREE.Scene();

		// ambient light with color #101030
		var ambient = new THREE.AmbientLight( 0xeeeeee );
		scene.add( ambient );

		// directional light (like the sun) with color #ffeedd
		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 1, 1 ).normalize();
		directionalLight.intensity = 0.7;
		scene.add( directionalLight );

		// texture
		/*
		var texture = new THREE.Texture();

		var loader = new THREE.ImageLoader();
		loader.addEventListener( 'load', function ( event ) {

			texture.image = event.content;
			texture.needsUpdate = true;

		} );
		loader.load( 'inc/images/texture.jpg' );
		*/
		// model
		var materials = [
					new THREE.Material({
						// light
						specular: '#a9fcff',
						// intermediate
						color: '#00abb1',
						// dark
						emissive: '#fe4444',
						shininess: 100,
						side: THREE.DoubleSide
					  })
		];
		var loader = new THREE.OBJMTLLoader();
		loader.addEventListener( 'load', function ( event ) {

			var object = event.content;

			object.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {
					//child.material.map = texture;
					child.material.side = THREE.DoubleSide;
				}

			} );
			object.position.y = - 80;
			scene.add( object );

		});
		loader.load( 'models/semantischemoraalridder.obj' );


		// renderer?
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight);
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight);

	}

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) / 2;
		mouseY = ( event.clientY - windowHalfY ) / 2;

	}

	//

	function animate() {

		requestAnimationFrame( animate );
		render();

	}

	function render() {

		camera.position.x += ( mouseX - camera.position.x ) * .05;
		camera.position.y += ( - mouseY - camera.position.y ) * .05;

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}

}());