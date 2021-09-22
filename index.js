import fetch from 'node-fetch';

let infiniteCastle = 'https://infinite-castles.herokuapp.com';
let castleEntry = '/castles/1/rooms/entry';
let fullChestCounter = 0;
let fullChestLocation = new Set();

//Use Depth Frist Search to make a graph traversal, by providing URL + Starting point, and a Set to keep a record of visited room
async function dfsInfiniteCastle(url, start, visited = new Set()) {
	//add current room into the visited set
	visited.add(start);
	//print the size of the visited set
	console.log(visited.size);

	console.log('Visiting :' + url + start);

	//create a chest array to register the chests of the current room
	let chests = [];

	//create a destinations array to register the "neighbors" of the current room
	let destinations = [];

	//search the room
	await searchRoom(url, start)
		.then((data) => {
			destinations = data.rooms;
			chests = data.chests;
			console.log('List of neighbors :');
			console.log(destinations);
			console.log('List of chests :');
			console.log(chests);
		})
		.catch((error) => console.log('ROOM SEARCHING ERROR'));

	//open all the chest inside of this room
	for (const chest of chests) {
		await openChest(url, chest, start)
			.then((data) => {
				console.log(data.status);
				//if I can ever find one chest which is not empty, I should count it and write down it's location
				if (!data.status == 'This chest is empty :/ Try another one!') {
					fullChestCounter++;
					fullChestLocation.add(start);
					console.log('========BINGO========BINGO========BINGO========');
				}
			})
			.catch((error) => console.log('CHEST ERROR'));
	}

	//call the function itself recursively until every room is visited
	for (const destination of destinations) {
		console.log('Moving to next destination :' + destination);
		if (!visited.has(destination)) {
			//wait for the response from the endpoint before proceding to the next step
			await dfsInfiniteCastle(url, destination, visited);
		}
	}
}

// Function to search the room, including the neighbors and the chests
async function searchRoom(url, currentRoom) {
	console.log('Searching the room : ' + currentRoom);
	const response = await fetch(url + currentRoom);
	const data = await response.json();
	return data;
}

async function openChest(url, currentChest, currentRoom) {
	console.log('Openning the chest : ' + currentChest);
	const response = await fetch(url + currentChest);
	const data = await response.json();
	return data;
}

//Let's roll the dice !!
dfsInfiniteCastle(infiniteCastle, castleEntry);
