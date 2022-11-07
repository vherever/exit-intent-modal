(function () {

  // Define our constructor
  this.Modal = function () {

    // Create global element references
    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    // Determine proper prefix
    this.transitionEnd = transitionSelect();

    // Define option defaults
    const defaults = {
      autoOpen: false,
      className: 'fade-and-drop',
      closeButton: true,
      content: '',
      maxWidth: 620,
      minWidth: 280,
      overlay: true,
      modalClass: '',
      callbackOnClose: function() {}
    };

    // Create options by extending defaults with the passed in arguments
    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    if (this.options.autoOpen === true) this.open();

  };

  // Public Methods
  Modal.prototype.close = function () {
    const _ = this;
    this.modal.className = this.modal.className.replace(' modal-open', '');
    this.overlay.className = this.overlay.className.replace(' modal-open', '');
    this.modal.addEventListener(this.transitionEnd, function () {
      if (_.modal && _.modal.parentNode) {
        _.modal.parentNode.removeChild(_.modal);
      }
    });
    this.overlay.addEventListener(this.transitionEnd, function () {
      if (_.overlay.parentNode) _.overlay.parentNode.removeChild(_.overlay);
    });
  };

  Modal.prototype.open = function (isOpenedCallback) {
    buildOut.call(this);
    initializeEvents.call(this);
    window.getComputedStyle(this.modal).height;
    this.modal.className = this.modal.className +
        (this.modal.offsetHeight > window.innerHeight ?
            ' modal-open modal-anchored' : ' modal-open');
    this.overlay.className = this.overlay.className + ' modal-open';
    isOpenedCallback && isOpenedCallback();
  };

  // Private Methods
  function buildOut() {

    let content, contentHolder, docFrag, modalClass;

    /*
     * If content is an HTML string, append the HTML string.
     * If content is a domNode, append its content.
     */

    if (typeof this.options.content === 'string') {
      content = this.options.content;
    } else {
      content = this.options.content.innerHTML;
    }

    if (typeof this.options.modalClass === 'string') {
      modalClass = this.options.modalClass;
    }
    
    // Create a DocumentFragment to build with
    docFrag = document.createDocumentFragment();

    // Create modal element
    this.modal = document.createElement('div');
    this.modal.className = 'modal ' + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + 'px';
    this.modal.style.maxWidth = this.options.maxWidth + 'px';

    // If closeButton option is true, add a close button
    if (this.options.closeButton === true) {
      this.closeButton = document.createElement('a');
      this.closeButton.href = 'javascript:;';
      this.closeButton.innerText = '';
      this.closeButton.className = 'modal-close close-button';
      this.modal.appendChild(this.closeButton);
    }

    // If overlay is true, add one
    if (this.options.overlay === true) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay ' + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    // Create content area and append to modal
    contentHolder = document.createElement('div');
    contentHolder.className = 'modal-content ' + modalClass;
    contentHolder.innerHTML = content;
    this.modal.appendChild(contentHolder);

    // Append modal to DocumentFragment
    docFrag.appendChild(this.modal);

    // Append DocumentFragment to body
    document.body.appendChild(docFrag);
  }

  function extendDefaults(source, properties) {
    let property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }

  function initializeEvents() {
    if (this.closeButton) {
      const that = this;
      this.closeButton.addEventListener('click', function () {
        that.close.apply(that);
        that.options.callbackOnClose.apply(that);
      });
    }

    if (this.overlay) {
      const that = this;
      this.overlay.addEventListener('click', function () {
        that.close.apply(that);
        that.options.callbackOnClose.apply(that);
      });
    }

  }

  function transitionSelect() {
    const el = document.createElement('div');
    if (el.style['WebkitTransition']) return 'webkitTransitionEnd';
    if (el.style['OTransition']) return 'oTransitionEnd';
    return 'transitionend';
  }
}());
