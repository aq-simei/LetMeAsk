import googleIconImg from '../assets/images/google-icon.svg';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../Styles/auth.scss'

import {useHistory} from 'react-router-dom'
import { FormEvent, useState } from 'react';

import { Button } from '../Components/Button';

import { useAuth } from '../hooks/UseAuth';

import { database } from '../Services/firebase';



export function Home(){
    const { user, SignInWithGoogle} = useAuth();
    const [roomCode, setRoomCode] = useState('');
    
    const history = useHistory();

    async function handleCreateRoom(){
        if (!user){
        await   SignInWithGoogle();
        }
        history.push('/rooms/new')
    }

    async function handleJoinRoom(event: FormEvent){
        event.preventDefault();

        if (roomCode.trim()===''){
        return;
    }
    const roomRef = await database.ref(`/rooms/${roomCode}`).get();

    if (!roomRef.exists()){
        alert('Room does not exists')
        return;
    }

    if (roomRef.val().endedAt){
        alert('Room already closed');
        return;

    }

    history.push(`/rooms/${roomCode}`)
}
    return(
        <div id='page-auth'>

            <aside>
                <img src={illustrationImg} alt="Ilustração de perguntas e respostas" />
                <strong>Toda pergunta tem uma resposta. </strong>
                <p>Aprenda e compartilhe conhecimento com outras pessoas</p>
            </aside>
        <div/>
        <main>
            <div className='main-content'>

                <img src={logoImg} alt="LetMeAsk" />

                <button onClick = {handleCreateRoom} className='create-room' >
                <img src={googleIconImg} alt="Logo do Google" />
                    Crie uma sala com o google
                
                </button>
                
            

            <div className='separator'>
                ou entre em uma sala
            </div>

            <form onSubmit={handleJoinRoom}>
                <input 
                type="text"
                placeholder="Digite o código da sala"
                onChange = {event => setRoomCode(event.target.value)}
                value = {roomCode}
                />
                
            </form>
            <Button type='submit' onClick={handleJoinRoom}>Entrar na sala</Button>
            </div>
        </main>
        </div>
    )
}