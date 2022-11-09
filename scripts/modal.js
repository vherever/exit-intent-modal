;(function () {
  this.Modal = function () {

    this.closeButton = null;
    this.modal = null;
    this.overlay = null;

    this.transitionEnd = transitionSelect();

    const defaults = {
      autoOpen: false,
      className: 'fade-and-drop',
      closeButton: true,
      content: '',
      maxWidth: 620,
      minWidth: 280,
      overlay: true,
      modalClass: '',
      callbackOnClose: function () {
      }
    };

    if (arguments[0] && typeof arguments[0] === 'object') {
      this.options = extendDefaults(defaults, arguments[0]);
    }

    if (this.options.autoOpen === true) this.open();

  };

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

  function buildOut() {
    let content, contentHolder, docFrag, modalClass;

    if (typeof this.options.content === 'string') {
      content = this.options.content;
    } else {
      content = this.options.content.innerHTML;
    }

    if (typeof this.options.modalClass === 'string') {
      modalClass = this.options.modalClass;
    }

    docFrag = document.createDocumentFragment();

    this.modal = document.createElement('div');
    this.modal.className = 'modal ' + this.options.className;
    this.modal.style.minWidth = this.options.minWidth + 'px';
    this.modal.style.maxWidth = this.options.maxWidth + 'px';
    this.modal.style.maxHeight = this.options.maxHeight + 'px';

    if (this.options.closeButton === true) {
      this.closeButton = document.createElement('a');
      this.closeButton.href = 'javascript:;';
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
      svg.setAttribute('viewBox', '0 0 50 50');
      svg.setAttribute('class', 'modal-close close-button');
      path.setAttribute("d","M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88   c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242   C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879   s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z");
      path.setAttribute('fill', '#e74c3c');
      svg.appendChild(path);
      this.closeButton.appendChild(svg);
      this.modal.appendChild(this.closeButton);
    }

    if (this.options.overlay === true) {
      this.overlay = document.createElement('div');
      this.overlay.className = 'modal-overlay ' + this.options.className;
      docFrag.appendChild(this.overlay);
    }

    contentHolder = document.createElement('div');
    contentHolder.className = 'modal-content ' + modalClass;
    contentHolder.innerHTML = content;
    this.modal.appendChild(contentHolder);

    docFrag.appendChild(this.modal);

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

    // Wait until overlay and modal loading completed
    setTimeout(() => {
      if (this.overlay) {
        const that = this;
        this.overlay.addEventListener('click', function () {
          that.close.apply(that);
          that.options.callbackOnClose.apply(that);
        });
      }
    }, 2000);
  }

  function transitionSelect() {
    const el = document.createElement('div');
    if (el.style['WebkitTransition']) return 'webkitTransitionEnd';
    if (el.style['OTransition']) return 'oTransitionEnd';
    return 'transitionend';
  }

  /**
   * Modal usage
   */

  /**
   * Options model
   */
  const o = {
    modalUrlPath: '', // modal template destination
    className: '', // className
    storage: {
      type: localStorage, // localStorage || sessionStorage
      key: '', // storage key
      expiresInDays: null // time in days, after that time the key will be removed from the storage and the modal will be shown again
    },
    ctaUrl: '', // button url to redirect,
    size: {
      maxWidth: '',
      maxHeight: ''
    },
    permissions: {
      browsers: {}, // allowed browsers
      os: {}, // allowed operation systems
      locationPathName: {
        included: [], // showed on pages, location.pathname
        excluded: [] // pages disallow to show, location.pathname
      },
      countryCodes: {
        included: [], // countryCodes to allow
        excluded: [] // countryCodes to disallow
      }
    },
    api: { // an interface to track events
      opened: () => {
      },
      closed: () => {
      },
      ctaClicked: () => {
      },
      ctaHovered: () => {
      }
    },
    loadStrategy: '' || { timeout: null }
  };

  const STORAGE_KEY_DEFAULT = 's_exit_detection_tracked';
  const STORAGE_EXPIRES_IN_DAYS = 30; // one month

  const WIDTH_DEFAULT = 620;
  const HEIGHT_DEFAULT = 350;

  const BROWSER_CONFIG_DEFAULT = {
    [BROWSER.CHROME]: true,
    [BROWSER.FIREFOX]: true,
    [BROWSER.EDGE]: true
  };

  const OS_CONFIG_DEFAULT = {
    [OS.WINDOWS]: true,
    [OS.LINUX]: true,
    [OS.MAC]: true
  };

  function init(o, ipCountry) {
    const {os, browser} = getUserAgentMetaData();

    let modalInstance;
    let isModalOpened;

    const browserConfig = (o.permissions && o.permissions.browsers || BROWSER_CONFIG_DEFAULT);
    const osConfig = (o.permissions && o.permissions.os) || OS_CONFIG_DEFAULT;

    const allowedToShowByBrowserAndOs = browserConfig[browser] && osConfig[os];

    const storage = (o.storage && o.storage.type) || 'localStorage';
    const storageKey = (o.storage && o.storage.key) || STORAGE_KEY_DEFAULT;
    const storageExpiresInDays = (o.storage && o.storage.expiresInDays) || STORAGE_EXPIRES_IN_DAYS;
    const size = {
      maxWidth: (o.size && o.size.maxWidth) || WIDTH_DEFAULT,
      maxHeight: (o.size && o.size.maxHeight) || HEIGHT_DEFAULT
    };

    const url = location.pathname;

    const pagesToInclude = (o.permissions.locationPathName && o.permissions.locationPathName.included) || [];
    const pagesExclude = (o.permissions.locationPathName && o.permissions.locationPathName.excluded) || [];

    const IPsToInclude = (o.permissions.countryCodes && o.permissions.countryCodes.included) || [];
    const IPsToExclude = (o.permissions.countryCodes && o.permissions.countryCodes.excluded) || [];

    const allowedToShowByIncludedUrls = pagesToInclude.length ? pagesToInclude.includes(url) : true;
    const allowedToShowByExcludedUrls = pagesExclude.length ? !pagesExclude.includes(url) : true;

    if ((IPsToInclude.length || IPsToExclude.length) && !ipCountry) {
      console.warn('You need to provide ipCountry first to start using Show by country feature.');
    }

    const allowedToShowByIncludedIp = IPsToInclude.length ? IPsToInclude.includes(ipCountry) : true;
    const allowedToShowByExcludedIp = IPsToExclude.length ? !IPsToExclude.includes(ipCountry) : true;

    const isAllowedByStorage = !isNotExpired(storageKey, storage);

    const isAllowedToShowConditions =
        isAllowedByStorage &&
        allowedToShowByBrowserAndOs &&
        (allowedToShowByIncludedUrls && allowedToShowByExcludedUrls) &&
        (allowedToShowByIncludedIp && allowedToShowByExcludedIp);

    const showModal = function () {
      if (Modal && !isModalOpened) {
        isModalOpened = true;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', o.modalUrlPath);
        xhr.send();
        xhr.onload = function () {
          modalInstance = new Modal({
            content: xhr.response,
            modalClass: o.className || '',
            maxWidth: size.maxWidth,
            maxHeight: size.maxHeight,
            callbackOnClose: function () {
              o.api && o.api.closed();
            }
          });

          modalInstance.open(o.api && o.api.opened);

          const confirmButton = document.querySelector('button[type="submit"]');
          try {
            confirmButton.addEventListener('click', function () {
              o.api && o.api.ctaClicked();
              o.ctaUrl && window.open(o.ctaUrl, '_blank');
              modalInstance.close();
            });

            confirmButton.addEventListener('mouseover', function () {
              o.api && o.api.ctaHovered();
            });
          } catch {
            console.warn('No confirmation button[type="submit"] provided.');
          }

          setWithExpiry(storageKey, storageExpiresInDays * 86400000, storage);
          
          // Close modal if clicked Escape
          document.addEventListener('keydown', (event) => {
            if (event.code.toLowerCase() === 'escape') {
              modalInstance.close();
            }
          });
        };
      }
    };

    if (isAllowedToShowConditions) {
      if (typeof o.loadStrategy === 'object' && o.loadStrategy.timeout) {
        setTimeout(function () {
          showModal();
        }, o.loadStrategy.timeout);
      } else {
        switch (o.loadStrategy) {
          case "initial":
            showModal();
            break;
          case "exitIntent":
            document.onmouseout = function (e) {
              if (e.clientY < 0) {
                showModal();
              }
            };
            break;
          default:
            showModal();
            break;
        }
      }
    }
  }

  window.s_modal_init = init;
}());
