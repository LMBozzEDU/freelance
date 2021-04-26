async function registerRoute(route,fname) {
    const path = new String(route.path);
    const method = new String(route.method).toLowerCase();
    let scopes = route.scopes;
    let query_requirements = route.query_requirements;
    let header_requirements = route.header_requirements;
    let body_requirements = route.body_requirements;
    const handle = route.handle;

    const methodHandler = (cb) => {
        console.log(`Registering ${method} ${path} for ${fname}`)
        if (method == "get") {
            api.get(path, (req, res) => {
                cb(req, res)
            });
        } else if (method == "post") {
            api.post(path, (req, res) => {
                cb(req, res)
            });
        } else if (method == "delete") {
            api.delete(path, (req, res) => {
                cb(req, res)
            });
        } else if (method == "put") {
            api.put(path, (req, res) => {
                cb(req, res)
            });
        } else if (method == "patch") {
            api.patch(path, (req, res) => {
                cb(req, res)
            });
        } else {
            api.get(path, (req, res) => {
                cb(req, res)
            });
        }
    }

    methodHandler(async (req, res) => {
        try {
            let headerRequirementsMet = header_requirements.every((val) => req.headers[val]  !== undefined);
            let queryRequirementsMet = query_requirements.every((val) => req.query[val] !== undefined);
            let bodyRequirementsMet = body_requirements.every((val) => req.body[val] !== undefined);
            if (queryRequirementsMet) {
                if (headerRequirementsMet) {
                    if (bodyRequirementsMet) {
                            try {
                                handle({
                                    scopeHandeld: "none",
                                }, req, res)
                            } catch (e) {
                                console.log(e)
                                res.status(500).json({
                                    success: false,
                                    reason: "Internal server error"
                                })
                            }
                    } else {
                        res.status(400).json({
                            success: false,
                            reason: "missing params",
                            params: body_requirements.filter((a) => !req.body[a])
                        })
                    }
                } else {
                    res.status(400).json({
                        success: false,
                        reason: "missing params",
                        params: header_requirements.filter((a) => !req.headers[a])
                    })
                }
            } else {
                res.status(400).json({
                    success: false,
                    reason: "missing params",
                    params: query_requirements.filter((a) => !req.query[a])
                })
            }
        } catch (e) {
            console.log(e)
            res.json({
                success: false,
                reason: "Something went wrong on the server, please try again later."
            })
        }
    })
}


walk("./router/routes").then(function (files) {
    files.forEach(file => {
        if (file !== ".DS_Store") {
            try {
                const removeJs = file.replace(".js", "").replace("router/", "") // .substring(3, file.replace(".js", "").length)
                const route = require("./" + removeJs);
                console.log("./" + removeJs)
                registerRoute(route, removeJs);
            } catch (err) {
                console.log(err)
            }
        }
    });
});