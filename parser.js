/**
 * Parser Skript
 * Permet d'appliquer des classes de coloration syntaxique au code
 * Ecris par Uneo7
**/
let code = $('pre').html();

// Chaines entre guillemets
	// Remplacement de tous les guillements par lur représentation HTML (evite les conflits plus tard)
	code = code.replace(
		/"/gim, 
		'&quot;'
	);
	// Force les chaines entre guillement à rester grises
	code = code.replace(/&quot;(.*)&quot;/gi, match => {
		const split = match.split(/&quot;/gi);
		split.shift();
		split.pop();

		if (split.length === 1) {
			return `<span class="gray">&quot;${split[0].trim()}&quot;</span>`;
		}
		
		match = '';

		for (let i in split) {
			if (i % 2 === 0) {
				match += `<span class="gray">&quot;${split[i].trim()}&quot;</span>`;
				continue;
			}

			match += ' ' + split[i].trim() + ' ';
		}

		return match;
	});

// Fonctions
	// Retour
	code = code.replace(
		/(function.*::\s{0,})(.*):/gim, 
		'$1<span class="blue">$2</span>:'
	);
	// Signature
	code = code.replace(
		/^function\s(\w{1,})(\(.*\))\s{0,}:/gim, 
		'function <span class="yellow">$1</span><span class="blue">$2</span>:'
	);

// Conditions / Boucles
	// While if else elseif
	code = code.replace(
		/(while|if|else|else if)/gi, 
		'<span class="orange">$1</span>'
	);

	// Boucles
	code = code.replace(/(loop\s(.*)\stimes\s{0,}:)|(loop(.*)\s{0,}:)/gi, (match, p1, p2, p3, p4) => {
		if (p1 === undefined && p2 === undefined) {
			return `<span class="orange">loop</span><span class="green">${p4}</span>:`
		}

		if (p3 === undefined && p4 === undefined) {
			return `<span class="orange">loop</span><span class="green">${p2}</span><span class="orange">times</span>:`
		}			
	});

// Mot clef
	// Tous les events qui ne comment pas par: on, command, function, options, variables
	code = code.replace(
		/^(?!on|command|function|options|variables|[\s]+)(.*):/gim, 
		'<span class="yellow">$1</span>:'
	);
	// Events on
	code = code.replace(
		/^(on)(.*)(:)/gim, 
		'$1<span class="yellow">$2</span>$3'
	);
	// on, command, function, options, variables
	code = code.replace(
		/^(on|command|function|variables|options)/gim, 
		'<span class="red">$1</span>'
	);

	// Modifiers
	code = code.replace(
		/(\sadd\s|\sgive\s|\sincrease\s|\sset\s|\sremove\s|\ssubstract\s|\sreduce\s|\sdelete\s|\sclear\s|\sreset\s|\sfrom\s|\sof\s|\swith\s|\sin\s|\sfor\s|\sby\s|\sto\s)/gi, 
		'<span class="dark-blue">$1</span>'
	);

// Variables
	// Globale
	code = code.replace(
		/({(?!_)\w{1,}})/gi, 
		'<span class="purple">$1</span>'
	);
	// Locale
	code = code.replace(
		/({_\w{1,}})/gi, 
		'<span class="dark-gray">$1</span>'
	);
	// Option
	code = code.replace(
		/({@\w{1,}})/gi, 
		'<span class="cyan">$1</span>'
	);

// Comentaires
code = code.replace(/(#.*)/gi, (match, p1, p2) => {
	const split = match.split(/</gi);

	if(split.length === 1) return `<span class="dark-green">${match}</span>`;

	let comment = [];
	for(let i in split) {
		let elem = split[i].replace(/^span\sclass=".*">/gi, '');
		elem = elem.replace(/^\/span>/gi, '');
		comment.push(elem.trim());
	}

	return `<span class="dark-green">${comment.join(' ')}</span>`;
});

$('pre').html(code);
