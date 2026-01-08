document.addEventListener("DOMContentLoaded",function(){

    const searchButton = document.getElementById("search-button");
    const usernameInput  = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel1 = document.getElementById("easy-label");
    const mediumLabel1 = document.getElementById("medium-label");
    const hardLabel1 = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    statsContainer.style.display = "none";

    function validateUsername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_]{1,30}$/;
        const isMatching = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }
        
   async function fenchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

    try {
        statsContainer.style.display = "none"; 
        searchButton.textContent = "Searching...";
        searchButton.disabled = true;

        const response = await fetch(url);
        const data = await response.json();

        console.log("API Data:", data);

        if (!response.ok || !data || data.errors) {
            alert("User not found");
            return;
        }

        displayUserData(data);
        statsContainer.style.display = "block"; 

    } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong");
    } finally {
        searchButton.textContent = "Search";
        searchButton.disabled = false;
    }
}


    function updateProgress(solved, total, label, circle) {
        if(!total || total === 0){
            circle.style.setProperty("--progress-degree", `0%`);
            label.textContent = `0/0`;
            return;
        }
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayUserData(passedData){

        const totalHardQues = passedData.totalHard;
        const totalMediumQues = passedData.totalMedium;
        const totalEasyQues = passedData.totalEasy;

        const myEasySolved = passedData.easySolved;
        const myMediumSolved = passedData.mediumSolved;
        const myHardSolved = passedData.hardSolved;   

        updateProgress(myEasySolved, totalEasyQues, easyLabel1, easyProgressCircle);
        updateProgress(myMediumSolved, totalMediumQues, mediumLabel1, mediumProgressCircle);
        updateProgress(myHardSolved, totalHardQues, hardLabel1, hardProgressCircle);

        cardStatsContainer.innerHTML = `
            <div class="stat-card">

                <div class="user-info">
                    <h3>Total Solved</h3>   
                    <p>${passedData.totalSolved}</p>
                </div>

                <div class="user-info">
                    <h3>Acceptance Rate</h3>
                    <p>${passedData.acceptanceRate}%</p>
                </div>

                <div class="user-info">
                    <h3>Ranking</h3>
                    <p>${passedData.ranking}</p>
                </div>

            </div>      
        `;
    }

    searchButton.addEventListener("click", function() {
        const username = usernameInput.value;
        if(validateUsername(username)){
            fenchUserDetails(username);
        }
    });

});
