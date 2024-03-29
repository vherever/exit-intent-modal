const ua = navigator.userAgent.toLowerCase();

const PLATFORM = {
  DESKTOP: 'DESKTOP',
  MOBILE: 'MOBILE',
};

const OS = {
  ANDROID: 'ANDROID',
  WINDOWS: 'WINDOWS',
  LINUX: 'LINUX',
  MAC: 'MAC',
  IOS: 'IOS',
  OTHER: 'OTHER',
};

const BROWSER = {
  CHROME: 'CHROME',
  EDGE: 'EDGE',
  FIREFOX: 'FIREFOX',
  OTHER: 'OTHER',
};

/**
 * @returns {boolean}
 */
function isMobile() {
  return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|CriOS|android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|crios/i.test(ua));
}

/**
 * @returns {boolean}
 */
function isWindows() {
  return navigator.appVersion.indexOf('Win') !== -1;
}

/**
 * @returns {boolean}
 */
function isLinux() {
  return navigator.appVersion.indexOf('Linux') !== -1
}

/**
 * @returns {boolean}
 */
function isIOS() {
  return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
}

/**
 * @returns {boolean}
 */
function isMac() {
  return navigator.appVersion.indexOf('Mac') !== -1
}

/**
 * @returns {boolean}
 */
function isChrome() {
  return (ua.indexOf('chrome') > -1 && !isEdge());
}

/**
 * @returns {boolean}
 */
function isEdge() {
  return ua.indexOf('edg') > -1;
}

/**
 * @returns {boolean}
 */
function isFirefox() {
  return ua.indexOf('firefox') > -1;
}

/**
 * @returns {string}
 */
function getUserPlatform() {
  if (isMobile()) {
    return PLATFORM.MOBILE;
  }

  return PLATFORM.DESKTOP;
}

/**
 * @returns {string}
 */
function getUserOs() {
  if (isWindows()) {
    return OS.WINDOWS;
  } else if (isLinux()) {
    return OS.LINUX;
  } else if (isIOS()) {
    return OS.IOS;
  } else if (isMac()) {
    return OS.MAC;
  }

  return OS.OTHER;
}

/**
 * @returns {string}
 */
function getUserBrowser() {
  if (isChrome()) {
    return BROWSER.CHROME;
  } else if (isEdge()) {
    return BROWSER.EDGE;
  } else if (isFirefox()) {
    return BROWSER.FIREFOX;
  }

  return BROWSER.OTHER;
}

/**
 * @returns {{os: (string), browser: (string), platform: (string)}}
 */
function getUserAgentMetaData() {
  return {
    platform: getUserPlatform(),
    os: getUserOs(),
    browser: getUserBrowser()
  };
}

/**
 * @param key
 * @param ttl
 * @param storageType
 */
function setWithExpiry(key, ttl, storageType) {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  const now = new Date();

  storage.setItem(key, JSON.stringify({
    expiry: now.getTime() + ttl
  }));
}

/**
 * @param key
 * @param storageType
 * @returns {boolean}
 */
function isNotExpired(key, storageType) {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  const itemStr = storage.getItem(key);
  if (!itemStr) {
    return false;
  }
  const item = JSON.parse(itemStr);
  const now = new Date();
  if (now.getTime() > item.expiry) {
    storage.removeItem(key)
    return false;
  }
  return true;
}

/**
 * @param key
 * @param storageType
 */
function removeFromStorage(key, storageType) {
  const storage = storageType === 'localStorage' ? localStorage : sessionStorage;
  storage.removeItem(key);
}
