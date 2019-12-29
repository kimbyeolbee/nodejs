var fs = require('fs');

/*
//fs.readFileSync(path[, options]) 동기적
console.log('A');
var result = fs.readFileSync('syntax/sample.txt', 'utf8');
console.log(result);
console.log('C');
//A B C
*/

//fs.readFile(path[, options], callback) 비동기적
console.log('A');
fs.readFile('syntax/sample.txt', 'utf8', function(err, result){
  console.log(result);
});
//nodejs야 네가 가지고 있는 readFile이라는 기능을 이용해서 syntax/sample.txt를 읽어 와. 그런데 시간이 조금 걸리니까, 작업이 끝나기 전에 내가 너한테 전달한 이 세 번째 인자인 함수(function)를 실행시켜.
console.log('C');
//A C B
