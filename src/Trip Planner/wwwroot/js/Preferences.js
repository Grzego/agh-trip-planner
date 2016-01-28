function Preferences() {
    this.notify = function (kind) {
        // hide all other marks off
        // show markers in this kind
        // remove all cards from tab
        // add all cards in this kind

        if (!markers.contains(kind)) {
            services.places.nearbySearch({
                location: services.autocomplete.getPlace().geometry.location,
                radius: 20000,
                types: placeMap[kind]
            }, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var markerData = self.addToTripMark(results[i]);
                        markers[kind].push(markerData);

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
                        cardButton.mouseEnter();
                        cardButton.mouseLeave();


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
        //przelaczenie taba
        $('ul.tabs').tabs('select_tab', 'placesCards');
    };

    // -----

    var markers = {};

    var placeMap = {
        'Monuments': ['city_hall', 'point_of_interest'],
        'Museum': ['museum'],
        'Club': ['bar', 'cafe'],
        'Food': ['restaurant', 'meal_takeaway'],
        //'Art': ['art_gallery'],
        'Cinema': ['movie_theater'],
        //'Fun': ['amusement_park', 'zoo']
    };
};