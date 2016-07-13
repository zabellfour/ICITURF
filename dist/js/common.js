// page init
jQuery(function(){
	initMobileNav();
	initOpenClose();
	initDropDown();
});

// open-close init
function initOpenClose() {
	jQuery('#sidebar-left').openClose({
		activeClass: 'sidebar-opened',
		opener: '.sidebar-opener',
		slider: '.sidebar-content',
		animSpeed: 400,
		effect: 'slide',
		hideOnClickOutside:true
	});
}


// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		hideOnClickOutside: true,
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		menuDrop: '.nav-drop'
	});
}

// animated navigation init
function initDropDown() {
	jQuery('.nav-drop').animDropdown({
		items: 'li',
		drop: '>ul',
		animSpeed: 200,
		effect: 'fade'
	});
}


/*
 * jQuery Open/Close plugin
 */
;(function($) {
	function OpenClose(options) {
		this.options = $.extend({
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 400,
			effect:'fade',
			event:'click'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
			self.opener.bind(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'over') {
				self.opener.bind('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)){
						self.showSlide();
					}
				});
				self.holder.bind('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).bind('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
			self.slider.removeClass(slideHiddenClass);
			$(document).bind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).unbind('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({ display:'' });
			this.opener.unbind(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).unbind('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		return this.each(function() {
			jQuery(this).data('OpenClose', new OpenClose($.extend(opt, { holder: this })));
		});
	};
}(jQuery));

// Grayscale Images fix for IE10-IE11
var GrayScaleFix = (function() {
	var needToFix = /(MSIE 10)|(Trident.*rv:11\.0)|( Edge\/[\d\.]+$)/.test(navigator.userAgent);

	function replaceImage(image) {
		var tmpImage = new Image();
		tmpImage.onload = function() {
			var imgWrapper = document.createElement('span'),
				svgTemplate = 
				'<svg xmlns="http://www.w3.org/2000/svg" id="svgroot" viewBox="0 0 '+tmpImage.width+' '+tmpImage.height+'" width="100%" height="100%">' +
					'<defs>' +
					'<filter id="gray">' +
						'<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" />' +
					'</filter>' +
					'</defs>' +
					'<image filter="url(&quot;#gray&quot;)" x="0" y="0" width="'+tmpImage.width+'" height="'+tmpImage.height+'" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+tmpImage.src+'" />' +
				'</svg>';
			
			imgWrapper.innerHTML = svgTemplate;
			imgWrapper.className = 'grayscale-fix';
			image.parentNode.insertBefore(imgWrapper, image);

			image.style.cssText += 'visibility:hidden;display:block';
			imgWrapper.querySelector('svg').style.position = 'absolute';
			imgWrapper.style.cssText = 'display:inline-block;position:relative;';
			imgWrapper.appendChild(image);
		};
		tmpImage.src = image.src;
	}

	function replaceAll() {
		var images = document.querySelectorAll('img.grayscale');
		for(var i = 0; i < images.length; i++) {
			replaceImage(images[i]);
		}
	}

	if(needToFix) {
		document.addEventListener('DOMContentLoaded', replaceAll);
	}

	return {
		replace: replaceImage,
		refresh: replaceAll
	};
}());

/*
 * Simple Mobile Navigation
 */
;(function($) {
	function MobileNav(options) {
		this.options = $.extend({
			container: null,
			hideOnClickOutside: false,
			menuActiveClass: 'nav-active',
			menuOpener: '.nav-opener',
			menuDrop: '.nav-drop',
			toggleEvent: 'click',
			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
		}, options);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;

			if(activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function(e) {
				if(self.isOpened()) {
					var target = $(e.target);
					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if(this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};

	var activateResizeHandler = function() {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if(!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function(options) {
		return this.each(function() {
			var params = $.extend({}, options, {container: this}),
				instance = new MobileNav(params);
			$.data(this, 'MobileNav', instance);
		});
	};
}(jQuery));

// Grayscale Images fix for IE10-IE11
var GrayScaleFix = (function() {
	var needToFix = /(MSIE 10)|(Trident.*rv:11\.0)|( Edge\/[\d\.]+$)/.test(navigator.userAgent);

	function replaceImage(image) {
		var tmpImage = new Image();
		tmpImage.onload = function() {
			var imgWrapper = document.createElement('span'),
				svgTemplate = 
				'<svg xmlns="http://www.w3.org/2000/svg" id="svgroot" viewBox="0 0 '+tmpImage.width+' '+tmpImage.height+'" width="100%" height="100%">' +
					'<defs>' +
					'<filter id="gray">' +
						'<feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" />' +
					'</filter>' +
					'</defs>' +
					'<image filter="url(&quot;#gray&quot;)" x="0" y="0" width="'+tmpImage.width+'" height="'+tmpImage.height+'" preserveAspectRatio="none" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="'+tmpImage.src+'" />' +
				'</svg>';
			
			imgWrapper.innerHTML = svgTemplate;
			imgWrapper.className = 'grayscale-fix';
			image.parentNode.insertBefore(imgWrapper, image);

			image.style.cssText += 'visibility:hidden;display:block';
			imgWrapper.querySelector('svg').style.position = 'absolute';
			imgWrapper.style.cssText = 'display:inline-block;position:relative;';
			imgWrapper.appendChild(image);
		};
		tmpImage.src = image.src;
	}

	function replaceAll() {
		var images = document.querySelectorAll('img.grayscale');
		for(var i = 0; i < images.length; i++) {
			replaceImage(images[i]);
		}
	}

	if(needToFix) {
		document.addEventListener('DOMContentLoaded', replaceAll);
	}

	return {
		replace: replaceImage,
		refresh: replaceAll
	};
}());


/*
 * jQuery Dropdown plugin
 */
;(function($){
	$.fn.animDropdown = function(o){
		// default options
		var options = $.extend({
			hoverClass:'hover',
			dropClass:'drop-active',
			items: 'li',
			drop: '>ul',
			delay: 100,
			animSpeed: 300,
			effect: 'fade'
		},o);

		return this.each(function(){
			// options
			var nav = $(this),
				items = nav.find(options.items);

			items.addClass(options.hoverClass).each(function(){
				var item = $(this), delayTimer;
				var drop = item.find(options.drop);
				item.data('drop', drop);
				if(drop.length) {
					dropdownEffects[options.effect].prepare({item:item,drop:drop});
				}

				item.bind('mouseenter', function(){
					hideAllDropdowns(item);
					item.addClass(options.hoverClass);
					clearTimeout(delayTimer);
					delayTimer = setTimeout(function(){
						if(drop.length && item.hasClass(options.hoverClass)) {
							item.addClass(options.dropClass);
							dropdownEffects[options.effect].animate({drop:drop, state:true, speed:options.animSpeed, complete:function(){
								// callback
							}});
						}
					}, options.delay);
					item.data('timer', delayTimer);
				}).bind('mouseleave', function(){
					if(!item.hasClass(options.dropClass)) {
						item.removeClass(options.hoverClass);
					}
					clearTimeout(delayTimer);
					delayTimer = setTimeout(function(){
						if(drop.length && item.hasClass(options.dropClass)) {
							dropdownEffects[options.effect].animate({drop:drop, state:false, speed:options.animSpeed, complete:function(){
								// callback
								item.removeClass(options.hoverClass);
								item.removeClass(options.dropClass);
							}});
						}
					}, options.delay);
					item.data('timer', delayTimer);
				});
			});

			// hide dropdowns
			items.removeClass(options.hoverClass);
			if(dropdownEffects[options.effect].postProcess) {
				items.each(function(){
					dropdownEffects[options.effect].postProcess({item: $(this)});
				});
			}

			// hide current level dropdowns
			function hideAllDropdowns(except) {
				var siblings = except.siblings();
				siblings.removeClass(options.hoverClass).each(function(){
					var item = $(this);
					clearTimeout(item.data('timer'));
				});
				siblings.filter('.' + options.dropClass).each(function(){
					var item = jQuery(this).removeClass(options.dropClass);
					if(item.data('drop').length) {
						dropdownEffects[options.effect].animate({drop:item.data('drop'), state:false, speed:options.animSpeed});
					}
				});
			}
		});
	};

	// dropdown effects
	var dropdownEffects = {
		fade: {
			prepare: function(o) {
				o.drop.css({opacity:0,display:'none'});
			},
			animate: function(o) {
				o.drop.stop().css('display', 'block').animate({opacity: o.state ? 1 : 0},{duration: o.speed || 0, complete: function(){
					if(o.state) {
						o.drop.css({opacity:''});
					} else {
						o.drop.css({opacity:0,display:'none'});
					}
					if(typeof o.complete === 'function') {
						o.complete.call(o.drop);
					}
				}});
			}
		},
		slide: {
			prepare: function(o) {
				var elementWrap = o.drop.wrap('<div class="drop-slide-wrapper">').show().parent();
				var elementHeight = o.drop.outerHeight(true);
				var elementWidth = o.drop.outerWidth(true);
				elementWrap.css({
					height:elementHeight,
					width: elementWidth,
					position:'absolute',
					overflow:'hidden',
					top: o.drop.css('top'),
					left: o.drop.css('left')
				});
				o.drop.css({
					position:'static',
					display:'block',
					top: 'auto',
					left: 'auto'
				});
				o.drop.data('height', elementHeight).data('wrap', elementWrap).css({marginTop: -elementHeight});
			},
			animate: function(o) {
				o.drop.data('wrap').show().css({overflow:'hidden'});
				o.drop.stop().animate({marginTop: o.state ? 0 : -o.drop.data('height')},{duration: o.speed || 0, complete: function(){
					if(o.state) {
						o.drop.css({marginTop:''});
						o.drop.data('wrap').css({overflow:''});
					} else {
						o.drop.data('wrap').css({display:'none'});
					}
					if(typeof o.complete === 'function') {
						o.complete.call(o.drop);
					}
				}});
			},
			postProcess: function(o) {
				if(o.item.data('drop').length) {
					o.item.data('drop').data('wrap').css({display:'none'});
				}
			}
		}
	};
}(jQuery));

