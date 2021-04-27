module.exports = {
    path: "/user/register",
    method: "post",
    scopes: [],
    query_requirements: [],
    body_requirements: ["email", "username", "password"],
    header_requirements: [],
    handle: async function (callbackData, req, res) {
      //create user
      const [something] = await database.execute("SELECT * FROM bloxgraphicsusers");
      res.json({data: something})
    }
};