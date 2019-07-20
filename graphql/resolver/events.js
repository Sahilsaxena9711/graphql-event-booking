const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent} = require('./merge');

module.exports =  {
    events: () => {
        return Event
            .find()
            .populate('creator')
            .then((events) => {
                return events.map((event) => {
                    return transformEvent(event);
                })
            })
            .catch((e) => {
                console.log(e)
            })
    },
    createEvent: (args, req) => {
        if(!req.isAuth){
            throw new Error('Not Authenticated')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        return event
            .save()
            .then((event) => {
                createdEvent = transformEvent(event)
                return User.findById(req.userId)
            }).then((user) => {
                if (!user) {
                    throw new Error(`User does'nt exists!`)
                }
                user.createdEvents.push(event);
                return user.save()
            }).then((result) => {
                return createdEvent;
            }).catch((e) => {
                console.log(e)
                return e;
            })
    }
}