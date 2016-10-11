# A Shortcut Library For Web App

### 1. Load the Script

```html
<script src="path/to/shortcut.js"></script>
```

### 2. Register Your Shortcuts

> Define the key shortcut join with `+`, such as 'shift+a', 'a+b', etc.

```javascript
KeyShortcut.register('g',function( key ){
    console.log("I just triggered key: " + key );
},document.querySelector('#input'));
```

__OR__

```javascript
KeyShortcut.register({
    'g+k':function( key ){
        console.log("I just triggered key: " + key );
    },
    'g+a':function( key ){
        console.log("I just triggered key: " + key );
    },
    'meta+c':function( key ){
        console.log("I just triggered key: " + key );
    },
    'a+b+c':function( key ){
        console.log("I just triggered key: " + key );
    },
    'c':function( key ){
        console.log("I just triggered key: " + key );
    }
});
```
