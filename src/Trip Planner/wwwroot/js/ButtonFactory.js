function Button(button, onClickAction, mouseEnterAction, mouseLeaveAction, getContentAction) {
    this.onClick = function (action) {
        $(button).click(function () {
            onClickAction && onClickAction(action);
        });
    },

    this.mouseEnter = function (action) {
        $(button).mouseenter(function () {
            mouseEnterAction && mouseEnterAction(action);
        });
    },

    this.mouseLeave = function (action) {
        $(button).mouseleave(function () {
            mouseLeaveAction && mouseLeaveAction(action);
        });
    },

    this.getContent = getContentAction;
};


// -----


var ButtonFactory = new function () {
    this.createAddRemoveButton = function (defaultText, addText, removeText, state) {
        var content = document.createElement('div');

        // -----

        var states = {
            'add': {
                iconHTML: 'add',
                buttonClass: 'btn-floating waves-effect waves-light green z-depth-0',
                labelHTML: ' ' + defaultText
            },
            'done': {
                iconHTML: 'done',
                buttonClass: 'btn-floating waves-effect waves-light green z-depth-0',
                labelHTML: ' ' + addText
            },
            'delete': {
                iconHTML: 'delete',
                buttonClass: 'btn-floating waves-effect waves-light red z-depth-0',
                labelHTML: ' ' + removeText
            }
        };

        var currentState = state || 'add';

        // -----

        var icon = document.createElement('i');
        icon.className = 'material-icons';

        var button = document.createElement('a');
        button.appendChild(icon);

        var label = document.createElement('label');
        label.style.fontSize = "16px";

        // --

        content.appendChild(button);
        content.appendChild(label);

        // -----

        var changeState = function () {
            icon.innerHTML = states[currentState].iconHTML;
            button.className = states[currentState].buttonClass;
            label.innerHTML = ' ' + states[currentState].labelHTML;
        };

        changeState();

        // -----

        return new Button(button,
            function (action) {
                action && action();
                if (currentState === 'add') {
                    currentState = 'done';
                } else {
                    currentState = 'add';
                }
                // -----
                changeState();
            },
            function (action) {
                action && action();
                if (currentState === 'done') {
                    currentState = 'delete';
                    changeState();
                }
            },
            function (action) {
                action && action();
                if (currentState === 'delete') {
                    currentState = 'done';
                    changeState();
                }
            },
            function () {
                return content;
            });
    };

    this.createAddButton = function (defaultText) {
        console.log('createAddButton');

        var content = document.createElement('div');

        // -----

        var icon = document.createElement('i');
        icon.className = 'material-icons';
        icon.innerHTML = 'add';

        var button = document.createElement('a');
        button.className = 'btn-floating waves-effect waves-light green z-depth-0';
        button.appendChild(icon);

        var label = document.createElement('label');
        label.style.fontSize = "16px";
        label.innerHTML = ' ' + defaultText;

        // --

        content.appendChild(button);
        content.appendChild(label);

        // -----

        return new Button(button,
            function (action) {
                action && action();
            },
            function (action) {
                action && action();
            },
            function (action) {
                action && action();
            },
            function () {
                return content;
            });
    };
};


function hideButton (button) {
    document.getElementById(button).style.visibility = "hidden";
};

function showButton (button) {
    document.getElementById(button).style.visibility = "visible";
};