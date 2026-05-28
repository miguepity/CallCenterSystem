const { call_queue } = require('../models');

const getQueue = async (req, res) => {
  try {
    const queue = await call_queue.findAll({
      order: [
        ['priority', 'DESC'],
        ['joined_at', 'ASC']
      ]
    });

    res.status(200).json(queue);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cola', error: error.message });
  }
};

module.exports = { 
    getQueue, 
    //updatePriority,
     //deleteFromQueue 
     };