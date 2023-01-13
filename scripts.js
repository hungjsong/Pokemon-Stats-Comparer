var pokemon = [];
var defaultStats = {'name': "???", 'pokedex_number': 0, 'HP': 0, 'Atk': 0, 'Def': 0, 'SpAtk': 0, 'SpDef': 0, 'Spd': 0, 'default': true};

// load the pokemon.csv dataset
function loadingStart(){
	sessionStorage.clear();
	displayChart(defaultStats);
	d3.csv("pokemon.csv", function(data) {
		for(var i = 0; i < data.length; i++){
			pokemon[i] = {'name': data[i].name, 'pokedex_number': data[i].pokedex_number};
		}
		printPokemon();
	})
}

// display the selected pokemon's data
function selectedPokemon(pokedexNo, searchBar){	
	//Pokedex number
	var value = pokedexNo;
	
	if(searchBar == firstOption+"-"+secondOption+"-search" || searchBar == firstOption+"-"+secondOption+"-search-one"){
		var graphTitle = "graph-title1";
		var firstType = "firstType1";
		var secondType = "secondType1";
		var category = "category0";
		var pokedexNumber = "pokedexNumber0";
		var weight = "weight0";
		var height = "height0";
		var sprite = "sprite1";
	}
	else{
		var graphTitle = "graph-title2";
		var firstType = "firstType2";
		var secondType = "secondType2";
		var category = "category1";
		var pokedexNumber = "pokedexNumber1";
		var weight = "weight1";
		var height = "height1";
		var sprite = "sprite2";
	}
	
	d3.csv("pokemon.csv", function(data) {
		for(var i = 0; i < data.length; i++){
			if(data[i].pokedex_number == value){
				//Adds leadings zeroes to the pokedex number if it has a length that is less than 3
				var zeroes = new Array(4).join("0");
				//Displays and alter text of the second pokemon title
				if(graphTitle == "graph-title2"){
					document.getElementById(graphTitle).setAttribute('style', 'display: inline; vertical-align: middle;');
					document.getElementById(graphTitle).innerText = "vs " + (zeroes + data[i].pokedex_number).slice(-3) + " - " + data[i].name;
				}
				//Changes the text of the first pokemon title
				else{
					document.getElementById(graphTitle).innerText = (zeroes + data[i].pokedex_number).slice(-3) + " - " + data[i].name;
				}
				//Displays the image of pokemon's first type
				document.getElementById(firstType).src = "./img/types/" + data[i].type1 + ".png";
				//If the pokemon has a second type, set and display it.
				if(data[i].type2 != ''){
					document.getElementById(secondType).src = "./img/types/" + data[i].type2 + ".png";
					document.getElementById(secondType).setAttribute('style', 'display: inline;');
				}
				//If the pokemon does not have a second type, hide it and set it back to unknown
				else{
					document.getElementById(secondType).src = "./img/types/unknown.png";
					document.getElementById(secondType).setAttribute('style', 'display: none;');
				}
				//Set text to pokedex details.
				document.getElementById(category).innerText = data[i].classfication;
				document.getElementById(pokedexNumber).innerText = (zeroes +  data[i].pokedex_number).slice(-3);
				document.getElementById(weight).innerText = data[i].weight_kg + " kg";
				document.getElementById(height).innerText = data[i].height_m + " m";
				
				//Display the second (comparison) pokemon sprite upon selection
				if(sprite == "sprite2"){
					document.getElementById(sprite).setAttribute('style', 'display: inline; vertical-align: middle;');
				}

				//Set and display the sprite of the pokemon selected
				document.getElementById(sprite).src = "./img/pokemon/" + data[i].pokedex_number + ".png";	

				//
				
				var typeColor = getTypeColor(data[i].type1);

				var pokemonData = {'name': data[i].name, 'pokedex_number': data[i].pokedex_number, 'HP': data[i].hp, 'Atk': data[i].attack, 'Def': data[i].defense, 
								  'SpAtk': data[i].sp_attack, 'SpDef': data[i].sp_defense, 'Spd': data[i].speed, 'graphTitle': graphTitle, 'color': typeColor};
				displayChart(pokemonData);
				
				var first = sessionStorage.getItem("first");
				if(firstOption == 'view') {
					colorGraph(first, "");
					createLegend(first, "");
				}
				else {
					var second = sessionStorage.getItem("second");
					colorGraph(first, second);
					createLegend(first, second);
				}

			}
		}
	})
}

// display the selected type's data
function selectedType(typeName, searchBar){
	//Type value selected
	var value = typeName;
	var counter = 0;
	
	var averageHP = 0;
	var averageAtk = 0;
	var averageDef = 0;
	var averageSpAtk = 0;
	var averageSpDef = 0;
	var averageSpd = 0;
	
	var stats = [];
	
	if(searchBar == firstOption+"-"+secondOption+"-search" || searchBar == firstOption+"-"+secondOption+"-search-one"){
		var graphTitle = "graph-title1";
		var type = "firstCompareType";
		var totalPokemon = "totalPokemon1";
		var weight = "averageWeight1";
		var height = "averageHeight1";
		var sprite = 'sprite1';
	}
	else{
		var graphTitle = "graph-title2";
		var type = "secondCompareType";
		var totalPokemon = "totalPokemon2";
		var weight = "averageWeight2";
		var height = "averageHeight2";
		var sprite = 'sprite2';
	}
	

	d3.csv("pokemon.csv", function(data) {
		for(var i = 0; i < data.length; i++){
			if(data[i].type1 == value.toLowerCase() || data[i].type2 == value.toLowerCase()){
				//Displays and alter text of the second type title
				if(graphTitle == "graph-title2"){
					document.getElementById(graphTitle).setAttribute('style', 'display: inline; vertical-align: middle;');
					document.getElementById(graphTitle).innerText = "vs " + value;
				}
				//Changes the text of the type pokemon title
				else{
					document.getElementById(graphTitle).innerText = value;
				}

				//Display the second (comparison) type sprite upon selection
				if(sprite == "sprite2"){
					document.getElementById(sprite).setAttribute('style', 'display: inline; vertical-align: middle;');
				}
				
				document.getElementById(sprite).src = "./img/types/" + value.toLowerCase() + "Icon.png";	
				
				stats[counter] = {'HP': data[i].hp, 'Atk': data[i].attack, 'Def': data[i].defense, 
								  'SpAtk': data[i].sp_attack, 'SpDef': data[i].sp_defense, 'Spd': data[i].speed,
								  'Weight': parseFloat(data[i].weight_kg), 'Height': parseFloat(data[i].height_m)};
				counter++;
			}
		}
		
		//Gets the average of the stats
		var averageWeight = 0.0;
		var averageHeight = 0.0;
		for(i = 0; i < stats.length; i++){	
			averageHP += parseInt(stats[i].HP);
			averageAtk += parseInt(stats[i].Atk);
			averageDef += parseInt(stats[i].Def);
			averageSpAtk += parseInt(stats[i].SpAtk);
			averageSpDef += parseInt(stats[i].SpDef);
			averageSpd += parseInt(stats[i].Spd);
			averageWeight += stats[i].Weight;
			averageHeight += stats[i].Height;
		}
		
		averageHP /= counter;
		averageAtk /= counter;
		averageDef /= counter;
		averageSpAtk /= counter;
		averageSpDef /= counter;
		averageSpd /= counter;
		averageWeight /= counter;
		averageHeight /= counter;
		
		//If non-existant option entered, reset all values
		if(counter == 0){
			value = "unknown";
			counter = "???";
			var averageWeight = "";
			var averageHeight = "";
		}

		//Displays the image of the first type
		document.getElementById(type).src = "./img/types/" + value.toLowerCase() + ".png";
		
		//Set text to aggregated details.
		document.getElementById(totalPokemon).innerText = counter;
		document.getElementById(weight).innerText = averageWeight.toFixed(1) + " kg";
		document.getElementById(height).innerText = averageHeight.toFixed(1) + " m";
		
		var typeColor = getTypeColor(value);

		var typeData = {'name': value, 'pokedex_number': -1, 'HP': averageHP.toFixed(0), 'Atk': averageAtk.toFixed(0), 'Def': averageDef.toFixed(0), 
						'SpAtk': averageSpAtk.toFixed(0), 'SpDef': averageSpDef.toFixed(0), 'Spd': averageSpd.toFixed(0), 'graphTitle': graphTitle, 'color': typeColor};
		displayChart(typeData);

		var first = sessionStorage.getItem("first");
		if(firstOption == 'view') {
			colorGraph(first, "");
			createLegend(first, "");
		}
		else {
			var second = sessionStorage.getItem("second");
			colorGraph(first, second);
			createLegend(first, second);
		}

	})
}

function getTypeColor(pokemonType){
	var typeDetails = type.find(element => element.name == (pokemonType.charAt(0).toUpperCase() + pokemonType.slice(1)));
	typeColor = typeDetails.color;
	return typeColor;
}

function colorGraph(first, second) {
	if(first) {
		first = JSON.parse(first);
        first.name = first.name.replace(':', '-_');
		first.name = first.name.replace(' ', '-');
		first.name = first.name.replace('.', '_');
	}
	if(second) {
		second = JSON.parse(second);
        second.name = second.name.replace(':', '-_');
		second.name = second.name.replace(' ', '-');
		second.name = second.name.replace('.', '_');
	}
	if(first && !second) {
		document.querySelector('.area.'+first.name).setAttribute("style", "fill: "+first.color+"; stroke: none;");
		var circles = document.querySelectorAll('.'+first.name+' .circle');
		circles.forEach(circle => {
			circle.setAttribute("style", "fill: "+first.color+"; stroke: none; filter: brightness(80%);");
		});
	}
	else if(!first && second) {
		document.querySelector('.area.'+second.name).setAttribute("style", "fill: "+second.color+"; stroke: none;");
		var secondCircles = document.querySelectorAll('.'+second.name+' .circle');
		secondCircles.forEach(secondCircle => {
			secondCircle.setAttribute("style", "fill: "+second.color+"; stroke: none; filter: brightness(80%);");
		});
	}
	else {
		document.querySelector('.area.'+first.name).setAttribute("style", "fill: "+first.color+"; stroke: none;");
		var firstCircles = document.querySelectorAll('.'+first.name+' .circle');
		firstCircles.forEach(firstCircle => {
			firstCircle.setAttribute("style", "fill: "+first.color+"; stroke: none; filter: brightness(80%);");
		});
		document.querySelector('.area.'+second.name).setAttribute("style", "fill: "+second.color+"; stroke: none;");
		var secondCircles = document.querySelectorAll('.'+second.name+' .circle');
		secondCircles.forEach(secondCircle => {
			secondCircle.setAttribute("style", "fill: "+second.color+"; stroke: none; filter: brightness(80%);");
		});
	}

}

function createLegend(first, second) {
	if(first) {
		first = JSON.parse(first);
		var firstText = "HP: "+first.HP+" | Atk: "+first.Atk+" | Def: "+first.Def+" | Sp. Atk: "+first.SpAtk+" | Sp. Def: "+first.SpDef+" | Spd: "+first.Spd;
		document.getElementById('legend-one').setAttribute('style', 'display: ""');
		document.getElementById('legend-block-one').style.backgroundColor = first.color;
		document.getElementById('legend-sprite-one').setAttribute('style', 'display: inline-block');
		document.getElementById('legend-name-one').innerText = first.name;
		document.getElementById('legend-stats-one').innerText = firstText;
	}
	if(second) {
		second = JSON.parse(second);
		var secondText = "HP: "+second.HP+" | Atk: "+second.Atk+" | Def: "+second.Def+" | Sp. Atk: "+second.SpAtk+" | Sp. Def: "+second.SpDef+" | Spd: "+second.Spd;
		document.getElementById('legend-two').setAttribute('style', 'display: ""');
		document.getElementById('legend-block-two').style.backgroundColor = second.color;
		document.getElementById('legend-sprite-two').setAttribute('style', 'display: inline-block');
		document.getElementById('legend-name-two').innerText = second.name;
		document.getElementById('legend-stats-two').innerText = secondText;
	}

	if(secondOption == 'pokemon') {
		if((first && !second) || (first && firstOption == 'view')) {
			document.getElementById('legend-two').setAttribute('style', 'display: none');
			document.getElementById('legend-one').setAttribute('style', 'text-align: center');
			document.getElementById('legend-sprite-one').src = './img/'+secondOption+'/'+first.pokedex_number+'.png';
		}
		else if(!first && second) {
			document.getElementById('legend-sprite-two').src = './img/'+secondOption+'/'+second.pokedex_number+'.png';
		}
		else {
			document.getElementById('legend-sprite-one').src = './img/'+secondOption+'/'+first.pokedex_number+'.png';
			document.getElementById('legend-sprite-two').src = './img/'+secondOption+'/'+second.pokedex_number+'.png';
		}
	}
	else {
		if((first && !second) || (first && firstOption == 'view')) {
			document.getElementById('legend-sprite-one').src = './img/'+secondOption+'s/'+first.name.toLowerCase()+'Icon.png';
		}
		else if(!first && second) {
			document.getElementById('legend-sprite-two').src = './img/'+secondOption+'s/'+second.name.toLowerCase()+'Icon.png';
		}
		else {
			document.getElementById('legend-sprite-one').src = './img/'+secondOption+'s/'+first.name.toLowerCase()+'Icon.png';
			document.getElementById('legend-sprite-two').src = './img/'+secondOption+'s/'+second.name.toLowerCase()+'Icon.png';
		}
	}
	
}


//============================================= VIEW FUNCTIONS ======================================================//

// initialize the variables chosen onload
var firstOption = 'view';
var secondOption = 'pokemon';
var value = '';
var firstValue = false;
var secondValue = false;

// display the corresponding dropdown menus
function displayDropdown(button) {
	// hide the previously selected view
    document.getElementById(firstOption+'-'+secondOption+'-dropdown').setAttribute('style', 'display: none;');
    document.getElementById(secondOption+'-details').setAttribute('style', 'display: none;');

	// toggle the selected options css
    if(button.name === 'firstOption') {
        var firstOptions = document.getElementsByName('firstOption');
        for(i = 0; i < firstOptions.length; i++) {
            firstOptions[i].classList.remove('pressed');
            if(!button.classList.contains('pressed')) {
                button.classList.add('pressed');
            }
            if(firstOptions[i].classList.contains('pressed')){
                firstOption = firstOptions[i].id;
            }
        }
		// keep the chosen value, while only the first option is changed
		if(value) {
			keepValue(value);
		}
		// reset the second selected pokemon/type
		reset('half');
    }
    else {
        var secondOptions = document.getElementsByName('secondOption');
        for(i = 0; i < secondOptions.length; i++) {
            secondOptions[i].classList.remove('pressed');
            if(!button.classList.contains('pressed')) {
                button.classList.add('pressed');
            }
            if(secondOptions[i].classList.contains('pressed')){
                secondOption = secondOptions[i].id;
            }
        }
		// if the second option is changed, reset all the values and displays
		reset('all');
    }
    document.getElementById(firstOption+'-'+secondOption+'-dropdown').setAttribute('style', 'display: flex;');

	changeGraphTitle();
    displayDetails(firstOption, secondOption);
}

// display the corresponding details
function displayDetails(firstOption, secondOption) {
    document.getElementById(secondOption+'-details').setAttribute('style', 'display: flex;');
    if(firstOption === 'compare') {
        document.getElementById(secondOption+'-detail-two').setAttribute('style', 'display: block;');
    }
    else {
        document.getElementById(secondOption+'-detail-two').setAttribute('style', 'display: none;');
    }
    
}

// change the graph title accordingly
function changeGraphTitle() {
	if(firstOption == 'view') {
		if(!firstValue && !secondValue) {
			document.getElementById('graph-title1').innerText = 'Choose a ' + secondOption.charAt(0).toUpperCase() + secondOption.slice(1);
			if (secondOption == 'pokemon') {
				document.getElementById('sprite1').src = './img/pokemon/unknown.png';
			} else {
				document.getElementById('sprite1').src = './img/types/unknownIcon.png';
			}
			document.getElementById('graph-title2').setAttribute('style', 'display: none;');
			document.getElementById('sprite2').setAttribute('style', 'display: none;');
		}
		else if(firstValue && !secondValue) {
			document.getElementById('graph-title2').setAttribute('style', 'display: none;');
			document.getElementById('sprite2').setAttribute('style', 'display: none;');
		}
	}

	else {
		if((!firstValue && !secondValue && value) || (!firstValue && !secondValue && !value)) {
			if(secondOption == 'pokemon') {
				document.getElementById('graph-title1').innerText = 'Choose ' + secondOption + ' to compare';
				document.getElementById('sprite1').src = './img/pokemon/unknown.png';
			}
			else {
				document.getElementById('graph-title1').innerText = 'Choose ' + secondOption + 's to compare';
				document.getElementById('sprite1').src = './img/types/unknownIcon.png';
			}
			document.getElementById('sprite2').setAttribute('style', 'display: none;');
			document.getElementById('graph-title2').setAttribute('style', 'display: none;');
		}
		else if(firstValue && !secondValue && value) {
			document.getElementById('graph-title2').setAttribute('style', 'display: inline; vertical-align: middle;');
			document.getElementById('graph-title2').innerText = "vs ???";
		}
		else if(!firstValue && secondValue) {
			document.getElementById('graph-title1').innerText = "??? vs ";
			document.getElementById('sprite1').setAttribute('style', 'display: none;');
		}
		else if(firstValue && secondValue) {
			document.getElementById('sprite1').setAttribute('style', 'display: inline; vertical-align: middle;');
		}
	}

}

// keep the selected value when switching first options
function keepValue(value) {
	if(firstOption == 'view') {
		document.getElementById(firstOption+'-'+secondOption+'-search').value = value;
	}
	else {
		document.getElementById(firstOption+'-'+secondOption+'-search-one').value = value;
	}
}

// reset the values and displays
function reset(option) {
	var allSearchBars = document.querySelectorAll('input[type=search]');
	var imageArray = ['firstType1','secondType1','firstType2','secondType2','firstCompareType','secondCompareType'];
	var detailArray = ['category0','pokedexNumber0','category1','pokedexNumber1','totalPokemon1','totalPokemon2',
					   'weight0','weight1','averageWeight1','averageWeight2','height0','height1','averageHeight1','averageHeight2'];
	var questionMarks = '???';
	var kg = ' kg';
	var m = ' m';

	if (option == 'half') {
		for (let i = 0; i < allSearchBars.length; i++) {
			if(allSearchBars[i].id.includes('two')) {
				allSearchBars[i].value = '';
			}
		}

		secondValue = false;
		document.getElementById(imageArray[2]).src = './img/types/unknown.png';
		document.getElementById(imageArray[3]).src = './img/types/unknown.png';
		document.getElementById(imageArray[5]).src = './img/types/unknown.png';
		document.getElementById(detailArray[2]).innerText = questionMarks;
		document.getElementById(detailArray[3]).innerText = questionMarks;
		document.getElementById(detailArray[5]).innerText = questionMarks;
		document.getElementById(detailArray[7]).innerText = questionMarks + kg;
		document.getElementById(detailArray[9]).innerText = questionMarks + kg;
		document.getElementById(detailArray[11]).innerText = questionMarks + m;
		document.getElementById(detailArray[13]).innerText = questionMarks + m;

		if(value) {
			var first = sessionStorage.getItem("first");
			sessionStorage.removeItem("second");
			first = JSON.parse(first);
			displayChart(first);
			first = JSON.stringify(first);
			colorGraph(first, "");
			createLegend(first, "");
		}
	}
	else {
		for (let i = 0; i < allSearchBars.length; i++) {
			allSearchBars[i].value = '';
		}
	
		value = '';
		firstValue = false;
		secondValue = false;
	
		for (let i = 0; i < imageArray.length; i++) {
			document.getElementById(imageArray[i]).src = './img/types/unknown.png';
			if(imageArray[i].includes('secondType')) {
				document.getElementById(imageArray[i]).setAttribute('style', 'display: none;');
			}
		}
		for (let i = 0; i < detailArray.length; i++) {
			if(detailArray[i].toLowerCase().includes('weight')) {
				document.getElementById(detailArray[i]).innerText = questionMarks + kg;
			}
			else if(detailArray[i].toLowerCase().includes('height')) {
				document.getElementById(detailArray[i]).innerText = questionMarks + m;
			}
			else {
				document.getElementById(detailArray[i]).innerText = questionMarks;
			}
		}
		
		changeGraphTitle();
		displayChart(defaultStats);
		document.getElementById('legend-one').setAttribute('style', 'display: none');
		document.getElementById('legend-two').setAttribute('style', 'display: none');
	}
	
}


//============================================= DROPDOWN FUNCTIONS ======================================================//

// print out the pokemon into an unordered list element
function printPokemon(){	
	for (var key in pokemon) {
		var optionElement0 = document.createElement('li');
		optionElement0.id = 'pokemon-list-option-'+pokemon[key].pokedex_number;
		optionElement0.innerHTML = '<img src="./img/pokemon/'+pokemon[key].pokedex_number+'.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
									+'<span style="vertical-align:middle;">'+pokemon[key].pokedex_number+' - '+pokemon[key].name+'</span>';
		optionElement0.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"'+pokemon[key].pokedex_number+'","'+pokemon[key].name+'")');
		document.getElementById('pokemon-list').appendChild(optionElement0);
		
		var optionElement1 = document.createElement('li');
		optionElement1.id = 'pokemon-list-option-'+pokemon[key].pokedex_number;
		optionElement1.innerHTML = '<img src="./img/pokemon/'+pokemon[key].pokedex_number+'.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
									+'<span style="vertical-align:middle;">'+pokemon[key].pokedex_number+' - '+pokemon[key].name+'</span>';
		optionElement1.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"'+pokemon[key].pokedex_number+'","'+pokemon[key].name+'")');
		document.getElementById('pokemon-list-one').appendChild(optionElement1);

		var optionElement2 = document.createElement('li');
		optionElement2.id = 'pokemon-list-option-'+pokemon[key].pokedex_number;
		optionElement2.innerHTML = '<img src="./img/pokemon/'+pokemon[key].pokedex_number+'.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
									+'<span style="vertical-align:middle;">'+pokemon[key].pokedex_number+' - '+pokemon[key].name+'</span>';
		optionElement2.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"'+pokemon[key].pokedex_number+'","'+pokemon[key].name+'")');
		document.getElementById('pokemon-list-two').appendChild(optionElement2);
	}
}

// initialize the pokemon types and colors
var type = [
    {'name': "Grass", 'color': "#63BB5A"},
	{'name': "Water", 'color': "#5090D5"},
	{'name': "Fire", 'color': "#FF9D55"},
	{'name': "Normal", 'color': "#919AA2"},
	{'name': "Fighting", 'color': "#CE416B"},
	{'name': "Flying", 'color': "#8FA9DE"},
	{'name': "Dark", 'color': "#5A5465"},
	{'name': "Psychic", 'color': "#FA7179"},
	{'name': "Ghost", 'color': "#5269AD"},
	{'name': "Electric", 'color': "#F4D23B"},
	{'name': "Ground", 'color': "#D97845"},
	{'name': "Ice", 'color': "#73CEC0"},
	{'name': "Dragon", 'color': "#0B6DC3"},
	{'name': "Poison", 'color': "#AA6BC8"},
	{'name': "Fairy", 'color': "#EC8FE6"},
	{'name': "Rock", 'color': "#C5B78C"},
	{'name': "Steel", 'color': "#5A8EA2"},
	{'name': "Bug", 'color': "#91C12F"}
];

// print out the types into an unordered list element
for (var key in type) {
    var optionElement0 = document.createElement('li');
    optionElement0.id = type[key].name;
	optionElement0.innerHTML = '<img src="./img/types/'+type[key].name.toLowerCase()+'Icon.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
								+'<span style="vertical-align:middle;">'+type[key].name+'</span>';
    optionElement0.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"","'+type[key].name+'")');
    document.getElementById('type-list').appendChild(optionElement0);

    var optionElement1 = document.createElement('li');
    optionElement1.value = type[key].name;
	optionElement1.innerHTML = '<img src="./img/types/'+type[key].name.toLowerCase()+'Icon.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
								+'<span style="vertical-align:middle;">'+type[key].name+'</span>';
    optionElement1.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"","'+type[key].name+'")');
    document.getElementById('type-list-one').appendChild(optionElement1);


    var optionElement2 = document.createElement('li');
    optionElement2.value = type[key].name;
	optionElement2.innerHTML = '<img src="./img/types/'+type[key].name.toLowerCase()+'Icon.png" height="20" width="20" style="vertical-align:middle;">&nbsp;&nbsp;'
								+'<span style="vertical-align:middle;">'+type[key].name+'</span>';
    optionElement2.setAttribute('onmousedown', 'selectPokedex(this.parentElement,"","'+type[key].name+'")');
    document.getElementById('type-list-two').appendChild(optionElement2);
}

// show the unordered list when the search input is selected
function showList(searchBar) {
    if(firstOption === 'compare') {
        if(searchBar.id.includes('one')) {
            document.getElementById(secondOption+'-list-one').setAttribute('style', 'display: block;');
            document.querySelector('div#'+firstOption+'-'+secondOption+'-dropdown'+' div.search-wrapper:nth-of-type(2)').setAttribute('style', 'display: none');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-one').classList.remove('fa-caret-up');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-one').classList.add('fa-caret-down');
        }
        else {
            document.getElementById(secondOption+'-list-two').setAttribute('style', 'display: block;');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-two').classList.remove('fa-caret-up');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-two').classList.add('fa-caret-down');
        }
    }
    else {
        document.getElementById(secondOption+'-list').setAttribute('style', 'display: block;');
		document.getElementById(firstOption+'-'+secondOption+'-arrow').classList.remove('fa-caret-up');
		document.getElementById(firstOption+'-'+secondOption+'-arrow').classList.add('fa-caret-down');
    }
}

// hide the unordered list when the search input is not selected
function hideList(searchBar) {
    if(firstOption === 'compare') {
        if(searchBar.id.includes('one')) {
            document.getElementById(secondOption+'-list-one').setAttribute('style', 'display: none;');
            document.querySelector('div#'+firstOption+'-'+secondOption+'-dropdown'+' div.search-wrapper:nth-of-type(2)').setAttribute('style', 'display: ""');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-one').classList.remove('fa-caret-down');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-one').classList.add('fa-caret-up');
        }
        else {
            document.getElementById(secondOption+'-list-two').setAttribute('style', 'display: none;');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-two').classList.remove('fa-caret-down');
			document.getElementById(firstOption+'-'+secondOption+'-arrow-two').classList.add('fa-caret-up');
        }
    }
    else {
        document.getElementById(secondOption+'-list').setAttribute('style', 'display: none;');
		document.getElementById(firstOption+'-'+secondOption+'-arrow').classList.remove('fa-caret-down');
		document.getElementById(firstOption+'-'+secondOption+'-arrow').classList.add('fa-caret-up');
    }
	
}

// filter the lists when input is typed into the search bar
function searchPokedex(searchBar) {
    var input, filter, ul, li;
    if(firstOption === 'compare') {
        if(searchBar.id.includes('one')) {
            input = document.getElementById(firstOption+'-'+secondOption+'-search-one');
            ul = document.getElementById(secondOption+'-list-one');
        } 
        else {
            input = document.getElementById(firstOption+'-'+secondOption+'-search-two');
            ul = document.getElementById(secondOption+'-list-two');
        }
    }
    else {
        input = document.getElementById(firstOption+'-'+secondOption+'-search');
        ul = document.getElementById(secondOption+'-list');
    }
    filter = input.value.toLowerCase();
    li = ul.getElementsByTagName('li');

    for (i = 0; i < li.length; i++) {
        var txtValue = li[i].textContent;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {
            li[i].setAttribute('style', 'display: "";');
        } 
        else {
            li[i].setAttribute('style', 'display: none;');
        }
    }

}

// execute functions when a list item is selected
function selectPokedex(ul, optionId, optionName) {
	var searchBar;
    if(firstOption === 'compare') {
        if(ul.id.includes('one')) {
            document.getElementById(firstOption+'-'+secondOption+'-search-one').value = optionName;
			searchBar = firstOption+'-'+secondOption+'-search-one';
			value = optionName;
			firstValue = true;
        }
        else {
            document.getElementById(firstOption+'-'+secondOption+'-search-two').value = optionName;
			searchBar = firstOption+'-'+secondOption+'-search-two';
			secondValue = true;
        }
    }
    else {
        document.getElementById(firstOption+'-'+secondOption+'-search').value = optionName;
		searchBar = firstOption+'-'+secondOption+'-search';
		value = optionName;
		firstValue = true;
    }
    hideList(ul);
    resetFilter(ul);
	if(secondOption == 'pokemon') {
		selectedPokemon(optionId, searchBar);
	}
	else {
		selectedType(optionName, searchBar);
	}
	changeGraphTitle();
}

// reset the filtered list
function resetFilter(ul) {
    li = ul.getElementsByTagName('li');
    for(i = 0; i < li.length; i++) {
        li[i].setAttribute('style', 'display: "";');
    }
}


// default chart values
RadarChart.defaultConfig.color = function() {};
RadarChart.defaultConfig.radius = 2.8;

//Display the health points, attack, defense, special attack, special defense, and speed of the pokemon or type
function displayChart(statData){

	if(statData.default == true){
		sessionStorage.removeItem("first");
		sessionStorage.removeItem("second");
	}
	
	d3.selectAll("svg").remove();
	var first = sessionStorage.getItem("first");
	var second = sessionStorage.getItem("second");
	
	if(statData.graphTitle == "graph-title1"){
		sessionStorage.setItem("first",  JSON.stringify(statData));
		first = sessionStorage.getItem("first");
	}
	else if(statData.graphTitle == "graph-title2"){
		sessionStorage.setItem("second",  JSON.stringify(statData));
		second = sessionStorage.getItem("second");
	}
	
	if(first != null && second != null){
		first = JSON.parse(first);
		second = JSON.parse(second);

		var data = [
		  {
			className: first.name,
			number: first.pokedex_number,
			axes: [
			  {axis: "HP", value: first.HP}, 
			  {axis: "Attack", value: first.Atk}, 
			  {axis: "Defense", value: first.Def},  
			  {axis: "Sp. Attack", value: first.SpAtk}, 
			  {axis: "Sp. Defense", value: first.SpDef}, 		  
			  {axis: "Speed", value: first.Spd}
			]
		  }
		  ,{
			className: second.name,
			number: second.pokedex_number,
			axes: [
			  {axis: "HP", value: second.HP}, 
			  {axis: "Attack", value: second.Atk}, 
			  {axis: "Defense", value: second.Def},  
			  {axis: "Sp. Attack", value: second.SpAtk}, 
			  {axis: "Sp. Defense", value: second.SpDef}, 		  
			  {axis: "Speed", value: second.Spd}
			]
		  }
		];

	}
	else{
		var data = [
		  {
			className: statData.name,
			number: statData.pokedex_number,
			axes: [
			  {axis: "HP", value: statData.HP}, 
			  {axis: "Attack", value: statData.Atk}, 
			  {axis: "Defense", value: statData.Def},  
			  {axis: "Sp. Attack", value: statData.SpAtk}, 
			  {axis: "Sp. Defense", value: statData.SpDef}, 		  
			  {axis: "Speed", value: statData.Spd}
			]
		  }
		];
		
	}
	
    function mapData() {
      return data.map(function(d) {
        return {
          className: d.className,
		  number: d.number,
          axes: d.axes.map(function(axis) {
            return {axis: axis.axis, value: axis.value};
          })
        };
      });
    }
	

	var chart = RadarChart.chart();
	var svg = d3.select('#chart').append('svg')
		.attr('width', 600)
		.attr('height', 550)
	svg.append('g').attr("style", "transform: translate(5%, 8%);").classed('single', 1).datum(mapData()).call(chart);
	
}

