const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/foods.json');
const read = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));

router.get('/', (req, res) => {
  res.json(read().filter(f => f.available));
});

router.get('/:id', (req, res) => {
  const food = read().find(f => f.id === req.params.id);
  if (!food) return res.status(404).json({ error: 'Not found' });
  res.json(food);
});

module.exports = router;
