const totalIncome = document.getElementById("totalIncome");
const totalExpencive = document.getElementById("totalExpencive");
const balance = document.getElementById("Balance");
const tablebody = document.getElementById("table-body");

fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions")
    .then((response) => response.json())
    .then((data) => {
        let SumDarAmadHa = 0;
        let SumHazineHa = 0;
        let sum = 0;
        data.forEach(element => {

            // ----------------------Calculate Sum
            if (element.type === "Expense") {
                sum -= element.amount;
                SumHazineHa += element.amount;
            }
            else {
                sum += element.amount;
                SumDarAmadHa += element.amount;
            }

            // Define row for data
            const card = document.createElement("tr");
            card.innerHTML = `
                <td> ${element.type}</td>
                <td>${element.name}</td>                
                <td> ${element.category || element.source}</td>
                <td>${element.amount}</td>
                `;

            tablebody.appendChild(card);
        });

        // define span for exp and income and balance
        const spanB = document.createElement("span");
        const spanE = document.createElement("span");
        const spanI = document.createElement("span");

        // ---------------------------Balance
        spanB.innerHTML = `
            Balance: <strong> ${sum}</strong>`;

        // ---------------------------Income
        spanI.innerHTML = `
            Income: <strong> ${SumDarAmadHa}</strong>`;

        // ---------------------------expencive
        spanE.innerHTML = `
            total expencive: <strong> ${SumHazineHa}</strong>`;


        // add to html
        balance.appendChild(spanB);
        totalIncome.appendChild(spanI);
        totalExpencive.appendChild(spanE);





    })