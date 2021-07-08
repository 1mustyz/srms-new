//check if user is logged in && the user is not trying to access unauthorised data
exports.isLoggedIn = function (role) {
    return (req, res, next) => {
      if (req.isAuthenticated() && req.user.role.includes(role)) {
        return res.json({ 
          success: true, 
          message: 'valid user', 
          passport: req.session 
        })
      }else{
        res.json({ 
          success: false, 
          message: 'unauthorized or authenticated user', 
        })
      }
    }
  }