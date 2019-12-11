function log(req,resp, next){
    console.log("Authenticating");
    next();
}

module.exports = log;