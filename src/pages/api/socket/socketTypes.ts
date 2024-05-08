import { Server as NetServer, Socket } from 'net'
import { Server as IOServer } from 'socket.io'
import { NextApiResponse } from "next";

export type NextApiResponseWithIO = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: IOServer
        }
    }
}