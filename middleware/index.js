const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Auth');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader;
    if(!token || token === ''){
        req.isAuth = false;
        return next();
    }
    let decodeToken;
    try{
        decodeToken = jwt.verify(token, 'mystring');
    } catch (e){
        req.isAuth = false;
        return next();
    }
    if(!decodeToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId = decodeToken.userId;
    req.username = decodeToken.username;
    req.email = decodeToken.email;
    next();
}