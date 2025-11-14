const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const DATA_FILE = path.join(__dirname,'data.json');

function readData(){
  try{ return JSON.parse(fs.readFileSync(DATA_FILE,'utf8')); }catch(e){ return {products:[], sales:[], nextProductId:1, nextSaleId:1}; }
}
function writeData(d){ fs.writeFileSync(DATA_FILE, JSON.stringify(d,null,2)); }

app.get('/health', (req,res)=> res.json({ok:true}));

app.get('/products', (req,res)=>{
  const d = readData();
  res.json(d.products);
});

app.post('/products', (req,res)=>{
  const {name, price, stock} = req.body;
  if(!name) return res.status(400).json({error:'name required'});
  const d = readData();
  const product = {id: d.nextProductId++, name, price: Number(price)||0, stock: Number(stock)||0};
  d.products.push(product);
  writeData(d);
  res.json(product);
});

app.post('/sale', (req,res)=>{
  const {items} = req.body;
  if(!Array.isArray(items) || items.length===0) return res.status(400).json({error:'items required'});
  const d = readData();
  // map each id to a product and decrement stock
  const saleItems = [];
  for(const id of items){
    const p = d.products.find(x=>x.id===id);
    if(!p) return res.status(400).json({error:`product ${id} not found`});
    if(p.stock<=0) return res.status(400).json({error:`product ${p.name} out of stock`});
    p.stock = p.stock - 1;
    saleItems.push({id:p.id, name:p.name, price:p.price});
  }
  const sale = {id: d.nextSaleId++, items: saleItems, created_at: new Date().toISOString()};
  d.sales.push(sale);
  writeData(d);
  res.json({message:'sale recorded', sale});
});

app.get('/sales',(req,res)=>{
  const d = readData();
  res.json(d.sales);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server listening on', PORT));
