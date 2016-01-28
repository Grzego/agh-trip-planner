function Trip(nextState) {
    var self = this;
    var startPoint = null;
    var endPoint = null;
    var waypoints = [];

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
                location: item.position,
                stopover: true
            };
        });

        services.directions.route({
            origin: startPoint.position,
            destination: endPoint.position,
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

    // -----

    this.setVisible = function (flag) {
        startPoint.setVisible(flag);
        endPoint.setVisible(flag);
        for (var i = 0; i < waypoints.length; ++i) {
            waypoints[i].setVisible(flag);
        }
    };

    // -----

    this.save = function (continuation) {
        var start = convertMarker(startPoint);
        var end = convertMarker(endPoint);
        var waips = waypoints.map(convertMarker);

        $.ajax({
            type: "POST",
            url: "TripMap/SavePath",
            data: {
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
};