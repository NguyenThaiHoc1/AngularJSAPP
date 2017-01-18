var authMiddleware = {
    ensureAuthenticated: function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }else{
            console.log('Receive unauthenticated request');
            res.send({
                success: false,
                msg: "You need to login first"
            });
            // res.redirect('/');
        }
    },

}


module.exports = authMiddleware;
