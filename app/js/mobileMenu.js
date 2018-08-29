(function ($) {
	$.fn.mobileMenu = function (options) {
		var options = $.extend({}, {
			menuIconClassName: ".menu-icon",
			mobileResolution: 900,
			menuType: "fixed",
			offsetToSticky: 50,
			closeIconClassName: ".close-menu-icon"
		}, options);

		var $menu = $(this);
		var $menuList = $menu.find("ul");
		var $menuLinks = $menu.find("a");
		var $menuIcon = $(options.menuIconClassName);
		var $closeIcon = $(options.closeIconClassName);
		var currentMenuHeight = $menu.outerHeight();
		var documentWidth = $(document).width();
		var menuHeightFixed;
		var menuIsOpened = false;
		var offset = 0;
		var scrollPos = 0;

		if (options.menuType == "sticky" && documentWidth >= options.mobileResolution) {
			$menu.addClass("sticky-menu");
			currentMenuHeight = $menu.outerHeight() * 2;
			console.log(currentMenuHeight);
			menuHeightFixed = currentMenuHeight;
			offset = currentMenuHeight;
			setTimeout(function () {
				$menu.removeClass("sticky-menu");
			}, 1)
		} else if (options.menuType == "fixed") {
			currentMenuHeight = $menu.outerHeight();
			offset = currentMenuHeight;
		}

		$(window).on("resize", onResizeChangeState);
		$menuIcon.on("click", onClickChangeState);
		$(document).on("scroll", onScroll);
		$menuLinks.on("click", scrollTo);

		if ($closeIcon) {
			$closeIcon.on("click", function () {
				if (menuIsOpened) {
					hideMenu();
				}
			});
		}

		function onClickChangeState(event) {
			if (!menuIsOpened) {
				showMenu();
			} else {
				hideMenu();
			}
		}

		function onResizeChangeState(event) {
			documentWidth = $(document).width();
			if (!menuIsOpened && $(document).width() > options.mobileResolution) {
				showMenu();
			} else if (menuIsOpened && $(document).width() <= options.mobileResolution) {
				hideMenu();
			}
		}

		function onScroll(event) {
			scrollPos = $(document).scrollTop();
			if (options.menuType == "sticky" && documentWidth >= options.mobileResolution) {
				fixedMenu();
			}
			$menuLinks.each(function () {
				var currLink = $(this);
				var refElement = $(currLink.attr("href"));
				if (refElement.position().top <= scrollPos + offset && refElement.position().top + refElement.height() > scrollPos) {
					$menuLinks.removeClass("active");
					currLink.addClass("active");
				} else {
					currLink.removeClass("active");
				}
			});
		}

		function scrollTo(event) {
			var target = this.hash;
			var $target = $(target);
			event.preventDefault();
			if (documentWidth <= options.mobileResolution) {
				hideMenu();
			}
			$menuLinks.each(function () {
				$(this).removeClass("active");
			})
			$(this).addClass("active");

			$("html, body").stop().animate({
				'scrollTop': $target.offset().top - offset
			}, 500, "swing", function () {});
		}

		function fixedMenu() {
			if (scrollPos > options.offsetToSticky) {
				$menu.addClass("sticky-menu");
				currentMenuHeight = $menu.outerHeight();
			} else {
				$menu.removeClass("sticky-menu");
				currentMenuHeight = menuHeightFixed;
			}
			offset = currentMenuHeight;
		}

		function showMenu() {
			$menuList.css("display", "flex");
			menuIsOpened = true;
		}

		function hideMenu() {
			$menuList.css("display", "none");
			menuIsOpened = false;
		}

		return this;
	};
})(jQuery);
