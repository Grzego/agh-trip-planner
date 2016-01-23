﻿function MarkerData(marker, listener) {
    this.marker = marker;
    this.listener = listener;
};

var MarkerFactory = function (_services) {
    var services = _services;

    return {
        create: function (place, callback) {
            var marker = new google.maps.Marker({
                map: services.map,
                position: place.geometry.location
                // icon: <-- can be set with... marker.marker.setIcon('...');
            });
            var listener = google.maps.event.addListener(marker, 'click', function () {
                callback(place, marker);
            });
            return new MarkerData(marker, listener);
        }
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
            console.log('visible');
            console.log(markers);
            if (markers[collection]) {
                console.log('collection length ' + markers[collection].length);
                for (var i = 0; i < markers[collection].length; ++i) {
                    markers[collection][i].marker.setVisible(onoff);
                    console.log(markers[collection][i] + ' turn to ' + onoff);
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
        }
    };
}
