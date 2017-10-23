
function whenReady(callback) {
    if (document.readyState === 'complete') callback();
    else { document.onreadystatechange = callback; }
};

const Enhancer = {};

Enhancer.opts = {
};

Enhancer.replaceAd = function replaceAd(text) {
    const node = document.getElementById('tads');//document.querySelectorAll('.chart-wrapper');
    
    if (node) {
        // Clean
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        const newElement = document.createElement('div');
        newElement.id = "portal-ad";
        newElement.innerHTML = "<div>" + text + "</div>";
        node.appendChild(newElement);
    }
}

Enhancer.start = function start() {
    Enhancer.replaceAd("Loading...");
}

Enhancer.notifyBackground = function notifyBackground() {
    chrome.runtime.sendMessage({
        Command: 'text',
        Value: 'found ad!'
    }, function () {
        Enhancer.start();
    });
}

Enhancer.checkMessages = function() {
    console.log("Checking messages");

    chrome.runtime.sendMessage({
        checkMessages: true
    }, function (messages) {
        if (!messages) { return; }

        console.log(messages);

        messages.forEach(function (message) {
            if (message.Command === "text") {
                Enhancer.replaceAd(JSON.stringify(message));
            }
        })
    });
}

whenReady(function () {
    Enhancer.notifyBackground();

    setInterval(Enhancer.checkMessages, 500);
});