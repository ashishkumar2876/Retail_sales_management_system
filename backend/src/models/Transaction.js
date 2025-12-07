const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    customerID: { type: String, required: true },
    customerName: { type: String, required: true, index: true },
    phoneNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    age: { type: Number },
    customerRegion: { type: String },
    customerType: { type: String },

    productID: { type: String, required: true },
    productName: { type: String },
    brand: { type: String },
    productCategory: { type: String, index: true }, 
    tags: [{ type: String }], 

    
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number },
    discountPercentage: { type: Number },
    totalAmount: { type: Number },
    finalAmount: { type: Number },

   
    date: { type: Date, required: true, index: true },
    paymentMethod: { type: String },
    orderStatus: { type: String },
    deliveryType: { type: String },
    storeID: { type: String },
    storeLocation: { type: String },
    salespersonID: { type: String },
    employeeName: { type: String }
}, { timestamps: true });

transactionSchema.index({ customerName: 'text', phoneNumber: 'text' });

module.exports = mongoose.model('Transaction', transactionSchema);