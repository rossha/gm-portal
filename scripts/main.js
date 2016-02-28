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
      images : [],
      articles : [],
      regions : [],
      //radioOptions : ['Apples','Bananas','Peaches','Pears'],
      dropdownOptions: {},
      topics : {},
      filterText: '',
      topic: {},
      region: ""
    }
  },
  componentDidMount : function () {
    base.syncState('Articles', {
      context: this,
      state: 'items',
      then() {
        var regions = this.state.regions;
        var images = this.state.images;
        var articles = this.state.articles;
        this.state.items.map(function(item) {
          if(item.type == "image") {
            images.push(item);
          } else {
            articles.push(item);
          }
        });
      }
    });
    base.syncState('Featured/topics', {
      context: this,
      state: 'topics',
      then() {
        //console.log(this.state.topics);
      }
    });
    base.syncState('Regions', {
      context: this,
      state: 'regions'
    });
  },
  handleUserInput : function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  handleRegionDropdown : function(region) {
    this.setState({
      region: region
    });
  },
  handleTopicSelection : function(topic) {
    this.setState({
      topic: topic
    });
  },
  // handleRadioSelection : function(option) {
  //   this.setState({
  //     topic: topic
  //   });
  // },
  handleShowAll : function() {
    this.setState({
      filterText: '',
      topic: {}
    });
  },
  render : function() {
    return (
      <div className="gm-web-portal">
        <div className="menu-container">
          <Header tagline="Academic Materials and Scholarly Research Pertaining to Genetic Modification"/>
          <Topics
            topics={this.state.topics}
            topic={this.state.topic}
            filterText={this.state.filterText}
            onUserClick={this.handleTopicSelection} />
          <SearchContainer
            region={this.state.region}
            regions={this.state.regions}
            showAll={this.handleShowAll}
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
            regionDropdown = {this.handleRegionDropdown} />
          <Items
            topic={this.state.topic}
            images={this.state.images}
            articles={this.state.articles}
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
        {topicDesc}
      </div>
    )
  }
})

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
      <div style={{background : "url(" + details.src + ") center no-repeat; background-size:100%"}} className="topic-box" onClick={this.handleChange}>
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
        <form className="search-form">
          <p>Search Resources</p>
          <Dropdown 
            region={this.props.region}
            regionDropdown={this.props.regionDropdown}
            options={this.props.regions}
            nullText="Select A Region..." />
          <SearchInput
            filterText={this.props.filterText}
            onUserInput={this.props.onUserInput} />
          <p className="search-show-all" onClick={this.props.showAll}>Clear Search Parameters</p> 
        </form>
      </div>
    )
  }
}) 

//*
//   Search Radio
//   <SearchRadio />
// */

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
//           onChange={this.handleChange} />
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
  Dropdown
  <Dropdown />
*/
var Dropdown = React.createClass({
  handleChange: function(event) {
    this.props.regionDropdown(
      event.target.value
    );
  },
  render: function() {
    return (
      <select value={this.props.region} onChange={this.handleChange}>
        <option key="none" value="">{this.props.nullText}</option>
        {this.props.options.map(function(obj) {
          var thisObj = obj;
          return <DropdownOption details={thisObj} key={thisObj.keyword} />
        })}
      </select>
    )
  }
});

/*
  Dropdown Option
  <DropdownOption />
*/
var DropdownOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.details.keyword}>{this.props.details.title}</option>
    )
  }
});


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
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={this.props.filterText}
        ref="filterTextInput"
        onChange={this.handleChange}/>
    );
  }
});

/*
  Items
  <Items />
*/
var Items = React.createClass({
  render: function() {
    var articleList = [];
    var imageList = [];
    var used_keys = [];
    var items = this.props.items;
    var images = this.props.images;
    var articles = this.props.articles;
    var topic = this.props.topic;
    var region = this.props.region;
    var filter = this.props.filterText.toLowerCase();
    filter = filter.split(" ");

    // selected

    var filtered = function(term) {
      for(var i=0;i<filter.length;i++){ 
        if(term.toLowerCase().indexOf(filter[i]) > -1){
          return false;
        } else {
          return true;
        }
      }
    }

    var inRegion = function(thisRegion) {
      region == thisRegion ? false : true;
    }

    var isOnTopic = function(term) {
      if(term.toLowerCase().indexOf(topic.key) > -1 || topic.key == undefined){
        return true;
      } else {
        return false;
      }
    }

    var filterItems = function(obj, key, type) {
      Object.keys(obj).map(function(k) {
        var term = obj[k];
        if(typeof term == 'object') {
          filterItems(term, key);
          return;
        } else if (typeof term == 'number') {
          return;
        } else if ( filtered(term) ) {
          return;
        } else if ( !isOnTopic(term) ) {
          return;
        } else {
          if(used_keys.indexOf(key) == -1 && key !== undefined) {
            used_keys.push(key);
            if(type == "article") {
              articleList.push(<Article key={key} index={key} details={articles[key]}/>);
            } else if(type == "image") {
              imageList.push(<Image key={key} index={key} details={images[key]}/>)
            }
            return;
          }
        }
      });
    };

    Object.keys(articles).map(function(key) {
      var thisItem = articles[key];
      if(region !== "" && inRegion(thisItem.region)){
        return;
      }
      var thisKey = key;
      filterItems(thisItem, thisKey, "article");
      return;
    });

    Object.keys(images).map(function(key) {
      var thisItem = images[key];
      var thisKey = key;
      filterItems(thisItem, thisKey, "image");
      return;
    });

    return (
      <div className="items-container">
        <div>
          <ImageList images={imageList}/>
        </div>
        <ul>
          {articleList}
        </ul>
      </div>
    );
  }
})

/*
  Article
  <Article />
*/

var Article = React.createClass({
  onButtonClick : function() {

  },
  render : function() {
    var details = this.props.details;
    var hasPDF = (details.link !== "" ? true : false);
    var hasURL = (details.url !== "" ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    return (
      <li className={"article " + details.type}>
        <span className="article-title"><a target="_blank" className={hasURL} href={details.url}>{details.title}</a></span>
        <span className={"article-title " + !hasURL}>{details.title}</span>
        
        <span className={"article-pdf " + hasPDF}><a target="_blank" href={details.link}>> View as PDF</a></span>
        <h4 className="menu-item-author">{details.author}</h4>
        <p>{details.description}</p>
      </li>
    )
  }
});

/* 
   Image List
  <ImageList />
 */

var ImageList = React.createClass({
  render : function() {
    return (
      <div className="image-container">
        {this.props.images}
      </div>
    )
  }
})

/*
  Image
  <Image />
*/

var Image = React.createClass({
  onButtonClick : function() {

  },
  render : function() {
    var details = this.props.details;
    var hasImage = (details.link !== undefined ? true : false);
    var isOpen = false;
    var buttonText = (isOpen ? 'Close!' : 'Open!'); 
    return (
      <img details={details} src={details.link} alt={details.title} />
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