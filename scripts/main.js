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
      filterText: '',
      topic: {}
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
  handleTopicSelection : function(topic) {
    this.setState({
      topic: topic
    });
  },
  render : function() {
    return (
      <div className="gm-web-portal">
        <div className="menu-container">
          <Header tagline="Academic Materials and Scholarly Research Pertaining to Genetic Modification" />
          <Topics 
            topics={this.state.topics}
            topic={this.state.topic}
            filterText={this.state.filterText}
            onUserClick={this.handleTopicSelection} />
          <SearchContainer
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
  Topics
  <Topics/>
*/

var Topics = React.createClass({
  render : function() {
    var topics = this.props.topics;
    var selectedTopic = this.props.topic;
    var handleTopicSelection = this.props.onUserClick;
    var topicBoxes = [];
    var topicDesc;
//<TopicDesc topic={topics} />

    (function changeTopic() {
      topicDesc = <TopicDesc topic={selectedTopic} />
    })()

    Object.keys(topics).map(function(key) {
      var thisTopic = topics[key];
      var thisKey = key;
      topicBoxes.push(<TopicBox key={thisKey} index={thisKey} details={thisTopic} onUserClick={handleTopicSelection} />);
    });
    return (
      <div className="topic-container">
        {topicBoxes}
      {/* take out topicBoxes and replace w/ topicContainer, which will contain topicBoxes */}
        {topicDesc}
      </div>
    )
  }
})

/*
  Topic Container
  <TopicContainer/>
  Contains topic box and info box that pops up below it
*/

// var TopicContainer = React.createClass({
//   onButtonClick : function() {

//   },
//   render : function() {
//     var details = this.props.details;
//           //{/*topicBoxes*/}
//     console.log(this.props.topics);
//     return (
//       <h4>TOPIC CONTAINER</h4>
//     );
//   }
// })

/*
  Topic Box
  <TopicBox/>
*/ 

var TopicBox = React.createClass({
  handleChange: function() {
    this.props.onUserClick(
      this.props.details
    );
  },
  render : function() {
    var details = this.props.details;
    return (
      <div style={{backgroundImage : "url(" + details.src + ")"}} className="topic-box" onClick={this.handleChange}>
        <p>{details.topic}</p>
      </div>
    )
  }
})

/*
  Top Desc
  <TopDesc />
*/

var TopicDesc = React.createClass({
  // onButtonClick : function() {

  // },
  render : function() {
    return (
      <div className="topic-desc">
        <h3 className="topic-desc-title">{this.props.topic.topic}</h3>
        <p>{this.props.topic.desc}</p>
      </div>
    )
  }
})

/* 
  Search Container
  <SearchContainer />
 */

var SearchContainer = React.createClass({
  render : function() {
    //var topics = this.props.topics;
    // var topicBoxes = [];

    // Object.keys(topics).map(function(key) {
    //   var thisTopic = topics[key];
    //   var thisKey = key;
    //   topicBoxes.push(<TopicBox key={thisKey} index={thisKey} details={thisTopic} />);
    // });
    return (
      <div className="search-container">
        <SearchInput
          filterText={this.props.filterText}
          onUserInput={this.props.onUserInput} />
      </div>
    )
  }
}) 

/*
  Search Radio
  <SearchRadio />
*/

// var Radio = React.createClass({
//   handleChange: function() {
//     // update state of radio selection



//     // this.props.onUserInput(
//     //   this.refs.filterTextInput.value
//     // );
//   },
//   render: function() {
//     return (
//       <form className="radio">
//         <p>Search Resources</p>
//         option
//         option
//         option

//         <input
//           className="search-input"
//           type="text"
//           placeholder="Search..."
//           value={this.props.filterText}
//           ref="filterTextInput"
//           onChange={this.handleChange}
//         />
//       </form>
//     );
//   }
// });

/*
  Radio Option
  <SearchRadio />
*/

// var Radio = React.createClass({
//   handleChange: function() {
//     // update state of radio selection

//     // this.props.onUserInput(
//     //   this.refs.filterTextInput.value
//     // );
//   },
//   render: function() {
//     return (
//       <input />
//     );
//   }
// });

/* 
  Checkbox
  <Checkbox />
*/


/*
  Search Input
  <SearchInput />
*/

var SearchInput = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },
  render: function() {
    return (
      <form className="search-form">
        <p>Search Resources</p>
        <input
          className="search-input"
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
    var hasImage = (details.link !== undefined ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    return (
      <li className={"menu-item " + details.type}>
        <div className={"menu-item-preview " + details.isExpanded}>
          <img className={"menu-item-preview-image " + hasImage} src={details.link} alt={details.title} />
        </div>
        <div className={"menu-item-info " + details.type}>
          <h3 className="menu-item-name">{details.title}</h3>
          <h4 className="menu-item-author">{details.author}</h4>
        </div>
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