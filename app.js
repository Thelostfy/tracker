const container = document.getElementById("container");
const content = document.getElementById("content");
const darAmad = document.getElementById("darAmad");
const all = document.getElementById("all");
const hazine = document.getElementById("hazine");
const totalIncome = document.getElementById("totalIncome");
const totalExpencive = document.getElementById("totalExpencive");
const balance = document.getElementById("Balance");


fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/")
    .then((response) => response.json())
    .then((data) => {
        let SumDarAmadHa = 0;
        let SumHazineHa = 0;
        let sum = 0;
        const title = document.createElement("tr");
        title.innerHTML = `
                <td><strong>Type</strong></td>
                <td><strong>Name</strong></td>
                <td><strong>category/source</strong></td>
                <td><strong>amount</strong></td>`
        content.appendChild(title)
        data.forEach(element => {
            if (element.type === "Expense") {
                sum -= element.amount;
                SumHazineHa += element.amount;
            }
            else {
                sum += element.amount;
                SumDarAmadHa += element.amount;
            }
            const card = document.createElement("tr");
            const isIncome = (element.type == "Expense") ? "red" : "blue";
            card.className = isIncome;
            card.innerHTML = `
                <td> ${element.type}</td>
                <td>${element.name}</td>                
                <td> ${element.category || element.source}</td>
                <td>${element.amount}</td>
                `;

            content.appendChild(card);

        });
        const spanB = document.createElement("span");
        spanB.innerHTML = `
            Balance : <strong> ${sum}</strong>`;
        balance.appendChild(spanB);
        const spanI = document.createElement("span");
        spanI.innerHTML = `
            Balance : <strong> ${SumDarAmadHa}</strong>`;
        totalIncome.appendChild(spanI);
        const spanE = document.createElement("span");
        spanE.innerHTML = `
            total expencive : <strong> ${SumHazineHa}</strong>`;
        totalExpencive.appendChild(spanE);

    })

// ----------------------------- دکمه ها
// hazine ha
hazine.addEventListener("click", () => {
    fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/expenses")
        .then((response) => response.json())
        .then((data) => {
            content.innerHTML = "";
            let sum = 0;
            const title = document.createElement("tr");
            title.innerHTML = `
                <td><strong>Type</strong></td>
                <td><strong>Name</strong></td>
                <td><strong>category/source</strong></td>
                <td><strong>amount</strong></td>`
            content.appendChild(title);
            data.forEach(element => {


                const card = document.createElement("tr");
                card.className = "red";
                card.innerHTML = `
                <td> ${element.type}</td>
                <td>${element.name}</td>                
                <td> ${element.category || element.source}</td>
                <td>${element.amount}</td>
                `;
                content.appendChild(card);
            });


        })
})

//darAmad ha

darAmad.addEventListener("click", () => {
    fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/incomes")
        .then((response) => response.json())
        .then((data) => {
            content.innerHTML = "";
            let sum = 0;
            const title = document.createElement("tr");
            title.innerHTML = `
                <td><strong>Type</strong></td>
                <td><strong>Name</strong></td>
                <td><strong>category/source</strong></td>
                <td><strong>amount</strong></td>`;
            content.appendChild(title);
            data.forEach(element => {
                sum = (element.type === "Expense") ? sum - element.amount : sum + element.amount;


                const card = document.createElement("tr");
                card.className = "blue";
                card.innerHTML = `
                <td> ${element.type}</td>
                <td>${element.name}</td>                
                <td> ${element.category || element.source}</td>
                <td>${element.amount}</td>
                `;
                content.appendChild(card);
            });



        })
})

//all
all.addEventListener("click", () => {
    fetch("https://mooni-expense.azurewebsites.net/api/v1/Transactions/")
        .then((response) => response.json())
        .then((data) => {
            let sum = 0;
            content.innerHTML = "";

            const title = document.createElement("tr");
            title.innerHTML = `
                <td><strong>Type</strong></td>
                <td><strong>Name</strong></td>
                <td><strong>category/source</strong></td>
                <td><strong>amount</strong></td>`
            content.appendChild(title)
            data.forEach(element => {
                sum = (element.type === "Expense") ? sum - element.amount : sum + element.amount;

                const card = document.createElement("tr");
                const isIncome = (element.type == "Expense") ? "red" : "blue";
                card.className = isIncome;
                card.innerHTML = `
                <td> ${element.type}</td>
                <td>${element.name}</td>                
                <td> ${element.category || element.source}</td>
                <td>${element.amount}</td>
                `;

                content.appendChild(card);

            });



        })
})