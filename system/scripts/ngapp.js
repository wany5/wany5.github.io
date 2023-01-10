angular.module( 'BeckettApp', [])

.run( function run () {})

.controller( 'ReferenzenCtrl', function AppCtrl ( $scope, $http, $timeout ) {
	$scope.allReferenzen = [];
	$scope.chunkedReferenzen = [];
	$scope.page = 0;

	var fancies = [];
	$scope.referenzen = [];

	$scope.labels = {
		'GALERIE': {
			de: 'Galerie',
			en: 'Gallery',
			by: 'Buidl'
		},
		'VISIT': {
			de: 'Website besuchen',
			en: 'Visit website',
			by: 'Website bsuacha'
		},
		'LEISTUNGEN': {
			de: 'Leistungsüberblick',
			en: 'Our services',
			by: 'Leisdungsüberblig'
		},
		'OTHERS': {
			de: 'Weitere Projekte',
			en: 'Further projects',
			by: 'Weidere Projekte'
		},
		'READMORE': {
			de: 'Projekt ansehen',
			en: 'View project',
			by: 'Projekt oschaun'
		}
	};


	$http.get('index.php?a=getReferencesJson&').then( function(res) {
		$scope.allReferenzen = res.data;

		$scope.chunkedReferenzen = _.chunk( $scope.allReferenzen ,27);
		$scope.referenzen = $scope.chunkedReferenzen[0];

		_.forEach($scope.allReferenzen, function(ref) {
			ref.isActive = false;
			fancies.push({id: ref.id, href: '#ref_'+ref.id, title: ref.title});
		});

	});

	$scope.switch = function(activeRef) {
		$scope.page = activeRef;



		$scope.next = (activeRef == $scope.allReferenzen.length -1) ? 0 : activeRef + 1;
		$scope.prev = (activeRef === 0) ? $scope.allReferenzen.length -1 : activeRef - 1;

		jQuery('.doors .left-door .inner').fadeOut(500);
		jQuery('.doors .right-door .inner').fadeOut(500, function() {
			
			$scope.activeRef = $scope.allReferenzen[activeRef];
			$timeout(function() {
			    $scope.$apply();

			    jQuery('.doors .left-door .inner').css({'background-image': 'url(images/portfolio/'+$scope.activeRef.image+'/'+$scope.activeRef.image+'.jpg)'});
				jQuery('.doors .right-door .inner').fadeIn(500);
				jQuery('.doors .left-door .inner').delay(600).fadeIn(800);
			}, 50);
			
		});
	};


	$scope.switchInner = function(i) {
		$scope.activeImg = i;
		jQuery('.doors .left-door .inner').fadeOut(400, function() {
			var img = (i == 1) ? $scope.activeRef.image: $scope.activeRef['image'+i];
			$scope.imgText = (i == 1) ? '': $scope.activeRef['image'+i+'_text'];


			$timeout(function() {
			    $scope.$apply();
			    jQuery('.doors .left-door .inner').css({'background-image': 'url(images/portfolio/'+$scope.activeRef.image+'/'+img+'.jpg)'});
				jQuery('.doors .left-door .inner').delay(400).fadeIn(500);
			}, 50);
			
		});
	};

	$scope.preload = function(id) {
		var activeRef = _.find($scope.allReferenzen, {id: id});
		var img  = new Image();
	    img.src = 'images/portfolio/'+activeRef.image+'/'+activeRef.image+'.jpg';
	};
	$scope.preload2 = function(id) {
		var activeRef = $scope.allReferenzen[parseInt(id,10)];
		var img  = new Image();
	    img.src = 'images/portfolio/'+activeRef.image+'/'+activeRef.image+'.jpg';
	};

	$scope.closeDoors = function() {
		var menu = jQuery('.doors');
		if (menu.hasClass('in')) {
			setTimeout(function (){
				menu.css('z-index', '-1');
			}, 600); // how long do you want the delay to be? 	
			menu.removeClass('in');
		}
		angular.element(window).off('keydown');
	};

	$scope.openDoors = function(id) {
		var menu = jQuery('.doors');

		var tmp;
		var activeRef = _.findIndex($scope.allReferenzen, {id: id});

		$scope.next = (activeRef == $scope.allReferenzen.length -1) ? 0 : activeRef + 1;
		$scope.prev = (activeRef === 0) ? $scope.allReferenzen.length -1 : activeRef - 1;
		$scope.activeImg = 1;
		
		$scope.allReferenzen[parseInt(activeRef,10)].isActive = true;
		if( (tmp = $scope.allReferenzen[parseInt(activeRef,10)+1]) ) {
			tmp.isActive = true;
		}
		if( (tmp = $scope.allReferenzen[parseInt(activeRef,10)-1]) ) {
			tmp.isActive = true;
		}


		$scope.activeRef = $scope.allReferenzen[parseInt(activeRef,10)];
		$scope.imgText = '';
		jQuery('.doors .left-door .inner').css({'background-image': 'url(images/portfolio/'+$scope.activeRef.image+'/'+$scope.activeRef.image+'.jpg)'});
	
		$timeout(function() {
		    $scope.$apply();
		}, 10);
		
		if (!menu.hasClass('in')) {
			menu.css('z-index', '9999');
			menu.addClass('in');
		}

		angular.element(window).on('keydown', function(e) {
          if (e.keyCode === 27) {
            $scope.closeDoors();
          }
          else if (e.keyCode === 39) {
            $scope.switch($scope.next);
          }
          else if (e.keyCode === 37) {
            $scope.switch($scope.prev);
          }
        });
	};



})





.controller( 'DesignCtrl', function AppCtrl ( $scope, $http, $timeout, $sce ) {

	$scope.allItems = [];

	$scope.labels = {
		'OTHERS': {
			de: 'Weitere Projekte',
			en: 'Further projects',
			by: 'Weidere Projekte'
		}
	};

	$http.get('index.php?a=getReferences2Json&').then( function(res) {
		$scope.allItems = _.groupBy( res.data ,'category');
	});
	$scope.closeSlideIn = function() {
		var menu = jQuery('.doors2');
		if (menu.hasClass('in')) {
			setTimeout(function (){
				menu.css('z-index', '-1');
			}, 600); // how long do you want the delay to be? 	
			menu.removeClass('in');
		}
		$scope.refCat = null;
	};
	
	$scope.refCat = null;
	$scope.openSlideIn = function(id) {
		$scope.refCat = id;
		var menu = jQuery('.doors2');
		var activeRef = 0;
		$scope.next = (activeRef == $scope.allItems[$scope.refCat].length -1) ? 0 : activeRef + 1;
		$scope.prev = (activeRef === 0) ? $scope.allItems[$scope.refCat].length -1 : activeRef - 1;

		$scope.activeItem = $scope.allItems[$scope.refCat][activeRef];
		$scope.activeItem.title = $sce.trustAsHtml($scope.activeItem['title_'+$scope.lang]);
		$scope.activeItem.ort = $sce.trustAsHtml($scope.activeItem['ort_'+$scope.lang]);

		$timeout(function() {
		    $scope.$apply();
		}, 10);
		
		if (!menu.hasClass('in')) {
			menu.css('z-index', '9999');
			menu.addClass('in');
		}
	};

	$scope.switch = function(activeRef) {
		$scope.next = (activeRef == $scope.allItems[$scope.refCat].length -1) ? 0 : activeRef + 1;
		$scope.prev = (activeRef === 0) ? $scope.allItems[$scope.refCat].length -1 : activeRef - 1;

		jQuery('.doors2 .right-door .inner').fadeOut(500, function() {
			$scope.activeItem = $scope.allItems[$scope.refCat][activeRef];
			$scope.activeItem.title = $sce.trustAsHtml($scope.activeItem['title_'+$scope.lang]);
                	$scope.activeItem.ort = $sce.trustAsHtml($scope.activeItem['ort_'+$scope.lang]);
			$timeout(function() {
			    $scope.$apply();
			    jQuery('.doors2 .right-door .inner').fadeIn(500);
			}, 50);
			
		});
	};
})


.controller( 'TestimonialsCtrl', function AppCtrl ( $scope, $http, $timeout, $sce ) {
	var testimonials = [];
	$scope.testimonial = null;

	$http.get('index.php?a=getTestimonialsJson&').then( function(res) {
		testimonials = res.data;
		$scope.testimonial = testimonials.shift();
		$scope.testimonial.text = $sce.trustAsHtml($scope.testimonial['text_'+$scope.lang]);
		$scope.testimonial.firma = $sce.trustAsHtml($scope.testimonial['firma_'+$scope.lang]);
		
	});	

	var t;

	$scope.next = function() {
		angular.element('.testimonial').fadeOut(600, 'swing', function(){
			if($scope.testimonial) {
				testimonials.push($scope.testimonial);
			}
			$scope.testimonial = testimonials.shift();
			$scope.testimonial.text = $sce.trustAsHtml($scope.testimonial['text_'+$scope.lang]);
			$scope.testimonial.firma = $sce.trustAsHtml($scope.testimonial['firma_'+$scope.lang]);
			angular.element('.testimonial').delay(100).fadeIn(800);
			$scope.$apply();
		});
		$timeout.cancel(t);
		t = $timeout( function() {
			$scope.next();
		}, 10000);
	};
	$scope.prev = function() {
		angular.element('.testimonial').fadeOut(600, 'swing', function(){
			if($scope.testimonial) {
				testimonials = [$scope.testimonial].concat(testimonials);
			}
			$scope.testimonial = testimonials.pop();
			$scope.testimonial.text = $sce.trustAsHtml($scope.testimonial['text_'+$scope.lang]);
			$scope.testimonial.firma = $sce.trustAsHtml($scope.testimonial['firma_'+$scope.lang]);
			angular.element('.testimonial').delay(100).fadeIn(800);
			$scope.$apply();
			$timeout.cancel(t);
			t = $timeout( function() {
				$scope.next();
			}, 10000);
		});
	};

	t = $timeout( function() {
		$scope.next();
	}, 10000);
})
;
