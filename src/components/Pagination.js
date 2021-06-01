import React from 'react';

import './Pagination.css';

export default function Pagination({ moviesPerPage, totalMovies, paginate, currentPage }){
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) { pageNumbers.push(i) }

    return (
        <nav>
            <div className="pagination-content">
                {pageNumbers.map(number => (
                    <div key={number} onClick={() => paginate(number)} className={currentPage === number ? 'page-link' : 'page-item'}>
                        <span>{number}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}