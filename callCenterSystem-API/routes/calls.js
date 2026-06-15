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
 *           description: Nombre del llamante. Debe ser unico.
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           example: "1"
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: pending
 *         started_at:
 *           type: string
 *           format: date-time
 *           description: Se asigna automaticamente cuando se crea la llamada.
 *           example: 2026-06-01T18:30:00.000Z
 *         finished_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: 2026-06-01T18:45:00.000Z
 *         employeeId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Empleado asignado a la llamada. Es opcional, pero si se envia debe existir en employees.
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Fecha generada automaticamente al crear el registro.
 *           example: 2026-06-01T18:30:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Fecha de la ultima actualizacion del registro.
 *           example: 2026-06-01T18:45:00.000Z
 *     CallCreate:
 *       type: object
 *       description: Datos para crear una llamada. No enviar fechas, id, createdAt, updatedAt ni callQueueId; esos campos los gestiona el sistema.
 *       required:
 *         - caller_name
 *         - caller_phone
 *         - rank_required
 *         - status
 *       properties:
 *         caller_name:
 *           type: string
 *           description: Nombre del llamante. No puede estar vacio ni repetirse.
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           description: Telefono del llamante. No puede estar vacio.
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           description: Rango requerido. Debe ser un entero positivo.
 *           example: "1"
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: pending
 *         employeeId:
 *           type: string
 *           format: uuid
 *           description: Opcional. Usar solo si el empleado ya existe.
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *       example:
 *         caller_name: Maria Lopez
 *         caller_phone: "99999999"
 *         rank_required: "1"
 *         status: pending
 *     CallUpdate:
 *       type: object
 *       description: Enviar solo los campos que se desean actualizar. No permite started_at, createdAt, updatedAt ni callQueueId.
 *       properties:
 *         caller_name:
 *           type: string
 *           description: No puede estar vacio ni repetirse en otra llamada.
 *           example: Maria Lopez
 *         caller_phone:
 *           type: string
 *           example: "99999999"
 *         rank_required:
 *           type: string
 *           description: Debe ser un entero positivo.
 *           example: "2"
 *         status:
 *           type: string
 *           enum: [pending, completed, cancelled]
 *           example: completed
 *         finished_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de finalizacion. No puede ser null si se envia.
 *           example: 2026-06-01T18:45:00.000Z
 *         employeeId:
 *           type: string
 *           format: uuid
 *           description: Opcional. Usar solo si el empleado ya existe.
 *           example: 74a04fd0-c5b9-4f44-877b-f4ec2d6ec7f2
 *       example:
 *         status: completed
 *         finished_at: 2026-06-01T18:45:00.000Z
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Error de validacion
 *         error:
 *           type: string
 *           example: Error detail
 */

/**
 * @swagger
 * /api/calls:
 *   post:
 *     summary: Crear una llamada
 *     description: Crea una llamada nueva. El nombre no puede repetirse y started_at/createdAt se generan al crear.
 *     tags: [Calls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallCreate'
 *           example:
 *             caller_name: Maria Lopez
 *             caller_phone: "99999999"
 *             rank_required: "1"
 *             status: pending
 *     responses:
 *       201:
 *         description: Llamada creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       400:
 *         description: Datos invalidos o campos no permitidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               campoRequerido:
 *                 summary: Campo requerido
 *                 value:
 *                   message: caller_name es requerido
 *               statusInvalido:
 *                 summary: Status fuera del enum
 *                 value:
 *                   message: "status debe ser uno de: pending, completed, cancelled"
 *               campoNoPermitido:
 *                 summary: Campo que el sistema no permite crear manualmente
 *                 value:
 *                   message: "Campos no permitidos: started_at"
 *       409:
 *         description: Ya existe una llamada con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: Ya existe una llamada con ese nombre
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
 *           minimum: 1
 *           default: 5
 *           example: 5
 *         description: Cantidad de registros a retornar. Debe ser mayor a 0.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 0
 *         description: Cantidad de registros a saltar. No puede ser negativo.
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
 *       400:
 *         description: Parametros de paginacion invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               limitInvalido:
 *                 summary: limit menor a 1 o no numerico
 *                 value:
 *                   message: limit debe ser mayor a 0
 *               offsetInvalido:
 *                 summary: offset negativo o no numerico
 *                 value:
 *                   message: offset no puede ser negativo
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
 *         example: 2d6df9a8-5b0e-4e88-ae2b-c472aa7af321
 *         description: Id de la llamada
 *     responses:
 *       200:
 *         description: Llamada encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: id debe ser un UUID valido
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
 *     description: Actualiza solo campos permitidos. No permite actualizar llamadas desactivadas.
 *     tags: [Calls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 2d6df9a8-5b0e-4e88-ae2b-c472aa7af321
 *         description: Id de la llamada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallUpdate'
 *           example:
 *             status: completed
 *             finished_at: 2026-06-01T18:45:00.000Z
 *     responses:
 *       200:
 *         description: Llamada actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Call'
 *       400:
 *         description: Datos invalidos, campos null o campos no permitidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               sinCampos:
 *                 summary: No se envio ningun campo permitido
 *                 value:
 *                   message: Debe enviar al menos un campo para actualizar
 *               statusInvalido:
 *                 summary: Status fuera del enum
 *                 value:
 *                   message: "status debe ser uno de: pending, completed, cancelled"
 *               campoNoPermitido:
 *                 summary: Campo que no pertenece al update de Calls
 *                 value:
 *                   message: "Campos no permitidos: started_at"
 *       404:
 *         description: Llamada no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflicto por nombre repetido o llamada desactivada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               nombreRepetido:
 *                 summary: Ya existe una llamada con ese nombre
 *                 value:
 *                   message: Ya existe una llamada con ese nombre
 *               llamadaDesactivada:
 *                 summary: La llamada ya fue desactivada
 *                 value:
 *                   message: No se puede actualizar una llamada desactivada
 */
router.put('/calls/:id', callsController.putcall);

/**
 * @swagger
 * /api/calls/{id}:
 *   delete:
 *     summary: Desactivar una llamada
 *     description: Marca la llamada como cancelled y asigna finished_at. No elimina el registro de la tabla calls.
 *     tags: [Calls]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 2d6df9a8-5b0e-4e88-ae2b-c472aa7af321
 *         description: Id de la llamada
 *     responses:
 *       200:
 *         description: Llamada desactivada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Llamada desactivada correctamente
 *                 call:
 *                   $ref: '#/components/schemas/Call'
 *       400:
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: id debe ser un UUID valido
 *       404:
 *         description: Llamada no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: La llamada ya esta desactivada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: La llamada ya esta desactivada
 *       500:
 *         description: Error al desactivar la llamada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/calls/:id', callsController.deletecall);

module.exports = router;
