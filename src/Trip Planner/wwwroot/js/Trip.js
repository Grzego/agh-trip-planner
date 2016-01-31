function Trip(nextState) {
    var self = this;
    var city = null;
    var startPoint = null;
    var endPoint = null;
    var waypoints = [];

    // -----

    this.setCity = function (cityName) {
        city = cityName;
    };

    // -----

    this.setStart = function (marker) {
        startPoint = marker;
        self.checkIfDone();
    };

    // -----

    this.setEnd = function (marker) {
        endPoint = marker;
        self.checkIfDone();
    };

    // -----

    this.getStart = function () {
        return startPoint;
    };

    // -----

    this.getEnd = function () {
        return endPoint;
    };

    // -----

    this.checkIfDone = function () {
        if (startPoint != null && endPoint != null) {
            // change listeners in markers
            nextState();
        }
    };

    // -----

    this.contains = function (place) {
        return waypoints.indexOf(place) >= 0;
    };

    // -----

    this.addPlace = function (place) {
        waypoints.push(place);
    };

    // -----

    this.removePlace = function (place) {
        waypoints.splice(waypoints.indexOf(place), 1);
    };

    // -----

    this.generate = function (services) {
        var _waypoints = waypoints.map(function (item) {
            return {
                location: item.marker.position,
                stopover: true
            };
        });

        services.directions.route({
            origin: startPoint.marker.position,
            destination: endPoint.marker.position,
            waypoints: _waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING // TODO: add more options
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                services.directionsDisplay.setMap(services.map);
                services.directionsDisplay.setDirections(response);
            }
        });
    };
    //LUKASZ obliczanie dystansu, nie wiem czy to powinno byc tu, ogolnie nie dziala
    //this.computeTotalDistance = function (result) {
    //    var total = 0;
    //    var myroute = result.routes[0];
    //    for (var i = 0; i < myroute.legs.length; i++) {
    //        total += myroute.legs[i].distance.value;
    //    }
    //    total = total / 1000;
    //    document.getElementById('total').innerHTML = total + ' km';
    //};
    // -----

    this.setVisible = function (flag) {
        startPoint.marker.setVisible(flag);
        endPoint.marker.setVisible(flag);
        for (var i = 0; i < waypoints.length; ++i) {
            waypoints[i].marker.setVisible(flag);
        }
    };

    // -----

    this.save = function (continuation) {
        var start = convertMarker(startPoint);
        var end = convertMarker(endPoint);
        var waips = waypoints.map(convertMarker);

        console.log({
            City: city,
            StartPlace: start,
            EndPlace: end,
            Waypoints: waips
        });

        $.ajax({
            type: "POST",
            url: "TripMap/SavePath",
            data: {
                City: city,
                StartPlace: start,
                EndPlace: end,
                Waypoints: waips
            },
            success: function () {
                console.log("Data sended.");
                continuation && continuation();
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    // -----

    this.load = function () {
        // -----

    };
};