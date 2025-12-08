require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const Transaction = require('./src/models/Transaction');

// Increase Node.js process memory limit slightly if needed, though batching prevents this.
// Connect to Database //will store 390000 due to free tier memory....
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected. Starting Import...'))
    .catch(err => { console.error('Connection Error:', err); process.exit(1); });

const BATCH_SIZE = 5000; 
let batch = [];
let totalInserted = 0;

const seedData = async () => {
    // Clear old data
    console.log('Clearing old data...');
    await Transaction.deleteMany({});
    console.log('Old data cleared.');

    // Locate the file
    const csvFilePath = path.join(__dirname, 'src', 'utils', 'dataset.csv');
    if (!fs.existsSync(csvFilePath)) {
        console.error(`ERROR: File not found at ${csvFilePath}`);
        process.exit(1);
    }

    console.log(`Reading from: ${csvFilePath}`);
    console.log('Starting ingestion... (This may take 2-3 minutes)');

    //Stream the file
    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    // Use for await loop to handle Backpressure 
    // ensures we don't read faster than we can write to DB
    for await (const row of stream) {
        //Handles potential missing keys or capitalization issues
        const transaction = {
            customerID: row['Customer ID'] || row['CustomerID'],
            customerName: row['Customer Name'] || row['CustomerName'],
            phoneNumber: row['Phone Number'] || row['PhoneNumber'],
            gender: row['Gender'],
            age: Number(row['Age']) || 0,
            customerRegion: row['Customer Region'] || row['CustomerRegion'],
            customerType: row['Customer Type'] || row['CustomerType'],
            
            productID: row['Product ID'] || row['ProductID'],
            productName: row['Product Name'] || row['ProductName'],
            brand: row['Brand'],
            productCategory: row['Product Category'] || row['ProductCategory'],
            tags: row['Tags'] ? row['Tags'].split(',') : [],
            
            quantity: Number(row['Quantity']) || 0,
            pricePerUnit: Number(row['Price per Unit'] || row['PricePerUnit']) || 0,
            discountPercentage: Number(row['Discount Percentage'] || row['DiscountPercentage']) || 0,
            totalAmount: Number(row['Total Amount'] || row['TotalAmount']) || 0,
            finalAmount: Number(row['Final Amount'] || row['FinalAmount']) || 0,
            
            date: new Date(row['Date']), 
            paymentMethod: row['Payment Method'] || row['PaymentMethod'],
            orderStatus: row['Order Status'] || row['OrderStatus'],
            deliveryType: row['Delivery Type'] || row['DeliveryType'],
            storeID: row['Store ID'] || row['StoreID'],
            storeLocation: row['Store Location'] || row['StoreLocation'],
            salespersonID: row['Salesperson ID'] || row['SalespersonID'],
            employeeName: row['Employee Name'] || row['EmployeeName']
        };

        batch.push(transaction);

        //Insert Batch when full
        if (batch.length >= BATCH_SIZE) {
            await insertBatch(batch);
            batch = []; // Clear memory immediately
        }
    }

    //Insert remaining records
    if (batch.length > 0) {
        await insertBatch(batch);
    }

    console.log(`COMPLETED: Successfully inserted ${totalInserted} transactions.`);
    process.exit();
};

// Helper function to insert data
async function insertBatch(data) {
    try {
        //false allows valid records to be inserted even if one fails
        await Transaction.insertMany(data, { ordered: false });
        totalInserted += data.length;
        process.stdout.write(`\r⏳ Progress: ${totalInserted} records inserted...`);
    } catch (error) {
        // If some docs fail, count the successful ones
        if (error.insertedDocs) {
            totalInserted += error.insertedDocs.length;
            process.stdout.write(`Progress: ${totalInserted} records inserted (some failed)...`);
        } else {
            console.error('Batch Error:', error.message);
        }
    }
}

seedData();