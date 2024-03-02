import { Request, Response } from 'express';
export default function createUser(req:Request, res:Response) {
    res.send("Hello");
}