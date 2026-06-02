var express = require('express');
var router = express.Router();
var callsController = require('../controllers/calls');

/**
 * @swagger
 * tags:
 *   name: Calls
 *   description: Endpoints para gestionar llamadas
 *
 * components:
 *   schemas:
 *     Call:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 2d6df9a8-5b0e-4e88-ae2b-c472aa7af321
 *         caller_name:
 *           type: string
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           example: "1"
 *         status:
 *           type: string
 *           example: pending
 *         started_at:
 *           type: string
 *           format: date-time
 *           example: 2026-06-01T18:30:00.000Z
 *         finished_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-01T18:45:00.000Z
 *         employeeId:
 *           type: string
 *           format: uuid
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *     CallCreate:
 *       type: object
 *       required:
 *         - caller_name
 *         - caller_phone
 *         - rank_required
 *         - status
 *       properties:
 *         caller_name:
 *           type: string
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           example: "1"
 *         status:
 *           type: string
 *           example: pending
 *         started_at:
 *           type: string
 *           format: date-time
 *           example: 2026-06-01T18:30:00.000Z
 *         finished_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-01T18:45:00.000Z
 *         employeeId:
 *           type: string
 *           format: uuid
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *     CallUpdate:
 *       type: object
 *       description: Enviar solo los campos que se desean actualizar. callQueueId no pertenece a Calls; la relacion se gestiona desde call_queues.call_id.
 *       properties:
 *         caller_name:
 *           type: string
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           example: "2"
 *         status:
 *           type: string
 *           example: completed
 *         started_at:
 *           type: string
 *           format: date-time
 *           example: 2026-06-01T18:30:00.000Z
 *         finished_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-01T18:45:00.000Z
 *         employeeId:
 *           type: string
 *           format: uuid
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Llamada no encontrada
 *         error:
 *           type: string
 *           example: Error detail
 */

/**
 * @swagger
 * /api/calls:
 *   post:
 *     summary: Crear una llamada
 *     tags: [Calls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallCreate'
 *     responses:
 *       201:
 *         description: Llamada creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       400:
 *         description: Error al crear la llamada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/calls', callsController.createcall);

/**
 * @swagger
 * /api/calls:
 *   get:
 *     summary: Obtener llamadas paginadas
 *     tags: [Calls]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Cantidad de registros a retornar
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Cantidad de registros a saltar
 *     responses:
 *       200:
 *         description: Lista de llamadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 1
 *                 calls:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Call'
 *       500:
 *         description: Error al obtener las llamadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/calls', callsController.getcalls);

/**
 * @swagger
 * /api/calls/{id}:
 *   get:
 *     summary: Obtener una llamada por id
 *     tags: [Calls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id de la llamada
 *     responses:
 *       200:
 *         description: Llamada encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       404:
 *         description: Llamada no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al obtener la llamada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/calls/:id', callsController.getcallbyid);

/**
 * @swagger
 * /api/calls/{id}:
 *   put:
 *     summary: Actualizar una llamada
 *     tags: [Calls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id de la llamada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallUpdate'
 *     responses:
 *       200:
 *         description: Llamada actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       400:
 *         description: Datos invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Llamada no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/calls/:id', callsController.putcall);

/**
 * @swagger
 * /api/calls/{id}:
 *   delete:
 *     summary: Eliminar una llamada
 *     tags: [Calls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Id de la llamada
 *     responses:
 *       200:
 *         description: Llamada eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Llamada eliminada correctamente
 *       404:
 *         description: Llamada no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al eliminar la llamada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/calls/:id', callsController.deletecall);

module.exports = router;
