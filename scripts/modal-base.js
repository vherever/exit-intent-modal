// Options model
const o = {
  modalUrlPath: '',
  className: '',
  storage: {
    type: localStorage,
    key: '',
    expiresMs: null
  },
  cta: {
    buttonDomTarget: '',
    urlToNavigate: ''
  },
  size: {
    maxWidth: '',
    maxHeight: ''
  },
  config: {
    browserConfig: {},
    osConfig: {},
    URLs: {
      include: [],
      exclude: []
    },
    IPs: {
      include: [],
      exclude: []
    }
  },
  api: {
    opened: () => {},
    closed: () => {},
    storageChanged: () => {},
    ctaClicked: () => {},
    ctaHovered: () => {}
  }
};

const STORAGE_KEY_DEFAULT = 's_exit_detection_tracked';
const STORAGE_EXPIRES_IN_MILLISECONDS = 31556926000; // one year

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

(function () {
  function init(o, ipCountry) {
    const {os, browser} = getUserAgentMetaData();

    let modalInstance;
    let isModalOpened;

    const browserConfig = (o.config && o.config.browserConfig || BROWSER_CONFIG_DEFAULT);
    const osConfig = (o.config && o.config.osConfig) || OS_CONFIG_DEFAULT;

    const allowedToShowByBrowserAndOs = browserConfig[browser] && osConfig[os];

    const storage = (o.storage && o.storage.type) || localStorage;
    const storageKey = (o.storage && o.storage.key) || STORAGE_KEY_DEFAULT;
    const storageExpiresMs = (o.storage && o.storage.expiresMs) || STORAGE_EXPIRES_IN_MILLISECONDS;
    const size = {
      maxWidth: (o.size && o.size.maxWidth) || WIDTH_DEFAULT,
      maxHeight: (o.size && o.size.maxHeight) || HEIGHT_DEFAULT
    };

    const url = location.pathname;

    const URLsToInclude = (o.config.URLs && o.config.URLs.include) || [];
    const URLsToExclude = (o.config.URLs && o.config.URLs.exclude) || [];

    const IPsToInclude = (o.config.IPs && o.config.IPs.include) || [];
    const IPsToExclude = (o.config.IPs && o.config.IPs.exclude) || [];

    const allowedToShowByIncludedUrls = URLsToInclude.length ? URLsToInclude.includes(url) : true;
    const allowedToShowByExcludedUrls = URLsToExclude.length ? !URLsToExclude.includes(url) : true;

    const allowedToShowByIncludedIp = IPsToInclude.length ? IPsToInclude.includes(ipCountry) : true;
    const allowedToShowByExcludedIp = IPsToExclude.length ? !IPsToExclude.includes(ipCountry) : true;

    const isAllowedByStorage = !storage.getItem(storageKey);
    
    const isAllowedToShowFinal =
        isAllowedByStorage &&
        allowedToShowByBrowserAndOs &&
        (allowedToShowByIncludedUrls && allowedToShowByExcludedUrls) &&
        (allowedToShowByIncludedIp && allowedToShowByExcludedIp);
    
    if (isAllowedToShowFinal) {
      document.onmouseout = function (e) {
        if (Modal && !isModalOpened && e.clientY < 0) {
          isModalOpened = true;
          $.get(o.modalUrlPath, { browser: BROWSERS[browser] }).done((tpl) => {
            modalInstance = new Modal({
              content: tpl,
              modalClass: o.className || '',
              maxWidth: size.maxWidth,
              maxHeight: size.maxHeight,
              callbackOnClose: function () {
                o.api && o.api.closed();
              }
            });

            modalInstance.open(o.api && o.api.opened);
            
            $(document).on('click', '#s_cta_action', function () {
              o.api && o.api.ctaClicked();
              o.cta && o.cta.urlToNavigate && window.open(o.cta.urlToNavigate, '_blank');
              modalInstance.close();
            });

            $(document).on('mouseover', '.s_get_offer_modal_link', function () {
              o.api && o.api.ctaHovered();
            });

            storage.setItem(storageKey, 'true');
            o.api && o.api.storageChanged();
            setTimeout(function () {
              document.getElementsByClassName('c_modal_t')[0].style.height = size.maxHeight + 'px';
            }, 10);
          });
        }
      };
    }
  }

  window.s_modal_init = init;
})();
