import './Toast.css'


const Toast = ({message, isVisible}) => {
  if (!message) return null;
  return (
    <div className={isVisible ? 'toast show' : 'toast'}> 
        {message}     
    </div>
  )
}

export default Toast;
