import React from 'react'

const Pagination = ({ postsPerPage, totalPosts, currentPage, paginate }) => {
    const pageNumbers = []


    for(let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i)
    }

    return (
       <nav>
           <ul className='pagination'>
                {pageNumbers.map(number => (
                    currentPage === number ? 
                        <li key={number} className='page-item active'>
                            <a onClick={() => paginate(number)} href='#' className='page-link'>
                                {number}
                            </a>
                        </li>
                    :
                        <li key={number} className='page-item'>
                            <a onClick={() => paginate(number)} href='#' className='page-link'>
                                {number}
                            </a>
                        </li>
                ))}
           </ul>
       </nav>
    )
}

export default Pagination