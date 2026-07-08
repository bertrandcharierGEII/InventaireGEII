grist.ready({
    requiredAccess: 'full'
});

let records = [];

function renderTable() {
    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    records.forEach(record => {
        const tr = document.createElement("tr");

        //------------------------------------
        const tdDesignation = document.createElement("td");
        tdDesignation.textContent = record.Designation;

        //------------------------------------
        const tdQte = document.createElement("td");
        tdQte.textContent = record.Qte;

        //------------------------------------
        const tdBesoin = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.value = record.Besoin_maintien ?? "";

        input.addEventListener("change", async () => {
            // Champ vidé -> null (et non 0, contrairement à Number(""))
            const newValue = input.value === "" ? null : Number(input.value);

            if (input.value !== "" && Number.isNaN(newValue)) {
                console.error("Valeur invalide :", input.value);
                input.value = record.Besoin_maintien ?? "";
                return;
            }

            try {
                await grist.docApi.applyUserActions([
                    [
                        "UpdateRecord",
                        grist.selectedTable.getTableId(),
                        record.id,
                        {
                            Besoin_maintien: newValue
                        }
                    ]
                ]);
                record.Besoin_maintien = newValue; // garde l'état local synchronisé
            } catch (err) {
                console.error("Échec de la mise à jour Grist :", err);
                input.value = record.Besoin_maintien ?? ""; // on annule visuellement
            }
        });

        tdBesoin.appendChild(input);

        //------------------------------------
        tr.appendChild(tdDesignation);
        tr.appendChild(tdQte);
        tr.appendChild(tdBesoin);
        tbody.appendChild(tr);
    });
}

// onRecords fournit déjà les enregistrements de la table mappée au widget :
// plus besoin d'appeler manuellement docApi.fetchTable() (qui exigeait
// un tableId explicite et faisait doublon avec ce mécanisme).
grist.onRecords(newRecords => {
    records = newRecords;
    renderTable();
});grist.ready({

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
