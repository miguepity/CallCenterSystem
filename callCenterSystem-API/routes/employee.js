const router=require('express').Router()

const{createEmployee,desactivarEmployee,activarEmpleado,getEmployee,getEmployeeById}=require('../controllers/Employee')

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identificador único del empleado (UUID v4)
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: Nombre completo del empleado
 *           example: "Juan Pérez"
 *         is_available:
 *           type: boolean
 *           description: >
 *             Disponibilidad del empleado. Se pone en `false` automáticamente
 *             cuando el empleado toma una llamada, y vuelve a `true` al terminarla
 *             o escalarla.
 *           example: true
 *         rank:
 *           type: integer
 *           minimum: 1
 *           description: >
 *             Nivel jerárquico del empleado. El sistema asigna llamadas al
 *             primer empleado disponible cuyo `rank` sea >= al `rank_required`
 *             de la llamada. A mayor número, mayor jerarquía.
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *           example: "2026-05-21T10:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización del registro
 *           example: "2026-05-21T12:30:00.000Z"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Descripción del error
 *           example: "Error del servidor"
 */
 
/**
 * @swagger
 * /api/employee:
 *   post:
 *     summary: Crear un nuevo empleado
 *     description: >
 *       Registra un nuevo empleado en el sistema de Call Center.
 *       El nombre debe ser único. El `rank` determina qué llamadas
 *       puede atender según el `rank_required` de cada llamada entrante.
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
 *                 description: Nombre del empleado. No puede estar vacío ni repetirse.
 *                 example: "Juan Pérez"
 *               is_available:
 *                 type: boolean
 *                 description: Disponibilidad inicial del empleado.
 *                 example: true
 *               rank:
 *                 type: integer
 *                 minimum: 1
 *                 description: Rango del empleado. Debe ser un número entero mayor a 0.
 *                 example: 1
 *           examples:
 *             operadorBasico:
 *               summary: Operador de nivel 1
 *               value:
 *                 name: "María López"
 *                 is_available: true
 *                 rank: 1
 *             supervisorNivel2:
 *               summary: Supervisor de nivel 2
 *               value:
 *                 name: "Carlos Ruiz"
 *                 is_available: true
 *                 rank: 2
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
 *                   $ref: '#/components/schemas/Employee'
 *             example:
 *               message: "Empleado registrado correctamente"
 *               employ:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "Juan Pérez"
 *                 is_available: true
 *                 rank: 1
 *                 created_at: "2026-05-21T10:00:00.000Z"
 *                 updated_at: "2026-05-21T10:00:00.000Z"
 *       400:
 *         description: Error de validación en los datos enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               nombreRequerido:
 *                 summary: Nombre vacío o no enviado
 *                 value:
 *                   message: "El nombre es requerido"
 *               isAvailableInvalido:
 *                 summary: is_available no es booleano
 *                 value:
 *                   message: "is_available debe ser un true o false"
 *               rankInvalido:
 *                 summary: rank no es número o es menor a 1
 *                 value:
 *                   message: "rank debe ser numerico"
 *       409:
 *         description: Ya existe un empleado con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "El nombre del empleado ya existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/employee',createEmployee)
 
/**
 * @swagger
 * /api/employee/desactivate/{id}:
 *   put:
 *     summary: Desactivar un empleado
 *     description: >
 *       Marca al empleado como no disponible (`is_available = false`).
 *       **No se puede desactivar un empleado que tenga una llamada activa**
 *       (llamada asignada con `finished_at` en null). Esto garantiza que el
 *       sistema no pierda al agente mientras atiende una llamada en curso.
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del empleado a desactivar
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Empleado desactivado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado desactivado correctamente"
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Empleado no encontrado"
 *       409:
 *         description: No se puede desactivar al empleado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               llamadaActiva:
 *                 summary: El empleado está atendiendo una llamada
 *                 value:
 *                   message: "No se puede desactivar un empleado con una llamada activa"
 *               yaDesactivado:
 *                 summary: El empleado ya está desactivado
 *                 value:
 *                   message: "El empleado ya esta desactivado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/employee/desactivate/:id',desactivarEmployee)
 
/**
 * @swagger
 * /api/employee/activate/{id}:
 *   put:
 *     summary: Activar un empleado
 *     description: >
 *       Marca al empleado como disponible (`is_available = true`).
 *       Una vez activado, el sistema podrá asignarle llamadas entrantes
 *       cuyo `rank_required` sea <= al `rank` del empleado.
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del empleado a activar
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Empleado activado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Empleado activado correctamente"
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Empleado no encontrado"
 *       409:
 *         description: El empleado ya está activo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "El empleado ya esta activado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/employee/activate/:id',activarEmpleado)
 
/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: Listar empleados con paginación
 *     description: >
 *       Retorna la lista paginada de todos los empleados registrados en el sistema.
 *       Usar `limit` y `offset` para navegar entre páginas.
 *       Por defecto devuelve los primeros 5 empleados.
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 5
 *         description: Cantidad máxima de empleados a retornar. Debe ser mayor a 0.
 *         example: 10
 *       - name: offset
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Número de registros a saltar (para paginación). No puede ser negativo.
 *         example: 0
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total de empleados registrados en el sistema (sin paginación)
 *                   example: 12
 *                 employee:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *             example:
 *               total: 12
 *               employee:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Juan Pérez"
 *                   is_available: true
 *                   rank: 1
 *                   created_at: "2026-05-21T10:00:00.000Z"
 *                   updated_at: "2026-05-21T10:00:00.000Z"
 *                 - id: "661f9511-f30c-52e5-b827-557766551111"
 *                   name: "Carlos Ruiz"
 *                   is_available: false
 *                   rank: 2
 *                   created_at: "2026-05-21T09:00:00.000Z"
 *                   updated_at: "2026-05-21T11:00:00.000Z"
 *       400:
 *         description: Parámetros de paginación inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               limitInvalido:
 *                 summary: limit menor a 1
 *                 value:
 *                   message: "limit debe ser mayor a 0"
 *               offsetInvalido:
 *                 summary: offset negativo
 *                 value:
 *                   message: "offset no puede ser negativo"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/employee',getEmployee)
 
/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: Obtener empleado por ID
 *     description: >
 *       Retorna los datos completos de un empleado específico buscándolo
 *       por su UUID. Útil para consultar el estado de disponibilidad
 *       y rango de un agente antes de asignarle una llamada.
 *     tags:
 *       - Empleados
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID del empleado
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Empleado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               name: "Juan Pérez"
 *               is_available: true
 *               rank: 1
 *               created_at: "2026-05-21T10:00:00.000Z"
 *               updated_at: "2026-05-21T10:00:00.000Z"
 *       404:
 *         description: Empleado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Empleado no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/employee/:id',getEmployeeById)


module.exports=router
