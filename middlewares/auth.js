//check if user is logged in && the user is not trying to access unauthorised data
exports.isLoggedIn = function (role) {
    return (req, res, next) => {
      if (req.isAuthenticated() && (req.user.role.includes(role) 
      || req.user.role.includes('Admin'))) {
        return res.json({ success: true, message: 'valid user', user: req.user })
      }else{
      res.json({ success: false, message: 'unauthorized or authenticated user', user: req.user})
    }
  }
  }