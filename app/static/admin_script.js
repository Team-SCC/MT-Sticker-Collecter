document.addEventListener("DOMContentLoaded", function () {
    let currentStickerCount = 0;
    const stickerCountInput = document.getElementById("sticker-count");
    const teamSelect = document.getElementById("team-select");

    // Fetch teams and populate dropdown
    async function fetchTeams() {
        try {
            const response = await fetch("/load_teams_rank");
            const teams = await response.json();
            populateTeamSelect(teams);
            renderLeaderboard(teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    }

    async function secondfetchTeams() {
        try {
            const response = await fetch("/load_teams_rank");
            const teams = await response.json();
            renderLeaderboard(teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    }

    function populateTeamSelect(teams) {
        teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.name;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });
        // Set initial sticker count based on first team
        if (teams.length > 0) {
            currentStickerCount = teams[0].stickers;

        }
    }

    teamSelect.addEventListener("change", async function () {
        const selectedTeam = teamSelect.value;
        try {
            const response = await fetch(`/teams/${selectedTeam}`);
            const team = await response.json();
            currentStickerCount = team.stickers;
            stickerCountInput.value = 0;
        } catch (error) {
            console.error("Error fetching team data:", error);
        }
    });

    document.getElementById("increase-1").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0; // NaN일 경우 0으로 처리
        stickerCountInput.value = currentValue + 1;
    });
    
    document.getElementById("increase-10").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue + 10;
    });
    
    document.getElementById("decrease-1").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue - 1; // 값이 0 이하로 내려가지 않도록 설정
    });
    
    document.getElementById("decrease-10").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue - 10;
    });

    // 업데이트 버튼을 클릭했을 때 스티커 수를 서버에 전송
    document.getElementById("update-stickers").addEventListener("click", async function () {
        const selectedTeam = teamSelect.value;
        try {
            const response = await fetch("/update_sticker", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedTeam,
                    stickers: parseInt(stickerCountInput.value)
                })
            });

            const result = await response.json();
            alert(`Stickers updated for ${result.name}: ${result.sticker}`);
            secondfetchTeams(); // 리더보드를 다시 로드하여 업데이트 반영
        } catch (error) {
            console.error("Error updating stickers:", error);
        }
    });

    // Leaderboard rendering function (similar to previous versions)
    function renderLeaderboard(teams) {
        const contentDiv = document.querySelector(".content");
        const ul = document.createElement("ul");
        contentDiv.innerHTML = "";  // Clear existing content

        teams.forEach((team, index) => {
            const li = document.createElement("li");
            const nameSpan = document.createElement("span");
            nameSpan.className = "name";
            nameSpan.textContent = team.name;

            const countSpan = document.createElement("span");
            countSpan.className = "count";
            countSpan.textContent = team.stickers;

            // Add class for top 3 positions
            if (index === 0) {
                li.classList.add("gold");
            } else if (index === 1) {
                li.classList.add("silver");
            } else if (index === 2) {
                li.classList.add("bronze");
            }

            li.appendChild(nameSpan);
            li.appendChild(countSpan);
            ul.appendChild(li);
        });

        contentDiv.appendChild(ul);
    }

    // Initial data fetch
    fetchTeams();
});