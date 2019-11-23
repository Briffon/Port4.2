window.addEventListener('DOMContentLoaded',function(e){
    let view = new View();
});


class View{
    constructor(){
        console.log("viewing card");
        let searchBar= document.querySelector(".searchInput input");
        let searchForm= document.querySelector(".searchInput");
        this.api=new API();

        this.loadCard();

        searchBar.addEventListener('input',this.searchModal.bind(this));
        searchForm.addEventListener('submit',this.search);
        this.cart();
    }

    cart(){
        let quan = document.querySelector(".quantity");
        let length = localStorage.getItem("cartLength");
        if(quan.classList.contains("hidden")){
            quan.classList.toggle("hidden");
        }
        let quantityBubble='';
        if(length>0){
            quantityBubble+=`<p>${length}<p>`;
        }
        quan.innerHTML='';
        quan.insertAdjacentHTML('beforeend',quantityBubble);
    }

    search=(e)=>{
        e.preventDefault();
        let term= document.querySelector(".searchInput input").value
        window.localStorage.setItem('searchedCard',term);
        window.location.href = '/pages/shopping.html';
    }

    searchModal=(e)=>{
        let searchTerm= e.target.value;
        let modal= document.querySelector("#modalSearch");
 
        if(searchTerm.length>=4){
            if(modal.classList.contains("hidden")){
                modal.classList.toggle("hidden");
            }
 
            this.api.searchModal(searchTerm)
             
        }else if(searchTerm.length<=3){
            if(!modal.classList.contains("hidden")){
                modal.classList.toggle("hidden");
            }
        }
 
     }

    lightPlay(price){
        let rate = (price*0.2).toFixed(2);
        return (price-rate).toFixed(2);
    }
    
    heavyPlay(price){
        let rate = price*0.35;
        return (price-rate).toFixed(2);
    }

    buyList(price){
        let rate = price*.40;
        return(price-rate).toFixed(2);
    }

    loadCard(){
        let card= localStorage.getItem("selectedCard");
        let parsed=JSON.parse(card);
        let page =document.querySelector(".sellPage")
        let html='';

        html+=`<div class="viewedCard">
        <h3>${parsed.name}</h3>
        <img src="${parsed.image_uris.small}"/>
        <p class="viewedSet">${parsed.set}</p>
        <p class="viewedRarity">Rarirty ${parsed.rarity}*Number ${parsed.collector_number}</p>`;

        if(parsed.prices.usd){
            let hp= this.heavyPlay(parsed.prices.usd);
            let lp= this.lightPlay(parsed.prices.usd);

            html+=`<div class="hidden">${card}</div>
            <ul class="viewedPrices">
            <li><p class="condition">Near Mint:</p><p class="viwedPrice">$${parsed.prices.usd}</p><button class="buy"  data-near=${parsed.prices.usd}>Buy</button></li>
            <li><p class="condition">Light Play:</p><p class="viwedPrice">$${lp}<button class="buy"  data-lp=${lp}>Buy</button></li>
            <li><p class="condition">Heavy Play:</p><p class="viwedPrice">$${hp}<button class="buy"  data-hp=${hp}>Buy</button></li>
            <li><p class="condition">Near Mint:</p><p class="viwedPrice">$${this.buyList(parsed.prices.usd)}<button class="sell"  data-near=${this.buyList(parsed.prices.usd)}>Sell</button></li>
            <li><p class="condition">Light Play:</p><p class="viwedPrice">$${this.buyList(lp)}<button class="sell"  data-lp=${this.buyList(lp)}>Sell</button></li>
            <li><p class="condition">Heavy Play:</p><p class="viwedPrice">$${this.buyList(hp)}<button class="sell"  data-hp=${this.buyList(hp)}>Sell</button></li>
            </ul>`;
        }else{
            let price = 0.01+Math.floor(Math.random()*(100-0.01));
            let lp= this.lightPlay(price);
            let hp= this.heavyPlay(price);
            html+=`<div class="hidden">${card}</div>
            <ul class="viewedPrices">
            <li><p class="condition">Near Mint:</p><p class="viwedPrice">$${price}<button class="buy"  data-near=${price}>Buy</button></li>
            <li><p class="condition">Light Play:</p><p class="viwedPrice">$${lp}<button class="buy"  data-lp=${lp}>Buy</button></li>
            <li><p class="condition">Heavy Play:</p><p class="viwedPrice">$${hp}<button class="buy"  data-hp=${hp}>Buy</button></li>
            <li><p class="condition">Near Mint:</p><p class="viwedPrice">$${price}<button class="sell" data-near=${this.buyList(price)}>Sell</button>
            <li><p class="condition">Light Play:</p><p class="viwedPrice">$${lp}<button class="sell" data-lp=${this.buyList(lp)}>Sell</button>
            <li><p class="condition">Heavy Play:</p><p class="viwedPrice">$${hp}<button class="sell" data-hp=${this.buyList(hp)}>Sell</button>
            </ul>`;
        }
        
        html+=`</div>`;
  
        page.insertAdjacentHTML('beforeend',html);
        let buttons = document.querySelectorAll(".buy");
        let sellButtons = document.querySelectorAll(".sell");

        buttons.forEach(button=>{
            button.addEventListener('click',function(e){this.addToCart(e,page)}.bind(this),true);
        })

        sellButtons.forEach(button=>{
            button.addEventListener('click',function(e){this.addToBuyCart(e,page)}.bind(this),true);
        })
        
    }

    addToCart(e,page){
        e.preventDefault();
        let card= page.getElementsByClassName("hidden")[0].innerHTML;
        let object= JSON.parse(card);
        let formatted=this.format(object.name,object.prices.usd,object.set,object.image_uris.small,object.collector_number,object.rarity);
        let quan = document.querySelector(".quantity");

        if(localStorage.getItem("shoppingCart")){
            let cards= localStorage.getItem("shoppingCart");
            let string= JSON.stringify(formatted);
            let obj = JSON.parse(cards);
            let fOBJ="{\"cards\":["+string;
            for(let i=0; i<obj.cards.length;i++){
                if(i!=obj.cards.length-1){
                    let str=JSON.stringify(obj.cards[i]);
                    fOBJ+=","+str;
                }else{
                    let str=JSON.stringify(obj.cards[i]);
                    fOBJ+=","+str+"]}";
                }
            }
            localStorage.setItem("shoppingCart",fOBJ);
        }else{
            let json="{\"cards\":["+JSON.stringify(formatted)+"]}";
            localStorage.setItem("shoppingCart",json);
        }

        let objs= JSON.parse(localStorage.getItem("shoppingCart"));
        localStorage.setItem("cartLength",objs.cards.length);

        this.cart();
    }

    addToBuyCart(e,page){
        e.preventDefault();
        let card= page.getElementsByClassName("hidden")[0].innerHTML;
        let object= JSON.parse(card);
        let formatted=this.format(object.name,object.prices.usd,object.set,object.image_uris.small,object.collector_number,object.rarity);

        if(localStorage.getItem("buyCart")){
            let cards= localStorage.getItem("buyCart");
            let string= JSON.stringify(formatted);
            let obj = JSON.parse(cards);
            let fOBJ="{\"cards\":["+string;
            for(let i=0; i<obj.cards.length;i++){
                if(i!=obj.cards.length-1){
                    let str=JSON.stringify(obj.cards[i]);
                    fOBJ+=","+str;
                }else{
                    let str=JSON.stringify(obj.cards[i]);
                    fOBJ+=","+str+"]}";
                }
            }
            localStorage.setItem("buyCart",fOBJ);
        }else{
            let json="{\"cards\":["+JSON.stringify(formatted)+"]}";
            localStorage.setItem("buyCart",json);
        }
    }

    format(name,price,set,img,number,rarity){
        if(price==null){
            let replacement = 0.01+Math.floor(Math.random()*(100-0.01));
            let card ={name:name,price:replacement,set:set,img:img,number:number,rarity:rarity};
            return card;
        }else{
            let card ={name:name,price:price,set:set,img:img,number:number,rarity:rarity};
            return card;
        }
        
    }

}