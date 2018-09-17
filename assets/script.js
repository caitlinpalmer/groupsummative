// const version = '?v=20170901';
// const clientid = '&client_id=KSZ4O3RILUSKALBIFZ4SZBEITPNBF5MEYYKWJWIYAJPUKMMF';
// const clientSecret = '&client_secret=TB2XI0VW42BD3PDTZ2SGTQWWUCHWFAL0PTKLDCVGHCD33Q4B';
// const key = version + clientid + clientSecret;

$(function() {

    let center = [-36.8446152873055, 174.76662397384644];
    let map = L.map('map').setView(center, 17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidGhhbHl4OTAiLCJhIjoiY2o2YjdrZHRlMWJmYjJybDd2cW1rYnVnNSJ9.j_DQLfixHfhioVjH6qmqkw').addTo(map);
});

$('.fa-search').click(function() {
    // $(this).toggleClass('selected');
    // $(this).find('i').toggleClass('far fas');
    $('.map-section').toggleClass('hide');
});