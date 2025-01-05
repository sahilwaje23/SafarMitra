
import {CaptainSignIn,CaptainSignUp,Landing,UserSignIn,UserSignUp} from './components'
import {Route, Routes} from 'react-router-dom'
import File from './components/user/File'
function App() {
  // <div className="flex justify-center items-center h-screen bg-gray-900 bg-opacity-50 w-full max-width-100vw">
  //     {/* <Landing/>
  //     <UserSignUp/> */}
      
  //   </div>
 
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 bg-opacity-50 w-full max-width-100vw">

    <Routes>
      <Route path='/' element={<Landing/>}/>
      <Route path='/user-signup' element={<UserSignUp/>}/>
      <Route path='/user-signin' element={<UserSignIn/>}/>
      <Route path='/captain-signup' element={<CaptainSignUp/>}/>
      <Route path='/captain-signin' element={<CaptainSignIn/>}/>
      {/* Add further routes here */}
    </Routes>
    </div>
  )
}

export default App
