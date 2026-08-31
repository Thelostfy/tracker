const totalIncome = document.getElementById("totalIncome");
const totalExpencive = document.getElementById("totalExpencive");
const balance = document.getElementById("Balance");
const tablebody = document.getElementById("table-body");
const expenseModal = new bootstrap.Modal('#addExpense');

const GetData = function () {
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





        });
}
GetData();
const expenciveForm = document.getElementById("expenciveForm");

expenciveForm.addEventListener("submit", function (event) {

    event.preventDefault();
    const data = new FormData(event.target);
    const submitedExpForm = Object.fromEntries(data.entries());
    fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/expense", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(submitedExpForm)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Expencive Added : " + data);

            tablebody.innerHTML = "";
            balance.innerHTML = "";
            totalExpencive.innerHTML = "";
            totalIncome.innerHTML = "";
            expenseModal.hide();
            GetData();

        }
        )
})


//income post

// const incomeform = document.getElementById("incomeform");
// incomeform.addEventListener("submit", function (event) {
//     event.preventDefault();


//     const data = new FormData(event.target);
//     const submitedExpForm = Object.fromEntries(data.entries());

//     debugger;

//     fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/income", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(submitedExpForm)
//     })
//         .then((response) => response.json())
//         .then((data) => {
//             console.log("Income Added : " + data);
//         }
//         )

//         GetData();

// })
