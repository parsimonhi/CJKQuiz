cjkq={}
cjkq.copyright="<a href='https://github.com/parsimonhi/CJKQuiz'>CJKQuiz</a>";
cjkq.copyright+=" Copyright 2015-2022 FM&SH";
cjkq.history=[]; // saves bandwidth and useful if the server is temporarily　unreachable
cjkq.i18n=
{
	"Game over!":{fr:"Terminé !"},
	"Level: ":{fr:"Niveau : "},
	"Answers: ":{fr:"Réponses : "},
	"Score: ":{fr:"Note : "},
	"Errors: ":{fr:"Erreurs : "},
	"Result":{fr:"Résultat"},
	"Expired time!":{fr:"Temps expiré !"},
	"Server unreachable!":{fr:"Serveur inaccessible !"},
	"Data not available!":{fr:"Données non disponibles !"}
};
cjkq.instructions={};
cjkq.instructions.en="Select a character, its prononciation and its meaning.";
cjkq.instructions.fr="Sélectionnez un caractère, sa prononciation et sa signification.";
cjkq.js=document.scripts[document.scripts.length-1]; // current js script
cjkq.deplonk=function()
{
	let tiles=document.querySelectorAll(".plonk");
	Array.from(tiles).forEach(e => {e.classList.remove("plonk");});
};
cjkq.plonk=function()
{
	setTimeout(cjkq.deplonk,100);
	cjkq.selected.character.classList.add("plonk");
	cjkq.selected.transcription.classList.add("plonk");
	cjkq.selected.translation.classList.add("plonk");
};
cjkq.getStore=function()
{
	return JSON.parse(localStorage.getItem('cjkq'));
};
cjkq.setStore=function(p)
{
	localStorage.setItem('cjkq',JSON.stringify(p));
};
cjkq.getParamFromStore=function(a)
{
	let p=JSON.parse(localStorage.getItem('cjkq'));
	return p[a];
};
cjkq.setParamToStore=function(a,v)
{
	let p=JSON.parse(localStorage.getItem('cjkq'));
	p[a]=v;
	localStorage.setItem('cjkq',JSON.stringify(p));
};
cjkq.getI18n=function(s)
{
	// return a translation of s in cjkq.params.targetLang if it exists
	// else return s
	if(cjkq.i18n[s]&&cjkq.i18n[s][cjkq.params.targetLang])
		return cjkq.i18n[s][cjkq.params.targetLang];
	return s;
};
cjkq.shuffle=function(a)
{
	for (let i=a.length-1; i>0;i--)
	{
		let j=Math.floor(Math.random()*(i+1));
		let z=a[i];
		a[i]=a[j];
		a[j]=z;
	}
	return a;
};
cjkq.getDataOrder=function()
{
	if(cjkq.params.tileOrder.match(/^( ?(character|transcription|translation)){3}$/))
		return cjkq.params.tileOrder.split(" ");
	else return ["character","transcription","translation"];
};
cjkq.getSome=function(a)
{
	let b=[],c=[],d=[],k,kmax=a.length,dataOrder;
	let s={character:[],transcription:[],translation:[]};
	cjkq.numOfChars=cjkq.params.numOfChars?parseInt(cjkq.params.numOfChars+"",10):10;
	if(cjkq.numOfChars>kmax) cjkq.numOfChars=kmax;
	cjkq.timePerChar=cjkq.params.timePerChar?parseInt(cjkq.params.timePerChar+"",10):10;
	cjkq.ijmax=cjkq.numOfChars*3;
	cjkq.initialTime=cjkq.numOfChars*cjkq.timePerChar;
	for(k=0;k<kmax;k++) b[k]=a[k]; // otherwise a could be modified?
	for(k=0;k<cjkq.numOfChars;k++)
	{
		let n,z;
		z=Math.floor(Math.random()*b.length);
		c[k]=b[z];
		n=(cjkq.params.targetLang=="fr")?3:2;
		c[k][n]=c[k][n].charAt(0).toUpperCase()+c[k][n].slice(1);
		b.splice(z,1);
	}
	cjkq.chars=c;
	dataOrder=cjkq.getDataOrder();
	for(k=0;k<cjkq.numOfChars;k++)
	{
		
		s.character[k]=[k,c[k][0],"character",c[k][4]?c[k][4]:null];
		s.transcription[k]=[k,c[k][1],"transcription"];
		s.translation[k]=[k,c[k][(cjkq.params.targetLang=="fr")?3:2],"translation"];
	}
	if(cjkq.params.tileOrder!="shuffled")
	{
		s.character=cjkq.shuffle(s.character);
		s.transcription=cjkq.shuffle(s.transcription);
		s.translation=cjkq.shuffle(s.translation);
	}
	for(k=0;k<cjkq.numOfChars;k++)
	{
		d[k*3]=s[dataOrder[0]][k];
		d[k*3+1]=s[dataOrder[1]][k];
		d[k*3+2]=s[dataOrder[2]][k];
	}
	if(cjkq.params.tileOrder=="shuffled") return cjkq.shuffle(d);
	return d;
};
cjkq.show=function()
{
	document.querySelector(".cjkq .time").innerHTML=cjkq.time;
	document.querySelector(".cjkq .level").innerHTML=cjkq.getI18n("Level: ")+cjkq.dicoName;
	document.querySelector(".cjkq .answers").innerHTML=cjkq.getI18n("Answers: ")+cjkq.answers;
	document.querySelector(".cjkq .errors").innerHTML=cjkq.getI18n("Errors: ")+cjkq.errors;
	document.querySelector(".cjkq .score").innerHTML=cjkq.getI18n("Score: ")+cjkq.compute();
};
cjkq.cleanNumbers=function()
{
	let x,y,z,e,a;
	x=-(-cjkq.selected.character.getAttribute("data-k"));
	y=-(-cjkq.selected.transcription.getAttribute("data-k"));
	z=-(-cjkq.selected.translation.getAttribute("data-k"));
	// when several tiles have the same value, make an appropriate permutation on data-k
	if(x!=y)
	{
		e=document.querySelector("[data-t='transcription'][data-k='"+x+"']");
		if(e)
		{
			cjkq.selected.transcription.setAttribute("data-k",x);
			e.setAttribute("data-k",y);
		}
	}
	if(x!=z)
	{
		e=document.querySelector("[data-t='translation'][data-k='"+x+"']");
		if(e)
		{
			cjkq.selected.translation.setAttribute("data-k",x);
			e.setAttribute("data-k",z);
		}
	}
	// set data-k of the guessed character to cjkq.answers-1
	a=cjkq.answers-1;
	if(x!=a)
	{
		let e1,e2,e3;
		e1=document.querySelector("[data-t='character'][data-k='"+a+"']");
		e2=document.querySelector("[data-t='transcription'][data-k='"+a+"']");
		e3=document.querySelector("[data-t='translation'][data-k='"+a+"']");
		if(e1&&e2&&e3)
		{
			cjkq.selected.character.setAttribute("data-k",a);
			e1.setAttribute("data-k",x);
			cjkq.selected.transcription.setAttribute("data-k",a);
			e2.setAttribute("data-k",x);
			cjkq.selected.translation.setAttribute("data-k",a);
			e3.setAttribute("data-k",x);
		}
	}
};
cjkq.doIt=function(ev)
{
	let e1=ev.target;
	if(e1)
	{
		if(e1.tagName.toUpperCase()=="SPAN") e1=e1.parentNode;
		if(cjkq.stopped) cjkq.restart();
		if(!e1.classList.contains("good"))
		{
			let kind=e1.getAttribute("data-t"),e2=cjkq.selected[kind];
			if(e2)
			{
				e2.classList.remove("selected");
				cjkq.selected[kind]=null;
			}
			
			if(e1!=e2)
			{
				e1.classList.add("selected");
				cjkq.selected[kind]=e1;
			}
			if(cjkq.selected.character&&cjkq.selected.transcription&&cjkq.selected.translation)
			{
				let a,b,c,k,km,f="bad";
				a=cjkq.selected.character.getAttribute("data-c");
				b=cjkq.selected.transcription.getAttribute("data-c");
				c=cjkq.selected.translation.getAttribute("data-c");
				km=cjkq.chars.length;
				for(k=0;k<km;k++)
				{
					if((a==cjkq.chars[k][0])
						&&(b==cjkq.chars[k][1])
						&&(c==cjkq.chars[k][(cjkq.params.targetLang=="fr")?3:2]))
					{
						f="good";
						cjkq.answers+=1;
						cjkq.cleanNumbers();
						break;
					}
				}
				cjkq.selected.character.classList.remove("selected");
				cjkq.selected.transcription.classList.remove("selected");
				cjkq.selected.translation.classList.remove("selected");
				if(f=="good")
				{
					cjkq.selected.character.classList.add(f);
					cjkq.selected.transcription.classList.add(f);
					cjkq.selected.translation.classList.add(f);
				}
				else
				{
					cjkq.errors+=1;
					cjkq.plonk();
				}
				cjkq.selected={character:null,transcription:null,translation:null};
				cjkq.show();
				if(cjkq.answers>=cjkq.numOfChars)
				{
					let s,title;
					cjkq.stopped=1;
					cjkq.finalCut();
					s=cjkq.getI18n("Game over!")+"<br>";
					s+=cjkq.getI18n("Score: ")+cjkq.compute();
					title=cjkq.getI18n("Result");
					cjkq.alert(s,title,"good");
				}
			}
		}
	}
};
cjkq.makePad=function(dico)
{
	let ij,s="",d=cjkq.getSome(dico);
	s+="<div class='instructions'>"+cjkq.instructions[cjkq.params.targetLang]+"</div>";
	s+="<div class='time'></div>";
	s+="<div class='pad'>";
	for(ij=0;ij<cjkq.ijmax;ij++)
	{
		let x=d[ij];
		if(x)
		{
			let v=((x[2]=="character")&&x[3])?x[3]:null;
			let l=(x[2]=="character")?cjkq.params.sourceLang:null;
			s+="<button class='tile' onclick='cjkq.doIt(event)'";
			s+=(l?" lang='"+l+"'":"");
			s+=" data-t='"+x[2]+"' data-c='"+x[1]+"' data-k='"+x[0]+"'>";
			s+="<span";
			if(x[2]=="character") s+=(v?" data-v='"+v+"'":"");
			s+=">";
			s+=x[1];
			s+="</span>";
			s+="</button>";
		}
		else s+="<div class='tile'></div>";
	}
	s+="</div>";
	s+="<div class='level'></div>";
	s+="<div class='answers'></div>";
	s+="<div class='errors'></div>";
	s+="<div class='score'></div>";
	s+="<em>"+cjkq.copyright+"</em>";
	return s;
};
cjkq.addPad=function(s)
{
	let e,p;
	e=document.querySelector(".cjkq");
	e.innerHTML=s;
	cjkq.stopped=0;
	cjkq.time=cjkq.initialTime;
	cjkq.answers=0;
	cjkq.errors=0;
	cjkq.show();
	cjkq.timer=setInterval(cjkq.refreshAll,1000);
	cjkq.js.parentNode.scrollIntoView();
};
cjkq.addSomeSolution=function(cls)
{
	// cls: class of items we want to keep (i.e. "bad", "good", etc.)
	var k,data=[],list1=[],list2=[],i=0,kmax,tiles;
	tiles=document.querySelectorAll(".cjkq .tile");
	kmax=tiles.length;
	// get number from data-k attribute
	for (k=0;k<kmax;k++)
		if (tiles[k].classList.contains(cls))
			data[k]=[k,tiles[k].getAttribute("data-k")];
	// rearrange
	for (k=0;k<kmax;k++)
	{
		if (tiles[k].classList.contains(cls))
		{
			if (list1.indexOf(data[k][1])<0)
			{
				i++;
				list1[i]=data[k][1];
				list2[data[k][1]]=i;
			}
			data[k][2]=list2[data[k][1]];
		}
	}
	// add number as span
	for (k=0;k<kmax;k++)
		if (tiles[k].classList.contains(cls))
			tiles[k].innerHTML+="<span class=\"solution\">"+data[k][2]+"</span>";
}
cjkq.addSolution=function()
{
	var k,kmax,tiles;
	tiles=document.querySelectorAll(".cjkq .tile");
	kmax=tiles.length;
	for (k=0;k<kmax;k++)
		if (tiles[k].classList.contains("bad")||tiles[k].classList.contains("good"))
			tiles[k].innerHTML+="<span class=\"solution\">"
				+(parseInt(tiles[k].getAttribute("data-k"),10)+1)
				+"</span>";
};
cjkq.reorder=function()
{
	var e,k,kmax,goodChars=[],badChars=[],otherChars=[],allChars;
	kmax=cjkq.params.numOfChars;
	for(k=0;k<cjkq.params.numOfChars;k++)
	{
		e=document.querySelector(".cjkq .tile[data-k='"+k+"'][data-t='character']");
		if(e.classList.contains("good")) goodChars.push(k);
		else if(e.classList.contains("bad")) badChars.push(k);
		else otherChars.push(k);
	}
	allChars=goodChars.concat(badChars).concat(otherChars);
	dataOrder=cjkq.getDataOrder();
	for(k=0;k<cjkq.params.numOfChars;k++)
	{
		e=document.querySelector(".cjkq .tile[data-k='"+allChars[k]+"'][data-t='"+dataOrder[0]+"']");
		e.style.order=k*3;
		e=document.querySelector(".cjkq .tile[data-k='"+allChars[k]+"'][data-t='"+dataOrder[1]+"']");
		e.style.order=k*3+1;
		e=document.querySelector(".cjkq .tile[data-k='"+allChars[k]+"'][data-t='"+dataOrder[2]+"']");
		e.style.order=k*3+2;
	}
	cjkq.reordered=1;
};
cjkq.unorder=function()
{
	var k,kmax,tiles;
	tiles=document.querySelectorAll(".cjkq .tile");
	kmax=tiles.length;
	for (k=0;k<kmax;k++)
	{
		tiles[k].style.order=0;
	}
	cjkq.reordered=0;
};
cjkq.finalCut=function()
{
	let tiles=document.querySelectorAll(".cjkq .tile");
	Array.from(tiles).forEach(e =>
		{
			if(e.innerHTML&&!e.classList.contains("good")) e.classList.add("bad");
			e.disabled=true;
		});
	if(cjkq.params.addSolutionAtEnd=="1")
		cjkq.addSolution();
	if(cjkq.params.reorderAtEnd=="1")
		cjkq.reorder();
};
cjkq.alert=function(m,title="CJKQuiz",cls="neutral")
{
	var e;
	e=document.querySelector(".cjkq .alertDialog");
	if(!e)
	{
		let s="",a,b,c;
		e=document.createElement('dialog');
		e.classList.add("alertDialog");
		e.classList.add(cls);
		s+="<h1>"+title+"</h1>";
		s+="<form method='dialog'>";
		s+="<p class='message'>"+m+"</p>";
		s+="<button value='OK'>OK</button>";
		s+="</form>";
		e.innerHTML=s;
		document.querySelector(".cjkq").appendChild(e);
	}
	e.querySelector('.message').innerHTML=m;
	e.showModal();
}
cjkq.compute=function()
{
	return Math.round((20/(2*cjkq.numOfChars))*Math.max(0,(cjkq.answers*2-cjkq.errors)))+"/20";
};
cjkq.refreshAll=function()
{
	if(cjkq.stopped) {clearInterval(cjkq.timer);cjkq.timer=0;return;}
	cjkq.time--;
	cjkq.show();
	if(cjkq.time<=0)
	{
		let s,title;
		cjkq.stopped=1;
		cjkq.finalCut();
		s=cjkq.getI18n("Expired time!")+"<br>";
		s+=cjkq.getI18n("Score: ")+cjkq.compute();
		title=cjkq.getI18n("Result");
		cjkq.alert(s,title,"bad");
	}
};
cjkq.init=function(dicoName)
{
	let e;
	cjkq.params=cjkq.getStore();
	cjkq.selected={character:null,transcription:null,translation:null};
	if(dicoName)
	{
		cjkq.params[cjkq.params.sourceLang+"DicoName"]=dicoName;
		cjkq.setStore(cjkq.params);
	}
	cjkq.dicoName=cjkq.params[cjkq.params.sourceLang+"DicoName"];
	if(cjkq.timer) clearInterval(cjkq.timer);
	cjkq.timer=0;
	cjkq.reordered=0;
	e=document.querySelector(".cjkq");
	if(e) e.innerHTML="";
	else
	{
		e=document.createElement("div");
		cjkq.js.parentNode.insertBefore(e,cjkq.js.nextSibling);
	}
	e.classList.remove(...e.classList);
	e.classList.add("cjkq");
	e.classList.add(cjkq.params.displayMode);
};
cjkq.getFromHistory=function(dicoName)
{
	for(let k=0;k<cjkq.history.length;k++)
		if(cjkq.history[k].dicoName==dicoName) return cjkq.history[k].data;
	return null;
};
cjkq.start=function(dicoName)
{
	let d;
	cjkq.init(dicoName);
	if(d=cjkq.getFromHistory(dicoName)) cjkq.addPad(cjkq.makePad(d));
	else
		fetch("_json/"+cjkq.dicoName+".json")
		.then(r=>
			{
				if(!r.ok) throw r.statusText;
				return r.json();
			}
		)
		.then(r=>
			{
				if(r)
				{
					cjkq.history.push({dicoName:cjkq.dicoName,data:r});
					cjkq.addPad(cjkq.makePad(r));
					return true;
				}
				else
				{
					cjkq.alert(cjkq.getI18n("Data not available!"));
					return false;
				}
			}
		)
		.catch(error =>
		{
			cjkq.alert(cjkq.getI18n("Server unreachable!"));
			console.log("failed to get "+cjkq.dicoName+" json file!");
			return false;
		});
};
cjkq.stop=function()
{
	cjkq.stopped=1;
};
cjkq.restart=function()
{
	if(cjkq.stopped)
	{
		cjkq.stopped=0;
		cjkq.timer=setInterval(cjkq.refreshAll,1000);
	}
};
cjkq.checkStore=function()
{
	let p=cjkq.getStore();
	if(!p) p={};
	if(!p.numOfChars) p.numOfChars="10";
	if(!p.timePerChar) p.timePerChar="10";
	if(!p.displayMode) p.displayMode="dark";
	if(!p.tileOrder) p.tileOrder="shuffled";
	if(!p.reorderAtEnd) p.reorderAtEnd="1";
	if(!p.addSolutionAtEnd) p.addSolutionAtEnd="0";
	if(!p.sourceLang) p.sourceLang="ja";
	if(!p.targetLang) p.targetLang="en";
	if(!p.jaDicoName) p.jaDicoName="G1";
	if(!p.zhDicoName) p.zhDicoName="NHSK1";
	cjkq.setStore(p);
};
cjkq.checkStore();
