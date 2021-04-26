//start of backend

const config = require("../config.json")[0];

global.config = config;
global.ejs = require("ejs");
global.body_parser = require('body-parser');
global.fs = require("fs");
global.express = require('express');
global.fetch = require("node-fetch");
global.cookie_parser = require('cookie-parser');
global.cors = require("cors");
global.events = require('events');
global.path = require("path");

//Setup Main Directories
const api = express();

api.listen(config.ports.backend);


global.api = api;

global.walk = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (error, files) => {
            if (error) {
                console.log("walk error");
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
require("./router/index.js");
