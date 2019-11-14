class API{
    constructor(){
        console.log("API Started.")
        this.BASE_URL = 'https://api.scryfall.com';
    }

    searchModal(name){
        let div = document.querySelector("#modalCards");
            return fetch(`${this.BASE_URL}/cards/search?q=${name}`).then(res=>{
            if(res.ok){
                return res.json();
            }
            throw new Error(res);
        })
        .then(cards=>{
            div.innerHTML="";
            for(let i=0;cards.total_cards<15;i++){
                if(cards.data[i].name){
                    let html= '';
                    html+=`<li><p>${i}${cards.data[i].name}</p></li>`
                    div.insertAdjacentHTML('beforeend',html);
                }
            }
           
        })
    }

    Api(config) {
        const{endpoint = '/cards', method='GET'}= config;
        const BASE_URL = 'https://api.scryfall.com';

        return fetch(`${BASE_URL}${endpoint}?`).then(res => {
          if (res.ok) {
            return res.json();
          }
          throw new Error(res);
        })
    }
}