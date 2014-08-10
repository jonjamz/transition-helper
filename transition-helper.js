var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

// pass true or false to get the transitions you want, add custom classes for each hook
var genHooks = function (insert, remove, insertClass, removeClass) {

  var hooks = {}
  
  if (insert) {
    hooks.insertElement = function(node, next) {
      $(node)
        .addClass(insertClass)
        .insertBefore(next);
      
      Deps.afterFlush(function() {
        $(node).width(); // call width to force the browser to draw it
        $(node).removeClass(insertClass);
      });
    };
  } else {
    hooks.insertElement = function(node, next) {
      $(node)
        .insertBefore(next);
      
      Deps.afterFlush(function() {
        $(node).width();
      });
    };
  }
  
  if (remove) {
    hooks.removeElement = function(node) {
      $(node).addClass(removeClass)
        .on(EVENTS, function() {
          $(node).remove()
        });
    };
  } else {
    hooks.removeElement = function(node) {
      $(node).remove();
    };
  }
  
  hooks.moveElement: function(node, next) {
    hooks.removeElement(node);
    hooks.insertElement(node, next);
  }

  return hooks;
}

Template.transition.rendered = function() {
  this.firstNode.parentNode._uihooks = genHooks(true, true, 'off-screen off-screen-in', 'off-screen off-screen-out');
}

Template.transitionIn.rendered = function() {
  this.firstNode.parentNode._uihooks = genHooks(true, false, 'off-screen off-screen-in', '');
}

Template.transitionOut.rendered = function() {
  this.firstNode.parentNode._uihooks = genHooks(false, true, '', 'off-screen off-screen-out');
}
