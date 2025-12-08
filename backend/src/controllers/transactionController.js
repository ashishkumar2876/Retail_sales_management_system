const transactionService = require('../services/transactionService');

const listTransactions = async (req, res) => {
    try {
        const result = await transactionService.getTransactions(req.query);
        if (result.data.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "No transactions found with matching criteria.", 
                data: [],
                pagination: result.pagination
            });
        }

        res.status(200).json({ 
            success: true, 
            data: result.data, 
            pagination: result.pagination 
        });

    } catch (error) {
        console.error("Controller Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getOptions = async (req, res) => {
    try {
        const options = await transactionService.getFilterOptions();
        
        res.status(200).json({ 
            success: true, 
            data: options 
        });

    } catch (error) {
        console.error("Controller Error", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { listTransactions, getOptions };