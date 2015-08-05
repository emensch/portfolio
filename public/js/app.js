(function() {
    var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var width = canvas.width;
    var height = canvas.height;

    var totalPixels = width*height;

    var starfield = [];

    var star = function (x, y, brightness, size, speed) {
        this.x = x;
        this.y = y;
        this.brightness = brightness;
        this.size = size;
        this.speed = speed;
    }

    var starFactory = {
        x1: 0,
        y1: 0,
        x2: width,
        y2: height,

        brightStar: function () {
            var x = this._getRandomX();
            var y = this._getRandomY();
            var brightness = 0.4;
            var size = 3; 
            var speed = 0.15;
            return new star(x, y, brightness, size, speed);
        },

        mediumStar: function() {
            var x = this._getRandomX();
            var y = this._getRandomY();
            var brightness = 0.3;
            var size = 3; 
            var speed = 0.1;
            return new star(x, y, brightness, size, speed);           
        },

        darkStar: function () {
            var x = this._getRandomX();
            var y = this._getRandomY();
            var brightness = 0.2;
            var size = 2;
            var speed = 0.05;
            return new star(x, y, brightness, size, speed);
        },

        setArea: function (x1, y1, x2, y2) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        },

        getArea: function () {
            return (this.x2 - this.x1) * (this.y2 - this.y1)
        },

        _getRandomX: function () {
            return Math.floor(Math.random() * (this.x2 - this.x1) + this.x1);
        },

        _getRandomY: function () {
            return Math.floor(Math.random() * (this.y2 - this.y1) + this.y1);
        }
    }

    function populateField() {
        var area = starFactory.getArea();

        var numBrightStars = Math.floor(area * 0.00006);
        var numMediumStars = Math.floor(area * 0.00008);
        var numDarkStars = Math.floor(area * 0.000225);

        for (var i = 0; i < numBrightStars; i++) {
            starfield.push(starFactory.brightStar());
        }

        for (var i = 0; i < numMediumStars; i++) {
            starfield.push(starFactory.mediumStar());
        }

        for (var i = 0; i < numDarkStars; i++) {
            starfield.push(starFactory.darkStar());
        }
    }

    populateField();

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        x1 = width;
        y1 = height;
        x2 = canvas.width;
        y2 = canvas.height;
        dx = x2 - x1;
        dy = y2 - y1;

        if ((dx > 0) && (dy > 0)) { // width & height changed- two populates necessary 
            x1 = width;
            y1 = 0;
            x2 = canvas.width;
            y2 = canvas.height;
            starFactory.setArea(x1, y1, x2, y2);
            populateField();
            // Second rectangle to draw
            x1 = 0;
            y1 = height;
            x2 = width;
            y2 = canvas.height;
            starFactory.setArea(x1, y1, x2, y2);
            populateField();
        } else if (dx > 0) { // only width changed - one populate necessary
            x1 = width;
            y1 = 0;
            x2 = canvas.width;
            y2 = canvas.height;
            starFactory.setArea(x1, y1, x2, y2);
            populateField();
        } else if (dy > 0) { // only height changed - one populate necessary
            x1 = 0;
            y1 = height;
            x2 = canvas.width;
            y2 = canvas.height;
            starFactory.setArea(x1, y1, x2, y2);
            populateField();
        }

        if (dy < 0 || dx < 0) { // downsizing occured - remove overflowing stars
            var count = 0;
            for (var i = 0; i < starfield.length; i++) {
                s = starfield[i];

                if(s.x > canvas.width || s.y > canvas.height) {
                    starfield.splice(i, 1);
                }
            }
        }

        width = canvas.width;
        height = canvas.height;

        draw(); 
    }

    resizeCanvas();

    function draw() {
        ctx.fillStyle = '#FFFFFF';

        ctx.clearRect(0, 0, width, height);

        for (var i = 0; i < starfield.length; i++) {
            s = starfield[i];
            ctx.globalAlpha = s.brightness;
            ctx.fillRect(s.x, s.y, s.size, s.size);
        }      
    }

    function calcMovement() {
        for (var i = 0; i < starfield.length; i++) {
            s = starfield[i];

            newY = s.y+s.speed;

            if(newY > height) {
                if(newY-height > 1) { // Any large overflow is probably a resize - remove star
                    starfield.splice(i, 1);
                } else { // Otherwise, wrap
                    s.y = 0;
                    s.x = Math.floor(Math.random() * width);
                }
            } else {
                s.y = newY;
            }

        }
    }

    (function animloop() {
        requestAnimationFrame(animloop);
        calcMovement();
        draw();
    })();

})();