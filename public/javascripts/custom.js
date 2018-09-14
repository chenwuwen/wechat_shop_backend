

/*=============================================================
    Authour URI: www.binarytheme.com
    License: Commons Attribution 3.0

    http://creativecommons.org/licenses/by/3.0/

    100% Free To use For Personal And Commercial Use.
    IN EXCHANGE JUST GIVE US CREDIT US AND TELL YOUR FRIENDS ABOUT US
   
    ========================================================  */

(function ($) {
    "use strict";
    var mainApp = {

        main_fun: function () {
            /*====================================
               SLIDER SCRIPTS
               ======================================*/
            $('#carousel-slider').carousel({
                interval: 3000 //TIME IN MILLI SECONDS
            })
            /*====================================
                SCROLLING SCRIPTS
                ======================================*/

            $(function () {
                $('.scrollclass a').bind('click', function (event) { //just pass scrollclass in design and start scrolling
                    var $anchor = $(this);
                    $('html, body').stop().animate({
                        scrollTop: $($anchor.attr('href')).offset().top
                    }, 1200, 'easeInOutExpo');
                    event.preventDefault();
                });
            });
            /*====================================
            VAGAS SLIDESHOW SCRIPTS
            ======================================*/
            $(function () {
                $.vegas('slideshow', {
                    backgrounds: [
                      { src: '../images/1.jpg', fade: 1000, delay: 9000 },
                      { src: '../images/2.jpg', fade: 1000, delay: 9000 },
                        
                     
                    ]
                })('overlay', {
                    /** SLIDESHOW OVERLAY IMAGE **/
                    src: '../images/03.png' // THERE ARE TOTAL 01 TO 15 .png IMAGES AT THE PATH GIVEN, WHICH YOU CAN USE HERE
                });

            });

          

            /*====================================
               WRITE YOUR SCRIPTS BELOW 
           ======================================*/





        },

        initialization: function () {
            mainApp.main_fun();

        }

    }
    // Initializing ///

    $(document).ready(function () {
        mainApp.main_fun();
    });

}(jQuery));



