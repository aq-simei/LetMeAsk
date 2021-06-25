import userEvent from '@testing-library/user-event';
import { FormEvent, useEffect, useState } from 'react';
import {  useParams  } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../Components/Button';
import { RoomCode } from '../Components/RoomCode';
import { useAuth } from '../hooks/UseAuth';
import { database } from '../Services/firebase';
import '../Styles/room.scss'


type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string,{
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>
type Questions = {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

export function Room(){

    const params = useParams<RoomParams>();
    const roomId = params.id;
    
    const {user} = useAuth();

    const [title, setTitle] = useState('')
    const [NewQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Questions[]>([])

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
                    isAnswered: value.isAnswered
                }
            })
            setTitle(databaseRoom.title);
            setQuestions(parsedQuestions);
        })
    }, [roomId])


    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if (NewQuestion.trim() === ''){
        return;
    }

    if (!user){
        throw new Error ('You must log in to send a question.')
    }
    const question = {
        content: NewQuestion,
        author: {
            name: user.id,
            avatar: user.avatar,
        },
        isHighlighted: false,
        isAnswered: false,
    };


    await database.ref(`rooms/${roomId}/questions`).push(question)
    setNewQuestion('');
    }
   
    return(
        <div id="page-room">
            <header>
                <div className='content'>
                <img src={logoImg} alt="LetMeAsk" />
                <RoomCode code = {roomId} />
                </div>
            </header>
        

            <div id="main">
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>  {questions.length} pergunta(s) </span>}
                </div>

                <form onSubmit = {handleSendQuestion}>
                    <textarea
                    onChange= {event=>(setNewQuestion(event.target.value))}
                    value = {NewQuestion}
                    placeholder='O que você quer perguntar?'
                    />
                    <div className='form-footer'>
                        {user ? 
                        (
                            <div className='user-info'>
                                <img src={user.avatar} alt="User's avatar" />
                                <span>{user.name}</span>
                            </div>
                        )
                        :( <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>)
                        }
                        <Button type='submit' disabled={!user}>
                        Enviar pergunta
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}