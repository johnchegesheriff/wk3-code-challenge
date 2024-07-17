document.addEventListener('DOMContentLoaded', () => {
    const filmsList = document.getElementById('films');
    const movieDetails = {
        poster: document.getElementById('poster'),
        title: document.getElementById('title'),
        runtime: document.getElementById('runtime'),
        showtime: document.getElementById('showtime'),
        availableTickets: document.getElementById('available-tickets'),
        buyButton: document.getElementById('buy-ticket')
    };
    let currentMovie;

    
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(movies => {
            
            filmsList.innerHTML = ''; 
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.classList.add('film', 'item');
                li.textContent = movie.title;
                li.addEventListener('click', () => {
                    showMovieDetails(movie);
                });
                filmsList.appendChild(li);

                if (movie.capacity - movie.tickets_sold === 0) {
                    li.classList.add('sold-out');
                }
            });

           
            if (movies.length > 0) {
                showMovieDetails(movies[0]);
            }
        })
        .catch(error => console.error('Error fetching movies:', error));

    
    function showMovieDetails(movie) {
        currentMovie = movie;
        const availableTickets = movie.capacity - movie.tickets_sold;
        movieDetails.poster.src = movie.poster;
        movieDetails.title.textContent = movie.title;
        movieDetails.runtime.textContent = `Runtime: ${movie.runtime} minutes`;
        movieDetails.showtime.textContent = `Showtime: ${movie.showtime}`;
        movieDetails.availableTickets.textContent = `Available Tickets: ${availableTickets}`;
        movieDetails.buyButton.disabled = availableTickets === 0;
        movieDetails.buyButton
        .textContent = availableTickets === 0 ? 'Sold Out' : 'Buy Ticket';
    }

    movieDetails.buyButton.addEventListener('click', () => {
        if (currentMovie) {
            const availableTickets = currentMovie.capacity - currentMovie.tickets_sold;
            if (availableTickets > 0) {
                currentMovie.tickets_sold++;
                const updatedAvailableTickets = currentMovie.capacity - currentMovie.tickets_sold;
                movieDetails.availableTickets.textContent = `Available Tickets: ${updatedAvailableTickets}`;
                if (updatedAvailableTickets === 0) {
                    movieDetails.buyButton.textContent = 'Sold Out';
                    movieDetails.buyButton.disabled = true;
                    const soldOutFilmItem = Array.from(filmsList.children).find(li => li.textContent === currentMovie.title);
                    if (soldOutFilmItem) {
                        soldOutFilmItem.classList.add('sold-out');
                    }
                }
            } else {
                alert('Sorry, this show is sold out!');
            }
        }
    });
});
