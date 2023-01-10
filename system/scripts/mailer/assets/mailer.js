document.addEventListener("DOMContentLoaded", function() {

    if ($(".captcha-feld")[0]) {
        var possibleCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var defaults = {
            selector: "#captcha",
            text: null,
            randomText: true,
            randomColours: false,
            width: 200,
            height: 50,
            colour1: "#cccccc",
            colour2: "#333333",
            font: 'normal 40px "Comic Sans MS", sans-serif',
            onSuccess: function () {
                alert('Correct!');
            },
            onFailure: function () {
                alert('wrong!');
            }
        };

        var CAPTCHA = function (config) {
            var that = this;
            this._settings = $.extend({}, defaults, config || {});
            this._container = $(this._settings.selector);

            var canvasWrapper = $('<div>').prependTo(this._container);
            this._canvas = $('<canvas>').appendTo(canvasWrapper).attr("width", this._settings.width).attr("height", this._settings.height);

            this._input = this._container.find('.user-text').on('keypress.captcha', function (e) {
                if (e.which == 13) {
                    that.validate(that._input.val());
                }
            });

            this._button = this._container.find('.validate')
                .on('click.captcha', function () {
                    that.validate(that._input.val());
                });

            this._buttonRefresh = this._container.find('.refresh')
                .on('click.captcha', function () {
                    that.generate();
                });

            this._context = this._canvas.get(0).getContext("2d");
        };

        CAPTCHA.prototype = {
            generate: function () {
                var context = this._context;

                if (this._settings.text == null || this._settings.text == '') {
                    this._settings.randomText = true;
                }

                if (this._settings.randomText) {
                    this._generateRandomText();
                }

                if (this._settings.randomColours) {
                    this._settings.colour1 = this._generateRandomColour();
                    this._settings.colour2 = this._generateRandomColour();
                }

                var gradient1 = context.createLinearGradient(0, 0, this._settings.width, 0);
                gradient1.addColorStop(0, this._settings.colour1);
                gradient1.addColorStop(1, this._settings.colour2);

                context.fillStyle = gradient1;
                context.fillRect(0, 0, this._settings.width, this._settings.height);

                context.fillStyle = "#ffffff";
                context.fillRect(0, 0, this._settings.width, this._settings.height);

                var gradient2 = context.createLinearGradient(0, 0, this._settings.width, 0);
                gradient2.addColorStop(0, this._settings.colour2);
                gradient2.addColorStop(1, this._settings.colour1);

                context.font = this._settings.font;
                context.fillStyle = gradient2;

                context.setTransform((Math.random() / 10) + 0.9, //scalex
                    0.1 - (Math.random() / 10), //skewx
                    0.1 - (Math.random() / 10), //skewy
                    (Math.random() / 10) + 0.9, //scaley
                    (Math.random() * 20) + 10, //transx
                    35); //transy

                context.fillText(this._settings.text, 0, 0);
                context.setTransform(1, 0, 0, 1, 0, 0);
                var numRandomCurves = Math.floor((Math.random() * 3) + 5);

                for (var i = 0; i < numRandomCurves; i++) {
                    this._drawRandomCurve();
                }
            },

            validate: function (userText) {
                if (userText === this._settings.text) {
                    this._settings.onSuccess();
                } else {
                    this._settings.onFailure();
                }
            },

            getText: function () {
                return this._settings.text;
            },

            _drawRandomCurve: function () {
                var ctx = this._context;

                var gradient1 = ctx.createLinearGradient(0, 0, this._settings.width, 0);
                gradient1.addColorStop(0, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);
                gradient1.addColorStop(1, Math.random() < 0.5 ? this._settings.colour1 : this._settings.colour2);

                ctx.lineWidth = Math.floor((Math.random() * 2) + 1);
                ctx.strokeStyle = gradient1;
                ctx.beginPath();
                ctx.moveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
                ctx.bezierCurveTo(Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                    Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)),
                    Math.floor((Math.random() * this._settings.width)), Math.floor((Math.random() * this._settings.height)));
                ctx.stroke();
            },

            _generateRandomText: function () {
                this._settings.text = '';
                var length = Math.floor((Math.random() * 0) + 5);
                for (var i = 0; i < length; i++) {
                    this._settings.text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                }
            },

            _generateRandomColour: function () {
                return "rgb(" + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ", " + Math.floor((Math.random() * 255)) + ")";
            }
        };
        $.Captcha = CAPTCHA || {};
    }

    if ($(".captcha-feld")[0]) {
        var wrapper = jQuery(".send-form").closest(".formular-wrapper");
        var tmp_form = wrapper.find("form");

        document.body.scrollTop; //force css repaint to ensure cssom is ready
        var timeout; //global timout variable that holds reference to timer
        var captcha = new $.Captcha({
            onFailure: function () {
                $(".captcha-container .wrong").show({
                    duration: 30,
                    done: function () {
                        var that = this;
                        clearTimeout(timeout);
                        $(this).removeClass("shake");
                        $(this).css("animation");

                        //Browser Reflow(repaint?): hacky way to ensure removal of css properties after removeclass
                        $(this).addClass("shake");
                        var time = parseFloat($(this).css("animation-duration")) * 1000;
                        timeout = setTimeout(function () {
                            $(that).removeClass("shake");
                        }, time);
                    }
                });
            },
            onSuccess: function () {
                var action = tmp_form.attr('action');
                var formData = tmp_form.serializeArray();
                var rsan = jQuery('#rsan').val();
                var rsae = jQuery('#rsae').val();
                var rsa = new RSAKey();
                rsa.setPublic(rsan, rsae);
                var captcha_encoded = rsa.encrypt(captcha.getText());
                formData.push({name: "captcha_encoded", value: captcha_encoded});

                jQuery.post(action, formData, function (data) {
                    if (data.status == "OK") {
                        tmp_form.hide();
                        wrapper.find(".thank-you").fadeIn();
                    }
                }, "json");
            }
        });
        captcha.generate();

        jQuery(".send-form").on("click", function (e) {
            e.preventDefault();
            if (tmp_form.valid()) {
                jQuery(".validate").trigger("click");
            } else {
                return false;
            }
        });
    }
});