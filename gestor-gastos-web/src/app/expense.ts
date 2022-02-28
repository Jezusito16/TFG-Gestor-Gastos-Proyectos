export class Expense {
    id: number | undefined;
    project: number | undefined;
    user: number | undefined;
    dossier: string | undefined;
    date: Date | undefined;
    concept: string | undefined;
    amount: number | undefined;
    vatpercentage: number | undefined;
    final_amount: number | undefined;

    constructor(id: number, project: number, user: number, dossier: string, date: Date,
        concept: string, amount: number, vatpercentage: number, final_amount: number) {
        this.id = id;
        this.project = project;
        this.user = user;
        this.dossier = dossier;
        this.date = date;
        this.concept = concept;
        this.amount = amount;
        this.vatpercentage = vatpercentage;
        this.final_amount = final_amount;
    }

    static jsontoList(json: any) {
        let expenses: any = [];
        json.forEach((expense: any) => {
            expenses.push(new Expense(
                expense["pk"],
                expense["fields"]["project"],
                expense["fields"]["user"],
                expense["fields"]["dossier"],
                new Date(expense["fields"]["date"]),
                expense["fields"]["concept"],
                expense["fields"]["amount"],
                expense["fields"]["vatpercentage"],
                expense["fields"]["final_amount"],
            ));
        });
        return expenses;
    }

    static jsontoObject(json: any) {
        return this.jsontoList(json)[0];
    }
}