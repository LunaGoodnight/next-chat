export interface Message {
    user: string;
    message: string;
    avatar: string;
    timestamp: number;
    timeString: string;
    imageUrl: string | null;
}
