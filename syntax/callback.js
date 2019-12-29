/*
function a(){
  console.log('A');
}
*/

//익명함수
var a = function(){
  console.log('A');
}

function slowfunc(callback){
  callback();
}

slowfunc(a);
