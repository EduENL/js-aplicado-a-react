let cart = []
let modalQt = 0
let key = 0

// selecionar um elemento do DOM
const c = (el) => document.querySelector(el)

//selecionar todos os elemntos do DOM
const cs = (el) => document.querySelectorAll(el)

modelsJson.map((item, index) => {
    // clonar o item modelo
    let modelsItem = c('.models .models-item').cloneNode(true);
    
    // atualizar dados do item
    modelsItem.setAttribute('data-key', index)
    modelsItem.querySelector('.models-item--img img').src = item.img
    modelsItem.querySelector('.models-item--price').innerHTML = `R$ ${item.price[2].toFixed(3)}`
    modelsItem.querySelector('.models-item--name').innerHTML = item.name
    modelsItem.querySelector('.models-item--desc').innerHTML = item.description

    // adicionar evento de clique para exibir modal ao clicar no modelo
    modelsItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        key = e.target.closest('.models-item').getAttribute('data-key');
        modalQt = 1;

        c('.modelsBig img').src = modelsJson[key].img
        c('.modelsInfo h1').innerHTML = modelsJson[key].name
        c('.modelsInfo--desc').innerHTML = modelsJson[key].description
        c('.modelsInfo--size.selected').classList.remove('selected')
        
        // Atualizar tamanhos disponíveis no modal
        cs('.modelsInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
                c('.modelsInfo--actualPrice').innerHTML= `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
            }
            size.querySelector('span').innerHTML = modelsJson[key].sizes[sizeIndex];
        });
        
        c('.modelsInfo--qt').innerHTML = modalQt;
        c('.modelsWindowArea').style.opacity = 0;
        c('.modelsWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.modelsWindowArea').style.opacity = 1;
        }, 200);

    });
    c('.models-area').append(modelsItem)
});

// função para fechar o modal

function closeModal() {
    c('.modelsWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.modelsWindowArea').style.display = 'none'
    }, 500);
}

// adicionar eventos de clique para fechar o modal
cs('.modelsInfo--cancelButton, .modelsInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

// Adicionar evento de clique para controlar a quantidade do modal
c('.modelsInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.modelsInfo--qt').innerHTML = modalQt;
    }
});

c('.modelsInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.modelsInfo--qt').innerHTML = modalQt
});

// Adicionar evento de clique para selcionar o tamanho do modal 
cs('.modelsInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.modelsInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
        c('.modelsInfo--actualPrice').innerHTML = `R$ ${modelsJson[key].price[sizeIndex].toFixed(2)}`;
    });
});

// Adicionar evento de clique para adicionar item ao carrinho
c('.modelsInfo--addButton').addEventListener('click', () => {

    // Lógica para adicionar ao carrinho
    let size = parseInt(c('.modelsInfo--size.selected').getAttribute('data-key'));
    let identifier = modelsJson[key].id + '@' + size;
    let locaId = cart.findIndex((item) => item.identifier == identifier)
    if (locaId > -1) {
        cart[locaId].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: modelsJson[key].id,
            size,
            qt: modalQt
        });
    }
    uptadeCart();
    closeModal();
});

// Adicionar evento de clique para exibir o carrinho quando há itens dentro dele
c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    };
});

// Adicionar evento de clique para fechar a barra lateral do carrinho
c('.menu-closer').addEventListener('click', ()=> {
    c('aside').style.left = '100vw';
})

// Adicionar evento de clique para finalizar a compra e limpar o carrinho
c('.cart-finalizar').addEventListener('click', ()=> {
    cart = [];
    uptadeCart();
})

// Função para atualizar o conteúdo do carrinho
function uptadeCart(){
    // atualizar o número de itens no ícone
    c('.menu-openner span').innerHTML = cart.length
    // verificar se há itens no carrinho
    if(cart.length > 0){
        // Adicionar calsse show para mostrar exibir a barra lateral do carrinho
        c('aside').classList.add('show');
        // Limpar o conteudo do carrinho
        c('.cart').innerHTML = '';

        // Inicialização de variáveis para os totais
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        // Alterar os itens no carrinho 
        cart.map((itemCart, index)=>{
            // encontrar o item correspondente nos dados do modelo
            let modelItem = modelsJson.find((itemBD)=>itemBD.id == itemCart.id)

            // Calcular o subtotal com base no preço e na quantidade de itens
            subtotal += modelItem.price[itemCart.size] * itemCart.qt

            // Clonar o item para exibição
            let cartItem = c('.models .cart--item').cloneNode(true)
            let modelSizeName;

            // Determinar o nome do tamanho do modelo com base no índice
            switch(itemCart.size) {
                case 0:
                    modelSizeName = 'P';
                    break
                case 1: 
                    modelSizeName = 'M';
                    break
                case 2: 
                    modelSizeName = 'G';
                    break
            }

            // Atualizar os dados dos item clonado 
            cartItem.querySelector('img').src = modelItem.img
            cartItem.querySelector('.cart--item--nome').innerHTML = `${modelItem.name} - ${modelItem.sizes[itemCart.size]}`;
            cartItem.querySelector('.cart--item--qt').innerHTML = itemCart.qt;

            // Adicionar eventos de clique para adicionar ou retirar quantidade de itens
            cartItem.querySelector('.cart--item--qtmenos').addEventListener('click', ()=> {
                if(itemCart.qt > 1){
                    itemCart.qt --;
                } else {
                    cart.splice(index, 1);
                }
                uptadeCart()
            });
            cartItem.querySelector('.cart--item--qtmenos').addEventListener('click', ()=> {
                itemCart.qt ++;
                uptadeCart()
            });

            // adicionar item clonado aos itens do carrinho
            c('.cart').append(cartItem)
        });

        // Calcular o desconto e o total com base no subtotal 
        desconto = subtotal * 0.1
        total = subtotal - desconto

        // Atualizar os elementos HTML com os valores do subtotal, desconto e total
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
        // remover a classe show para ocultar a barra lateral do carrinho
        c('aside').classList.remove('show');
        // Esconder a barra lateral movendo-a para fora da tela
        c('aside').style.left = '100vw'
    }
}


