async function fetchStats() {
    const username = document.getElementById('user-input').value.trim();
    const messageDiv = document.getElementById('result-message');
    
    // HTML elements ko fetch karna
    const easySpan = document.getElementById('easy-label');
    const mediumSpan = document.getElementById('medium-label');
    const hardSpan = document.getElementById('hard-progress');
    const totalBox = document.getElementById('total-box');

    // Naya data fetch karne se pehle UI ko reset karna
    easySpan.innerText = '-';
    mediumSpan.innerText = '-';
    hardSpan.innerText = '-';
    if (totalBox) totalBox.innerHTML = '';

    if (!username) {
        messageDiv.innerText = "Username is required.";
        messageDiv.style.color = "red";
        return;
    }

    messageDiv.innerText = "Fetching data... (Please wait)";
    messageDiv.style.color = "white";

    try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        const data = await response.json();

        // API errors ya invalid user handle karna
        if (data.errors || !response.ok || data.status === "error") {
            messageDiv.innerText = "User not found or API is sleeping. Try again in 5 seconds.";
            messageDiv.style.color = "red";
            return;
        }

        // DOM me data inject karna
        easySpan.innerText = data.easySolved;
        mediumSpan.innerText = data.mediumSolved;
        hardSpan.innerText = data.hardSolved;
        
        if (totalBox) {
            totalBox.innerHTML = `Total Solved: <span style="color:white;">${data.solvedProblem}</span>`;
        }
        
        messageDiv.innerText = `Data successfully retrieved.`;
        messageDiv.style.color = "#299f5d";
        
    } catch (error) {
        console.error(error);
        messageDiv.innerText = "Network error! API might be sleeping. Click search again.";
        messageDiv.style.color = "red";
    }
}