function Trip(generationState) {
    var startPoint = null;
    var endPoint = null;
    var waypoints = [];

    this.setStart = function (marker) {
        startPoint = marker;
        this.checkTransition();
    };

    this.setEnd = function (marker) {
        endPoint = marker;
        this.checkTransition();
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
    }
};