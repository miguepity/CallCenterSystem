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

async function putCallQueue(req, res) {
    const {
        priority
    } = req.body;

    const { queueId } = req.params;

    if (!queueId)
        return res.status(400).json({message: 'Please pass the queue id as route parameter'});

    if (priority <= 0)
        return res.status(400).json({message: 'Priority must be positive'});

    if (!callId) 
        return res.status(400).json({message: 'Call id is required'});    

    const oldQueue = await db['call_queue'].findByPk(queueId);

    if (!oldQueue)
        return res.status(404).json({message: `Not found any call queue with id: ${queueId}`});

    const newQueue = await oldQueue.update({
        priority: priority
    });

    return res.status(200).json({ message: 'Queue updated succesfully', body: newQueue });
}

module.exports = {
    postCallQueue,
    putCallQueue
}
