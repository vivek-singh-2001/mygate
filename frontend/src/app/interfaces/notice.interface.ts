import { User } from "./user.interface"

export interface Notice{
    id:string,
    text:string,
    media:string[],
    createdAt:string,
    updatedAt:string,
    societyId:string,
    userId:string,
    mediaUrls:string[],
    noticeList:string[],
    User:User[]
}