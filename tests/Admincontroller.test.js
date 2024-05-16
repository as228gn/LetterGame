import { AdminController } from '../src/controllers/AdminController.js'
import { ImageModel } from '../src/models/ImageModel.js'
import { jest } from '@jest/globals'

const controller = new AdminController()

const index = controller.index
const findAll = controller.findAll
const postLogin = controller.postLogin

// Dessa tester har chatGPT skrivit, har varit alldelses för svårt för mig att skriva egna tester till min kod men jag har förstått hur man configuerar koden för att få jest att fungera.//

const mockRender = jest.fn()
const mockResponses = { render: mockRender }

describe('index function', () => {
  afterEach(() => {
    jest.clearAllMocks() // Rensa alla mockfunktioner mellan testfallen
  })

  it('should render admin/index', async () => {
    await index(null, mockResponses)

    expect(mockRender).toHaveBeenCalledWith('admin/index')
  })
})

// Mocka res.render()
const mockRenders = jest.fn()
const mockResponse = { render: mockRenders }
const mockNext = jest.fn()

describe('findAll function', () => {
  afterEach(() => {
    jest.clearAllMocks() // Rensa alla mockfunktioner mellan testfallen
  })

  it('should render admin/index with images when found', async () => {
    const mockImages = [{ id: 1, url: 'image1.jpg' }, { id: 2, url: 'image2.jpg' }]
    jest.spyOn(ImageModel, 'find').mockResolvedValue(mockImages)

    await findAll(null, mockResponse, mockNext)

    expect(ImageModel.find).toHaveBeenCalledWith({})
    expect(mockRenders).toHaveBeenCalledWith('admin/index', { images: mockImages })
    expect(mockNext).not.toHaveBeenCalled() // Förvänta dig att next() inte kallas vid lyckad förfrågan
  })

  it('should call next with error when an error occurs', async () => {
    const mockError = new Error('Database error')
    jest.spyOn(ImageModel, 'find').mockRejectedValue(mockError)

    await findAll(null, mockResponse, mockNext)

    expect(ImageModel.find).toHaveBeenCalledWith({})
    expect(mockRenders).not.toHaveBeenCalled() // Förvänta dig att res.render() inte kallas vid fel
    expect(mockNext).toHaveBeenCalledWith(mockError) // Förvänta dig att next() kallas med felet
  })
})

describe('postLogin function', () => {
  // Mock req, res, next
  let req, res, next

  beforeEach(() => {
    req = {
      body: {
        username: 'testUser',
        password: 'testPassword'
      },
      session: {},
      sessions: { flash: {} }
    }
    res = {
      redirect: jest.fn()
    }
    next = jest.fn()
  })

  test('should redirect to admin page if username and password are correct', async () => {
    process.env.USER_NAME = 'testUser'
    process.env.PASS_WORD = 'testPassword'

    await postLogin(req, res, next)

    expect(req.session.username).toBe('testUser')
    expect(res.redirect).toHaveBeenCalledWith('/admin')
  })

  test('should redirect to login page with error message if username or password are incorrect', async () => {
    process.env.USER_NAME = 'testUser'
    process.env.PASS_WORD = 'testPassword'
    req.body.username = 'wrongUsername'

    await postLogin(req, res, next)

    expect(req.session.flash.type).toBe('danger')
    expect(req.session.flash.text).toBe('Wrong password or username')
    expect(res.redirect).toHaveBeenCalledWith('./login')
  })
})
