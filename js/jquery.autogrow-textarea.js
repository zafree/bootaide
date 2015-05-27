// Based off https://code.google.com/p/gaequery/source/browse/trunk/src/static/scripts/jquery.autogrow-textarea.js?r=2
// Modified by David Beck
// git https://github.com/rotundasoftware/jquery.autogrow-textarea

( function( factory ) {
    // UMD wrapper
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( [ 'jquery' ], factory );
    } else if ( typeof exports !== 'undefined' ) {
        // Node/CommonJS
        module.exports = factory( require( 'jquery' ) );
    } else {
        // Browser globals
        factory( jQuery );
    }
}( function( $ ) {

    /*
     * Auto-growing textareas; technique ripped from Facebook
     */
    $.fn.autogrow = function(options) {
        
		options = $.extend( {
			vertical: true,
			horizontal: false,
			characterSlop: 0
		}, options);

		this.filter('textarea,input').each(function() {
			
            var $this       = $(this),
                minHeight   = $this.height(),
				maxHeight	= $this.attr( "maxHeight" ),
				minWidth	= typeof( $this.attr( "minWidth" ) ) == "undefined" ? 0 : $this.attr( "minWidth" );
            
			if( typeof( maxHeight ) == "undefined" ) maxHeight = 1000000;
			
            var shadow = $('<div class="autogrow-shadow"></div>').css( {
                position:   'absolute',
                top:        -10000,
                left:       -10000,
                fontSize:   $this.css('fontSize'),
                fontFamily: $this.css('fontFamily'),
				fontWeight: $this.css('fontWeight'),
                lineHeight: $this.css('lineHeight'),
                resize:     'none'
            } ).appendTo(document.body);

            shadow.html( 'a' );
            var characterWidth = shadow.width();
            shadow.html( '' );
            
            var update = function( val ) {
    
                var times = function(string, number) {
                    for (var i = 0, r = ''; i < number; i ++) r += string;
                    return r;
                };
                
                if( typeof val === 'undefined' ) val = this.value;
				if( val === '' && $(this).attr("placeholder") ) val = $(this).attr("placeholder");
				
				if( options.vertical )
					val = val.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/\n$/, '<br/>&nbsp;')
						.replace(/\n/g, '<br/>')
						.replace(/ {2,}/g, function(space) { return times('&nbsp;', space.length -1) + ' '; });
				else
					val = escapeHtml( val );

				//if( options.horizontal )
				//	val = $.trim( val );
				
				// if( $(this).prop( 'tagName' ).toUpperCase() === 'INPUT' )
				// 	shadow.text(val).css( "width", "auto" );
				// else
				shadow.html( val ).css( "width", "auto" ); // need to use html here otherwise no way to count spaces (with html we can use &nbsp;)
				
				if( options.horizontal )
				{
					var slopWidth = options.characterSlop * characterWidth + 2;

					var newWidth = Math.max( shadow.width() + slopWidth, minWidth );
					var maxWidth = options.maxWidth;
					//if( typeof( maxWidth ) === "undefined" ) maxWidth = $this.parent().width() - 12; // not sure why we were doing this but seems like a bad idea. doesn't work with inline-block parents for one thing, since it is the text area that should be "pushing" them to be wider
					if( maxWidth ) newWidth = Math.min( newWidth, maxWidth );
					$(this).css( "width", newWidth );
				}
								
				if( options.vertical )
				{
					shadow.css( "width", $(this).width() - parseInt($this.css('paddingLeft'),10) - parseInt($this.css('paddingRight'),10) );
					var shadowHeight = shadow.height();
					var newHeight = Math.min( Math.max( shadowHeight, minHeight ), maxHeight );
					$(this).css( "height", newHeight );
					$(this).css( "overflow", newHeight == maxHeight ? "auto" : "hidden" );
				}
            };
            
            $(this)
				.change(function(){update.call( this );return true;})
				.keyup(function(){update.call( this );return true;})
				.keypress(function( event ) {
					var val = this.value;
					var caretInfo = _getCaretInfo( this );

					var valAfterKeypress = val.slice( 0, caretInfo.start ) + String.fromCharCode( event.which ) + val.slice( caretInfo.end );
					update.call( this, valAfterKeypress );
					return true;
				})
				.bind( "update.autogrow", function(){ update.apply(this); } )
				.bind( "remove.autogrow", function() {
					shadow.remove();
				} );
            
            update.apply(this);
            
        });
        
        return this;
    };

    // comes from https://github.com/madapaja/jquery.selection/blob/master/src/jquery.selection.js
    var _getCaretInfo = function(element){
        var res = {
            text: '',
            start: 0,
            end: 0
        };

        if (!element.value) {
            /* no value or empty string */
            return res;
        }

        try {
            if (window.getSelection) {
                /* except IE */
                res.start = element.selectionStart;
                res.end = element.selectionEnd;
                res.text = element.value.slice(res.start, res.end);
            } else if (doc.selection) {
                /* for IE */
                element.focus();

                var range = doc.selection.createRange(),
                    range2 = doc.body.createTextRange();

                res.text = range.text;

                try {
                    range2.moveToElementText(element);
                    range2.setEndPoint('StartToStart', range);
                } catch (e) {
                    range2 = element.createTextRange();
                    range2.setEndPoint('StartToStart', range);
                }

                res.start = element.value.length - range2.text.length;
                res.end = res.start + range.text.length;
            }
        } catch (e) {
            /* give up */
        }

        return res;
    };

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;',
        " ": '&nbsp;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/\ ]/g, function (s) {
            return entityMap[s];
         } );
    }
} ) );
