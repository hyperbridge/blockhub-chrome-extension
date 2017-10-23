// Copyright 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// var port = null;

// var getKeys = function (obj) {
//   var keys = [];
//   for (var key in obj) {
//     keys.push(key);
//   }
//   return keys;
// }


// function appendMessage(text) {
//   document.getElementById('response').innerHTML += "<p>" + text + "</p>";
// }

// function updateUiState() {
//   if (port) {
//     document.getElementById('connect-button').style.display = 'none';
//     document.getElementById('input-text').style.display = 'block';
//     document.getElementById('send-message-button').style.display = 'block';
//   } else {
//     document.getElementById('connect-button').style.display = 'block';
//     document.getElementById('input-text').style.display = 'none';
//     document.getElementById('send-message-button').style.display = 'none';
//   }
// }

// function sendNativeMessage() {
//   message = { "Command": "text", "Value": document.getElementById('input-text').value };
//   port.postMessage(message);
//   appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
// }

// function healthCheck() {
//   message = { "Command": "healthcheck", "Value": "ok" };
//   port.postMessage(message);
// }

// var initialized = false;

// function onNativeMessage(message) {
//   console.log(message);

//   if (message.Command === "text") {
//     appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
//   }

//   if (!initialized) {
//     initialized = true;

//     setInterval(healthCheck, 50);
//   }
// }

// function onDisconnected() {
//   appendMessage("Failed to connect: " + chrome.runtime.lastError.message);
//   port = null;
//   updateUiState();
// }

// function connect() {
//   var hostName = "com.jet.portal";
//   appendMessage("Connecting to native messaging host <b>" + hostName + "</b>")
//   port = chrome.runtime.connectNative(hostName);
//   port.onMessage.addListener(onNativeMessage);
//   port.onDisconnect.addListener(onDisconnected);
//   // port.postMessage({ cmd: '-test' });
//   // port.postMessage({ cmd: '-logFile' });
//   updateUiState();
// }

// document.addEventListener('DOMContentLoaded', function () {
//   document.getElementById('connect-button').addEventListener(
//     'click', connect);
//   document.getElementById('send-message-button').addEventListener(
//     'click', sendNativeMessage);
//   updateUiState();
// });


// chrome.runtime.onMessage.addListener(
//   function (request, sender, sendResponse) {
//     if (request.processing) {
//       chrome.browserAction.setBadgeText({ text: INITED });

//       const settings = {};

//       // chrome.storage.sync.get([
//       //     'bittrex-enhanced-tvChart',
//       //     'bittrex-enhanced-usdVal',
//       //     'bittrex-enhanced-tvChartOpts'
//       // ], function (data) {
//       //     settings.tvChart = data['bittrex-enhanced-tvChart'];
//       //     settings.usdVal = data['bittrex-enhanced-usdVal'];
//       //     settings.tradingViewOpts = data['bittrex-enhanced-tvChartOpts'] || {};
//       //     sendResponse(settings);
//       // });

//       message = { "Command": "text", "Value": "Found ad" };
//       port.postMessage(message);
//       appendMessage("Sent message: <b>" + JSON.stringify(message) + "</b>");
//     }

//     return true;
//   }
// );


/**
 * A very simple chrome extension that proxies a chrome Port
 * established with a client JS -- that is, JS running on a vanilla
 * web page with permission to connect to the present chrome extension
 * -- to a chrome native messaging host -- that is the chromello
 * executable.  This is necessary because the chrome security model
 * does not allow untrusted JS to speak directly to a native messaging
 * host.
 *
 * @param {Port} jsPort The port object representing a connection to
 * the external client JS.
 */
// function onConnectExternal(jsPort) {
//   if (!jsPort.name) {
//     console.log('Bad name passed to native proxy extension.');
//     jsPort.disconnect();
//     return;
//   }

//   console.log('Establishing proxy connection to native host: ' + jsPort.name);

//   var nativePort = chrome.runtime.connectNative(jsPort.name);

//   nativePort.onDisconnect.addListener(function () {
//     // Native port has disconnected, so now disconnect the js port.
//     console.log('Native message port disconnected: ' +
//       chrome.runtime.lastError.message);
//     jsPort.disconnect();
//   });

//   nativePort.onMessage.addListener(function (msg) {
//     // Just pass all messages from native port to js port.
//     jsPort.postMessage(msg);
//   });

//   jsPort.onMessage.addListener(function (msg) {
//     // Just pass all messages from js port to native port.
//     nativePort.postMessage(msg);
//   });

//   jsPort.onDisconnect.addListener(function (msg) {
//     // Js port has disconnected, so now disconnect from native port.
//     nativePort.disconnect();
//   });
// }

// chrome.runtime.onConnectExternal.addListener(onConnectExternal);
