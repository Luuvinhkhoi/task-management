import './list.css'
export const List = ()=>{
    return (
        <div className='list'>
           <h3>List</h3> 
           <div>
            <div className='listHeader'>
                <div>Title</div>
                <div>Description</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Tags</div>
                <div>Start Date</div>
                <div>Due Date</div>
            </div>
            <div className='listContent'>
                <div className='listContentItem'>
                    <div>Testing</div>
                    <div>Sint ex excepteur proident...</div>
                    <div>To do</div>
                    <div>High</div>
                    <div>Test</div>
                    <div>26-03-2024</div>
                    <div>27-03-2024</div>
                </div>
            </div>
           </div>
        </div>
    )
}