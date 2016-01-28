
// -----
function createCard(markerData, cardButton) {
    //var marker = MarkerData.marker;
    var details = markerData.place;

    //tworzenie karty
    var card = document.createElement("div");
    card.className = "card small";
    card.style.maxHeight = "260px";
    //card.style.minHeight = "100px";

    if (details.photos) {
        var photoURL = details.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 400 });
        card.innerHTML = "<div class=\"card-image waves-effect waves-block waves-light\">" +
            "<img class=\"activator\" src=\"" + photoURL + "\"/>" +
        "</div>";
    }

    card.innerHTML += "<div class=\"card-content\" style=\"max-height:70px\">" +
                "<span class=\"card-title activator grey-text text-darken-4\"><i class=\"material-icons right\">more_vert</i><p style=\"font-size:15px; line-height: 17px\"><b>" +
                details.name + "</b></p></span></div>";

    var cardReveal = document.createElement("div");
    cardReveal.className = "card-reveal";
    cardReveal.innerHTML = "<span class=\"card-title grey-text text-darken-4\"><i class=\"material-icons right\">close</i><p style=\"font-size:15px; line-height: 17px\"><b>" + details.name + "</b></p></span>" +
                "<p>Here is some more information about this product that is only revealed once clicked on.</p>";
    //"<div class=\"card-reveal\">" +
    //    "<span class=\"card-title grey-text text-darken-4\"><i class=\"material-icons right\">close</i>" + details.name + "</span>" +
    //   "<p>Here is some more information about this product that is only revealed once clicked on.</p>"
    //"</div>";
    card.appendChild(cardReveal);
    cardReveal.appendChild(cardButton.getContent());
    return card;
};
//--------
//--------

function App() {
    this.chooseStartEnd = function () {
        Materialize.toast("Wybierz gdzie chcesz rozpocząć i zakończyć wycieczkę", 10000);
        markers.visible('trip', false);

        self.trip = new Trip(self.tripGeneration);
        services.map.panTo(services.autocomplete.getPlace().geometry.location);

        var request = {
            location: services.autocomplete.getPlace().geometry.location,
            radius: 10000,
            types: ['airport', 'bus_station', 'subway_station', 'train_station']
        };

        // TODO: add ability to choose anywhere

        services.places.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; ++i) {
                    markers.append('startend', MarkerFlyweightFactory.create(services.map, results[i], function (place, marker) {
                        services.places.details(place, function (details) {
                            var infodiv = document.createElement('div');
                            infodiv.innerHTML = GenerateContent(details);

                            var startButton = buttonFactory.createAddRemoveButton('Ustaw jako punkt startowy',
                                                                                'Ustalony punkt startowy',
                                                                                'Usuń punkt startowy',
                                                                                self.trip.getStart() === marker ? 'done' : 'add');
                            startButton.onClick(function () {
                                self.trip.setStart(self.trip.getStart() != null ? null : marker);
                            });

                            var endButton = buttonFactory.createAddRemoveButton('Ustaw jako punkt końcowy',
                                'Ustalony punkt końcowy',
                                'Usuń punkt końcowy',
                                self.trip.getEnd() === marker ? 'done' : 'add');

                            endButton.onClick(function () {
                                self.trip.setEnd(self.trip.getEnd() != null ? null : marker);
                            });

                            infodiv.appendChild(startButton.getContent());
                            infodiv.appendChild(endButton.getContent());

                            infowindow.setContent(infodiv);
                            infowindow.open(services.map, marker);
                        });
                    }));
                }
            } else {
                Materialize.toast("Nie znaleziono miejsc startowych", 3000);
            }
        });
    };

    // -----

    this.tripGeneration = function () {
        infowindow.close();
        showButton("savingButton");
        markers.hideAndRemoveAll('startend');

        self.trip.generate(services);

        self.trip.setVisible(true);

        google.maps.event.addListener(services.map, "rightclick", function (event) {
            markers.hideAndRemoveAll('optional');

            var haxmarker = new google.maps.Marker({
                position: event.latLng,
                map: services.map
            });
            //ustawione tylko na chwile, jak masz chwile to weźże skasuj tego markera człowieku kappa keepo kappaClaus (prawilnie)
            haxmarker.setVisible(false);

            var restaurantButton = buttonFactory.createAddButton('Odwiedź restauracje');

            restaurantButton.onClick(function () {
                services.places.searchByType(['restaurant'], event.latLng, function (place) {
                    markers.append('optional', self.addToTripMark(place, function () {
                        markers.hideAndRemoveAll('optional');
                        self.trip.setVisible(true);
                        infowindow.close();
                    }));
                });
                infowindow.close();
            });

            // -----

            var atmButton = buttonFactory.createAddButton('Znajdź bankomat');

            atmButton.onClick(function () {
                services.places.searchByType(['atm'], event.latLng, function (place) {
                    markers.append('optional', self.addToTripMark(place, function () {
                        markers.hideAndRemoveAll('optional');
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
            infowindow.open(services.map, haxmarker);
        });

        // -----

        $(':checkbox').change(function () {
            var placeMap = {
                'Monuments': ['city_hall', 'point_of_interest'],
                'Museum': ['museum'],
                'Club': ['bar', 'cafe'],
                'Food': ['restaurant', 'meal_takeaway'],
                //'Art': ['art_gallery'],
                'Cinema': ['movie_theater'],
                //'Fun': ['amusement_park', 'zoo']
            };

            $(':checkbox').each(function () {
                var tid = this.id.toString();
                if (this.checked) {
                    if (!markers.contains(tid)) {
                        console.log(markers);
                        console.log(markers.contains(tid) + ' this.id ' + tid);
                        services.places.nearbySearch({
                            location: services.autocomplete.getPlace().geometry.location,
                            radius: 20000,
                            types: placeMap[tid]
                        }, function (results, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                for (var i = 0; i < results.length; i++) {
                                    var markerData = self.addToTripMark(results[i]);

                                    markers.append(tid, markerData);

                                    //dodanie buttonow
                                    var cardButton = buttonFactory.createAddRemoveButton('Dodaj do trasy',
                                                                                    'Dodano do trasy',
                                                                                    'Usuń z trasy',
                                                                                    self.trip.contains(markerData.marker) ? 'done' : 'add');
                                    cardButton.onClick(function () {
                                        if (!self.trip.contains(markerData.marker)) {
                                            self.trip.addPlace(markerData.marker);
                                        } else {
                                            self.trip.removePlace(markerData.marker);
                                        }
                                        self.trip.setVisible(true);
                                        self.trip.generate(services);
                                    });

                                    //tworzenie karty i dodanie do taba
                                    var card = createCard(markerData, cardButton);
                                    document.getElementById("placesCards").appendChild(card);
                                    //---
                                }
                            }
                        });
                    } else {

                    }
                    markers.visible(tid, true);
                    //przelaczenie tab
                    $('ul.tabs').tabs('select_tab', 'placesCards');

                } else {
                    markers.visible(tid, false);
                    // NA PALE xD DO POPRAWY
                    self.trip.setVisible(true);
                }
            });
        });
    };

    // -----

    this.addToTripMark = function (markIt, action) {
        return MarkerFlyweightFactory.create(services.map, markIt, function (place, marker) {
            services.places.details(place, function (details) {
                var infodiv = document.createElement('div');
                infodiv.innerHTML = GenerateContent(details);

                var placeButton = buttonFactory.createAddRemoveButton('Dodaj do trasy',
                    'Dodano do trasy',
                    'Usuń z trasy',
                    self.trip.contains(marker) ? 'done' : 'add');

                placeButton.onClick(function () {
                    if (!self.trip.contains(marker)) {
                        self.trip.addPlace(marker);
                    } else {
                        self.trip.removePlace(marker);
                    }
                    infowindow.close();
                    self.trip.generate(services);
                    action && action();
                });

                infodiv.appendChild(placeButton.getContent());

                infowindow.setContent(infodiv);
                infowindow.open(services.map, marker);
            });
        });
    };

    // -----

    this.preferences = new Preferences();
    this.trip = null;

    // -----

    var services = new Services(this.chooseStartEnd);
    var buttonFactory = new ButtonFactory();
    var infowindow = new google.maps.InfoWindow({ maxWidth: 240 });
    var markers = new MarkerCollections();
    var self = this;
};
