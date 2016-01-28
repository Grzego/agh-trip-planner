function CardData(markerData) {
    var self = this;

    var card = document.createElement("div");
    card.className = "card small";
    card.style.maxHeight = "260px";

    if (markerData.place.photos) {
        var photoURL = markerData.place.photos[0].getUrl({ 'maxWidth': 400, 'maxHeight': 400 });
        var image = document.createElement('div');
        image.onclick = function () { self.onClick(); };
        image.className = 'card-image waves-effect waves-block waves-light';
        image.innerHTML = "<img class=\"activator\" src=\"" + photoURL + "\"/></div>";
        card.appendChild(image);            
    }
    var title = document.createElement('div');
    title.onclick = function () { self.onClick(); };
    title.className = 'card-content';
    title.style = 'max-height:70px';
    title.innerHTML = "<span class=\"card-title activator grey-text text-darken-4\"><i class=\"material-icons right\">more_vert</i>" +
                        "<p style=\"font-size:15px; line-height: 17px\"><b>" +
                        markerData.place.name + "</b></p></span>";
    card.appendChild(title);

    // ---

    var cardReveal = document.createElement("div");
    cardReveal.className = "card-reveal";
    card.appendChild(cardReveal);

    // -----

    this.onClick = null;

    // -----

    this.setContent = function (content) {
        cardReveal.innerHTML = "<span class=\"card-title grey-text text-darken-4\"><i class=\"material-icons right\">close</i>" +
                        "<p style=\"font-size:15px; line-height: 17px\"><b>" + markerData.place.name + "</b></p></span>" +
                        "<p>" + content + "</p>";
    };

    // -----

    this.appendButton = function (button) {
        cardReveal.appendChild(button.getContent());
    };

    // -----

    this.getContent = function () {
        return card;
    };
};

// -----

var CardFactory = new function () {
    var self = this;
    var cards = {};

    // -----

    this.createCard = function (markerData) {
        if (!cards[markerData.place.place_id]) {
            cards[markerData.place.place_id] = new CardData(markerData);
            return cards[markerData.place.place_id];
        } else {
            return cards[markerData.place.place_id];
        }
    };
};