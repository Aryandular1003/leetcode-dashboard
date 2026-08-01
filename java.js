document.addEventListener("DOMContentLoaded", function () {

    const searchButton = document.getElementById("search-button");
    const usernameInput = document.getElementById("user-input");

    const statsContainer = document.querySelector(".stats-container");

    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");

    const easyLabel1 = document.getElementById("easy-label");
    const mediumLabel1 = document.getElementById("medium-label");
    const hardLabel1 = document.getElementById("hard-label");

    const cardStatsContainer = document.querySelector(".stats-card");

    statsContainer.style.display = "none";

    // Validate Username
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

    // Fetch User Details
    async function fenchUserDetails(username) {

        const url = `https://leetcode-stats.tashif.codes/${username}/profile`;

        try {

            statsContainer.style.display = "none";
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("User not found");
            }

            const data = await response.json();

            console.log("API Response:", data);

            displayUserData(data);

            statsContainer.style.display = "block";

        } catch (error) {
            console.error(error);
            alert("Failed to fetch user details.");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    // Update Circular Progress
    function updateProgress(solved, total, label, circle) {

        if (!total || total === 0) {
            circle.style.setProperty("--progress-degree", "0%");
            label.textContent = "0/0";
            return;
        }

        const progress = (solved / total) * 100;

        circle.style.setProperty("--progress-degree", `${progress}%`);
        label.textContent = `${solved}/${total}`;
    }

    // Display User Data
    function displayUserData(data) {

        const totalEasy = data.totalEasy;
        const totalMedium = data.totalMedium;
        const totalHard = data.totalHard;

        const easySolved = data.easySolved;
        const mediumSolved = data.mediumSolved;
        const hardSolved = data.hardSolved;

        updateProgress(
            easySolved,
            totalEasy,
            easyLabel1,
            easyProgressCircle
        );

        updateProgress(
            mediumSolved,
            totalMedium,
            mediumLabel1,
            mediumProgressCircle
        );

        updateProgress(
            hardSolved,
            totalHard,
            hardLabel1,
            hardProgressCircle
        );

        cardStatsContainer.innerHTML = `
            <div class="stat-card">

                <div class="user-info">
                    <h3>Total Solved</h3>
                    <p>${data.totalSolved}</p>
                </div>

                <div class="user-info">
                    <h3>Acceptance Rate</h3>
                    <p>${data.acceptanceRate}%</p>
                </div>

                <div class="user-info">
                    <h3>Ranking</h3>
                    <p>${data.ranking}</p>
                </div>

            </div>
        `;
    }

    // Search Button Click
    searchButton.addEventListener("click", () => {

        const username = usernameInput.value.trim();

        if (validateUsername(username)) {
            fenchUserDetails(username);
        }

    });

    // Press Enter to Search
    usernameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchButton.click();
        }
    });

});
