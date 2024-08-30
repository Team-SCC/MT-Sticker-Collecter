document.addEventListener("DOMContentLoaded", function () {
    let currentStickerCount = 0;
    const stickerCountInput = document.getElementById("sticker-count");
    const teamSelect = document.getElementById("team-select");
    const teamSelectDelete = document.getElementById("team-select-delete")

    // 팀 목록 가져와서 드롭다운과 리더보드 갱신
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

    // 팀 선택 드롭다운 채우기
    function populateTeamSelect(teams) {
        teamSelect.innerHTML = ''; // 기존 옵션 삭제
        teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.name;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });

        teamSelectDelete.innerHTML = '';
        teams.forEach(team => {
            const option = document.createElement("option");
            option.value = team.name;
            option.textContent = team.name;
            teamSelectDelete.appendChild(option);
        });
        // // 첫 번째 팀의 스티커 수 설정
        // if (teams.length > 0) {
        //     currentStickerCount = teams[0].stickers;
        // }
    }

    // 팀 선택 시 스티커 수 초기화
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

    // 스티커 수 증가 및 감소 버튼 이벤트 처리
    document.getElementById("increase-1").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue + 1;
    });

    document.getElementById("increase-10").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue + 10;
    });

    document.getElementById("decrease-1").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue - 1;
    });

    document.getElementById("decrease-10").addEventListener("click", function () {
        let currentValue = parseInt(stickerCountInput.value) || 0;
        stickerCountInput.value = currentValue - 10;
    });

    // 스티커 수 업데이트 버튼 클릭 처리
    document.getElementById("update-stickers").addEventListener("click", async function () {
        const selectedTeam = teamSelect.value;
        try {
            const response = await fetch("/update_sticker", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: selectedTeam,
                    stickers: parseInt(stickerCountInput.value)
                })
            });

            const result = await response.json();
            alert(`${result.name}팀의 스티커가 ${result.sticker}개로 변경되었습니다.`);
            stickerCountInput.value = 0
            fetchTeams(); // 리더보드 업데이트 반영
        } catch (error) {
            console.error("Error updating stickers:", error);
        }
    });

    // 팀 생성 버튼 클릭 처리
    document.getElementById("create-team").addEventListener("click", async function () {
        const newTeamName = document.getElementById("new-team-name").value.trim();
        if (newTeamName) {
            try {
                const response = await fetch(`/create_team/${newTeamName}`, {
                    method: "POST"
                });

                const result = await response.json();
                if (result.detail == "success") {
                    alert(`${result.name} 팀이 생성되었습니다.`);
                    fetchTeams(); // 새로 생성된 팀 포함 리더보드와 셀렉트 박스를 갱신
                } else {
                    alert(`팀 생성 실패: ${result}`);
                }
            } catch (error) {
                console.error("Error creating team:", error);
            }
        } else {
            alert("팀 이름을 입력하세요.");
        }
    });

    // 팀 삭제 버튼 클릭 처리
    document.getElementById("delete-team").addEventListener("click", async function () {
        const selectedTeam = teamSelectDelete.value;
        if (selectedTeam) {
            if (confirm(`정말로 팀을 삭제하시겠습니까? ${selectedTeam}`)) {
                try {
                    const response = await fetch(`/delete_team/${selectedTeam}`, {
                        method: "DELETE"
                    });

                    const result = await response.json();
                    if (result.detail) {
                        alert(`${selectedTeam} 팀이 삭제되었습니다:`);
                        fetchTeams(); // 삭제된 팀 반영하여 리더보드와 셀렉트 박스를 갱신
                    } else {
                        alert(`팀 삭제 실패: ${result.detail}`);
                    }
                } catch (error) {
                    console.error("팀 삭제 실패:", error);
                }
            }
        } else {
            alert("삭제할 팀을 선택하세요.");
        }
    });

    // 리더보드를 렌더링하는 함수
    function renderLeaderboard(teams) {
        const contentDiv = document.querySelector(".content");
        const ul = document.createElement("ul");
        contentDiv.innerHTML = "";  // 기존 내용 삭제

        teams.forEach((team, index) => {
            const li = document.createElement("li");
            const nameSpan = document.createElement("span");
            nameSpan.className = "name";
            nameSpan.textContent = team.name;

            const countSpan = document.createElement("span");
            countSpan.className = "count";
            countSpan.textContent = team.stickers;

            // 상위 3개 팀에 대한 클래스 추가
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

    // 초기 데이터 가져오기
    fetchTeams();
});
