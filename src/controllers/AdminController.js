/**
 * @file Defines the AdminController class.
 * @module AdminController
 * @author Anna Ståhlberg
 */

/**
 * Encapsulates a controller.
 */
export class AdminController {
  async index(req, res) {
    res.render('admin/index')
  }

  async create(req, res) {
    res.render('admin/create')
  }

  async postCreate(req, res) {
    console.log(req.file.filename)
    res.render('admin/create')
  }
}
