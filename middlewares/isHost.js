module.exports = (req, res, next) => {
  if (!req.session.isAuth) {
    return res.redirect('/login');
  }

  
  if (req.session.user.role.toLowerCase() !== 'host') {
    return res.redirect('/'); 
  }

  next();
};
