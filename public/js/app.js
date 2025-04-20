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
          arrows: true,
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
        $('.item').removeClass('active', 'slow');
        $(this).addClass('active', 'slow');
      })
      var hover = $('.animition-set');
      hover.mouseover(function () {
        var x = $(this).position();
        var display = $(this).attr('display-arial');
        if (display == 'false') {
          $(this).attr('display-arial', 'true');
          $('.manga-popup').css({
            opacity: 1,
            top: x.top, left: x.left,
          });
        }
      })
      hover.mousedown(function () {
        $(this).attr('display-arial', 'false');
        $('.manga-popup').css({
          opacity: 0,
        });
      })
    },
    hamburgerMenu: function () {
      if ($(".hamburger-menu").length) {
        $('.hamburger-menu').on('click', function () {
          $('.bar').toggleClass('animate');
          $('.mobile-navar').toggleClass('active');
          return false;
        })
        $('.has-children').on('click', function () {
          $(this).children('ul').slideToggle('slow', 'swing');
          $('.icon-arrow').toggleClass('open');
        });
      }
    },
    VideoPlayerHeight: function () {
      if ($(".aks-vp-start").length) {
        $('.aks-vp-start').on('click', function () {
          $('.videoplayer').removeClass('col-lg-6');
          $('.videoplayer').addClass('col-lg-12', 'slow');
          $('.videoplayer').removeClass('no_variable_height');
          $('.videoplayer').addClass('variable_height', 'slow');
        })
      }
    },
    VideoPlayer: function () {
      if ($("#video").length) {
        const videoSourcesElement = document.getElementById("video-sources");

        if (!videoSourcesElement) {
          console.error("No video sources script tag found.");
          return;
        }

        let videoSources;
        try {
          const rawJson = videoSourcesElement.textContent.trim();
          videoSources = JSON.parse(rawJson);
        } catch (error) {
          console.error("Error parsing video sources JSON:", error);
          console.error("Invalid JSON content:", videoSourcesElement.textContent);
          return;
        }

        if (!Array.isArray(videoSources) || videoSources.length === 0) {
          console.error("No valid video sources found.");
          return;
        }

        // Convert sources to the expected format
        const formattedSources = videoSources
          .filter(source => source.url && source.quality) // Ensure valid sources
          .map(source => ({
            file: `https://pahe.gojo.wtf/${encodeURIComponent(source.url)}&ref=https://kwik.si`,
            label: source.quality
          }));

        if (formattedSources.length === 0) {
          console.error("No valid video sources after filtering.");
          return;
        }

        console.log("Final formatted video sources:", formattedSources); // Debugging

        const animeCoverElement = document.getElementById("anime-cover");


        // Initialize aksVideoPlayer
        $("#video").aksVideoPlayer({
          file: formattedSources, // Dynamically set sources
          width: 640,
          height: 360,
          poster: animeCoverElement.textContent,
          forward: true,
          contextMenu: [
            {
              type: "urlCopy",
              label: "Copy Video Url",
              url: formattedSources.file
            },
            {
              type: "socialmedia",
              label: "Share on Social Media",
              socials: [
                {
                  label: "Facebook",
                  url: "https://ainztv.onrender.com/",
                  colorBg: "#0066ff",
                  color: "white",
                  icon:
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 20"><defs/><path d="M8.174 3.32H10V.14A23.66 23.66 0 007.34 0C4.709 0 2.906 1.656 2.906 4.7v2.8H0v3.555h2.905V20h3.56v-8.945h2.789L9.697 7.5H6.466V5.05c0-1.027.276-1.73 1.708-1.73z" fill-rule="evenodd"/></svg>'
                },
                {
                  label: "Twitter",
                  url: "https://ainztv.onrender.com/",
                  colorBg: "#0089ff",
                  color: "white",
                  icon:
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16"><defs/><path d="M17.944 3.987c.013.175.013.35.013.526C17.957 9.85 13.833 16 6.294 16c-2.322 0-4.48-.662-6.294-1.813.33.038.647.05.99.05 1.916 0 3.68-.637 5.089-1.725-1.802-.037-3.313-1.2-3.833-2.8.254.038.508.063.774.063.368 0 .736-.05 1.079-.137-1.878-.376-3.287-2-3.287-3.963v-.05c.546.3 1.18.488 1.853.512A4.02 4.02 0 01.838 2.775c0-.75.203-1.438.558-2.038a11.71 11.71 0 008.452 4.225 4.493 4.493 0 01-.102-.924c0-2.226 1.828-4.038 4.1-4.038 1.18 0 2.245.487 2.994 1.275A8.145 8.145 0 0019.442.3a4.038 4.038 0 01-1.802 2.225A8.316 8.316 0 0020 1.9a8.74 8.74 0 01-2.056 2.087z" fill-rule="evenodd"/></svg>'
                }
              ]
            },
            {
              type: "iframe",
              label: "Copy Iframe Code",
              iframe: "&lt;iframe&gt;&lt;/iframe&gt;"
            }
          ]
        });

        // If the player does not support M3U8, try HLS.js
        if (formattedSources.some(source => source.file.endsWith(".m3u8")) && Hls.isSupported()) {
          console.log("Using HLS.js for M3U8 playback...");
          const videoElement = document.getElementById("video");
          const hls = new Hls();
          hls.loadSource(formattedSources.find(src => src.file.endsWith(".m3u8")).file);
          hls.attachMedia(videoElement);
        }
      }
    },
    videoPlay: function () {
      $('#videoModal').on('hidden.bs.modal', function () {
        $('#videoModal video').get(0).pause();
      });
      $("#closeVideoModalButton").click(function () {
        $("#videoModal").modal("hide");
      });
    },
    searchInput: function () {
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
      $('#continue-email').on('click', function () {
        $('.hide-link').hide()
        $('.login-sec').show()
      })
    },
    backToLogin: function () {
      $('#backtologin').on('click', function () {
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

document.addEventListener("DOMContentLoaded", function () {
  const videoSourcesElement = document.getElementById("video-sources");

  if (!videoSourcesElement) {
    console.error("No video sources script tag found.");
    return;
  }

  let videoSources;
  try {
    videoSources = JSON.parse(videoSourcesElement.textContent.trim());
  } catch (error) {
    console.error("Error parsing video sources JSON:", error);
    console.error("Invalid JSON content:", videoSourcesElement.textContent);
    return;
  }

  if (!Array.isArray(videoSources) || videoSources.length === 0) {
    console.error("No valid video sources found.");
    return;
  }

  // Extract numeric quality from label
  const formattedSources = videoSources.map(source => {
    const match = source.quality.match(/(\d+)p/); // Extract quality number
    return {
      file: `https://pahe.gojo.wtf/${encodeURIComponent(source.url)}&ref=https://kwik.si`,
      label: match ? parseInt(match[1]) : 360 // Default to 360 if no match
    };
  }).sort((a, b) => b.label - a.label); // Sort by highest resolution first

  // Prioritize 1080p, fallback to the next best
  let selectedSource = formattedSources.find(src => src.label === 1080) || formattedSources[0];

  if (!selectedSource) {
    console.error("No valid video source found.");
    return;
  }

  console.log("Selected video source:", selectedSource);

  const animeCover = document.getElementById("anime-cover").textContent;
  const video = document.getElementById('player');

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(selectedSource.file);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      console.log("Available qualities:", formattedSources.map(src => src.label));

      // Set Plyr controls with quality selection
      const defaultOptions = {
        controls: [
          'play-large', 'rewind', 'play', 'fast-forward', 'progress',
          'current-time', 'duration', 'mute', 'volume', 'settings',
          'pip', 'fullscreen'
        ],
        quality: {
          default: selectedSource.label,
          options: formattedSources.map(src => src.label),
          forced: true,
          onChange: (newQuality) => updateQuality(newQuality)
        }
      };

      const plyr = new Plyr(video, defaultOptions);
      window.plyr = plyr;
      window.hls = hls;
    });
  }

  function updateQuality(newQuality) {
    if (!window.hls) return;

    const selected = formattedSources.find(src => src.label === newQuality);
    if (selected) {
      console.log(`Switching to quality: ${newQuality}`);
      window.hls.loadSource(selected.file);
      window.hls.attachMedia(video);
      window.plyr.play();
    }
  }
});

$(document).ready(function () {
  $('.videoplayer').on('click', function () {
    $(this).removeClass('col-lg-6').addClass('col-lg-12 slow');
    $(this).removeClass('no_variable_height').addClass('variable_height slow');
  });
});

