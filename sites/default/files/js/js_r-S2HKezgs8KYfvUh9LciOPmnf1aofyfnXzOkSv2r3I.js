/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
;
(function ($) {

Drupal.Light = Drupal.Light || {};
Drupal.Light.onClickResetDefaultSettings = function() {
  var answer = confirm(Drupal.t('Are you sure you want to reset your theme settings to default theme settings?'))
  if (answer){
    $("input:hidden[name = light_use_default_settings]").attr("value", 1);
    return true;
  }

  return false;
}

Drupal.behaviors.actionLight = {
  attach: function (context) {
	$(".change-skin-button").click(function() {
	  parts = this.href.split("/");
	  style = parts[parts.length - 1];
   	  $.cookie("light_skin", style, {path: '/'});
      window.location.reload();
	  return false;
    });
	$("#change_skin_menu_wrapper").mouseenter(function() {
      $('#change_skin_menu_wrapper').stop(true, false).animate({left: 0}, 1000);	  
    }).mouseleave(function() {
      $('#change_skin_menu_wrapper').stop(true, false).animate({left: -61}, 1000);
	});	
  }
};
})(jQuery);
;
(function($) {

Drupal.behaviors.actionEducation = {
  attach: function (context) {
    
    Drupal.Education.setInputPlaceHolder('search_block_form', Drupal.t('Search...'));
    
    $(window).load(function() {
      Drupal.Education.updateEqualHeight();
      Drupal.Education.setSlideshowHeight();
      
      if ($(".galleryformatter .gallery-slides").length) {
        if($(".galleryformatter .gallery-slides").height() == 0) {
          $(".galleryformatter .gallery-slides").css({height: $(".galleryformatter .gallery-slides img").height() + "px"});
        }
      }
    });
    
    Drupal.Education.centerSlideshowControls();
    Drupal.Education.initResponsiveMenu();

      
    $(window).resize(function() {
      Drupal.Education.updateResponsiveMenu();
      Drupal.Education.centerSlideshowControls();
      Drupal.Education.updateEqualHeight();
      Drupal.Education.setSlideshowHeight();
      /*
      var jcarousel = $('#panel-first-wrapper .jcarousel').parent();
      jcarousel.css('width', $("#panel-first-wrapper .container .block-views").width() + "px");
      jcarousel.parent().css('width', $("#panel-first-wrapper .container .block-views").width() + "px");
      jcarousel.find('.jcarousel').jcarousel('reload');
      
      var jcarousel = $('#panel-third-wrapper .jcarousel').parent();
      jcarousel.css('width', $("#panel-third-wrapper .container .block-views").width() + "px");
      jcarousel.parent().css('width', $("#panel-third-wrapper .container .block-views").width() + "px");
      jcarousel.find('.jcarousel').jcarousel('reload');
      */
    });
    
    $('.btn-btt').click(function(){
      $('body,html').animate({
        scrollTop: 0
      }, 800);
    });
  }
};

Drupal.Education = Drupal.Education || {};
Drupal.Education.supportedScreens = [0.5, 480.5, 767.5, 980.5, 1200.5, 1500.5, 1800.5];
Drupal.Education.hTimeout = null;

Drupal.Education.initResponsiveMenu = function() {
  Drupal.Education.updateResponsiveMenu();
  $('#main-menu-wrapper .responsive-menu-button').click(function(e){
    var target = $('#block-system-main-menu');
    if (target.length == 0) {
      target = $('#block-superfish-1');
    }
    if(target.css('display') == 'none') {
      window.scrollTo(0, 0);
      target.css({display: 'block'});
    }
    else {
      target.css({display: 'none'});
    }
  });
};

Drupal.Education.updateResponsiveMenu = function(){
  var target = $('#block-system-main-menu');
  if (target.length == 0) {
    target = $('#block-superfish-1');
  }
  
  if (target.css('display') == 'none') {
    $('#main-menu-wrapper .responsive-menu-button').show();
  } else {
    $('#main-menu-wrapper .responsive-menu-button').hide();
  }
}

Drupal.Education.centerSlideshowControls = function() {
  var w = $('#block-views-slideshow-block').width() - $('#widget_pager_bottom_slideshow-block').width();
  $('#widget_pager_bottom_slideshow-block').css('left', w/2 + 'px');
}

Drupal.Education.updateEqualHeight = function() {
  if (this.hTimeout != null) clearTimeout(this.hTimeout);
  this.hTimeout = window.setTimeout(
    function() {
      // console.log( 'window width = ' + $(window).width() );
      
      //console.log('reset');
      Drupal.Education.resetEqualHeight($('#panel-forth-wrapper .grid-inner'));
      Drupal.Education.resetEqualHeight($('#sidebar-home-wrapper > .grid-inner .block-views'));
      Drupal.Education.resetEqualHeight($('#main-content > .grid-inner, #sidebar-featured-wrapper > .grid-inner'));
      Drupal.Education.resetEqualHeight($('#panel-second-wrapper .panel-second-1 > .grid-inner'));
      Drupal.Education.resetEqualHeight($('#panel-second-wrapper .region-panel-second-2 .block-views'));
      Drupal.Education.resetEqualHeight($('#main-content > .grid-inner, #sidebar-second-wrapper > .grid-inner'));

      if ($(window).width() > Drupal.Education.supportedScreens[2]) {
        // console.log('height');
        Drupal.Education.equalHeight($('#panel-forth-wrapper .grid-inner'))
        
        //Drupal.Education.equalHeight2($('#main-content > .grid-inner'), $('#sidebar-home-wrapper > .grid-inner'));
        Drupal.Education.equalHeight3( 
          $('#main-content > .grid-inner'),
          $('#sidebar-home-wrapper > .grid-inner'),
          $('#sidebar-home-wrapper > .grid-inner .block-views')
        );
        Drupal.Education.equalHeight($('#main-content > .grid-inner, #sidebar-featured-wrapper > .grid-inner'));
        
        Drupal.Education.equalHeight3(
          $('#panel-second-wrapper .panel-second-1 > .grid-inner'),
          $('#panel-second-wrapper .region-panel-second-2'),
          $('#panel-second-wrapper .region-panel-second-2 .block-views')
        );
        
        Drupal.Education.equalHeight($('#main-content > .grid-inner, #sidebar-second-wrapper > .grid-inner'));
      }  

    }, 
    200
  );
}

Drupal.Education.setInputPlaceHolder = function(name, text) {
  // check browser support placeholder or not
  var i = document.createElement('input');
  if ('placeholder' in i) {
    $('input[name="' + name + '"]').attr('placeholder', Drupal.t(text));
  } else {
    $('input[name="' + name + '"]').val(Drupal.t(text));
    $('input[name="' + name + '"]').focus(function(){
      if(this.value == Drupal.t(text)) {
        this.value='';
      }
    }).blur(function(){
      if(this.value == '') {
        this.value=Drupal.t(text);
      }
    });  
  }
}

Drupal.Education.resetEqualHeight = function(elements) {
  elements.each(function() {
    $(this).css('min-height', '');
  });
}

Drupal.Education.equalHeight = function(elements) {
  highest = 0;
  elements.each(function() {
    if($(this).innerHeight() > highest) {
      highest = $(this).outerHeight();
    }
  });
  return elements.each(function() {
    extra = $(this).outerHeight() - $(this).height();
    if(($.browser.msie && $.browser.version == 6.0)) {
      $(this).css({'height': highest - extra, 'overflow': 'hidden'});
    }
    else {
      $(this).css({'min-height': highest - extra});
    }
  });
}

Drupal.Education.equalHeight2 = function(elements, exceptedElements) {
  highest = 0;
  elements.each(function() {
    if($(this).innerHeight() > highest) {
      highest = $(this).outerHeight();
    }
  });
  exceptedElements.each(function() {
    if($(this).innerHeight() > highest) {
      highest = $(this).outerHeight();
    }
  });
  return elements.each(function() {
    extra = $(this).outerHeight(true) - $(this).height()  
      //+ parseInt($(this).css('margin-top')) + parseInt($(this).css('margin-bottom'))
    ;
    
    if(($.browser.msie && $.browser.version == 6.0)) {
      $(this).css({'height': highest - extra, 'overflow': 'hidden'});
    }
    else {
      $(this).css({'min-height': highest - extra});
    }
  });
}

Drupal.Education.equalHeight3 = function(el1, el2, els){

  if (el1.innerHeight() < el2.innerHeight()) {
    el1.css('min-height', el2.outerHeight() - el1.outerHeight(true) + el1.height() + 1);
  } else {
    var total = 0;
    els.each(function() { total += $(this).innerHeight(); });

    var len = els.length;
    var diff = el1.innerHeight() - total - (len - 1)*parseInt(els.css('padding-bottom'));
    var extra = diff / len;
    

    els.each(function(i) {
      if (i == len - 1) {
        $(this).css('min-height', $(this).height() + (diff - extra * (len-1) - len * 2));
      } else {
        $(this).css('min-height', $(this).height() + extra);  
      }
      
    });
  }
}

  Drupal.Education.setSlideshowHeight = function() {
    var imgs = $('#block-views-slideshow-block .view .views-field img')
    if (imgs.length) {
    
      if(!Drupal.Education.slideshowSize) {
        var img = new Image();
        img.src = $(imgs[0]).attr('src');
        Drupal.Education.getImageSize(img);
        Drupal.Education.imagePaddingLeft  = parseInt(imgs.eq(0).css('padding-left'));
        Drupal.Education.imagePaddingRight = parseInt(imgs.eq(0).css('padding-right'));
        setTimeout(Drupal.Education.setSlideshowHeight, 200)
        return;
      }
      
      var page_width = $('#page').width();
      var w = $('#main-wrapper .container').width();
      $('#block-views-slideshow-block .views-slideshow-cycle-main-frame').css('height', 'auto');
      $('#block-views-slideshow-block .views-slideshow-cycle-main-frame-row, #block-views-slideshow-block .views-slideshow-cycle-main-frame').css('width', w);
      
      var tmp = w - Drupal.Education.imagePaddingLeft - Drupal.Education.imagePaddingRight;
      if (tmp < Drupal.Education.slideshowSize.width) {
        var width = Drupal.Education.slideshowSize.width;
        var height = Drupal.Education.slideshowSize.height;
        var newH = Math.floor(tmp * height / width);
        $('#block-views-slideshow-block .view .views-field img').css({
          width: tmp,
          height: newH
        });
        Drupal.Education.updateLogoSize(newH);
      } else {
        $('#block-views-slideshow-block .view .views-field img').css({
          width: Drupal.Education.slideshowSize.width,
          height: Drupal.Education.slideshowSize.height
        });
        Drupal.Education.updateLogoSize(Drupal.Education.slideshowSize.height);
      }
      
      var h = $('#block-views-slideshow-block .views-slideshow-cycle-main-frame-row').eq(0).height();
      $('#block-views-slideshow-block .views-slideshow-cycle-main-frame').css('height', h);
      
      $('#block-views-slideshow-block .views-slideshow-cycle-main-frame').cycle('destroy');
      $('#block-views-slideshow-block .views-slideshow-cycle-main-frame').cycle();
    }
  }

  Drupal.Education.getImageSize = function(img) {
    if(img.height == 0) {
      setTimeout(function() {
        Drupal.Education.getImageSize(img);
      }, 200);
      return;
    }
    if(!Drupal.Education.slideshowSize) {
      Drupal.Education.slideshowSize = {height: img.height, width: img.width};
    }
  }

  Drupal.Education.updateLogoSize = function(slideshowHeight) {
    var logo = $('#header #logo img');
    logo.css('width', ''); // reset width
    if ($(window).width() < this.supportedScreens[4]) {
      logo.css('width', 0.8 * slideshowHeight * logo.width() / logo.height());
    }
  }

})(jQuery);;
