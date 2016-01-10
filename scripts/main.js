var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
import Search from 'react-search';
var Router  = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;
var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers');

// Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://dazzling-heat-2731.firebaseio.com/');

/*
  App
*/

var App = React.createClass({
  getInitialState : function() {
    return {
      items : {},
      filterText: ''
    }
  },
  componentDidMount : function () {
    base.syncState('Articles', {
      context: this,
      state: 'items'
    });
  },
  handleUserInput : function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  filterItems : function() {

  },
  //renderItem : function(key){
    //return <Item key={key} index={key} details={this.state.items[key]} filterText={this.state.filterText}/>
  //},
  render : function() {
    return (
      <div className="gm-web-portal">
        <div className="menu">
          <Header tagline="Online Database of Academic Materials and Scholarly Research Pertaining to Genetic Modification" />
          {/*<Search items={ITEMS} keys={KEYS} searchKey={KEY} />*/}
          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput} />
          <ItemList
            items={this.state.items}
            filterText={this.state.filterText} />
          {/*<ul className="list-of-items">
             {Object.keys(this.state.items).map(this.renderItem)}
          </ul>*/}
        </div>  
      </div>
    )
  }
});

/*
  Item List
  <ItemList />
*/
var ItemList = React.createClass({
  render: function() {
    var rows = [];
    var used_keys = [];
    var items = this.props.items;
    var filter = this.props.filterText.toLowerCase();
    filter = filter.split(" ");
    console.log(filter);

    var checkFilter = function(obj, key) {
      Object.keys(obj).map(function(k) {
        var term = obj[k];
        if(typeof term == 'object' ) {
          checkFilter(term);
          return;
        } else if (typeof term == 'number') {
          return;
        } else if (term.toLowerCase().indexOf(filter) === -1) {
          return;
        } else {
          if(used_keys.indexOf(key) == -1 && key !== undefined) {
            used_keys.push(key);
            rows.push(<Item key={key} index={key} details={obj} />);
            return;
          }
        }
      });
    };

    Object.keys(items).map(function(key) {
      var thisItem = items[key];
      var thisKey = key;
      checkFilter(thisItem, thisKey);
      return;
    });

    return (
      <ul>
        {rows}
      </ul>
    );
  }
})

/*
  Item
  <Item />
*/
var Item = React.createClass({
  onButtonClick : function() {
    // expand button
    // console.log("Going to add the fish: ", this.props.index);
    // var key = this.props.index;
    // this.props.addToOrder(key);
  },
  render : function() {
    var details = this.props.details;
    // var applyFilter = function(obj, filter) {
    //   Object.keys(obj).map(function(j) {
    //     var thisObj = obj;
    //     console.log(thisObj)
    //     if(filter == '') {
    //       return thisObj.fitsSearchCriteria = true;
    //     }
    //     var term = obj[j];
    //     thisObj.fitsSearchCriteria = false;
    //     if(typeof term == 'object') {
    //       return applyFilter(term);
    //     } else if(term.toString().indexOf(filter) === -1) {
    //       console.log('doesnt contain filter text');
    //       return;
    //     } else {
    //       console.log('TEXT FOUND');
    //       thisObj.fitsSearchCriteria = true;
    //       console.log(term);
    //       console.log('true');
    //       return thisObj;
    //     }
    //   });
    // }
    // applyFilter(details, filter);

    var shouldDisplay = (details.fitsSearchCriteria === true ? true : false);
    var isImage = (details.type === 'image' ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    // {buttonText} in JSX
    //<button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
    return (
      <li className={"menu-item " + details.type + " " + details.fitsSearchCriteria}>
        <img src={details.link} alt={details.title} />
        <h3 className="menu-item-name">
          {details.author}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.description}</p>
      </li>
    )
  }
});


/*
  Search Bar
  <SearchBar />
*/

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },
  render: function() {
    return (
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
      </form>
    );
  }
});

/*
  Header
  <Header/>
*/

var Header = React.createClass({
  render : function() {
    return (
      <header className="top">
        <h1>GM Web Portal</h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3> 
      </header>
    )
  }
})

/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/*" component={App}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));



    // var search_terms = [];

    // var addToSearch = function(value) {
    //   if(typeof value == 'number') {
    //     return;
    //   } else if (search_terms.indexOf(value) > -1) {
    //     console.log('value repeated: ' + value);
    //   } else {
    //     search_terms.push(value);
    //   }
    // };

    // var checkObj = function(obj) {
    //   Object.keys(obj).map(function(j) {
    //     var term = obj[j];
    //     if(typeof term == 'object') {
    //       checkObj(term);
    //     } else {
    //       addToSearch(term);
    //     }
    //   });
    // };

    // let ITEMS = [];
    // let KEYS = [];
    // let KEY = 'title';

    // base.fetch('Articles', {
    //   context: this,
    //   asArray: true,
    //   then(data){
    //     ITEMS = data;
    //     console.log(ITEMS);
    //   }
    // });
