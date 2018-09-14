const version = '?v=20170901';
const clientid = '&client_id=PJQQYBGMFJ0NV2QRF441L4ZQ03ZFDFPYAZZWLVTYQSLFEBBZ';
const clientSecret = '&client_secret=CJRASI3SGKB33A5QTC5V5MRJ1Q2T51E3JCSIVLDLEBPIGV2I';
const key = version + clientid + clientSecret;

var map;

var categories = {
	food: '4d4b7105d754a06374d81259',
	transport: '52f2ab2ebcbc57f1066b8b4f',
	accommodation: '4bf58dd8d48988d1fa931735'
}


var icons = {
	food: 'assets/images/pinkdot.svg',
	transport: 'assets/images/purpledot.svg',
	accommodation: 'assets/images/bluedot.svg'
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
					name:item.name
				};
			});

			console.log(venues);

			_(venues).each(function(venue){

				let foodIcon = L.icon({
					iconUrl:icon,
					iconSize:[25,25]
				});
				let marker = L.marker(venue.latlng,{icon:foodIcon}).addTo(map);

				marker.venueid = venue.venueid;
			});
		}
	});


}



///--------
var app = new Vue({
	el:'.app',
	data:{
		currentLayer:'layer1',
	},
	methods:{},
});