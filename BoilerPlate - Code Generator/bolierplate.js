// js script to make bolierplate using fs file module

// index.js
// index.html
// index.css

const fs = require('fs');

// fs.mkdir('project' , {recursive : true } , err => {
//     if(err) throw err;
// })

try{
    fs.mkdirSync('project')
}
catch{
    console.log('[ALREADY EXISTS] : folder - "project"')
}
process.chdir('project')

fs.writeFileSync('index.html', '')
fs.writeFileSync('index.js', '')
fs.writeFileSync('index.css', '')


//  ----  Remove files
// fs.rmdirSync('project')
// fs.rmSync('index.html')
// fs.rmSync('index.js')
// fs.rmSync('index.css')

console.log('All Done !!')