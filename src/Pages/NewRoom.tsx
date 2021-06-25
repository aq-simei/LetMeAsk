import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../Components/Button';
import '../Styles/auth.scss'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/UseAuth';
import {FormEvent, useState} from 'react';
import { database } from '../Services/firebase';




export function NewRoom(){
    const { user } = useAuth();
    const history = useHistory();
    const [newRoom, setNewRoom] = useState('');
    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        if (newRoom.trim() ===''){
            return;
        }

        const roomRef = database.ref('rooms');

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        });

        history.push(`/rooms/${firebaseRoom.key}`)

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

                <h2>Criar nova sala</h2>

            <form onSubmit={handleCreateRoom}>
                <input
                type="text"
                placeholder="Nome da sala"
                onChange={event=> setNewRoom(event.target.value)} 
                value = {newRoom}
                />
                <Button type='submit'>Criar sala</Button>
            </form>
            <p>Quer entrar em uma sala existente? <Link to="/" >Clique aqui</Link></p>
            </div>
        </main>
        </div>
    )
}