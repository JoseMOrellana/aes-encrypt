 //Input related elements
const stringInputBox = document.querySelector('#input-string')
const stringIcon = document.querySelector('#icon-span')
const cypherKeyInputArea = document.querySelector('#cypher-string-area')
const cypherInputBox = document.querySelector('#cypher-string')
const cypherIcon = document.querySelector('#cypher-icon-span')
const warningText = document.querySelector('#warning-text')
const submitButton = document.querySelector('#submit-button')
const resetButton = document.querySelector('#reset-button')

//Output related elements
const firstStateTable = document.querySelector('#first-state-table')
const cypherTable = document.querySelector('#cypher-table')
const resultOutput = document.querySelector('#result-output')
const resultMatrixesArea = document.querySelector('#results-area')
const resultButtons = document.querySelectorAll('.result-toggle')
const allArea = document.querySelector('#all-area');

const progressBar = document.querySelector('#progress-bar')

const resultButtonsArray = Array.from(resultButtons)

//Adding event listeners to the elements who serve as toggle buttons for the results
resultButtonsArray.map(resultButton => {
	resultButton.addEventListener('click', function (event) {
		replaceElementWithClass('selected', this)
		
		const area = getArea(this.getAttribute('id'));

		replaceElementWithClass('show', area )

		area.style.borderColor = window.getComputedStyle(this).backgroundColor;
	})
})

//Adding event listeners to both text input box
stringInputBox.addEventListener('keyup', (e) => {
	if (stringInputBox.value.length !== 16) {
		inputIsInvalid( stringInputBox, stringIcon)
		cypherKeyInputArea.style.display = "none"
	} else {
		inputIsValid(stringInputBox, stringIcon )
		cypherKeyInputArea.style.display = "block"
		if (cypherInputBox.value.length == 16) {
			submitButton.disabled = false
		}
	}
})

cypherInputBox.addEventListener('keyup', (e) => {
	if (cypherInputBox.value.length !== 16) {
		inputIsInvalid( cypherInputBox, cypherIcon)
	} else {
		inputIsValid( cypherInputBox, cypherIcon)
		submitButton.disabled = false
	}	
})

//For resetting all inputs as well as hiding all previous result related elements
resetButton.addEventListener('click', () => {
	
	resetInputs()
	resetTables()
	resultOutput.innerHTML = ""
	resultMatrixesArea.style.display = "none"
})

//Logic for the AES encryption algorithm, triggered when an user submits input info
submitButton.addEventListener('click', (e) => {
	const N = 10

	e.preventDefault()

	if ( allArea.childElementCount === 0) {
		createTables()	
	}

	const { strMatrix, cypherKeyMatrix, roundResultMatrixes, subBytesMatrixes,
			shiftedRowsMatrixes, columnMixedMatrixes, subkeysMatrixes, result} = cypher( stringInputBox.value, cypherInputBox.value, N)

	printMatrix(strMatrix, "state")
	printMatrix(cypherKeyMatrix, "key")

	printAllResults(roundResultMatrixes, 'round-result')
	printAllResults(subBytesMatrixes, 'sub-bytes')
	printAllResults(shiftedRowsMatrixes, 'shift-row')
	printAllResults(columnMixedMatrixes, 'mix-column')
	printAllResults(subkeysMatrixes, 'sub-keys')

	resultOutput.innerHTML = result
	
	displayResultButtons()
	allArea.classList.add('show');
	resultMatrixesArea.style.display = "block"

	progressBar.style.width = "0";
})

//Function that replaces which element has a given class name
const replaceElementWithClass = ( className, next ) => {
	const current = document.querySelector("." + className)
	current.classList.remove(className)
	next.classList.add(className)
}

const getArea = ( id ) => {
	return document.querySelector('#' + id + '-area')
}

//Function that display visual cues for when the input given by an user is STILL INVALID
const inputIsInvalid = ( input, inputIcon ) => {
	submitButton.disabled = true
	input.classList.remove('valid-input-box')
	warningText.innerHTML = "(La cadena debe tener exactamente 16 caracteres)"
	inputIcon.innerHTML = "<i class='fas fa-times-circle invalid-icon-color'></i>"
}

//Function that display visual cues for when the input given by an user is FINALLY VALID
const inputIsValid = ( input, inputIcon ) => {
	input.classList.add('valid-input-box')
	inputIcon.innerHTML = "<i class='fas fa-check-circle valid-icon-color'></i>"
	warningText.innerHTML = ""
}

const resetInputs = () => {
	stringInputBox.value = ""
	stringIcon.innerHTML = "<i class='fas fa-times-circle invalid-icon-color'></i>"
	stringInputBox.className = "invalid-input-box"

	cypherKeyInputArea.style.display = "none"
	cypherInputBox.value = ""
	cypherInputBox.className = "invalid-input-box"
	cypherIcon.innerHTML = ""

	submitButton.disabled = true

	warningText.innerHTML = "(La cadena debe tener exactamente 16 caracteres)"
}

const resetTables = () => {
	for (let i = 1; i < 5; i++) {
		for (let j = 0; j < 4; j++) {
			firstStateTable.rows[i].cells[j].innerHTML = ""
			cypherTable.rows[i].cells[j].innerHTML = ""
		}
	}
}

const createTables = () => {
	const tableConfig = [
		{
			title: 'Round',
			idPrefix: 'round-result'
		},
		{
			title: 'Sub Bytes',
			idPrefix: 'sub-bytes'
		},
		{
			title: 'Shift Rows',
			idPrefix: 'shift-row'
		},
		{
			title: 'Mix Column',
			idPrefix: 'mix-column'
		},
		{
			title: 'Sub Key',
			idPrefix: 'sub-keys'
		},
	]

	for (let i = 0; i < 10; i++) {
		tableConfig.forEach(config => {
			const boxId = config.idPrefix + String(i);
			const table = 
			`<div class="result-table">
				<table style="width: 100%;">
					<tr>
						<th colspan="4" class=${config.idPrefix}>${config.title + " " + (i + 1)}</th>
					</tr>
					<tr>
						<td class=${boxId + '00'}></td>
						<td class=${boxId + '01'}></td>
						<td class=${boxId + '02'}></td>
						<td class=${boxId + '03'}></td>
					</tr>
					<tr>
						<td class=${boxId + '10'}></td>
						<td class=${boxId + '11'}></td>
						<td class=${boxId + '12'}></td>
						<td class=${boxId + '13'}></td>
					</tr>
					<tr>
						<td class=${boxId + '20'}></td>
						<td class=${boxId + '21'}></td>
						<td class=${boxId + '22'}></td>
						<td class=${boxId + '23'}></td>
					</tr>
					<tr>
						<td class=${boxId + '30'}></td>
						<td class=${boxId + '31'}></td>
						<td class=${boxId + '32'}></td>
						<td class=${boxId + '33'}></td>
					</tr>
				</table>
				<div class=${'current-string-' + boxId}></div>
			</div>`

			allArea.innerHTML += table;
			document.querySelector("#" + config.idPrefix + "-area").innerHTML += table;
		})
		allArea.innerHTML += '<hr />'
	}
}

const printMatrix = (matrix, str) => {
	matrix.map((array, i) => {
		array.map((element, j) => {
			let box = document.getElementById(str + i + j)
			box.innerHTML = element.padStart(2, "0")
		})
	})
}



