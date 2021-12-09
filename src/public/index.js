const socket = io();
//* -- EVENTOS DE SOCKET --
socket.on('deliverProd',data=>{
    let products = data.payload;
    fetch('templates/prodTable.handlebars').then(string=>string.text()).then(template=>{
        const processedTemplate = Handlebars.compile(template);
        const templateObject={
            products:products
        }
        const html = processedTemplate(templateObject);
        let div = document.getElementById('prodTable');
        div.innerHTML=html;
    })
})

//* -- MENSAJERIA -- 
let input = document.getElementById('mensaje');
let user = document.getElementById('user')
input.addEventListener('keyup',(e)=>{
    if(e.key==="Enter"){
        if(e.target.value){
            socket.emit("message",{user:user.value,message});
        }
    }
})
socket.on('welcome',data=>{
    alert(data)
})
socket.on('messagelog',data=>{
    let p = document.getElementById('log')
    let mensajes = data.map(message=>{
        return `<div><span>${message.user} dice: ${message.message}</div></span>`
    }).join('');
    p.innerHTML=mensajes;
})

//* -- FIN DE SOCKET --
document.addEventListener('submit',enviarFormulario);

function enviarFormulario(event){
    event.preventDefault();
    let form= document.getElementById('prodForm');
    let data = new FormData(form);
    fetch('/api/products',{
        method:'POST',
        body:data
    }).then(result=>{
        return result.json();
    }).then(json=>{
        Swal.fire({
            title:'Éxito',
            text:json.message,
            icon:'success',
            timer:2000,
        }).then(result=>{
            //location.href='/'
        })
    })
}

document.getElementById("image").onchange = (e)=>{
    let read = new FileReader();
    read.onload = e =>{
        document.querySelector('.image-text').innerHTML = "¡Cargado!"
        document.getElementById("preview").src = e.target.result;
    }
    
    read.readAsDataURL(e.target.files[0])
}