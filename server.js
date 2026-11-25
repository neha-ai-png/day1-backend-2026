require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully!'))
    .catch((error) => console.log('MongoDB Connection Error:', error));

// app.use(express.json());

// // GET API
// app.get('/', (req, res) => {
//     res.send('My backend is working!');
// });

// // GET Products API
// app.get('/products', (req, res) => {
//     res.json([
//         { id: 1, name: 'Sofa', price: 15000 },
//         { id: 2, name: 'Chair', price: 3000 }
//     ]);
// });

// POST Products API
// app.post('/products', (req, res) => {
//     const newProduct = req.body;

//     res.status(201).json({
//         message: 'Product added successfully!',
//         product: newProduct
//     });
// });

// let products = [
//     { id: 1, name: 'Sofa', price: 15000 },
//     { id: 2, name: 'Chair', price: 3000 }
// ];

// PUT API - Update product
// app.put('/products/:id', (req, res) => {
//     const id = Number(req.params.id);

//     const product = products.find(p => p.id === id);

//     if (!product) {
//         return res.status(404).json({
//             message: 'Product not found'
//         });
//     }

//     product.name = req.body.name;
//     product.price = req.body.price;

//     res.json({
//         message: 'Product updated successfully',
//         product
//     });
// });

// DELETE API - Delete product
// app.delete('/products/:id', (req, res) => {
//     const id = Number(req.params.id);

//     products = products.filter(p => p.id !== id);

//     res.json({
//         message: 'Product deleted successfully'
//     });
// });
// app.use(express.json());

app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);

        await product.save();

        res.status(201).json({
            message: 'Product saved successfully!',
            product: product
        });

    } catch (error) {
    res.status(error.name === 'ValidationError' ? 400 : 500).json({
        message: 'Error saving product',
        error: error.message
    });
    }
});
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();

        res.json(products);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
});
app.put('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.json({
            message: 'Product updated successfully!',
            product
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        res.json({
            message: 'Product deleted successfully!',
            product
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
});
// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});


// const express = require('express');

// const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello! My first backend server is running!');
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });