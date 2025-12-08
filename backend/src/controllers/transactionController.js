const Transaction = require('../models/Transaction');

const listTransactions = async (req, res) => {
    try {
        const { 
            page = 1, limit = 10, search, sort,
            region, gender, category, 
            paymentMethod, tags, ageRange, 
            startDate, endDate 
        } = req.query;
        
        // 1. Build Query
        const query = {};

        // Search (Name or Phone)
        if (search && search.trim() !== '') {
            query.$or = [
                { customerName: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        // Direct Filters
        if (region) query.customerRegion = region;
        if (gender) query.gender = gender;
        if (category) query.productCategory = category;
        if (paymentMethod) query.paymentMethod = paymentMethod;
        
        // Tags (Array check)
        if (tags) {
            query.tags = { $in: [tags] }; 
        }

        // Age Range Logic (Parsing "18-25")
        if (ageRange) {
            if (ageRange === '60+') {
                query.age = { $gte: 60 };
            } else {
                const [min, max] = ageRange.split('-').map(Number);
                if (!isNaN(min) && !isNaN(max)) {
                    query.age = { $gte: min, $lte: max };
                }
            }
        }

        // Date Range Logic
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // 2. Sort Logic
        let sortStage = { date: -1 };
        if (sort) {
            const [field, order] = sort.split('_');
            if (field && order) sortStage = { [field]: order === 'desc' ? -1 : 1 };
        }

        // 3. Aggregation for Stats (Safe Math)
        const statsPipeline = [
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalUnits: { $sum: { $ifNull: ["$quantity", 0] } },
                    totalAmount: { $sum: { $ifNull: ["$totalAmount", 0] } },
                    totalDiscount: { 
                        $sum: { 
                            $subtract: [ 
                                { $ifNull: ["$totalAmount", 0] }, 
                                { $ifNull: ["$finalAmount", { $ifNull: ["$totalAmount", 0] }] } 
                            ] 
                        } 
                    }
                }
            }
        ];

        // Execute Queries
        const [statsResult, transactions, totalItems] = await Promise.all([
            Transaction.aggregate(statsPipeline),
            Transaction.find(query)
                .sort(sortStage)
                .skip((page - 1) * limit)
                .limit(Number(limit)),
            Transaction.countDocuments(query)
        ]);

        const stats = statsResult[0] || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };

        res.status(200).json({
            success: true,
            data: transactions,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: Number(page)
            },
            stats
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getOptions = async (req, res) => {
    try {
        const [regions, categories, genders, paymentMethods, tags] = await Promise.all([
            Transaction.distinct('customerRegion'),
            Transaction.distinct('productCategory'),
            Transaction.distinct('gender'),
            Transaction.distinct('paymentMethod'),
            Transaction.distinct('tags')
        ]);

        res.status(200).json({
            success: true,
            data: { regions, categories, genders, paymentMethods, tags }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch options" });
    }
};

module.exports = { listTransactions, getOptions };