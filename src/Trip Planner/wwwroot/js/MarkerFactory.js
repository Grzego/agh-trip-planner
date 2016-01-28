function MarkerFlyweight(marker, listener, place) {
    this.marker = marker;
    this.listener = listener;
    this.place = place;


};

var MarkerFlyweightFactory = new function () {
    var self = this;
    var markers = {};

    // -----

    this.create = function (map, place, callback) {
        if (markers[place.place_id]) {
            var marker = markers[place.place_id];
            // ----
            google.maps.event.removeListener(marker.listener);
            marker.listener = google.maps.event.addListener(marker.marker, 'click', function () {
                callback(place, marker.marker);
            });

            return marker;
        } else {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
                // icon: <-- can be set with... marker.marker.setIcon('...');
            });
            var listener = google.maps.event.addListener(marker, 'click', function () {
                callback(place, marker);
            });
            markerData = new MarkerFlyweight(marker, listener, place);
            markers[place.place_id] = markerData;

            return markerData;
        }
    };
};

function convertMarker (marker) {
    var _lat = marker.position.lat();
    var _lng = marker.position.lng();

    return {
        Lat: _lat,
        Lng: _lng
    };
};


var MarkerCollections = function () {
    var markers = {};

    return {
        append: function (collection, marker) {
            if (!markers[collection]) {
                markers[collection] = [];
            }
            markers[collection].push(marker);
        },

        visible: function (collection, onoff) {
            if (markers[collection]) {
                for (var i = 0; i < markers[collection].length; ++i) {
                    markers[collection][i].marker.setVisible(onoff);
                }
            }
        },

        removeAll: function (collection) {
            delete markers[collection];
        },

        remove: function (collection, marker) {
            markers[collection].splice(markers[collection].indexOf(marker), 1);
        },

        contains: function (collection) {
            return markers[collection] !== undefined;
        },

        getCollections: function () {
            return markers;
        },

        getCollection: function (collection) {
            return markers[collection];
        },

        hideAndRemoveAll: function (collection) {
            if (markers[collection]) {
                for (var i = 0; i < markers[collection].length; ++i) {
                    markers[collection][i].marker.setVisible(false);
                }
            }
            delete markers[collection];
        }
    };
};
