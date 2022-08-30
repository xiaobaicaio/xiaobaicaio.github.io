  var app = document.getElementById("app")
  var hintBox = `
  <div id="hintModelBox">
  <h1>游戏规则</h1>
  <div id="hintContext">
    <ul>
      <li>1.点击下一步即可开始游戏。</li>
      <li>2.点击图中方块即可加1分。</li>
      <li>3.100分即为获胜。</li>
    </ul>
  </div>
  <div id="hintBottom"><button id='hintBottomButton' >下一步</button></div>
  </div>
  `;
  var gameStep = 0;

  app.innerHTML += hintBox;
  var hintModelBox = document.getElementById("hintModelBox")
  var hintBottomButton = document.querySelector('#hintBottomButton')
  var gameBox = document.getElementById("gameBox");
  

  hintBottomButton.onclick=function(){
    hintModelBox.style.opacity = 0;
   var gameBox1 =  `<div id="gameBox">
   <div id="gameSpan" onclick="gameSpnClick()"></div>
 </div>`
  app.innerHTML += gameBox1;
  }

  
function gameSpnClick() {
  var gameSpan = document.getElementById("gameSpan");

  gameStep += 1;
  gameSpan.style.marginLeft =`${Math.floor(Math.random()* 80)}%`;
  gameSpan.style.marginTop = `${Math.floor(Math.random() * 90)}%`; 
  var promptModelBox =`<div id="promptModel">
  <h1>提示</h1>
  <div>因为写的太烂，所以你要再点击${gameStep}下才能继续</div>
  <button onclick="promptModelButton()" id="promptModelButton">继续</button>
  </div>`
  var dom = document.createElement('div');
  dom.id = 'promptModel'
  dom.innerHTML=` <h1>提示</h1>
  <div>因为写的太烂，所以你要点击${gameStep}下才能继续</div>
  <button onclick="promptModelButton()" id="promptModelButton">继续</button>`;
  if (gameStep === 1) {
    console.log('22224567');
    app.innerHTML += promptModelBox
  }
  if (gameStep > 1) {
    var promptModel = document.getElementById('promptModel')
    //替换
    promptModel.parentNode.replaceChild(dom, promptModel);
    promptModel.style.opacity = 1
    promptModel.style.zIndex = 1;

  } 
}
var number = 1;
function promptModelButton() {
  var promptModel = document.getElementById("promptModel")
  var button = document.getElementById("promptModelButton")
  if (number === 100) {
    button.style.opacity = 0
  }
  if (number === gameStep) {
    number=1
    promptModel.style.zIndex = -1;
    promptModel.style.opacity = 0;
  } else {
    number++
  };
}
