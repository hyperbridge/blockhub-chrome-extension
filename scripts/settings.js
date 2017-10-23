

function appendMessage(text) {
    document.getElementById('response').innerHTML += "<p>" + text + "</p>";
}

function sendNativeMessage() {
    chrome.runtime.sendMessage({
        Command: 'text',
        Value: document.getElementById('input-text').value
    }, function (settings) {
    });
    
    appendMessage("Sent message: <b>" + document.getElementById('input-text').value + "</b>");
}

function checkMessages() {
    console.log("Checking messages");

    chrome.runtime.sendMessage({
        checkMessages: true
    }, function (messages) {
        if (!messages) { return; }

        console.log(messages);

        messages.forEach(function(message) {
            if (message.Command === "text") {
                appendMessage("Received message: <b>" + JSON.stringify(message) + "</b>");
            }
        })
    });
}
  
function updateUiState() {
    console.log("Checking state");
    chrome.runtime.sendMessage({
        getUiState: true
    }, function (uiState) {
        console.log("State: " + uiState);

        if (uiState == 'connected') {
            document.getElementById('connect-button').style.display = 'none';
            document.getElementById('input-text').style.display = 'block';
            document.getElementById('send-message-button').style.display = 'block';
        } else {
            document.getElementById('connect-button').style.display = 'block';
            document.getElementById('input-text').style.display = 'none';
            document.getElementById('send-message-button').style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('connect-button').addEventListener('click', function() {
        chrome.runtime.sendMessage({
            startApp: true
        }, function (settings) {
        });
    });
    
    document.getElementById('send-message-button').addEventListener('click', sendNativeMessage);
    
    setInterval(updateUiState, 1000);
    setInterval(checkMessages, 1000);
});