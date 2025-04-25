var board;
var data3x3 = [];
var data4x4 = [];
var data5x5 = [];
var time = 0;
var score = 0;
var rows = 4;
var cols = 4;
var nomove = 0;
var left = 0;
var right = 0;
var up = 0;
var down = 0;
var Classic = 1;
var Roman = 0;
var Candy = 0;
const numval = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576];
const romval = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

let startTime;
let timerInterval;
let elapsedTime = 0;
let keyupEnabled = true;

const sizes = document.querySelectorAll('.size');

window.onload = function(){
    SetSize();
    SetGame();
    GetLocalStorageDetails();
}
  sizes.forEach(button => {
    button.addEventListener('click', () => {
      sizes.forEach(b => b.classList.remove('clicked')); // remove from others
      button.classList.add('clicked'); // add to clicked one
      const clickedsize = document.querySelector(".clicked");
      if (clickedsize.innerText !== rows.toString()+"x"+rows.toString()){
        SetSize();
        SetGame();
      }
    });
  });

function ResetGame(){
    document.getElementById("gameboard").innerHTML = "";
    document.getElementById("score").innerText = "0";
    const reset = document.querySelector(".reset");
    reset.style.opacity = "1";
    reset.style.pointerEvents = "all";
    ButtonEnabler();
    ResetTime();
    time = 0;
    score = 0;
    nomove = 0;
    left = 0;
    right = 0;
    up = 0;
    down = 0;
    SetSize();
    SetGame();
}
function GameStop(){
    document.getElementById("gameover").style.display = "none";
    document.getElementById("gamebackground").style.display = "none";
    keyupEnabled = true;
    ResetGame();
}
function SetSize(){
    const clickedsize = document.querySelector(".clicked");
    if (!clickedsize) return;
    const gameboard = document.getElementById("gameboard");
    gameboard.innerHTML = "";
    if (clickedsize.innerText === "3x3"){
        rows = 3;
        cols = 3;
        board = Array.from({ length: 3 }, () => Array(3).fill(0));
        //board = [[262144, 1048576, 1048576],[8192,8192,16384],[32768, 65536, 131072]];
        gameboard.style.width = "299px";
        gameboard.style.height = "299px";
    }
    else if(clickedsize.innerText === "4x4"){
        rows = 4;
        cols = 4;
        board = Array.from({ length: 4 }, () => Array(4).fill(0));
        gameboard.style.width = "399px";
        gameboard.style.height = "398px";
    }
    else if(clickedsize.innerText === "5x5"){
        rows = 5;
        cols = 5;
        //board = Array.from({ length: 5 }, () => Array(5).fill(0));
        board = [[2,4,8,16,32],[64,128,256,512,1024],[2048,4096,8192,16384, 32768],[65536, 131072, 262144, 524288, 1048576], [0,0,0,0,0]];
        gameboard.style.width = "498px";
        gameboard.style.height = "498px";
    }
}
function SetGame(){

    for (let r = 0; r < rows; r++){
        for(let c = 0; c < cols; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            UpdateTile(tile, num);
            document.getElementById("gameboard").append(tile);
        }
    }

    SetTwo();
    SetTwo();
}
function UpdateTile(tile, num){
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("gametile");
    if (num>0){
        if (num <= 4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            tile.classList.add("x8192");
        }
        if (Classic === 1){
            Classical(tile, num);
        }
        else if (Roman === 1){
            RomanNumerals(tile, num);
        }
        else if (Candy=== 1){
            Classical(tile, num);
        }
    }
}
function Classical(tile, num){
    for(let i = 0; i <= numval.length; i++){
        if (num === numval[i]){
            tile.innerText = num;
        }
        let fontsz = 35;
        for(let j = 0; j<i; j++){
            if(fontsz >= 15){
                fontsz -= 2;
            }
            if (num === numval[13+j]){
                tile.style.fontSize = fontsz.toString() + "px";
            }
        }
    }
}
function RomanNumerals(tile, num){
    for(let i = 0; i <= numval.length; i++){
        if (num === numval[i]){
            tile.innerText = romval[i];
        }
        if (num === 262144){
            tile.style.fontSize = "33px";
        }
    }
}

document.addEventListener("keyup", (e) =>{
    if (!keyupEnabled){
        return;
    }
    if(e.code == "ArrowLeft"){
        SlideLeft();
    }
    else if(e.code == "ArrowRight"){
        SlideRight();
    }
    else if(e.code == "ArrowUp"){
        SlideUp();
    }
    else if(e.code == "ArrowDown"){
        SlideDown();
    }
    ButtonDisabler();
    if (time === 0){
        StartTime();
        time = 1;
    }
    console.log(nomove);
    if (nomove === 4){
        keyupEnabled = false;
        const reset = document.querySelector(".reset");
        reset.style.opacity = "0.5";
        reset.style.pointerEvents = "none";
        document.getElementById("finalscore").innerText = score;
        document.getElementById("gamebackground").style.display = "grid";
        document.getElementById("gameover").style.display = "grid";
        const clickedsize = document.querySelector(".clicked"); 
        if (clickedsize.innerText === "3x3"){
            let username = document.getElementById("username").value;
            if (username === ""){
                username = "No name";
            }
            const totaltime = document.getElementById("time").innerText;
            data3x3.push({
                name: username,
                score: parseInt(score),
                time: totaltime
            });
            data3x3.sort((a, b) => b.score - a.score);
            document.querySelector(".g3x3").innerText = `${data3x3[0].name}      ${data3x3[0].score}      ${data3x3[0].time}`;
            localStorage.setItem("n1_3x3", data3x3[0].name);
            localStorage.setItem("s1_3x3", data3x3[0].score);
            localStorage.setItem("t1_3x3", data3x3[0].time);
            if (data3x3[1]) {
                document.querySelector(".s3x3").innerText = `${data3x3[1].name}      ${data3x3[1].score}      ${data3x3[1].time}`;
                localStorage.setItem("n2_3x3", data3x3[1].name);
                localStorage.setItem("s2_3x3", data3x3[1].score);
                localStorage.setItem("t2_3x3", data3x3[1].time);
            }
            if (data3x3[2]) {
                document.querySelector(".b3x3").innerText = `${data3x3[2].name}      ${data3x3[2].score}      ${data3x3[2].time}`;
                localStorage.setItem("n3_3x3", data3x3[2].name);
                localStorage.setItem("s3_3x3", data3x3[2].score);
                localStorage.setItem("t3_3x3", data3x3[2].time);
            }
        }
        else if (clickedsize.innerText === "4x4"){
            let username = document.getElementById("username").value;
            if (username === ""){
                username = "No name";
            }
            const totaltime = document.getElementById("time").innerText;
            data4x4.push({
                name: username,
                score: parseInt(score),
                time: totaltime
            });
            data4x4.sort((a, b) => b.score - a.score);
            document.querySelector(".g4x4").innerText = `${data4x4[0].name}      ${data4x4[0].score}      ${data4x4[0].time}`;
            localStorage.setItem("n1_4x4", data4x4[0].name);
            localStorage.setItem("s1_4x4", data4x4[0].score);
            localStorage.setItem("t1_4x4", data4x4[0].time);
            if (data4x4[1]) {
                document.querySelector(".s4x4").innerText = `${data4x4[1].name}      ${data4x4[1].score}      ${data4x4[1].time}`;
                localStorage.setItem("n2_4x4", data4x4[1].name);
                localStorage.setItem("s2_4x4", data4x4[1].score);
                localStorage.setItem("t2_4x4", data4x4[1].time);
            }
            if (data4x4[2]) {
                document.querySelector(".b4x4").innerText = `${data4x4[2].name}      ${data4x4[2].score}      ${data4x4[2].time}`;
                localStorage.setItem("n3_4x4", data4x4[2].name);
                localStorage.setItem("s3_4x4", data4x4[2].score);
                localStorage.setItem("t3_4x4", data4x4[2].time);
            }
        }
        else if (clickedsize.innerText === "5x5"){
            let username = document.getElementById("username").value;
            if (username === ""){
                username = "No name";
            }
            const totaltime = document.getElementById("time").innerText;
            data5x5.push({
                name: username,
                score: parseInt(score),
                time: totaltime
            });
            data5x5.sort((a, b) => b.score - a.score);
            document.querySelector(".g5x5").innerText = `${data5x5[0].name}      ${data5x5[0].score}      ${data5x5[0].time}`;
            localStorage.setItem("n1_5x5", data5x5[0].name);
            localStorage.setItem("s1_5x5", data5x5[0].score);
            localStorage.setItem("t1_5x5", data5x5[0].time);
            if (data5x5[1]) {
                document.querySelector(".s5x5").innerText = `${data5x5[1].name}      ${data5x5[1].score}      ${data5x5[1].time}`;
                localStorage.setItem("n2_5x5", data5x5[1].name);
                localStorage.setItem("s2_5x5", data5x5[1].score);
                localStorage.setItem("t2_5x5", data5x5[1].time);
            }
            if (data5x5[2]) {
                document.querySelector(".b5x5").innerText = `${data5x5[2].name}      ${data5x5[2].score}      ${data5x5[2].time}`;
                localStorage.setItem("n3_5x5", data5x5[2].name);
                localStorage.setItem("s3_5x5", data5x5[2].score);
                localStorage.setItem("t3_5x5", data5x5[2].time);
            }
        }
        time = 0;
        StopTime();
    }
    console.log(names3);    
})

function SlideLeft(){
    let boardChanged = false;
    for (let r = 0; r < rows; r++){
        let row = board[r]
        let crow = [...row];
        row = Slide(row);
        board[r] = row

        for (let c = 0; c < cols; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            UpdateTile(tile, num);
        }
        if (JSON.stringify(crow) !== JSON.stringify(row)) {
            boardChanged = true;
            nomove = 0;
            left = 0;
            right = 0;
            up = 0;
            down = 0;
        }
        if (left === 0){
            nomove += 1;
        }
        left = 1;
    }
    if (boardChanged) {
        SetTwo();
    }
}
function SlideRight(){
    let boardChanged = false;
    for (let r = 0; r < rows; r++){
        let row = board[r];
        let crow = [...row];
        row.reverse();
        row = Slide(row);
        row.reverse();
        board[r] = row

        for (let c = 0; c < cols; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            UpdateTile(tile, num);
        }
        if (JSON.stringify(crow) !== JSON.stringify(row)) {
            boardChanged = true;
            nomove = 0;
            left = 0;
            right = 0;
            up = 0;
            down = 0;
        }
        if (right === 0){
            nomove += 1;
        }
        right = 1;
    }
    if (boardChanged) {
        SetTwo();
    }
}
function SlideUp(){
    let boardChanged = false;
    let crow;
    let row;
    for (let c = 0; c < cols; c++){
        if (rows === 3){
            row = [board[0][c], board[1][c], board[2][c]]
            crow = [...row];
            row = Slide(row);
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        else if(rows === 4){
            row = [board[0][c], board[1][c], board[2][c], board[3][c]]
            crow = [...row];
            row = Slide(row);
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        else if(rows === 5){
            row = [board[0][c], board[1][c], board[2][c], board[3][c], board[4][c]]
            crow = [...row];
            row = Slide(row);
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        

        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            UpdateTile(tile, num);
        }
        if (JSON.stringify(crow) !== JSON.stringify(row)) {
            boardChanged = true;
            nomove = 0;
            left = 0;
            right = 0;
            up = 0;
            down = 0;
        }
        if (up === 0){
            nomove += 1;
        }
        up = 1;
    }
    if (boardChanged) {
        SetTwo();
    }
}
function SlideDown(){
    let boardChanged = false;
    let crow;
    let row;
    for (let c = 0; c < cols; c++){
        if (rows === 3){
            row = [board[0][c], board[1][c], board[2][c]]
            crow = [...row];
            row.reverse();
            row = Slide(row);
            row.reverse();
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        else if(rows === 4){
            row = [board[0][c], board[1][c], board[2][c], board[3][c]]
            crow = [...row];
            row.reverse();
            row = Slide(row);
            row.reverse();
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        else if(rows === 5){
            row = [board[0][c], board[1][c], board[2][c], board[3][c], board[4][c]]
            crow = [...row];
            row.reverse();
            row = Slide(row);
            row.reverse();
            for(let i = 0; i < rows; i++){
                board[i][c] = row[i];
            }
        }
        for (let r = 0; r < rows; r++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            UpdateTile(tile, num);
        }
        if (JSON.stringify(crow) !== JSON.stringify(row)) {
            boardChanged = true;
            nomove = 0;
            left = 0;
            right = 0;
            up = 0;
            down = 0;
        }
        if (down === 0){
            nomove += 1;
        }
        down = 1;
    }
    if (boardChanged) {
        SetTwo();
    }
}
function Slide(row){
    let crow = row;
    row = FilterZero(row)
    for (let i = 0; i < row.length; i++){
        if (row[i] === row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
            document.getElementById("score").innerText = score;
        }
    }
    row = FilterZero(row);
    while (row.length < cols){
        row.push(0);
    }
    return row;
}

function FilterZero(row){
    return row.filter(num => num != 0);
}

function SetTwo(){
    if(!EmptyTile()){
        return;
    }

    let found = false;
    while (!found){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let n = [2, 4][Math.floor(Math.random() * 2)];
        if (board[r][c] === 0){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if(n === 2){
                board[r][c] = 2;
                tile.innerText = "2";
                tile.classList.add("x2");
                UpdateTile(tile, 2);
                found = true;
            }
            else if(n === 4){
                board[r][c] = 4;
                tile.innerText = "4";
                tile.classList.add("x4");
                UpdateTile(tile, 4);
                found = true;
            }
            
        }
    }
}

function EmptyTile(){
    for (let r = 0; r < rows; r++){
        for (let c = 0; c < cols; c++){
            if (board[r][c] === 0){
                return true;
            }
        }
    }
    return false;
}
function StartTime(){
    clearInterval(timerInterval); // reset if running
    startTime = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;

        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        document.getElementById("time").innerText =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;
    }, 10); 
}

function StopTime() {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = Date.now() - startTime;
}

function ResetTime() {
    StopTime();
    elapsedTime = 0;
    document.getElementById("time").innerText = "00:00:00";
}

function ClassicStyle(){
    Classic = 1;
    Roman = 0;
    Candy = 0;
    document.documentElement.style.setProperty('--x1', '#eee4da');
    document.documentElement.style.setProperty('--x2', '#ede0c8');
    document.documentElement.style.setProperty('--x3', '#f2b179');
    document.documentElement.style.setProperty('--x4', '#f59563');
    document.documentElement.style.setProperty('--x5', '#f67c5f');
    document.documentElement.style.setProperty('--x6', '#f65e3b');
    document.documentElement.style.setProperty('--x7', '#edcf72');
    document.documentElement.style.setProperty('--x8', '#edcc61');
    document.documentElement.style.setProperty('--x9', '#edc850');
    document.documentElement.style.setProperty('--x10', '#edc53f');
    document.documentElement.style.setProperty('--x11', '#edc22e');
    document.documentElement.style.setProperty('--x12', '#3c3a32');
    document.documentElement.style.setProperty('--x13', '#ff0000');
    document.documentElement.style.setProperty('--color1', '#bbada0');
    document.documentElement.style.setProperty('--font', '"Quicksand", sans-serif');
    document.documentElement.style.setProperty('--size', 'rgb(199, 206, 213)');
    document.documentElement.style.setProperty('--gold', '#FFD700');
    document.documentElement.style.setProperty('--silver', '#C0C0C0');
    document.documentElement.style.setProperty('--bronze', '#CD7F32');
    SetSize();
    SetGame();
}
function RomanStyle(){
    Roman = 1;
    Classic = 0;
    Candy = 0;
    document.documentElement.style.setProperty('--x1', 'linear-gradient(90deg, #FFD700, #FFFACD)');
    document.documentElement.style.setProperty('--x2', 'linear-gradient(90deg, #FFA500, #FFE5B4)');
    document.documentElement.style.setProperty('--x3', 'linear-gradient(90deg, #D2691E, #FFCC99)');
    document.documentElement.style.setProperty('--x4', 'linear-gradient(90deg, #B7410E, #FFB347)');
    document.documentElement.style.setProperty('--x5', 'linear-gradient(90deg, #B22222, #FF7F7F)');
    document.documentElement.style.setProperty('--x6', 'linear-gradient(90deg, #C71585, #FFB6C1)');
    document.documentElement.style.setProperty('--x7', 'linear-gradient(90deg, #800080, #D8BFD8)');
    document.documentElement.style.setProperty('--x8', 'linear-gradient(90deg, #4B0082, #BA55D3)');
    document.documentElement.style.setProperty('--x9', 'linear-gradient(90deg, #1E3F66, #87CEFA)');
    document.documentElement.style.setProperty('--x10', 'linear-gradient(90deg, #008080, #66CDAA)');
    document.documentElement.style.setProperty('--x11', 'linear-gradient(90deg, #556B2F, #A8E6A3)');
    document.documentElement.style.setProperty('--x12', 'linear-gradient(90deg, #9ACD32, #DAF7A6)');
    document.documentElement.style.setProperty('--x13', 'linear-gradient(135deg, #f0f8ff, #ff66cc, #ffd700, #7fff00, #00ffff, #8a2be2, #f0f8ff)');
    document.documentElement.style.setProperty('--color1', 'linear-gradient(135deg, #ffffff, #eeeeee, #cccccc, #eeeeee, #ffffff)');
    document.documentElement.style.setProperty('--font', '"Cinzel", serif');
    document.documentElement.style.setProperty('--size', 'linear-gradient(45deg, #d3d3d3, #a9a9a9, #808080, #d3d3d3)');
    document.documentElement.style.setProperty('--gold', 'linear-gradient(135deg, #fff8dc, #ffe680, #ffd700, #ffcc00, #e6b800, #ffd700, #fff8dc)');
    document.documentElement.style.setProperty('--silver', 'linear-gradient(135deg, #C0C0C0, #DCDCDC, #A9A9A9, #F5F5F5)');
    document.documentElement.style.setProperty('--bronze', 'linear-gradient(135deg, #CD7F32, #B87333, #8C5A2B, #CD7F32)');
    SetSize();
    SetGame();
}
function CandyStyle(){
    Candy = 1;
    Roman = 0;
    Classic = 0;
    document.documentElement.style.setProperty('--x1', '#FF5E78');
    document.documentElement.style.setProperty('--x2', '#FFD1DC');
    document.documentElement.style.setProperty('--x3', '#FF69B4');
    document.documentElement.style.setProperty('--x4', '#FFA07A');
    document.documentElement.style.setProperty('--x5', '#F08080');
    document.documentElement.style.setProperty('--x6', '#FFD700');
    document.documentElement.style.setProperty('--x7', '#FFFACD');
    document.documentElement.style.setProperty('--x8', '#98FB98');
    document.documentElement.style.setProperty('--x9', '#87CEFA');
    document.documentElement.style.setProperty('--x10', '#BA55D3');
    document.documentElement.style.setProperty('--x11', '#E6E6FA');
    document.documentElement.style.setProperty('--x12', '#40E0D0');
    document.documentElement.style.setProperty('--x13', '#FF8C00');    
    document.documentElement.style.setProperty('--color1', 'linear-gradient( 90deg, #FF5E78, #FFA94D, #FFE066, #C6F85F, #8FF798, #6DE7D6, #84C5FF, #9D87FF, #C38CFF, #FF9DE2, #FFA6B8, #FFD1B3)');
    document.documentElement.style.setProperty('--font', '"Emilys Candy", serif');
    document.documentElement.style.setProperty('--size', '#FF6F61');
    document.documentElement.style.setProperty('--gold', '#FFC371');
    document.documentElement.style.setProperty('--silver', '#E0E0E0');
    document.documentElement.style.setProperty('--bronze', '#D9A066');
    SetSize();
    SetGame();
}
function ButtonDisabler(){
    const styles = document.querySelectorAll(".texture");
    styles.forEach(button => {
        button.style.opacity = "0.5";
        button.style.pointerEvents = "none";
    })
    const sizes = document.querySelectorAll(".size");
    sizes.forEach(button => {
        button.style.opacity = "0.5";
        button.style.pointerEvents = "none";
    })
}

function ButtonEnabler(){
    const styles = document.querySelectorAll(".texture");
    styles.forEach(button => {
        button.style.opacity = "1";
        button.style.pointerEvents = "all";
    })
    const sizes = document.querySelectorAll(".size");
    sizes.forEach(button => {
        button.style.opacity = "1";
        button.style.pointerEvents = "all";
    })
}

function GetLocalStorageDetails(){
    if (localStorage.getItem("n1_3x3")){
        document.querySelector(".g3x3").innerText = localStorage.getItem("n1_3x3") + "      " + localStorage.getItem("s1_3x3") + "      " + localStorage.getItem("t1_3x3");
    }    
    if (localStorage.getItem("n2_3x3")){
        document.querySelector(".s3x3").innerText = localStorage.getItem("n2_3x3") + "      " + localStorage.getItem("s2_3x3") + "      " + localStorage.getItem("t2_3x3");
    }
    if (localStorage.getItem("n3_3x3")){
        document.querySelector(".b3x3").innerText = localStorage.getItem("n3_3x3") + "      " + localStorage.getItem("s3_3x3") + "      " + localStorage.getItem("t3_3x3");
    }
    if (localStorage.getItem("n1_4x4")){
        document.querySelector(".g4x4").innerText = localStorage.getItem("n1_4x4") + "      " + localStorage.getItem("s1_4x4") + "      " + localStorage.getItem("t1_4x4");
    }    
    if (localStorage.getItem("n2_4x4")){
        document.querySelector(".s4x4").innerText = localStorage.getItem("n2_4x4") + "      " + localStorage.getItem("s2_4x4") + "      " + localStorage.getItem("t2_4x4");
    }
    if (localStorage.getItem("n3_4x4")){
        document.querySelector(".b4x4").innerText = localStorage.getItem("n3_4x4") + "      " + localStorage.getItem("s3_4x4") + "      " + localStorage.getItem("t3_4x4");
    }
    if (localStorage.getItem("n1_5x5")){
        document.querySelector(".g5x5").innerText = localStorage.getItem("n1_5x5") + "      " + localStorage.getItem("s1_5x5") + "      " + localStorage.getItem("t1_5x5");
    }    
    if (localStorage.getItem("n2_5x5")){
        document.querySelector(".s5x5").innerText = localStorage.getItem("n2_5x5") + "      " + localStorage.getItem("s2_5x5") + "      " + localStorage.getItem("t2_5x5");
    }
    if (localStorage.getItem("n3_5x5")){
        document.querySelector(".b5x5").innerText = localStorage.getItem("n3_5x5") + "      " + localStorage.getItem("s3_5x5") + "      " + localStorage.getItem("t3_5x5");
    }
    GetLocalStorageDetails2();
}
function GetLocalStorageDetails2(){
    if(localStorage.getItem("n1_3x3")){
        data3x3.push({
            name: localStorage.getItem("n1_3x3"),
            score: localStorage.getItem("s1_3x3"),
            time: localStorage.getItem("t1_3x3")
        })
    }
    if(localStorage.getItem("n2_3x3")){
        data3x3.push({
            name: localStorage.getItem("n2_3x3"),
            score: localStorage.getItem("s2_3x3"),
            time: localStorage.getItem("t2_3x3")
        })
    }
    if(localStorage.getItem("n3_3x3")){
        data3x3.push({
            name: localStorage.getItem("n3_3x3"),
            score: localStorage.getItem("s3_3x3"),
            time: localStorage.getItem("t3_3x3")
        })
    }
    if(localStorage.getItem("n1_4x4")){
        data4x4.push({
            name: localStorage.getItem("n1_4x4"),
            score: localStorage.getItem("s1_4x4"),
            time: localStorage.getItem("t1_4x4")
        })
    }
    if(localStorage.getItem("n2_4x4")){
        data4x4.push({
            name: localStorage.getItem("n2_4x4"),
            score: localStorage.getItem("s2_4x4"),
            time: localStorage.getItem("t2_4x4")
        })
    }
    if(localStorage.getItem("n3_4x4")){
        data4x4.push({
            name: localStorage.getItem("n3_4x4"),
            score: localStorage.getItem("s3_4x4"),
            time: localStorage.getItem("t3_4x4")
        })
    }
    if(localStorage.getItem("n1_5x5")){
        data5x5.push({
            name: localStorage.getItem("n1_5x5"),
            score: localStorage.getItem("s1_5x5"),
            time: localStorage.getItem("t1_5x5")
        })
    }
    if(localStorage.getItem("n2_5x5")){
        data5x5.push({
            name: localStorage.getItem("n2_5x5"),
            score: localStorage.getItem("s2_5x5"),
            time: localStorage.getItem("t2_5x5")
        })
    }
    if(localStorage.getItem("n3_5x5")){
        data5x5.push({
            name: localStorage.getItem("n3_5x5"),
            score: localStorage.getItem("s3_5x5"),
            time: localStorage.getItem("t3_5x5")
        })
    }
}