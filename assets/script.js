const version = '?v=20170901';
const clientid = '&client_id=WA1IDVPVFKUJGDYEM44LP25GUOYE12AQNYCXIR5UCHVPBDZT';
const clientSecret = '&client_secret=XFN1HXICSS4GTXJUJBO4U5VOEZYZUBVWYVW13F0LZJ42QKMA';
const key = version + clientid + clientSecret;

let mylocation = { lat: 1, lng: 1 };

//Map
let map;
let markersGroup;
$(function() {

    if (document.querySelector('#map')) {
        let center = [-36.8446152873055, 174.76662397384644];
        map = L.map('map').setView(center, 17);
        markersGroup = L.layerGroup().addTo(map);
        L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXRlbmNlbGEiLCJhIjoiY2pra2V5a29nMGJpZDNrbWg4YXhqOWY4MCJ9.cdl_vXWGICRXKkjYFtpU0g').addTo(map);

        L.circle(center, {
            radius: 250,
            color: 'salmon',
            weight: 1,
            fill: false
        }).addTo(map);

        map.on('click', function(e) {
            var ll = e.latlng;
            app.ll = ll;

            app.loadVenues();
        });
    }

});

//API for Map Venues
let app;
if (document.querySelector('.wrap1')) {
    app = new Vue({
        el: '.wrap1',
        data: {
            venues: [],
            keyword: 'topPicks',
            ll: { lat: -36.8446152873055, lng: 174.76662397384644 }
        },
        methods: {
            loadVenues: function() {
                //ajax request
                let urlProjects = 'https://api.foursquare.com/v2/venues/explore' + key + '&radius=150&ll=' + this.ll.lat + ',' + this.ll.lng + '&section=' + this.keyword;
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
                                        let venue = res.response.venue;
                                        $('.modal-title').text(venue.name);
                                        if (venue.location.formattedAddress) {
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
    })
};


//API to pull information into search results on other page

if (document.querySelector('.wrap2')) {
    let app2 = new Vue({
        el: '.wrap2',
        data: {
            venues: [],
            storedData: {}
        },
        methods: {
            loadVenues: function(lat, lng, category) {

                if ((category in this.storedData) == false) {
                    let urlProjects = 'https://api.foursquare.com/v2/venues/search' + key + '&radius=150&ll=' + lat + ',' + lng + '&categoryId=' + category;
                    $.ajax({
                        url: urlProjects,
                        dataType: 'jsonp',
                        success: function(res) {

                            var data = res.response.venues
                            var venues = _(data).map(function(item) {
                                return {
                                    venueid: item.id,
                                    name: item.name,
                                    latlng: { lat: item.location.lat, lng: item.location.lng },
                                    address: item.location.formattedAddress.join(', ')
                                }
                            });
                            app2.storedData[category] = venues;
                            app2.venues = app2.storedData[category];


                        }
                    });
                }

                app2.venues = app2.storedData[category];

            }
        }
    });



    $(function() {
        $('#searchAccomodation a').on('click', function(e) {
            e.preventDefault();
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4bf58dd8d48988d1fa931735')
        });
        $('#searchShops a').on('click', function(e) {
            e.preventDefault();
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4d4b7105d754a06378d81259')
        });
        $('#searchTransport a').on('click', function(e) {
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4bf58dd8d48988d1fe931735')

        });
        $('#searchFood a').on('click', function(e) {
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4d4b7105d754a06374d81259')

        });
        $('#searchAttractions a').on('click', function(e) {
            e.preventDefault();
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4d4b7104d754a06370d81259')

        });
        $('#searchRecreation a').on('click', function(e) {
            e.preventDefault();
            app2.loadVenues(-36.8446152873055, 174.76662397384644, '4d4b7105d754a06377d81259')
        });
        $('.arrow').on('click', function(e) {
            e.preventDefault();
            $(".search-results-container").toggleClass("open");
            // $(".search-results-container").addClass("hide");
        });
        $('.category-item-content').click(function() {
            $('.search-results-container').toggleClass('open');
        });
    })
}

//Index Navigation

$(document).ready(function() {
    $('.menu-toggle').click(function() {
        $('.bar-nav').toggleClass('open')
    });
});