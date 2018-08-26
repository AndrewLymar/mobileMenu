function mobileMenu(menuClassName, menuIconClassName, closeIconClassName, mobileResolution, isMenuFixed, isMenuSticky, offsetToSticky) {
	var $menu = $(menuClassName);
	var $menuList = $menu.find("ul");
	var $menuLinks = $menu.find("a");
	var $menuIcon = $(menuIconClassName);
	var $closeIcon = $(closeIconClassName);
	var currentMenuHeight = $menu.outerHeight();
	var menuHeightFixed;
	var documentWidth = $(document).width();
	var menuIsOpened = false;
	var offset = 0;
	var scrollPos = 0;

	if (isMenuSticky && documentWidth > mobileResolution) {
		$menu.addClass("fixed-menu");
		currentMenuHeight = $menu.outerHeight() * 2;
		menuHeightFixed = currentMenuHeight;
		offset = currentMenuHeight;
		setTimeout(function () {
			$menu.removeClass("fixed-menu");
		}, 1)
	} else if (isMenuFixed) {
		currentMenuHeight = $menu.outerHeight();
		offset = currentMenuHeight;
	}

	$(document).on("scroll", onScroll);
	$menuLinks.on("click", scrollTo);
	$menuLinks.on("click", function () {
		if (documentWidth <= mobileResolution) {
			hideMenu();
		}
		scrollTo();
	});
	$(window).on("resize", function () {
		documentWidth = $(document).width();
		if (!menuIsOpened && $(document).width() > mobileResolution) {
			showMenu();
		} else if (menuIsOpened && $(document).width() < mobileResolution) {
			hideMenu();
		}
	});

	$menuIcon.on("click", function () {
		if (!menuIsOpened) {
			showMenu();
		} else {
			hideMenu();
		}
	});

	if ($closeIcon) {
		$closeIcon.on("click", function () {
			if (menuIsOpened) {
				hideMenu();
			}
		});
	}

	function onScroll(event) {
		scrollPos = $(document).scrollTop();
		if (isMenuSticky && documentWidth > mobileResolution) {
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
		$menuLinks.each(function () {
			$(this).removeClass("active");
		})
		$(this).addClass("active");

		$("html, body").stop().animate({
			'scrollTop': $target.offset().top - offset
		}, 500, "swing", function () {});
	}

	function fixedMenu() {
		if (scrollPos > offsetToSticky) {
			$menu.addClass("fixed-menu");
			currentMenuHeight = $menu.outerHeight();
		} else {
			$menu.removeClass("fixed-menu");
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
}
