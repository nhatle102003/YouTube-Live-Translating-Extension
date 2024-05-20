
let seenMessage = new Set();

const option = {
    method: "POST",
    headers: {
            "Host": "http://localhost:8080/translate", 
            'Content-Type': 'application/json',},
    body: {},
    mode : 'cors'
};
///////////////////////////////////////////////////////////

function setMessagesToHeader(option, message){
    option.body = JSON.stringify({"text" : [message], "target_lang": "EN" });
}



chrome.runtime.onInstalled.addListener(() => {
    console.log('The application is running!');
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
                if(msg.chatMessage){
                    if(!seenMessage.has(msg.chatMessage.id)){
                        console.log(msg.chatMessage.id, msg.chatMessage.author, msg.chatMessage.message); // debug line
                        seenMessage.add(msg.chatMessage.id);
                        setMessagesToHeader(option, msg.chatMessage.message);
                        console.log(option);
                        
                        setTimeout(() => {
                            fetch("http://localhost:8080/libre-translate", option)
                            .then((response) => {
                                if (response.status === 403) {
                                    throw new Error("Something went wrong on API server!");
                                }
                                return response.json();
                            })
                            .then((data) => {
                                console.log(data);
                                // Handle the translated response data here
                            })
                            .catch((error) => {
                                console.error("Error translating:", error);
                            });
                        }, 1000)
                        // setTimeout(() => {
                        //     fetch("http://localhost:8080/translate", option)
                        //     .then((response) => {
                        //         if (response.status === 403) {
                        //             throw new Error("Something went wrong on API server!");
                        //         }
                        //         return response.json();
                        //     })
                        //     .then((data) => {
                        //         console.log(data);
                        //         // Handle the translated response data here
                        //     })
                        //     .catch((error) => {
                        //         console.error("Error translating:", error);
                        //     });
                        // }, 1000)
                    }
                }
            });
        });
    })
})

