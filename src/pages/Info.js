import React, { useState, useEffect } from 'react';

import api from '../services/api';

import './Info.css';

export default function Info({ match }){
    const [movie, setMovie] = useState({});

    useEffect(()=>{
        async function loadMovie() {
            const response = await api.get(`movie/${match.params.id}?api_key=3a460170c8caa550d0fd8b93f37d3b89&language=pt-BR&append_to_response=videos`)
            setMovie(response.data);
        }
        loadMovie();
    },[match.params.id]);

    function formatDate(date) {
        if (date) {
            const [year, month, day] = date.split('-');
            return `${day}/${month}/${year}`
        }
    }

    function formatValue(value) {
        let result = value+'';
        result = result.replace(/([0-9]{2})$/g, ",$1");
        if (result.length > 6)
            result = result.replace(/([0-9]{3}),([0-9]{2})$/g, ".$1,$2");

        if( result.length > 9)
            result = result.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
            
        return result
    }

    function formatTime(time) {
        let result = time+'';
        if (result.length === 3)
            result = result.replace(/([0-9]{2})$/g, "h $1");

        return result
    }

    return (
        <>
            <div className="info-container">
                <section>
                    <header>
                        <h1>{movie.title}</h1>
                        <span>{formatDate(movie.release_date)}</span>
                    </header>
                    <article>
                        <div className="info-content">
                            <div className="synopsis">
                                <h2>Sinopse</h2>
                                <span>
                                    {movie.overview}
                                </span>
                            </div>
                            <div className="information">
                                <h2>Informações</h2>
                                <ul>
                                    <li>
                                        <h2>Situação</h2>
                                        <span>{(movie.status === 'Released') ? 'Lançado' : 'Em breve'}</span>
                                    </li>
                                    <li>
                                        <h2>Idioma</h2>
                                        <span>{(typeof(movie.spoken_languages) == 'object') ?
                                            movie.spoken_languages.map(language => <div key={language.iso_639_1}>{language.name}</div>)
                                            : 'Português'
                                        }</span>
                                    </li>
                                    <li>
                                        <h2>Duração</h2>
                                        <span>{formatTime(movie.runtime)}min</span>
                                    </li>
                                    <li>
                                        <h2>Orçamento</h2>
                                        <span>${formatValue(movie.budget)}</span>
                                    </li>
                                    <li>
                                        <h2>Receita</h2>
                                        <span>${formatValue(movie.revenue)}</span>
                                    </li>
                                    <li>
                                        <h2>Lucro</h2>
                                        <span>${formatValue(movie.revenue - movie.budget)}</span>
                                    </li>
                                </ul>
                            </div>
                            <footer>
                                <div className="info-genres">
                                    {(typeof(movie.genres) == 'object') ?
                                        movie.genres.map(genre => <span key={genre.id}>{genre.name}</span>)
                                        : <span>Sem gênero</span>}
                                </div>
                                <div className="popularity">
                                    <span>{Math.floor(movie.popularity)}%</span>
                                </div>
                            </footer>
                        </div>
                        {!movie.poster_path ? <img
                            src={'https://s3-ap-southeast-1.amazonaws.com/upcode/static/default-image.jpg'}
                            alt="poster"
                            /> : <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="poster" />}
                    </article>
                </section>
            </div>
            {(movie.videos && typeof(movie.videos.results) == 'object') ?
                movie.videos.results.map(video => (
                    <div className="trailer" key={video.id}>
                        <iframe
                            width="100%"
                            height="100%"
                            title={video.name}
                            src={`https://www.youtube.com/embed/${video.key}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )) : <></>}
        </>
    );
}