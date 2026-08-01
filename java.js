document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");

    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-card");

    statsContainer.style.display = "none";

    function validateUsername(username) {

        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_]{1,30}$/;

        if (!regex.test(username)) {
            alert("Invalid Username");
            return false;
        }

        return true;
    }

    async function fetchUserDetails(username) {

        const url = `https://leetcode-stats.tashif.codes/${username}/profile`;

        try {

            searchButton.disabled = true;
            searchButton.textContent = "Searching...";
            statsContainer.style.display = "none";

            const response = await fetch(url);
            const data = await response.json();

            console.log(data);

            if (!response.ok || data.status !== "success") {
                throw new Error("User not found");
            }

            displayUserData(data);

            statsContainer.style.display = "block";

        } catch (error) {

            console.error(error);
            alert(error.message);

        } finally {

            searchButton.disabled = false;
            searchButton.textContent = "Search";
        }
    }

    function updateProgress(solved, total, label, circle) {

        const progress = (solved / total) * 100;

        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {

        const solved = data.submitStats.acSubmissionNum;

        const totalSolved = solved[0].count;
        const easySolved = solved[1].count;
        const mediumSolved = solved[2].count;
        const hardSolved = solved[3].count;

        // Current LeetCode totals
        const totalEasy = 890;
        const totalMedium = 1860;
        const totalHard = 940;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

        cardStatsContainer.innerHTML = `
        
            <div class="stat-card">

                <div class="user-info">
                    <h3>Username</h3>
                    <p>${data.username}</p>
                </div>

                <div class="user-info">
                    <h3>Total Solved</h3>
                    <p>${totalSolved}</p>
                </div>

                <div class="user-info">
                    <h3>Ranking</h3>
                    <p>${data.profile.ranking.toLocaleString()}</p>
                </div>

                <div class="user-info">
                    <h3>Reputation</h3>
                    <p>${data.profile.reputation}</p>
                </div>

                <div class="user-info">
                    <h3>Contribution Points</h3>
                    <p>${data.contributions.points}</p>
                </div>

            </div>

        `;
    }

    searchButton.addEventListener("click", function () {

        const username = usernameInput.value.trim();

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }

    });

    usernameInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {
            searchButton.click();
        }

    });

});
