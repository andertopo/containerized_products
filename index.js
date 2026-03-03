const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './html');


const categories = [
  {
    id: 1,
    name: 'Laptops',
    description: 'Computadoras portátiles para oficina y gaming',
    is_active: true,
    priority: 1,
    create_date: '2026-02-28',
    metadata: {
      'garantia_minima': '1 año', 
      'importado': true
    }
  },
  {
    id: 2,
    name: 'Monitores',
    description: 'Pantallas 4K, UltraWide y oficina',
    is_active: true,
    priority: 1,
    create_date: '2026-02-28',
    metadata: {
      'tecnologia': 'OLED/IPS'
    }
  }
];

const products = [
  {
    sku: '888888',
    category_id: 1,
    product_name: 'MacBook Air M2',
    price: 1200,
    current_stock: 15,
    last_update: '2026-02-26',
    tags: ['apple', 'm2', 'silver']
  }
];

/** renders */
app.get('/', (req, res) => {
  res.render('home', { products });
});

app.get('/categories', (req, res) => {
  res.render('categories', { categories });
});

app.get('/new-product', (req, res) => {
  const categoriesToProduct = {categories: categories.map(item => ({id: item.id, name: item.name}))};
  console.log('categorias para producto', categoriesToProduct);
  res.render('new_product', categoriesToProduct);
});

app.get('/new-category', (req, res) => {
  res.render('new_category', {});
});

app.post('/categories', (req, res) => {
  console.log(req.body);
  categories.push({
    id: categories.length + 1,
    name: req.body.name,
    description: req.body.description,
    is_active: true,
    priority: req.body.priority,
    create_date: '2026-02-28',
    metadata: {
      'garantia_minima': '1 año', 
      'importado': true
    }
  });
  res.redirect('/categories')
});

app.get('/categories/:id', (req, res) => {
  res.send(categories.filter(item => item.id == req.params.id)[0]);
});

app.post('/products', (req, res) => {
  console.log(req.body);
  products.push({
    sku: '888888',
    category_id: req.body.category,
    product_name: req.body.name,
    price: req.body.price,
    current_stock: req.body.stock,
    last_update: '2026-02-26',
    tags: req.body.tags.split(',')
  })
  res.redirect('/');
});

app.get('/products/:id', (req, res) => {
  res.send(products.filter(item => item.id == req.params.id)[0]);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});