/*!
 * SVG Separator v1.0.0 (http://zafree.github.io/bootaide/js/svg.separator.js)
 * Copyright 2014-2015 Zafree 
 * Licensed under MIT 
 */

$(document).ready(function() {
	$('.separator').each(function() {
		$(this).filter(function() {
			var sp = this.className.split(/\s+/);
			for (var i = 0; i < sp.length; ++i) {
				if (sp[i].substr(0, 3) === "bg-") {
					var mySP = sp[i];
				}
			}

			if ($(this).hasClass(mySP)) {
			} else {

				$(this).prev('section').each(function() {
					
					var lord = "";
					if ($(this).hasClass("lter")) {
						var lord = "lter";
					}
					if ($(this).hasClass("lt")) {
						var lord = "lt";
					}
					if ($(this).hasClass("dk")) {
						var lord = "dk";
					}
					if ($(this).hasClass("dker")) {
						var lord = "dker";
					}
										
					$(this).filter(function() {
						var classNames = this.className.split(/\s+/);
						for (var i = 0; i < classNames.length; ++i) {
							if (classNames[i].substr(0, 3) === "bg-") {
								var myClass = classNames[i] +' '+ lord;
								$(this).next('section').addClass(myClass);

								return true;
							}
						}
						return false;
					});
				});
			}
		});
	});
	
	$('.separator').next('section').each(function() {
		
		var lord = "";
		if ($(this).hasClass("lter")) {
			var lord = "lter";
		}
		if ($(this).hasClass("lt")) {
			var lord = "lt";
		}
		if ($(this).hasClass("dk")) {
			var lord = "dk";
		}
		if ($(this).hasClass("dker")) {
			var lord = "dker";
		}
		$(this).filter(function() {
			var classNames = this.className.split(/\s+/);
			for (var i = 0; i < classNames.length; ++i) {
				if (classNames[i].substr(0, 3) === "bg-") {
					var myClass = classNames[i];

					var sliceClass = 'fill-' + myClass.slice(3) +' fill-'+ lord;
					
					$(this).prev('section').find('.decor').attr('class', 'decor ' + sliceClass);
					return true;
				}
			}
			return false;
		});
	}); 

});