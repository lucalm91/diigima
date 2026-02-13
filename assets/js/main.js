/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Lazy load fade-in
		$('img[loading="lazy"]').each(function() {
			if (this.complete) {
				$(this).addClass('loaded');
			} else {
				$(this).on('load', function() {
					$(this).addClass('loaded');
				});
			}
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			if (window.location.hash) {
				// If there's a hash, use helper class to disable BG transitions
				$body.addClass('instant-load');
				$body.removeClass('is-preload');
				
				// Remove helper class shortly after so future updates (if any) animate normally
				setTimeout(function() {
					$body.removeClass('instant-load');
				}, 100);
			} else {
				// Normal behavior for homepage: wait 100ms then animate fade-in
				window.setTimeout(function() {
					$body.removeClass('is-preload');
				}, 100);
			}

			// Show delayed content on user interaction
			var $delayedContent = $('#delayed-content');
			var contentShown = false;

			var showContent = function(event) {
				// Prevent showing content if clicking on the video player
				if (event.type === 'click' || event.type === 'touchstart') {
					if ($(event.target).closest('media-player').length > 0) {
						return;
					}
				}

				if (contentShown) return;
				contentShown = true;
				$delayedContent.css('opacity', 0).slideDown(1000).animate({ opacity: 1 }, { queue: false, duration: 1000 });
				
				// Remove listeners
				$window.off('scroll', showContent);
				$window.off('wheel', showContent);
				$body.off('click', showContent);
				$body.off('touchstart', showContent);
				$body.off('touchmove', showContent);
			};

			$window.on('scroll', showContent);
			$window.on('wheel', showContent);
			$body.on('click', showContent);
			$body.on('touchstart', showContent);
			$body.on('touchmove', showContent);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false,
			hideTimeout = null,
			articleTimeout = null,
			unlockTimeout = null;

		// Methods.
			$main._show = function(id, initial) {

				// Clear pending timeouts
				clearTimeout(hideTimeout);
				clearTimeout(articleTimeout);
				clearTimeout(unlockTimeout);

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Update Desktop Nav Active State
				$('#desktop-nav ul li a').removeClass('active');
				$('#desktop-nav ul li a[href="#' + id + '"]').addClass('active');
				
				// Set Desktop Nav to compact state
				$('#desktop-nav').addClass('scrolled');

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');
								$body.addClass('is-layout-ready');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');
								$main_articles.hide();

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							hideTimeout = setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									articleTimeout = setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											window.scrollTo(0, 0);
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											unlockTimeout = setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							hideTimeout = setTimeout(function() {
								
								$body.addClass('is-layout-ready');

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									articleTimeout = setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											window.scrollTo(0, 0);
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											unlockTimeout = setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				// Clear pending timeouts
				clearTimeout(hideTimeout);
				clearTimeout(articleTimeout);
				clearTimeout(unlockTimeout);

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Remove Desktop Nav Active State
				$('#desktop-nav ul li a').removeClass('active');

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');
								$body.removeClass('is-layout-ready');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');
							
							// Trigger scroll event to update nav bar
							$window.trigger('scroll');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					hideTimeout = setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							articleTimeout = setTimeout(function() {

								$body.removeClass('is-article-visible');
								$body.removeClass('is-layout-ready');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');
								
								// Trigger scroll event to update nav bar
								$window.trigger('scroll');

								// Unlock.
									unlockTimeout = setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
				/*
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});
				*/

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// --- New Navigation Logic ---

		// Desktop Top Bar Scroll Effect
		$window.on('scroll', function() {
			// Keep nav compact if:
			// 1. An article is visible
			// 2. User has scrolled down
			// 3. There is a hash in the URL (implies we are navigating to/in an article)
			if ($body.hasClass('is-article-visible') || $window.scrollTop() > 10 || (window.location.hash && window.location.hash !== '#' && window.location.hash !== '')) {
				$('#desktop-nav').addClass('scrolled');
			} else {
				$('#desktop-nav').removeClass('scrolled');
			}
		});

		// Prevent clicks on desktop nav from bubbling to body (which would close the article)
		$('#desktop-nav').on('click', function(event) {
			event.stopPropagation();
		});

		// Mobile Menu Toggle
		var $mobileMenuToggle = $('#mobile-menu-toggle');
		var $mobileMenuOverlay = $('#mobile-menu-overlay');
		var $mobileMenuClose = $('.close-menu-bottom');
		var $mobileMenuLinks = $('#mobile-menu-overlay ul li a');
		var $mobileMenuLogo = $('#mobile-menu-overlay .mobile-nav-logo');

		$mobileMenuToggle.on('click', function(event) {
			event.stopPropagation();
			if ($mobileMenuOverlay.hasClass('active')) {
				$mobileMenuOverlay.removeClass('active');
				$body.css('overflow', '');
			} else {
				$mobileMenuOverlay.addClass('active');
				$body.css('overflow', 'hidden');
			}
		});

		$mobileMenuClose.on('click', function() {
			$mobileMenuOverlay.removeClass('active');
			$body.css('overflow', '');
		});

		// Close mobile menu when a link is clicked
		$mobileMenuLinks.on('click', function() {
			$mobileMenuOverlay.removeClass('active');
			$body.css('overflow', '');
			
			// Force scroll to top when navigating from menu
			if ($body.hasClass('is-article-visible')) {
				window.scrollTo(0, 0);
				setTimeout(function() { window.scrollTo(0, 0); }, 50);
			}

			// The default hashchange event will handle the rest
		});

		// Mobile Logo: Go to home, close menu
		$mobileMenuLogo.on('click', function(event) {
			event.stopPropagation();
			$mobileMenuOverlay.removeClass('active');
			$body.css('overflow', '');
			// Default action (href="#") will trigger hashchange -> close article.
		});

		// Smooth Scrolling for Internal Links (non-article anchors)
		$('a[href^="#"]').on('click', function(event) {
			var targetId = this.getAttribute('href');
			
			// Ignore generic '#' or empty
			if (!targetId || targetId === '#') return;
			
			// If target is one of the main articles, let the existing logic handle it
			if ($main_articles.filter(targetId).length > 0) return;

			// Otherwise, if element exists, smooth scroll to it
			var $target = $(targetId);
			if ($target.length) {
				event.preventDefault();
				$('html, body').stop().animate({
					scrollTop: $target.offset().top - 100 // Offset for sticky header
				}, 1000, 'swing'); 
			}
		});

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#') {
					// Pre-emptively set nav to scrolled to avoid jump
					$('#desktop-nav').addClass('scrolled');
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
				}

})(jQuery);
