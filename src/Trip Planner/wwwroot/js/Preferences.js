function Preferences(app) {
    this.notify = function (kind) {
        self.hidePlaces();
        var node = document.getElementById("placesCards");

        if (!markers[kind]) {
            markers[kind] = new MarkerCollection();
            cards[kind] = [];

            app.services.places.nearbySearch({
                location: app.services.autocomplete.getPlace().geometry.location,
                radius: 20000,
                types: placeMap[kind]
            }, function (place) {
                var markerData = app.addToTripMark(place);
                markers[kind].append(markerData);

                //dodanie buttonow
                var cardButton = ButtonFactory.createAddRemoveButton('Dodaj do trasy',
                                                                'Dodano do trasy',
                                                                'Usuń z trasy',
                                                                app.trip.contains(markerData) ? 'done' : 'add');
                cardButton.onClick(function () {
                    if (!app.trip.contains(markerData)) {
                        app.trip.addPlace(markerData);
                    } else {
                        app.trip.removePlace(markerData);
                    }
                    app.trip.setVisible(true);
                    app.trip.generate(app.services);
                });
                cardButton.mouseEnter();
                cardButton.mouseLeave();


                //tworzenie karty i dodanie do taba
                var card = CardFactory.createCard(markerData);
                card.onClick = function () {
                    app.services.places.details(place.place_id, function (details) {
                        card.setContent(generateContentImageless(details));
                        card.appendButton(cardButton);
                    });
                };

                cards[kind].push(card);
                //---

                node.appendChild(card.getContent());
            });
        } else {
            // show this kind of markers
            markers[kind].visible(true);
            // append all cards
            for (var i = 0; i < cards[kind].length; ++i) {
                node.appendChild(cards[kind][i].getContent());
            }
        }
        

        //przelaczenie taba
        $('ul.tabs').tabs('select_tab', 'placesCards');
    };

    // -----

    this.hidePlaces = function () {
        // hide all markers
        for (var m in markers) {
            markers[m].visible(false);
        }
        // remove all cards
        var node = document.getElementById("placesCards");
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        app.trip.setVisible(true);
    };

    // -----

    var markers = {};
    var cards = {};

    var placeMap = {
        'Monuments': ['city_hall', 'point_of_interest'],
        'Museum': ['museum'],
        'Club': ['bar', 'cafe'],
        'Food': ['restaurant', 'meal_takeaway'],
        //'Art': ['art_gallery'],
        'Cinema': ['movie_theater'],
        //'Fun': ['amusement_park', 'zoo']
    };

    var self = this;
};