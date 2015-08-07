// (C) 2014 - Dylan Kobayashi, Jason Leigh
// Laboratory for Advanced Visualization and Applications
// University of Hawaii at Manoa
// Version 8/4/2015

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

var dictionaryFileName = "DICTIONARY.txt";
var allDictionaryText;
var combinedSandE =[];	// Final database array
var dictlines = [];

function readDictionaryTextFile(file){
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function ()
	{
		if(rawFile.readyState === 4)
		{
			if(rawFile.status === 200 || rawFile.status == 0)
			{
				allDictionaryText = rawFile.responseText;

			}
		}
	}
	rawFile.send(null);
}

function setupInnerDivisions(mainDiv) {

	// Read dictionary tab delimited text file.
	readDictionaryTextFile(dictionaryFileName);

	// Split each line and store in array.
    dictlines = allDictionaryText.split("\n");

    // Now split each array entry via the tab delimiters into another 3x1 array.
    for(i = 0; i < dictlines.length; i++) {
        combinedSandE[i] = dictlines[i].split("\t");
    }

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


function hasMacron(word){
	if (word.toLowerCase().indexOf("ā") != -1) return true;
	if (word.toLowerCase().indexOf("ē") != -1) return true;
	if (word.toLowerCase().indexOf("ī") != -1) return true;
	if (word.toLowerCase().indexOf("ō") != -1) return true;
	if (word.toLowerCase().indexOf("ū") != -1) return true;	
	return false;	
}

function isMacron(char){
	//alert(char);
	switch(char){
		case 'ā':
			return true;
		case 'ē':
			return true;
		case 'ī':
			return true;
		case 'ō':
			return true;
		case 'ū':
			return true;
		default:
			return false;
	}
}

/*
 Traverse each character of input word looking for a user-entered macron starting from the beginning of the word
and compare it against the dictionary word starting from startPositionInDict.
If all entered macrons match then return true, otherwise return false.
*/ 
function hasMacronPositionMatch(startPositionInDict,inputWord, dictWord)
{

	var j = 0;
	for(i = startPositionInDict; i < inputWord.length + startPositionInDict; i++){

		// if there is a macron character in inputWord and there is no macron in dictWord position then return false
		if (isMacron(inputWord.charAt(j))) {
			if (inputWord.charAt(j) != dictWord.charAt(i)) {
				return false;
			}
		}
		j++;
	}
	return true;

}

function updateResults() {

	//get the word from the search input and strip out the apostrophe type symbols
	var word = document.getElementById(inputBox).value.toLowerCase().replace(/ʻ|'|`/g,"");
	var origWord = word;
	//return if nothing left.
	if(word.length <= 0){
		return;
	}

	//create holders for Samoan and English matches
	var smatchList = new Array();
	var ematchList = new Array();

	//replace all specials with normal.
	word = word.replace(/ā/g,"a").replace(/ō/g,"o").replace(/ū/g,"u").replace(/ē/g,"e").replace(/ī/g,"i");

	//check if a special character was used.
	//var hasUsedMacron = !(word == origWord);
	var hasUsedMacron = hasMacron(origWord);

	//check for Samoan word matches first
	for(var i = 0; i < combinedSandE.length; i++) {
		//make the dict word plain
		var dictOrig = combinedSandE[i][0].replace(/ʻ|'|`/g,"").toLowerCase();
		var dictWord = dictOrig.replace(/ā/g,"a").replace(/ō/g,"o").replace(/ū/g,"u").replace(/ē/g,"e").replace(/ī/g,"i");
		var dict = dictWord.indexOf(word);

		// first determine if a dictionary entry is a viable candidate.
		if (dict != -1) {
				// If doing free match within dictionary words
				if(useFreeMatch){
					// If user entered a macron in his search
					if (hasUsedMacron) {
						// Check each user entered macron to see if it matches the dictionary's entry
						if (hasMacronPositionMatch(dict,origWord,dictOrig)){
							smatchList.push(i);
						}
					} // If not using macron then just a simple unconstrained match
					else { smatchList.push(i); }
				} else if(dict == 0) {
					// If user entered a macron in his serch
					if (hasUsedMacron) {
						// Check each user entered macron to see if it matches the dictionary's entry
						if (hasMacronPositionMatch(dict,origWord,dictOrig)){
							smatchList.push(i);
						}
					}  // If not using macron then just a simple unconstrained match
					else { smatchList.push(i); }
			}
		}
	} //end checking for Samoan matches, next up English
	for(var i = 0; i < combinedSandE.length; i++){
		if(combinedSandE[i][1].toLowerCase().indexOf(word) != -1){
			if(useFreeMatch){
				ematchList.push(i);
			}
			else if(combinedSandE[i][1].toLowerCase().indexOf(word) == 0) {
				ematchList.push(i);
			}
		}
	} //end searching for English

// First gather up all the Samoan search results and sort them.
	var sortArrayS=[];
	for (var i=0; i < smatchList.length; i++){
		sortArrayS[i] = 	combinedSandE[smatchList[i]][0] + " - " +
			combinedSandE[smatchList[i]][1] + "  (" +
			combinedSandE[smatchList[i]][2] + ")<br>";
	}
	sortArrayS.sort();

	// Then add it to the web page for viewing.
	var tobeInnerHtml =
	 	"&nbspResults("+smatchList.length+"):<br>--------------<br>";
	for(var i = 0; i < smatchList.length; i++){
		tobeInnerHtml += "&nbsp" + sortArrayS[i];
	}

	document.getElementById(srl).innerHTML = tobeInnerHtml;

	// Likewise gather up all the English search results and sort them.
	var sortArrayE=[];
	for (var i=0; i < ematchList.length; i++){
		sortArrayE[i] = 	combinedSandE[ematchList[i]][1] + " - " +
			combinedSandE[ematchList[i]][0] + "  (" +
			combinedSandE[ematchList[i]][2] + ")<br>";
	}
	sortArrayE.sort();

	// before adding them to the web page for viewing.
	tobeInnerHtml = 
	 	"&nbspResults("+ematchList.length+"):<br>--------------<br>";
	 	for (var i = 0; i < sortArrayE.length; i++){
	 		tobeInnerHtml += "&nbsp" + sortArrayE[i];
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
	"<br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Version 2.3 (August 7, 2015)</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Original dictionary data by James Metz</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Edited by John Maher</b></center></div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center>Department of Indo-Pacific Languages and Literature</center>"+
	"<center>University of Hawai\ʻi at M\ānoa</center>"+
	"</div>";
	document.getElementById(theMainDiv).innerHTML +=
	"<br><br><div style='font-size:"+infoTextHeight+"px; font-family: \"Helvetica\";'><center><b>Application by Dylan Kobayashi, Jason Leigh</b></center></div>";
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