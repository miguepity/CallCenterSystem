const router = require('express').Router()

const {
    postCallQueue,
    getCallQueue,
    putCallQueue,
    deleteCallQueue
} = require('../controllers/callQueues');

/**
 * @swagger
 * /call-queue:
 *   post:
 *     summary: Create a new call queue entry
 *     tags: [Call Queues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - callId
 *               - priority
 *             properties:
 *               callId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the associated call
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 description: Queue priority (must be positive)
 *               joinedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when the call joined the queue
 *     responses:
 *       200:
 *         description: Queue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   $ref: '#/components/schemas/CallQueue'
 *       400:
 *         description: Validation error (missing callId or invalid priority)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.post('/call-queue', postCallQueue)

/**
 * @swagger
 * /call-queue/{queueId}:
 *   get:
 *     summary: Get a call queue entry by ID
 *     tags: [Call Queues]
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the call queue entry
 *     responses:
 *       200:
 *         description: Queue entry found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   $ref: '#/components/schemas/CallQueue'
 *       400:
 *         description: Missing queueId parameter
 *       404:
 *         description: Queue entry not found
 *       500:
 *         description: Server error
 */
router.get('/call-queue/:queueId', getCallQueue)

/**
 * @swagger
 * /call-queue/{queueId}:
 *   put:
 *     summary: Update priority of a call queue entry
 *     tags: [Call Queues]
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the call queue entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - priority
 *             properties:
 *               priority:
 *                 type: integer
 *                 minimum: 1
 *                 description: New queue priority (must be positive)
 *     responses:
 *       200:
 *         description: Queue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   $ref: '#/components/schemas/CallQueue'
 *       400:
 *         description: Validation error (missing queueId or invalid priority)
 *       404:
 *         description: Queue entry not found
 *       500:
 *         description: Server error
 */
router.put('/call-queue/:queueId', putCallQueue)

/**
 * @swagger
 * /call-queue/{queueId}:
 *   delete:
 *     summary: Delete a call queue entry
 *     tags: [Call Queues]
 *     parameters:
 *       - in: path
 *         name: queueId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the call queue entry to delete
 *     responses:
 *       200:
 *         description: Queue deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 body:
 *                   $ref: '#/components/schemas/CallQueue'
 *       400:
 *         description: Missing queueId
 *       404:
 *         description: Queue entry not found
 *       500:
 *         description: Server error
 */
router.delete('/call-queue/:queueId', deleteCallQueue)

/**
 * @swagger
 * components:
 *   schemas:
 *     CallQueue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         call_id:
 *           type: string
 *           format: uuid
 *         priority:
 *           type: integer
 *         joined_at:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

module.exports = router;
