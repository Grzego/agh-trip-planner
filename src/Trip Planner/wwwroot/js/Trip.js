function Trip (afterSelection) {
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

    this.getCity = function () {
        return city;
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

    this.clearTrip = function () {
        self.setVisible(false);
        city = null;
        startPoint = null;
        endPoint = null;
        waypoints = [];
    };

    // -----

    this.checkIfDone = function () {
        if (startPoint != null && endPoint != null) {
            google.maps.event.removeListener(startPoint.listener);
            google.maps.event.removeListener(endPoint.listener);
            afterSelection();
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

    // -----

    this.setVisible = function (flag) {
        if (startPoint && endPoint) {
            startPoint.marker.setVisible(flag);
            endPoint.marker.setVisible(flag);
            for (var i = 0; i < waypoints.length; ++i) {
                waypoints[i].marker.setVisible(flag);
            }
        }
    };

    // -----

    this.save = function (place) {
        var start = startPoint.place.place_id;
        var end = endPoint.place.place_id;
        var waips = waypoints.map(function (item) {
            return item.place.place_id;
        });

        // TODO: ask for description, and show "saved" message after save

        $.ajax({
            type: "POST",
            url: "/TripMap/SavePath",
            data: {
                City: place.formatted_address,
                StartPlace: start,
                EndPlace: end,
                Waypoints: waips
            },
            dataType: 'json',
            success: function (data) {
                console.log(data);
                if (data.saved) {
                    Materialize.toast("Wycieczka zapisana.", 2000);
                    // TODO: modal or something.
                }                
            },
            error: function (error) {
                console.log(error);
            }
        });
    };

    // -----

    this.load = function (services, _id, continuation) {
        console.log(_id);
        $.ajax({
            type: "POST",
            url: "/TripMap/GetPath",
            data: "id=" + _id,
            dataType: 'json',
            success: function (data) {
                console.log('data');
                console.log(data);
                city = data.City;
                services.autocomplete.setCity(city);
                // -----
                services.places.details(data.StartPlace, function (details) {
                    startPoint = MarkerFlyweightFactory.create(services.map, details);
                    // -----
                    services.places.details(data.EndPlace, function (details) {
                        endPoint = MarkerFlyweightFactory.create(services.map, details);
                        // -----
                        if (data.Waypoints) {
                            for (var i = 0; i < data.Waypoints; ++i) {
                                services.places.details(item, function (details) {
                                    waypoints.append(MarkerFlyweightFactory.create(services.map, details));
                                    if (waypoints.length == data.Weypoints.length) {
                                        self.generate(services);
                                        self.setVisible(true);
                                        continuation && continuation();
                                    }
                                });
                            }
                        } else {
                            self.generate(services);
                            self.setVisible(true);
                            continuation && continuation();
                        }
                    });
                });
            },
            error: function (error) {
                console.log(error);
            }
        })
    };
};