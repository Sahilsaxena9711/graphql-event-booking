const Event = require('../../models/event');
const User = require('../../models/user');

const events = eventIds => {
    return Event.find({_id: {$in: eventIds}})
        .then(events => {
            return events.map(event => {
                return transformEvent(event);
            })
        })
        .catch(e => {
            throw e
        })
}

const user = userId => {
    return User.findById(userId)
        .then(user => {
            return {...user._doc, createdEvents: events.bind(this, user._doc.createdEvents)}
        })  
        .catch(e => {
            throw e
        })
}

const singleEvent = eventId => {
    return Event.findOne({_id: eventId})
        .then((event) => {
            return transformEvent(event);
        })
        .catch((e) => {
            console.log(e)
        })
}

const transformEvent = event => {
    return {...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator)}
}

const transformBooking = booking => {
    return {...booking._doc, user: user.bind(this, booking._doc.user), event: singleEvent.bind(this, booking._doc.event), createdAt: new Date(booking._doc.createdAt).toISOString(), updatedAt: new Date(booking._doc.updatedAt).toISOString()}
}

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;