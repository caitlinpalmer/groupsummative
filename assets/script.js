const version = '?v=20170901'
const clientid = '&client_id=2SQCQ5NULNQSNS2X4WKXP4KS1DHVNT0BSUK4TSJSC0US32KM';
const clientSecret = '&client_secret=D0VSBOY20TADAZBEZ2PEIXNVYUXPZZGU5DLJ1SD2DMNLMYPP';
const key = version + clientid + clientSecret;

var restaurantArray = ["Indian Restaurant", "Food Court", "Japanese Restaurant", "Australian Restaurant", "Pizza Place", "Vegetarian / Vegan Restaurant", "Restaurant", "Steakhouse", "Vietnamese Restaurant", "Seafood Restaurant", "Mexican Restaurant", "Asian Restaurant", "Sushi Restaurant", "Middle Eastern Restaurant", "Noodle House", "Cajun / Creole Restaurant", "French Restaurant", "Italian Restaurant", "Modern European Restaurant"]

$(function(){

	if ('#map-page'.length > 0) {
		//starting point
		var center = [-36.851012,174.764318];
		var map = L.map('map').setView(center, 13.5);

		//map tilelayer
		L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

		//Explore venues

		let exploreUrl = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.851012,174.764318';

		$.ajax({
			url:exploreUrl,
			dataType:'jsonp',
			success:function(res){
				var data = res.response.groups["0"].items;
			// console.log(data);

			var venues = _(data).map(function(item){
				// console.log(item);

				return {
					latlng:{lat:item.venue.location.lat,lng:item.venue.location.lng},
					name:item.venue.name,
					venueid:item.venue.id,
					category: item.venue.categories[0].name,
				}
			});
			

			_(venues).each(function(venue){

				console.log(venue.category)

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
				// console.log(venues);
				let marker = L.marker(venue.latlng,{icon:venueIcon}).addTo(map);


				marker.venueid = venue.venueid;

				//show popup

				$('.showModalButton').on('click',function(){
					var venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;

					$.ajax({
						url:venueUrl,
						dataType:'jsonp',
						success:function(res){
							var venue = res.response.venue;

							marker.bindPopup('<h3>' + venue.name + '</h3><br>' + venue.categories[0].name + '<br><button type="button" class="showModalButton"')
						}
					});
				});	



				//show modal

				$('.showModalButton').on('click',function(){
					var venueUrl = 'https://api.foursquare.com/v2/venues/'+this.venueid+key;
					
					$.ajax({
						url:venueUrl,
						dataType:'jsonp',
						success:function(res){
							var venue = res.response.venue;

							console.log(venue);
							
							$('.modal-title').text(venue.name);

							var photos = venue.bestPhoto;
							var source = photos.prefix+'100x100'+photos.suffix;
							$('.modal-body').empty();
							$('<img src="'+source+'">').appendTo('.modal-body');

							$('#venueModal').modal('show');

						}	
					});

					
				});
			});
		});
	}




});		