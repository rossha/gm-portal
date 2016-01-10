var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
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
      topics : {},
      filterText: ''
    }
  },
  componentDidMount : function () {
    base.syncState('Articles', {
      context: this,
      state: 'items'
    });
    base.syncState('Featured/topics', {
      context: this,
      state: 'topics'
    });
  },
  handleUserInput : function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  render : function() {
    return (
      <div className="gm-web-portal">
        <div className="menu">
          <Header tagline="Academic Materials and Scholarly Research Pertaining to Genetic Modification" />
          <TopicHeader 
            topics={this.state.topics} />
          <SearchInput
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput} />
          <ItemList
            items={this.state.items}
            filterText={this.state.filterText} />
        </div>  
      </div>
    )
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
  Topic Header
  <TopicHeader/>
*/

var TopicHeader = React.createClass({
  render : function() {
    var topics = this.props.topics;
    var topicBoxes = [];

    Object.keys(topics).map(function(key) {
      var thisTopic = topics[key];
      var thisKey = key;
      topicBoxes.push(<TopicBox key={thisKey} index={thisKey} details={thisTopic} />);
    });
    return (
      <div className="topic-header">
        {topicBoxes}
      </div>
    )
  }
})

/*
  Topic Box
  <TopicBox/>
*/

var TopicBox = React.createClass({
  onButtonClick : function() {

  },
  render : function() {
    var details = this.props.details;
    return (
      <div className={"topic-box " + details.type}>
        <p>{details.topic}</p>
      </div>
    )
  }
})

/*
  Search Bar
  <SearchBar />
*/

var SearchInput = React.createClass({
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

    var filtered = function(term) {
      for(var i=0;i<filter.length;i++){ 
        if(term.toLowerCase().indexOf(filter[i]) > -1){
          return false;
        } else {
          return true;
        }
      }
    }

    var filterItems = function(obj, key) {
      Object.keys(obj).map(function(k) {
        var term = obj[k];
        if(typeof term == 'object') {
          filterItems(term, key);
          return;
        } else if (typeof term == 'number') {
          return;
        } else if ( filtered(term) ) {
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
      filterItems(thisItem, thisKey);
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

  },
  render : function() {
    var details = this.props.details;
    var isImage = (details.type === 'image' ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    return (
      <li className={"menu-item " + details.type}>
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
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/*" component={App}/>
  </Router>
)

ReactDOM.render(routes, document.querySelector('#main'));