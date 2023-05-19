document.addEventListener("DOMContentLoaded", function () {
  // Retrieve username from localStorage
  const username = localStorage.getItem("username");

  // Display the username in the HTML
  const usernameElement = document.getElementById("username");
  usernameElement.textContent = username;
});

// Get the tab buttons and tabs
const tabButtons = document.querySelectorAll(".tab-buttons button");
const tabs = document.querySelectorAll(".tab");

// Add click event listeners to tab buttons
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove the 'active' class from all tab buttons and tabs
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabs.forEach((tab) => tab.classList.remove("active"));

    // Add the 'active' class to the clicked button and corresponding tab
    button.classList.add("active");
    const tabId = button.id.replace("Button", "");
    document.querySelector(`.${tabId}`).classList.add("active");
  });
});

function plag() {
  const text = document.getElementById("text-plag").value;

  const loader = document.getElementById("loader");
  loader.innerHTML = `
  <br/>
  <h3>Checking...</h3>
  <br/>
`;

  console.log("Plagarism Data:", text);

  // Make API request to check for plagiarism
  fetch("http://localhost:5000/api/plag/check-plag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      loader.remove();

      // Display the plagiarism score and matched sources
      const reportContainer = document.getElementById("result-plag");
      reportContainer.innerHTML = `
      <h3>Report Name:  <b>Plagarism Checker</b></h3>
      <p>Report Sub-Name: <b>plagarism</b></p>
      <br/>
      <p>Plagarism Percentage: <b>${data.percentPlagiarism}%</b></p>
      <br/>
    `;

      const summaryTitle = document.createElement("h4");
      summaryTitle.textContent = "Result Summary:";
      reportContainer.appendChild(summaryTitle);

      const br = document.createElement("br");
      reportContainer.appendChild(br);

      // Create a table element
      const table = document.createElement("table");

      // Create the table header
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      headerRow.innerHTML =
        "<th>Title</th><th>URL</th><th>Match Text</th><th>Context</th><th>Score</th>";
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create the table body
      const tbody = document.createElement("tbody");

      // Iterate over each source and create a row for each match
      for (const source of data.sources) {
        for (const match of source.matches) {
          const row = document.createElement("tr");

          const titleCell = document.createElement("td");
          titleCell.textContent = source.title;
          row.appendChild(titleCell);

          const urlCell = document.createElement("td");
          const link = document.createElement("a");
          link.href = source.url;
          link.textContent = source.url;
          urlCell.appendChild(link);
          row.appendChild(urlCell);

          const matchTextCell = document.createElement("td");
          matchTextCell.textContent = match.matchText;
          row.appendChild(matchTextCell);

          const contextCell = document.createElement("td");
          contextCell.innerHTML = `${match.context.before}<strong>${match.matchText}</strong>${match.context.after}`;
          row.appendChild(contextCell);

          const scoreCell = document.createElement("td");
          scoreCell.textContent = match.score.toFixed(2);
          row.appendChild(scoreCell);

          tbody.appendChild(row);
        }
      }

      table.appendChild(tbody);

      const resultElement = document.getElementById("result-plag");
      resultElement.appendChild(table);
    })
    .catch((error) => {
      console.error(error);
      const resultElement = document.getElementById("result-plag");
      resultElement.innerHTML =
        "An error occurred while checking for plagiarism";
    });
}

function grammar() {
  const text = document.getElementById("text-grammar").value;

  console.log("Grammar Data:", text);

  // Make API request to check for plagiarism
  fetch("http://localhost:5000/api/grammar/check-grammar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the plagiarism score and matched sources
      const resultElement = document.getElementById("result-grammar");
      resultElement.innerHTML = `
        <h3>Report Name:  <b>${data.Result.Summaries[0].ReportDisplayName}</b></h3>
        <p>Report Sub-Name: <b>${data.Result.Summaries[0].ReportName}</b></p>
        <br/>
        <p>No of Issues: <b>${data.Result.Summaries[0].NumberOfIssues}</b></p>
        <p>Report Summary: <b>${data.Result.Summaries[0].ReportDescription}</b></p>
        <p>Word Count: <b>${data.Result.WordCount}</b></p>
        <br/>
      `;
      // Display Tags and Suggestions
      const tags = data.Result.Tags;
      if (tags.length > 0) {
        const suggestionsTitle = document.createElement("h4");
        suggestionsTitle.textContent = "Suggestions:";
        resultElement.appendChild(suggestionsTitle);

        const suggestionsTable = document.createElement("table");
        suggestionsTable.innerHTML = `
            <thead>
            <tr>
                <th>Tag</th>
                <th>Suggestions</th>
            </tr>
            </thead>
            <tbody>
            ${tags
              .map(
                (tag) => `
                <tr>
                <td>${tag.hint}</td>
                <td>${tag.suggestions.join(", ")}</td>
                </tr>
            `
              )
              .join("")}
            </tbody>
        `;

        resultElement.appendChild(suggestionsTable);
      }

      const br = document.createElement("br");
      resultElement.appendChild(br);

      const summaryTitle = document.createElement("h4");
      summaryTitle.textContent = "Result Summary:";
      resultElement.appendChild(summaryTitle);

      const table = document.createElement("table");
      table.innerHTML = `
            <thead>
                <tr>
                <th>Text</th>
                <th>Category</th>
                <th>Num Issues</th>
                <th>Is Positive</th>
                </tr>
            </thead>
            <tbody>
                ${data.Result.Summaries[0].SummaryItems.map(
                  (item) => `
                <tr>
                    <td>${item.Text}</td>
                    <td>${item.Category.DisplayName}</td>
                    <td>${item.NumIssues}</td>
                    <td>${item.IsPositive}</td>
                </tr>
                `
                ).join("")}
            </tbody>
            `;
      resultElement.appendChild(table);
    })
    .catch((error) => {
      console.error(error);
      const resultElement = document.getElementById("result-grammar");
      resultElement.innerHTML =
        "An error occurred while checking for plagiarism";
    });
}
