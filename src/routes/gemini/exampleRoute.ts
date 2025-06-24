import express from 'express'

import controller from '../../controllers/v1/ExampleController'

const router = express.Router()

router.get('/hello', controller.getHelloWorld)
router.post('/add', controller.addNumbers)

export default router
