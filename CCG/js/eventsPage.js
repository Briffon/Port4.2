window.addEventListener('DOMContentLoaded',function(e){
    let load= new Events();
});

class Events{
    constructor(){
        console.log("started events page");
        this.loadEvents();
    }

    loadEvents(){
        fetch('/jsons/events.json').then(res=>{
            if(res.ok){
                return res.json();
            }

        }).then(data=>{
            let events= data.events;
            let weekly = data.weekly;
            let eventSection= document.querySelector(".events");
            let weeklySection= document.querySelector(".weeklyEvents");

            let otherIt=0;
            events.forEach(event=>{
                let html='';

                html+=`<div data-type="events" data-id="${otherIt}">
                <h3>${event.title}</h3>
                <img src="${event.picture}"/>
                <p><strong>Event</strong>:${event.date}</p>
                <p><strong>Time</strong>:${event.time}</p>
                <p><strong>Entry</strong>:${event.entry}</p>
                <p><strong>Description</strong>:${event.description}</p>
                <button class="eventButton">Read More</button>
                </div>`;

                eventSection.insertAdjacentHTML('beforeend',html);
                otherIt=otherIt+1;
                
            })

            let weeklyIt=0;
            weekly.forEach(event=>{
                let html='';

                html+=`<div data-type="weekly" data-id="${weeklyIt}">
                <h3>${event.title}</h3>
                <img src="${event.picture}"/>
                <p><strong>Event</strong>:${event.date}</p>
                <p><strong>Time</strong>:${event.time}</p>
                <p><strong>Entry</strong>:${event.entry}</p>
                <p><strong>Description</strong>:${event.description}</p>
                <button class="eventButton">Read More</button>
                </div>`;

                weeklySection.insertAdjacentHTML('beforeend',html);
                weeklyIt=weeklyIt+1;
            })

            let buttons = document.querySelectorAll(".eventButton");
            buttons.forEach(button=>{
            button.addEventListener('click',this.readMore)
            })
        })
    }

    readMore(e){
        e.preventDefault();
        localStorage.setItem("eventType",e.target.parentElement.dataset.type);
        localStorage.setItem("eventId",e.target.parentElement.dataset.id);

        window.location.href = '/pages/event.html';

    }
}