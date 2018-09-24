const version = '?v=20170901';
const clientid = '&client_id=WA1IDVPVFKUJGDYEM44LP25GUOYE12AQNYCXIR5UCHVPBDZT';
const clientSecret = '&client_secret=XFN1HXICSS4GTXJUJBO4U5VOEZYZUBVWYVW13F0LZJ42QKMA';
const key = version + clientid + clientSecret;

let mylocation = {lat:1,lng:1};

//Map
let map;
let markersGroup;
$(function() {

    let center = [-36.8446152873055, 174.76662397384644];
    map = L.map('map').setView(center, 17);
    markersGroup = L.layerGroup().addTo(map);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXRlbmNlbGEiLCJhIjoiY2pra2V5a29nMGJpZDNrbWg4YXhqOWY4MCJ9.cdl_vXWGICRXKkjYFtpU0g').addTo(map);

    // L.circle(center, {
    //     radius: 250,
    //     color: 'salmon',
    //     weight: 1,
    //     fill: false
    // }).addTo(map);

    map.on('click', function(e) {        
        var ll= e.latlng;
        app.ll = ll;

        app.loadVenues(); 
    });

    //API for Map Venues

});

//API for Map Venues

let app = new Vue({
    el: '.mapwrap',
    data: {
        venues: [],
        keyword: 'topPicks',
        ll:{lat:-36.8446152873055, lng:174.76662397384644}
    },
    methods: {
        loadVenues: function() {
            //ajax request
            let urlProjects = 'https://api.foursquare.com/v2/venues/explore' + key + '&radius=150&ll='+this.ll.lat+','+this.ll.lng+'&section=' + this.keyword;
            console.log(urlProjects);
            $.ajax({
                url: urlProjects,
                dataType: 'jsonp',
                success: function(res) {
                    // app.venues = res.response.groups;
                    var data = res.response.groups[0].items;
                    var venues = _(data).map(function(item) {
                        return {
                            venueid: item.venue.id,
                            name: item.venue.name,
                            latlng: { lat: item.venue.location.lat, lng: item.venue.location.lng }
                        }
                    });
                    //assign venues to vue data
                    app.venues = venues;
                    //adding venues on to map
                    markersGroup.clearLayers();
                    _(venues).each(function(venue) {
                        let marker = L.marker(venue.latlng).addTo(markersGroup);
                        marker.venueid = venue.venueid;
                        // console.log(marker);
                        marker.on('click', function() {
                            var venueUrl = 'https://api.foursquare.com/v2/venues/' +
                                this.venueid + key;

                            $.ajax({
                                url: venueUrl,
                                dataType: 'jsonp',
                                success: function(res) {
                                    console.log(res);
                                    let venue = res.response.venue;
                                    $('.modal-title').text(venue.name);
                                    if(venue.location.formattedAddress){
                                         $('.venue-location').text(venue.location.formattedAddress.join(', '));
                                    }
                                   
                                    let photo = venue.bestPhoto;
                                    let source = photo.prefix + '357x200' + photo.suffix;
                                    $('.modal-body').empty();
                                    $('<img src="' + source + '">').appendTo('.modal-body');
                                    $('#venueModal').modal('show');
                                }
                            });
                        });
                    });

                }
            });
        }
    },
    mounted: function() {
        // this.loadVenues()
    }
});





$('.fa-search').click(function() {
    // $(this).toggleClass('selected');
    // $(this).find('i').toggleClass('far fas');
    $('.map-section').toggleClass('hide');
});

//Index Navigation

$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('.bar-nav').toggleClass('slideOut slide In')
    });
})