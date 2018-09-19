const version = '?v=20170901';
const clientid = '&client_id=KSZ4O3RILUSKALBIFZ4SZBEITPNBF5MEYYKWJWIYAJPUKMMF';
const clientSecret = '&client_secret=TB2XI0VW42BD3PDTZ2SGTQWWUCHWFAL0PTKLDCVGHCD33Q4B';
const key = version + clientid + clientSecret;

$(function() {

    let center = [-36.8446152873055, 174.76662397384644];
    let map = L.map('map').setView(center, 17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);

    //vicinity circle
    L.circle(center, {
        radius: 250,
        color: 'salmon',
        weight: 1,
        fill: false
    }).addTo(map);


});

let app = new Vue({
    el: '.wrapper',
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
                }
            });
        }
    },
    mounted: function() {
        this.loadVenues()
    }
});