window.ee = new EventEmitter();
var api_url = "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/";

var Movie = React.createClass({
  propTypes: {
    movie: React.PropTypes.object.isRequired
  },

  render: function() {
    var movie = this.props.movie;
    return (
      <div className>
          <a href={movie.kp_ref}>{movie.name}</a>
      </div>
    )
  }
});

var MovieInput = React.createClass({
  onBtnClickHandler: function() {
    var form_data = {
      name: ReactDOM.findDOMNode(this.refs.movieNameInput).value,
      kp_ref: ReactDOM.findDOMNode(this.refs.movieRefInput).value
    };
    $.ajax({
      url: api_url + "movie/create",
      type : "POST",
      contentType : 'application/json',
      data : JSON.stringify(form_data),
      success : function(response) {
        if (response.ok)
        {
          window.ee.emit('Movie.add', response.movie);
        }
      },
      error: function(xhr, resp, text){
          // show error to console
          console.log(xhr, resp, text);
      }
    });
  },

  render: function() {
    return (
      <div className='block'>
        <div>
          <input
            className='movie-input'
            defaultValue=''
            placeholder='введите наименование фильма'
            ref='movieNameInput'
          />
          <input
            className='movie-input'
            defaultValue=''
            placeholder='введите ссылку на кинопоиск'
            ref='movieRefInput'
          />
        </div>
        <select name="sometext">
          <option>text1</option>
          <option>text2</option>
          <option>text3</option>
          <option>text4</option>
          <option>text5</option>
        </select>
        <button onClick={this.onBtnClickHandler} ref='add_button'
          className='add-button'>
          Добавить фильм
        </button>
      </div>
    );
  }
});

var App = React.createClass({
  componentDidMount: function() {

    var self = this;
    window.ee.addListener('Movie.add', function(item) {
      var nextMovies = self.state.movies.concat(item);
      self.setState({movies: nextMovies});
    });

    $.ajax({
      url: api_url + "movie/get_all",
      type : "GET",
      success : function(response) {
        this.setState({
          movies: response['records']
        });
      }.bind(this),
      error: function(xhr, resp, text){
          // show error to console
          console.log(xhr, resp, text);
      }
    });
  },

  componentWillUnmount: function() {
    window.ee.removeListener('Movie.add');
  },

  getInitialState: function() {
    return {
      movies: []
    };
  },

  render: function() {
    var moviesTemplate = this.state.movies.map(function(item, index) {
      return (
        <div key={index}>
          <Movie movie={item} />
        </div>
      )
    })

    return (
      <div>
        <div className='block'>
          {moviesTemplate}
        </div>
        <MovieInput />
      </div>
    );
  }
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);