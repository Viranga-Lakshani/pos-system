const API = (path, opts={})=>{
  const base = localStorage.getItem('API_URL') || '';
  return fetch(base + path, opts).then(r=>r.json());
};

async function loadProducts(){
  const list = document.getElementById('product-list');
  list.innerHTML = 'Loading...';
  try{
    const res = await API('/products');
    if(Array.isArray(res)){
      list.innerHTML = '';
      res.forEach(p=>{
        const el = document.createElement('div');
        el.innerHTML = `<div><strong>${p.name}</strong> — ₹${p.price.toFixed(2)} — stock: ${p.stock}</div>`;
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Add to cart';
        addBtn.onclick = ()=> addToCart(p.id);
        el.appendChild(addBtn);
        list.appendChild(el);
      });
    } else list.innerText = 'No products';
  }catch(e){ list.innerText = 'Failed to load products'; console.error(e)}
}

document.getElementById('add-product-form').addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  const name = document.getElementById('p-name').value;
  const price = parseFloat(document.getElementById('p-price').value);
  const stock = parseInt(document.getElementById('p-stock').value,10);
  try{
    await API('/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,price,stock})});
    document.getElementById('p-name').value='';document.getElementById('p-price').value='';document.getElementById('p-stock').value='';
    loadProducts();
  }catch(e){ alert('Add failed') }
})

let cart = [];
function addToCart(productId){
  cart.push(productId);
  renderCart();
}
function renderCart(){
  const node = document.getElementById('cart');
  node.innerHTML = '<h3>Cart</h3>';
  if(cart.length===0){ node.innerHTML += '<div>Cart empty</div>'; return; }
  cart.forEach((id, idx)=>{
    const d = document.createElement('div'); d.textContent = `Item id: ${id} — position ${idx+1}`;
    node.appendChild(d);
  })
}

document.getElementById('checkout').addEventListener('click', async ()=>{
  if(cart.length===0){ alert('Cart empty'); return; }
  try{
    const res = await API('/sale',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart})});
    document.getElementById('message').innerText = res.message || 'Sale recorded';
    cart = []; renderCart(); loadProducts();
  }catch(e){ alert('Checkout failed') }
});

document.getElementById('load-sales').addEventListener('click', async ()=>{
  const node = document.getElementById('sales-list'); node.innerText = 'Loading...';
  try{
    const res = await API('/sales');
    node.innerHTML = '';
    res.forEach(s=>{
      const div = document.createElement('div'); div.textContent = `${s.id} — ${new Date(s.created_at).toLocaleString()} — items:${s.items.length}`;
      node.appendChild(div);
    })
  }catch(e){ node.innerText = 'Failed to load' }
});

window.onload = ()=> loadProducts();
