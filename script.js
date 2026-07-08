grist.ready({

    requiredAccess: 'full'

});

let records = [];

async function loadTable() {

    records = await grist.docApi.fetchTable();

    const tbody = document.querySelector("tbody");

    tbody.innerHTML = "";

    records.forEach(record => {

        const tr = document.createElement("tr");

        //------------------------------------

        const tdDesignation = document.createElement("td");
        tdDesignation.innerText = record.Designation;

        //------------------------------------

        const tdQte = document.createElement("td");
        tdQte.innerText = record.Qte;

        //------------------------------------

        const tdBesoin = document.createElement("td");

        const input = document.createElement("input");

        input.type = "number";

        input.value = record.Besoin_maintien ?? "";

        input.addEventListener("change", async () => {

            await grist.docApi.applyUserActions([

                [

                    "UpdateRecord",

                    grist.selectedTable.getTableId(),

                    record.id,

                    {

                        Besoin_maintien:Number(input.value)

                    }

                ]

            ]);

        });

        tdBesoin.appendChild(input);

        //------------------------------------

        tr.appendChild(tdDesignation);
        tr.appendChild(tdQte);
        tr.appendChild(tdBesoin);

        tbody.appendChild(tr);

    });

}

grist.onRecords(loadTable);