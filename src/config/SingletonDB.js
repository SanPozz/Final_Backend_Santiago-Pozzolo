import mongoose from 'mongoose';
import { logger } from '../utils.js';

export class SingletonDB{
    static #instance
    constructor(url){
        mongoose.connect(url)
    }

    static connectDB(url){
        if(this.#instance){
            logger.error(`Database already connected`)
            // console.log(`Database already connected`)
            return this.#instance
        }
        this.#instance=new SingletonDB(url)
        logger.info(`Database Connected!`)
        // console.log(`Database Connected!`)
        return this.#instance

    }
}

