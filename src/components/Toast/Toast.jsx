import './Toast.css'


const Toast = ({message, isVisble}) => {
  if (!message) return null;
  return (
    <div className={isVisble ? 'toast show' : 'toast'}> 
        {message}     
    </div>
  )
}

export default Toast;
