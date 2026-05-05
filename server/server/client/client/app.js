const socket = io("PUT-LINK-HERE");

let code="";

function createRoom(){
  socket.emit("createRoom", name.value);
}

function joinRoom(){
  code = codeInput.value;
  socket.emit("joinRoom",{code,name:name.value});
  socket.emit("getQ",code);
}

socket.on("room",c=>{
  code=c;
  socket.emit("getQ",c);
});

socket.on("q",q=>{
  const div=document.getElementById("q");
  div.innerHTML=`<h2>${q.text}</h2>`;

  q.answers.forEach(a=>{
    const b=document.createElement("button");
    b.innerText=a.text;

    b.onclick=()=>{
      socket.emit("ans",{code,correct:a.correct});
    };

    div.appendChild(b);
  });
});

socket.on("players",ps=>{
  p.innerHTML=ps.map(x=>`<p>${x.name} ${x.score}</p>`).join("");
});
