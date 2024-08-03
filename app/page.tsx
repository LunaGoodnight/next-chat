import {Chatroom} from "@/app/Chatroom";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Chatroom',
    description: 'feel free to talk',
}

export default function Home() {
    return <div id='__next'><Chatroom/></div>
}
