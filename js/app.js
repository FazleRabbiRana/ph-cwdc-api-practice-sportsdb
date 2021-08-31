// load data on search
document.getElementById('search_btn').addEventListener('click', async () => {
	const searchInputField = document.getElementById('search_input');
	const searchText = searchInputField.value;
	searchInputField.value = '';

	if(searchText == '') {
		displayErrorNotice('Please type something to search.');
	} else {
		document.getElementById('error_notice').textContent = '';
		document.getElementById('all_teams').textContent = '';
		const url = `https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${searchText}`;
		try {
			const res = await fetch(url);
			const data = await res.json();
			displayTeams(data.teams);
		} catch (err) {
			displayErrorNotice();
			console.log(err);
		}
	}	
});

// display error notice
const displayErrorNotice = (errorMessage = 'Something went wrong. Try again later.') => {
	document.getElementById('error_notice').innerHTML = `
		<h5 class="text-danger my-4">${errorMessage}</h5>
	`;
}

// display teams
const displayTeams = teams => {
	// console.log(teams);
	const teamsContainer = document.getElementById('all_teams');
	if(teams) {
		teams.forEach(team => {
			// console.log(team);
			const singleTeam = document.createElement('div');
			singleTeam.classList.add('team', 'h-100', 'd-flex', 'flex-column', 'px-3', 'py-4');
			singleTeam.setAttribute('onclick', `loadTeamDetail(${team.idTeam})`);
			singleTeam.innerHTML = `
				<img src="${team.strTeamBadge}" alt="${team.strTeam} Team Badge" class="team-badge mx-auto flex-fill">
				<h4 class="team-name mt-3">${team.strTeam}</h4>
			`;
			teamsContainer.appendChild(singleTeam);
		});
	} else {
		displayErrorNotice('Sorry, nothing found!');
	}
}

// load team detail by id
const loadTeamDetail = async teamId => {
	const url = `https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${teamId}`;
	try {
		const res = await fetch(url);
		const data = await res.json();
		displayTeamDetail(data.teams[0]);
	} catch (err) {
		displayErrorNotice();
		console.log(err);
	}
}

// display team detail
const displayTeamDetail = team => {
	console.log(team);
	const detailContainer = document.getElementById('team_detail');
	detailContainer.classList.add('open');
	detailContainer.innerHTML = `
		<div class="team-detail-inner px-4 py-4 position-relative">
			<button type="button" onclick="closeDisplay()" id="detail_close_btn">X</button>
			<h3 class="team-name text-center mb-4">${team.strTeam}</h3>
			<div class="detail-heading detail-row text-center text-md-start">
				<img src="${team.strTeamBadge}" alt="${team.strTeam} badge" class="team-badge float-md-start me-md-4">
				<p class="team-desc mt-3 mt-md-0">${team.strDescriptionEN}</p>
			</div>
			<div class="detail-row d-flex flex-wrap py-2">
				<span class="label pe-2 mb-0">League:</span>
				<span class="value mb-0 text-right">${team.strLeague}</span>
			</div>
			<div class="detail-row d-flex flex-wrap py-2">
				<span class="label pe-2 mb-0">Stadium:</span>
				<span class="value mb-0 text-right">${team.strStadium}</span>
			</div>
			<div class="detail-row d-flex flex-wrap py-2">
				<span class="label pe-2 mb-0">Capacity:</span>
				<span class="value mb-0 text-right">${team.intStadiumCapacity}</span>
			</div>
			<div class="detail-row d-flex flex-wrap py-2">
				<span class="label pe-2 mb-0">Location:</span>
				<span class="value mb-0 text-right">${team.strStadiumLocation}</span>
			</div>
		</div>
	`;
}

// close team detail
const closeDisplay = () => document.getElementById('team_detail').classList.remove('open');