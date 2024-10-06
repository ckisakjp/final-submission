// Function to determine the color based on the score
function getColorForScore(score) {
    if (score >= 80) {
        return '#1a9850';  // Green for high scores
    } else if (score >= 60) {
        return '#66bd63';  // Light Green for medium-high scores
    } else if (score >= 40) {
        return '#fdae61';  // Yellow-orange for medium scores
    } else if (score >= 20) {
        return '#f46d43';  // Orange for low scores
    } else {
        return '#d73027';  // Red for very low scores
    }
}

function slideFooter() {
    const footer = document.getElementById('footer');
    footer.classList.toggle('expanded');

    // Listen for the transition end event
    footer.addEventListener('transitionend', function() {
        // Check if the footer is expanded
        if (footer.classList.contains('expanded')) {
            // Load the index.html page after the slide animation
            window.location.href = 'index.html';
        }
    }, { once: true }); // Ensure this listener is only called once
}


document.addEventListener("DOMContentLoaded", function() {
    let video = document.getElementById("video-background");
    video.setAttribute('src', 'background.mp4'); // Load the video after the page has loaded
});

// The map js start from here 
$(document).ready(function() {
    let countries = [];
    let countryData = []; // Array to store country details
    let detailData = []; // Array to store additional country details from details.json
    let airQualityData = []; // Array to store air quality data
    let climateChangeData = []; // Array to store climate change data

    let mapOptions = {
        zoom: 3,
        minZoom: 1,
        center: new google.maps.LatLng(50.7244893, 3.2668189),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        backgroundColor: 'none'
    };

    let map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    init();

    function init() {
        // Load the main country data
        $.ajax({
            url: 'data.json',
            cache: true,
            dataType: 'json',
            async: true,
            success: function(data) {
                countryData = data; // Store country data
                loadDetails(); // Load the details after country data
            }
        });
    }

    function loadDetails() {
        // Load the additional details data
        $.ajax({
            url: 'details.json', // Adjust this path if necessary
            cache: true,
            dataType: 'json',
            async: true,
            success: function(details) {
                detailData = details; // Store detail data
                loadAirQuality(); // Load air quality data after details
            }
        });
    }

    function loadAirQuality() {
        $.ajax({
            url: 'airquality.json', // Adjust this path if necessary
            cache: true,
            dataType: 'json',
            async: true,
            success: function(airQuality) {
                airQualityData = airQuality; // Store air quality data
                loadClimateChange(); // Load climate change data after air quality
            }
        });
    }

    function loadClimateChange() {
        $.ajax({
            url: 'climatechange.json', // Adjust this path if necessary
            cache: true,
            dataType: 'json',
            async: true,
            success: function(climateChange) {
                climateChangeData = climateChange; // Store climate change data
                if (countryData) {
                    $.each(countryData, function(id, country) {
                        var countryCoords;
                        var ca;
                        var co;

                        // Check if country has multiple polygons
                        if ('multi' in country) {
                            var ccArray = [];

                            for (var t in country['xml']['Polygon']) {
                                countryCoords = [];
                                co = country['xml']['Polygon'][t]['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                                for (var i in co) {
                                    ca = co[i].split(',');
                                    countryCoords.push(new google.maps.LatLng(ca[1], ca[0]));
                                }

                                ccArray.push(countryCoords);
                            }

                            createCountry(ccArray, country);

                        } else {
                            countryCoords = [];
                            co = country['xml']['outerBoundaryIs']['LinearRing']['coordinates'].split(' ');

                            for (var j in co) {
                                ca = co[j].split(',');
                                countryCoords.push(new google.maps.LatLng(ca[1], ca[0]));
                            }

                            createCountry(countryCoords, country);
                        }
                    });

                    showCountries();
                }
            }
        });
    }

    // Function to determine the color based on the score
function getColorForScore(score) {
    if (score >= 80) {
        return '#1a9850';  // Green for high scores
    } else if (score >= 60) {
        return '#66bd63';  // Light Green for medium-high scores
    } else if (score >= 40) {
        return '#fdae61';  // Yellow-orange for medium scores
    } else if (score >= 20) {
        return '#f46d43';  // Orange for low scores
    } else {
        return '#d73027';  // Red for very low scores
    }
}


function showCountries() {
    console.log(countries); // Check if countries array is populated correctly

    for (var i = 0; i < countries.length; i++) {
        countries[i].setMap(map); // Add each country polygon to the map

        // Event listeners for hover and click
        google.maps.event.addListener(countries[i], "mouseover", function() {
            this.setOptions({ strokeWeight: 2 });
        });

        google.maps.event.addListener(countries[i], "mouseout", function() {
            this.setOptions({ strokeWeight: 1 });
        });

        google.maps.event.addListener(countries[i], 'click', function(event) {
            const countryDetails = countryData.find(country => country.country === this.title);
            const detailDetails = detailData.find(detail => detail.country === this.title);
            const airQualityDetails = airQualityData.find(aq => aq.country === this.title);
            const climateChangeDetails = climateChangeData.find(cc => cc.country === this.title);

            if (countryDetails) {
                $('#country-name').text(countryDetails.country);
                $('#country-code').text('ISO Code: ' + countryDetails.iso);
                $('#country-capital').text('Capital: ' + countryDetails.capital);
                $('#country-landarea').text('Land Area: ' + countryDetails.landarea + ' km²');
                
                // Add EPI details
                $('#country-rank').text('EPI Rank: ' + (detailDetails ? detailDetails.rank : 'N/A'));
                $('#country-score').text('EPI Score: ' + (detailDetails ? detailDetails.current : 'N/A'));
                $('#country-ten-year').text('EPI 10 Year Score: ' + (detailDetails ? detailDetails.delta : 'N/A'));

                // Air quality and climate change details
                $('#country-air-quality').text('Air Quality Rank: ' + (airQualityDetails ? airQualityDetails.rank : 'N/A'));
                $('#country-climate-change').text('Climate Change Rank: ' + (climateChangeDetails ? climateChangeDetails.rank : 'N/A'));

                $('#info-box').addClass('show');
            }
        });
    }
}


    function createCountry(coords, country) {
        const detailDetails = detailData.find(detail => detail.country === country.country);
        let countryColor = '#cccccc';
        
        if (detailDetails && detailDetails.current !== undefined) {
            countryColor = getColorForScore(detailDetails.current);
        }
    
        var currentCountry = new google.maps.Polygon({
            paths: coords,
            title: country.country,
            code: country.iso,
            strokeOpacity: 0.8,
            strokeColor: '#333',
            strokeWeight: 1,
            fillOpacity: 0.7,
            fillColor: countryColor
        });
    
        // Log the country name and polygon creation for debugging
        console.log(`Country created: ${country.country}`);
    
        countries.push(currentCountry);
    }
    
    

});
