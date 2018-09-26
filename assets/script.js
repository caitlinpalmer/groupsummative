const version = '?v=20170901';
const clientid = '&client_id=ALXPVGPDJYHRYZAUTUBK5JKFUQM1X1FISS5XQVC5LA3MW5IN';
const clientSecret = '&client_secret=FNNNPEVWGIS1FFCDKWWNERDCPWCNODOCR40OBOPYOWXNSVET';
const key = version + clientid + clientSecret;

var directionsService;
var foodDrink = ["this food place", "another food place","Café", "Cafe", "Japanese Restaurant", "Coffee Shop","Sandwich Place","Asian Restaurant","Brazilian Restaurant","Snack Place","Indian Restaurant"];
var parks = ["Park", "park", "Playground"];

// $('.venue-container').hide();
$(function(){
	//set explore location to Auckland city
	let center = [-36.857011,174.764305];
	let map = L.map('map').setView(center,17);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);


	//direction line on map
	var directionsLayerGroup = L.layerGroup().addTo(map);

	//Explore venues -- foursquare api

	let exploreUrl = 'https://api.foursquare.com/v2/venues/explore'+key+'&limit=100&ll=-36.857011,174.764305';
	$.ajax({
		url: exploreUrl,
		dataType:'jsonp',
		success:function(res){
			var data = res.response.groups["0"].items;

			var venues = _(data).map(function(item){

				return {
					latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
					name: item.venue.name,
					venueid: item.venue.id,
					category: item.venue.categories["0"].name
				};
			});

			//give different types of places different icons
			_(venues).each(function(venue){

				// console.log(venue);

				// if(venue.category == "Shopping Mall" || venue.category == "Café"){
				// 	iconLink = "icon_fastfood.svg"
				// }

				if(foodDrink.indexOf(venue.category) != -1){
					// iconLink is the food icon
					iconLink = "assets/fastFood.svg"
				}

				else if(parks.indexOf(venue.category) != -1){
					// iconLink is the playground icon
					iconLink = "assets/playground.svg"
				}

				else {
					iconLink = "assets/mapPin.svg"
				}

				let venueIcon = L.icon({
					iconUrl: iconLink,
					iconSize:[30,30]
				});
				let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);
				marker.venueid = venue.venueid;

				//onclick open up modal displaing info on place
				
				marker.on('click',function(){


					venuePopup(this.venueid);


				});
			});
				
		}
	});
	//directions on how to get to place

	$('.get-directions').on('click',function(){

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
						color:'tomato',
						weight:5
					}).addTo(directionsLayerGroup);
					
				});
			});
		}
		// console.log(destinationLatLng);
	});
});

//googlemaps directions
function initMap(){
	directionsService = new google.maps.DirectionsService;
	
}
$( ".btn-primary" ).click(function() {
	$('.venue-container').show();

});

let app = new Vue({
	el:'.mapHeader',
	data:{
		venues:[],
		keyword:''
	},
	methods:{
		loadVenues: function(){
			//ajax request
			let urlProjects = 'https://api.foursquare.com/v2/venues/search'+key+'&limit=5&ll=-36.857011,174.764305&query='+this.keyword;
			$.ajax({
				url: urlProjects,
				dataType: 'jsonp',
				success: function(res){
					// console.log(res);
					// app.venues = res.response.groups;
					var data = res.response.venues;
					console.log(data);
					var venues = _(data).map(function(item){
						return {
							venueid:item.id,
							name:item.name,
							latlng: {lat:item.location.lat,lng:item.location.lng}
						}
					});
					//assign venues to vue data
					app.venues = venues;
				}
			});

		},
		showVenue:function(event){
			console.log(event);

			var venueid = $(event.target).data('venueid');
			venuePopup(venueid);

		}
	},

	mounted:function(){
		this.loadVenues()
	}
});

function venuePopup(venueid){

			var venueUrl = 'https://api.foursquare.com/v2/venues/'+venueid+key;

			$.ajax({
				url:venueUrl ,
				dataType:'jsonp',
				success:function(res){
					console.log(res);
					var venue = res.response.venue;
					$('.modal-title').empty();
					console.log(venue);
					$('.modal-body').empty();
					$('.modal-title').text(venue.name);
					var bodyHTML = '<p>Likes: '+venue.likes.count +'</p><p>Address: '+venue.location.formattedAddress + '</p><p>Website:</p> <a href="url">'+venue.url+'</a>';
					if(venue.hours){
						bodyHTML += '<p>Hours: '+venue.hours.status+'</p>'
					}
					$('.modal-body').html(bodyHTML);
				
					if(venue.bestPhoto){
						var photos = venue.bestPhoto;
						var source = photos.prefix+'100x100'+photos.suffix;
						$('<img src="'+source+'">').appendTo('.modal-body');
					}

					$('.get-directions').data('lat', venue.location.lat);
					$('.get-directions').data('lng', venue.location.lng);
					
					
					$('#venueModal').modal('show');
				}
			});
			console.log(venueUrl);

}