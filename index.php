<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="_css/style.css" rel="stylesheet" type="text/css">
<link href="_css/cjkquiz.css" rel="stylesheet" type="text/css">
<title>CJKQuiz</title>
<style>
</style>
<script>
function setZh()
{
	var k,kmax,p;
	var listJa=document.querySelectorAll(".selector.ja");
	var listZh=document.querySelectorAll(".selector.zh");
	var flagJa=document.querySelector(".flag.ja");
	var flagZh=document.querySelector(".flag.zh");
	kmax=listZh.length;
	for(k=0;k<kmax;k++) listZh[k].style.display="block";
	kmax=listJa.length;
	for(k=0;k<kmax;k++) listJa[k].style.display="none";
	p=JSON.parse(localStorage.getItem('cjkq'));
	p.sourceLang="zh";
	flagJa.style.display="none";
	flagZh.style.display="inline-block";
	localStorage.setItem('cjkq',JSON.stringify(p));
}
function setJa()
{
	var k,kmax,p;
	var listJa=document.querySelectorAll(".selector.ja");
	var listZh=document.querySelectorAll(".selector.zh");
	var flagJa=document.querySelector(".flag.ja");
	var flagZh=document.querySelector(".flag.zh");
	kmax=listZh.length;
	for(k=0;k<kmax;k++) listZh[k].style.display="none";
	kmax=listJa.length;
	for(k=0;k<kmax;k++) listJa[k].style.display="block";
	p=JSON.parse(localStorage.getItem('cjkq'));
	p.sourceLang="ja";
	flagJa.style.display="inline-block";
	flagZh.style.display="none";
	localStorage.setItem('cjkq',JSON.stringify(p));
}
function setEn()
{
	var p;
	var flagEn=document.querySelector(".flag.en");
	var flagFr=document.querySelector(".flag.fr");
	p=JSON.parse(localStorage.getItem('cjkq'));
	p.targetLang="en";
	localStorage.setItem('cjkq',JSON.stringify(p));
	flagEn.style.display="inline-block";
	flagFr.style.display="none";
}
function setFr()
{
	var p;
	var flagEn=document.querySelector(".flag.en");
	var flagFr=document.querySelector(".flag.fr");
	p=JSON.parse(localStorage.getItem('cjkq'));
	p.targetLang="fr";
	localStorage.setItem('cjkq',JSON.stringify(p));
	flagEn.style.display="none";
	flagFr.style.display="inline-block";
}
function OKSettings()
{
	var e=document.querySelector(".selector .dialog"),p;
	p=JSON.parse(localStorage.getItem('cjkq'));
	p.kmax=e.querySelector('.numOfChars').value;
	p.timePerChar=e.querySelector('.timePerChar').value;
	localStorage.setItem('cjkq',JSON.stringify(p));
	if(e) e.parentNode.removeChild(e);
	cjkq.start('');
}
function cancelSettings()
{
	var e=document.querySelector(".selector .dialog");
	if(e) e.parentNode.removeChild(e);
}
function doSettings()
{
	var s,e,p,a,b;
	e=document.querySelector(".selector .dialog");
	if(e) {e.parentNode.removeChild(e);return;}
	s="<div class='dialog'>";
	s+="<h1>CJKQuiz</h1>";
	a=((cjkq.params.targetLang=="fr")?"Nombre de caractères :":"Number of chars:");
	s+="<label><span>"+a+"</span><input class='numOfChars' type='number' min='1' max='30' value='"+cjkq.kmax+"'></label>";
	b=((cjkq.params.targetLang=="fr")?"Temps par caractère :":"Time per char:");
	s+="<label><span>"+b+"</span><input class='timePerChar' type='number' min='1' max='30' value='"+cjkq.timePerChar+"'></label>";
	s+="<button onclick='OKSettings()'>OK</button>";
	s+="<button onclick='cancelSettings()'>"+((cjkq.params.targetLang=="fr")?"Annuler":"Cancel")+"</button>";
	s+="</div>";
	e=document.createElement('div');
	e.innerHTML=s;
	p=document.querySelector(".selector");
	p.appendChild(e);
}
</script>
</head>
<body>
<main>
<ul class="selector">
<li class="flag zh"><img onclick="setJa();cjkq.start('');" alt="中国国旗" src="_img/chn23.svg" width="48" height="32"></li>
<li class="flag ja"><img onclick="setZh();cjkq.start('');" alt="日本の国旗" src="_img/jap23.svg" width="48" height="32"></li>
<li class="icon"><img onclick="doSettings();" alt="Settings" src="_img/settings.svg" width="32" height="32"></li>
<li class="flag en"><img onclick="setFr();cjkq.start('');" alt="British flag" src="_img/gbr23.svg" width="48" height="32"></li>
<li class="flag fr"><img onclick="setEn();cjkq.start('');" alt="Drapeau français" src="_img/fra23.svg" width="48" height="32"></li>
</ul>
<ul class="selector ja">
	<li><button onclick="cjkq.start('G1');">1</button></li>
	<li><button onclick="cjkq.start('G2');">2</button></li>
	<li><button onclick="cjkq.start('G3');">3</button></li>
	<li><button onclick="cjkq.start('G4');">4</button></li>
	<li><button onclick="cjkq.start('G5');">5</button></li>
	<li><button onclick="cjkq.start('G6');">6</button></li>
	<li><button onclick="cjkq.start('G7');">7</button></li>
	<li><button onclick="cjkq.start('G8');">8</button></li>
</ul>
<!--
<ul class="selector zh">
	<li><button onclick="cjkq.start('HSK1');">HSK1</button></li>
	<li><button onclick="cjkq.start('HSK2');">HSK2</button></li>
	<li><button onclick="cjkq.start('HSK3');">HSK3</button></li>
	<li><button onclick="cjkq.start('HSK4');">HSK4</button></li>
	<li><button onclick="cjkq.start('HSK5');">HSK5</button></li>
	<li><button onclick="cjkq.start('HSK6');">HSK6</button></li>
</ul>
-->
<ul class="selector zh">
	<li><button onclick="cjkq.start('NHSK1');">1</button></li>
	<li><button onclick="cjkq.start('NHSK2');">2</button></li>
	<li><button onclick="cjkq.start('NHSK3');">3</button></li>
	<li><button onclick="cjkq.start('NHSK4');">4</button></li>
	<li><button onclick="cjkq.start('NHSK5');">5</button></li>
	<li><button onclick="cjkq.start('NHSK6');">6</button></li>
	<li><button onclick="cjkq.start('NHSK7');">7</button></li>
	<li><button onclick="cjkq.start('NHSK8');">8</button></li>
	<li><button onclick="cjkq.start('NHSK9');">9</button></li>
</ul>
<script src="cjkquiz.js"></script>
<script>
window.addEventListener("load",function()
	{
		let p=JSON.parse(localStorage.getItem('cjkq'));
		if(p.sourceLang=="zh") setZh();
		else setJa();
		if(p.targetLang=="En") setEn();
		else setFr();
		cjkq.start();
	}
);
</script>
</main>
</body>
</html>