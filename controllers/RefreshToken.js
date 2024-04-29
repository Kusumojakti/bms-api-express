const users = require("../models/user");
const jwt = require("jsonwebtoken");

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const user = await users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userID = user.user_id;
        const name = user.name;
        const email = user.email;
        const accesstoken = jwt.sign(
          { userID, name, email },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "15s",
          }
        );
        res.json({ accesstoken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = refreshToken;
