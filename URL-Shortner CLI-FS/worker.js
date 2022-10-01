// prompt
const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs')
const WEBSITE_URL = "https://abhaygupta.me/"
const generateSlug = (size) => {
    const store = `ABCDEFGHIJKLMNOPRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
    let resp = "";
    while(size--){
        resp += store[Math.floor(Math.random() * store.length)]
    }
    return resp;
}



// fs.rmSync('db.json')
if(!fs.existsSync('db.json')){
    fs.writeFileSync('db.json' , `{}`)
}
var data = JSON.parse(fs.readFileSync('db.json','utf-8'))


const mode = prompt(`Choose Mode : 

[1] : URL Finder
[2] : URL Adder
[3] : Statistics
`)


if(mode == 1){
    var url = prompt('Enter Short URL to extact big url : ')
    const slug = url.length > 12 ? url.split('https://abhaygupta.me/')[1] : url.split('https://abhaygupta.me/')[0]
    const request = data[slug]
    console.log(request)
    if(request){
        console.log(JSON.parse(`{
            "BigUrl" : "${request}",
            "result" : "success",
            "shortUrl" : "${WEBSITE_URL+slug}"
        }`))
    }
    else{
        console.log(JSON.parse(`{
            "result" : "failed"
        }`))
    }
}
else if(mode == 2){
    var url = prompt('Enter URL to shorten : ') 
    const slug = generateSlug(12)
    data[slug] = url;
    fs.writeFileSync('db.json',JSON.stringify(data));
    console.log(JSON.parse(`{
        "BigUrl" : "${url}",
        "ShortUrl" : "${WEBSITE_URL+slug}",
        "result" : "success"
    }`))
}
else if(mode == 3){
    console.log(`
    
    Total Short URLs : ${Object.keys(data).length}
    
    short_url       long_url
    ${Object.keys(data).map(key => (
    `${key}    ${data[key]}
   `
    ))}
    `)
}
else{
    console.log('[EXIT] : Invalid Output');
}
