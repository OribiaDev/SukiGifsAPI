//Copyright 2026 Oribia. All Rights Reserved
//If you see this, woof woof :3 - OribiaDev

const express = require("express");
const app = express();
const os = require('os');
const path = require("path");
const fs = require('fs');

//Vars
const port = 3000;
const emotes = fs.readdirSync(path.join(__dirname, "emotes"), {withFileTypes: true}).filter(entry => entry.isDirectory()).map(entry => entry.name);

//Init Logging
app.use(logger)

//Expose folders
for (const emote of emotes) {
    app.use(`/${emote}`,express.static(path.join(__dirname, "emotes", emote)));
}

//Routes
app.get('/', (req, res) => {
    res.json({ parameters : emotes})
})

app.get("/:emote", (req, res) => {
    let emote = req.params.emote;
    if(emotes.includes(emote)){
        const imagesDir = path.join(__dirname, "emotes", emote);
        fs.readdir(imagesDir, (err, files) => {
            // Only keep image files
            const images = files.filter(file =>
                /\.(png|jpe?g|gif|webp)$/i.test(file)
            );
            const randomImage = images[Math.floor(Math.random() * images.length)];
            res.json({
                url: `${req.protocol}://${req.get("host")}/${emote}/${randomImage}`
            });
        });
    }else{
        res.status(404).json({ message: `This parameter doesnt exist. Please refer to ${req.protocol}://${req.get("host")}/ for a list of parameters.`, code: '404'})
    }
});

//Logger
function logger(req, res, next) {
    console.log(`${req.ip} requested ${req.originalUrl}`)
    next()
}

//Startup
app.listen(port, () =>{
    const ip = (Object.values(os.networkInterfaces()).flat().find(iface => iface.family === 'IPv4' && !iface.internal) || {}).address;
    console.log(`API started at http://${ip}:${port}`)
    console.log("----")
});