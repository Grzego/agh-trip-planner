function MarkerFlyweight(marker, place) {
    this.marker = marker;
    this.place = place;
    this.listener = null;
};

var MarkerFlyweightFactory = new function () {
    var self = this;
    var markers = {};

    // -----

    this.create = function (map, place, callback) {
        if (!markers[place.place_id]) {
            console.log('nowy marker');
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
                // icon: <-- can be set with... marker.marker.setIcon('...');
            });

            var markerData = new MarkerFlyweight(marker, place);
            markerData.listener = google.maps.event.addListener(marker, 'click', function () {
                callback(markerData);
            });
            markers[place.place_id] = markerData;

            return markerData;

        } else {
            console.log('stary marker');

            var marker = markers[place.place_id];
            // ----
            google.maps.event.removeListener(marker.listener);
            marker.listener = google.maps.event.addListener(marker.marker, 'click', function () {
                callback(marker);
            });

            return marker;

        }
    };
};

function convertMarker (marker) {
    var _lat = marker.marker.position.lat();
    var _lng = marker.marker.position.lng();

    return {
        Lat: _lat,
        Lng: _lng
    };
};


function MarkerCollection () {
    var self = this;
    var markers = {};

    this.append = function (marker) {
        markers[marker.place.place_id] = marker;
    };

    this.visible = function (flag) {
        for (var i in markers) {
            markers[i].marker.setVisible(flag);
        }
    };

    this.clear = function () {
        self.visible(false);
        markers = {};
    };

    this.remove = function (marker) {
        delete markers[marker.place.place_id];
    };

    this.contains = function (marker) {
        return markers[marker.place.place_id] !== undefined;
    };

    this.getAll = function () {
        return markers;
    };
};
