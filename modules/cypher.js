//Function that generates all subkeys, given the initial key and the number of subkeys to generate
const generateSubkeys = (initialKey, n) => {
	
	keysArray = [[],[],[],[],[],[],[],[],[],[]]
	let matrix = []
	let array = []
	for (let i = 0; i < n; i++) {
		i == 0 ? matrix = initialKey : matrix = keysArray[i - 1]
		
		keysArray[i] = [ [], [], [], []]
		array = getRotatedColumn(matrix, 3)
		sboxArray = array.map((element) => {
						return sbox[parseInt(element, 16)]
					})
		rconArray = rcon[i]
		let firstRow = xorArrays(xorArrays(getColumn(matrix, 0),sboxArray), rconArray)
		keysArray[i] = setColumn(keysArray[i], firstRow, 0)
		for (let j = 1; j < 4; j++) {
			let row = xorArrays(getColumn(matrix, j), getColumn(keysArray[i], j - 1))
			keysArray[i] = setColumn(keysArray[i],row, j)
		}
	}
	return keysArray
}

//Function that given two arrays applies XOR operation to every one of their elements
const xorArrays = (array1, array2) => {
	return array1.map((element, i) => {
		let val = parseInt(element, 16) ^ parseInt(array2[i], 16)
		return val.toString(16)
	})
}

const setColumn = (matrix, column, n) => {
	column.map( (element, i) => {
		matrix[i][n] = element
	})

	return matrix
} 

const getRotatedColumn = (matrix, n) => {
	let columnArray = getColumn(matrix, n)
	columnArray.push(columnArray.shift())
	return columnArray
}

const getColumn = (matrix, n) => {
	let previousMatrix = [...matrix]
	columnArray = []
	previousMatrix.map((array) => {
		columnArray.push(array[n])
	})

	return columnArray
}

const addRoundKey = (matrix, cypherMatrix) => {
	let resultMatrix = [ [], [], [], []]
	matrix.map((array, i) => {
		array.map((element, j) => {
			let val = parseInt(element, 16) ^ parseInt(cypherMatrix[i][j], 16)
			resultMatrix[i][j] = val.toString(16) 
		})
	})

	return resultMatrix
}

const subBytes = matrix => {
	let resultMatrix = [ [], [], [], []]
	matrix.map((array, i) => {
		array.map((element, j) => {
			resultMatrix[i][j] = sbox[parseInt(element, 16)] 
		})
	})

	return resultMatrix
}

const shiftRows = matrix => {
	let resultMatrix = matrix
	matrix.map((array, i) => {
		for (let j = 0; j < i; j++) {
			array.push(array.shift())	
		}
	})

	return resultMatrix
}

const mixColumns = matrix => {
	let mtx = [
	[ '2', '3', '1', '1'],
	[ '1', '2', '3', '1'],
	[ '1', '1', '2', '3'],
	[ '3', '1', '1', '2']]

	let resultMatrix = [ [], [], [], []]

	for (let i = 0; i < 4; i++) {
		array1 = getColumn(matrix, i)
		for (let j = 0; j < 4; j++) {
			array2 = mtx[j]
			resultMatrix[j][i] = multiplyColumns(array1, array2).toString(16)
		}
	}

	return resultMatrix
}

const multiplyColumns = ( array1, array2 ) => {
	let result = array1.reduce((sum, val, index) => {
		val = parseInt(val, 16)
		switch (array2[index]) {
			case '1':
				return sum ^ val
			case '2':
				value = multiplyBy2(val)
				return sum ^ value

			case '3': 
				value = multiplyBy2(val)
				value = value ^ val
				return sum ^ value

		}
	}, 0)
	return result
}

const multiplyBy2 = (val) => {
	value = val * 2
	if ( val > 127) {
		value = value.toString(2)
		value = value.split("")
		value.shift()
		value = value.join("")
		value = parseInt(value, 2)
		return value ^ 27
	}
	return value 	
}

const initializeMatrix = (n) => {
	let matrix = []
	for (let i = 0; i < n; i++) {
		matrix[i] = new Array()
	}

	return matrix
}

const generateMatrixFromStr = (str) => {
	const charArray = str.split("")

	const hexArray = charArray.map(element => element.charCodeAt(0).toString(16))

	const column1 = hexArray.slice(0,4)
	const column2 = hexArray.slice(4,8)
	const column3 = hexArray.slice(8,12)
	const column4 = hexArray.slice(12,16)

	let matrix = [[],[],[],[]]
	matrix = setColumn(matrix, column1, 0)
	matrix = setColumn(matrix, column2, 1)
	matrix = setColumn(matrix, column3, 2)
	matrix = setColumn(matrix, column4, 3)

	return matrix
}

const generateStrFromMatrix = matrix => {
	let array = [... getColumn(matrix, 0), ... getColumn(matrix, 1), ... getColumn(matrix, 2), ... getColumn(matrix, 3)]
	array = fixSingleValHex(array)
	let result = array.join("")

	return result 
}

const fixSingleValHex = array => {
	return array.map((element) => {
		if(element.length < 2) {
			return "0" + element
		}
		return element
	})
}

const printAllResults = (matrix, str) => {
	for (let i = 0; i < 10; i++) {
		matrix[i].map((array, j) => {
			array.map((element, k) => {
				let boxes = document.getElementsByClassName( str + i + j + k)
				boxes = Array.from(boxes)
				boxes.forEach(box => {
					box.innerHTML = element.padStart(2,"0")
				})
			}) 
		})
		let currentStrPlaces = document.querySelectorAll('.current-string-' + str + i)
		currentStrPlaces = Array.from(currentStrPlaces)
		const currentStr = generateStrFromMatrix(matrix[i])
		currentStrPlaces.map(place => {
			place.innerHTML = currentStr
		})
	}
}

const displayResultButtons = () => {
	resultButtons.forEach( resultButton => {
		resultButton.style.display = 'inline-block';
	})
}

var subkeysMatrixes, subBytesMatrixes, shiftedRowsMatrixes, columnMixedMatrixes, roundResultMatrixes;


const cypher = ( str, cypherKey, rounds = 10) => {
	// let cypherKeyMatrix = [
	// 	['2B', '28', 'AB', '09'],
	// 	['7E', 'AE', 'F7', 'CF'],
	// 	['15', 'D2', '15', '4F'],
	// 	['16', 'A6', '88', '3C']
	// ]

	// let strMatrix = [ 
	// ['32', '88', '31', 'E0'], 
	// ['43', '5A', '31', '37'], 
	// ['F6', '30', '98', '07'], 
	// ['A8', '8D', 'A2', '34']]

	const strMatrix = generateMatrixFromStr(str)
	const cypherKeyMatrix = generateMatrixFromStr(cypherKey)
	subkeysMatrixes = generateSubkeys(cypherKeyMatrix, rounds)
	subBytesMatrixes = initializeMatrix(rounds)
	shiftedRowsMatrixes = initializeMatrix(rounds)
	columnMixedMatrixes = initializeMatrix(rounds)
	roundResultMatrixes = initializeMatrix(rounds)

	


	roundResultMatrixes[0] = addRoundKey(strMatrix, cypherKeyMatrix)
	
	for (let i = 0; i < rounds - 1; i++) {
		subBytesMatrixes[i] = subBytes(roundResultMatrixes[i])
		shiftedRowsMatrixes[i] = shiftRows(subBytesMatrixes[i])
		columnMixedMatrixes[i] = mixColumns(shiftedRowsMatrixes[i])
		roundResultMatrixes[i + 1] = addRoundKey( columnMixedMatrixes[i], subkeysMatrixes[i])
	}
	subBytesMatrixes[rounds - 1] = subBytes(roundResultMatrixes[rounds - 1])
	shiftedRowsMatrixes[rounds - 1] = shiftRows(subBytesMatrixes[rounds - 1])
	let finalMatrix = addRoundKey( shiftedRowsMatrixes[rounds - 1], subkeysMatrixes[rounds - 1])


	
	let result = generateStrFromMatrix(finalMatrix)

	return {
		strMatrix,
		cypherKeyMatrix,
		subkeysMatrixes,
		subBytesMatrixes,
		shiftedRowsMatrixes,
		columnMixedMatrixes,
		roundResultMatrixes,
		finalMatrix,
		result
	}
	
}
