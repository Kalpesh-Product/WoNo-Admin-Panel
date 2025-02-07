const errorHandler = (err, req, res, next) => {
  (err.stack);
  res.status(500).json({ message: err.message });
  next();
};

module.exports = errorHandler;
