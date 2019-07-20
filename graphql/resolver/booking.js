const Booking = require('../../models/booking');
const Event = require('../../models/event');
const {transformBooking, transformEvent} = require('./merge');

module.exports =  {
    
    bookings: (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated')
        }
        return Booking
            .find({user: req.userId})
            .populate('event', 'user')
            .then((bookings) => {
                return bookings.map((booking) => {
                    return transformBooking(booking)
                })
            })
            .catch((e) => {
                console.log(e)
            })
    },
    bookingEvent: (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated')
        }
        return Event.findById(args.eventId)
            .then((event) => {
                const booking = new Booking({
                    user: req.userId,
                    event: event
                });
                return booking.save() 
            }).then((booking) => {
                return transformBooking(booking)
            }).catch((e) => {
                console.log(e)
            })
    },
    cancelBooking: (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated')
        }
        let event = {};
        return Booking.findById(args.bookingId).populate('event')
            .then((booking) => {
                event = transformEvent(booking.event)
                return Booking.deleteOne({_id: args.bookingId})
            })
            .then(() => {
                return event
            })
            .catch((e) => {
                console.log(e)
            })
    }

}