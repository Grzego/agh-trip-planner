//--------
//--------

function App (id) {
    var self = this;

    // -----

    this.chooseStartEnd = function () {
        Materialize.toast("Wybierz gdzie chcesz rozpocząć i zakończyć wycieczkę", 10000);

        self.trip.clearTrip();
        self.services.directionsDisplay.set('directions', null);
        self.services.map.panTo(self.services.autocomplete.getPlace().geometry.location);

        var request = {
            location: self.services.autocomplete.getPlace().geometry.location,
            radius: 10000,
            types: ['airport', 'bus_station', 'subway_station', 'train_station']
        };

        // TODO: add ability to choose anywhere

        self.services.places.nearbySearch(request, function (result) {
            startEndMarkers.append(MarkerFlyweightFactory.create(self.services.map, result, function (marker) {
                self.services.places.details(marker.place.place_id, function (details) {
                    var infodiv = document.createElement('div');
                    infodiv.innerHTML = generateContent(details);

                    var startButton = ButtonFactory.createAddRemoveButton('Ustaw jako punkt startowy',
                                                                        'Ustalony punkt startowy',
                                                                        'Usuń punkt startowy',
                                                                        self.trip.getStart()  === marker ? 'done' : 'add');
                    startButton.onClick(function () {
                        self.trip.setStart(self.trip.getStart() != null ? null : marker);
                    });
                    startButton.mouseEnter();
                    startButton.mouseLeave();

                    var endButton = ButtonFactory.createAddRemoveButton('Ustaw jako punkt końcowy',
                        'Ustalony punkt końcowy',
                        'Usuń punkt końcowy',
                        self.trip.getEnd() === marker ? 'done' : 'add');

                    endButton.onClick(function () {
                        self.trip.setEnd(self.trip.getEnd() != null ? null : marker);
                    });
                    endButton.mouseEnter();
                    endButton.mouseLeave();

                    infodiv.appendChild(startButton.getContent());
                    infodiv.appendChild(endButton.getContent());

                    infowindow.setContent(infodiv);
                    console.log(marker);
                    infowindow.open(self.services.map, marker.marker);
                });
            }));
        });
    };

    // -----

    this.tripGeneration = function () {
        infowindow.close();
        showButton("savingButton");
        startEndMarkers.clear();

        self.trip.generate(self.services);
        self.trip.setVisible(true);

        self.preferences = new Preferences(self);

        google.maps.event.addListener(self.services.map, "rightclick", function (event) {
            optionalMarkers.clear();

            var haxmarker = new google.maps.Marker({
                position: event.latLng,
                map: self.services.map
            });
            //ustawione tylko na chwile, jak masz chwile to weźże skasuj tego markera człowieku kappa keepo kappaClaus (prawilnie)
            haxmarker.setVisible(false);

            var restaurantButton = ButtonFactory.createAddButton('Odwiedź restauracje');

            restaurantButton.onClick(function () {
                self.services.places.searchByType(['restaurant'], event.latLng, function (place) {
                    optionalMarkers.append(self.addToTripMark(place, function () {
                        optionalMarkers.clear();
                        self.trip.setVisible(true);
                        infowindow.close();
                    }));
                });
                infowindow.close();
            });

            // -----

            var atmButton = ButtonFactory.createAddButton('Znajdź bankomat');

            atmButton.onClick(function () {
                self.services.places.searchByType(['atm'], event.latLng, function (place) {
                    optionalMarkers.append(self.addToTripMark(place, function () {
                        optionalMarkers.clear();
                        self.trip.setVisible(true);
                        infowindow.close();
                    }));
                });
                infowindow.close();
            });

            var infodiv = document.createElement('div');
            infodiv.appendChild(restaurantButton.getContent());
            infodiv.appendChild(atmButton.getContent());

            infowindow.setContent(infodiv);
            infowindow.open(self.services.map, haxmarker);
        });
    };

    // -----

    this.addToTripMark = function (place, action) {
        return MarkerFlyweightFactory.create(self.services.map, place, function (marker) {
            self.services.places.details(marker.place.place_id, function (details) {
                var infodiv = document.createElement('div');
                infodiv.innerHTML = generateContent(details);

                var placeButton = ButtonFactory.createAddRemoveButton('Dodaj do trasy',
                    'Dodano do trasy',
                    'Usuń z trasy',
                    self.trip.contains(marker) ? 'done' : 'add');

                placeButton.onClick(function () {
                    if (!self.trip.contains(marker)) {
                        self.trip.addPlace(marker);
                    } else {
                        self.trip.removePlace(marker);
                    }
                    self.trip.generate(self.services);
                    action && action();
                });
                placeButton.mouseEnter();
                placeButton.mouseLeave();

                infodiv.appendChild(placeButton.getContent());

                infowindow.setContent(infodiv);
                infowindow.open(self.services.map, marker.marker);
            });
        });
    };

    // -----

    this.preferences = null;
    this.services = new Services();

    this.trip = new Trip(function () {
        infowindow.close();
        self.tripGeneration();
    });

    // -----
    // -----

    this.services.autocomplete.onCityChange(this.chooseStartEnd);

    if (id !== undefined) {
        this.trip.load(this.services, id, function () {
            console.log(self.trip.getCity());
            self.preferences = new Preferences(self);
        });
    }

    // -----

    var startEndMarkers = new MarkerCollection();
    var optionalMarkers = new MarkerCollection();

    // -----

    var infowindow = new google.maps.InfoWindow({ maxWidth: 240 });
};
