const express = require('express');
const exphbs = require('express-handlebars');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './html');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // Usa 5432 por defecto
});

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

/** url inicial, muestra listado de productos */
app.get('/', async (req, res) => {

  const queryText = 'SELECT * FROM tbl_products';

  try {
    // obtiene un cliente del pool
    const client = await pool.connect();
    try {
      const result = await client.query(queryText);
      console.log('Products:', result.rows);
      res.render('home', { products: result.rows });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error fetching products');
  }
});

/** url para mostrar listado de categorías */
app.get('/categories', async (req, res) => {
  const queryText = 'SELECT * FROM tbl_categories';
  try {
    // obtiene un cliente del pool
    const client = await pool.connect();
    try {
      const result = await client.query(queryText);
      console.log('Categories:', result.rows);
      res.render('categories', { categories: result.rows });
    } finally {
      // Libera el cliente de vuelta al pool
      client.release();
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error fetching categories');
  }
});

/** url para mostrar formulario de nuevo producto */
app.get('/new-product', async (req, res) => {
  const query = `
    SELECT id, name FROM tbl_categories;
  `;
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query);
      console.log('Categories for new product:', result.rows);
      res.render('new_product', { categories: result.rows });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error saving categories');
  }
});

/** url para mostrar formulario de nueva categoría */
app.get('/new-category', (req, res) => {
  res.render('new_category');
});

app.post('/categories', async (req, res) => {
  console.log(req.body);
  const query = `
    INSERT INTO tbl_categories (name, description, priority) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const values = [req.body.name, req.body.description, req.body.priority];
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      console.log('Inserted category:', result.rows[0]);
      res.redirect('/categories');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error saving categories');
  }
});

app.post('/products', async (req, res) => {
  console.log(req.body);
  const query = `
    INSERT INTO tbl_products (product_name, price, current_stock, category_id, tags) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;
  const values = [req.body.name, req.body.price, req.body.stock, req.body.category, req.body.tags.split(',')];
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, values);
      console.log('Inserted product:', result.rows[0]);
      res.redirect('/');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error saving product');
  }
});

app.get('/products/:id', (req, res) => {
  res.send(products.filter(item => item.id == req.params.id)[0]);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});