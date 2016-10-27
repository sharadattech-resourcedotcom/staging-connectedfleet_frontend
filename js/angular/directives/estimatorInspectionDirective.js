ngApp.directive('estimatorInspection', function($window, $uibModal){
	return {
		restrict: 'E',
		scope: {
			inspection: "="
		},
		templateUrl: '/templates/directives/estimatorInspectionDirectiveTpl.html',
		link: function (scope, elem, attrs) {
			var carPath = BACKEND_HOST + "/car_exterior.png";
			var vanPath = BACKEND_HOST + "/van_exterior.png";
			scope.imgsrc = URLS.damage_item_src;
			scope.checklist = []
			scope.totalCost = {'cost': 0};

			_.each(scope.inspection.damage_collections, function(collection){
				scope.totalCost.cost += collection.repair_price;
			})
			
			_.each(scope.inspection.check_list, function(value, key){
				scope.checklist.push([key, value]);
			})

			exteriorCanvas = document.getElementById('exterior');
			exteriorCtx = exteriorCanvas.getContext('2d');
			exteriorImage = new Image();
			exteriorImage.src = scope.inspection.vehicle_type == 'VAN' ? vanPath : carPath;

			exteriorImage.onload = function() {
				exteriorCanvas.width = exteriorImage.width;
				exteriorCanvas.height = exteriorImage.height;
		        exteriorCtx.drawImage(exteriorImage,0,0);
		        for (var i in scope.inspection.damage_collections) {
	        		scope.inspection.damage_collections[i].X = exteriorCanvas.width * (scope.inspection.damage_collections[i].x_percent/100);
	        		scope.inspection.damage_collections[i].Y = exteriorCanvas.height * (scope.inspection.damage_collections[i].y_percent/100);
					radius = 10;
					exteriorCtx.beginPath();
					exteriorCtx.arc(scope.inspection.damage_collections[i].X, scope.inspection.damage_collections[i].Y, radius, 0, 2 * Math.PI, false);
					exteriorCtx.fillStyle = 'green';
					exteriorCtx.fill();
					exteriorCtx.lineWidth = 2;
					exteriorCtx.strokeStyle = '#003300';
					exteriorCtx.stroke();
					exteriorCtx.fillStyle = 'black';
					var font = "bold 12px serif";
					exteriorCtx.font = font;
					exteriorCtx.textBaseline = "top";
					var value = parseInt(i) + 1;
					exteriorCtx.fillText(value ,scope.inspection.damage_collections[i].X - radius/2+2, scope.inspection.damage_collections[i].Y - radius/2-2);
				};
				//exteriorCanvas.addEventListener("mousedown", scope.exteriorMouseClick, false);
		     };
		}
	}
});