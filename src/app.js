const express = require('express');
const app = express();

app.use(express.json());

module.exports = {isMarketable};

const products = [
];

app.get('/', (req, res) => {
 res.send('Hello Boti :)');
})

// GET ALL
app.get('/api/products', (req, res) => {
    
    // calculando a soma da qtd de produtos em estoque
    getInventoryQuantityByList(products);

    // setando o isMarketable para os produtos disponíveis em estoque
    products.forEach(product => {
        isMarketable(product);
    })

    res.send(products);
})

// GET BY ID
app.get('/api/products/:sku', (req, res) => {
    
    const product = products.find(p => p.sku === parseInt(req.params.sku));

    if(!product){
        res.status(404).send('Produto não encontrado na lista..');
        return;
    }

    // calculando a soma da qtd de produtos em estoque
    getInventoryQuantityByList(products);
    
    // setando o isMarketable para os produtos disponíveis em estoque
    isMarketable(product);
    res.send(product);
})

// POST
app.post('/api/products', (req, res) => {

   if(!req.body.sku || !req.body.name || !req.body.inventory || !req.body.inventory.warehouse){
        res.status(400).send('Sku, name, inventory and warehouse are required fields...');
        return;
    }

    const product = {
        sku: req.body.sku,
        name: req.body.name,
        inventory: req.body.inventory
    };

    product.isMarketable = false;

    const result = validateSku(products, product, res);
    
    if(result){
        res.status(400).send(`Sku[${product.sku}] já existente em memória!`);
        return;
    }

    // calculando a soma da qtd de produtos em estoque
    getInventoryQuantity(product);

    products.push(product);
    res.send(product);
})

// PUT
app.put('/api/products/:sku', (req, res) => {

    const product = products.find(p => p.sku === parseInt(req.params.sku));

    if(!product){
        res.status(404).send('Produto não encontrado na lista..');
        return;
    }

    if(req.body.name){
        product.name = req.body.name;
    }
    if(req.body.inventory){
        product.inventory = req.body.inventory;
        product.inventory.quantity = 0;

        if(req.body.inventory.warehouse){
            product.inventory.warehouse = req.body.inventory.warehouse;
        }
    }

    // calculando a soma da qtd de produtos em estoque
    getInventoryQuantity(product);
    res.send(product);

})

// DELETE
app.delete('/api/products/:sku', (req, res) => {
    const product = products.find(p => p.sku === parseInt(req.params.sku));

    if(!product){
        res.status(404).send('Produto não encontrado na lista..');
        return;
    }
    
    const index = products.indexOf(product);
    products.splice(index, 1);

    res.send(product);

})

/**
 * Método responsável por somar a quantidade de produtos em depósito para uma lista de produtos.
 * @param {*} products lista de produtos
 */
function getInventoryQuantityByList(products) {
    products.forEach(product => {
        
        let sumQuantity = 0;    
        if(product.inventory.warehouse){
            product.inventory.warehouse.forEach(warehouse => {
                if(warehouse.quantity){
                    sumQuantity += warehouse.quantity;    
                }
            }); 
        }
        product.inventory.quantity = sumQuantity;
    });
}

/**
 * Método responsável por somar a quantidade de produtos em depósitos para 1 produto.
 * @param {*} product produtos
 */
function getInventoryQuantity(product) {
    if(!product.inventory.warehouse){
        product.inventory.quantity = 0;
        return;
    }
    
    product.inventory.warehouse.forEach(warehouse => {
        if(warehouse.quantity){
            product.inventory.quantity += warehouse.quantity;    
        }
    }); 
}

/**
 * Método responsável por setar o isMarketable caso a quantidade no depósito seja maior que zero.
 * @param {*} product produto a ser listado
 */
function isMarketable(product){
    
    product.isMarketable = false;

    if(product.inventory.quantity > 0){
        product.isMarketable = true;
    }
}

/**
 * Método responsável por verificar se o sku já existia em memória.
 * @param {*} products 
 * @param {*} product 
 */
function validateSku(products, product){

    let skuExists = false;
    products.forEach(prod => {
        if(prod.sku === product.sku){
            skuExists = true;
        }
    })
    return skuExists;
}

app.listen(3000, () => console.log('API listening on 3000...'));