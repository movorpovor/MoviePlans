import React, {PropTypes, Component} from 'react'

export default class Movie extends Component{
    constructor(props){
        super(props);
    }   

    render() {
        var movie = this.props.movie;
        return (
          <div className='movie'>
              <img src={movie.cover} className='cover'/>
              <div className='movie-info'>
                <div className='titles'>
                    <a href={movie.km_ref} target="_blank">{movie.title}</a>
                    <a className='original-title'>{movie.original_title}</a>
                </div>
                <p className='about-movie'>{movie.description}</p>
              </div>
          </div>
        )
    }
}
