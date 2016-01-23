/// <reference path="Trip.ts"/>
/// <reference path="Services.ts"/>
/// <reference path="MarkerFactory.ts"/>
/// <reference path="ButtonFactory.ts"/>

// -----
function createCard(MarkerData, cardButton) {
    //var marker = MarkerData.marker;
    var details = MarkerData.place;

    //tworzenie karty
    var card = document.createElement("div");
    card.className = "card small";
    card.style.Height = "270px";

    if (details.photos) {
        var photoURL = details.photos[0].getUrl({ 'maxWidth': 1200, 'maxHeight': 700 });
        card.innerHTML = "<div class=\"card-image waves-effect waves-block waves-light\">" +
            "<img class=\"activator\" src=\"" + photoURL + "\"/>" +
        "</div>";
    }
    card.innerHTML += "<div class=\"card-content\" style=\"max-height:60px\">" +
                "<span class=\"card-title activator grey-text text-darken-4\"><i class=\"material-icons right\">more_vert</i><p style=\"font-size:13px; line-height: 14px\"><b>" + details.name + "</p></b></span>" +
            "</div>" +
            "<div class=\"card-reveal\">" +
                "<span class=\"card-title grey-text text-darken-4\"><i class=\"material-icons right\">close</i>" + details.name + "</span>" +
                "<p>Here is some more information about this product that is only revealed once clicked on.</p>" +
            "</div>";
    card.appendChild(cardButton.getContent());
    return card;
}
//--------

function App() {
    this.chooseStartEnd = function () {
        console.log('chooseStartEnd');

        markers.visible('trip', false);

        trip = new Trip(self.tripGeneration);
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
                    markers.append('startend', markerFactory.create(results[i], function (place, marker) {
                        services.places.details(place, function (details) {
                            var infodiv = document.createElement('div');
                            infodiv.innerHTML = GenerateContent(details);

                            var startButton = buttonFactory.createAddRemoveButton('Ustaw jako punkt startowy',
                                                                                'Ustalony punkt startowy',
                                                                                'Usuń punkt startowy',
                                                                                trip.getStart() === marker ? 'done' : 'add');
                            startButton.onClick(function () {
                                trip.setStart(trip.getStart() != null ? null : marker);
                            });
                            startButton.mouseEnter();
                            startButton.mouseLeave();

                            var endButton = buttonFactory.createAddRemoveButton('Ustaw jako punkt końcowy',
                                                                                'Ustalony punkt końcowy',
                                                                                'Usuń punkt końcowy',
                                                                                trip.getEnd() === marker ? 'done' : 'add');

                            endButton.onClick(function () {
                                trip.setEnd(trip.getEnd() != null ? null : marker);
                            });
                            endButton.mouseEnter();
                            endButton.mouseLeave();

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

        console.log('tripGeneration');
        markers.visible('startend', false);
        markers.removeAll('startend');

        trip.getStart().setVisible(true);
        trip.getEnd().setVisible(true);

        google.maps.event.addListener(services.map, "rightclick", function (event) {
            markers.removeAll('optional');

            var haxmarker = new google.maps.Marker({
                position: event.latLng,
                map: services.map
            });
            //ustawione tylko na chwile, jak masz chwile to weźże skasuj tego markera człowieku kappa keepo kappaClaus (prawilnie)
            haxmarker.setVisible(false);

            var restaurantButton = buttonFactory.createAddButton('Odwiedź restauracje');

            restaurantButton.onClick(function () {
                services.places.searchByType(['restaurant'], event.latLng, function (results, status) {
                    for (var i = 0; i < results.length; ++i) {
                        markers.append('optional', self.addToTripMark(results[i], function () {
                            markers.visible('optional', false);
                            markers.removeAll('optional');
                            trip.setVisible(true);
                            infowindow.close();
                        }));
                    }
                });
                infowindow.close();
            });

            // -----

            var atmButton = buttonFactory.createAddButton('Znajdź bankomat');

            atmButton.onClick(function () {
                services.places.searchByType(['atm'], event.latLng, function (results, status) {
                    for (var i = 0; i < results.length; ++i) {
                        markers.append('optional', self.addToTripMark(results[i], function () {
                            markers.visible('optional', false);
                            markers.removeAll('optional');
                            trip.setVisible(true);
                            infowindow.close();
                        }));
                    }
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
                                    markers.append(tid, self.addToTripMark(results[i]));

                                    var MarkerData = self.addToTripMark(results[i]);

                                    //dodanie buttonow
                                    var cardButton = buttonFactory.createAddRemoveButton('Dodaj do trasy',
                                                                                    'Dodano do trasy',
                                                                                    'Usuń z trasy',
                                                                                    trip.contains(MarkerData.marker) ? 'done' : 'add');
                                    cardButton.onClick(function () {
                                        if (!trip.contains(MarkerData.marker)) {
                                            trip.addPlace(MarkerData.marker);
                                        } else {
                                            trip.removePlace(MarkerData.marker);
                                        }
                                        trip.setVisible(true);
                                        self.generateTrip();
                                    });
                                    cardButton.mouseEnter();
                                    cardButton.mouseLeave();

                                    
                                    //tworzenie karty i dodanie do taba
                                    var card = createCard(MarkerData, cardButton);
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
                    trip.setVisible(true);
                }
            });
        });

    };

    this.generateTrip = function (/*travelMode*/) {
        console.log('generateTrip');

        var waypoints = trip.getWaypoints().map(function (item) {
            return {
                location: item.position,
                stopover: true
            };
        });

        services.directions.route({
            origin: trip.getStart().position,
            destination: trip.getEnd().position,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING
        }, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                services.directionsDisplay.setMap(services.map);
                services.directionsDisplay.setDirections(response);
            }
        });
    };

    // -----

    this.addToTripMark = function (markIt, action) {
        console.log('addToTripMark');
        return markerFactory.create(markIt, function (place, marker) {
            services.places.details(place, function (details) {
                var infodiv = document.createElement('div');
                infodiv.innerHTML = GenerateContent(details);

                var placeButton = buttonFactory.createAddRemoveButton('Dodaj do trasy',
                    'Dodano do trasy',
                    'Usuń z trasy',
                    trip.contains(marker) ? 'done' : 'add');
                placeButton.onClick(function () {
                    if (!trip.contains(marker)) {
                        trip.addPlace(marker);
                    } else {
                        trip.removePlace(marker);
                    }
                    infowindow.close();
                    self.generateTrip();
                    action && action();
                });

                placeButton.mouseEnter();
                placeButton.mouseLeave();

                infodiv.appendChild(placeButton.getContent());

                infowindow.setContent(infodiv);
                infowindow.open(services.map, marker);
            });
        });
    };

    var services = new Services(this.chooseStartEnd);
    var buttonFactory = new ButtonFactory();
    var markerFactory = new MarkerFactory(services);
    var infowindow = new google.maps.InfoWindow({ maxWidth: 240 });
    var markers = new MarkerCollections();
    var trip = null;
    var self = this;
}
