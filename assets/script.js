// const version = '?v=20170901';
// const clientid = '&client_id=KSZ4O3RILUSKALBIFZ4SZBEITPNBF5MEYYKWJWIYAJPUKMMF';
// const clientSecret = '&client_secret=TB2XI0VW42BD3PDTZ2SGTQWWUCHWFAL0PTKLDCVGHCD33Q4B';
// const key = version + clientid + clientSecret;

$(function() {

    let center = [-36.8446152873055, 174.76662397384644];
    let map = L.map('map').setView(center, 17);
    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXRlbmNlbGEiLCJhIjoiY2pra2V5a29nMGJpZDNrbWg4YXhqOWY4MCJ9.cdl_vXWGICRXKkjYFtpU0g').addTo(map);

    L.circle(center, {
        radius: 200,
        color: 'salmon',
        weight: 1,
        fill: false
    }).addTo(map);

});

$('.fa-search').click(function() {
    // $(this).toggleClass('selected');
    // $(this).find('i').toggleClass('far fas');
    $('.map-section').toggleClass('hide');
});

$(function() {

    // Open and close nav on mobile
    $('.bars').on('click', function(e) {

        var navData = $('.navigation').data('nav');

        e.stopPropagation();

        if (navData == 'close') {
            $('.navigation').addClass('nav-open')
                .data('nav', 'open')

            $('.bars>i').first().removeClass('fas fa-bars')
                .addClass('fas fa-times');

            $('.heading,.sub-heading').addClass('text-hide');
        } else {
            $('.navigation').removeClass('nav-open')
                .data('nav', 'close');
            $('.bars>i').removeClass('fas fa-times')
                .addClass('fas fa-bars');

            $('.heading,.sub-heading').removeClass('text-hide');
        }
    });

});