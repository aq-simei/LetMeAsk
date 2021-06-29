import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import {  useHistory, useParams  } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg'
import { Button } from '../Components/Button';
import { Question } from '../Components/Question';
import { RoomCode } from '../Components/RoomCode';
//import { useAuth } from '../hooks/UseAuth';
import { useRoom } from '../hooks/useRoom';
//import { database } from '../Services/firebase';
import '../Styles/room.scss'
import { database } from '../Services/firebase';


type RoomParams = {
    id: string;
}



export function AdminRoom(){

    const history = useHistory();

    const params = useParams<RoomParams>();
    const roomId = params.id;
    const {title, questions} = useRoom(roomId);

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),

        })

    history.push(`/`)
    }
    
    async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Tem certeza que deseja excluir a pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }
    async function handleCheckQuestionasAnswered(questionId: string){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true,
            });
    }
    async function handleHighlightQuestion(questionId: string){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: true,
            });
    }
    return(
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="LetMeAsk" />
                    <div>
                    <RoomCode code = {roomId} />
                    <Button isOutlined
                    onClick = { handleEndRoom }>Encerrar sala</Button>
                    </div>
                </div>
            </header>
        

            <div id="main">
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>  {questions.length} pergunta(s) </span>}
                </div>

                
                <div className='question-list'>
                {questions.map(question => {
                    return(
                        <Question
                        key = {question.id}
                        content = {question.content}
                        author = {question.author}
                        isHighlighted= {question.isHighlighted}
                        isAnswered = {question.isAnswered}
                        >
                            <div>
                                {!question.isAnswered && (
                                <>    
                                    <button
                                    type = 'button'
                                    onClick={()=> handleCheckQuestionasAnswered(question.id)}>
                                        <img src={checkImg} alt="Check question as answered" />
                                    </button>
    
                                    <button
                                    type = 'button'
                                    onClick={()=> handleHighlightQuestion(question.id)}>
                                        <img src={answerImg} alt="Highlight question" />
                                    </button>
                                </>       
                                )}
                                <button
                                type = 'button'
                                onClick={()=> handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Delete question" />
                                </button>
                            </div>
                        </Question>
                    );
                })}
                </div>
                
            </div>
        </div>
    );
}