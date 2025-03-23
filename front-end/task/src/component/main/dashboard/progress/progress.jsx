import './progress.css'
export const Progress = ()=>{
  return (
    <div id='progress'>
      <h3 style={{textAlign:'start'}}>Progress</h3>
      <div className='progressItem'>
        <h4>project A</h4>
        <div className='progressBar'>
          <div></div>
        </div>
      </div>
      <div className='progressItem'>
        <h4>project B</h4>
        <div className='progressBar'>
          <div></div>
        </div>
      </div>
      <div className='progressItem'>
        <h4>project C</h4>
        <div className='progressBar'>
          <div></div>
        </div>
      </div>
    </div>
  )
}