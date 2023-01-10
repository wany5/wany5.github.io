		
	var SCREEN_WIDTH = $('#winter').width();
	var SCREEN_HEIGHT = $('#winter').height();
	var container;

	var particle;

	var camera;
	var scene;
	var renderer;

	var mouseX = 0;
	var mouseY = 0;

	var windowHalfX = $('#winter').width() / 2;
	var windowHalfY = $('#winter').height() / 2;

	var particles = []; 
	var particleImage = new Image(); //THREE.ImageUtils.loadTexture( "images/webdesign-ingolstadt/snowflake.png" );
	particleImage.src = 'images/werbeagentur/snowflake.png';
	 var snowInterval = null;

	//  console.log(particleImage)

	//  console.log('winter');

	//  snowfall();


	function snowfall() {
// return false;
		SCREEN_WIDTH = $('#winter').width();
		SCREEN_HEIGHT = $('#winter').height();
		windowHalfX = $('#winter').width() / 2;
		windowHalfY = $('#winter').height() / 2;


		container = jQuery('<div>').attr('id','snow');
		container.appendTo('#winter');
		// document.getElementById('winter').appendChild(container);

		camera = new THREE.PerspectiveCamera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		camera.position.z = 1000;

		scene = new THREE.Scene();
		scene.add(camera);
			
		renderer = new THREE.CanvasRenderer();
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
			
		for (var i = 0; i < 150; i++) { // Number of flakes

			particle = new Particle3D( material);
			particle.position.x = Math.random() * 2000 - 1000;
			particle.position.y = Math.random() * 2000 - 1000;
			particle.position.z = Math.random() * 2000 - 1000;
			particle.scale.x = particle.scale.y =  1;
			scene.add( particle );
			
			particles.push(particle); 
		}

		container.append( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
//		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
//		document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		
		snowInterval = setInterval( loop, 1000 / 60 );
		
	}
	function stopSnowfall() {
		clearInterval(snowInterval);	
		jQuery('#winter #snow').remove();
	}

	function onDocumentMouseMove( event ) {

		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}

	function onDocumentTouchStart( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	function onDocumentTouchMove( event ) {

		if ( event.touches.length == 1 ) {

			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	//

	function loop() {

	for(var i = 0; i<particles.length; i++)
		{

			var particle = particles[i]; 
			particle.updatePhysics(); 

			with(particle.position)
			{
				if(y<-1000) y+=2000; 
				if(x>1000) x-=2000; 
				else if(x<-1000) x+=2000; 
				if(z>1000) z-=2000; 
				else if(z<-1000) z+=2000; 
			}				
		}

		camera.position.x += ( mouseX - camera.position.x ) * 0.05;
		camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
		camera.lookAt(scene.position); 

		renderer.render( scene, camera );

		
	}

		

