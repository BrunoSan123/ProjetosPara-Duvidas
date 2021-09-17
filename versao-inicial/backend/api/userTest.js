module.exports = (app) => {
  const post = (req, res) => {
    const user = { ...req.body };

    res.send("funcionando..");
    console.log(user);
  };

  return { post };
};
