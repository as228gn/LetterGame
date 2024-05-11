import { AdminController } from '../src/controllers/AdminController.js'

const controller = new AdminController()

const sum = controller.sum

it('should add 1 + 2 to equal 3', () => {
  const result = sum(1, 2)
  expect(result).toBe(3)
})
