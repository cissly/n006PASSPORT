function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    next();
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}