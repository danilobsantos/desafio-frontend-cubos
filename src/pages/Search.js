import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Pagination from '../components/Pagination';

import api from '../services/api';

import './Search.css';

export default function Search(){
    const [search, setSearch] = useState('');
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(5);

    async function handleSubmit(event) {
        event.preventDefault();
        
        setLoading(true);
        const response = await api.get(`search/movie?api_key=3a460170c8caa550d0fd8b93f37d3b89&language=pt-BR&query=${search}`);
        const genres = await api.get('genre/movie/list?api_key=3a460170c8caa550d0fd8b93f37d3b89&language=pt-BR');
        setLoading(false);

        setMovies(response.data.results);
        setGenres(genres.data.genres);
    }

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

    function formatDate(date) {
        if (date) {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`
        }
    }

    function formatGenre(id) {
        const result = genres.find(genre => genre.id === id);
        if (result) return result.name
    }

    function paginate(pageNumber) {
        return setCurrentPage(pageNumber);
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="search"
                    placeholder="Busque um filme por nome ou gênero..."
                    onChange={event => setSearch(event.target.value)}
                    value={search}
                />
            </form>
            {loading ? <h1>Aguarde...</h1> : (
                currentMovies.map(movie => (
                    <Link to={`/info/${movie.id}`} key={movie.id}>
                        <section>
                            {!movie.poster_path ? <img
                                src={'https://s3-ap-southeast-1.amazonaws.com/upcode/static/default-image.jpg'}
                                alt="poster"
                                /> : <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="poster" />}
                            <article>
                                <header>
                                    <h1>
                                        {movie.title}
                                        <div className="popularity">
                                            <span>{Math.floor(movie.popularity)}%</span>
                                        </div>
                                    </h1>
                                </header>
                                <div className="release-date">{formatDate(movie.release_date)}</div>
                                <div className="content">
                                    {movie.overview}
                                </div>
                                <footer>
                                    <div className="genres">
                                        {(typeof(movie.genre_ids) == 'object') ?
                                            movie.genre_ids.map(genre_id => (
                                                <span key={genre_id}>{formatGenre(genre_id)}</span>
                                            )) : <span>Sem gênero</span>}
                                    </div>
                                </footer>
                            </article>
                        </section>
                    </Link>
                ))
            )}
            {(!loading) ? <Pagination moviesPerPage={moviesPerPage} totalMovies={movies.length} paginate={paginate} currentPage={currentPage} /> : ''}
        </div>
    );
}