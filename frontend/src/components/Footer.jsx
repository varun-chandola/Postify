import React from 'react'

const Footer = () => {
    return (
        <footer className="footer footer-center bg-base-300 text-base-content p-4 object-bottom mt-10">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - made by - <a href='https://x.com/VarunChandola7' target='_blank'><u className='font-bold'>Varun Chandola</u></a> </p>
            </aside>
        </footer>)
}

export default Footer