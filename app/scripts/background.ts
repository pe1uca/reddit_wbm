browser.webRequest.onBeforeRequest.addListener(
  (details) => { return { upgradeToSecure: true } },
  { urls: ["http://*.archive.org/*"], types: ["main_frame"] },
  ["blocking"]
);

browser.storage.local.get('enableRWBM').then((value) => {
  if (!value.enableRWBM) setRWBMEnabled(true);
});

browser.storage.local.onChanged.addListener((changes) => {
  if(changes.enableRWBM) setRWBMEnabled(changes.enableRWBM.newValue);
});

function setRWBMEnabled(enabled: boolean) {
  browser.webRequest.onBeforeRequest.removeListener(checkWBM);

  if (enabled) {
    browser.webRequest.onBeforeRequest.addListener(
      checkWBM,
      { urls: ["*://*.reddit.com/*"], types: ["main_frame"] },
      ["blocking"]
    );
  }
}

async function checkWBM(details: browser.webRequest._OnBeforeRequestDetails): Promise<browser.webRequest.BlockingResponse> {
  if (details.tabId === -1 || details.method !== "GET") {
    return {};
  }

  let url = details.url;
  if (!url.match(/^(http(s)?:\/\/)old\.reddit\.com/)) {
    url = "old.reddit.com" + url.split("reddit.com")[1];
  }

  const wbmResponse = await fetch(`https://archive.org/wayback/available?url=${url}`);
  const wbmJSON = JSON.parse(await wbmResponse.text());

  return {
    redirectUrl: wbmJSON.archived_snapshots.closest.url
  };
}