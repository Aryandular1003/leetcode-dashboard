document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");
    const errorMessage = document.getElementById("error-message");

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
            showError("Username cannot be empty");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,30}$/;
        if (!regex.test(username)) {
            showError("Invalid Username format");
            return false;
        }

        return true;
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = "block";
        statsContainer.style.display = "none";
    }

    function clearError() {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
    }

    async function fetchUserDetails(username) {
        const url = `https://leetcode-stats.tashif.codes/${username}/stats`;

        try {
            clearError();
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("User not found or API error");
            }

            const data = await response.json();

            if (data.status !== "success") {
                throw new Error(data.message || "User not found");
            }

            displayUserData(data);
            statsContainer.style.display = "block";

        } catch (err) {
            console.error(err);
            showError(err.message || "Something went wrong while fetching data");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle) {
        const progress = total > 0 ? (solved / total) * 100 : 0;
        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(data) {
        // Dynamic totals provided by the API
        const easySolved = data.easySolved || 0;
        const totalEasy = data.totalEasy || 0;

        const mediumSolved = data.mediumSolved || 0;
        const totalMedium = data.totalMedium || 0;

        const hardSolved = data.hardSolved || 0;
        const totalHard = data.totalHard || 0;

        const totalSolved = data.totalSolved || 0;

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
                <p>${data.ranking ? data.ranking.toLocaleString() : "N/A"}</p>
            </div>

            <div class="user-info">
                <h3>Acceptance Rate</h3>
                <p>${data.acceptanceRate ? data.acceptanceRate + "%" : "N/A"}</p>
            </div>

            <div class="user-info">
                <h3>Contribution Points</h3>
                <p>${data.contributionPoints ?? "N/A"}</p>
            </div>

            <div class="user-info">
                <h3>Reputation</h3>
                <p>${data.reputation ?? "N/A"}</p>
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
