import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

export default class MovieInput extends Component{
    constructor(props){
        super(props);
        this.api_url = "http://api.movorpovor.ru/movie/";
        this.state = {
            users: props.users
        };
    }

    componentDidMount(){
        window.ee.on('Movie.add', function(item) {
            ReactDOM.findDOMNode(this.refs.movieRefInput).value = '';
        }.bind(this));   

        window.ee.on('Users.Recieved', function(users) {
            this.setState({
                users: users
            });
        }.bind(this));
    }

    onBtnClickHandler() {
        var form_data = {
            km_ref: ReactDOM.findDOMNode(this.refs.movieRefInput).value,
            nickname: ReactDOM.findDOMNode(this.refs.user_switcher).value
        };
        $.ajax({
            url: this.api_url + "movie/create",
            type : "POST",
            contentType : 'application/json',
            data : JSON.stringify(form_data),
            success : function(response) {
                if (response.status == 'ok'){
                    window.ee.emit('Movie.add', response.response);
                }
                else
                    alert('film already exist');
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
            <div className='block input-block'>
                <div>
                    <input
                        className='movie-input'
                        defaultValue=''
                        placeholder='введите ссылку на киноманию'
                        ref='movieRefInput'
                    />
                </div>
                <select ref='user_switcher'>
                    {users}
                </select>
                <button onClick={this.onBtnClickHandler.bind(this)} ref='add_button'
                    className='add-button'>
                    Add
                </button>
            </div>
        );
    }
};