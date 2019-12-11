function log(req,resp, next){
    console.log("Test Authenticating");
    next();
}

module.exports = log;
