const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');

const controller = require("../controllers/productsController");


// donde voy a guardar imagenes de los productos


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../public/images/productImg'))
    },
    filename: function (req, file, cb) {
        cb(null, 'foto' + '-' + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage })

/* router.get("/productDetail", productController.detail);
router.get("/productCreateForm", productCreateController.index);
router.post("/productCreateForm", upload.single('image'), productCreateController.create);
router.get("/edit/:id", productCreateController.edit);
router.put("/edit/:id",upload.single('image'), productCreateController.put);
router.get("/delete/:id",productCreateController.destroy); */

router.get('/', controller.find);
router.get('/detail/:id', controller.findOne);
router.get('/create', controller.createForm);
router.post('/create', upload.single('image') , controller.create);
router.get('/update', controller.updateForm);
router.put('/update/:id',  upload.single('image'), controller.update);
router.delete('/:id', controller.delete);

// router.post('/productCreateForm', controller.create)


module.exports = router;


