import { Defaults } from '../constants/defaults';

export class Chrome {
  // Panel helpers
  // ============================================================================================

  static getTopSites (max = 10) {
    return new Promise((resolve, reject) => {
      chrome.topSites.get((visitedURLs) => {
        visitedURLs = visitedURLs.slice(0, parseInt(max, 10));

        let items = visitedURLs.map((site) => ({
          title : site.title,
          url   : site.url,
          img   : `chrome://favicon/size/16@2x/${site.url}`
        }));

        resolve(items);
      });
    });
  }

  static getRecentlyClosed (max = 10) {
    return new Promise((resolve, reject) => {
      chrome.sessions.getRecentlyClosed((sessions) => {
        sessions = sessions.slice(0, parseInt(max, 10));

        let items = sessions.map((session) => {
          if (session.window && session.window.tabs.length === 1) {
            session.tab = session.window.tabs[0];
          }

          return {
            title   : session.tab ? session.tab.title : `${session.window.tabs.length} Tabs`,
            session : session.window ? session.window.sessionId : session.tab.sessionId,
            img     : session.tab ? `chrome://favicon/${session.tab.url}` : null
          };
        });

        resolve(items);
      });
    });
  }

  static getApps () {
    return new Promise((resolve, reject) => {
      chrome.management.getAll((list) => {
        // Only get active apps (no extensions)
        list = list.filter((a) => a.enabled && a.type !== 'extension' && a.type !== 'theme' && a.isApp);

        // Sort them alphabetically
        list.sort((a, b) => {
          if (a.name < b.name)      { return -1; }
          else if (a.name > b.name) { return 1; }
          else                      { return 0; }
        });

        let items = list.map((extInf => ({
          title : extInf.name,
          id    : extInf.id,
          img   : Chrome._find128Image(extInf.icons)
        })));

        items.push({
          title : 'All apps',
          id    : 'ntp-apps',
          img   : '../assets/img/apps128.png',
          href  : 'chrome://apps'
        });

        items.push({
          title : 'Web store',
          id    : 'ntp-webstore',
          img   : '../assets/img/webstore128.png',
          href  : 'https://chrome.google.com/webstore'
        });

        resolve(items);
      });
    });
  }

  static getShortcuts () {
    const SHORTCUTS = [
      {
        title : 'Bookmarks',
        url   : 'chrome://bookmarks/',
        img   : 'chrome://favicon/chrome://bookmarks/'
      },
      {
        title : 'History',
        url   : 'chrome://history/',
        img   : 'chrome://favicon/chrome://history/'
      },
      {
        title : 'Downloads',
        url   : 'chrome://downloads/',
        img   : 'chrome://favicon/chrome://downloads/'
      },
      {
        title : 'Extensions',
        url   : 'chrome://extensions/',
        img   : 'chrome://favicon/chrome://extensions/'
      },
      {
        title : 'Settings',
        url   : 'chrome://settings/',
        img   : 'chrome://favicon/chrome://settings/'
      }
    ];

    return new Promise((resolve, reject) => {
      resolve(SHORTCUTS);
    })
  }

  static getDevices () {
    return new Promise((resolve, reject) => {
      chrome.sessions.getDevices((devices) => {
        let items = devices.map((device) => {
          let tabs = [];

          for (let session of device.sessions) {
            let sessionTabs = session.window ? session.window.tabs : [session.tab];

            for (let tab of sessionTabs) {
              tabs.push({
                title : tab.title,
                url   : tab.url,
                img   : `chrome://favicon/${tab.url}`
              });
            }
          }

          return {
            title : device.deviceName,
            tabs  : tabs
          };
        });

        resolve(items);
      });
    });
  }

  static _find128Image (icons) {
    for (let icon of icons) {
      if (icon.size === 128) {
        return icon.url;
      }
    }

    return '/noicon.png';
  }


  // Settings helpers (Chrome extension storage)
  // ============================================================================================

  static getSettings () {
    return Chrome.getSetting(null);
  }

  static getSetting (key) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (results) => {
        if (key === null) {
          results = Object.assign({}, Defaults, results);
        }

        resolve(results);
      });
    });
  }

  static setSetting (key, value) {
    chrome.storage.sync.set({
      [key]: value
    });

    // Prompt new tab page to fetch new settings
    chrome.runtime.sendMessage({ msg: 'saved', key: key });
  }
}
