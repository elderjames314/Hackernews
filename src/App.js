import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import axios from 'axios';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const DEFAULT_HPP = '100';
const PARAM_HPP = 'hitsPerPage=';

const DEFAULT_URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const BASE_URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}`;


const isSearchItem = searchTerm  => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props)

    this.state = {
      searchItem: DEFAULT_QUERY,
      result:null,
      results: null,
      searchKey:'',
      error: null
    };


    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }
  needsToSearchTopStories(searchItem) {
    return !this.state.results[searchItem]
  }
  fetchSearchTopStories(searchItem, page=0) {
    const url = `${BASE_URL}${searchItem}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
    axios(url)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({error}))
  }
  onSearchSubmit(event) {
    const {searchItem} = this.state;
    this.setState({searchKey: searchItem})
    if(this.needsToSearchTopStories(searchItem)) {
      this.fetchSearchTopStories(searchItem)
    }
    event.preventDefault()
  }
  setSearchTopStories(result) {
    const {hits, page} = result
    const {searchKey, results} = this.state;
    //const oldHits = page !== 0 ? this.state.result.hits : [];
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits]
    //this.setState({result: {hits: updatedHits, page}})
    this.setState({
      results: {...results, [searchKey]: {hits: updatedHits, page}}
    })
  }

  componentDidMount() {
    this._isMounted = true;
    const {searchItem } = this.state
    this.setState({searchKey: searchItem})
    this.fetchSearchTopStories(searchItem)
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  onDismiss(id) {
    const {searchKey, results} = this.state;
    const {hits, page} = results[searchKey];
    const updatedHits = hits.filter(item => item.objectID !== id);
    console.log(updatedHits)
    this.setState({
      result: {results, [searchKey]: {hits: updatedHits, page}}
    })
  }
  onSearchChange(event) {
    this.setState({
      searchItem: event.target.value
    })
  }
  render() {
    const {results, searchItem, searchKey, error} = this.state
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
    // if(error) {
    //   return <p>Something went wrong... please check back</p>
    // }
  //  if(!results) {return 'Fetching data....'; }
    return (
      <div className='page'>
        <div className='interactions'>
        <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>More</Button>
        <Search value={searchItem} onSubmit={this.onSearchSubmit} onChange={this.onSearchChange}>Search</Search>
        </div>
        {error ? <p>Something went wrong while trying to displaying the table data... please check back</p> :  <Table list={list} onDismiss={this.onDismiss}/>}
       
      </div>
    );
  }
 
}

const Table = ({list, pattern, onDismiss}) => 
      <div className='table'>
            {list.map( item => {
            const onHandleDismiss = () => onDismiss(item.objectID);
            return (
            <div key={item.objectID+''+Math.floor(Math.random() * 100000000)} className='table-row'>
            <span style={{width: '40%'}}><a href={item.url}> <br />{item.title}</a></span> <br />
            <span style={{width: '30%'}}>{item.author}</span>
            <span  style={{width: '10%'}}>{item.num_commers}</span>
            <span  style={{width: '10%'}}>{item.points}</span>
            <span  style={{width: '10%'}}>
              <Button onClick={onHandleDismiss} className="button-inline">Dismiss</Button>
            </span>
            </div>
            )
  })}
      </div>

const Search = ({value, onChange, onSubmit, children}) => 
      <div>
         <form onSubmit={onSubmit}>
          {children}
        <input type="text" value={value} 
         onChange={onChange} 
         />
         <button type='submit'>
          {children}
         </button>
       </form>
      </div>

const Button = ({onClick, className='', children}) => 
<button
   onClick={onClick}
   className={className}
   type="Button">{children}
</button>


export default App;
