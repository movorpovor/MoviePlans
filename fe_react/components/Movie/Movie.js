import React, {PropTypes, Component} from 'react'

export default class Movie extends Component{
    constructor(props){
        super(props);
    }   

    render() {
        var movie = this.props.movie;
        return (
          <div>
              <a href={movie.kp_ref}>{movie.name}</a>
          </div>
        )
    }
}
