import mongoose from 'mongoose';

const delayNoticeSchema = new mongoose.Schema({
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    previousDepartureTime: { type: Date, required: true },
    newDepartureTime: { type: Date, required: true },
    noticeDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Đã xem', 'Chưa xem'], default: 'Chưa xem' } // New property
});

const DelayNotice = mongoose.model('DelayNotice', delayNoticeSchema);

export default DelayNotice;