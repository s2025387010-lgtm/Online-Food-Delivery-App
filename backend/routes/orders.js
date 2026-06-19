const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const ordersPath = path.join(__dirname, '../data/orders.json');
const foodsPath = path.join(__dirname, '../data/foods.json');

const readOrders = () => JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
const writeOrders = d => fs.writeFileSync(ordersPath, JSON.stringify(d, null, 2));
const readFoods = () => JSON.parse(fs.readFileSync(foodsPath, 'utf8'));

// GET single order by ID (for order tracking)
router.get('/:id', (req, res) => {
  const order = readOrders().find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.post('/', (req, res) => {
  const { items, customerName, customerPhone, customerAddress } = req.body;
  if (!items?.length || !customerName || !customerPhone || !customerAddress) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const foods = readFoods();
  let total = 0;
  const orderItems = items.map(({ foodId, quantity }) => {
    const food = foods.find(f => f.id === foodId);
    if (!food) throw new Error(`Food ${foodId} not found`);
    total += food.price * quantity;
    return { foodId, name: food.name, price: food.price, quantity };
  });

  const order = {
    id: uuidv4(),
    items: orderItems,
    total: parseFloat(total.toFixed(2)),
    customerName,
    customerPhone,
    customerAddress,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const orders = readOrders();
  orders.push(order);
  writeOrders(orders);
  res.status(201).json(order);
});

module.exports = router;
