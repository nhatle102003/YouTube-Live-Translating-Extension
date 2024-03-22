
chrome.runtime.onInstalled.addListener(() => {
    console.log('SHIT!.');
    console.log(chrome.tabs.TabStatus.COMPLETE === "complete")
})


chrome.tabs.onUpdated.addListener((tabId, tab) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const currentUrl = tabs[0].url;
        console.log(currentUrl)
        console.log("Hey!")
        
        chrome.runtime.onConnect.addListener(function(port){
            console.assert(port.name === "content-script");
            port.postMessage({request : "get-chat-messages"});
            port.onMessage.addListener(function(msg){
                if(msg.author){
                    console.log("I recieved ", msg.author);
                }else if (msg.message){
                    console.log("I received ", msg.message);
                }
            });
        });
    })
})

