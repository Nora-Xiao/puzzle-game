// This is the fifteen.js for the interaction side of the fifteen.html page which is about fifteen 
// Puzzle. It defines the responses of the web page when the page finishes loading, when the mouse 
// presses the movable puzzle tiles, when the user clicks the button for shuffling the puzzle 
// tiles, and when the mouse moves onto and out of different puzzle tiles.

"use strict";

(function() {
	let emptyRow = 3; /* the row number of the empty puzzle tile (initial number equals 3) */
	let emptyCol = 3; /* the column number of the empty puzzle tile (initial number equals 3) */
	const PUZZLE_SIZE = 4; /* the number of rows or the number of columns of the puzzle */
	const TILE_PIXELS = 100; /* the width or the height of each puzzle tile in pixels */

	/**
	 * Returns the DOM element with the given id.
	 *
	 * @param {string} id - the id of the DOM element to retrieve
	 * @return {object} the DOM object with the given id 
	 */
	function $(id) {
		return document.getElementById(id);
	}

	/**
	 * Creates and returns the DOM element with the given tag name and the given parent element.
	 *
	 * @param {string} tag - the tag name of the DOM element
	 * @param {string} parent - the id of the parent element
	 * @return {object} the DOM object with the given tag name and the given parent element
	 */
	function addElement(tag, parent) {
		let element = document.createElement(tag);
		$(parent).appendChild(element);
		return element;
	}

	/** 
	 * Defines the responses of the web page when the page finishes loading, when the mouse presses
	 * the movable puzzle tiles, when the user clicks the button for shuffling the puzzle tiles, 
	 * and when the mouse moves onto and out of different puzzle tiles.
	 */ 
	window.onload = function() {
		addTiles();
		addImgAttribution();
		$("shuffle-button").onclick = shuffleTiles;
	};

	/** 
	 * Adds the puzzle tiles to the page. Defines the responses of the web page when the mouse 
	 * presses the movable puzzle tiles, and when the mouse moves onto and out of different puzzle
	 * tiles.
	 */ 
	function addTiles() {
		for (let row = 0; row < emptyRow; row++) {
			for (let col = 0; col < PUZZLE_SIZE; col++) {
				addOneTile(row, col);
			}
		}
		for (let col = 0; col < emptyCol; col++) {
			addOneTile(emptyRow, col);
		}
		changeHover("unmovable", "movable");
	}

	/**
	 * Adds one puzzle tile with the given row number and the given column number to the page. 
	 * Defines the response of the web page when the mouse presses the tile. The tile has its
	 * corresponding tile number and its corresponding portion of the background picture.
	 *
	 * @param {number} row - the row number of the puzzle tile
	 * @param {number} col - the column number of the puzzle tile
	 */
	function addOneTile(row, col) {
		let tile = addElement("div", "puzzle-area");
		tile.classList.add("tile");
		tile.classList.add("unmovable");
		tile.style.backgroundPosition = (-TILE_PIXELS * col) + "px " + (-TILE_PIXELS * row) + "px";
		setTilePosition(tile, row, col);
		let tileNumber = addElement("p", tile.id);
		tileNumber.innerText = "" + (row * PUZZLE_SIZE + (col + 1));
		tile.onmousedown = pressTile;
	}

	/** 
	 * If the puzzle tile is movable (directly up, down, left or right from the empty tile), 
	 * the tile is moved to where the empty tile is, and the original position of the tile becomes 
	 * where the empty tile is now. Updates the responses of the web page when the mouse moves onto 
	 * and out of different puzzle tiles based on whether they are movable now.
	 */ 
	function pressTile() {	
		if (this.classList.contains("movable")) {
			changeHover("movable", "unmovable");
			moveTile(this);			
			changeHover("unmovable", "movable");
		}
	}

	/** 
	 * Shuffles the puzzle tiles to make the puzzle tiles positioned in random order and at 
	 * the same time, valid and solvable. 
	 */ 
	function shuffleTiles() {
		changeHover("movable", "unmovable");	
		for (let i = 0; i < 1000; i++) {
			let neighbors = findNeighbors();
			/* pick a random movable puzzle tile */
			let tile = neighbors[parseInt(Math.random() * neighbors.length, 10)]; 
			moveTile(tile);
		}
		changeHover("unmovable", "movable");
	}

	/**
	 * Replaces the given old class of the movable puzzle tiles (directly up, down, left or right 
	 * from the empty tile) with the given new class.
	 *
	 * @param {string} oldClass - the old class name of the puzzle tiles
	 * @param {string} newClass - the new class name of the puzzle tiles
	 */
	function changeHover(oldClass, newClass) {
		let neighbors = findNeighbors();
		for (let i = 0; i < neighbors.length; i++) {
			neighbors[i].classList.remove(oldClass);
			neighbors[i].classList.add(newClass);
		}
	}

	/**
	 * Returns the array of movable puzzle tiles (directly up, down, left or right from the empty 
	 * tile) that exist. 
	 *
	 * @return {array} the array of movable puzzle tiles that exist
	 */
	function findNeighbors() {
		let upTile = returnTile((emptyRow - 1), emptyCol);
		let downTile = returnTile((emptyRow + 1), emptyCol);
		let leftTile = returnTile(emptyRow, (emptyCol - 1));
		let rightTile = returnTile(emptyRow, (emptyCol + 1));
		let potentialNeighbors = [upTile, downTile, leftTile, rightTile];
		let neighbors = [];
		for (let i = 0; i < potentialNeighbors.length; i++) {
			if (potentialNeighbors[i]) { /* if the tile exist */
				neighbors.push(potentialNeighbors[i]);
			}
		}
		return neighbors;
	}

	/**
	 * Returns the DOM element for the puzzle tile with the given row number and the given column
	 * number.
	 *
	 * @param {number} row - the row number of the tile
	 * @param {number} col - the column number of the tile
	 * @return {object} the DOM object for the puzzle tile with the given row number and the given
	 * 					column number
	 */
	function returnTile(row, col) {
		return $("square_" + row + "_" + col);
	}

	/**
	 * Moves the given tile to where the current empty tile is, and the original position of 
	 * the tile becomes where the empty tile is now. 
	 *
	 * @param {object} tile - the puzzle tile to be moved 
	 */
	function moveTile(tile) {
		let newEmptyRow = parseInt(tile.style.top, 10) / TILE_PIXELS;
		let newEmptyCol = parseInt(tile.style.left, 10) / TILE_PIXELS;
		setTilePosition(tile, emptyRow, emptyCol);
		emptyRow = newEmptyRow;
		emptyCol = newEmptyCol;
	}

	/**
	 * Moves the given tile to the given row and the given column.
	 *
	 * @param {object} tile - the puzzle tile to be moved
	 * @param {number} row - the new row number of the tile
	 * @param {number} col - the new column number of the tile
	 */
	function setTilePosition(tile, row, col) {
		tile.id = "square_" + row + "_" + col;
		tile.style.top = (row * TILE_PIXELS) + "px";
		tile.style.left = (col * TILE_PIXELS) + "px";
	}

	/** 
	 * Adds the background picture attribution to the page.
	 */ 
	function addImgAttribution() {
		$("copyright-info").appendChild(document.createTextNode("from "));
		let imgLink = addElement("a", "copyright-info");
		imgLink.href = "https://cdn.pixabay.com/photo/2017/02/22/20/02/landscape-2090495_1280.jpg";		
		imgLink.appendChild(document.createTextNode(imgLink.href));
	}
})();