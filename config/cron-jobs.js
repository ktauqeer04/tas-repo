const cron = require('node-cron');
const { Event } = require('./db');

// Cron Job 1 - Runs every minute
const scheduleCronsEveryMinute = () => {
    cron.schedule('* * * * *', async () => {
        console.log('[Cron] scheduleCrons() has started!');
    
        try {
            const now = new Date();
            const fiveMinsLater = new Date(now.getTime() + 5 * 60 * 1000);

            const upcomingEvents = await Event.find({
                startTime: { $gte: now, $lte: fiveMinsLater }
            });

            upcomingEvents.forEach(event => {
                console.log(`[Reminder] Event "${event.title}" is starting at ${event.startTime.toISOString()}`);
            });
        } catch (error) {
        console.error('[Cron Error] Failed to fetch upcoming events:', error.message);
        }
    });
}
    

// Cron Job 2 - Runs every 10 minutes
const scheduleCronsEveryTenMinutes = () => {
    cron.schedule('*/10 * * * *', async () => {
        const now = new Date();
        
        try {
    
            await Event.updateMany(
            { status: 'upcoming', startTime: { $lte: now }, endTime: { $gt: now } },
            { $set: { status: 'ongoing' } }
            );
        
            await Event.updateMany(
            { status: 'ongoing', endTime: { $lte: now } },
            { $set: { status: 'completed' } }
            );
        
            console.log('[Cron] Event statuses updated successfully');
        } catch (error) { 
            console.error('[Cron Error] Failed to update event statuses:', error.message);
        }
    });
}
    


module.exports = {
    scheduleCronsEveryMinute,
    scheduleCronsEveryTenMinutes
};