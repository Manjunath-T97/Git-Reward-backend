import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// const fetch =(...args)=> import('node-fetch').then(({default:fetch})=>fetch(...args));
import fetch from 'node-fetch';
import axios from 'axios';


const CLIENT_id = "#";
const CLIENT_SECRET = "#";

const app = express();

app.use(cors());
app.use(bodyParser.json());

///////////code is being passed from frontend/////////// 
app.get("/getAccessToken", async  (req,res)=>{
const {code} = req.query;
const params = "?client_id="+CLIENT_id+"&client_secret="+CLIENT_SECRET+"&code="+req.query.code;
await fetch("https://github.com/login/oauth/access_token"+params,{
    method:"POST",
    headers: {
        "Accept":"application/json"
    }
}).then((response)=>{
    return response.json();
}).then((data)=>{
    res.json(data);
});
});

/////////////////////////////////////////////////////////////////////////////////////////

app.get("/getUserData", async (req,res)=>{
    // const header = req.get("Authorization");
    // console.log(header);
    await fetch("https://api.github.com/user",{
        method:"GET",
        headers:{
            "Authorization":req.get("Authorization")
        }
    }).then((response)=>{
        return response.json();
    }).then((data)=>{
        res.json(data);
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.delete("/logout", async (req,res)=>{
    const data = req.get("access_token");
    const id = req.query.client_id;
    console.log(data+" || "+id);
    const url = `https://api.github.com/applications/${CLIENT_id}/token`;

    try {
        const response = await axios.delete(url, {
            auth: {
                username: id,
                password: CLIENT_SECRET
            },
            data: {
                access_token: data
            }
        });

        console.log('Access token revoked successfully:', response.data);
        
    } catch (error) {
        console.error('Error revoking access token:', error.response?.data || error.message);
    }
  
    
})

app.listen(3000,()=>console.log("CORS server @ 3000"));