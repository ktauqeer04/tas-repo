const { StatusCodes, BAD_REQUEST } = require('http-status-codes');
const { Event } = require('../config/db');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const { generateRandomNumber } = require('../config/imgConfig');


const createEvent = async (req, res) => {

    try {
        
        const {
            title,
            description,
            location,
            startTime,
            endTime,
            maxParticipants,
            isPublished
          } = req.body;

        const newEvent = new Event({
            title,
            description,
            location,
            startTime,
            endTime,
            maxParticipants,
            isPublished,
            createdBy: req.user._id, 
        });
      
        const savedEvent = await newEvent.save();

        res.status(StatusCodes.OK).json({
            message: 'Event created successfully',
            event: savedEvent,
          });
      

        
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


const getAllEvents = async (req, res) => {

    try {

        const events = await Event.find();
        return res.status(StatusCodes.OK).json({
            events: events
        });
        
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


const getSpecificEvent = async (req, res) => {


    const id = req.params.id;
    

    try {   

        const specificEvent = await Event.findById(id);

        if(!specificEvent){
            return res.status(StatusCodes.NOT_FOUND).json({
                error: 'Event not found'
            });
        }

        return res.status(StatusCodes.OK).json({
            specificEvent
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


const updateEvent = async (req, res) => {

    try {
        
        const event = req.event;
        const updates = req.updates;

        Object.assign(event, updates);
        const updatedEvent = await event.save();

        res.status(StatusCodes.OK).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


const deleteEvent = async (req, res) => {

    try {
        
        const eventId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid event ID' });
        }

        await Event.deleteOne({_id: eventId});

        return res.status(StatusCodes.OK).json({
            message: "Event Successfully Deleted"
        });

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


const uploadImageBanner = async (req, res) => {

    try {
        
        const banner = req.files.banner;
        const fileExtension = banner.name.split(".");
        const imageName = generateRandomNumber() + "." + fileExtension[1];
        const id = req.params.id;


        const uploadPath = process.cwd() + "/uploads/" + imageName;
        
        banner.mv(uploadPath, (err) => {
            if(err){
                throw err;
            }
        })

        await Event.findByIdAndUpdate(id, {
            bannerUrl: imageName
        })

        return res.status(StatusCodes.OK).json({
            message: "Banner updated Successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong"
        });
    }

}


module.exports = {

    createEvent,
    getAllEvents,
    getSpecificEvent,
    updateEvent,
    deleteEvent,
    uploadImageBanner

}