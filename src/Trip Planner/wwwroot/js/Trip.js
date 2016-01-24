function Trip(generationState) {
    var self = this;
    var startPoint = null;
    var endPoint = null;
    var waypoints = [];

    this.setStart = function (marker) {
        startPoint = marker;
        self.checkTransition();
    };

    this.setEnd = function (marker) {
        endPoint = marker;
        self.checkTransition();
    };

    this.getStart = function () {
        return startPoint;
    };

    this.getEnd = function () {
        return endPoint;
    };

    this.checkTransition = function () {
        if (startPoint != null && endPoint != null) {
            generationState();
        }
    };

    this.contains = function (place) {
        return waypoints.indexOf(place) >= 0;
    };

    this.addPlace = function (place) {
        waypoints.push(place);
    };

    this.removePlace = function (place) {
        waypoints.splice(waypoints.indexOf(place), 1);
    };

    this.getWaypoints = function () {
        return waypoints;
    };

    this.setVisible = function (flag) {
        for (var i = 0; i < waypoints.length; ++i) {
            waypoints[i].setVisible(flag);
        }
    };

    this.saveTrip = function (continuation) {
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