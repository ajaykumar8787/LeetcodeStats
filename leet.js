document.addEventListener("DOMContentLoaded", function () {
    const searchButton = document.getElementById("search-btn");
    const userInput = document.getElementById("user-input");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-progress");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const cardStatsContainer = document.querySelector(".stats-card");

    function validateUsername(username) {
        const regex = /^[a-zA-Z0-9_]{3,30}$/;
        return regex.test(username);
    }

    async function fetchUserDetails(username) {
        if (!validateUsername(username)) {
            alert("Invalid username. Please enter a valid LeetCode username.");
            return;
        }

        searchButton.textContent = "Searching...";
        searchButton.disabled = true;
        cardStatsContainer.style.display = "none";

        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("User not found");

            const result = await response.json();
            console.log(result); // Debugging

            if (result.status === "error") {
                alert("User not found or data unavailable.");
                return;
            }

            const easySolved = result.easySolved;
            const totalEasy = result.totalEasy;

            const mediumSolved = result.mediumSolved;
            const totalMedium = result.totalMedium;

            const hardSolved = result.hardSolved;
            const totalHard = result.totalHard;

            updateProgress(easySolved, totalEasy, easyLabel, easyProgressCircle);
            updateProgress(mediumSolved, totalMedium, mediumLabel, mediumProgressCircle);
            updateProgress(hardSolved, totalHard, hardLabel, hardProgressCircle);

            cardStatsContainer.innerHTML = `
                <h2>Problem Solved</h2>
                <p><strong>Easy:</strong> ${easySolved} / ${totalEasy}</p>
                <p><strong>Medium:</strong> ${mediumSolved} / ${totalMedium}</p>
                <p><strong>Hard:</strong> ${hardSolved} / ${totalHard}</p>
            `;
            cardStatsContainer.style.display = "block";

        } catch (error) {
            console.error("Fetch error:", error);
            alert("Something went wrong. Check the username or try again.");
        } finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    function updateProgress(solved, total, labelElement, progressElement) {
        const percentage = ((solved / total) * 100).toFixed(1);
        labelElement.innerText = `${percentage}%`;
        progressElement.style.setProperty("--pprogress-degree", `${percentage}%`);
    }

    searchButton.addEventListener("click", function () {
        const username = userInput.value.trim();
        fetchUserDetails(username);
    });
});
