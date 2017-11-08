import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class MovieInput extends Component{
    constructor(props){
        super(props);
        this.api_url = "http://movorpovor.ru.host1630677.serv63.hostland.pro/movie_api/";
        this.state = {
            users: []
        };
    }


    componentWillMount() {
        $.ajax({
            url: this.api_url + "user/get_all",
            type : "GET",
            success : function(response) {
                this.setState({
                    users: response['records']
                });
            }.bind(this),
            error: function(xhr, resp, text){
                // show error to console
                console.log(xhr, resp, text);
            }
        });
    }

    componentDidMount(){
        window.ee.on('Movie.add', function(item) {
            ReactDOM.findDOMNode(this.refs.movieRefInput).value = '';
            ReactDOM.findDOMNode(this.refs.movieNameInput).value = '';
        }.bind(this));   
    }

    onBtnClickHandler() {
        var form_data = {
            name: ReactDOM.findDOMNode(this.refs.movieNameInput).value,
            kp_ref: ReactDOM.findDOMNode(this.refs.movieRefInput).value,
            nickname: ReactDOM.findDOMNode(this.refs.user_switcher).value
        };
        $.ajax({
            url: this.api_url + "movie/create",
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
    }
  
    render() {
        var users = this.state.users.map(function(item, index) {
            return (
              <option key={index}>
                {item.nickname}
              </option>
            )
        })

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
            <select ref='user_switcher'>
                {users}
            </select>
            <button onClick={this.onBtnClickHandler.bind(this)} ref='add_button'
                className='add-button'>
                Добавить фильм
            </button>
            </div>
        );
    }
};