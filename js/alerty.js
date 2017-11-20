//封装弹层
var Dialog = {

  defaults: {
     okLabel: '\u786e\u5b9a',
     cancelLabel: '\u53d6\u6d88',
     time: 2000
  },

    previousCallback: null, 

  // html templates
  template: '<div class="alerty-overlay" tabindex="-1"></div>'+
              '<div class="alerty">'+
                '<div class="alerty-title"></div>'+
                '<div class="alerty-content">'+
                  '<p class="alerty-message"></p>'+
                  '<div class="alerty-prompt">'+
                    '<input type="text" placeholder="" value="">'+
                    '<div class="input-line"></div>'+
                  '</div>'+
                '</div>'+
                '<div class="alerty-action">'+
                  '<a class="btn-cancel"></a>'+
                  '<a class="btn-ok"></a>'+
                '</div>'+
              '</div>',


  setUid: function(prefix) {
      do prefix += Math.floor(Math.random() * 1000000);
      while (document.getElementById(prefix));
      return prefix;
    },

    addClass: function(el, cls) {
      var elClass = el.className;
      var blank = (elClass !== '') ? ' ' : '';
      var added = elClass + blank + cls;
      el.className = added;
    },

    hasClass: function(el, cls) {
      var elClass = el.className;
      var elClassList = elClass.split(/\s+/);
      var x = 0;
      for(x in elClassList) {
        if(elClassList[x] == cls) {
          return true;
        }
      }
      return false;
    },

    addEvent: function(el, type, func) {
      if(el.addEventListener) {
        el.addEventListener(type, func, false);
      } else if(el.attachEvent){ 
        el.attachEvent('on' + type, func);
      } else{ 
        el['on' + type] = func; 
      }  
    },

    removeElement: function(el) {
      (el && el.parentNode) && el.parentNode.removeChild(el);
    },

    removeClass: function(el, cls) {
      var elClass = ' '+el.className+' ';
      elClass = elClass.replace(/(\s+)/gi, ' ');
      var removed = elClass.replace(' '+cls+' ', ' ');
      removed = removed.replace(/(^\s+)|(\s+$)/g, '');
      el.className = removed;
    },

  setup : function (content, opts, onOk, onCancel) {

    var detect = typeof opts === 'function';
        if (detect) {
          onCancel = onOk;
          onOk = opts;
        }

    var $oldModal = document.querySelector('.alerty');

    // 如果窗口是打开的，关闭它然后回调
    if ($oldModal) {
          dialog.removeElement($oldModal);
          var _callback = this.previousCallback;
          if (_callback) _callback();
        }

    var $wrapper = document.createElement('div');
        $wrapper.innerHTML = this.template;

      // append alerty to body
      while ($wrapper.firstChild) {
        document.body.appendChild($wrapper.firstChild);
      };

      var $modal = document.querySelector('.alerty');
      var $overlay = document.querySelector('.alerty-overlay');
      var $title = $modal.querySelector('.alerty-title');
      var $message = $modal.querySelector('.alerty-message');
      var $btnOk = $modal.querySelector('.btn-ok');
        var $btnCancel = $modal.querySelector('.btn-cancel');
        var $prompt = $modal.querySelector('.alerty-prompt');
        var $input = $prompt.querySelector('input');
      $message.innerHTML = content;

      // set uid
        $modal.id = Dialog.setUid('alerty');
        $overlay.id = 'overlay-'+$modal.id;

        // animation show alerty
        Dialog.addClass($overlay, 'active');
        Dialog.addClass($modal, 'alerty-show');
        $message.innerHTML = content;  // set msg


      $input.focus();

      if(opts && opts.inputType) $input.setAttribute('type', opts.inputType); 
      if(opts && opts.inputPlaceholder) $input.setAttribute('placeholder', opts.inputPlaceholder); 
      if(opts && opts.inputValue) $input.setAttribute('value', opts.inputValue); 

      Dialog.addClass(document.body, 'no-scrolling'); // body no scorll
          (opts && opts.title) ? $title.innerHTML = opts.title : Dialog.removeElement($title); // handle title if set
          (opts && opts.okLabel) ? $btnOk.innerHTML = opts.okLabel : $btnOk.innerHTML = this.defaults.okLabel; // handle ok text if set
          $modal.style.marginTop =  - $modal.offsetHeight / 2 + 'px'; 

          (opts && opts.cancelLabel) ? $btnCancel.innerHTML = opts.cancelLabel : $btnCancel.innerHTML = this.defaults.cancelLabel; 

      this.bindEvent($modal, onOk, onCancel); // see next
  },

  bindEvent : function($modal, onOk, onCancel){
    var that = this;
        var $btnOk = $modal.querySelector('.btn-ok');
        var $btnCancel = $modal.querySelector('.btn-cancel');

        // toasts delay hide
        if (Dialog.hasClass($modal, 'toasts')) {
          setTimeout(function() {
            // if toasts has been removed
            if (document.getElementById($modal.id) === null) return;
            that.close($modal, onOk);
          }, that.defaults.time);
        }
        // click ok button
        if ($btnOk) {
          Dialog.addEvent($btnOk, 'click', function() {
            that.close($modal, onOk);
          });
        }
        // click cancel button
        if ($btnCancel) {
          Dialog.addEvent($btnCancel, 'click', function() {
            that.close($modal, onCancel);
          });
        }
  },

  close: function($modal, callback) {
        var $input = $modal.querySelector('input');
        var $overlay = document.getElementById('overlay-'+$modal.id);

        // hide alerty with animation
        Dialog.removeClass($modal, 'alerty-show');
        Dialog.addClass($modal, 'alerty-hide');

        // remove alerty and other added elements
        setTimeout(function(){
          $overlay && Dialog.removeClass($overlay, 'active'), Dialog.removeClass(document.body, 'no-scrolling');
          
          Dialog.removeElement($modal);
          Dialog.removeElement($overlay);
          if (callback) {
            setTimeout(function(){
              !$input ? callback() : callback($input.value);  // handle prompt type, callback the input value
            }, 100);
          }
        },100);
      }
}