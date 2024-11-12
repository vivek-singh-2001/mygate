export interface Payment {
    ownerId:string,
    houseId?:string,
    amount:number,
    transactionId:string,
    status:string
}