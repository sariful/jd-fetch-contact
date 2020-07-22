(function () {
    $('.content').css('min-height', window.innerHeight);

    $(`a[href$="${window.location.pathname}"]`).addClass('active');
    $(`a[href$="${window.location.pathname}"]`).parents('.submenu').addClass('show');
    $(`a[href$="${window.location.pathname}"]`).parents('.primary-menu').find('a.primary-menu-link').attr('aria-expanded', 'true').addClass('active');



    $('.primary-menu-link').on('click', function () {
        $(this).parents('.primary-menu').siblings().find('.primary-menu-link').attr('aria-expanded', 'false').removeClass('active');
        $(this).parents('.primary-menu').siblings().find('.submenu').removeClass('show');
    });
})();