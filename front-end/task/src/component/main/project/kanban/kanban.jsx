import './kanban.css'
import { useTranslation } from 'react-i18next';
export const Kanban = ()=>{
    const { t } = useTranslation();
    return(
        <div className="kanban">
            <div>
                <div className='kanbanHeader' style={{borderLeft:'1rem solid rgba(99, 153, 253, 0.8)'}}>{t('kanban.todo')}</div>
                <div className='kanbanItem'>
                    <div className='priority' style={{backgroundColor:'rgb(255, 142, 66)'}}>High</div>
                    <p>Testing</p>
                    <span>Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.</span>
                    <div className='member'>
                        <div>
                            <img src='https://lh3.googleusercontent.com/a/ACg8ocJjlHAFWaF957u8qFuvF7CVlk86-UxE92BQR3tx8fXRawVL_g=s96-c' ></img>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='kanbanHeader' style={{borderLeft:'1rem solid rgba(243, 175, 115, 0.8)'}}>{t('kanban.inProgress')}</div>
                <div className='kanbanItem'>
                    <div className='priority' style={{backgroundColor:'rgb(255, 142, 66)'}}>High</div>
                    <p>Testing</p>
                    <span>Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.</span>
                    <div className='member'>
                        <div>
                            <img src='https://lh3.googleusercontent.com/a/ACg8ocJjlHAFWaF957u8qFuvF7CVlk86-UxE92BQR3tx8fXRawVL_g=s96-c' ></img>
                        </div>
                    </div>
                </div>

            </div>
            <div>
                <div className='kanbanHeader' style={{borderLeft:'1rem solid rgb(50, 213, 131)'}}>{t('kanban.complete')}</div>
                <div className='kanbanItem'>
                    <div className='priority' style={{backgroundColor:'rgb(255, 142, 66)'}}>High</div>
                    <p>Testing</p>
                    <span>Sint ex excepteur proident adipisicing adipisicing occaecat pariatur.</span>
                    <div className='member'>
                        <div>
                            <img src='https://lh3.googleusercontent.com/a/ACg8ocJjlHAFWaF957u8qFuvF7CVlk86-UxE92BQR3tx8fXRawVL_g=s96-c' ></img>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}