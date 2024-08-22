document.addEventListener("DOMContentLoaded", function () {
    let currentIndex = 0; // 현재 깜빡일 항목의 인덱스
    let totalItems = 0;   // 전체 항목 수

    // Leaderboard를 렌더링하는 함수
    function renderLeaderboard(teams) {
        const contentDiv = document.querySelector(".content");
        const ul = document.createElement("ul");
        contentDiv.innerHTML = "";  // 기존 내용을 제거하고 새로 그리기

        teams.forEach((team, index) => {
            const li = document.createElement("li");
            const nameSpan = document.createElement("span");
            nameSpan.className = "name";
            nameSpan.textContent = team.name;

            const countSpan = document.createElement("span");
            countSpan.className = "count";
            countSpan.textContent = team.stickers;

            // 1, 2, 3등에 맞는 클래스 추가
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

        // 총 항목 수 업데이트
        totalItems = teams.length;

        // 깜빡이는 애니메이션 시작
        startBlinkingAnimation();
    }

    // 순차적으로 모든 항목을 깜빡이게 하는 애니메이션
    function startBlinkingAnimation() {
        const listItems = document.querySelectorAll(".content ul li");

        function blinkNextItem(index) {
            // 모든 항목에서 animate 클래스를 제거
            listItems.forEach(item => item.classList.remove("animate"));

            // 현재 인덱스의 항목에 animate 클래스 추가
            listItems[index].classList.add("animate");

            // 다음 항목으로 이동
            index++;

            if (index < totalItems) {
                // 다음 항목을 500ms 후에 깜빡이게 함
                setTimeout(() => blinkNextItem(index), 500);
            } else {
                // 모든 항목이 깜빡였으면 2초 대기 후 다시 시작
                setTimeout(() => blinkNextItem(0), 2000);
            }
        }

        // 첫 번째 항목부터 깜빡이기 시작
        blinkNextItem(0);
    }

    // 서버에서 데이터를 가져와서 리더보드 렌더링
    async function fetchTeams() {
        try {
            const response = await fetch("/load_teams_rank");
            const teams = await response.json();
            renderLeaderboard(teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    }

    // 페이지 로드 시 데이터 가져오기
    fetchTeams();
});
