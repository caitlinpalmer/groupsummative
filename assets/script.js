const version = '?v=20170901';
const clientid = '&client_id=KSZ4O3RILUSKALBIFZ4SZBEITPNBF5MEYYKWJWIYAJPUKMMF';
const clientSecret = '&client_secret=TB2XI0VW42BD3PDTZ2SGTQWWUCHWFAL0PTKLDCVGHCD33Q4B';
const key = version + clientid + clientSecret;

//Map
let map;
let markersGroup;
$(function() {

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


    //API for Map Venues

});

//API for Map Venues

let app = new Vue({
    el: '.mapwrap',
    data: {
        venues: [],
        keyword: 'food'
    },
    methods: {
        loadVenues: function() {
            //ajax request
            let urlProjects = 'https://api.foursquare.com/v2/venues/explore' + key + '&ll=-36.8446152873055,174.76662397384644&section=' + this.keyword;
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
                        var marker = L.marker(venue.latlng).addTo(markersGroup);
                    });

                }
            });
        }
    },
    mounted: function() {
        this.loadVenues()
    }
});



$('.fa-search').click(function() {
    // $(this).toggleClass('selected');
    // $(this).find('i').toggleClass('far fas');
    $('.map-section').toggleClass('hide');
});

//Index Navigation

$(document).ready(function(){
    $('.menu-toggle').click(function(){
        $('.bar-nav').toggleClass('slideOut slide In')
    });
})