const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");

const ROWS = 10;
const COLS = 10;
const spreadsheet = [];

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O","P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


class Cell {
	constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
		this.isHeader = isHeader;
		this.disabled = disabled;
		this.data = data;
		this.row = row;
		this.column = column;
		this.rowName = rowName;
		this.columnName = columnName;
		this.active = active;
	}
}

exportBtn.onclick = function (e) {
	const spreadsheetNameInput = document.querySelector('#ss-name');
	let spreadsheetName = spreadsheetNameInput.value;

	if (!spreadsheetName) {
		spreadsheetName = 'Spreadsheet';
	}

	let csv = "";
	for (let i = 0; i < spreadsheet.length; i++) {
		if(i === 0) continue; //첫번째 줄 없애기
		csv +=
			spreadsheet[i]
				.filter((item) => !item.isHeader)
				.map((item) => item.data)
				.join(",") + "\r\n";
	}

	console.log('csv:', csv)

	const csvObj = new Blob([csv])
	const csvUrl = URL.createObjectURL(csvObj)
	

	const a = document.createElement("a")
	a.href = csvUrl
	a.download = `${spreadsheetName}.csv`
	a.click()
}

initSpreadsheet();

function initSpreadsheet() {
	for(let i = 0; i < ROWS; i++) {
		let spreadsheetRow = [];
		for(let j = 0; j < COLS; j++) {
			let cellData = '';
			let isHeader = false;
			let disabled = false;

			// 모든 row 첫 번째 column에 숫자 넣기
			if(j === 0) {
				cellData = i;
				isHeader = true; // 첫번째 row는 header로
				disabled = true; 
			}
			// column에 알파벳 넣기
			if(i === 0) {
				cellData = alphabet[j-1];
				isHeader = true; // 첫번째 column도 header로
				disabled = true;
			}
			// cellData가 undefined이면 ""로 빈칸으로 두기
			if(!cellData) {
				cellData = "";
      }

			// 첫번째 row의 컬럼은 "";
			if(cellData <= 0) {
				cellData = "";
			}

			const rowName = i;
			const columnName = alphabet[j-1];

			const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName,false);
			spreadsheetRow.push(cell)
			// spreadsheetRow.push(i + "-" + j); // 0-0 0-1 0-2 ...
		}
		spreadsheet.push(spreadsheetRow);
	}
	drawSheet();
	console.log("spreadsheet", spreadsheet);
}


function createCellEl(cell) {
	const cellEl = document.createElement('input');
	cellEl.className = 'cell';
	cellEl.id = 'cell_' + cell.row + cell.column;
	cellEl.value = cell.data;
	cellEl.disabled = cell.disabled;

	if(cell.isHeader) {
		cellEl.classList.add('header');
	}

	cellEl.onclick = () => handleCellClick(cell);
	cellEl.onchange = (e) => handleOnchange(e.target.value, cell);

	
	return cellEl;
}

function handleOnchange(data, cell) {
	cell.data = data;
}



function handleCellClick(cell) {
	clearHeaderActiveState()
	const columnHeader = spreadsheet[0][cell.column];
	const rowHeader = spreadsheet[cell.row][0];
	const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
	const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

	columnHeaderEl.classList.add('active');
	rowHeaderEl.classList.add('active');
	// console.log("Cell clicked: ", columnHeaderEl, rowHeaderEl);
	document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName;
}


function clearHeaderActiveState() {
	const headers = document.querySelectorAll('.header');
	headers.forEach((header) => {
		header.classList.remove('active');
	})
}

function getElFromRowCol(row, col) {
	return document.querySelector("#cell_" + row + col);
}


function drawSheet() {
	for(let i = 0; i < spreadsheet.length; i++) {
		const rowContainerEl = document.createElement("div");
		rowContainerEl.className = "cell-row";

		for(let j = 0; j <spreadsheet[i].length; j++) {
			const cell = spreadsheet[i][j];
			rowContainerEl.append(createCellEl(cell));
			// spreadSheetContainer.append(createCellEl(cell));

		}
		spreadSheetContainer.append(rowContainerEl);
	}
}