const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const { ServerConfig } = require('../config');
const { DbConfig } = require('../config');
const Event = DbConfig.Event;
const secret = ServerConfig.JWT_SECRET;

const validateUser = async (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Token not provided" });
    }

    try {

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();

    } catch (error) {

        console.error(error);
        res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token' });

    }

}


const validateAdminBeforeUpdate = async (req, res, next) => {

    try {

        const updatePayload = req.body;

        if (!req.user) {
          return res.status(StatusCodes.FORBIDDEN).json({ error: 'Access denied. Admins only.' });
        }

        const Userid = req.user._id;
        const id = req.params.id;
        const payload = await Event.findById(id);
        const EventUserId = payload.createdBy;

        console.log(Userid);
        console.log(EventUserId);

        if(Userid != EventUserId){
            return res.status(StatusCodes.FORBIDDEN).json({
                error: "You are not Allowed to Access this event"
            });
        }

        req.event = payload;
        req.updates = updatePayload;

        next();

    } catch (error) {

        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });

    }

}


const validateAdminBeforeDelete = async (req, res, next) => {
    try {
        
        const eventId = req.params.id;
        const event = await Event.findById(eventId);

        if(!event){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "Event Not Found"
            });
        }

        if(event.createdBy != req.user._id){
            return res.status(StatusCodes.FORBIDDEN).json({
                error: "You are not Allowed to make this request"
            });
        }

        next();

    } catch (error) {

        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.' });

    }
}


module.exports = {
    validateUser,
    validateAdminBeforeUpdate,
    validateAdminBeforeDelete
}