const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var engine;
var world;

var chao;
var corda;
var corda2;
var fruta;
var link; //nome do comando pra a fruta ficar grudada na corda
var link2; //nome do comando para a fruta ficar grudade na corda 2
var cueio;
var fundo2;
var botao; // botao para cortar a corda
var botao2; // botao para cortar a corda 2
var balao; // balao de impulso do jogo
var musica; //botao para deixar a trilha sonora muda

// vars de imagens dos elementos/sprites do jogo 

var cueio2; //2 = imagem do cueio
var fruta2; //2 = imagem da fruta

//vars de sons do jogos (som de comer, cortar a corda e etc)

var ar; //som do balao soprando
var somcomer; //som de comer
var cortarcorda; //som de cortar corda
var somtriste; // som de o cueio triste
var trilhasonora; //som do jogo

//vars das animacoes do cueio

var comer;
var triste;
var parado;

function preload(){
 
fundo2 = loadImage("images/background.png"); // carregar a imagem do fundo (a imagem do fundo está na pasta images)

cueio2 = loadImage("images/rabbit1.png"); // carregar a imagem do cueio (a imagem do cueio está na pasta images)

fruta2 = loadImage("images/melon.png"); // carregar a imagem da fruta (a imagem da fruta está na pasta images)

triste = loadAnimation("images/sad_1.png","images/sad_2.png","images/sad_3.png"); // carregar a imagem do cueio triste em ordem

parado = loadAnimation("images/rabbit1.png","images/rabbit2.png","images/rabbit3.png"); // carregar a imagem do cueio parado em ordem

comer = loadAnimation("images/eat.png","images/eat_2.png","images/eat_3.png","images/eat_4.png"); // carregar a imagem do cueio comer em ordem

comer.looping = false //false = nao repetir as animacoes de comer

triste.looping = false //false = nao repetir as animacoes de triste

ar = loadSound("sounds/air.wav")

somcomer = loadSound("sounds/eating_sound.mp3")

cortarcorda = loadSound("sounds/rope_cut.mp3")

somtriste = loadSound("sounds/sad.wav")

trilhasonora = loadSound("sounds/sound1.mp3")



}

function setup(){
  createCanvas(windowWidth,windowHeight);
  engine = Engine.create();
  world = engine.world;
 
  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  textSize(50)


  chao = Bodies.rectangle(width/2,height-10,width,20,{isStatic: true});
  World.add(world,chao);

  corda = new Rope(5,{x:width/2,y:50});// tamanho da corda

  corda2 = new Rope(5,{x:width/2-150,y:50}); // tamanho da corda 2

  fruta = Bodies.circle(width/2,100,20); // tamanho da fruta

  Composite.add(corda.body,fruta) // comando pra a fruta ficar na ponta da corda

  link = new Link(corda,fruta); // comando pra grudar a fruta e a corda

  link2 = new Link(corda2,fruta);

  //comandos do cueio 

  cueio = createSprite(width/2+100,height-100,10,10); //comando pra aonde o cueio vai ficar

  parado.frameDelay = 18 //deixar a animcao do cueio parado mais lenta

  comer.frameDelay = 20 //deixar a animcao do cueio comer mais lenta

  triste.frameDelay = 18 //deixar a animcao do cueio triste mais lenta

  cueio.addAnimation("paradoA",parado);

  cueio.addAnimation("comerA",comer); //tristeA, comerA, paradoA = A =  Animation

  cueio.addAnimation("tristeA",triste); 

  cueio.scale = 0.25; //comando pra mudar o tamnho do sprite cueio
  
  // comandos para colcar a imagem dos botoes 

  botao = createImg("images/cut_btn.png");

  botao2 = createImg("images/cut_btn.png");

  //comandos specificos do botao (seus comnados sao diferentes)

  botao.size(120,120); //tamanho do botao

  botao.position(width/2+130,100); //posicao x e y do botao

  botao.mouseClicked(drop); //comando para o mouse clicar no botao

  //comandos specificos do botao2 (seus comnados sao diferentes)

  botao2.size(120,120); //tamanho do botao

  botao2.position(width/2+130,200); //posicao x e y do botao

  botao2.mouseClicked(drop2); //comando para o mouse clicar no botao

  // comandos do balao

  balao = createImg("images/balloon.png");

  balao.position(50,150); // posicao do balao

  balao.size(150,120); //tamanho do balao

  balao.mouseClicked(soprar);

  // comandos para a trilha sonora e o botao de musica do jogo

  trilhasonora.play()

  trilhasonora.setVolume(0.1); //mudar o som da trilhasonora (porque é muito alta)

  musica = createImg("images/mute.png")

  musica.position(30,20);

  musica.size(60,60);

  musica.mouseClicked(mutar);
}

function draw(){
  background("#66493b");
  Engine.update(engine);

  image(fundo2,width/2,height/2,width,height);

  corda.show()//comando para a corda aparecer na tela(olha na rope.js na linha 31)
  
  corda2.show()//comando pra a corda aparecer na tela

  fill("green"); //<- ai que muda a cor (mudar a cor do chão)
  rect(chao.position.x,chao.position.y,width,20); // <-tamanho do chão, (esta num ofrmato de retangulo)
  
  if(fruta !=null){ /*comando pra mostrar a fruta na tela, e mostrar a imagem dela tambem, 
                                                           e se a fruta for comida sua imagem nao mostrara*/
    image(fruta2,fruta.position.x,fruta.position.y,80,80);  
  }  

  if(fruta!=null&&fruta.position.y>600){ //comando pra quando o cueio nao comer a fruta ele chora

  cueio.changeAnimation("tristeA") 
  
  somtriste.play();

  fruta = null
  }

  if(colision(fruta,cueio)==true){ //comando pra quando o cueio comer a fruta ele seja animado

  cueio.changeAnimation("comerA")

  somcomer.play();

  }
  drawSprites(); //comando pra desenhar os sprites do jogo, sprites = personagem que podemos configurar
}

function drop(){ //drop = drop a fruta da corda

 corda.break()

 link.cortar()

 cortarcorda.play()
 
}

function drop2(){

 corda2.break()

 link2.cortar() 

 cortarcorda.play()
}

function colision(body,sprite){
 
 if (body !=null){ //null = vazio(ingles) & ! = no

 var distancia = dist(body.position.x,body.position.y,sprite.position.x,sprite.position.y);

  if (distancia<=80){

   World.remove(world,fruta);

   fruta = null;

   return true /*comando pra dizer que a fruta foi comida, true = a fruta foi comida
                     false = a fruta nao foi comidaa*/                                      
  }
  else{

  return false  
  }
 } 
}

function soprar(){

  Matter.Body.applyForce(fruta,{x:0,y:0},{x:0.01,y:0})

  ar.play();

  ar.setVolume(0.1)

}

function mutar(){

  if (trilhasonora.isPlaying()){

  trilhasonora.stop()

  } 
  else{

  trilhasonora.play()

  }
}

