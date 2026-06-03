const router=require('express').Router()

const{createEmployee,desactivarEmployee,activarEmpleado,getEmployee,getEmployeeById}=require('../controllers/Employee')

/**
 * @swagger
 * /api/employee:
 *   post:
 *     summary: Crear un nuevo empleado
 *     description: Registra un nuevo empleado en el sistema
 *     tags:
 *       - Empleados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - is_available
 *               - rank
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del empleado
 *                 example: "Juan Pérez"
 *               is_available:
 *                 type: boolean
 *                 description: Estado de disponibilidad del empleado
 *                 example: true
 *               rank:
 *                 type: number
 *                 description: Rango del empleado (debe ser mayor a 0)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Empleado registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado registrado correctamente"
 *                 employ:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Juan Pérez"
 *                     is_available:
 *                       type: boolean
 *                       example: true
 *                     rank:
 *                       type: number
 *                       example: 1
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El nombre es requerido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.post("/employee",createEmployee)

/**
 * @swagger
 * /api/employee/desactivate/{id}:
 *   put:
 *     summary: Desactivar un empleado
 *     description: Marca a un empleado como no disponible
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado a desactivar
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Empleado no disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado no disponible"
 *       404:
 *         description: Empleado no encontrado o ya desactivado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.put('/employee/desactivate/:id',desactivarEmployee)



/**
 * @swagger
 * /api/employee/activate/{id}:
 *   put:
 *     summary: Activar un empleado
 *     description: Marca a un empleado como disponible
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado a activar
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Empleado disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado disponible!"
 *       404:
 *         description: Empleado no encontrado o ya disponible
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.put('/employee/activate/:id',activarEmpleado)



/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Listar empleados con paginación
 *     description: Obtiene la lista de empleados usando parámetros de paginación `limit` y `offset`.
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Cantidad máxima de empleados por página
 *         example: 5
 *       - name: offset
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Desplazamiento desde el primer empleado
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de empleados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 12
 *                 employee:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       name:
 *                         type: string
 *                         example: "Juan Pérez"
 *                       is_available:
 *                         type: boolean
 *                         example: true
 *                       rank:
 *                         type: number
 *                         example: 1
 *       400:
 *         description: Error de validación de paginación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "limit debe ser mayor a 0"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.get('/employee',getEmployee)


/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Obtener empleado por ID
 *     description: Busca un empleado por su identificador único
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 is_available:
 *                   type: boolean
 *                   example: true
 *                 rank:
 *                   type: number
 *                   example: 1
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error del servidor"
 */
router.get('/employee/:id',getEmployeeById)


module.exports=router
