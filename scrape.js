
let messageStack =  new Set();
var port = chrome.runtime.connect({name: "content-script"});
port.onMessage.addListener(function(message) {
    
    if(message.request === "get-chat-messages"){
        setTimeout(() =>{
            const config = { attributes: true, childList: false, subtree: false};
            const targetNode = document.querySelector("#chatframe").contentWindow.document.querySelector("div#items.style-scope.yt-live-chat-item-list-renderer");
            console.log("this is target node", targetNode)
            const callback = (mutationList) => {
                if(mutationList[0].type === 'attributes'){
                    var repsonse = {
                        author: mutationList[0].target.lastChild.querySelector("span#author-name").innerText,
                        message: mutationList[0].target.lastChild.querySelector("span#message").innerText,
                        messageId: mutationList[0].target.lastChild.id
                    }
                    
                    if(!messageStack.has(repsonse.messageId)){
                        messageStack.add(repsonse.messageId);
                        port.postMessage({chatMessage: {id: repsonse.messageId, author: repsonse.author, message: repsonse.message}});
                        
                    }
                }

            }
            const observer = new MutationObserver(callback);
            setTimeout(() => {
                observer.observe(targetNode, config);
            }, 1000)
            
        }, 5000)
    }
});

