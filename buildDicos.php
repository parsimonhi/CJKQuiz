<?php
function getTranscription($entry,$trans)
{
	global $xml2;
	$transList="";
	if ($trans=="kana")
	{
		// build kana transcriptions
		$transList1="";
		if (property_exists($entry,"音読み"))
		{
			foreach($entry->{"音読み"} as $a)
			{
				if ($transList1) $transList1.=", ";
				$transList1.=$a;
			}
		}
		$transList2="";
		if (property_exists($entry,"訓読み"))
		{
			foreach($entry->{"訓読み"} as $a)
			{
				if ($transList2) $transList2.=", ";
				$transList2.=$a;
			}
		}
		$transList.=$transList1;
		if ($transList1&&$transList2) $transList.="<br>";
		$transList.=$transList2;
		$transList=str_replace("（","(",$transList);
		$transList=str_replace("）",")",$transList);
	}
	else if (property_exists($entry,$trans))
	{
		// build pinyin transcription
		$transList=$entry->{$trans}."";
	}
	return $transList;
}
function getTranslation($entry,$userLang,$language,$otherLanguage)
{
	// build translation
	if ($userLang=="français") $radical="clé";
	else $radical="radical";
	$all="";
	if (property_exists($entry,$userLang)) $zm=count($entry->{$userLang});
	else $zm=0;
	$started=0;
	for ($z=0;$z<$zm;$z++)
	{
		if (!preg_match("/ \[".$otherLanguage."[^\]]*\]/",$entry->{$userLang}[$z]))
		{
			if (!preg_match("/^".$radical." [0-9]+/",$entry->{$userLang}[$z]))
			{
				if ($started) $all.=", ";
				else $started=1;
				$all.=$entry->{$userLang}[$z];
			}
		}
	}
	$all=preg_replace("/ \[".$language."[^\]]*\]/","",$all);
	return $all;
}
function getWord($entry,$char,$word)
{
	$s="";
	if (property_exists($entry,$word))
	{
		$zm=count($entry->{$word});
		$started=0;
		for ($z=0;$z<$zm;$z++)
		{
			$oneWord=preg_replace("/\s\(.*$/","",$entry->{$word}[$z]);
			if (!$s&&($oneWord!=($entry->{$char}))) $s.=$oneWord;
			if($s) break;
		}
	}
	return $s;
}
function buildOne($name,$lang,$ref)
{
	global $xml,$xml2;
	if ($lang=="ja")
	{
		$word="語句";
		$trans="kana";
		$language="Ja";
		$otherLanguage="Zh";
		$use="日本使用";
	}
	else
	{
		$word="词汇";
		$trans="pinyin";
		$language="Zh";
		$otherLanguage="Ja";
		$use="hsk2012";
	}
	$xml2=array();
	foreach($xml->children() as $child)
	{
		$childName=$child->getName();
		if (($childName=="常用漢字")||($childName=="人名用漢字")||($childName=="表外漢字"))
		{
			foreach($child as $entry)
			{
				if ($lang=="ja")
				{
					if (property_exists($entry,"常用")) $char="常用";
					else if (property_exists($entry,"人名用")) $char="人名用";
					else $char="表外";
				}
				else $char="简体字";
				if (property_exists($entry,$char))
					if (in_array($entry->{$char},$ref))
						if (property_exists($entry,$use)) $xml2[]=$entry;
			}
		}
	}
	$r=array();
	foreach($xml2 as $entry)
	{
		if ($lang=="ja")
		{
			if (property_exists($entry,"常用")) $char="常用";
			else if (property_exists($entry,"人名用")) $char="人名用";
			else $char="表外";
		}
		else $char="简体字";
		$c=$entry->{$char}."";
		$t1=getTranscription($entry,$trans);
		$t2=getTranslation($entry,"english",$language,$otherLanguage);
		$t3=getTranslation($entry,"français",$language,$otherLanguage);
		$w=getWord($entry,$char,$word);
		$r[]=[$c,$t1,$t2,$t3,$w];
	}
	$s=json_encode($r,JSON_UNESCAPED_UNICODE);
	file_put_contents("official/CJKQuiz/_json/".$name.".json",$s);
	echo $name." done!<br><br>";
}

$xml=simplexml_load_file(preg_replace("#([^/])/?$#","$1/",dirname(__FILE__))."../_quiz/kanji.xml");
$a=json_decode(file_get_contents("chars.json"));
foreach($a as $b)
{
	buildOne($b[0],$b[1],explode(",",$b[2]));
}
?>