import passport from 'passport'
import local from 'passport-local'
import github from 'passport-github2'
import passportJWT from 'passport-jwt'

import bcrypt from 'bcrypt'

import { extractjwtFromCookie, logger } from '../utils.js'
import { configENV } from './configDotEnv.js'

import User from '../dao/models/users.models.js'
import Cart from '../dao/models/carts.models.js'

import { cartService } from '../services/carts.service.js'

import { UserReadDTO } from '../dto/usersDTO.js'

export const initializatePassport = () => {
    
    passport.use('register', new local.Strategy({
        passReqToCallback: true,
        usernameField: 'email'
    },
    async (req, username, password, done) => {
        try {

            let {first_name, last_name, age, email, password} = req.body;
            age = parseInt(age);
            console.log([
                first_name,
                last_name,
                age,
                email,
                password
            ]);
    
            if (!first_name || !last_name || !username || !age || !password) {
                return done(null, false, {message: 'All fields are required'});
                // return res.redirect('/register?error=All fields are required');
            }

            const userExist = await User.findOne({email});

            if (userExist) {
                // logger.info('User already exists');
                return done(null, false, {message: 'User already exists'});
                // return res.redirect('/register?error=Email already registered');
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            let user;

            const newCart = await cartService.createCart();
            console.log(newCart);

            const cartID = newCart._id;

            user = await User.create({
                first_name,
                last_name,
                age,
                email,
                password: hashedPassword,
                rol: 'user',
                user_cart: cartID
            });

            return done(null, user);

        } catch (error) {
            done(error, null, {message: error.message});
        }
    }
    ))

    passport.use('login', new local.Strategy({
        usernameField: 'email',
    },
    async (username, password, done) => {
        try {

            if (!username || !password) {
                // return res.redirect('/login?error=All%20fields%20are%20required')
                return done(null, false);
            }

            if (username == "adminCoder@coder.com") {
                const adminPassword = bcrypt.hashSync('adminCod3r123', 10);
                console.log(adminPassword);

                const validPassword = bcrypt.compareSync(password, adminPassword);

                if (validPassword) {
                    let adminUser = {
                        email: username,
                        password: adminPassword,
                        rol: "admin"
                    }
                    
                    return done(null, adminUser);

                    // return res.redirect('/products');
                } else {
                    // return res.redirect('/login?error=Invalid%20Credentials')
                    return done(null, false);
                }
            }
            
            let userExist = await User.findOne({email: username});

            // console.log(userExist);

            if (!userExist) {
                // return res.redirect('/login?error=Invalid%20Credentials')
                return done(null, false);
            }

            const validPassword = bcrypt.compareSync(password, userExist.password);

            if (!validPassword) {
                // return res.redirect('/login?error=Invalid%20Credentials')
                return done(null, false);
            }

            userExist = UserReadDTO.getUserDTO(userExist);

            return done(null, userExist);

        } catch (error) {
            // console.log(4);
            done(error, null)
        }
    }))


    passport.use('github', new github.Strategy({
        clientID: configENV.GITHUB_CLIENT_ID,
        clientSecret: configENV.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            let user = await User.findOne({email: profile._json.email}).lean();

            if (!user) {
                const cart = await cartService.createCart();
                const nameParts = profile._json.name.split(' ');
                let firstName = nameParts[0];
                let lastName = nameParts[1];
                const email = profile._json.email;
                const user_cart = cart._id;

                console.log(user_cart);

                const newUser = {
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    password: "",
                    rol: "user",
                    user_cart: user_cart
                }

                user = await User.create(newUser)

            }

            return done(null, user)

        } catch (error) {
            return done(error, null)
        }
    }
    ))

    passport.use('jwt', new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([extractjwtFromCookie]),
        secretOrKey: configENV.SECRET_JWT
    },
    async (jwtPayload, done) => {
        try {
            // console.log(jwtPayload);
            return done(null, jwtPayload)
        } catch (error) {
            return done(error, null)
        }
    }
    ))
}