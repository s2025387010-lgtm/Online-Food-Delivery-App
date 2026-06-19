const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const adminAuth = require('../middleware/adminAuth');

const foodsPath = path.join(__dirname, '../data/foods.json');
const ordersPath = path.join(__dirname, '../data/orders.json');

const readFoods = () => JSON.parse(fs.readFileSync(foodsPath, 'utf8'));
const writeFoods = d => fs.writeFileSync(foodsPath, JSON.stringify(d, null, 2));
const readOrders = () => JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
const writeOrders = d => fs.writeFileSync(ordersPath, JSON.stringify(d, null, 2));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Verify admin key (no auth middleware here — public endpoint)
router.post('/verify', (req, res) => {
  if (req.body.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Invalid key' });
  }
  res.json({ valid: true });
});

// --- Food routes ---

router.get('/foods', adminAuth, (req, res) => res.json(readFoods()));

router.post('/foods', adminAuth, upload.single('image'), (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'name, price and category required' });
  }
  const food = {
    id: require('crypto').randomUUID(),
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    image: req.file ? `/uploads/${req.file.filename}` : null,
    available: true,
    createdAt: new Date().toISOString(),
  };
  const foods = readFoods();
  foods.push(food);
  writeFoods(foods);
  res.status(201).json(food);
});

router.put('/foods/:id', adminAuth, upload.single('image'), (req, res) => {
  const foods = readFoods();
  const i = foods.findIndex(f => f.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  const { name, description, price, category, available } = req.body;
  if (name) foods[i].name = name;
  if (description !== undefined) foods[i].description = description;
  if (price) foods[i].price = parseFloat(price);
  if (category) foods[i].category = category;
  if (available !== undefined) foods[i].available = available === 'true' || available === true;
  if (req.file) foods[i].image = `/uploads/${req.file.filename}`;
  writeFoods(foods);
  res.json(foods[i]);
});

router.delete('/foods/:id', adminAuth, (req, res) => {
  const foods = readFoods();
  const i = foods.findIndex(f => f.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  foods.splice(i, 1);
  writeFoods(foods);
  res.json({ success: true });
});

// --- Order routes ---

router.get('/orders', adminAuth, (req, res) => {
  res.json(readOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.put('/orders/:id/status', adminAuth, (req, res) => {
  const orders = readOrders();
  const i = orders.findIndex(o => o.id === req.params.id);
  if (i === -1) return res.status(404).json({ error: 'Not found' });
  const valid = ['pending', 'preparing', 'on the way', 'delivered', 'cancelled'];
  if (!valid.includes(req.body.status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  orders[i].status = req.body.status;
  writeOrders(orders);
  res.json(orders[i]);
});

module.exports = router;
