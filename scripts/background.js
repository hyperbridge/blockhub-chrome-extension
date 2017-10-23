///////////////////////////// NATIVE MESSAGING


var port = null;
var uiState = 'disconnected';

var getKeys = function (obj) {
    var keys = [];
    for (var key in obj) {
        keys.push(key);
    }
    return keys;
}

function sendNativeMessage(command, value) {
    message = { "Command": command, "Value": value };
    port.postMessage(message);
}

function healthCheck() {
    message = { "Command": "healthcheck", "Value": "ok" };
    port.postMessage(message);
}

var initialized = false;
var messages = [];

function onNativeMessage(message) {
    console.log(message);

    if (message.Command === "text") {
        messages.push(message)
    }

    if (!initialized) {
        initialized = true;

        setInterval(healthCheck, 50);
    }
}

function onDisconnected() {
    //appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
    uiState = 'disconnected';
}

function connect() {
    var hostName = "com.jet.portal";

    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
    // port.postMessage({ cmd: '-test' });
    // port.postMessage({ cmd: '-logFile' });

    uiState = 'connected';
}


/////////////////////////////////// EXTENSION


const INITED = '✓';
const NOTINITED = '×';

chrome.browserAction.setBadgeBackgroundColor({ 'color': '#0072ed' });
chrome.browserAction.setBadgeText({ text: NOTINITED });


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.getUiState) {
            sendResponse(uiState);
            return true;
        }
        
        if (request.processing) {
            chrome.browserAction.setBadgeText({ text: INITED });

            //const settings = {};

            // chrome.storage.sync.get([
            //     'bittrex-enhanced-tvChart',
            //     'bittrex-enhanced-usdVal',
            //     'bittrex-enhanced-tvChartOpts'
            // ], function (data) {
            //     settings.tvChart = data['bittrex-enhanced-tvChart'];
            //     settings.usdVal = data['bittrex-enhanced-usdVal'];
            //     settings.tradingViewOpts = data['bittrex-enhanced-tvChartOpts'] || {};
            //     sendResponse(settings);
            // });


        }

        if (request.startApp) {
            connect();
        }

        if (request.Command) {
            sendNativeMessage(request.Command, request.Value);
        }

        if (request.checkMessages) {
            if (messages.length) {
                sendResponse(messages)
                //messages = [];
            }
        }

        return true;
    }
);

chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create(
        'main.html', {
            id: 'mainWindow',
            // frame: 'none',
            bounds: {
                width: 640,
                height: 640
            },
            minWidth: 360,
            minHeight:640,
        }
    );
});

var runChannelWhitelist = function (tabUrl, tabId) {
    if (parseUri(tabUrl).hostname === 'www.youtube.com' && getSettings().youtube_channel_whitelist && !parseUri.parseSearch(tabUrl).ab_channel) {
        // chrome.tabs.executeScript(tabId, {
        //     file: 'adblock-ytchannel.js',
        //     runAt: 'document_start',
        // });
    }
};

chrome.tabs.onCreated.addListener(function (tab) {
    if (chrome.runtime.lastError) {
        return;
    }
    chrome.tabs.get(tab.id, function (tabs) {
        if (chrome.runtime.lastError) {
            return;
        }
        if (tabs && tabs.url && tabs.id) {
            runChannelWhitelist(tabs.url, tabs.id);
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (chrome.runtime.lastError) {
        return;
    }
    if (changeInfo.status === 'loading') {
        if (chrome.runtime.lastError) {
            return;
        }
        chrome.tabs.get(tabId, function (tabs) {
            if (tabs && tabs.url && tabs.id) {
                runChannelWhitelist(tabs.url, tabs.id);
            }
        });
    }
});