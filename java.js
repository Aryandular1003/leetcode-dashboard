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
            alert("Username cannot be empty");
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

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            const data = await response.json();

            console.log(data);

            if (data.status !== "success") {
                throw new Error("User not found");
            }

            displayUserData(data);

            statsContainer.style.display = "block";

        } catch (err) {

            console.log(err);
            alert("Something went wrong");

        } finally {

            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {

        const progress = (solved / total) * 100;

        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {

        const stats = data.submitStats.acSubmissionNum;

        const totalSolved = stats.find(item => item.difficulty === "All").count;
        const easySolved = stats.find(item => item.difficulty === "Easy").count;
        const mediumSolved = stats.find(item => item.difficulty === "Medium").count;
        const hardSolved = stats.find(item => item.difficulty === "Hard").count;

        // Current LeetCode totals
        const totalEasy = 890;
        const totalMedium = 1860;
        const totalHard = 940;

        updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
        updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
        updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

        cardStatsContainer.innerHTML = `
        
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
                <h3>Contribution Points</h3>
                <p>${data.contributions.points}</p>
            </div>

            <div class="user-info">
                <h3>Reputation</h3>
                <p>${data.profile.reputation}</p>
            </div>

            <div class="user-info">
                <h3>Real Name</h3>
                <p>${data.profile.realName || "N/A"}</p>
            </div>
        `;
    }

    searchButton.addEventListener("click", function () {

        const username = usernameInput.value.trim();

        if (validateUsername(username)) {
            fetchUserDetails(username);
        }

    });

    usernameInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            searchButton.click();
        }

    });

});
