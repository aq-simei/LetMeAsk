import { useEffect, useState } from "react";
import { database } from "../Services/firebase";
import { useAuth } from "./UseAuth";


type QuestionType = {
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    id: string;
    likeCount: number;
    likeId: string | undefined;
}
type FirebaseQuestions = Record<string,{
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }
    >
}>

export function useRoom(roomId:string){
    
    const [title, setTitle] = useState('')
    
    const {user} = useAuth();

    const [questions, setQuestions] = useState<QuestionType[]>([]);
    
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);
        
        roomRef.on('value', room=>{
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value])=>{
                return{
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes?? {}).length, 
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
        return()=>{
            roomRef.off('value');
        }
    }, [roomId, user?.id]);
    return{questions, title};
    }
