//Initilise angular app
var angular = angular;
var app = angular.module('app', ['ngRoute', 'ng-contentful']);

app.config(function($routeProvider, contentfulClientProvider){
	$routeProvider
		.when('/', {
			templateUrl: "src/html/home.html",
			controller: 'mainController'
		})

		.when('/styleguide', {
			templateUrl: "src/html/styleguide.html",
			controller: 'styleguideController'
		})

		.when('/documentation', {
			templateUrl: "src/html/documentation.html",
			controller: 'documentationController'
		})

		.when('/design/:id', {
			templateUrl: "src/html/design.html",
			controller: 'designController'
		})

		.otherwise({
			redirectTo: '/'
		});

	 contentfulClientProvider.setSpaceId('qj4662rfubip');
	 contentfulClientProvider.setAccessToken('c35b82ea8c5dad62950fa76f7a3c05459a8c4166b4d1ecdf7e52048757d6a50c');
});

//the main controller
app.controller('mainController', function($scope, contentfulClient){
	//load list in from Contentful
	contentfulClient.entries().then(function(entries){
		  $scope.entries = entries;
		  // console.log($scope.entries);
	});

	//filtering for the list
	$scope.listFilter = "";
	$scope.filterList = function(filter){
		$scope.listFilter = filter;
	};

	//return the index of an object
	$scope.indexOf = function(item){
		var x = $scope.entries.indexOf(item);
		return x;
	};
});

app.controller('designController', function($scope, contentfulClient, $routeParams){
	$scope.params = $routeParams;
	contentfulClient.entries().then(function(entries){
		$scope.entries = entries;
		$scope.params = $routeParams.id;
		$scope.pageLoaded = $scope.entries[$scope.params];


		//THIS IS SOME SERIOUS DATE BUSINESS ----Look away, it's magic----
		var date = new Date($scope.pageLoaded.sys.updatedAt);
		var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		
		var dateSuffix = function(date){
			if(date === 1 || date === 21 || date === 31){
				return "st";
			}
			else if(date === 2 || date === 22){
				return "nd";
			}
			else if(date === 3){
				return "rd";
			}
			else {
				return "th";
			}
		};

		//Spit out the date and time
		$scope.dateUpdated = days[date.getDay()]+", "+date.getDate()+dateSuffix(date.getDate())+" "+months[date.getMonth()]+", "+date.getFullYear();
		$scope.timeUpdated = date.getUTCHours()+":"+date.getMinutes();
		
		//fix the grammar on revision(s)
		$scope.revision = function(){
			var r = $scope.pageLoaded.sys.revision;
			if(r > 1){
				r += " revisions";
			}
			else {
				r += " revision";
			}
			return r;
		};

		//assign a variable based on if the page is approved by client
		$scope.clientApproved = $scope.pageLoaded.fields.clientApproved;
	});
	
});

app.controller('documentationController', function($scope){
	//design scope
	$scope.designTest = "scope works in Design";

});

app.controller('styleguideController', function($scope){
	//design scope
	$scope.designTest = "scope works in Design";

});

