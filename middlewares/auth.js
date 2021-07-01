//check if user is logged in && the user is not trying to access unauthorised data
exports.isLoggedIn = function (role) {
    return (req, res, next) => {
      if (req.isAuthenticated()) {
        return res.json({ success: true, message: 'valid user' })
      }
      res.json({ success: false, message: 'unauthorized or authenticated user', user: req.user})
    }
  }