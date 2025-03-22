// Template Name: Visuals
// Template URL: https://techpedia.co.uk/template/visuals
// Description: Visual Entertainment Streaming And Blog
// Version: 1.0.0
(function (window, document, $, undefined) {
  "use strict";
  var Init = {
    i: function (e) {
      Init.s();
      Init.methods();
    },
    s: function (e) {
      (this._window = $(window)),
        (this._document = $(document)),
        (this._body = $("body")),
        (this._html = $("html"));
    },
    methods: function (e) {
      Init.w();
      Init.BackToTop();
      Init.preloader();
      Init.animation();
      Init.hamburgerMenu();
      Init.slickSlider();
      Init.formValidation();
      Init.searchFunction();
      Init.continueEmail();
      Init.backToLogin();
      Init.videoPlay();
      Init.VideoPlayer();
      Init.VideoPlayerHeight();
      Init.countdownInit(".countdown", "2025/10/15");
      Init.searchInput();
    },
    w: function (e) {
      this._window.on("load", Init.l).on("scroll", Init.res);
    },
    BackToTop: function () {
      var btn = $("#backto-top");
      $(window).on("scroll", function () {
        if ($(window).scrollTop() > 300) {
          btn.addClass("show");
        } else {
          btn.removeClass("show");
        }
      });
      btn.on("click", function (e) {
        e.preventDefault();
        $("html, body").animate(
          {
            scrollTop: 0,
          },
          "300"
        );
      });
    },
    preloader: function () {
      setTimeout(function () { $('#preloader').hide('slow') }, 2000);
    },
    searchFunction: function () {
      if ($("#searchInput").length) {
        $("#searchInput").on("keyup", function () {
          var value = $(this).val().toLowerCase();
          $(".item-card").filter(function () {
            var hasMatch = $(this).find(".title").text().toLowerCase().indexOf(value) > -1;
            $(this).toggle(hasMatch);
          });
        });
      }
    },
    countdownInit: function (countdownSelector, countdownTime) {
      var eventCounter = $(countdownSelector);
      if (eventCounter.length) {
        eventCounter.countdown(countdownTime, function (e) {
          $(this).html(
            e.strftime(
              '<li>%D<span>Days</span></li>\
              <li>%H<span>Hrs</span></li>\
              <li>%M<span>Min</span></li>\
              <li class="m-0">%S<span>Sec</span></li>'
            )
          );
        });
      }
    },
    slickSlider: function (e) {
      if ($(".full-page-slider").length) {
        $(".full-page-slider").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
          centerPadding: '0',
          autoplay: false,
          autoplaySpeed: 3000,
          responsive: [
            {
              breakpoint: 1480,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".hero-banner-1").length) {
        $(".hero-banner-1").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerMode: false,
          infinite: true,
          swipeToSlide: true,
          draggable: true,
          touchThreshold: 10,
          variableWidth: true,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                centerMode: true,
              },
            },
            {
              breakpoint: 575,
              settings: {
                centerMode: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                variableWidth: false,
              },
            },
          ],
        });
      }
      if ($(".hero-banner-slider-2").length) {
        $(".hero-banner-slider-2").slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          centerPadding: '0',
          centerMode: true,
          autoplay: true,
          cssEase: 'linear',
          fade: true,
          autoplaySpeed: 2000,
          infinite: true,
          swipeToSlide: true,
        });
      }
      if ($(".rated-slider").length) {
        $(".rated-slider").slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '12',
          centerMode: false,
          autoplay: true,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".reviews-slider").length) {
        $(".reviews-slider").slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          centerMode: false,
          autoplay: false,
          cssEase: 'linear',
          autoplaySpeed: 2000,
        });
      }
      if ($(".suggestion-slider-1").length) {
        $(".suggestion-slider-1").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '12',
          centerMode: true,
          autoplay: false,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
            {
              breakpoint: 492,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".suggestion-slider-2").length) {
        $(".suggestion-slider-2").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
          centerPadding: '12',
          centerMode: true,
          autoplay: false,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
              },
            },
            {
              breakpoint: 492,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      if ($(".movie-slider").length) {
        $(".movie-slider").slick({
          infinite: true,
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
          centerPadding: '30',
          centerMode: true,
          autoplay: true,
          cssEase: 'linear',
          autoplaySpeed: 2000,
          responsive: [
            {
              breakpoint: 1399,
              settings: {
                slidesToShow: 3,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
              },
            },
            {
              breakpoint: 492,
              settings: {
                slidesToShow: 1,
              },
            },
          ],
        });
      }
      $(".prev-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickPrev");
      });

      $(".next-btn").click(function () {
        var $this = $(this).attr("data-slide");
        $('.' + $this).slick("slickNext");
      });
    },
    animation: function () {
      $('.item').on('click', function () {
        $('.item').removeClass('active','slow');
        $(this).addClass('active','slow');
      })
      var hover = $('.animition-set');
      hover.mouseover(function(){
        var x = $(this).position();
        var display = $(this).attr('display-arial');
        if(display == 'false'){
          $(this).attr('display-arial','true');
          $('.manga-popup').css({
          opacity : 1,
          top: x.top, left: x.left,
          });
        }
      })
      hover.mousedown(function(){
        $(this).attr('display-arial','false');
        $('.manga-popup').css({
          opacity : 0,
        });
      })
    },
    hamburgerMenu: function () {
      if ($(".hamburger-menu").length) {
        $('.hamburger-menu').on('click', function() {
          $('.bar').toggleClass('animate');
          $('.mobile-navar').toggleClass('active');
          return false;
        })
        $('.has-children').on ('click', function() {
             $(this).children('ul').slideToggle('slow', 'swing');
             $('.icon-arrow').toggleClass('open');
        });
      }
    },
    VideoPlayerHeight: function () {
      if ($(".aks-vp-start").length) {
        $('.aks-vp-start').on('click', function () {
          $('.videoplayer').removeClass('col-lg-6');
          $('.videoplayer').addClass('col-lg-12','slow');
          $('.videoplayer').removeClass('no_variable_height');
          $('.videoplayer').addClass('variable_height','slow');
        })
      }
    },
    VideoPlayer: function () {
      if ($("#video").length) {
        $("#video").aksVideoPlayer({
          file: [
              // {
              // file: "assets/media/videos/video-1080.mp4",
              // label: "1080p"
              // },
              // {
              // file: "assets/media/videos/video-720.mp4",
              // label: "720p"
              // },
              // {
              // file: "assets/media/videos/video-540.mp4",
              // label: "540p"
              // },
              {
              file: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
              label: "360p"
              },
              {
              file: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
              label: "240p"
              }
          ],
          poster: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx101280-ezBXqEHi8pg0.jpg",
          forward: true,
        });
      }
    },
    videoPlay:function(){
      $('#videoModal').on('hidden.bs.modal', function () {
        $('#videoModal video').get(0).pause();
      });
      $("#closeVideoModalButton").click(function() {
        $("#videoModal").modal("hide");
      });
    },
    searchInput: function(){
      let inputBox = document.querySelector('.input-box'),
      searchIcon = document.querySelector('.search'),
      closeIcon = document.querySelector('.close-icon');
      searchIcon.addEventListener('click', () => {
        inputBox.classList.add('open');
      });
      closeIcon.addEventListener('click', () => {
        inputBox.classList.remove('open');
      });
    },
    continueEmail: function () {
      $('#continue-email').on('click',function(){
        $('.hide-link').hide()
        $('.login-sec').show()
      })
    },
    backToLogin: function () {
      $('#backtologin').on('click',function(){
        $('.hide-form').hide()
        $('.hide-link').show()
      })
    },
    formValidation: function () {
      if ($(".contact-form").length) {
        $(".contact-form").validate();
      }
      if ($(".signup-form").length) {
        $(".signup-form").validate();
      }
    },
  }
  Init.i();
})(window, document, jQuery);

/*document.addEventListener("DOMContentLoaded", async () => {
  const API_URL = "https://natomanga-graphql-api.onrender.com/api?page=1";
  const featuredContainer = document.querySelector(".featured .row");

  try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
          featuredContainer.innerHTML = ""; // Clear existing content

          data.data.forEach(anime => {
              const animeCard = `
                  <div class="col-xl-3 col-lg-4 col-md-6">
                      <div class="featured-card mb-24">
                          <img src="https://natomanga-graphql-api.onrender.com/proxy-image?url=${anime.snapshot}" alt="${anime.anime_title}">
                          <div class="content">
                              <a href="anime.html/${anime.anime_session}">
                                  <h3 class="color-white mb-32">${anime.anime_title}</h3>
                              </a>
                              <ul class="card-tag-st unstyled">
                                  <li><h5 class="color-primary">New</h5></li>
                                  <li class="tag"><h6>Episode ${anime.episode}</h6></li>
                                  <li class="tag"><h6 class="color-primary">HD</h6></li>
                                  <li class="tag"><h6>${anime.fansub}</h6></li>
                              </ul>
                              <div class="d-flex align-items-center">
                                  <a href="play.html/${anime.anime_session}/${anime.session}" class="cus-btn filled">
                                      <i class="far fa-play"></i>Play
                                  </a>
                                  <a href="anime.html/${anime.anime_session}" class="cus-btn bordered ms-16">
                                      <i class="fal fa-info-circle"></i>More Info
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              `;
              featuredContainer.insertAdjacentHTML("beforeend", animeCard);
          });
      } else {
          featuredContainer.innerHTML = "<p class='color-white'>No anime found.</p>";
      }
  } catch (error) {
      console.error("Error fetching anime data:", error);
      featuredContainer.innerHTML = "<p class='color-white'>Failed to load anime data.</p>";
  }
});*/