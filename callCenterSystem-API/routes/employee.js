const router=require('express').Router()

const{createEmployee,desactivarEmployee,activarEmpleado,getEmployee}=require('../controllers/Employee')

router.post("/employee",createEmployee)
router.put('/employee/desactivate/:id',desactivarEmployee)
router.put('/employee/activate/:id',activarEmpleado)
router.get('/employee',getEmployee)


module.exports=router