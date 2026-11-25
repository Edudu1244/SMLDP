const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign( 

        {
           id: user.id,
           email: user.email
        },

        process.env.JWT_SECRET || "segredo_super_secreto",

        {
            expiresIn: "7d"
        }
      )}

   module.exports = generateToken;
