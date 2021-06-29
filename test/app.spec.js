const chai = require('chai')
const expect = chai.expect

const validator = require('../src/app');

// criação de um teste unitário para exemplo com o método isMarketable()
describe("validator isMarketable()", () => {
    it("deve retornar true, pois a quantidade de produtos no inventário é 15", ()=> {

        const product1 = {
            "sku":"1",
            "name":"Teste 1",
            "inventory":{"quantity": "15", "warehouses":[{"locality":"SP"}, {"quantity":"5"}, {"type":"ECOMMERCE"}]}
        };

    // chamando o método isMarketable()
    validator.isMarketable(product1);
    
    // teste
    expect(product1.isMarketable).to.be.true
   
    })

    it("deve retornar false, pois a quantidade de produtos no inventário é zero", ()=> {

        const product2 = {
            "sku":"2",
            "name":"Teste 1",
            "inventory":{"quantity": "0", "warehouses":[{"locality":"SP"}, {"quantity":"0"}, {"type":"ECOMMERCE"}]}
        };

    // chamando o método isMarketable()
    validator.isMarketable(product2);
    
    // teste
    expect(product2.isMarketable).to.be.false
   
    })
})