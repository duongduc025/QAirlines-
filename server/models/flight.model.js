import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
    flightNumber: {
        type: String,
        required: true
    },
    flightDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    departureLocation: {
        type: String,
        required: true
    },
    arrivalLocation: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    classType: {
        type: String,
        required: true
    },
    baggage_allowance: {
        type: String,
        required: true
    }

}, {timestamps: true});