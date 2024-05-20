import * as deepl from 'deepl-node'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()



const app = express(); 
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const port = process.env.PORT;

//middleway to handle CORs policy 

app.use(
    cors({
        origin: "chrome-extension://aijikgbecokagpnlcjhbllaaihglhgao",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization', 'body'],
      
        credentials: true
    })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.post('/translate',async(req, res) => {
    try{
        const requestData = req.body;
        console.log('Received data from extension:', requestData); //debug line
        const usage = await translator.getUsage();
        if (!usage.anyLimitReached()){
            if(requestData.text[0] != ""){
                (async () => {
                    const result = await translator.translateText(req.body.text[0], null, 'en-US');
                    console.log(result.text); //debug line
                    res.json({text: result.text});
                })();
            }
        }else{
            res.json({ error : "DeepL API Translation limit reached"})
        }

        
        
    }catch{
        res.status(500).json({ error: 'Proxy Error' });
    }
});

app.post('/libre-translate', async(req, res) => {
    try{
        const requestData = req.body;
        // console.log('Received data from extension:', requestData)
        
        const response =  await axios.post(process.env.LOCAL_LIBRE_INSTANCE, {
            q: requestData.text[0],
            source: "auto",
            target: "en",
        });
        res.json({text: response.data.translatedText});
        console.log(response.data.translatedText);
        
        
        
    }catch{
        res.json({error: 'Something went wrong'});
    }
})

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`)
})
