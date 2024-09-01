(function() {
  var youtube = document.querySelectorAll('.youtube');
  for (var i = 0; i < youtube.length; i++) {
    youtube[i].addEventListener('click', function() {
      var iframe = document.createElement('iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'autoplay');
      iframe.setAttribute('src', 'https://www.youtube.com/embed/' + this.dataset.embed + 
        '?rel=0&autoplay=1&modestbranding=1&controls=0&disablekb=1&fs=1&cc_load_policy=0&iv_load_policy=3&playsinline=1&muted=1');
      this.innerHTML = '';
      this.appendChild(iframe);

      // Ensure the YouTube IFrame API script is loaded
      if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      // Unmute the video after it starts playing
      var player;
      window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player(iframe, {
          events: {
            'onReady': function(event) {
              event.target.unMute();
            }
          }
        });
      };
    });
  }
})();
