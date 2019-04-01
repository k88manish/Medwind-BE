module.exports = {
  handleError: (res, err) => {
    res.status(500);
    res.send({ error: err });
  }
};
