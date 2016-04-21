ngApp.directive('damageCollections', function($window, $uibModal){
	return {
		restrict: 'E',
		scope: {
			collections: "="
		},
		templateUrl: '/templates/directives/damageCollectionsDirectiveTpl.html',
		link: function (scope, elem, attrs) {
			scope.vehicleExteriorPath = BACKEND_HOST + "/vehicle_exterior.png";
			scope.vehicleInteriorPath = BACKEND_HOST + "/vehicle_interior.png";
			scope.tyresCrossPath = BACKEND_HOST + "/tyres_cross.png";
			scope.clickedCollection = {};
			scope.tyresCollection = {};
			scope.imgsrc = URLS.damage_item_src;
			
			scope.exteriorMouseClick = function(event){
				console.log($(document).scrollTop());
		    	for (var i in scope.collections) {
		        	if(scope.collections[i].collection_type == 'EXTERIOR' && scope.clickCheck(event.offsetX, event.offsetY, i)) {
		        		scope.$apply(function(){
					       scope.clickedCollection = scope.collections[i];
					    });
				        showModal();
					};
				};
		    };

		    scope.interiorMouseClick = function(event){
		    	console.log($(document).scrollTop());
		    	for (var i in scope.collections) {
		        	if(scope.collections[i].collection_type == 'INTERIOR' && scope.clickCheck(event.offsetX, event.offsetY, i)) {
		        		scope.$apply(function(){
					       scope.clickedCollection = scope.collections[i];
					    });
				        showModal();
					};
				};
		    };

		    scope.clickCheck = function(X, Y, i){
		    	dot = {X: scope.collections[i].X, Y: scope.collections[i].Y};
		    	if (dot.X+5 >= X && dot.X-5 <= X && dot.Y+5 >= Y && dot.Y-5 <= Y) {
		    		return true;
		    	} else {
		    		return false;
		    	};
		    };	

			function showModal() {
				// $(elem).find('#modal-content').css('display', 'block');
				// modal.modal('show');	
				var modalInstance = $uibModal.open({
				    animation: true,
				    templateUrl: 'templates/modals/damagesCollectionModalTpl.html',
	          		controller: 'DamagesCollectionModalController',
				    size: 'lg',
				    backdrop: true,
				    resolve: {
				        collection: function () {
				          return scope.clickedCollection;
				        }
				    }
			    });
			};

			exteriorCanvas = document.getElementById('exterior');
			exteriorCtx = exteriorCanvas.getContext('2d');
			exteriorImage = new Image();
			exteriorImage.src = scope.vehicleExteriorPath;

			interiorCanvas = document.getElementById('interior');
			interiorCtx = interiorCanvas.getContext('2d');
			interiorImage = new Image();
			interiorImage.src = scope.vehicleInteriorPath;

			exteriorImage.onload = function() {
				exteriorCanvas.width = exteriorImage.width;
				exteriorCanvas.height = exteriorImage.height;
		        exteriorCtx.drawImage(exteriorImage,0,0);
		        for (var i in scope.collections) {
		        	if(scope.collections[i].collection_type == 'EXTERIOR') {
		        		scope.collections[i].X = exteriorCanvas.width * (scope.collections[i].x_percent/100);
		        		scope.collections[i].Y = exteriorCanvas.height * (scope.collections[i].y_percent/100);
						radius = 10;
						exteriorCtx.beginPath();
						exteriorCtx.arc(scope.collections[i].X, scope.collections[i].Y, radius, 0, 2 * Math.PI, false);
						exteriorCtx.fillStyle = 'green';
						exteriorCtx.fill();
						exteriorCtx.lineWidth = 2;
						exteriorCtx.strokeStyle = '#003300';
						exteriorCtx.stroke();
					};
					if(scope.collections[i].collection_type == 'TYRES') {
						scope.$apply(function(){
							scope.tyresCollection = scope.collections[i];
						});
					};
				};
				exteriorCanvas.addEventListener("mousedown", scope.exteriorMouseClick, false);
		     };

		    interiorImage.onload = function() {
				interiorCanvas.width = interiorImage.width;
				interiorCanvas.height = interiorImage.height;
		        interiorCtx.drawImage(interiorImage,0,0);
		        for (var i in scope.collections) {
		        	if(scope.collections[i].collection_type == 'INTERIOR') {
				        scope.collections[i].X = interiorCanvas.width * (scope.collections[i].x_percent/100);
		        		scope.collections[i].Y = interiorCanvas.height * (scope.collections[i].y_percent/100);
						radius = 10;
						interiorCtx.beginPath();
						interiorCtx.arc(scope.collections[i].X, scope.collections[i].Y, radius, 0, 2 * Math.PI, false);
						interiorCtx.fillStyle = 'green';
						interiorCtx.fill();
						interiorCtx.lineWidth = 2;
						interiorCtx.strokeStyle = '#003300';
						interiorCtx.stroke();
					};
				};
				interiorCanvas.addEventListener("mousedown", scope.interiorMouseClick, false);
		    };
		}
	}
});