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
      order : {},
      filterText: ''
    }
  },
  componentDidMount : function () {
    base.syncState('Articles', {
      context: this,
      state: 'items'
    });
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  renderItem : function(key){
    return <Item key={key} index={key} details={this.state.items[key]} addToOrder={this.addToOrder}/>
  },
  render : function() {
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

    let ITEMS = [];
    let KEYS = [];
    let KEY = 'title';

    base.fetch('Articles', {
      context: this,
      asArray: true,
      then(data){
        ITEMS = data;
        console.log(ITEMS);
      }
    });
    
    return (
      <div className="gm-web-portal">
        <div className="menu">
          <Header tagline="Online Database of Academic Materials and Scholarly Research Pertaining to Genetic Modification" />
          {/*<Search items={ITEMS} keys={KEYS} searchKey={KEY} />*/}
          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
          />
          <itemList
            products={this.props.items}
            filterText={this.state.filterText}
          />
          <ul className="list-of-items">
            {Object.keys(this.state.items).map(this.renderItem)}
          </ul>
        </div>  
        {/*<Order fishes={this.state.fishes} order={this.state.order} />*/}
        {/*<Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>*/}
      </div>
    )
  }
});

/*
  Fish
  <Fish />
*/
var Item = React.createClass({
  onButtonClick : function() {
    // console.log("Going to add the fish: ", this.props.index);
    // var key = this.props.index;
    // this.props.addToOrder(key);
  }, 
  render : function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var isImage = (details.type === 'image' ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    // {buttonText} in JSX
    //<button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
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
  Search
  <Search/>
*/

/*
  Order
  <Order/>
*/
var Order = React.createClass({
  renderOrder : function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if(!fish) {
      return <li key={key}>Sorry, fish no longer available!</li>
    }

    return (
      <li>
        {count}lbs
        {fish.name}
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>)
  },
  render : function() {
    var orderIds = Object.keys(this.props.order);
    
    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      }

      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </ul>
      </div>
    )
  }
})

/*
  Inventory
  <Inventory/>
*/
var Inventory = React.createClass({
  render : function() {
    return (
      <div>
        <h2>Inventory</h2>

        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
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
