const { StatusCodes } = require('http-status-codes');
const { User } = require('../config/db');
const { ServerConfig } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const secret = ServerConfig.JWT_SECRET;



const login = async (req, res) => {

    try {
        
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if(!user){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Authentication Failed, Email not Found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const Randomtoken = jwt.sign(user.toJSON(), secret, {
            expiresIn: '5h'
        });

        const completeToken = "Bearer " + Randomtoken;

        return res.status(StatusCodes.OK).json({ token: completeToken });


    } catch (error) {

        console.error(error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}

const register = async (req, res) => {

    try {
        
        const { email, password } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPass});
        await user.save();

        return res.status(StatusCodes.OK).json({
            message: "Registered Successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


module.exports = {
    login, 
    register
}