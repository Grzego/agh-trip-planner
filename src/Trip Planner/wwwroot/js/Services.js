var Services = function (initState) { // TODO: pokombinowac jeszcze
    console.log('Create map');
    var _map = new MapProxy();

    console.log('is undef map? ' + _map);

    console.log('Create places');
    var _places = new PlaceServiceProxy(_map);

    console.log('Create autocomplete');
    var _autocomplete = new AutocompleteCitiesProxy(initState);

    console.log('Create directions');
    var _directions = new google.maps.DirectionsService();

    console.log('Create directions display');
    var _directionsDisplay = new google.maps.DirectionsRenderer({
        map: _map.map,
        preserveViewport: true,
        suppressMarkers: true,
    });

    return {
        map: _map,
        places: _places,
        autocomplete: _autocomplete,
        directions: _directions,
        directionsDisplay: _directionsDisplay
    };
};

// -----
// -----

function MapProxy() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(50.0468548, 19.9348337),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    return new google.maps.Map(mapCanvas, mapOptions);
};

// -----
// -----

function PlaceServiceProxy(map) {
    var placeService = new google.maps.places.PlacesService(map);
    var _details = {};

    return {
        nearbySearch: function (request, callback) {
            placeService.nearbySearch(request, callback);
        },

        searchByType: function (types, latLng, callback) {
            var request = {
                location: latLng,
                radius: 1000,
                types: types
            };

            placeService.nearbySearch(request, callback);
        },

        details: function (place, continuation) {
            if (_details[place.place_id]) {
                continuation(_details[place.place_id]);
            } else {
                var request = { placeId: place.place_id };
                placeService.getDetails(request, function (results, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        // show error xD or something
                        return;
                    }

                    // -----
                    var content = GenerateContent(place, results);
                    _details[place.place_id] = content;
                    continuation(content);
                });
            }
        }
    };
};

// -----
// -----

function GenerateContent(place, details) {
    console.log('GenerateContent');
    var content = "";
    content = "<strong>" + details.name + "</strong>" + "<br />" +
        (details.formatted_address ? details.formatted_address + "<br />" : "") +
        (details.formatted_phone_number ? details.formatted_phone_number + "<br />" : "") +
        (details.website ? "<a href=" + details.website + ">" + details.website + "</a>" : "");
    if (place.photos) { // FIX: nie wiedziec czemu nie wczytuje obrazkow
        var photoURL = place.photos[0].getUrl({ 'maxWidth': 1200, 'maxHeight': 700 });
        console.log(photoURL);
        content += "<img width=\"240\" src=\"" + photoURL + "\"/>";
    }
    content += (details.rating ? "<br/>Ocena: <span style=color:#01579b;>" + details.rating + "</span><br /><br />" : "");
    return content;
};

// -----
// -----

function AutocompleteCitiesProxy(locationChanged) {
    var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-90, -180),
        new google.maps.LatLng(90, 180));

    var autocompleteOptions = {
        bounds: defaultBounds,
        types: ['(cities)']
    };

    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('city_poc'), autocompleteOptions);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        // var place = autocomplete.getPlace();
        // map.panTo(place.geometry.location);
        locationChanged();
    });

    return {
        getPlace: function () {
            return autocomplete.getPlace();
        }
    };
};