import { Link } from 'react-router-dom'

function App() {
  return (
    <>
      <div className='md:[w-1/2 flex flex-col items-center justify-center '>
        <div className='flex w-[60vw] justify-between mx-auto p-2 mt-5'>
          <Link to='/' className='font-extrabold text-xl'>postify</Link>
          <Link to='/login' className='mb-2'>create</Link>
        </div>
        <div className='flex flex-col justify-center items-center mx-auto mt-5'>
          <div>
            <h1 className='text-6xl font-extrabold mb-5 mt-5'>Share Your Story with<span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-transparent bg-clip-text"> the World</span>
              ✍️</h1>
          </div>
          <div>
            <h2 className='text-4xl font-extrabold mb-4'>Write Blogs that You feel</h2>
          </div>
        </div>
        <div className='flex justify-center items-center gap-4 mt-5 mb-5'>
          <Link to='/signup' className='bg-black text-white font-bold text-xl p-3 md:w-[15vw] rounded-xl hover:bg-gray-900 text-center'>Sign Up</Link>
          <Link to='/login' className='bg-blue-600 text-white font-bold text-xl p-3 md:w-[15vw] rounded-xl hover:bg-blue-700 text-center'>Login</Link>
        </div>
        <div className='rounded-xl bg-blue-400 hover:scale-y-10 hover:cursor-pointer w-[65vw] mx-auto h-1/2 bg-blue-400 p-16 rounded-3xl mt-4 flex shadow shadow-2xl  shadow-blue-900'>
          <img src={`https://res.cloudinary.com/da2fioulc/image/upload/v1738864455/Screenshot_2025-02-06_232125_hxysh2.png`} className='rounded-xl' />
        </div>
      </div>
    </>
  )
}

export default App