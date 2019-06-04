
const expirationFilter = () => (req, res, next) => {
  const config = req.websiteConfig;
  const expiresAt = new Date(config.expiresAt);
  const today = new Date();
  if (today.getTime() >= expiresAt.getTime()) {
    res.send('The website expired :(');
  }
  next();
};

module.exports = expirationFilter;