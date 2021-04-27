//start of frontend

const config = require("../config.json")[0];

global.config = config;
global.express = require('express');
global.fetch = require("node-fetch");
global.ejs = require("ejs");
global.path = require("path");
global.ws = require("ws");
global.fs = require("fs");

const main = express();
main.set('views', path.join(__dirname, 'views'));
main.set("view engine", "ejs"); //Main Service

main.listen(config.ports.main);

global.main = main;

global.main.use('/assets', express.static('./served_assets'))

function walk(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (error, files) => {
            if (error) {
                return reject(error);
            }
            Promise.all(files.map((file) => {
                return new Promise((resolve, reject) => {
                    const filepath = path.join(dir, file);
                    fs.stat(filepath, (error, stats) => {
                        if (error) {
                            return reject(error);
                        }
                        if (stats.isDirectory()) {
                            walk(filepath).then(resolve);
                        } else if (stats.isFile()) {
                            resolve(filepath);
                        }
                    });
                });
            })).then((foldersContents) => {
                resolve(foldersContents.reduce((all, folderContents) => all.concat(folderContents), []));
            });
        });
    });
}

walk("./routes").then(function (files) {
    files.forEach(file => {
        if (file !== ".DS_Store") {
            try {
                const removeJs = file.replace(".js", "") //.substring(8, file.replace(".js", "").length)
                require("./" + removeJs);
                console.log(removeJs);

            } catch (err) {
                console.log(err)
            }
        }
    });
});