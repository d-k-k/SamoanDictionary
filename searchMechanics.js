

var searchZone = "searchZone";
var freeMatch = "freeMatch";
var limit100 = "limit100";
var defSearch = "defSearch";
var inputBox = "inputBox";
var srZone = "samoanResultZone";
var erZone = "englishResultZone";
var srl = "samoanResultList";
var erl = "englishResultList";
var infoZone = "infoZone";
var lavaLogo = "lavaLogo";
var switchBar = "switchBar";
var switchBarText = "switchBarText";
var mobileToggle = "mobileToggle";

var useFreeMatch = false;
var useLimit100 = true;
var useDefSearch = false;

//Currently unused, intended for search speedup
var specialChars = "'āōūēī`Ī";
var quoteChars = "'`ʻ";
var quote1 = "'";
var quote2 = "`";
var quote3 = "ʻ";
var firstSamoanIndex = 0;
var firstEnglishIndex = 0;
var sAlphaIndex = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
var eAlphaIndex = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];


//support for mobileBrowser changes
var mobileBrowser = false;
var sbSamoanToEnglish = true;
var theMainDiv;

var mobileTextSize;

function setupInnerDivisions(mainDiv) {
	theMainDiv = mainDiv;

	var uagent = navigator.userAgent.toLowerCase();
	if(uagent.search("iphone") > -1){ mobileBrowser = true; }
	else if(uagent.search("android") > -1){ mobileBrowser = true; }

	//mobileBrowser = true;
	useFreeMatch = true;


	if(mobileBrowser) {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		var textVal = Math.floor(windowHeight * 0.08);
		console.log("8% of the height: " + textVal);

		//english to samoan is 20 chars
		while( 20 * textVal > windowWidth){
			textVal--;
		}
		mobileTextSize = textVal;
		var topOffset =  (1 - (textVal / (windowHeight * 0.1))) * 50;


		document.getElementById(mainDiv).innerHTML =
			"<div id='"+switchBar+
			"' style='top: "+(Math.floor(windowHeight * 0.02))+
			"px; left: 2%; height: "+(Math.floor(windowHeight * 0.1))+"px; width: 96%; border: 1px solid #000; position:absolute; font-family: \"Helvetica\";  font-size: "+textVal+"px;'"+
			" onclick='switchDictionaryDirection()'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+searchZone+
			"' style='top: "+(Math.floor(windowHeight * 0.15))+"px; left: 2%; height: "+(Math.floor(windowHeight * 0.21))+"px; width: 96%; border: 1px solid #000; position:absolute;'></div>";


		console.log("Size of the icon: " + (Math.floor(windowHeight * 0.12 ) ));
		console.log("Size of textVal:" + textVal)
		if( (Math.floor(windowHeight * 0.12 ) ) < (textVal + 37 ) ){
			textVal = (Math.floor(windowHeight * 0.12 ) -37);
			if(textVal < 1){ textVal = 1;}
		}

		//var leftOffset = Math.ceil( ((sHeight / 76.0) * 111.0 ) + 10 ) + Math.floor( windowWidth * 0.03 );
		var leftOffset = (Math.floor(windowHeight * 0.12 ) + Math.floor( windowWidth * 0.03) +  10 );
		var sHeight = 	Math.floor(windowHeight * 0.05 ) ;

		document.getElementById(mainDiv).innerHTML +=
			"<div style='position:absolute; left: 3%; top: "+(Math.floor(windowHeight * 0.16))+"px; height:"+(Math.floor(windowHeight * 0.12 ) )+";' >" +
			"<img src='magnify.png' alt='searchIcon' height='"+(Math.floor(windowHeight * 0.10 ) )+"px'>" +
			"</div>" ;

		document.getElementById(mainDiv).innerHTML +=
			"<div style='position:absolute; left: "+(Math.floor(windowHeight * 0.12 ) + Math.floor( windowWidth * 0.03) +  10 )+
			"; top: "+(Math.floor(windowHeight * 0.18))+"px;' >" + "<input autofocus id='"+inputBox+"' type='text' onkeyup='updateResults()' style='font-size: "+textVal+"px;'>" +
			"</div>";

		//natural size of the switch: 111 x 76

		document.getElementById(mainDiv).innerHTML +=
			"<div id="+mobileToggle+" onclick='enableFreeMatch()' style='left:"+(Math.floor( windowWidth * 0.03 ))+"px; top:"+
			(Math.floor(windowHeight * 0.28 ) )+"; height: "+ sHeight +" px; position:absolute;'>"+
			"<img src='off-switch.png' alt='OFF' height='"+ sHeight +"px'> </div>"+

			"<div onclick='enableFreeMatch()' style='left:"+ leftOffset +"px; top:"+
			(Math.floor(windowHeight * 0.30 ) )+"; font-family: \"Helvetica\"; position:absolute;font-size: "+textVal+"px;'>"+
			"Search within words</div>";



		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+srZone +
			"' style='top: "+(Math.floor(windowHeight * 0.35))+"px; left: 2%; height: "+(Math.floor(windowHeight * 0.55))+"px; width: 96%; position:absolute;visibility:visible;'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+erZone+
			"' style='top: "+(Math.floor(windowHeight * 0.35))+"px; left: 2%; height: "+(Math.floor(windowHeight * 0.55))+"px; width: 96%; position:absolute; visibility:hidden;'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+infoZone+
			"' style='left: 45%; bottom: "+(Math.floor(windowHeight * 0.01))+"px; height: "+(Math.floor(windowHeight * 0.07))+"px; width: 11%; position:absolute;'"+
			"onclick='showInfoPage()'></div>";

	}//end if mobile browser
	else {
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var bottomLimit = Math.floor(windowHeight * 0.2);
		var topval = Math.floor(windowHeight * 0.08);

		document.getElementById(mainDiv).innerHTML = "<div style='font-size:"+(Math.floor(windowHeight * 0.05))+
			"px; font-family: \"Helvetica\"; '><center>Sāmoan / English Dictionary</center></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+searchZone+
			"' style='left:"+ Math.floor(windowWidth/2 - 200)+";top: "+topval+
			"; height: "+(Math.floor(windowHeight * 0.13))+ "px; font-size:"+(Math.floor(windowHeight * 0.03))+
			"px; font-family: \"Helvetica\";  border: 1px solid #000; width:400px; position:absolute;'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+srZone +
			"' style='top: 25%; left: 3%; height: 70%; width: 45%; font-family: \"Helvetica\"; position:absolute;'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+erZone+
			"' style='top: 25%; left: 50%; height: 70%; width: 45%; font-family: \"Helvetica\"; position:absolute;'></div>";

		document.getElementById(mainDiv).innerHTML +=
			"<div id='"+infoZone+
			"' style='top: "+ (topval + 10)+"; left: "+Math.floor(windowWidth/2 +149)+"; height: 50px; width: 50px; position:absolute;'"+
			"onclick='showInfoPage()'></div>";

	} //end if not mobile browser


	fillSearchZone();
	fillSamoanResultZone();
	fillEnglishResultZone();
	fillInfoButton();
	//fillLavaLogo();
	fillSwitchBar(topOffset);
	enableFreeMatch();
} //end setup inner divisions.

function fillSearchZone() {

	if(mobileBrowser){
		/*
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		document.getElementById(searchZone).innerHTML =
		"<div style='position:absolute; left: 1%; top: 5%; height:"+(Math.floor(windowHeight * 0.12 ) )+";' >" +
		"<img src='magnify.png' alt='searchIcon' height='100%'>" +
		"</div>" ;

		document.getElementById(searchZone).innerHTML +=
		"<div style='position:absolute; left: "+(Math.floor(windowHeight * 0.12 ) + 10 )+"; top: 5%;' >" +
		"<input autofocus id='"+inputBox+"' type='text' size='20' onkeyup='updateResults()' style='font-size: "+(Math.floor( windowHeight * 0.1) )+"px;'>" +
		"</div>";
		document.getElementById(searchZone).innerHTML +=
		"<div id="+mobileToggle+" onclick='enableFreeMatch()' style='left:"+(Math.floor( windowWidth * 0.03 ))+"px; top:"+
		(Math.floor(windowHeight * 0.12 ) +15 )+"; position:relative;'>"+
		"<img src='off-switch.png' alt='Info page' height='25%'> </div>"+
		"<div onclick='enableFreeMatch()' style='left:"+( (Math.floor( windowWidth * 0.03 )) + Math.floor(111 * 0.5))+"px; top:"+(Math.floor(windowHeight * 0.15 ))+"; position:absolute;font-size: "+(Math.floor( windowHeight * 0.04) )+"px;'>"+
		"Search within words</div>";
		//*/
	}
	else {
		document.getElementById(searchZone).innerHTML 
		+= "<div style='top:7px; position:relative;'> &nbspSearch... <input autofocus id='"+inputBox+"' type='text' size='20' onkeyup='updateResults()'> </div>";
		document.getElementById(searchZone).innerHTML 
		+= "<br>&nbsp<input id='" +freeMatch+"' type='checkbox' onclick='enableFreeMatch()'></input>Enable search within words" ;
	}

	//console.log("Width of input area:" + document.getElementById(searchZone).style.width);
	///console.log("Height of input area:" + document.getElementById(searchZone).style.height);
	//console.log("Window Height:" + window.innerHeight);
	//console.log("Window width:" + window.innerWidth);

} //end fill search zone

function fillSamoanResultZone() {
	if(mobileBrowser){
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		document.getElementById(srZone).innerHTML +=
		"<div id='"+srl+
		"' style='visibility:visible; position:relative; top:5%;width:100%; height:95%; border: 1px solid #FF1919; overflow: scroll; font-family: \"Arial\"; font-size: "+ mobileTextSize+"px;''></div>";
	}
	else{
		document.getElementById(srZone).innerHTML += "&nbsp&nbspSamoan word matches";
		document.getElementById(srZone).innerHTML +=
		"<div id='"+srl+
		"' style='width:100%; height:99%; border: 1px solid #000; overflow: scroll; font-family: \"Arial\"; font-size: 14px;''></div>";
	}
}

function fillEnglishResultZone() {
	if(mobileBrowser){
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		document.getElementById(erZone).innerHTML += 
		"<div id='"+erl+
		"' style='visibility:hidden; position:relative; top: 5%; width:100%; height:95%; border: 1px solid #8E43F2; overflow: scroll; font-family: \"Arial\"; font-size: "+ mobileTextSize +"px;''></div>";
	}
	else{
	document.getElementById(erZone).innerHTML += "&nbsp&nbspEnglish word matches";
	document.getElementById(erZone).innerHTML += 
	"<div id='"+erl+
	"' style='width:100%; height:99%; border: 1px solid #000; overflow: scroll; font-family: \"Arial\"; font-size: 14px;''></div>";
	}
}


function updateResults() {
	var word = document.getElementById(inputBox).value;

	if(word.length <= 0){
		return;
	}
	word = word.toLowerCase();

	var smatchList = new Array();
	var ematchList = new Array();

	word = word.replace(/ʻ|'|`/g,"").replace(/ā/g,"a").replace(/ō/g,"o").replace(/ū/g,"u").replace(/ē/g,"e").replace(/ī/g,"i");

	//fillout specials check

	for(var i = 0; i < SamoanToEnglishWords.length; i++ ){

		var dictword = SamoanToEnglishWords[i][0].replace(/ʻ|'|`/g,"").replace(/ā/g,"a").replace(/ō/g,"o").replace(/ū/g,"u").replace(/ē/g,"e").replace(/ī/g,"i");
		var dict = dictword.toLowerCase().indexOf(word);

		if (dict != -1) {
				if(useFreeMatch){
				smatchList.push(i);	
				} else if(dict == 0) {
				smatchList.push(i);
			}
		}
		else if(useDefSearch && useFreeMatch && SamoanToEnglishWords[i][1].toLowerCase().indexOf(word) != -1){
			smatchList.push(i);
		}
		else if(useDefSearch && SamoanToEnglishWords[i][1].toLowerCase().indexOf(word) == 0){
			smatchList.push(i);
		}
		//currently disabling the 300 limit
		// if(useLimit100 && smatchList.length >= 300){
		// 	break;
		// }
	}

	for(var i = 0; i < EnglishToSamoanWords.length; i++){
		if(EnglishToSamoanWords[i][0].toLowerCase().indexOf(word) != -1){
			if(useFreeMatch){
				ematchList.push(i);
			}
			else if(EnglishToSamoanWords[i][0].toLowerCase().indexOf(word) == 0) {
				ematchList.push(i);
			}
		}
		else if(useDefSearch && useFreeMatch && EnglishToSamoanWords[i][1].toLowerCase().indexOf(word) != -1){
			ematchList.push(i);
		}
		else if(useDefSearch && EnglishToSamoanWords[i][1].toLowerCase().indexOf(word) == 0){
			ematchList.push(i);
		}

		if(useLimit100 && ematchList.length >= 300){
			break;
		}
	}

	//document.getElementById(srl).innerHTML =
	var tobeInnerHtml =
	 	"&nbspResults("+smatchList.length+"):<br>--------------<br>";
	for(var i = 0; i < smatchList.length; i++){
		
		///*
		//document.getElementById(srl).innerHTML += "&nbsp" +
		tobeInnerHtml += "&nbsp" +
			SamoanToEnglishWords[smatchList[i]][0] + " - " +
			SamoanToEnglishWords[smatchList[i]][1] + "  (" +
			SamoanToEnglishWords[smatchList[i]][2] + ")<br>";
		//*/

		/*
		document.getElementById(srl).innerHTML +=
			SamoanToEnglishWords[smatchList[i]][0];
		for(var j = SamoanToEnglishWords[smatchList[i]][0].length; j < 15; j++ ){
			document.getElementById(srl).innerHTML += "&nbsp";
		} 
		document.getElementById(srl).innerHTML +=
		 "(" + SamoanToEnglishWords[smatchList[i]][2]+ ")" + " - " +
			SamoanToEnglishWords[smatchList[i]][1] + "<br>";
		*/

	}

	document.getElementById(srl).innerHTML = tobeInnerHtml;

	//document.getElementById(erl).innerHTML =
	tobeInnerHtml = 
	 	"&nbspResults("+ematchList.length+"):<br>--------------<br>";
	for(var i = 0; i < ematchList.length; i++){
		//document.getElementById(erl).innerHTML += "&nbsp" +
		tobeInnerHtml += "&nbsp" +
			EnglishToSamoanWords[ematchList[i]][0] + " - " +
			EnglishToSamoanWords[ematchList[i]][1] + "  (" +
			EnglishToSamoanWords[ematchList[i]][2] + ")<br>";
	}

	document.getElementById(erl).innerHTML = tobeInnerHtml;

} //end updateresults

function fillInfoButton(){
	if(mobileBrowser){
		document.getElementById(infoZone).innerHTML = "<center><img src='info.png' alt='Info page' height='100%' width='100%'></center>";
	}
	else{
		document.getElementById(infoZone).innerHTML = "<img src='info.png' alt='Info page' height='50' width='50'>";
	}
}

function fillLavaLogo() {
	if(mobileBrowser){
		document.getElementById(lavaLogo).innerHTML = "<img src='lava.png' alt='LAVA' height='100%'>";
	}
	else{
		document.getElementById(lavaLogo).innerHTML = "<img src='lava.png' alt='LAVA'>";
	}
}

function fillSwitchBar(sbtopOffset) {
	if(mobileBrowser){
		document.getElementById(switchBar).innerHTML =
		"<div id='" + switchBarText + 
		"'style='top:"+sbtopOffset+"%; position:relative;' ><center>Sāmoan to English...</center></div> ";
	}
}

function enableFreeMatch() {
	if(mobileBrowser){
		useFreeMatch = !useFreeMatch;
		if(useFreeMatch){
			document.getElementById(mobileToggle).innerHTML =
			"<img src='on-switch.png' alt='OFF' height='"+(Math.floor(window.innerHeight * 0.08 ) )+"px'>";
		}
		else{
			document.getElementById(mobileToggle).innerHTML =
			"<img src='off-switch.png' alt='OFF' height='"+(Math.floor(window.innerHeight * 0.08 ) )+"px'>";
		}
		updateResults();
	}
	else{
		useFreeMatch = document.getElementById(freeMatch).checked;
		updateResults();
	}
}

function switchDictionaryDirection() {
	if(sbSamoanToEnglish){
		sbSamoanToEnglish = false;
		document.getElementById(switchBarText).innerHTML = "<center>English to Sāmoan...</center>";
		document.getElementById(srZone).style.visibility = 'hidden';
		document.getElementById(erZone).style.visibility = 'visible';
		document.getElementById(srl).style.visibility = 'hidden';
		document.getElementById(erl).style.visibility = 'visible';
	}
	else {
		sbSamoanToEnglish = true;
		document.getElementById(switchBarText).innerHTML = "<center>Sāmoan to English...</center>";
		document.getElementById(srZone).style.visibility = 'visible';
		document.getElementById(erZone).style.visibility = 'hidden';
		document.getElementById(srl).style.visibility = 'visible';
		document.getElementById(erl).style.visibility = 'hidden';
	}
}

function enableLimit100() {
	useLimit100 = document.getElementById(limit100).checked;
}
function enableDefSearch() {
	useDefSearch = document.getElementById(defSearch).checked;
	updateResults();
}

function showInfoPage() {
	document.getElementById(theMainDiv).innerHTML = "";

	var windowWidth = window.innerWidth;
	var windowHeight = window.innerHeight;
	var headerTextHeight = Math.floor(windowHeight * 0.18);

	//header has 30 chars
	while(25 * headerTextHeight >= windowWidth){ headerTextHeight--;	}
	if(headerTextHeight <=0){ headerTextHeight = 1; }

	var htTopOffset = windowHeight * 0.05;
	htTopOffset -= headerTextHeight/2;

	//setup the blue bar
	document.getElementById(theMainDiv).innerHTML =
	"<div style='top:0%; height:10%; font-size:23; font-family: \"Helvetica\";"+
		" background-color: #0F4D8C; color:#fff' onclick='setupInnerDivisions(\""+theMainDiv+"\")'></div>";
	//put the done and header text
	document.getElementById(theMainDiv).innerHTML +=
	"<div onclick='setupInnerDivisions(\""+theMainDiv+"\")' style='top:"+ htTopOffset+"px; left:"+ (Math.floor(windowHeight * 0.02 )) +
		"px; position:absolute; font-size:"+headerTextHeight+"; font-family: \"Helvetica\"; color:#fff'><b>Done</b></div> ";
	document.getElementById(theMainDiv).innerHTML +=
	"<div onclick='setupInnerDivisions(\""+theMainDiv+"\")' style='top:"+ htTopOffset + "px;position:absolute; width: 100%; " +
		"font-size:"+headerTextHeight+"; font-family: \"Helvetica\"; color:#fff'><center><b>Samoan/English Dictionary</b></center></div>";


	var infoTextHeight = Math.floor(windowHeight * 0.8 / 20);
	//LAVA spelled out ~ 50 chars
	while(25 * infoTextHeight >= windowWidth){ infoTextHeight--; }
	if(infoTextHeight <=0){ infoTextHeight = 1; }

	console.log("size of info text:" + infoTextHeight);

	document.getElementById(theMainDiv).innerHTML +=
	"<br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Version 1.0 (July 6, 2014)</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Original dictionary data by James Metz</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Under Edit by John Maher</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center>Department of Indo-Pacific Languages and Literature</center>"+
	"<center>University of Hawai\ʻi at M\ānoa</center>"+
	"</div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>App by Dylan Kobayashi, Jason Leigh</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center>Laboratory for Advanced Visualization & Applications</center>"+
	"<center>Department of Information & Computer Sciences</center>"+
	"<center>University of Hawai\ʻi at M\ānoa</center>"+
	"</div>";

	//give the icons roughly 20%
	//where are images drawn from?
	var imgTop = Math.floor(windowHeight * 0.8);
	var imgWidth = Math.floor(windowWidth * 0.20);
	var iwh = Math.floor(windowHeight * 0.17);
	if(iwh < imgWidth){ imgWidth = iwh; }
	var imgLeftOffset = (windowWidth - (imgWidth * 3) ) / 4;

	document.getElementById(theMainDiv).innerHTML +=
	"<div style='top:"+imgTop+"px; left:"+imgLeftOffset+"px; width:"+imgWidth+"px; height:"+imgWidth+
		"px; position:absolute;'> <a href='http://ipll.manoa.hawaii.edu/'> <img src='IPLLlogo.png' alt='IPLL' width='"+imgWidth+"px'> </a></div>"+
	"<div style='top:"+imgTop+"px; left:"+(imgLeftOffset *2 + imgWidth)+"px; width:"+imgWidth+"px; height:"+imgWidth+
		"px; position:absolute;'> <a href='http://lava.manoa.hawaii.edu/'> <img src='lava.png' alt='LAVA' width='"+imgWidth+"px'> </a></div>";

	iwh = Math.floor(imgWidth * 0.7);

	document.getElementById(theMainDiv).innerHTML +=
	"<div style='top:"+imgTop+"px; left:"+(imgLeftOffset *3 + imgWidth*2 + (imgWidth - Math.floor(imgWidth * 0.7) ) / 2)+"px; width:"+iwh+"px; height:"+iwh+
		"px; position:absolute;'> <a href='http://www.uhm.hawaii.edu/'> <img src='UHMlogo.png' alt='UHM' width='"+iwh+"px' height='"+iwh+"px'> </a></div>";
	

}