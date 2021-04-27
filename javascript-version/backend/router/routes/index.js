module.exports = {
    path: "/",
    method: "get",
    scopes: [],
    query_requirements: [],
    body_requirements: [],
    header_requirements: [],
    handle: async function (callbackData, req, res) {
        let devs = [];
        config.devs.forEach((dev) => {
            devs.push(dev);
        })
        res.json({
            success: true,
            version: 1,
            owners: devs,
        })
    }
};