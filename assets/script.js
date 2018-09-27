const version = '?v=20170901'
const clientid = '&client_id=GKIZQEGQ4CSRC3IGI4FS32KZ0MJAP3GJSKMWDY0X30CZIEJS';
const clientSecret = '&client_secret=LQ0ETKKGDGZFSSYNOLUZZCRGYOEO1XLX2PKAEI0PLQVIIG4H';
const key = version + clientid + clientSecret;

var directionsService;

var restaurantArray = ["Indian Restaurant", "Food Court", "Japanese Restaurant", "Australian Restaurant", "Pizza Place", "Vegetarian / Vegan Restaurant", "Restaurant", "Steakhouse", "Vietnamese Restaurant", "Seafood Restaurant", "Mexican Restaurant", "Asian Restaurant", "Sushi Restaurant", "Middle Eastern Restaurant", "Noodle House", "Cajun / Creole Restaurant", "French Restaurant", "Italian Restaurant", "Modern European Restaurant"]

$(function(){

	if ('#map-page'.length > 0) {
		//starting point
		var center = [-36.851012,174.764318];
		var map = L.map('map').setView(center, 13.5);

		//direction line on map
		var directionsLayerGroup = L.layerGroup().addTo(map);

		//map tilelayer
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

		//Explore venues

		let exploreUrl = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.851012,174.764318';

		$.ajax({
			url:exploreUrl,
			dataType:'jsonp',
			success:function(res){
				var data = res.response.groups["0"].items;
				var venues = _(data).map(function(item){

					return {
						latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
						name:item.venue.name,
						venueid:item.venue.id,
						category: item.venue.categories[0].name,
					}
				});

				_(venues).each(function(venue){

					if((venue.category == 'Café') || (venue.category == 'Coffee Shop')){
						iconName = 'assets/cafe.svg'
					}

					else if(restaurantArray.indexOf(venue.category) != -1){
						iconName = 'assets/restaurant.svg'
					}

					else{
						iconName = 'assets/defaultIcon.svg'
					}

					let venueIcon = L.icon({
						iconUrl: iconName,
						iconSize:[30,30],
					});

					let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);


					marker.venueid = venue.venueid;


					//show popup

					marker.bindPopup('<h6 class="popup-name">' + venue.name + '</h6><br><p class="popup-category">' + venue.category + '</p><br><button type="button" data-venueid="'+venue.venueid+'" class="btn btn-dark showModalButton">See more</button>');

					marker.on('click',function(){


						var ll = this._latlng;
						$('.get-directions').data('lat',ll.lat);
						$('.get-directions').data('lng',ll.lng);
					})					
				});
			}
		});


		$('#map').on('click','.showModalButton',function(){
			var venueUrl = 'https://api.foursquare.com/v2/venues/'+$(this).data('venueid')+key;
			
			$.ajax({
				url:venueUrl,
				dataType:'jsonp',
				success:function(res){
					var venue = res.response.venue;

					console.log(venue);

					//fill in modal
					
					$('.modal-title').text(venue.name);

					var photos = venue.bestPhoto;
					var source = photos.prefix+'100x100'+photos.suffix;
					$('.modal-image').empty();
					// $('.modal-text').empty();
					$('<img src="'+source+'">').appendTo('.modal-image');

					var info = {
						name: venue.name,
						url: venue.url ? venue.url : '',
						phone: venue.contact.formattedPhone ? venue.contact.formattedPhone : '',
						address: venue.location.formattedAddress ? venue.location.formattedAddress.join(', ') : '',
					};
					app.popupInfo = info;

					//show modal
					$('#venueModal').modal('show');
				}	
			});			
		});

		//directions on how to get to place

		$('.get-directions').on('click',function(){

			//show modal
			$('#venueModal').modal('hide');

			if (navigator.geolocation) {

				navigator.geolocation.getCurrentPosition(position=>{
					var myLocation = {
						lat:position.coords.latitude,
						lng:position.coords.longitude
					};

					//create a request for directions

					var destinationLatLng = {
						lat: $(this).data('lat'),
						lng: $(this).data('lng')
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
							color:'#985E6D',
							weight:5
						}).addTo(directionsLayerGroup);						
					});
				});
			}
		});

		$( ".btn-primary" ).click(function() {
			$('.venue-container').show();
		});
	}	
});


//googlemaps directions
function initMap(){
	directionsService = new google.maps.DirectionsService;
	
}

	var app = new Vue({
		el:'.wrap',
		data:{
			popupInfo:{}
		},
		methods:{

		}
	});