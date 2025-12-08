const Transaction = require('../models/Transaction');

const getTransactions = async (params) => {
    const {
        search, 
        page = 1, 
        limit = 10, 
        sort, 
        region, gender, category, paymentMethod, 
        minAge, maxAge, startDate, endDate 
    } = params;

    const query = {};

    if (search) {
        query.$or = [
            { customerName: { $regex: search, $options: 'i' } },
            { phoneNumber: { $regex: search, $options: 'i' } }
        ];
    }

   
    if (region) query.customerRegion = { $in: region.split(',') }; 
    if (gender) query.gender = { $in: gender.split(',') };
    if (category) query.productCategory = { $in: category.split(',') };
    if (paymentMethod) query.paymentMethod = { $in: paymentMethod.split(',') };

    
    if (minAge || maxAge) {
        query.age = {};
        if (minAge) query.age.$gte = Number(minAge);
        if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }

    
    let sortOptions = { date: -1 };
    
    if (sort === 'oldest') sortOptions = { date: 1 };
    if (sort === 'quantity_asc') sortOptions = { quantity: 1 };
    if (sort === 'quantity_desc') sortOptions = { quantity: -1 };
    if (sort === 'price_asc') sortOptions = { finalAmount: 1 };
    if (sort === 'price_desc') sortOptions = { finalAmount: -1 };
    if (sort === 'name_asc') sortOptions = { customerName: 1 }; // A-Z [cite: 77]
    if (sort === 'name_desc') sortOptions = { customerName: -1 };

    
    const skip = (Number(page) - 1) * Number(limit);

    const transactions = await Transaction.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

    const total = await Transaction.countDocuments(query);

    return {
        data: transactions,
        pagination: {
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            limit: Number(limit)
        }
    };
};


const getFilterOptions = async () => {
    const options = await Transaction.aggregate([
        {
            $group: {
                _id: null,
                regions: { $addToSet: "$customerRegion" },
                genders: { $addToSet: "$gender" },
                categories: { $addToSet: "$productCategory" },
                paymentMethods: { $addToSet: "$paymentMethod" }
            }
        },
        { $project: { _id: 0 } }
    ]);
    return options[0] || {};
};

module.exports = { getTransactions, getFilterOptions };