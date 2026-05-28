const db = require('../models');

async function postCallQueue(req, res) {
    const {
        callId,
        priority,
        joinedAt
    } = req.body;

    if (priority <= 0)
        return res.status(400).json({message: 'Priority must be positive'});

    if (!callId) 
        return res.status(400).json({message: 'Call id is required'});    

    const queue = await db['call_queue'].create({
        call_id: callId,
        priority: Number(priority),
        joined_at: new Date(joinedAt),
    });

    return res.status(200).json({message: 'Queue created succesfully', body: queue });
}

module.exports = {
    postCallQueue
}
