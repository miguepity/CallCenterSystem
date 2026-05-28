const router=require('express').Router()

const{createEmployee,desactivarEmployee,activarEmpleado,getEmployee,getEmployeeById}=require('../controllers/Employee')

router.post("/employee",createEmployee)
router.put('/employee/desactivate/:id',desactivarEmployee)
router.put('/employee/activate/:id',activarEmpleado)
router.get('/employee',getEmployee)
router.get('/employee/:id',getEmployeeById)


module.exports=router