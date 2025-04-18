const { StatusCodes } = require("http-status-codes");
const { DbConfig, ImgConfig } = require('../config');
const { Event } = DbConfig;

const validateEventCreation = async (req, res, next) => {

    try {
        const content = req.body;

        if(!content.title){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing Title"
            })
        }

        if(!content.description){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing description"
            })
        }

        if(!content.location){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing location"
            })
        }

        if(!content.startTime){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing startTime"
            })
        }

        if(!content.endTime){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing endTime"
            })
        }

        if(!content.bannerUrl){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing bannerUrl"
            })
        }

        if(!content.participants){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Missing participants"
            })
        }

        if (new Date(content.startTime) >= new Date(content.endTime)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'startTime must be before endTime.' });
        }

        next();
        
    } catch (error) {

        console.error(error);
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Somthing Went wrong"
        });
    }

}


const validateEventUpdation = async (req, res, next) => {

    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
    }

    const userId = req.user._id; 
    const updates = req.body;


    try {

        

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Event not found' });
        }

        if (event.createdBy.toString() !== userId.toString()) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'You are not authorized to update this event' });
        }

        if (updates.startTime && updates.endTime && new Date(updates.startTime) >= new Date(updates.endTime)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'startTime must be before endTime' });
        }

        req.event = event;
        req.updates = updates;

        next();

    } catch (error) {

        console.error(error);
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Somthing Went wrong"
        });
    }

}



const validateImage = async (req, res, next) => {
    try {

        const userId = req.user._id;
        const id = req.params.id;

        const findEvent = await Event.findById(id);

        if(!findEvent){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: "This Image doesn't exists"
            });
        }

        const EventUserId = findEvent.createdBy;

        if(EventUserId != userId){
            return res.status(StatusCodes.FORBIDDEN).json({
                error: "You are Not Allowed to Make this Request"
            });
        }

        if(!req.files || Object.keys(req.files).length == 0){
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: "Image not Found"
            });
        }

        const banner = req.files.banner;
        const filetype = banner.mimetype.split('/')[1];
        console.log(filetype);

        const message = ImgConfig.imageValidator(banner.size, filetype);

        console.log(message);


        if(message.length != 0){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message
            }); 
        }


        next();

    } catch (error) {
        console.error(error);
        
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: "Somthing Went wrong"
        });
    }
}


module.exports = {
    validateEventCreation,
    validateEventUpdation,
    validateImage
}