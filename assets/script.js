const version = '?v=20170901';
const clientid = '&client_id=T51NFIX5BC4UD3VYA5A4DOMOWNUSYUYZ0FAXEKUKALSP1HS0';
const clientSecret = '&client_secret=JGRBTMWO5PWR1PSQ4LAM5LIZFQYPFOSUBRVXGYIM4PN2G2WO';
const key = version + clientid + clientSecret;

var map;
var directionsService;
var directionsLayerGroup;

var categories = {
	food: '4d4b7105d754a06374d81259',
	transport: '52f2ab2ebcbc57f1066b8b4f',
	accommodation: '4bf58dd8d48988d1fa931735',
	shopping: '4bf58dd8d48988d1fd941735',
	banks: '4bf58dd8d48988d10a951735',
	activities: '4d4b7104d754a06370d81259'
}


var icons = {
	food: 'assets/images/purpledot.svg',
	transport: 'assets/images/bluedot.svg',
	accommodation: 'assets/images/lightbluedot.svg',
	shopping: 'assets/images/orangedot.svg',
	banks: 'assets/images/yellowdot.svg',
	activities: 'assets/images/pinkdot.svg'
}


var layers = {
	food: '',
	transport: '',
	accommodation: '',
	shopping: '',
	banks: '',
	activities: ''
}


$(function(){
	//map
	let center = [-36.848953,174.762573];
	map = L.map('map').setView(center,15);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2FpdGxpbnBhbG1lciIsImEiOiJjamtrZXlsaW4xcHE5M3FtbDEwbzBqdG92In0.RY6_Y65ouMFFFrT6B6Mvww').addTo(map);


	layers.food = L.layerGroup().addTo(map);
	layers.transport = L.layerGroup().addTo(map);
	layers.accommodation = L.layerGroup().addTo(map);
	layers.shopping = L.layerGroup().addTo(map);
	layers.banks = L.layerGroup().addTo(map);
	layers.activities = L.layerGroup().addTo(map);


	//switching of layers
	$('.fa-search').on('click',function(){
		app.currentLayer='layer1';
	});
	$('.fa-map-marker-alt').on('click',function(){
		app.currentLayer='layer2';
	});
	$('.modal-footer button').on('click',function(){
		app.currentLayer='layer3';
	});

	let ll = '-36.848953,174.762573';

	//get venues - foursquare api
	 getAllVenues(ll);

	//filter categories
	$('[data-filter]').on('click',function(){
		app.currentLayer='layer2';

		var filter = $(this).data('filter');
		
		if($(this).data('selected') == 'no'){
			hideAllLayers()
			map.addLayer(layers[filter]);
			$(this).data('selected','yes');
		}else{
			showAllLayers();
			$('.filter-tabs i').data('selected','no'); 
		}
		
	});

	//google map directions

	directionsLayerGroup = L.layerGroup().addTo(map);

	$('#map').on('click','.direction',function(e){
		e.preventDefault();


		if (navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(position=>{
				var myLocation = {
					lat:position.coords.latitude,
					lng:position.coords.longitude
				};

				//create a request for directions

				var destinationLatLng = {
					lat: $(this).data('lat'),
					lng: $(this).data('lng'),
				};
				var request = {
			          origin: myLocation,
			          destination: destinationLatLng,
			          travelMode: 'WALKING'
			        };
				//ask directionsService to fulfill your request
				directionsService.route(request,function(response,status){

					directionsLayerGroup.clearLayers();

					var path = response.routes["0"].overview_path;

					var polyline = _(path).map(function(item){
						return {lat:item.lat(),lng:item.lng()};
					});

					L.polyline(polyline,{
						color:'tomato',
						weight:5
					}).addTo(directionsLayerGroup);
					
				});
			});
		}
	});	




});

function getVenues(location,category,icon,layer){

	let placesUrl = 'https://api.foursquare.com/v2/venues/search'+key+'&ll='+location+'&categoryId='+category;

	$.ajax({
		url:placesUrl,
		dataType:'jsonp',
		success:function(res){
			var data = res.response.venues;

			console.log(data);

			var venues = _(data).map(function(item){
				return {
					latlng:{lat:item.location.lat,lng:item.location.lng},
					name:item.name,
					venueid:item.id
				};
			});

			// console.log(venues);

			_(venues).each(function(venue){

				let placeIcon = L.icon({
					iconUrl:icon,
					iconSize:[30,30]
				});
				let marker = L.marker(venue.latlng,{icon:placeIcon}).addTo(layer);

				marker.venueid = venue.venueid;

				marker.on('click',function(){
					var venueUrl = 	'https://api.foursquare.com/v2/venues/'+
					this.venueid+key;
					
					$.ajax({
						url:venueUrl,
						dataType:'jsonp',
						success:function(res){
							console.log(res);
							app.currentVenue = res.response.venue;

							$('.modal').modal('show');
						}
					});	
				});
			});
		}
	});


}

function getAllVenues(location){
	getVenues(location,categories.food,icons.food,layers.food);
	getVenues(location,categories.transport,icons.transport,layers.transport);
	getVenues(location,categories.accommodation,icons.accommodation,layers.accommodation);
	getVenues(location,categories.shopping,icons.shopping,layers.shopping);
	getVenues(location,categories.banks,icons.banks,layers.banks);
	getVenues(location,categories.activities,icons.activities,layers.activities);
}

function hideAllLayers(){
	map.removeLayer(layers.food);
	map.removeLayer(layers.transport);
	map.removeLayer(layers.accommodation);
	map.removeLayer(layers.shopping);
	map.removeLayer(layers.banks);
	map.removeLayer(layers.activities);
}

function showAllLayers(){
	map.addLayer(layers.food);
	map.addLayer(layers.transport);
	map.addLayer(layers.accommodation);
	map.addLayer(layers.shopping);
	map.addLayer(layers.banks);
	map.addLayer(layers.activities);
}


///--------
var app = new Vue({
	el:'.app',
	data:{
		currentLayer:'layer1',
		currentVenue:{
		}
	},
	methods:{
		showDirections:function(event){

			console.log(event);
			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(position=>{
					var myLocation = {
						lat:position.coords.latitude,
						lng:position.coords.longitude
					};

					//create a request for directions

					var target = event.target;

					var destinationLatLng = {
						lat: $(target).data('lat'),
						lng: $(target).data('lng'),
					};


					var request = {
				          origin: myLocation,
				          destination: destinationLatLng,
				          travelMode: 'WALKING'
				        };
					//ask directionsService to fulfill your request
					directionsService.route(request,function(response,status){

						directionsLayerGroup.clearLayers();

						var path = response.routes["0"].overview_path;

						var polyline = _(path).map(function(item){
							return {lat:item.lat(),lng:item.lng()};
						});

						console.log(polyline);

						L.polyline(polyline,{
							color:'tomato',
							weight:5
						}).addTo(directionsLayerGroup);
						
					});
				});
			}
			this.currentLayer = 'layer2';
		}
	},
});

//google map directions
function initMap(){
	console.log('init')
	directionsService = new google.maps.DirectionsService;
	
}