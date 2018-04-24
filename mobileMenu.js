function mobileMenu(menuClassName, menuIconClassName, mobileResolution, isMenuFixed) {
	var $menu = $(menuClassName);
	var $menuList = $menu.find("ul");
	var $menuLinks = $menu.find("a");
	var $menuIcon = $(menuIconClassName);
	var documentWidth = $(document).width();
	var menuIsOpened = false;
	var offset;
	var scrollPos = 0;

	if (documentWidth > mobileResolution) {
		offset = 0;
	} else {
		offset = $menu.outerHeight();
	}

	$(document).on("scroll", onScroll);
	$("a[href^='#']").on("click", scrollTo);
	$(window).on("resize", function () {
		documentWidth = $(document).width();
		if (!menuIsOpened && $(document).width() > mobileResolution) {
			offset = 0;
			showMenu();
		} else if (menuIsOpened && $(document).width() < mobileResolution) {
			offset = $menu.outerHeight();
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
	$menuLinks.on("click", function () {
		if (documentWidth <= mobileResolution) {
			hideMenu();
		}
	});

	function onScroll(event) {
		scrollPos = $(document).scrollTop();
		if (isMenuFixed && documentWidth > mobileResolution) {
			fixedMenu();
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
	}

	function scrollTo(event) {
		var target = this.hash;
		var $target = $(target);
		if (scrollPos > 50) {
			offset = $menu.outerHeight();
		} else {
			offset = $menu.outerHeight() * 2;
		}

		console.log(offset);
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
		offset = $menu.outerHeight();
		if (scrollPos > 50) {
			$menu.addClass("fixed-menu");
		} else {
			$menu.removeClass("fixed-menu");
		}
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
