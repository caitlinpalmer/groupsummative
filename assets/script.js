const version = '?v=20170901';
const clientid = '&client_id=V411NRDVQFIXJDGXGIRRE4X3UEW25UNF0AV30STXIE1B3U1N';
const clientSecret = '&client_secret=SDYHGPFRXFDHHB5JKV5I0R0YXEZYNF1XZQZHJBTBWO3TM4Z2';
const key = version + clientid + clientSecret;

var map;

var categories = {
	food: '4d4b7105d754a06374d81259',
	transport: '52f2ab2ebcbc57f1066b8b4f',
	accommodation: '4bf58dd8d48988d1fa931735',
	shopping: '4bf58dd8d48988d1fd941735',
	banks: '4bf58dd8d48988d10a951735',
	activities: '4d4b7104d754a06370d81259'
}


var icons = {
	food: 'assets/images/pinkdot.svg',
	transport: 'assets/images/purpledot.svg',
	accommodation: 'assets/images/bluedot.svg',
	shopping: 'assets/images/greendot.svg',
	banks: 'assets/images/orangedot.svg',
	activities: 'assets/images/yellowdot.svg'
}

$(function(){
	//map
	let center = [-36.848953,174.762573];
	map = L.map('map').setView(center,15);
	L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiY2FpdGxpbnBhbG1lciIsImEiOiJjamtrZXlsaW4xcHE5M3FtbDEwbzBqdG92In0.RY6_Y65ouMFFFrT6B6Mvww').addTo(map);

	//switching of layers
	$('.fa-search').on('click',function(){
		app.currentLayer='layer1';
	});
	$('.fa-map-marker-alt').on('click',function(){
		app.currentLayer='layer2';
	});

	let ll = '-36.848953,174.762573';
	//venues - foursquare api
	
	getVenues(ll,categories.food,icons.food);
	getVenues(ll,categories.transport,icons.transport);
	getVenues(ll,categories.accommodation,icons.accommodation);
	getVenues(ll,categories.shopping,icons.shopping);
	getVenues(ll,categories.banks,icons.banks);
	getVenues(ll,categories.activities,icons.activities);


});

function getVenues(location,category,icon){

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

			console.log(venues);

			_(venues).each(function(venue){

				let placeIcon = L.icon({
					iconUrl:icon,
					iconSize:[30,30]
				});
				let marker = L.marker(venue.latlng,{icon:placeIcon}).addTo(map);

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
							// $('.modal-title').text(venue.name);
							// $('.modal-body').empty();

							$('.modal').modal('show');
						}
					});	
				});
			});
		}
	});


}



///--------
var app = new Vue({
	el:'.app',
	data:{
		currentLayer:'layer1',
		currentVenue:{}
	},
	methods:{},
});