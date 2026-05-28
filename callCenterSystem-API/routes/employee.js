const router=require('express').Router()

const{createEmployee}=require('../controller/Employee')

router.post("/employee",createEmployee)


module.exports=router