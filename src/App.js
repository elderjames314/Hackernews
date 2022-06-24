import logo from './logo.svg';
import './App.css';
import { Component } from 'react';

const list = [

    {
      title: 'React',
      url: 'https://facebook.com',
      author: 'Jordan Walke',
      num_commers: 3,
      points: 4,
      object_id: 0,
    },
    {
      title: 'Redux',
      url: 'https://github.com',
      author: 'Dan Abramov, Andrew Clark',
      num_commers: 2,
      points: 5,
      object_id: 1,
    },
    


]

const isSearchItem = searchTerm  => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      list,
      searchItem: ''
    };


    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }
  onDismiss(id) {
    const list = this.state.list.filter(item => item.object_id !== id)
    this.setState({
      list,
    })
  }
  onSearchChange(event) {
    this.setState({
      searchItem: event.target.value
    })
  }
  render() {
    const {list, searchItem} = this.state
    return (
      <div className='App'>

        <Search value={searchItem} onChange={this.onSearchChange}>Search</Search>
        <Table list={list} pattern={searchItem} onDismiss={this.onDismiss}/>

      </div>
    );
  }
 
}

class Table extends Component {
  render() {
    const {list, pattern, onDismiss} = this.props;
    return (
      <div>
            {list.filter(isSearchItem(pattern)).map( item => {
            const onHandleDismiss = () => onDismiss(item.object_id);
            return (
            <div key={item.object_id}>
            <span><a href={item.url}> <br />{item.title}</a></span> <br />
            <span>{item.author}</span>
            <span>{item.num_commers}</span>
            <span>{item.points}</span>
            <span>
              <Button onClick={onHandleDismiss}>Dismiss</Button>
            </span>
            </div>
            )
  })}
      </div>
    )
  }
}

class Search extends Component {
  render() {
    const {value, onChange, children} = this.props;
    return (
      <div>
         <form>
          {children}
        <input type="text" value={value} 
         onChange={onChange} />
       </form>
      </div>
    )
  }
}

class Button extends Component {
  render() {
    const {onClick, className='', children} = this.props
    return (
      <button
        onClick={onClick}
        className={className}
        type="Button">{children}</button>
    )
  }
}

export default App;
