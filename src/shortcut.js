(function( factory ){
    var root = window;
    root.KeyShortcut = factory( root, {} );
})(function( root, KeyShortcut ){

    var tmpKey,tmpValue;
    var hasOwn = function( obj, key ){
        return obj.hasOwnProperty( key );
    }
    var isObj = function( obj ){
        return obj && obj.toString() === '[object Object]';
    }
    var log = function( msg, type ){
        if( !KeyShortcut.DEBUG ){
            return false;
        }
        var colorMap = {
            w:'yellow',
            e:'red',
            i:'blue',
            o:'green'
        }
        var tipMap = {
            w:'WARN',
            e:'ERRO',
            i:'INFO',
            o:'IMPO'
        }
        if( type && type in colorMap ){

        }else{
            type = 'i'
        }
        var ts = new Date().getTime();
        console.log('%c' + '[ ' + ts + ' ] ' + tipMap[ type ] + ": " + msg, 'color:' + colorMap[type] + ';background:#eee;padding:4px;margin:4px;');
    }
    var INTERNAL_STR = '__internal__';
    var addEvent = function( ele, ev, fn ){
        if( 'addEventListener' in ele ){
            ele.addEventListener( ev, fn, false );
        }
    }
    var PRESSED_KEYS = [];
    KeyShortcut.prop_prefix = '__ks';
    KeyShortcut.DEBUG = false;
    KeyShortcut.VERSION = '0.0.1';
    KeyShortcut.TIMEOUT = 0;
    KeyShortcut.register = function( key, callback, context ){
        if( typeof key === 'string' ){
            context = context || document;
            this.registerOne( key, callback, context );
        }else{
            context = callback || document;
            if( isObj( key ) ){
                for( tmpKey in key ){
                    if( hasOwn( key, tmpKey ) ){
                        tmpValue = key[ tmpKey ];
                        this.registerOne( tmpKey, tmpValue, context );
                    }
                }
            }
        }
    }

    KeyShortcut.config = function( options ){
        var configurable = [ 'prop_prefix', 'DEBUG' ], k;
        for( k in options ){
            if( hasOwn( options, k ) && configurable.indexOf( k ) !== -1 ){
                KeyShortcut[ k ] = options[ k ];
            }
        }
    }


    KeyShortcut.registerOne = function( key, callback, context ){
        key = key.toLowerCase();
        this.bindKbdAction( context );
        this.setKeyMap( key, callback, context );
    }

    KeyShortcut.bindKbdAction = function( element ){
        if( this.prop_prefix + INTERNAL_STR in element ){
            return true;
        }
        element[ this.prop_prefix + INTERNAL_STR ] = {};

        addEvent( element, 'keydown', function( e ){
            KeyShortcut.listenKeyDown( e, element );
        } )
        addEvent( element, 'keyup', function( e ){
            KeyShortcut.listenKeyUp( e );
        } )
    }

    KeyShortcut.listenKeyDown = function( e, element ){
        if( this.isFormInteractive( e ) ){
            return false;
        }
        /*
         * TODO
         * 1. 连击如何处理
         * 2. 现在必须按照注册键组合的顺序依次按下，且不能松开，才能触发；
         *    如何才能可以有一定的缓冲时间触发，比如按下 ‘g’，松开，迅速按下 ’k’，也使其能够激活 'g+k' 的快捷键组合；
         *    这对应的问题是，假如也注册了 'g' 这个单键的快捷键，在松开之后，按下 ‘k’ 之前这个短暂的时间要不要激活 ‘g’
         */
        var cur_key = e.key.toLowerCase();
        var internal = element[ this.prop_prefix + INTERNAL_STR ];
        // log( e, 'o' );
        if( PRESSED_KEYS.indexOf( cur_key ) === -1 ){
            PRESSED_KEYS.push( cur_key );
        }else{

        }
        log( 'Current Pressed -> ' + cur_key );
        log( 'Combine Pressed -> ' + PRESSED_KEYS.join( ', ' ) );

        var pressed_len = PRESSED_KEYS.length;
        var trigger_key,combined_key;
        for( ; pressed_len; pressed_len-- ){
            combined_key = PRESSED_KEYS.slice( -pressed_len ).join( '+' );
            if( combined_key in internal.ev_map ){
                trigger_key = combined_key;
                break;
            }
        }
        if( typeof trigger_key !== 'undefined' ){
            log( 'Shortcut Triggered -> ' + trigger_key, 'o' );
            internal.ev_map[ trigger_key ].call( null, trigger_key );
        }
    }

    KeyShortcut.listenKeyUp = function( e ){
        if( this.isFormInteractive( e ) ){
            return false;
        }
        var cur_key = e.key.toLowerCase();
        var idx = PRESSED_KEYS.indexOf( cur_key );
        if( idx !== -1 ){
            if( this.TIMEOUT <= 0 ){
                PRESSED_KEYS.splice( idx, 1 );
            }else{
                setTimeout( function(){
                    PRESSED_KEYS.splice( idx, 1 );
                }, this.TIMEOUT );
            }
        }
    }

    KeyShortcut.isFormInteractive = function( e ){
        var target = e.target || e.srcElement;
        var tagName = target.tagName.toLowerCase();
        if( ['textarea','input'].indexOf( tagName ) > -1 ){
            return true;
        }
        // 这个属性值居然是 string 类型
        if( tagName.contentEditable === 'true' ){
            return true;
        }
        return false;
    }


    KeyShortcut.setKeyMap = function( key, callback, context ){
        var internal = context[ this.prop_prefix + INTERNAL_STR ];
        internal.ev_map = internal.ev_map || {};
        internal.ev_map[ key ] = callback;

        internal.key_list = internal.key_list || [];
        internal.key_list.push( key );
    }

    return {
        register:function(){
            KeyShortcut.register.apply( KeyShortcut, arguments );
        },
        config:function(){
            KeyShortcut.config.apply( KeyShortcut, arguments );
        },
        VERSION:KeyShortcut.VERSION
    }
});
