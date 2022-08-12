//UI가 노출될 위치(정렬, 가로, 세로) 값을 변수로 사전에 제작
let position = 'middle';
let width = 400;
let height = 400;

// my.html로 state라는 태그를 만들어 hello라는 값을 전달
let _widget = App.showWidget('my.html', position, width, height);