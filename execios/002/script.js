function carregar() {
  var msg = window.document.getElementById('msg')
  var img = window.document.getElementById('imagem')
  var data = new Date()
  //var hora = data.getHours()
  var hora = 22
  msg.innerHTML = `Now are ${hora} hours.`
  if (hora >= 0 && hora < 12) {
    //Bom dia!
    img.src = 'img/Design sem nome (2).png'
    document.body.style.background = '#7AB3CC'
  } else if (hora >= 12 && hora < 18){
    //Boa tarde!
    img.src = 'img/Design sem nome (1).png'
    document.body.style.background = '#E78BA8'
  } else {
    //Boa noite
    
    document.body.style.background = '#02050E'
    img.src = 'img/Design sem nome (3).png'
  
  }
}
