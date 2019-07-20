const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports =  {
    createUser: (args) => {
        return User.findOne({ username: args.userInput.username })
            .then(user => {
                if (user) {
                    throw new Error(`User with username ${args.userInput.username} already exists!`)
                }
                return bcrypt
                    .hash(args.userInput.password, 12)
            })
            .then((hashedpass) => {
                const user = new User({
                    email: args.userInput.email,
                    username: args.userInput.username,
                    password: hashedpass
                });
                return user.save()
            }).then((result) => {
                console.log(result._doc)
                return { ...result._doc, password: null };
            }).catch(e => {
                throw e;
            })
    },
    login: async ({username, password}) => {
        const user = await User.findOne({username});
        if(!user){
            throw new Error('Username/Password is Incorrect!')
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            throw new Error('Username/Password is Incorrect!')
        }
        const token = jwt.sign({username, userId: user.id, email: user.email}, 'mystring', {
                        expiresIn: '1h'
                      });
        return {userId: user.id, token, tokenexpiration: 1}
    }
}