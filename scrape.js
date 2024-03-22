
var port = chrome.runtime.connect({name: "content-script"});
port.onMessage.addListener(function(message) {
    if(message.request === "get-chat-messages"){
        setTimeout(() =>{
            const config = { attributes: true, childList: false, subtree: false};
            const targetNode = document.querySelector("#chatframe").contentWindow.document.querySelector("div#items.style-scope.yt-live-chat-item-list-renderer");
            console.log("this is target node", targetNode)
            const callback = (mutationList) => {
                for(const mutation of mutationList){
                    var repsonse = {
                        author: mutation.target.lastChild.querySelector("span#author-name").innerText,
                        message: mutation.target.lastChild.querySelector("span#message").innerText
                    }
                    console.log(mutation.target.lastChild.querySelector("span#message").innerText);
                    console.log("mutation oberseved");
                    port.postMessage({author: repsonse.author})
                    port.postMessage({message: repsonse.message})
                    
                }
            }
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        }, 5000)
    }
});

