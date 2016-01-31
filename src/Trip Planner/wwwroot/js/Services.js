function Services (initState) { // TODO: pokombinowac jeszcze
    var self = this;

    // -----

    this.map = new MapProxy();
    this.places = new PlaceServiceProxy(self.map);
    this.autocomplete = new AutocompleteCitiesProxy(initState);
    this.directions = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({
        map: self.map,
        preserveViewport: true,
        panel: document.getElementById('tripPanel'),      
        suppressMarkers: true,
    });
};

// -----
// -----

function MapProxy() {
    var mapCanvas = document.getElementById('map');
    var mapOptions = {
        center: new google.maps.LatLng(50.0468548, 19.9348337),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP // IMPORTANT! Dodac opcje zmiany sposobu poruszania sie
    };

    return new google.maps.Map(mapCanvas, mapOptions);
};

// -----
// -----

function PlaceServiceProxy(map) {
    var placeService = new google.maps.places.PlacesService(map);
    var _details = {};

    // -----

    // ---
    this.nearbySearch = function (request, callback) {
        placeService.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    callback(results[i]);
                }
            }
        });
    };

    // ---
    this.searchByType = function (types, latLng, callback) {
        var request = {
            location: latLng,
            radius: 1000,
            types: types
        };

        placeService.nearbySearch(request, function (results, status) {
            console.log(status);
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; ++i) {
                    callback(results[i]);
                }
            }
        });
    };

    // ---
    this.details = function (place, continuation) {
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
                _details[place.place_id] = results;
                continuation(results);
            });
        }
    };
};

// -----
// -----

function generateContent(details) {
    var content = "";
    content = "<strong>" + details.name + "</strong>" + "<br />" +
        (details.formatted_address ? details.formatted_address + "<br />" : "") +
        (details.formatted_phone_number ? details.formatted_phone_number + "<br />" : "") +
        (details.website ? "<a href=" + details.website + ">" + details.website + "</a><br />" : "");
    if (details.photos) { // FIX: nie wiedziec czemu nie wczytuje obrazkow
        var photoURL = details.photos[0].getUrl({ 'maxWidth': 1200, 'maxHeight': 700 });
        console.log(photoURL);
        content += "<img width=\"240\" src=\"" + photoURL + "\"/><br />";
    }
    content += (details.rating ? "Ocena: <span style=color:#01579b;>" + details.rating + "</span><br /><br />" : "");
    return content;
};

function generateContentImageless(details) {
    var content = "";
    content = "<strong>" + details.name + "</strong>" + "<br />" +
        (details.formatted_address ? details.formatted_address + "<br />" : "") +
        (details.formatted_phone_number ? details.formatted_phone_number + "<br />" : "") +
        (details.website ? "<a href=" + details.website + ">" + details.website + "</a><br />" : "");
    content += (details.rating ? "Ocena: <span style=color:#01579b;>" + details.rating + "</span><br /><br />" : "");
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